import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FlaskConical, Sparkles, Heart, Notebook } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { terpeneById } from "../lib/data";
import { similarProfiles } from "../lib/engine";
import { ProductAvatar, TerpeneBars, TerpeneCard, RecCard, StarRating, BRAND_SOFT } from "../components/ui";

const TABS = [
  { id: "profile", label: "Terpene Profile" },
  { id: "analysis", label: "Zadex Analysis" },
  { id: "history", label: "Your History" },
];

const Pill = ({ children }) => <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{children}</span>;

export default function Product() {
  const { id } = useParams();
  const { productById, journal, profile } = useZadex();
  const product = productById(id);
  const [tab, setTab] = useState("profile");

  const history = useMemo(
    () => (journal || []).filter((e) => e.product_name?.toLowerCase() === product?.name?.toLowerCase()),
    [journal, product]
  );
  const similar = useMemo(() => (product ? similarProfiles(product.id, 4) : []), [product]);
  const likedSimilar = useMemo(() => {
    const favs = profile.favorites || [];
    return similar.filter((s) => favs.some((f) => f.toLowerCase() === s.product.name.toLowerCase()));
  }, [similar, profile]);

  if (!product) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Product not found. <Link to="/discover" style={{ color: BRAND_SOFT }}>Browse</Link>
      </div>
    );
  }

  const sharedFavTerps = profile.topTerpenes.filter((x) => product.terpenes.some((y) => y.id === x.key && x.score > 0)).length;

  return (
    <div className="space-y-6 fade-in pb-12">
      <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={18} /> Discover
      </Link>

      <div className="flex gap-4 items-center">
        <ProductAvatar product={product} size="lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-display font-semibold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Pill>{product.product_type}</Pill><Pill>{product.strain}</Pill><Pill>THC {product.thc}%</Pill>
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground/85 leading-relaxed">{product.description}</p>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t.id ? "border-accent-foreground text-accent-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-5 rise-in">
          <div className="rounded-2xl card-elevated p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4"><FlaskConical size={14} /> Terpene profile</div>
            <TerpeneBars product={product} />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Breakdown</h3>
            <Link to={`/analyze/${product.id}`} className="text-sm" style={{ color: BRAND_SOFT }}>Open analyzer →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {product.terpenes.map((x) => <TerpeneCard key={x.id} terpene={x.id} percentage={x.pct} compact />)}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Commonly associated effects</div>
            <div className="flex flex-wrap gap-2">
              {product.effects.map((e) => <span key={e} className="text-sm px-3 py-1.5 rounded-full bg-accent/30 text-accent-foreground">{e}</span>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["Flavor", product.flavor], ["Aroma", product.aroma]].map(([label, items]) => (
              <div key={label}>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(items || []).map((v) => <span key={v} className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-foreground/85">{v}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "analysis" && (
        <div className="space-y-5 rise-in">
          <div className="rounded-2xl card-elevated p-5">
            <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(142 40% 70%)" }}>
              <Sparkles size={16} /><span className="font-medium uppercase tracking-wider text-xs">Why this may work for you</span>
            </div>
            <p className="mt-3 text-foreground/90 leading-relaxed">
              {sharedFavTerps > 0
                ? `You've previously rated ${sharedFavTerps + 2} products with similar terpene profiles highly. ${terpeneById(product.terpenes[0]?.id)?.name} is among your favorite terpenes.`
                : "You haven't logged enough similar products yet — try it and add it to your history."}
            </p>
          </div>
          {likedSimilar.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3"><Heart size={14} /> Similar products you've liked</div>
              <div className="flex flex-wrap gap-2">
                {likedSimilar.map((s) => (
                  <Link key={s.product.id} to={`/product/${s.product.id}`} className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 hover:bg-muted transition-colors">
                    <ProductAvatar product={s.product} size="sm" className="!h-8 !w-8 !text-sm" />
                    <span className="text-sm">{s.product.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><FlaskConical size={14} /> Similar terpene profiles</div>
              <Link to={`/match/${product.id}`} className="text-sm" style={{ color: BRAND_SOFT }}>Find similar →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {similar.map((s) => <RecCard key={s.product.id} rec={s} compact />)}
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-4 rise-in">
          {history.length ? history.map((e) => (
            <Link key={e.id} to={`/journal/${e.id}`} className="block rounded-2xl card-elevated p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/90">{e.entry_date}</span>
                <StarRating value={e.rating} size={14} />
              </div>
              {e.notes && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.notes}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(e.effects || []).slice(0, 4).map((f) => <span key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{f}</span>)}
              </div>
            </Link>
          )) : (
            <div className="rounded-2xl card-elevated p-6 text-center">
              <Notebook size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">You haven't logged this product yet.</p>
              <Link to="/log" className="inline-block mt-3 text-sm" style={{ color: BRAND_SOFT }}>Log it now →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
