import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useZadex } from "../lib/ZadexContext";
import { TERPENES, POSITIVE_EFFECTS } from "../lib/data";
import { ProductAvatar, SearchInput } from "../components/ui";

const Group = ({ title, children }) => (
  <div>
    <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
    {children}
  </div>
);

export default function Search() {
  const { products } = useZadex();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const r = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return {
      products: products.filter((p) => (p.name + p.brand + p.strain).toLowerCase().includes(q)),
      terpenes: TERPENES.filter((t) => t.name.toLowerCase().includes(q) || t.aromas.some((a) => a.toLowerCase().includes(q))),
      effects: POSITIVE_EFFECTS.filter((e) => e.toLowerCase().includes(q)),
      brands: [...new Set(products.map((p) => p.brand))].filter((b) => b.toLowerCase().includes(q)),
    };
  }, [query, products]);

  const empty = r && !r.products.length && !r.terpenes.length && !r.effects.length && !r.brands.length;

  return (
    <div className="space-y-5 fade-in">
      <h1 className="text-2xl font-display font-semibold tracking-tight">Search</h1>
      <SearchInput autoFocus value={query} onChange={setQuery} placeholder="Products, strains, brands, terpenes, effects…" />
      {empty && <p className="text-sm text-muted-foreground py-8 text-center">No results for "{query}"</p>}
      {r && (
        <div className="space-y-6">
          {r.products.length > 0 && (
            <Group title="Products">
              <div className="space-y-2">
                {r.products.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 rounded-2xl card-elevated p-3 hover:border-accent-foreground/30 transition-all">
                    <ProductAvatar product={p} size="sm" />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.brand} · {p.product_type}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Group>
          )}
          {r.terpenes.length > 0 && (
            <Group title="Terpenes">
              <div className="flex flex-wrap gap-2">
                {r.terpenes.map((t) => (
                  <button key={t.id} onClick={() => navigate("/discover")} className="flex items-center gap-2 rounded-xl card-elevated p-2.5 hover:border-accent-foreground/30 transition-all">
                    <span className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold" style={{ background: t.color }}>{t.name.charAt(0)}</span>
                    <span className="text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            </Group>
          )}
          {r.effects.length > 0 && (
            <Group title="Effects">
              <div className="flex flex-wrap gap-2">{r.effects.map((e) => <Link key={e} to="/discover" className="chip">{e}</Link>)}</div>
            </Group>
          )}
          {r.brands.length > 0 && (
            <Group title="Brands">
              <div className="flex flex-wrap gap-2">{r.brands.map((b) => <span key={b} className="chip">{b}</span>)}</div>
            </Group>
          )}
        </div>
      )}
    </div>
  );
}
