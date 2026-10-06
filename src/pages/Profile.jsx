import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, Settings } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { USER } from "../config";
import { BRAND } from "../components/ui";

const StatTile = ({ label, value }) => (
  <div className="rounded-2xl card-elevated p-4 text-center">
    <div className="text-2xl font-display font-semibold">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
);

const TagRow = ({ label, items }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
    {items?.length ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map((v) => <span key={v} className="text-sm px-3 py-1.5 rounded-full bg-muted/50 text-foreground/85">{v}</span>)}
      </div>
    ) : <p className="text-sm text-muted-foreground/70">Not enough data yet</p>}
  </div>
);

export default function Profile() {
  const { profile, insights, prefs, terpeneById, resetOnboarding } = useZadex();
  const navigate = useNavigate();
  const terps = profile.topTerpenes.map((x) => terpeneById(x.key)?.name).filter(Boolean);
  const effects = profile.topEffects.filter((x) => x.score > 0).map((x) => x.key);

  return (
    <div className="space-y-6 fade-in pb-12">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-3xl accent-grad flex items-center justify-center text-primary-foreground font-display font-semibold text-2xl">{USER.name.charAt(0)}</div>
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">{USER.name}</h1>
          <p className="text-sm text-muted-foreground">{USER.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Products tried" value={profile.productsTried} />
        <StatTile label="Products rated" value={profile.productsRated} />
        <StatTile label="Favorites" value={profile.favoritesCount} />
        <StatTile label="Journal entries" value={profile.journalCount} />
      </div>

      <div className="rounded-3xl card-elevated p-5 space-y-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Sparkles size={14} style={{ color: BRAND }} /> Taste profile</div>
        <TagRow label="Favorite effects" items={effects} />
        <TagRow label="Favorite terpenes" items={terps} />
        <TagRow label="Favorite product types" items={profile.topTypes.map((x) => x.key)} />
        <TagRow label="Favorite brands" items={profile.topBrands.map((x) => x.key)} />
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Preferred price range</div>
          {profile.priceRange
            ? <p className="text-sm text-foreground/90">${profile.priceRange.min}–${profile.priceRange.max} · avg ${profile.priceRange.avg}</p>
            : <p className="text-sm text-muted-foreground/70">Not enough data yet</p>}
        </div>
        {prefs.interests?.length > 0 && <TagRow label="Interests" items={prefs.interests} />}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold">Personal Insights</h2>
        <div className="space-y-3">
          {insights.map((text, i) => (
            <div key={i} className="rounded-2xl card-elevated p-4">
              <div className="flex gap-3">
                <Sparkles size={16} className="shrink-0 mt-0.5" style={{ color: BRAND }} />
                <p className="text-sm text-foreground/85 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/deals" className="block rounded-2xl card-elevated p-4 hover:border-accent-foreground/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Deals Near You</div>
            <div className="text-xs text-muted-foreground mt-0.5">Demo deals matched to your taste</div>
          </div>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </Link>

      <button
        onClick={() => { resetOnboarding(); navigate("/"); }}
        className="w-full flex items-center justify-between rounded-2xl border border-border px-4 py-3.5 text-sm text-foreground/90 hover:bg-muted/40 transition-colors"
      >
        <span className="flex items-center gap-2"><Settings size={16} /> Redo onboarding</span>
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      <p className="text-center text-xs text-muted-foreground/60 pt-2">Zadex · Know what you like. · Prototype</p>
    </div>
  );
}
