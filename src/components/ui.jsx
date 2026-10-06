import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Star, Heart, Repeat2, Search, ArrowRight, ChevronRight, X } from "lucide-react";
import { productByName, terpeneById, productsWithTerpene } from "../lib/data";

export const cn = (...c) => c.filter(Boolean).join(" ");
export const BRAND = "hsl(142 40% 62%)";
export const BRAND_SOFT = "hsl(142 40% 68%)";

export function Chip({ label, active = false, onClick, size = "md", tone = "default" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-2 font-medium border transition-all duration-200 select-none",
        size === "sm" ? "text-xs" : "text-sm",
        active
          ? tone === "negative"
            ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
            : "border-accent-foreground/40 bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function InsightCard({ insight, cta, onCta, title = "Zadex Insight" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 card-elevated">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-30" style={{ background: "hsl(142 40% 50%)" }} />
      <div className="relative">
        <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(142 40% 70%)" }}>
          <Sparkles size={16} />
          <span className="font-medium uppercase tracking-wider text-xs">{title}</span>
        </div>
        <p className="mt-3 text-foreground/90 leading-relaxed">{insight}</p>
        {cta && (
          <button onClick={onCta} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full accent-grad text-primary-foreground hover:opacity-90 transition-opacity">
            {cta} <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function hueFor(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export function ProductAvatar({ product, size = "md", className, photo }) {
  const sizes = {
    sm: "h-12 w-12 rounded-xl text-lg",
    md: "h-16 w-16 rounded-2xl text-xl",
    lg: "h-28 w-28 rounded-3xl text-3xl",
    xl: "h-40 w-40 rounded-3xl text-5xl",
    full: "aspect-[4/3] w-full rounded-2xl text-6xl",
  };
  const h = hueFor(product?.id || product?.name || "z");
  const bg = `linear-gradient(135deg, hsl(${h} 22% 22%), hsl(${(h + 30) % 360} 18% 14%))`;
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden font-display font-semibold text-white/90 shrink-0", sizes[size], className)}
      style={{ background: bg }}
    >
      {photo ? (
        <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/5 blur-xl" />
          <span className="relative drop-shadow">{(product?.name || "Z").charAt(0)}</span>
        </>
      )}
    </div>
  );
}

export function RecCard({ rec, compact = false }) {
  const { product, reason, similarity } = rec;
  return (
    <Link to={`/product/${product.id}`} className="group block rounded-2xl card-elevated p-3 hover:border-accent-foreground/30 transition-all duration-300">
      <ProductAvatar product={product} size="full" className="mb-3" />
      <div className="px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
          {similarity != null && (
            <span className="text-[11px] px-2 py-0.5 rounded-full accent-grad text-primary-foreground font-medium shrink-0">{similarity}% match</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.brand} · {product.product_type}</p>
        {!compact && reason && (
          <div className="mt-3 rounded-xl bg-muted/40 border border-border/60 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-1" style={{ color: BRAND_SOFT }}>
              <Sparkles size={12} /> Why Zadex recommends
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

export function ProductCard({ product, to, footer }) {
  if (!product) return null;
  return (
    <Link to={to || `/product/${product.id}`} className="group block rounded-2xl card-elevated p-3 hover:border-accent-foreground/30 transition-all duration-300">
      <ProductAvatar product={product} size="full" className="mb-3" />
      <div className="px-1">
        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.brand} · {product.product_type}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {product.effects.slice(0, 3).map((e) => (
            <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{e}</span>
          ))}
        </div>
        {footer}
      </div>
    </Link>
  );
}

export function StarRating({ value = 0, size = 16, className }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} className="relative inline-flex">
            <Star size={size} className="text-muted/40" strokeWidth={1.5} />
            {(filled || isHalf) && (
              <span className="absolute inset-0 overflow-hidden flex items-center" style={{ width: isHalf ? "50%" : "100%" }}>
                <Star size={size} className="fill-current shrink-0" strokeWidth={0} style={{ color: BRAND }} />
              </span>
            )}
          </span>
        );
      })}
      {value > 0 && <span className="ml-1 text-xs text-muted-foreground tabular-nums">{value.toFixed(1)}</span>}
    </div>
  );
}

export function RatingInput({ value = 0, onChange }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const n = i + 1;
        const filled = value >= n;
        const half = !filled && value >= n - 0.5;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${n}`}
            className="relative cursor-pointer"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              onChange(e.clientX - r.left < r.width / 2 ? n - 0.5 : n);
            }}
          >
            <Star size={26} className="text-muted/40" strokeWidth={1.5} />
            {(filled || half) && (
              <span className="absolute inset-0 overflow-hidden flex items-center" style={{ width: half ? "50%" : "100%" }}>
                <Star size={26} strokeWidth={0} className="fill-current shrink-0" style={{ color: "hsl(142 44% 62%)" }} />
              </span>
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground tabular-nums">{value > 0 ? `${value.toFixed(1)} / 5` : "Tap to rate"}</span>
    </div>
  );
}

export function JournalCard({ entry, onToggleFavorite }) {
  if (!entry) return null;
  const p = productByName(entry.product_name);
  const terps = p ? p.terpenes.slice(0, 2).map((x) => terpeneById(x.id)?.name).filter(Boolean) : [];
  return (
    <Link to={`/journal/${entry.id}`} className="group block rounded-2xl card-elevated p-3 hover:border-accent-foreground/30 transition-all duration-300">
      <div className="flex gap-3">
        <ProductAvatar product={p || { name: entry.product_name, id: entry.product_name }} photo={entry.photo_url} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-foreground truncate">{entry.product_name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry.brand || "—"} · {entry.product_type}</p>
            </div>
            {onToggleFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); onToggleFavorite(entry.id); }}
                className="shrink-0 text-muted-foreground hover:text-accent-foreground transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart size={16} className={entry.favorite ? "fill-current" : ""} style={entry.favorite ? { color: BRAND } : {}} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StarRating value={entry.rating} size={13} />
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{(entry.entry_date || "").slice(5)}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(entry.effects || []).slice(0, 3).map((e) => (
              <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{e}</span>
            ))}
            {terps.map((n) => (
              <span key={n} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{n}</span>
            ))}
          </div>
          {entry.would_buy_again && (
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: BRAND_SOFT }}>
                <Repeat2 size={12} /> Buy again
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SectionHeader({ title, action, onAction, className, sub }) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground">{title}</h2>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">{action}</button>
      )}
    </div>
  );
}

export function EmptyState({ title, sub, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && <div className="h-16 w-16 rounded-3xl flex items-center justify-center bg-muted/40 border border-border mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {sub && <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search products, terpenes, effects…", autoFocus }) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-card border border-border pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-accent-foreground/40 transition-colors"
      />
    </div>
  );
}

export function TerpeneBars({ product, compact = false }) {
  const list = product?.terpenes || [];
  const max = Math.max(...list.map((x) => x.pct), 1);
  return (
    <div className="space-y-3">
      {list.map((x) => {
        const terp = terpeneById(x.id);
        return (
          <div key={x.id}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-foreground/90">{terp?.name || x.id}</span>
              <span className="text-muted-foreground tabular-nums">{x.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.round((x.pct / max) * 100)}%`, background: terp?.color || "hsl(142 30% 50%)" }}
              />
            </div>
            {!compact && terp && <p className="text-xs text-muted-foreground mt-1.5">{terp.aromas.join(" · ")}</p>}
          </div>
        );
      })}
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{title}</div>
      <div className="text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}

export function TerpeneCard({ terpene, percentage, compact = false }) {
  const [open, setOpen] = useState(false);
  const terp = typeof terpene === "string" ? terpeneById(terpene) : terpene;
  if (!terp) return null;
  const level = percentage >= 30 ? "High" : percentage >= 15 ? "Moderate" : "Present";
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full text-left rounded-2xl card-elevated p-4 hover:border-accent-foreground/30 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-display font-semibold" style={{ background: terp.color }}>
              {terp.name.charAt(0)}
            </span>
            <div>
              <div className="font-medium text-foreground">{terp.name}</div>
              <div className="text-xs text-muted-foreground">{level}</div>
            </div>
          </div>
          {percentage != null && (
            <div className="text-right">
              <div className="text-lg font-display font-semibold text-foreground tabular-nums">{percentage}%</div>
              <ChevronRight size={14} className="text-muted-foreground ml-auto" />
            </div>
          )}
        </div>
        {!compact && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{terp.educational}</p>}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {terp.aromas.map((a) => <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{a}</span>)}
          </div>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm fade-in" />
          <div className="relative w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl card-elevated p-6 rise-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-display font-semibold text-xl" style={{ background: terp.color }}>
                {terp.name.charAt(0)}
              </span>
              <div>
                <h3 className="text-xl font-display font-semibold">{terp.name}</h3>
                {percentage != null && <p className="text-sm text-muted-foreground">{percentage}% in this product</p>}
              </div>
            </div>
            <DetailBlock title="What it is">{terp.characteristics}</DetailBlock>
            <DetailBlock title="Where it occurs naturally">{terp.occurs}</DetailBlock>
            <DetailBlock title="Common aromas">
              <div className="flex flex-wrap gap-1.5">
                {terp.aromas.map((a) => <span key={a} className="text-sm px-3 py-1 rounded-full bg-muted/60 text-muted-foreground">{a}</span>)}
              </div>
            </DetailBlock>
            <DetailBlock title="Sensory contribution">{terp.sensory}</DetailBlock>
            <DetailBlock title="Education"><p className="text-sm text-muted-foreground leading-relaxed">{terp.educational}</p></DetailBlock>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground mb-2">Other products with similar terpene profiles</h4>
              <div className="grid grid-cols-2 gap-2">
                {productsWithTerpene(terp.id).slice(0, 4).map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl bg-muted/40 p-2 hover:bg-muted transition-colors">
                    <ProductAvatar product={p} size="sm" className="!h-9 !w-9 !text-sm" />
                    <span className="text-sm text-foreground/90 truncate">{p.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const PrimaryButton = ({ className, ...props }) => (
  <button
    {...props}
    className={cn("w-full py-4 rounded-2xl accent-grad text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40", className)}
  />
);

export const Notice = ({ children }) => (
  <div className="rounded-2xl border border-border bg-muted/20 p-4">
    <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
  </div>
);
