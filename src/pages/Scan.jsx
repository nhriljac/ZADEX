import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, X } from "lucide-react";
import { PRODUCTS, terpeneById } from "../lib/data";
import { Notice, BRAND_SOFT } from "../components/ui";

// Scanning is simulated: it picks a random catalog product. To make it real,
// replace the timeout in `scan()` with a barcode/OCR call that resolves a product id.
export default function Scan() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(null);

  const scan = () => {
    setScanning(true);
    setFound(null);
    setTimeout(() => {
      setFound(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]);
      setScanning(false);
    }, 1400);
  };

  return (
    <div className="space-y-6 fade-in pb-12">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Scan</h1>
        <p className="text-sm text-muted-foreground mt-1">Point at a product to analyze its terpene profile.</p>
      </div>

      <div className="relative aspect-[3/4] sm:aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-black/60">
        <div className="absolute inset-0 flex items-center justify-center">
          {scanning ? (
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-2 animate-spin mx-auto" style={{ borderColor: "hsl(150 10% 20%)", borderTopColor: "hsl(142 40% 62%)" }} />
              <p className="text-sm text-muted-foreground mt-4">Analyzing…</p>
            </div>
          ) : found ? (
            <div className="w-full max-w-sm px-6">
              <div className="rounded-2xl card-elevated p-5 rise-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider" style={{ color: BRAND_SOFT }}>Product found</span>
                  <button onClick={() => setFound(null)} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss"><X size={18} /></button>
                </div>
                <h3 className="text-lg font-display font-semibold">{found.name}</h3>
                <p className="text-sm text-muted-foreground">{found.brand} · {found.product_type}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {found.terpenes.slice(0, 3).map((x) => (
                    <span key={x.id} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{terpeneById(x.id)?.name} {x.pct}%</span>
                  ))}
                </div>
                <button onClick={() => navigate(`/analyze/${found.id}`)} className="w-full mt-5 inline-flex items-center justify-center gap-2 py-3 rounded-2xl accent-grad text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  <Sparkles size={16} /> Analyze with Zadex
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative mx-auto h-40 w-64 rounded-2xl border-2 border-dashed border-muted-foreground/40">
                <div className="absolute top-0 inset-x-0 h-0.5 accent-grad" style={{ animation: "scanline 1.6s ease-in-out infinite" }} />
              </div>
              <p className="text-sm text-muted-foreground mt-4">Center the product label in the frame</p>
            </div>
          )}
        </div>
      </div>

      {!found && (
        <button onClick={scan} disabled={scanning} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl accent-grad text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
          <Camera size={18} /> {scanning ? "Scanning…" : "Scan Product"}
        </button>
      )}

      <Notice>
        Prototype: scanning is simulated. The architecture supports real barcode/OCR recognition — a later update would swap the simulated step for an API call that resolves a product id, then route to the same analyzer.
      </Notice>
    </div>
  );
}
