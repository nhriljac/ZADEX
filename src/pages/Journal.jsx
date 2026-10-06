import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, SlidersHorizontal, BookHeart } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { PRODUCT_TYPES, productByName } from "../lib/data";
import { Chip, JournalCard, SearchInput, EmptyState } from "../components/ui";

const Group = ({ label, children }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
    {children}
  </div>
);

export default function Journal() {
  const { journal, toggleFavorite, positiveEffects, terpenes } = useZadex();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [effect, setEffect] = useState(null);
  const [terp, setTerp] = useState(null);
  const [favOnly, setFavOnly] = useState(false);
  const [buyAgainOnly, setBuyAgainOnly] = useState(false);

  const results = useMemo(() => {
    let list = journal || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => [e.product_name, e.brand, e.strain, e.notes, e.location].join(" ").toLowerCase().includes(q));
    }
    if (type) list = list.filter((e) => e.product_type === type);
    if (minRating) list = list.filter((e) => (e.rating || 0) >= minRating);
    if (effect) list = list.filter((e) => (e.effects || []).includes(effect));
    if (terp) list = list.filter((e) => productByName(e.product_name)?.terpenes.some((x) => x.id === terp));
    if (favOnly) list = list.filter((e) => e.favorite);
    if (buyAgainOnly) list = list.filter((e) => e.would_buy_again);
    return [...list].sort((a, b) => (b.entry_date || "").localeCompare(a.entry_date || ""));
  }, [journal, query, type, minRating, effect, terp, favOnly, buyAgainOnly]);

  const activeCount = [type, effect, terp].filter(Boolean).length + !!minRating + !!favOnly + !!buyAgainOnly;
  const reset = () => { setType(null); setMinRating(0); setEffect(null); setTerp(null); setFavOnly(false); setBuyAgainOnly(false); };

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Journal</h1>
          <p className="text-sm text-muted-foreground mt-1">{journal?.length || 0} entries — the foundation of Zadex.</p>
        </div>
        <Link to="/log" className="inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full accent-grad text-primary-foreground hover:opacity-90 transition-opacity shrink-0">
          <Plus size={16} /> Log a Product
        </Link>
      </div>

      <div className="flex gap-2">
        <div className="flex-1"><SearchInput value={query} onChange={setQuery} placeholder="Search your journal…" /></div>
        <button onClick={() => setShowFilters((v) => !v)} className="relative px-4 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors" aria-label="Filters">
          <SlidersHorizontal size={18} />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full accent-grad text-primary-foreground text-[10px] flex items-center justify-center font-medium">{activeCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="rounded-2xl card-elevated p-4 space-y-4 rise-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filters</h3>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>
          </div>
          <Group label="Product type">
            <div className="flex flex-wrap gap-2">
              <Chip label="All" active={!type} onClick={() => setType(null)} size="sm" />
              {PRODUCT_TYPES.map((v) => <Chip key={v} label={v} size="sm" active={type === v} onClick={() => setType(type === v ? null : v)} />)}
            </div>
          </Group>
          <Group label="Minimum rating">
            <div className="flex flex-wrap gap-2">
              {[0, 3, 4, 4.5].map((v) => <Chip key={v} label={v === 0 ? "Any" : `${v}★+`} size="sm" active={minRating === v} onClick={() => setMinRating(v)} />)}
            </div>
          </Group>
          <Group label="Effect">
            <div className="flex flex-wrap gap-2">
              <Chip label="Any" size="sm" active={!effect} onClick={() => setEffect(null)} />
              {positiveEffects.slice(0, 8).map((v) => <Chip key={v} label={v} size="sm" active={effect === v} onClick={() => setEffect(effect === v ? null : v)} />)}
            </div>
          </Group>
          <Group label="Terpene">
            <div className="flex flex-wrap gap-2">
              <Chip label="Any" size="sm" active={!terp} onClick={() => setTerp(null)} />
              {terpenes.slice(0, 6).map((x) => <Chip key={x.id} label={x.name} size="sm" active={terp === x.id} onClick={() => setTerp(terp === x.id ? null : x.id)} />)}
            </div>
          </Group>
          <Group label="Status">
            <div className="flex flex-wrap gap-2">
              <Chip label="Favorites" size="sm" active={favOnly} onClick={() => setFavOnly((v) => !v)} />
              <Chip label="Would buy again" size="sm" active={buyAgainOnly} onClick={() => setBuyAgainOnly((v) => !v)} />
            </div>
          </Group>
        </div>
      )}

      {results.length ? (
        <div className="space-y-3">{results.map((e) => <JournalCard key={e.id} entry={e} onToggleFavorite={toggleFavorite} />)}</div>
      ) : (
        <EmptyState
          title={journal?.length ? "No matches" : "Your journal is empty"}
          sub={journal?.length ? "Try adjusting your filters." : "Log your first product — Zadex starts learning instantly."}
          icon={<BookHeart size={26} />}
          action={journal?.length ? null : (
            <Link to="/log" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full accent-grad text-primary-foreground text-sm">
              <Plus size={15} /> Log a product
            </Link>
          )}
        />
      )}
    </div>
  );
}
