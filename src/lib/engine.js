// The Zadex "intelligence": taste profile, recommendations, insights, and the
// assistant's answers. All of it runs locally from the journal — no server needed.
import { PRODUCTS, terpeneById, productById, productByName } from "./data";
import { USER } from "../config";

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const round = (n, d = 0) => { const m = 10 ** d; return Math.round(n * m) / m; };

function terpeneVector(product) {
  if (!product || !product.terpenes) return {};
  const v = {};
  for (const x of product.terpenes) v[x.id] = (v[x.id] || 0) + x.pct;
  return v;
}

function cosine(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, na = 0, nb = 0;
  for (const k of keys) { dot += (a[k] || 0) * (b[k] || 0); na += (a[k] || 0) ** 2; nb += (b[k] || 0) ** 2; }
  return na === 0 || nb === 0 ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
}

const catalogMatch = (entry) => productByName(entry.product_name) || null;

// Ratings of 4+ count positively, below 4 count negatively.
function ratingWeight(entry) {
  const r = entry.rating || 0;
  if (r <= 0) return 0;
  return r >= 4 ? (r - 3) / 2 : (r - 4) / 5;
}

export function buildProfile(journal) {
  const all = journal || [];
  const rated = all.filter((e) => (e.rating || 0) > 0);
  const liked = all.filter((e) => (e.rating || 0) >= 4);
  const disliked = all.filter((e) => (e.rating || 0) > 0 && (e.rating || 0) < 3);

  const effects = {}, terps = {}, brands = {}, types = {}, flavors = {};
  for (const e of rated) {
    const w = ratingWeight(e);
    const p = catalogMatch(e);
    for (const f of e.effects || []) effects[f] = (effects[f] || 0) + w;
    for (const f of e.negative_effects || []) effects[f] = (effects[f] || 0) - 0.5;
    if (p) {
      for (const x of p.terpenes) terps[x.id] = (terps[x.id] || 0) + w * (x.pct / 100);
      brands[p.brand] = (brands[p.brand] || 0) + w;
      types[p.product_type] = (types[p.product_type] || 0) + w;
      for (const f of p.flavor || []) flavors[f] = (flavors[f] || 0) + w;
    }
  }

  const top = (obj, n = 5) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key, score]) => ({ key, score: round(score, 2) }))
      .filter((x) => x.score !== 0);

  const prices = rated.map((e) => e.price).filter((p) => p > 0);
  return {
    productsTried: new Set(all.map((e) => e.product_name?.toLowerCase())).size,
    productsRated: rated.length,
    favoritesCount: liked.length,
    journalCount: all.length,
    topEffects: top(effects),
    topTerpenes: top(terps),
    topBrands: top(brands, 4),
    topTypes: top(types, 4),
    topFlavors: top(flavors, 5),
    leastEffects: disliked.flatMap((e) => e.negative_effects || []),
    favorites: liked.map((e) => e.product_name).filter(Boolean),
    buyAgain: all.filter((e) => e.would_buy_again).map((e) => e.product_name),
    priceRange: prices.length
      ? { min: Math.min(...prices), avg: round(sum(prices) / prices.length, 1), max: Math.max(...prices) }
      : null,
  };
}

const triedIds = (journal) => new Set(journal.map((e) => productByName(e.product_name)?.id).filter(Boolean));

export function recommend(journal, limit = 6) {
  const profile = buildProfile(journal);
  const tried = triedIds(journal || []);
  const favTerps = profile.topTerpenes.map((x) => x.key);
  const likedProducts = (journal || []).filter((e) => (e.rating || 0) >= 4).map(catalogMatch).filter(Boolean);
  const likedVectors = likedProducts.map(terpeneVector);
  const out = [];

  for (const p of PRODUCTS) {
    if (tried.has(p.id)) continue;
    let score = 0;
    const reasons = [];

    if (likedVectors.length) {
      const v = terpeneVector(p);
      const sims = likedVectors.map((lv) => cosine(v, lv));
      const best = Math.max(...sims);
      const closest = likedProducts[sims.indexOf(best)];
      if (best > 0.85) { score += 38; reasons.push(`Very similar terpene profile to ${closest.name} (${Math.round(best * 100)}% match).`); }
      else if (best > 0.6) { score += 24; reasons.push(`Similar terpene profile to ${closest.name}.`); }
      else if (best > 0.4) score += 10;

      const dominant = p.terpenes[0];
      if (favTerps.includes(dominant.id)) {
        score += 12;
        reasons.push(`Its dominant terpene is ${terpeneById(dominant.id).name}, one you consistently rate highly.`);
      }
    }

    const sharedEffects = p.effects.filter((f) => profile.topEffects.some((x) => x.key === f && x.score > 0));
    if (sharedEffects.length >= 2) { score += 16; reasons.push(`Shares ${sharedEffects.slice(0, 3).join(", ").toLowerCase()} — effects you enjoy.`); }
    else if (sharedEffects.length === 1) score += 6;

    if (profile.topBrands.some((x) => x.key === p.brand && x.score > 0)) { score += 8; reasons.push(`From ${p.brand}, a brand you've enjoyed before.`); }
    if (profile.topTypes.some((x) => x.key === p.product_type && x.score > 0)) score += 5;
    if ((p.effects || []).filter((f) => (profile.leastEffects || []).includes(f)).length) score -= 15;

    if (score > 6) {
      out.push({
        product: p,
        score: round(score, 1),
        similarity: likedVectors.length ? Math.round(Math.max(...likedVectors.map((lv) => cosine(terpeneVector(p), lv))) * 100) : null,
        reason: reasons.slice(0, 2).join(" "),
      });
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function similarProfiles(productId, limit = 6) {
  const base = productById(productId);
  if (!base) return [];
  const bv = terpeneVector(base);
  return PRODUCTS.filter((p) => p.id !== productId)
    .map((p) => {
      const sim = cosine(bv, terpeneVector(p));
      const dominants = [base.terpenes[0], p.terpenes[0]].map((x) => terpeneById(x.id)?.name).filter(Boolean);
      const shared = base.terpenes.slice(0, 2).map((x) => terpeneById(x.id)?.name)
        .filter((name) => p.terpenes.some((y) => terpeneById(y.id)?.name === name));
      const reason = shared.length
        ? `Similar because of ${shared.join(" + ").toLowerCase()} dominance.`
        : `Related ${dominants.join(" / ")} profile.`;
      return { product: p, similarity: Math.round(sim * 100), reason };
    })
    .filter((x) => x.similarity >= 40)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function generateInsights(journal) {
  const profile = buildProfile(journal);
  const out = [];
  if (profile.topTerpenes.length) {
    const top = profile.topTerpenes[0];
    const terp = terpeneById(top.key);
    if (terp && top.score > 0) {
      out.push(`You've rated products with higher ${terp.name.toLowerCase()} concentrations above average — you appear to enjoy ${terp.aromas[0].toLowerCase()}-forward profiles.`);
    }
  }
  if (profile.topEffects.length) {
    const pos = profile.topEffects.filter((x) => x.score > 0).map((x) => x.key);
    if (pos.length >= 2) out.push(`You frequently rate ${pos.slice(0, 3).join(", ").toLowerCase()} products highly.`);
  }
  const day = ["Uplifted", "Energetic", "Focused", "Creative"];
  const night = ["Relaxed", "Sleepy", "Calm"];
  const dayCount = (journal || []).filter((e) => (e.effects || []).some((f) => day.includes(f))).length;
  const nightCount = (journal || []).filter((e) => (e.effects || []).some((f) => night.includes(f))).length;
  if (dayCount >= 2 && nightCount >= 2) out.push("You tend to prefer uplifting products during the day and relaxing products at night.");
  if (profile.priceRange) out.push(`Your average spend is around $${profile.priceRange.avg}, usually between $${profile.priceRange.min}–$${profile.priceRange.max}.`);
  if (profile.leastEffects.length) {
    const uniq = [...new Set(profile.leastEffects)];
    out.push(`You've flagged ${uniq.slice(0, 2).join(" and ").toLowerCase()} as negative effects — Zadex will weigh that against future recommendations.`);
  }
  if (!out.length) out.push("Log a few products and Zadex will start finding patterns in what you like.");
  return out;
}

// The "Zadex learned" summary shown after saving an entry.
export function summarizeEntry(entry, journal) {
  const p = catalogMatch(entry);
  const profile = buildProfile(journal);
  const parts = [];
  if ((entry.rating || 0) >= 4) {
    const fx = (entry.effects || []).slice(0, 2).join(", ").toLowerCase();
    parts.push(`You enjoyed ${entry.product_name}${p ? ` (${p.brand})` : ""} primarily for its ${fx || "overall"} effects.`);
  } else if ((entry.rating || 0) > 0 && entry.rating < 3) {
    parts.push(`You didn't love ${entry.product_name}. Zadex noted the negative effects and will avoid similar profiles.`);
  } else {
    parts.push(`You logged ${entry.product_name} — added to your taste profile.`);
  }
  if (p && profile.topTerpenes.length) {
    const dom = p.terpenes.slice(0, 1).map((x) => terpeneById(x.id)?.name).filter(Boolean);
    if (dom.length && profile.topTerpenes.some((x) => p.terpenes.find((y) => y.id === x.key))) {
      parts.push(`This reinforces your preference for ${dom[0].toLowerCase()}-forward products.`);
    } else {
      parts.push("This adds a new data point to your preferences.");
    }
  }
  const fx = entry.effects || [];
  if (fx.includes("Uplifted") || fx.includes("Energetic")) parts.push("A positive data point for your daytime preferences.");
  if (fx.includes("Relaxed") || fx.includes("Sleepy")) parts.push("Aligns with your relaxing, evening-leaning history.");
  return parts.join(" ");
}

// Rule-based assistant that answers from the user's real journal.
export function assistantReply(question, journal) {
  const q = (question || "").toLowerCase();
  const profile = buildProfile(journal);
  const entries = journal || [];
  const find = (name) => entries.filter((e) => e.product_name?.toLowerCase().includes(name));

  if (q.includes("terpene") && (q.includes("favorite") || q.includes("prefer") || q.includes("my"))) {
    if (!profile.topTerpenes.length) return "Log a few products and I'll map your favorite terpenes.";
    const names = profile.topTerpenes.slice(0, 3).map((x) => terpeneById(x.key)?.name).filter(Boolean);
    return `Based on your logged history, your favorite terpenes appear to be ${names.join(", ")}. You consistently rate products higher in ${names[0]?.toLowerCase()} above average.`;
  }

  if (q.includes("dislike") || q.includes("avoid") || q.includes("didn't like") || q.includes("did not like")) {
    const low = entries.filter((e) => (e.rating || 0) > 0 && e.rating < 3);
    if (!low.length) return "You haven't logged any products below 3 stars yet, so there's nothing to avoid so far.";
    const names = low.map((e) => e.product_name).slice(0, 4);
    const neg = [...new Set(low.flatMap((e) => e.negative_effects || []))].slice(0, 2);
    return `You've rated ${names.join(", ")} below 3 stars${neg.length ? `, flagging ${neg.join(" and ").toLowerCase()}` : ""}. I'll weigh those against future recommendations.`;
  }

  const why = q.match(/why.*like (.+)/);
  if (why) {
    const name = why[1].replace(/[?.]/g, "").trim();
    const hits = find(name);
    if (!hits.length) return `I couldn't find a journal entry for "${name}". Try logging it and I can tell you why you liked it.`;
    const e = hits[0];
    const p = catalogMatch(e);
    const fx = (e.effects || []).slice(0, 3);
    const terps = p ? p.terpenes.slice(0, 2).map((x) => terpeneById(x.id)?.name).filter(Boolean) : [];
    return `You rated ${e.product_name} ${e.rating}/5. You logged ${fx.join(", ").toLowerCase()} as the main effects${terps.length ? `, and its profile is ${terps.join(" + ").toLowerCase()}-dominant` : ""}. That pattern matches several of your other favorites, which is likely why it worked for you.`;
  }

  if (q.includes("try next") || q.includes("recommend") || q.includes("suggest") || q.includes("next")) {
    const recs = recommend(journal, 3);
    if (!recs.length) return "Log a couple of products first and I'll have personalized picks ready.";
    return `Based on your history, I'd try ${recs[0].product.name} next. ${recs[0].reason} Other strong options: ${recs.slice(1).map((r) => r.product.name).join(" and ")}.`;
  }

  if (q.includes("similar") && q.includes("favorite")) {
    const recs = recommend(journal, 4);
    if (!recs.length) return "Once you log a few favorites, I can surface products with similar terpene profiles.";
    return `Closest to your favorites: ${recs.map((r) => `${r.product.name} (${r.similarity ? r.similarity + "% match" : "good match"})`).join(", ")}.`;
  }

  if (q.includes("how many") || q.includes("stats") || q.includes("history")) {
    return `You've logged ${profile.journalCount} entries, rated ${profile.productsRated} products, and marked ${profile.favoritesCount} as favorites (4★+).`;
  }

  if (q.includes("effect")) {
    return profile.topEffects.length
      ? `Your most-enjoyed effects are ${profile.topEffects.filter((x) => x.score > 0).map((x) => x.key).slice(0, 4).join(", ").toLowerCase()}.`
      : "Log a few products with effect chips and I'll map your preferences.";
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.length < 5) {
    return `Hi ${USER.name} — I've reviewed your ${profile.journalCount} journal entries. Ask me what to try next, why you liked a product, or what your favorite terpenes are.`;
  }

  const topT = profile.topTerpenes.slice(0, 2).map((x) => terpeneById(x.key)?.name).join(" and ");
  return `Here's what your logged history shows: you've tried ${profile.productsTried} products, favoriting ${profile.favoritesCount} of them. Your top terpenes are ${topT || "still being learned"}. Ask me to recommend something, or why you liked a specific product.`;
}
