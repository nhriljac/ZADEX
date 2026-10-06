import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZadex } from "../lib/ZadexContext";
import { INTERESTS } from "../lib/data";
import { Chip, PrimaryButton } from "../components/ui";

export default function Onboarding() {
  const { completeOnboarding, positiveEffects, productTypes } = useZadex();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState([]);
  const [effects, setEffects] = useState([]);
  const [types, setTypes] = useState([]);
  const [known, setKnown] = useState("");

  const toggle = (list, set, v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const next = () => setStep((s) => s + 1);
  const finish = () => {
    completeOnboarding({
      interests, effects, types,
      known: known.split(",").map((s) => s.trim()).filter(Boolean),
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-md w-full mx-auto px-6 pt-16 pb-10 flex-1 flex flex-col">
        <div className="flex gap-1.5 mb-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? "accent-grad" : "bg-muted"}`} />
          ))}
        </div>

        {step === 0 && (
          <div key="s0" className="flex-1 flex flex-col rise-in">
            <div className="h-16 w-16 rounded-3xl accent-grad flex items-center justify-center text-primary-foreground font-display font-bold text-3xl mb-6">Z</div>
            <h1 className="text-3xl font-display font-semibold tracking-tight">Welcome to Zadex</h1>
            <p className="text-lg text-muted-foreground mt-3 leading-relaxed">Your personal cannabis intelligence.</p>
            <p className="text-sm text-muted-foreground/80 mt-6 leading-relaxed">
              Zadex learns from what you try, explains why you like it, and helps you discover more. The more you log, the smarter it gets.
            </p>
            <div className="mt-auto"><PrimaryButton onClick={next}>Get started</PrimaryButton></div>
          </div>
        )}

        {step === 1 && (
          <div key="s1" className="flex-1 flex flex-col rise-in">
            <h2 className="text-2xl font-display font-semibold tracking-tight">What are you interested in?</h2>
            <p className="text-sm text-muted-foreground mt-2">Select all that apply — this shapes your home feed.</p>
            <div className="flex flex-col gap-2.5 mt-8">
              {INTERESTS.map((v) => {
                const on = interests.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggle(interests, setInterests, v)}
                    className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left border transition-all ${on ? "border-accent-foreground/40 bg-accent text-accent-foreground" : "border-border bg-card text-foreground/90"}`}
                  >
                    <span className="font-medium">{v}</span>
                    <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${on ? "border-accent-foreground bg-accent-foreground" : "border-muted-foreground/40"}`}>
                      {on && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-8"><PrimaryButton onClick={next}>Continue</PrimaryButton></div>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="flex-1 flex flex-col rise-in">
            <h2 className="text-2xl font-display font-semibold tracking-tight">What effects do you usually enjoy?</h2>
            <p className="text-sm text-muted-foreground mt-2">Pick a few — we'll look for these as you log products.</p>
            <div className="flex flex-wrap gap-2.5 mt-8">
              {positiveEffects.map((v) => <Chip key={v} label={v} active={effects.includes(v)} onClick={() => toggle(effects, setEffects, v)} />)}
            </div>
            <div className="mt-auto pt-8"><PrimaryButton onClick={next}>Continue</PrimaryButton></div>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="flex-1 flex flex-col rise-in">
            <h2 className="text-2xl font-display font-semibold tracking-tight">What products do you usually use?</h2>
            <p className="text-sm text-muted-foreground mt-2">This helps Zadex sort recommendations by format.</p>
            <div className="flex flex-wrap gap-2.5 mt-8">
              {productTypes.map((v) => <Chip key={v} label={v} active={types.includes(v)} onClick={() => toggle(types, setTypes, v)} />)}
            </div>
            <div className="mt-auto pt-8"><PrimaryButton onClick={next}>Continue</PrimaryButton></div>
          </div>
        )}

        {step === 4 && (
          <div key="s4" className="flex-1 flex flex-col rise-in">
            <h2 className="text-2xl font-display font-semibold tracking-tight">Start building your taste profile</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Optionally name a few products you've already tried (comma-separated). We've pre-seeded some demo history so Zadex feels alive.
            </p>
            <textarea
              value={known}
              onChange={(e) => setKnown(e.target.value)}
              placeholder="Blue Dream, Gelato, Sour Diesel…"
              rows={4}
              className="mt-8 w-full rounded-2xl bg-card border border-border px-4 py-3.5 text-sm outline-none focus:border-accent-foreground/40 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground/70 mt-3">You can skip this — adding entries later is easy.</p>
            <div className="mt-auto pt-8 flex gap-3">
              <button onClick={finish} className="flex-1 py-4 rounded-2xl border border-border text-foreground/90 hover:bg-muted/50 transition-colors">Skip</button>
              <PrimaryButton onClick={finish} className="flex-1 w-auto">Finish</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
