import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Camera, CircleCheck, X } from "lucide-react";
import { useZadex } from "../lib/ZadexContext";
import { productByName } from "../lib/data";
import { compressImage } from "../lib/storage";
import { Chip, RatingInput, BRAND } from "../components/ui";

const Field = ({ label, required, children }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
      {label}{required && <span style={{ color: BRAND }}> *</span>}
    </div>
    {children}
  </div>
);

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function LogProduct() {
  const { addEntry, productTypes, positiveEffects, negativeEffects, products } = useZadex();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_name: "", brand: "", product_type: "Flower", strain: "",
    entry_date: today(), entry_time: "", rating: 0, effects: [], negative_effects: [],
    flavor: "", aroma: "", notes: "", would_buy_again: false, price: "", location: "", photo_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [learned, setLearned] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, v) => setForm((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));

  const match = productByName(form.product_name);
  const suggestions = form.product_name && !match
    ? products.filter((p) => p.name.toLowerCase().includes(form.product_name.toLowerCase())).slice(0, 3)
    : [];

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try { set("photo_url", await compressImage(file)); } catch (err) { console.error(err); }
    setProcessing(false);
  };

  const save = async () => {
    if (!form.product_name.trim()) return;
    setSaving(true);
    setError("");
    const data = {
      ...form,
      price: Number(form.price) || 0,
      brand: match?.brand || form.brand,
      strain: match?.strain || form.strain,
    };
    try {
      const created = await addEntry(data);
      setLearned(created.ai_summary);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => navigate(`/journal/${created.id}`), 1800);
    } catch (err) {
      setError(err.message || "Could not save this entry.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 fade-in pb-32">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Log a Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Every entry teaches Zadex what you like.</p>
      </div>

      {learned && (
        <div className="rounded-2xl card-elevated p-5 rise-in">
          <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(142 40% 70%)" }}>
            <Sparkles size={16} /><span className="font-medium uppercase tracking-wider text-xs">Zadex learned</span>
          </div>
          <p className="mt-3 text-foreground/90 leading-relaxed">{learned}</p>
          <p className="text-xs text-muted-foreground mt-3">Opening your entry…</p>
        </div>
      )}

      <Field label="Product name" required>
        <input value={form.product_name} onChange={(e) => set("product_name", e.target.value)} placeholder="e.g. Blue Dream" className="input" />
        {suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((p) => <button key={p.id} type="button" onClick={() => set("product_name", p.name)} className="chip text-xs">{p.name}</button>)}
          </div>
        )}
        {match && <p className="text-xs text-muted-foreground mt-2">Matched in catalog: {match.brand} · {match.strain}</p>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Brand"><input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Brand" className="input" /></Field>
        <Field label="Product type">
          <select value={form.product_type} onChange={(e) => set("product_type", e.target.value)} className="input">
            {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Strain"><input value={form.strain} onChange={(e) => set("strain", e.target.value)} placeholder="Sativa / Indica / Hybrid" className="input" /></Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date"><input type="date" value={form.entry_date} onChange={(e) => set("entry_date", e.target.value)} className="input" /></Field>
        <Field label="Time"><input type="time" value={form.entry_time} onChange={(e) => set("entry_time", e.target.value)} className="input" /></Field>
      </div>

      <Field label="Rating"><RatingInput value={form.rating} onChange={(v) => set("rating", v)} /></Field>

      <Field label="Effects">
        <div className="flex flex-wrap gap-2">
          {positiveEffects.map((v) => <Chip key={v} label={v} active={form.effects.includes(v)} onClick={() => toggle("effects", v)} />)}
        </div>
      </Field>

      <Field label="Negative effects">
        <div className="flex flex-wrap gap-2">
          {negativeEffects.map((v) => <Chip key={v} label={v} tone="negative" active={form.negative_effects.includes(v)} onClick={() => toggle("negative_effects", v)} />)}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Flavor"><input value={form.flavor} onChange={(e) => set("flavor", e.target.value)} placeholder="Sweet, citrus…" className="input" /></Field>
        <Field label="Aroma"><input value={form.aroma} onChange={(e) => set("aroma", e.target.value)} placeholder="Earthy, pine…" className="input" /></Field>
      </div>

      <Field label="Experience notes">
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={4} placeholder="How did it feel? What were you doing?" className="input resize-none" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price ($)"><input type="number" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" className="input" /></Field>
        <Field label="Where purchased"><input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Store / online" className="input" /></Field>
      </div>

      <button
        type="button"
        onClick={() => set("would_buy_again", !form.would_buy_again)}
        className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 border transition-all ${form.would_buy_again ? "border-accent-foreground/40 bg-accent text-accent-foreground" : "border-border bg-card text-foreground/90"}`}
      >
        <span className="font-medium">Would buy again</span>
        <span className={`h-6 w-10 rounded-full flex items-center transition-colors ${form.would_buy_again ? "accent-grad" : "bg-muted"}`}>
          <span className={`h-5 w-5 rounded-full bg-white transition-transform ${form.would_buy_again ? "translate-x-4" : "translate-x-0.5"}`} />
        </span>
      </button>

      <Field label="Photo (optional)">
        {form.photo_url ? (
          <div className="flex items-center gap-3">
            <img src={form.photo_url} alt="" className="h-16 w-16 rounded-2xl object-cover border border-border" />
            <span className="text-sm text-muted-foreground flex items-center gap-2"><CircleCheck size={16} style={{ color: BRAND }} /> Photo attached</span>
            <button type="button" onClick={() => set("photo_url", "")} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Remove photo"><X size={18} /></button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-6 cursor-pointer hover:border-accent-foreground/40 transition-colors text-sm text-muted-foreground">
            <Camera size={18} /> {processing ? "Processing…" : "Add a photo"}
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
        )}
      </Field>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <div className="fixed bottom-20 lg:bottom-6 inset-x-0 lg:inset-x-auto lg:right-8 px-5 lg:px-0 z-20">
        <div className="max-w-2xl lg:w-80 mx-auto lg:ml-0">
          <button
            onClick={save}
            disabled={!form.product_name.trim() || saving}
            className="w-full py-4 rounded-2xl accent-grad text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}
