import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ZadexProvider, useZadex } from "./lib/ZadexContext";
import Layout from "./components/Layout";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import LogProduct from "./pages/LogProduct";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Analyzer from "./pages/Analyzer";
import Match from "./pages/Match";
import Scan from "./pages/Scan";
import Deals from "./pages/Deals";
import Profile from "./pages/Profile";
import Assistant from "./pages/Assistant";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-display font-semibold">Page not found</h1>
      <Link to="/" className="text-sm mt-3 inline-block text-brand">Go home</Link>
    </div>
  );
}

function Shell() {
  const { onboarded, loading } = useZadex();
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-10 w-10 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(150 10% 18%)", borderTopColor: "hsl(142 40% 62%)" }} />
      </div>
    );
  }
  if (!onboarded) return <Onboarding />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalEntry />} />
        <Route path="/log" element={<LogProduct />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/analyze/:id" element={<Analyzer />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ZadexProvider>
        <Shell />
      </ZadexProvider>
    </BrowserRouter>
  );
}
