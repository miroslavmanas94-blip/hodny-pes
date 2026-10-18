"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, BookOpen, CheckCircle2, Dog, Eye, EyeOff, Gamepad2, Heart, LockKeyhole, Mail, PawPrint, Sparkles, UserRound, X } from "lucide-react";

const Game3D = dynamic(() => import("./Game3D"), {
  ssr: false,
  loading: () => <main className="gameLoading"><div className="loadingPaw">🐾</div><b>Načítám svět Hodný Pes Academy…</b><span>Připravuji areál, pejska a tréninkové zóny</span><div className="loadingBar"><i /></div></main>,
});

type GateMode = "login" | "register";
type LocalProfile = { name: string; email: string; enteredAt: string };

export default function Home() {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [gate, setGate] = useState<GateMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [authConfigured, setAuthConfigured] = useState(false);

  useEffect(() => {
    setAuthConfigured(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
    try {
      const saved = localStorage.getItem("hodny-pes-profile");
      if (saved) setProfile(JSON.parse(saved) as LocalProfile);
    } catch {}
  }, []);

  const enterAsGuest = () => {
    const guest = { name: "Psí dobrodruh", email: "", enteredAt: new Date().toISOString() };
    localStorage.setItem("hodny-pes-profile", JSON.stringify(guest));
    setProfile(guest);
  };

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Vyplň e-mail a heslo."); return; }
    if (password.length < 6) { setError("Heslo musí mít alespoň 6 znaků."); return; }
    if (!authConfigured) {
      setError("Online přihlášení ještě není nakonfigurované. Můžeš bezpečně vstoupit jako host; pro účty je potřeba doplnit Supabase Auth proměnné do nasazení.");
      return;
    }
    setBusy(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      if (gate === "register") {
        const { data, error: authError } = await client.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() || email.split("@")[0] } } });
        if (authError) throw authError;
        if (!data.session) {
          setError("Účet byl odeslán k potvrzení. Zkontroluj e-mail a potom se přihlas.");
          setGate("login");
          return;
        }
      } else {
        const { error: authError } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
      const next = { name: name.trim() || email.split("@")[0], email: email.trim(), enteredAt: new Date().toISOString() };
      localStorage.setItem("hodny-pes-profile", JSON.stringify(next));
      setProfile(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Přihlášení se nepodařilo. Zkus to znovu.");
    } finally { setBusy(false); }
  };

  const signOut = () => { localStorage.removeItem("hodny-pes-profile"); setProfile(null); setPassword(""); setError(""); };

  if (profile) return <main className="gamePage"><div className="playerWelcome"><span><PawPrint size={15}/> Přihlášeno jako {profile.name}</span><button onClick={signOut}>Odhlásit / změnit profil</button></div><Game3D /></main>;

  return <main className="academyLanding">
    <div className="landingNav"><a className="landingBrand" href="#"><span><Dog size={24}/></span><div><b>HODNÝ PES</b><small>ACADEMY · 3D PSÍ SVĚT</small></div></a><span className="landingNavTag"><span/> HRAJ NA PC I MOBILU</span></div>
    <div className="landingGrid">
      <section className="landingStory">
        <div className="landingEyebrow"><Sparkles size={15}/> VÝCVIK, KTERÝ JE DOBRODRUŽSTVÍ</div>
        <h1>Každý pes má svůj příběh.<br/><em>Začni ten svůj.</em></h1>
        <p className="landingLead">Vstup do barevného 3D světa Hodný Pes Academy. Prozkoumávej výcvikový areál, sbírej pamlsky, plň malé výzvy a uč se spolupracovat se svým čtyřnohým parťákem.</p>
        <div className="landingFeatures">
          <article><span className="featureIcon purple"><Gamepad2 size={19}/></span><div><b>Opravdový 3D svět</b><p>Volný pohyb, kamera za postavou a výcvikové zóny k prozkoumání.</p></div></article>
          <article><span className="featureIcon peach"><Heart size={19}/></span><div><b>Pozitivní přístup</b><p>Za objevování získáváš XP a pamlsky. Bez trestů, s radostí.</p></div></article>
          <article><span className="featureIcon mint"><BookOpen size={19}/></span><div><b>Pes i trenér</b><p>Přepínej mezi pejskem a trenérem a zkoušej svět z obou stran.</p></div></article>
        </div>
        <div className="landingTrust"><span className="trustPaws">🐾 🐾 🐾</span><p><b>Vlastním tempem, na tvém zařízení.</b><br/>Rozhraní se přizpůsobí počítači, tabletu i telefonu.</p></div>
        <div className="landingPreview"><div className="previewSky"><div className="previewSun"/><div className="previewHill hillOne"/><div className="previewHill hillTwo"/><span className="previewDog">🐕</span><span className="previewPaw pawOne">🐾</span><span className="previewPaw pawTwo">✦</span><div className="previewLabel"><span className="previewDot"/> AKADEMIE · VOLNÝ REŽIM</div></div><div className="previewCaption"><span><b>Areál akademie</b><small>První zastávka tvého dobrodružství</small></span><span className="previewChip">3D WORLD</span></div></div>
      </section>
      <section className="authSide">
        <div className="authCard">
          <div className="authIcon"><PawPrint size={23}/></div>
          <div className="authKicker">VÍTEJ V AKADEMII</div>
          <h2>{gate === "register" ? "Vytvoř si svůj profil" : "Vítej zpátky!"}</h2>
          <p className="authIntro">{gate === "register" ? "Připrav se na první výpravu. Můžeš začít jako host nebo se přihlásit účtem." : "Přihlas se a pokračuj ve svém psím dobrodružství."}</p>
          <div className="authTabs"><button className={gate === "login" ? "selected" : ""} onClick={() => {setGate("login");setError("");}}>Přihlášení</button><button className={gate === "register" ? "selected" : ""} onClick={() => {setGate("register");setError("");}}>Registrace</button></div>
          <form onSubmit={submitAuth}>
            {gate === "register" && <label className="authLabel">Jak ti máme říkat?<div className="authInputWrap"><UserRound size={17}/><input value={name} onChange={e => setName(e.target.value)} placeholder="Tvoje přezdívka" autoComplete="nickname"/></div></label>}
            <label className="authLabel">E-mail<div className="authInputWrap"><Mail size={17}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ty@priklad.cz" autoComplete="email" required/></div></label>
            <label className="authLabel">Heslo<div className="authInputWrap"><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Alespoň 6 znaků" autoComplete={gate === "login" ? "current-password" : "new-password"} required/><button type="button" className="showPassword" aria-label={showPassword ? "Skrýt heslo" : "Zobrazit heslo"} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
            {error && <div className="authError" role="alert"><X size={16}/><span>{error}</span></div>}
            <button className="authSubmit" type="submit" disabled={busy}>{busy ? "Chvilku strpení…" : gate === "register" ? "Vytvořit účet a vstoupit" : "Přihlásit se"} <ArrowRight size={17}/></button>
          </form>
          <div className="authDivider"><span/> NEBO <span/></div>
          <button className="guestButton" onClick={enterAsGuest}><Gamepad2 size={17}/> Vyzkoušet hru jako host</button>
          <p className="authFineprint">{authConfigured ? "Účty používají zabezpečené přihlášení přes Supabase." : "Režim hosta uloží profil pouze do tohoto prohlížeče. Online účty se aktivují po nastavení Supabase Auth."}</p>
        </div>
        <div className="authBottom"><span><CheckCircle2 size={14}/> Bezplatný vstup</span><span><CheckCircle2 size={14}/> PC · tablet · mobil</span><span><CheckCircle2 size={14}/> Pozitivní výcvik</span></div>
      </section>
    </div>
    <footer className="landingFooter"><span>© Hodný Pes Academy</span><span>Učíme se spolu. Rosteme spolu. 🐾</span></footer>
  </main>;
}
