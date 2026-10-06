import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { similarProfiles } from "../lib/engine";
import { ProductAvatar, RecCard, BRAND_SOFT } from "../components/ui";

export default function Match() {
  const { id } = useParams();
  const { productById, terpeneById } = useZadex();
  const product = productById(id);
  const matches = product ? similarProfiles(product.id, 8) : [];

  if (!product) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Product not found. <Link to="/discover" style={{ color: BRAND_SOFT }}>Browse</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <Link to={`/product/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={18} /> Back to product</Link>
      <div className="rounded-3xl card-elevated p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">Find similar terpene profiles</div>
        <div className="flex items-center gap-4">
          <ProductAvatar product={product} size="lg" />
          <div>
            <h1 className="text-xl font-display font-semibold">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product.terpenes.slice(0, 3).map((x) => (
                <span key={x.id} className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">{terpeneById(x.id)?.name} {x.pct}%</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Matching products ({matches.length})</h3>
        {matches.length ? (
          <div className="grid grid-cols-2 gap-3">{matches.map((m) => <RecCard key={m.product.id} rec={m} />)}</div>
        ) : <p className="text-sm text-muted-foreground">No close matches found.</p>}
      </div>
    </div>
  );
}
