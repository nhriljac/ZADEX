import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, Calendar, DollarSign, MapPin, Sparkles } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { productByName, terpeneById } from "../lib/data";
import { ProductAvatar, StarRating, BRAND, BRAND_SOFT } from "../components/ui";

const Stat = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-muted/40 p-3">
    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{icon}{label}</div>
    <div className="text-sm text-foreground/90 mt-1.5 truncate">{value}</div>
  </div>
);
const Block = ({ title, children }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
    {children}
  </div>
);

export default function JournalEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journal, deleteEntry, toggleFavorite } = useZadex();
  const entry = journal.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Entry not found.</p>
        <Link to="/journal" className="text-sm mt-2 inline-block" style={{ color: BRAND_SOFT }}>Back to journal</Link>
      </div>
    );
  }

  const p = productByName(entry.product_name);
  const onDelete = async () => {
    if (!window.confirm(`Delete your ${entry.product_name} entry? This can't be undone.`)) return;
    await deleteEntry(entry.id);
    navigate("/journal");
  };

  return (
    <div className="space-y-6 fade-in pb-12">
      <div className="flex items-center justify-between">
        <Link to="/journal" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={18} /> Journal
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleFavorite(entry.id)} className="text-muted-foreground hover:text-foreground p-1" aria-label="Toggle favorite">
            <Heart size={20} className={entry.favorite ? "fill-current" : ""} style={entry.favorite ? { color: BRAND } : {}} />
          </button>
          <button onClick={onDelete} className="text-muted-foreground hover:text-rose-400 p-1" aria-label="Delete entry">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <ProductAvatar product={p || { name: entry.product_name, id: entry.product_name }} photo={entry.photo_url} size="lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-display font-semibold tracking-tight">{entry.product_name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{entry.brand || "—"} · {entry.product_type}</p>
          <div className="mt-2 flex items-center gap-3">
            <StarRating value={entry.rating} size={16} />
            <span className="text-xs text-muted-foreground">{entry.entry_date}{entry.entry_time ? ` · ${entry.entry_time}` : ""}</span>
          </div>
        </div>
      </div>

      {entry.ai_summary && (
        <div className="rounded-2xl card-elevated p-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(142 40% 70%)" }}>
            <Sparkles size={16} /><span className="font-medium uppercase tracking-wider text-xs">Zadex learned</span>
          </div>
          <p className="mt-3 text-foreground/90 leading-relaxed">{entry.ai_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat icon={<Calendar size={14} />} label="Date" value={entry.entry_date} />
        <Stat icon={<DollarSign size={14} />} label="Price" value={entry.price ? `$${entry.price}` : "—"} />
        <Stat icon={<MapPin size={14} />} label="Where" value={entry.location || "—"} />
      </div>

      {entry.effects?.length > 0 && (
        <Block title="Effects">
          <div className="flex flex-wrap gap-2">
            {entry.effects.map((e) => <span key={e} className="text-sm px-3 py-1.5 rounded-full bg-accent/30 text-accent-foreground">{e}</span>)}
          </div>
        </Block>
      )}
      {entry.negative_effects?.length > 0 && (
        <Block title="Negative effects">
          <div className="flex flex-wrap gap-2">
            {entry.negative_effects.map((e) => <span key={e} className="text-sm px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-200/90 border border-rose-500/20">{e}</span>)}
          </div>
        </Block>
      )}
      {(entry.flavor || entry.aroma) && (
        <div className="grid grid-cols-2 gap-4">
          <Block title="Flavor"><p className="text-sm text-foreground/85">{entry.flavor || "—"}</p></Block>
          <Block title="Aroma"><p className="text-sm text-foreground/85">{entry.aroma || "—"}</p></Block>
        </div>
      )}
      {entry.notes && <Block title="Notes"><p className="text-sm text-foreground/85 leading-relaxed">{entry.notes}</p></Block>}
      {entry.photo_url && (
        <Block title="Photo"><img src={entry.photo_url} alt={entry.product_name} className="rounded-2xl border border-border max-h-80 object-cover" /></Block>
      )}

      {p && (
        <div className="rounded-2xl card-elevated p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Catalog entry</div>
              <p className="text-sm text-foreground/85 mt-1">{p.strain} · THC {p.thc}%</p>
            </div>
            <Link to={`/product/${p.id}`} className="text-sm" style={{ color: BRAND_SOFT }}>View product →</Link>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.terpenes.slice(0, 3).map((x) => (
              <span key={x.id} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{terpeneById(x.id)?.name} {x.pct}%</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
