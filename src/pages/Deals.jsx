import { Link } from "react-router-dom";
import { MapPin, TrendingDown } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { ProductAvatar, SectionHeader, Notice, BRAND_SOFT } from "../components/ui";

function DealCard({ deal }) {
  const { productById, stores } = useZadex();
  const product = productById(deal.product_id);
  const store = stores.find((s) => s.id === deal.store_id);
  if (!product) return null;
  return (
    <div className="rounded-2xl card-elevated p-3">
      <Link to={`/product/${product.id}`} className="block">
        <ProductAvatar product={product} size="full" className="mb-3" />
        <div className="px-1">
          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.brand}</p>
        </div>
      </Link>
      <div className="px-1 mt-3 flex items-baseline gap-2">
        <span className="text-lg font-display font-semibold text-foreground">${deal.sale_price}</span>
        <span className="text-sm text-muted-foreground line-through">${deal.regular_price}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "hsl(142 30% 18%)", color: "hsl(142 40% 70%)" }}>-{deal.discount}%</span>
      </div>
      <div className="px-1 mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} /> {store?.name} · {store?.distance} mi</div>
      <div className="mx-1 mt-3 rounded-xl bg-muted/40 border border-border/60 p-3">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1" style={{ color: BRAND_SOFT }}>
          <TrendingDown size={12} /> Why Zadex recommends
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{deal.reason}</p>
      </div>
    </div>
  );
}

export default function Deals() {
  const { deals, stores } = useZadex();
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Deals Near You</h1>
        <p className="text-sm text-muted-foreground mt-1">Demo deals — prototype only, no transactions.</p>
      </div>
      <Notice>
        These are fictional demo deals. The data model (Store, Product, Inventory, Deal) is designed so real local inventory and pricing APIs can be connected later — not hard-coded to a single provider.
      </Notice>
      <div>
        <SectionHeader title="Nearby stores" />
        <div className="flex flex-col gap-2 mt-3">
          {stores.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-2xl card-elevated p-4">
              <div>
                <div className="font-medium text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.address} · {s.location}</div>
              </div>
              <span className="text-sm text-muted-foreground">{s.distance} mi</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionHeader title="Recommended deals" sub="Each with a Zadex reason." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">{deals.map((d) => <DealCard key={d.id} deal={d} />)}</div>
      </div>
    </div>
  );
}
