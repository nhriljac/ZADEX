import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { PRODUCTS } from "../lib/data";
import { ProductAvatar, SearchInput, TerpeneBars, TerpeneCard, Notice } from "../components/ui";

export default function Analyzer() {
  const { id } = useParams();
  const { productById } = useZadex();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(id || "blue-dream");
  useEffect(() => { if (id) setSelected(id); }, [id]);
  const product = productById(selected) || PRODUCTS[0];

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter((p) => (p.name + p.brand + p.strain).toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  return (
    <div className="space-y-6 fade-in">
      <Link to="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /> Back</Link>
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Terpene Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-1">Understand what's behind the experience.</p>
      </div>
      <SearchInput value={query} onChange={setQuery} placeholder="Search a product to analyze…" />
      {matches.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {matches.map((p) => (
            <button key={p.id} onClick={() => { setSelected(p.id); setQuery(""); }} className="flex items-center gap-3 rounded-2xl card-elevated p-3 hover:border-accent-foreground/30 transition-all text-left">
              <ProductAvatar product={p} size="sm" />
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.brand} · {p.product_type}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="rounded-3xl card-elevated p-5">
        <div className="flex gap-4 items-center mb-5">
          <ProductAvatar product={product} size="lg" />
          <div>
            <h2 className="text-xl font-display font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{product.brand} · {product.strain}</p>
            <p className="text-xs text-muted-foreground mt-1">THC {product.thc}% · CBD {product.cbd}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-4"><FlaskConical size={14} /> Terpene profile</div>
        <TerpeneBars product={product} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Terpene breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.terpenes.map((x) => <TerpeneCard key={x.id} terpene={x.id} percentage={x.pct} />)}
        </div>
      </div>

      <Notice>
        Educational information only. Terpene descriptions reflect commonly associated characteristics and user-reported experiences — not medical claims. Effects vary by individual.
      </Notice>
    </div>
  );
}
