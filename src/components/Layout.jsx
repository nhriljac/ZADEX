import { Link, NavLink } from "react-router-dom";
import { House, BookHeart, Compass, ScanLine, User, Search, Sparkles, TrendingDown } from "lucide-react";
import { BRAND } from "./ui";

const NAV = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/profile", label: "Profile", icon: User },
];

const EXTRA = [
  { to: "/search", label: "Search", icon: Search },
  { to: "/assistant", label: "Zadex AI", icon: Sparkles },
  { to: "/deals", label: "Deals", icon: TrendingDown },
];

const sideLink = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
  }`;

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-sidebar/40 px-5 py-7">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="h-9 w-9 rounded-xl accent-grad flex items-center justify-center text-primary-foreground font-display font-bold text-lg">Z</span>
          <div>
            <div className="font-display font-semibold tracking-tight text-lg leading-none">ZADEX</div>
            <div className="text-[11px] text-muted-foreground mt-1">Know what you like.</div>
          </div>
        </Link>
        <nav className="mt-10 flex flex-col gap-1">
          {[...NAV, ...EXTRA].map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={sideLink}>
              <n.icon size={18} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl card-elevated p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Prototype</div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Demo data — your journal persists and drives personalization.</p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-30 glass border-b border-border">
        <div className="flex items-center justify-between px-5 h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg accent-grad flex items-center justify-center text-primary-foreground font-display font-bold text-sm">Z</span>
            <span className="font-display font-semibold tracking-tight">ZADEX</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/search" className="text-muted-foreground hover:text-foreground" aria-label="Search"><Search size={18} /></Link>
            <Link to="/assistant" className="flex items-center gap-1.5 text-sm text-muted-foreground"><Sparkles size={16} /> AI</Link>
          </div>
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="max-w-2xl mx-auto px-5 pb-28 lg:pb-12 pt-4 lg:pt-8 lg:px-8">{children}</div>
      </main>

      {/* Mobile tab bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-border" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-5 px-2 py-2">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1.5 rounded-xl text-[11px] transition-colors ${isActive ? "text-accent-foreground" : "text-muted-foreground"}`
              }
            >
              {({ isActive }) => (
                <>
                  <n.icon size={20} style={isActive ? { color: BRAND } : {}} />
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
