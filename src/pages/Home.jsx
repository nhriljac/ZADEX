import { Link, useNavigate } from "react-router-dom";
import { Plus, ArrowRight, Leaf, Sparkles, History } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { productByName, terpeneById } from "../lib/data";
import { USER } from "../config";
import { InsightCard, ProductAvatar, RecCard, JournalCard, SectionHeader, EmptyState, BRAND } from "../components/ui";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Tile({ title, children, link, icon }) {
  return (
    <div className="rounded-2xl card-elevated p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-3">
        {icon}{title}
        {link && <Link to={link} className="ml-auto" aria-label={`Open ${title}`}><ArrowRight size={14} /></Link>}
      </div>
      {children}
    </div>
  );
}
const Muted = ({ children }) => <p className="text-sm text-muted-foreground/70">{children}</p>;

export default function Home() {
  const { profile, insights, recommendations, journal } = useZadex();
  const navigate = useNavigate();
  const favorites = (journal || []).filter((e) => e.favorite || (e.rating || 0) >= 4.5).slice(0, 6);
  const recent = [...(journal || [])].sort((a, b) => (b.entry_date || "").localeCompare(a.entry_date || "")).slice(0, 4);
  const terps = profile.topTerpenes.slice(0, 3).map((x) => terpeneById(x.key)?.name).filter(Boolean);
  const effects = profile.topEffects.filter((x) => x.score > 0).map((x) => x.key).slice(0, 4);

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()}, {USER.name}.</p>
          <h1 className="text-2xl font-display font-semibold tracking-tight mt-1">Here's what Zadex has learned about you.</h1>
        </div>
        <Link to="/log" className="shrink-0 inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full accent-grad text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Log
        </Link>
      </div>

      <InsightCard
        insight={insights[0] || "Log your first product and Zadex will start finding patterns."}
        cta="Explore similar products"
        onCta={() => navigate("/discover")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Tile title="Your Favorites" link="/journal">
          {favorites.length ? (
            <div className="flex flex-wrap gap-2">
              {favorites.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-1.5">
                  <ProductAvatar product={productByName(e.product_name) || { name: e.product_name, id: e.product_name }} size="sm" className="!h-7 !w-7 !text-xs !rounded-lg" />
                  <span className="text-sm text-foreground/90">{e.product_name}</span>
                </div>
              ))}
            </div>
          ) : <Muted>No favorites yet</Muted>}
        </Tile>
        <Tile title="Preferred Effects">
          {effects.length ? (
            <div className="flex flex-wrap gap-1.5">
              {effects.map((e) => <span key={e} className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-foreground/85">{e}</span>)}
            </div>
          ) : <Muted>Log effects to see patterns</Muted>}
        </Tile>
        <Tile title="Favorite Terpenes" icon={<Leaf size={13} style={{ color: BRAND }} />}>
          {terps.length ? (
            <div className="flex flex-wrap gap-1.5">
              {terps.map((n) => <span key={n} className="text-xs px-2.5 py-1 rounded-full border border-border text-foreground/85">{n}</span>)}
            </div>
          ) : <Muted>Learn your terpene leanings</Muted>}
        </Tile>
        <Tile title="Your Patterns">
          {insights[2] ? <p className="text-sm text-muted-foreground leading-relaxed">{insights[2]}</p> : <Muted>Patterns appear after a few logs</Muted>}
        </Tile>
      </div>

      <div className="space-y-4">
        <SectionHeader title="Recommended For You" sub="Each pick explains itself." />
        {recommendations.length ? (
          <div className="grid grid-cols-2 gap-3">
            {recommendations.slice(0, 4).map((r) => <RecCard key={r.product.id} rec={r} />)}
          </div>
        ) : (
          <EmptyState title="No recommendations yet" sub="Log a couple of products and Zadex will surface personalized picks." icon={<Sparkles size={26} />} />
        )}
      </div>

      <div className="space-y-4">
        <SectionHeader title="Recently Tried" action="See all" onAction={() => navigate("/journal")} />
        {recent.length ? (
          <div className="space-y-3">{recent.map((e) => <JournalCard key={e.id} entry={e} />)}</div>
        ) : (
          <EmptyState
            title="Nothing logged yet"
            sub="Your history is what makes Zadex personal."
            icon={<History size={26} />}
            action={
              <Link to="/log" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full accent-grad text-primary-foreground text-sm">
                <Plus size={15} /> Log a product
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
