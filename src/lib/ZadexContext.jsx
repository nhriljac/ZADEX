import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  PRODUCTS, TERPENES, STORES, DEALS, PRODUCT_TYPES, POSITIVE_EFFECTS, NEGATIVE_EFFECTS,
  productById, productByName, terpeneById,
} from "./data";
import { buildProfile, generateInsights, recommend, similarProfiles, summarizeEntry, assistantReply } from "./engine";
import { journalStore } from "./storage";
import { SEED_JOURNAL } from "./seed";
import { SEED_DEMO_JOURNAL } from "../config";

const ONBOARDED_KEY = "zadex_onboarded_v1";
const PREFS_KEY = "zadex_prefs_v1";

const ZadexContext = createContext(null);

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

function buildSeed() {
  const out = [];
  for (const e of SEED_JOURNAL) out.push({ ...e, ai_summary: summarizeEntry(e, out), terpene_tags: [] });
  return out;
}

export function ZadexProvider({ children }) {
  const [journal, setJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState(() => { try { return JSON.parse(safeGet(PREFS_KEY) || "{}"); } catch { return {}; } });
  const [onboarded, setOnboarded] = useState(() => safeGet(ONBOARDED_KEY) === "1");

  const savePrefs = useCallback((patch) => {
    setPrefs((prev) => { const next = { ...prev, ...patch }; safeSet(PREFS_KEY, JSON.stringify(next)); return next; });
  }, []);

  const completeOnboarding = useCallback((p) => {
    safeSet(ONBOARDED_KEY, "1");
    if (p) savePrefs(p);
    setOnboarded(true);
  }, [savePrefs]);

  const resetOnboarding = useCallback(() => {
    try { localStorage.removeItem(ONBOARDED_KEY); } catch { /* ignore */ }
    setOnboarded(false);
  }, []);

  const reload = useCallback(async () => {
    try {
      let entries = await journalStore.list();
      if (entries === null) entries = SEED_DEMO_JOURNAL ? await journalStore.bulkCreate(buildSeed()) : [];
      setJournal(entries);
    } catch (e) {
      console.error("journal load failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addEntry = useCallback(async (data) => {
    const entry = {
      ...data,
      ai_summary: summarizeEntry(data, journal),
      terpene_tags: productByName(data.product_name)?.terpenes.map((x) => x.id) || [],
    };
    const created = await journalStore.create(entry);
    setJournal((prev) => [created, ...prev]);
    return created;
  }, [journal]);

  const updateEntry = useCallback(async (id, patch) => {
    const updated = await journalStore.update(id, patch);
    setJournal((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const deleteEntry = useCallback(async (id) => {
    await journalStore.remove(id);
    setJournal((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleFavorite = useCallback(async (id) => {
    const e = journal.find((x) => x.id === id);
    if (e) await updateEntry(id, { favorite: !e.favorite });
  }, [journal, updateEntry]);

  const profile = useMemo(() => buildProfile(journal), [journal]);
  const insights = useMemo(() => generateInsights(journal), [journal]);
  const recommendations = useMemo(() => recommend(journal, 6), [journal]);

  const value = useMemo(() => ({
    products: PRODUCTS, terpenes: TERPENES, stores: STORES, deals: DEALS,
    productTypes: PRODUCT_TYPES, positiveEffects: POSITIVE_EFFECTS, negativeEffects: NEGATIVE_EFFECTS,
    productById, productByName, terpeneById,
    journal, loading, addEntry, updateEntry, deleteEntry, toggleFavorite, reload,
    profile, insights, recommendations,
    recommendForUser: recommend, similarProfiles, generateInsights, aiRespond: assistantReply,
    onboarded, completeOnboarding, resetOnboarding, prefs, savePrefs,
  }), [journal, loading, profile, insights, recommendations, onboarded, prefs,
    addEntry, updateEntry, deleteEntry, toggleFavorite, reload, completeOnboarding, resetOnboarding, savePrefs]);

  return <ZadexContext.Provider value={value}>{children}</ZadexContext.Provider>;
}

export function useZadex() {
  const ctx = useContext(ZadexContext);
  if (!ctx) throw new Error("useZadex must be used within ZadexProvider");
  return ctx;
}
