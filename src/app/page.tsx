"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PawPrint, Play, Trophy, GraduationCap, Map, Settings, Volume2, VolumeX, ChevronRight, CircleHelp, UserRound, Dog as DogIcon, CircleDollarSign, Target, LogOut, Save, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BREEDS, MISSIONS, scorePullerAttempt, type PullerMode } from "@/game/core/rules";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), { ssr: false, loading: () => <div className="scene-loading">Připravujeme cvičiště…</div> });
type Section = "world" | "school" | "puller";
type SessionUser = { id: string; email?: string };
type ShopItem = { id: string; name: string; description: string; category: string; price: number };
const menu = [
  { id: "world" as const, label: "Otevřený svět", detail: "Prozkoumej cvičiště a okolní louky", icon: Map },
  { id: "school" as const, label: "Psí škola", detail: "Nauč se první povely", icon: GraduationCap },
  { id: "puller" as const, label: "Dog Puller", detail: "Vyzkoušej házení a chytání kruhu", icon: Trophy }
];

export default function Home() {
  const supabase = useMemo(() => createClient(), []);
  const [started, setStarted] = useState(false);
  const [section, setSection] = useState<Section>("world");
  const [muted, setMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dogName, setDogName] = useState("Monty");
  const [breedId, setBreedId] = useState<string>("sheltie");
  const [dogSaved, setDogSaved] = useState(false);
  const [pullerMode, setPullerMode] = useState<PullerMode>("practice");
  const [pullerScore, setPullerScore] = useState(0);
  const [pullerAttempts, setPullerAttempts] = useState(0);
  const [coins, setCoins] = useState(0);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [walletCoins, setWalletCoins] = useState<number | null>(null);
  const [shopMessage, setShopMessage] = useState("");
  const [shopBusyItem, setShopBusyItem] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [notice, setNotice] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [trained, setTrained] = useState<string[]>([]);
  const [camera, setCamera] = useState<"third-person" | "first-person">("third-person");
  const [quality, setQuality] = useState<"auto" | "low" | "medium" | "high">("auto");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setAuthMessage("Nepodařilo se načíst relaci. Zkus se znovu přihlásit.");
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user) return;
    let cancelled = false;
    supabase.from("dogs").select("name,breed_id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) { setNotice("Nepodařilo se obnovit uloženého psa: " + error.message); return; }
      if (data) { setDogName(data.name); setBreedId(data.breed_id); setDogSaved(true); }
    });
    return () => { cancelled = true; };
  }, [supabase, user?.id]);

  async function refreshShop() {
    if (!supabase || !user) { setShopItems([]); setOwnedItems([]); setWalletCoins(null); return; }
    const [catalog, wallet, inventory] = await Promise.all([
      supabase.from("inventory_items").select("id,name,description,category,price").eq("active", true).order("price"),
      supabase.from("wallets").select("coins").eq("user_id", user.id).maybeSingle(),
      supabase.from("player_inventory").select("item_id").eq("user_id", user.id)
    ]);
    if (catalog.error) { setShopMessage("Katalog se nepodařilo načíst: " + catalog.error.message); return; }
    setShopItems((catalog.data ?? []) as ShopItem[]);
    setWalletCoins(wallet.data ? Number(wallet.data.coins) : 0);
    setOwnedItems((inventory.data ?? []).map(row => row.item_id));
    if (wallet.error) setShopMessage("Peněženku se nepodařilo načíst: " + wallet.error.message);
  }

  async function buyItem(item: ShopItem) {
    if (!supabase || !user) { setShopMessage("Pro nákup se přihlas."); return; }
    setShopBusyItem(item.id); setShopMessage("");
    try {
      const { data, error } = await supabase.rpc("buy_cosmetic", { p_item_id: item.id, p_idempotency_key: crypto.randomUUID() });
      if (error) throw error;
      const result = data as { status?: string; ok?: boolean; coins?: number; price?: number };
      if (result.status === "purchased") setShopMessage("Zakoupeno: " + item.name + ". Zůstatek: " + result.coins + " mincí.");
      else if (result.status === "already_owned") setShopMessage("Tento předmět už vlastníš.");
      else if (result.status === "insufficient_funds") setShopMessage("Nemáš dost mincí. Cena: " + item.price + ", zůstatek: " + result.coins + ".");
      else if (result.status === "already_processed") setShopMessage("Tento nákupní požadavek už byl zpracován.");
      else setShopMessage("Server vrátil neočekávaný výsledek nákupu.");
      await refreshShop();
    } catch (error) {
      setShopMessage(error instanceof Error ? error.message : "Nákup se nepodařil.");
    } finally { setShopBusyItem(null); }
  }

  useEffect(() => { void refreshShop(); }, [supabase, user?.id]);

  useEffect(() => {
    const caught = (event: Event) => {
      const detail = (event as CustomEvent<{ distance: number; airtime: number; returned: boolean; safeLanding: boolean }>).detail;
      const score = scorePullerAttempt(pullerMode, { caught: true, returned: detail.returned, distance: detail.distance, airtime: detail.airtime, safeLanding: detail.safeLanding });
      setPullerAttempts(n => n + 1);
      setPullerScore(s => s + score);
      setXp(x => x + (score > 0 ? 15 : 0));
      setNotice(score > 0 ? "Skvělé chycení! +" + score + " bodů. Tréninkové body jsou zatím jen v této relaci." : "Kruh se nepodařilo bezpečně chytit.");
    };
    window.addEventListener("puller:caught", caught);
    return () => window.removeEventListener("puller:caught", caught);
  }, [pullerMode]);

  async function submitAuth(event: FormEvent<HTMLFormElement>, kind: "login" | "signup" | "reset") {
    event.preventDefault();
    if (!supabase) { setAuthMessage("Supabase není nakonfigurované. Cloudové účty nejsou dostupné."); return; }
    if (!email.trim() || (kind !== "reset" && password.length < 8)) { setAuthMessage("Zadej e-mail a heslo dlouhé alespoň 8 znaků."); return; }
    setAuthBusy(true); setAuthMessage("");
    try {
      if (kind === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        setAuthMessage("Přihlášení proběhlo.");
      } else if (kind === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setAuthMessage(data.session ? "Účet vytvořen a přihlášen." : "Účet vytvořen. Zkontroluj e-mail a potvrď registraci.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/account/reset" });
        if (error) throw error;
        setAuthMessage("Pokud účet existuje, přijde e-mail pro obnovu hesla.");
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Autentizace selhala.");
    } finally { setAuthBusy(false); }
  }

  async function signUp() {
    if (!supabase) { setAuthMessage("Supabase není nakonfigurované. Cloudové účty nejsou dostupné."); return; }
    if (!email.trim() || password.length < 8) { setAuthMessage("Zadej e-mail a heslo dlouhé alespoň 8 znaků."); return; }
    setAuthBusy(true); setAuthMessage("");
    try { const { data, error } = await supabase.auth.signUp({ email: email.trim(), password }); if (error) throw error; setAuthMessage(data.session ? "Účet vytvořen a přihlášen." : "Účet vytvořen. Zkontroluj e-mail a potvrď registraci."); } catch (error) { setAuthMessage(error instanceof Error ? error.message : "Registrace selhala."); } finally { setAuthBusy(false); }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    setAuthMessage(error ? "Odhlášení se nepodařilo." : "Byl jsi odhlášen.");
  }

  async function saveDog() {
    const name = dogName.trim();
    if (name.length < 1 || name.length > 24) { setNotice("Jméno psa musí mít 1 až 24 znaků."); return; }
    if (!user || !supabase) {
      setDogSaved(true);
      setNotice("Pes je vybraný pro tuto relaci. Přihlas se pro uložení do cloudu.");
      return;
    }
    const { error } = await supabase.from("dogs").insert({ user_id: user.id, name, breed_id: breedId, coat_id: "default", accessories: [] });
    if (error) { setNotice("Cloudové uložení psa selhalo: " + error.message); return; }
    setDogSaved(true);
    setNotice("Pes byl uložen do účtu Supabase.");
  }

  function completeTraining(command: string) {
    if (trained.includes(command)) { setNotice("Tento povel už máš v této relaci procvičený."); return; }
    setTrained(current => [...current, command]);
    setXp(value => value + 20);
    setCoins(value => value + 5);
    setNotice("Povel „" + command + "“ procvičen. +20 XP a +5 mincí (jen pro tuto relaci).");
  }

  function claimMission(id: string, reward: number) {
    if (completed.includes(id)) { setNotice("Tuhle odměnu už máš vyzvednutou."); return; }
    if (id === "puller-first" && pullerAttempts === 0) { setNotice("Nejdřív v režimu Dog Puller proveď alespoň jeden pokus."); return; }
    if (id === "sit" && !trained.includes("Sedni")) { setNotice("Nejdřív v Psí škole procvič povel Sedni."); return; }
    if (id === "welcome" && !started) { setNotice("Nejdřív spusť průzkum cvičiště."); return; }
    setCompleted(current => [...current, id]);
    setCoins(value => value + reward);
    setXp(value => value + reward);
    setNotice("Mise dokončena. +" + reward + " mincí a XP. Odměna je zatím pouze v této relaci.");
  }

  function throwRing() {
    if (!started) setStarted(true);
    setSection("puller");
    window.dispatchEvent(new CustomEvent("puller:throw"));
    setNotice("Kruh byl odhozen. Pohybuj psem pomocí WASD/šipek a zkus se ke kruhu přiblížit.");
  }

  const activeBreed = BREEDS.find(b => b.id === breedId) ?? BREEDS[0];

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Hodný pes – domů"><span className="brand-mark"><PawPrint size={22}/></span><span><b>HODNÝ PES</b><small>PSÍ DOBRODRUŽSTVÍ</small></span></a>
      <div className="top-actions"><span className="build-tag"><i/> VÝPRAVA ZAČÍNÁ</span><button className="icon-button" aria-label={muted ? "Zapnout zvuk" : "Vypnout zvuk"} onClick={() => {setMuted(!muted); setNotice(!muted ? "Zvuk je zapnutý, ale zvukové soubory zatím nejsou připojené." : "Zvuk vypnut.");}}>{muted ? <VolumeX/> : <Volume2/>}</button><button className="icon-button" aria-label="Nastavení" onClick={() => setShowSettings(!showSettings)}><Settings/></button><button className="icon-button" aria-label="Účet" onClick={() => setShowAccount(!showAccount)}><UserRound/></button></div>
    </header>
    <section className="hero-layout">
      <div className="hero-copy">
        <div className="eyebrow"><span/> TVŮJ PES. TVOJE DOBRODRUŽSTVÍ.</div>
        <h1>Každý den<br/>je <em>nová stopa.</em></h1>
        <p className="intro">Objevuj svět, uč se společně se svým parťákem a ukaž, co ve vás je. Dobrodružství začíná na cvičišti.</p>
        {!started ? <button className="primary-cta" onClick={() => setStarted(true)}><Play size={18} fill="currentColor"/> Vyrazit do hry <ChevronRight size={18}/></button> : <div className="active-pill"><span/> Hra spuštěna · Ovládání je aktivní</div>}
        <div className="quick-stats"><div><span className="stat-icon"><PawPrint size={18}/></span><span><b>{activeBreed.name}</b><small>{dogSaved ? dogName : "Vyber si svého parťáka"}</small></span></div><div><span className="stat-icon"><Trophy size={18}/></span><span><b>{pullerScore} bodů</b><small>Dog Puller · {pullerAttempts} pokusů</small></span></div></div>
        <div className="menu-list" aria-label="Výběr aktivity">{menu.map(item => { const Icon = item.icon; return <button key={item.id} className={section === item.id ? "menu-item selected" : "menu-item"} onClick={() => { setSection(item.id); if(item.id !== "world") setStarted(true); }}><span className="menu-icon"><Icon size={20}/></span><span className="menu-text"><b>{item.label}</b><small>{item.detail}</small></span><ChevronRight className="menu-chevron" size={18}/></button> })}</div>
        {showSettings && <div className="settings-panel"><b>Nastavení hry</b><label className="field-label">Grafika</label><select value={quality} onChange={e => setQuality(e.target.value as typeof quality)}><option value="auto">Automatická</option><option value="low">Nízká</option><option value="medium">Střední</option><option value="high">Vysoká</option></select><label className="field-label">Kamera</label><select value={camera} onChange={e => {setCamera(e.target.value as typeof camera); setNotice("Pohled kamery byl změněn.");}}><option value="third-person">Třetí osoba (aktivní)</option><option value="first-person">První osoba (experimentální)</option></select><p>Zvuk: {muted ? "vypnutý" : "zapnutý"} · Zvukové soubory nejsou připojené.</p><button onClick={() => setShowSettings(false)}>Zavřít</button></div>}
        <p className="disclaimer"><CircleHelp size={14}/> Vývojová verze · XP, mince a mise se zatím neukládají do cloudu.</p>
      </div>
      <div className="game-frame">
        <div className="frame-top"><span><i/> ŽIVÉ CVIČIŠTĚ</span><span>PROTOTYP 0.2</span></div>
        <div className="canvas-wrap"><GameCanvas mode={section} active={started} cameraMode={camera} quality={quality}/><div className="scene-caption"><span className="caption-dot"/><span><b>{section === "puller" ? "Puller aréna" : section === "school" ? "Psí škola" : "Hlavní cvičiště"}</b><small>{started ? "WASD / šipky · Shift = běh · mezerník = hod kruhu" : "3D svět čeká na tvůj povel"}</small></span></div>{!started && <button className="scene-play" onClick={() => setStarted(true)}><Play size={16} fill="currentColor"/> Spustit průzkum</button>}</div>
        <div className="touch-controls" aria-label="Dotykové ovládání">
          <div className="direction-pad">
            <button aria-label="Jít dopředu" onPointerDown={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"w",pressed:true}}))} onPointerUp={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"w",pressed:false}}))} onPointerLeave={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"w",pressed:false}}))}>↑</button>
            <div><button aria-label="Zatočit vlevo" onPointerDown={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"a",pressed:true}}))} onPointerUp={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"a",pressed:false}}))} onPointerLeave={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"a",pressed:false}}))}>←</button><button aria-label="Jít dozadu" onPointerDown={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"s",pressed:true}}))} onPointerUp={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"s",pressed:false}}))} onPointerLeave={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"s",pressed:false}}))}>↓</button><button aria-label="Zatočit vpravo" onPointerDown={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"d",pressed:true}}))} onPointerUp={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"d",pressed:false}}))} onPointerLeave={() => window.dispatchEvent(new CustomEvent("game:control",{detail:{key:"d",pressed:false}}))}>→</button></div>
          </div>
          <div className="touch-actions"><button onClick={() => {setStarted(true);window.dispatchEvent(new CustomEvent("puller:throw"));}}><Target size={16}/> Hodit kruh</button><button onClick={() => setCamera(value => value === "third-person" ? "first-person" : "third-person")}>Kamera: {camera === "third-person" ? "3. osoba" : "1. osoba"}</button></div>
        </div>
        <div className="frame-bottom"><span><PawPrint size={15}/> HODNÝ PES</span><span>VÝCVIK · PŘÁTELSTVÍ · ZÁBAVA</span></div>
      </div>
    </section>
    {notice && <div className="notice-bar" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Zavřít oznámení">×</button></div>}
    {showAccount && <section className="feature-panel">
      <div className="panel-heading"><UserRound/><div><h2>Účet hráče</h2><p>{user ? "Přihlášený účet" : "Přihlas se pro budoucí cloudové ukládání"}</p></div></div>
      {user ? <><p className="feature-copy">Přihlášen: {user.email ?? user.id}</p><button className="secondary-action" onClick={signOut}><LogOut size={16}/> Odhlásit</button></> : <form className="auth-form" onSubmit={e => submitAuth(e, "login")}><label className="field-label">E-mail</label><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tvuj@email.cz"/><label className="field-label">Heslo (min. 8 znaků)</label><input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required placeholder="••••••••"/><div className="action-row"><button className="primary-cta" disabled={authBusy} type="submit">{authBusy ? "Pracuji…" : "Přihlásit"}</button><button className="secondary-action" disabled={authBusy} type="button" onClick={() => void signUp()}>Vytvořit účet</button><button className="text-action" type="button" onClick={() => { if (!supabase) {setAuthMessage("Supabase není nakonfigurované."); return;} if(!email.trim()){setAuthMessage("Nejdřív zadej e-mail.");return;} void supabase.auth.resetPasswordForEmail(email.trim(), {redirectTo: window.location.origin + "/account/reset"}).then(({error}) => setAuthMessage(error ? error.message : "Pokud účet existuje, přijde e-mail pro obnovu hesla.")); }}>Obnovit heslo</button></div></form>}
      {!supabase && <p className="status-warning">Chybí proměnné Supabase. Přihlášení není aktivní.</p>}
      {authMessage && <p className="feature-copy" role="status">{authMessage}</p>}
    </section>}
    <section className="feature-grid">
      <article className="feature-panel">
        <div className="panel-heading"><DogIcon/><div><h2>Tvůj psí parťák</h2><p>15 plemen · výběr se uloží v této relaci</p></div></div>
        <label className="field-label">Jméno psa</label><input value={dogName} onChange={e => setDogName(e.target.value)} maxLength={24} placeholder="Jméno psa"/>
        <label className="field-label">Plemeno</label><select value={breedId} onChange={e => {setBreedId(e.target.value);setDogSaved(false);}}>{BREEDS.map(breed => <option key={breed.id} value={breed.id}>{breed.name}</option>)}</select>
        <p className="feature-copy">Barvy dostupné v katalogu: {activeBreed.coat.join(", ")}. V této verzi se mění herní profil; model psa zatím není anatomicky odlišný podle plemene.</p>
        <button className="primary-cta" onClick={() => void saveDog()}><Save size={16}/> {user ? "Uložit psa do účtu" : "Vybrat psa"}</button>
      </article>
      <article className="feature-panel">
        <div className="panel-heading"><GraduationCap/><div><h2>Psí škola</h2><p>Tréninkové akce s jednorázovou odměnou za povel v této relaci</p></div></div>
        <div className="command-grid">{["Sedni","Lehni","Zůstaň","Ke mně","K noze","Čekej","Přines","Pusť","Volno"].map(command => <button key={command} className={trained.includes(command) ? "command-button trained" : "command-button"} onClick={() => {setSection("school");setStarted(true);completeTraining(command);}}>{trained.includes(command) ? "✓ " : ""}{command}</button>)}</div>
        <p className="feature-copy">Procvičeno: {trained.length}/9 · {xp} XP · {coins} mincí. Zatím jen v aktuální relaci, bez cloudového zápisu.</p>
      </article>
      <article className="feature-panel">
        <div className="panel-heading"><Target/><div><h2>Dog Puller</h2><p>Fyzický kruh v 3D scéně · mezerník nebo tlačítko</p></div></div>
        <label className="field-label">Režim</label><select value={pullerMode} onChange={e => setPullerMode(e.target.value as PullerMode)}><option value="practice">Volný trénink</option><option value="running">Running (tréninková pravidla)</option><option value="jumping">Jumping (tréninková pravidla)</option></select>
        <div className="puller-stats"><div><b>{pullerScore}</b><small>body</small></div><div><b>{pullerAttempts}</b><small>chycení</small></div><div><b>{xp}</b><small>XP relace</small></div></div>
        <div className="action-row"><button className="primary-cta" onClick={throwRing}><Play size={16} fill="currentColor"/> Hodit kruh</button><button className="secondary-action" onClick={() => {setPullerScore(0);setPullerAttempts(0);setNotice("Místní statistiky Pulleru byly resetovány.");}}><RotateCcw size={16}/> Reset statistik</button></div>
        <p className="feature-copy">Jde o tréninkové body, nikoli oficiální soutěžní skóre. Pes musí skutečně dojít ke kruhu, aby se pokus započítal.</p>
      </article>
      <article className="feature-panel">
        <div className="panel-heading"><CircleDollarSign/><div><h2>Kosmetický obchod</h2><p>Skutečné ceny a vlastnictví načítané z databáze</p></div></div>
        {user ? <><div className="wallet-balance"><span>Cloudová peněženka</span><b>{walletCoins === null ? "…" : walletCoins + " mincí"}</b></div>
          <div className="shop-list">{shopItems.map(item => { const owned = ownedItems.includes(item.id); return <div className="shop-row" key={item.id}><div><b>{item.name}</b><p>{item.description}</p><small>{item.price} mincí · {item.category}</small></div><button className="secondary-action" disabled={owned || shopBusyItem !== null || walletCoins === null} onClick={() => void buyItem(item)}>{owned ? "Vlastníš" : shopBusyItem === item.id ? "Nakupuji…" : "Koupit"}</button></div>;})}</div>
          {shopMessage && <p className="feature-copy" role="status">{shopMessage}</p>}
        </> : <p className="feature-copy">Přihlas se v panelu Účet hráče. Nové účty dostanou jednorázový startovní zůstatek 100 mincí; nákupy ověřuje databázová transakce. Místní tréninkové mince se do peněženky nepřevádějí.</p>}
      </article>
      <article className="feature-panel">
        <div className="panel-heading"><Trophy/><div><h2>Mise a odměny</h2><p>Odměnu lze vyzvednout pouze jednou v aktuální relaci</p></div></div>
        <div className="mission-list">{MISSIONS.map(mission => {const done = completed.includes(mission.id);return <div className="mission-row" key={mission.id}><div><b>{mission.title}</b><p>{mission.description}</p><small>Odměna: {mission.reward} mincí a XP</small></div><button className="secondary-action" disabled={done} onClick={() => claimMission(mission.id, mission.reward)}>{done ? "Splněno" : "Vyzvednout"}</button></div>;})}</div>
      </article>
    </section>
    <footer><span>© Hodný pes: Psí dobrodružství</span><span>Hra je ve vývoji. Online režim zatím není dostupný.</span></footer>
  </main>;
}
