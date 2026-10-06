import { useMemo, useState } from "react";
import { useZadex } from "../lib/ZadexContext";
import { PRODUCTS } from "../lib/data";
import { RecCard, ProductCard, SectionHeader, SearchInput } from "../components/ui";

const EFFECTS = ["Relaxed", "Happy", "Creative", "Energetic", "Focused", "Sleepy", "Social"];
const TYPES = ["Flower", "Vape", "Edible", "Pre-roll", "Concentrate", "Beverage"];

export default function Discover() {
  const { recommendations, profile, journal, terpenes } = useZadex();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(null);

  const tried = useMemo(
    () => new Set(journal.map((e) => PRODUCTS.find((p) => p.name === e.product_name)?.id).filter(Boolean)),
    [journal]
  );
  const similar = useMemo(() => recommendations.filter((r) => r.similarity != null).slice(0, 4), [recommendations]);
  const newToYou = useMemo(() => {
    const topTerp = profile.topTerpenes.slice(0, 1).map((x) => x.key);
    return PRODUCTS.filter((p) => !tried.has(p.id)).filter((p) => !topTerp.includes(p.terpenes[0]?.id)).slice(0, 4);
  }, [tried, profile]);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (filter?.kind === "effect") list = list.filter((p) => p.effects.includes(filter.value));
    if (filter?.kind === "terpene") list = list.filter((p) => p.terpenes.some((x) => x.id === filter.value));
    if (filter?.kind === "type") list = list.filter((p) => p.product_type === filter.value);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name + p.brand + p.strain).toLowerCase().includes(q));
    }
    return list;
  }, [filter, query]);

  const searching = query.trim().length > 0;
  const chip = (kind, value, label) => (
    <button
      key={value}
      onClick={() => setFilter({ kind, value, label: label || value })}
      className={`chip ${filter?.kind === kind && filter.value === value ? "chip-active" : ""}`}
    >
      {label || value}
    </button>
  );

  const Results = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader title={searching && !filter ? `Results for "${query}"` : filter?.label} sub={`${filtered.length} products`} />
        <button onClick={() => { setFilter(null); setQuery(""); }} className="text-sm text-muted-foreground hover:text-foreground">Clear</button>
      </div>
      <div className="grid grid-cols-2 gap-3">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </div>
  );

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground mt-1">Find your next favorite, with the why.</p>
      </div>
      <SearchInput value={query} onChange={setQuery} placeholder="Search the catalog…" />

      {searching ? Results : (
        <>
          <div className="space-y-4">
            <SectionHeader title="Recommended For You" />
            {recommendations.length ? (
              <div className="grid grid-cols-2 gap-3">{recommendations.slice(0, 4).map((r) => <RecCard key={r.product.id} rec={r} />)}</div>
            ) : <p className="text-sm text-muted-foreground">Log a few products to unlock personalized picks.</p>}
          </div>

          <div className="space-y-4">
            <SectionHeader title="Similar To Your Favorites" />
            {similar.length ? (
              <div className="grid grid-cols-2 gap-3">{similar.map((r) => <RecCard key={r.product.id} rec={r} />)}</div>
            ) : <p className="text-sm text-muted-foreground">Mark a few favorites to see close matches.</p>}
          </div>

          <div className="space-y-4">
            <SectionHeader title="New To You" sub="Fresh terpene combinations to explore." />
            <div className="grid grid-cols-2 gap-3">{newToYou.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>

          <div className="space-y-4">
            <SectionHeader title="Explore By Effect" />
            <div className="flex flex-wrap gap-2">{EFFECTS.map((e) => chip("effect", e))}</div>
          </div>
          <div className="space-y-4">
            <SectionHeader title="Explore By Terpene" />
            <div className="flex flex-wrap gap-2">{terpenes.slice(0, 6).map((x) => chip("terpene", x.id, x.name))}</div>
          </div>
          <div className="space-y-4">
            <SectionHeader title="Explore By Product Type" />
            <div className="flex flex-wrap gap-2">{TYPES.map((t) => chip("type", t))}</div>
          </div>

          {filter && Results}
        </>
      )}
    </div>
  );
}
