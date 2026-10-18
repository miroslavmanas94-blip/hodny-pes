"use client";

import { useEffect, useMemo, useState } from "react";
import "./farm.css";
import { ArrowUpRight, CalendarDays, Check, ChevronRight, CircleHelp, Coins, Dog, Heart, House, Languages, Leaf, Map, Plus, ShoppingBag, Sparkles, Star, X } from "lucide-react";

type Building = { type: string; name: string; icon: string; cost: number; color: string };
type Plot = { id: number; r: number; c: number; owned: boolean };
const BUILDINGS: Building[] = [
  { type: "kennel", name: "Útulný kotec", icon: "🏡", cost: 120, color: "#f7c979" },
  { type: "training", name: "Cvičiště", icon: "🎾", cost: 180, color: "#a6d78a" },
  { type: "shop", name: "Psí obchůdek", icon: "🛍️", cost: 240, color: "#f4a5a5" },
  { type: "salon", name: "Psí salon", icon: "🫧", cost: 280, color: "#a9d8ef" },
  { type: "puller", name: "Dog Puller aréna", icon: "⭕", cost: 320, color: "#c6b3f4" },
  { type: "garden", name: "Voňavá zahrada", icon: "🌳", cost: 90, color: "#9ed49b" },
];
const DOGS = [
  { name: "Monty", breed: "Sheltie", icon: "🐕", trait: "Zvědavý průzkumník" },
  { name: "Bety", breed: "Corgi", icon: "🐶", trait: "Veselá parťačka" },
  { name: "Rex", breed: "Border kolie", icon: "🐕‍🦺", trait: "Chytrý šikula" },
  { name: "Luna", breed: "Zlatý retrívr", icon: "🦮", trait: "Milovnice aportu" },
  { name: "Flek", breed: "Dalmatin", icon: "🐕", trait: "Malý dobrodruh" },
];
const tileCenter = (r: number, c: number) => ({ x: 350 + (c - r) * 53, y: 72 + (c + r) * 27 });

export default function FarmGame() {
  const [coins, setCoins] = useState(350);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [owned, setOwned] = useState<number[]>([7, 8, 9, 12, 13, 14, 15, 16, 17, 20, 21, 22]);
  const [buildings, setBuildings] = useState<Record<number, string>>({ 8: "kennel", 13: "training", 16: "garden" });
  const [activeDog, setActiveDog] = useState(0);
  const [selectedBuild, setSelectedBuild] = useState<string | null>(null);
  const [panel, setPanel] = useState<"dogs" | "build" | "quests" | "map" | "help" | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [language, setLanguage] = useState<"cs" | "en">("cs");
  const [loaded, setLoaded] = useState(false);

  const en = language === "en";
  const t = (cs: string, english: string) => en ? english : cs;
  const plots: Plot[] = useMemo(() => Array.from({ length: 36 }, (_, id) => ({ id, r: Math.floor(id / 6), c: id % 6, owned: owned.includes(id) })), [owned]);
  const dog = DOGS[activeDog];
  const nextLevelXp = level * 100;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hodny-pes-isometric-save-v1");
      if (raw) {
        const save = JSON.parse(raw);
        if (typeof save.coins === "number") setCoins(save.coins);
        if (typeof save.xp === "number") { setXp(save.xp); setLevel(Math.floor(save.xp / 100) + 1); }
        if (Array.isArray(save.owned)) setOwned(save.owned);
        if (save.buildings && typeof save.buildings === "object") setBuildings(save.buildings);
        if (Array.isArray(save.completed)) setCompleted(save.completed);
        if (typeof save.activeDog === "number") setActiveDog(Math.max(0, Math.min(DOGS.length - 1, save.activeDog)));
        if (save.language === "en") setLanguage("en");
      }
    } catch { /* A damaged local save must not prevent the game from opening. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hodny-pes-isometric-save-v1", JSON.stringify({ coins, xp, owned, buildings, completed, activeDog, language }));
  }, [loaded, coins, xp, owned, buildings, completed, activeDog, language]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const award = (amount: number, experience = 10) => {
    setCoins(v => v + amount);
    const newXp = xp + experience;
    const newLevel = Math.floor(newXp / 100) + 1;
    setXp(newXp);
    if (newLevel > level) notify(en ? "Level up! A new chapter awaits!" : "Nová úroveň! Otevírá se další kapitola!");
    setLevel(newLevel);
  };
  const claimQuest = (id: string, label: string, reward: number, experience: number) => {
    if (completed.includes(id)) return;
    setCompleted(v => [...v, id]); award(reward, experience); notify((en ? "Quest complete: " : "Úkol splněn: ") + label + " +" + reward + " " + (en ? "Pawcoins" : "Hafíků"));
  };
  const buyPlot = (id: number) => {
    if (owned.includes(id)) return;
    if (coins < 100) { notify(t("Na rozšíření potřebuješ 100 Hafíků.", "You need 100 Pawcoins to expand.")); return; }
    const near = owned.some(own => Math.abs(Math.floor(own / 6) - Math.floor(id / 6)) + Math.abs(own % 6 - id % 6) === 1);
    if (!near) { notify(t("Nejdřív rozšiř pozemek vedle svého areálu.", "Expand a neighbouring plot first.")); return; }
    setCoins(v => v - 100); setOwned(v => [...v, id]); award(0, 15); notify(t("Nový pozemek je tvůj!", "New land unlocked!"));
  };
  const handlePlot = (plot: Plot) => {
    if (!plot.owned) { buyPlot(plot.id); return; }
    if (selectedBuild) {
      const buildType = selectedBuild;
      if (buildings[plot.id]) { notify(t("Na tomto místě už něco stojí.", "This plot is already occupied.")); return; }
      const item = BUILDINGS.find(b => b.type === buildType);
      if (!item) return;
      if (coins < item.cost) { notify(t("Na tuto budovu zatím nemáš dost Hafíků.", "Not enough Pawcoins for this building yet.")); return; }
      setCoins(v => v - item.cost); setBuildings(v => ({ ...v, [plot.id]: buildType })); setSelectedBuild(null); award(0, 20); notify(t("Postavil/a jsi: ", "Built: ") + item.name);
      return;
    }
    const building = buildings[plot.id];
    if (building === "kennel") { setPanel("dogs"); return; }
    if (building === "training") { claimQuest("train", t("První trénink", "First training"), 45, 25); return; }
    if (building === "garden") { claimQuest("garden", t("Prozkoumaná zahrada", "Garden explored"), 25, 10); return; }
    if (building === "shop") { claimQuest("shop", t("Návštěva obchůdku", "Shop visit"), 50, 15); return; }
    if (building === "salon") { claimQuest("salon", t("Psí wellness", "Dog wellness"), 50, 15); return; }
    if (building === "puller") { claimQuest("puller", t("První Dog Puller výzva", "First Dog Puller challenge"), 60, 25); return; }
    notify(t("Vyber budovu v nabídce a umísti ji sem.", "Choose a building and place it here."));
  };

  return <main className="farmApp">
    <header className="farmTopbar">
      <a className="farmBrand" href="https://hodnypes.cz/" target="_blank" rel="noreferrer"><span className="brandPaw">🐾</span><span><b>HODNÝ PES</b><small>{t("PSÍ CENTRUM · TVŮJ PŘÍBĚH", "DOG CENTRE · YOUR STORY")}</small></span></a>
      <div className="farmTopLinks"><span className="onlinePill"><i/> {t("Tvůj areál", "Your centre")}</span><button className="iconButton" title={t("Nápověda", "Help")} onClick={() => setPanel("help")}><CircleHelp size={18}/></button><button className="iconButton" title={t("Jazyk", "Language")} onClick={() => setLanguage(v => v === "cs" ? "en" : "cs")}><Languages size={18}/><small>{language.toUpperCase()}</small></button><a className="brandCta" href="https://hodnypes.cz/" target="_blank" rel="noreferrer">{t("Navštívit Hodný pes", "Visit Hodný pes")} <ArrowUpRight size={15}/></a></div>
    </header>
    <div className="farmLayout">
      <aside className="farmSidebar">
        <div className="playerCard"><div className="playerAvatar">{dog.icon}</div><div><small>{t("SPRÁVCE CENTRA", "CENTRE MANAGER")}</small><b>{t("Psí dobrodruh", "Dog adventurer")}</b><span>{t("Úroveň", "Level")} {level} · {dog.name}</span></div><Star size={17} fill="currentColor"/></div>
        <div className="levelBlock"><div className="levelMeta"><span>{t("Postup centra", "Centre progress")}</span><b>{xp % 100}/100 XP</b></div><div className="xpTrack"><i style={{ width: (xp % 100) + "%" }}/></div><small>{t("Každý splněný úkol posouvá tvé centrum dál.", "Every completed quest grows your centre.")}</small></div>
        <div className="sideSectionTitle">{t("TVŮJ AREÁL", "YOUR CENTRE")}</div>
        <button className="sideLink active" onClick={() => setPanel(null)}><House size={18}/>{t("Přehled centra", "Centre overview")}<ChevronRight size={15}/></button>
        <button className="sideLink" onClick={() => setPanel("dogs")}><Dog size={18}/>{t("Moji pejsci", "My dogs")}<span className="sideCount">5</span></button>
        <button className="sideLink" onClick={() => { setPanel("build"); setSelectedBuild(null); }}><ShoppingBag size={18}/>{t("Budovy a dekorace", "Buildings & decor")}<ChevronRight size={15}/></button>
        <button className="sideLink" onClick={() => setPanel("quests")}><CalendarDays size={18}/>{t("Mise a úkoly", "Missions & quests")}<span className="sideCount">{Math.max(0, 4-completed.length)}</span></button>
        <button className="sideLink" onClick={() => setPanel("map")}><Map size={18}/>{t("Rozšířit pozemek", "Expand land")}<ChevronRight size={15}/></button>
        <div className="sidePromo"><div className="promoIcon">🐾</div><b>{t("Skutečný svět čeká!", "The real world awaits!")}</b><p>{t("Hra je jen začátek. Objev tréninky, akce a komunitu Hodný pes.", "The game is just the beginning. Discover training, events and the Hodný pes community.")}</p><a href="https://hodnypes.cz/" target="_blank" rel="noreferrer">{t("Objev hodnypes.cz", "Explore hodnypes.cz")} <ArrowUpRight size={14}/></a></div>
        <div className="sidebarFoot"><span>🐶</span><p>{t("Rosteme spolu, s respektem a radostí.", "Growing together with kindness.")}</p></div>
      </aside>

      <section className="farmMain">
        <div className="welcomeRow"><div><div className="eyebrow"><Sparkles size={14}/>{t("VÍTEJ VE SVÉM PSÍM SVĚTĚ", "WELCOME TO YOUR DOG WORLD")}</div><h1>{t("Tady začíná tvůj", "Your story starts")} <em>{t("psí příběh.", "dog adventure.")}</em></h1><p>{t("Vybuduj centrum, kde se každý pejsek cítí jako doma.", "Build a place where every dog feels at home.")}</p></div><div className="coinWallet"><span className="coinIcon"><Coins size={19}/></span><div><small>{t("TVOJE MĚNA", "YOUR CURRENCY")}</small><b>{coins.toLocaleString(language === "cs" ? "cs-CZ" : "en-US")} <span>🐾</span></b><small>{t("Hafíky", "Pawcoins")}</small></div><button onClick={() => setPanel("quests")} aria-label={t("Jak získat Hafíky", "How to earn Pawcoins")}><Plus size={17}/></button></div></div>

        <div className="farmHero">
          <div className="heroCopy"><span className="chapterPill"><Leaf size={13}/>{t("KAPITOLA 1 · PRVNÍ TLAPKY", "CHAPTER 1 · FIRST PAWS")}</span><h2>{t("Malý areál. Velké sny.", "A small centre. Big dreams.")}</h2><p>{t("Začni s několika budovami, poznej své psy a proměň prázdný pozemek v nejúžasnější psí centrum.", "Start with a few buildings, meet your dogs and turn your land into an amazing dog centre.")}</p><button className="heroButton" onClick={() => { setPanel("build"); setSelectedBuild(null); }}>{t("Rozvíjet centrum", "Grow your centre")} <ArrowUpRight size={16}/></button><div className="heroPerks"><span><Check size={13}/> {t("Hraj zdarma", "Free to play")}</span><span><Check size={13}/> {t("Tvoje tempo", "Your pace")}</span></div></div>
          <div className="heroIllustration" aria-hidden="true"><div className="heroSun"/><div className="heroCloud cloudA"/><div className="heroCloud cloudB"/><div className="heroHill hillA"/><div className="heroHill hillB"/><div className="heroHouse">🏡</div><div className="heroDog">{dog.icon}</div><span className="floatHeart">♥</span><span className="floatSpark">✦</span><span className="floatPaw">🐾</span></div>
        </div>

        <div className="sectionHeading"><div><span className="sectionKicker">{t("ŽIVÝ AREÁL", "YOUR LIVING CENTRE")}</span><h2>{t("Tvoje psí centrum", "Your dog centre")}</h2><p>{t("Klepni na pozemek, budovu nebo pejska a pusť se do práce.", "Tap a plot, building or dog to get started.")}</p></div><button className="softButton" onClick={() => setPanel("map")}><Map size={15}/>{t("Mapa", "Map")}</button></div>
        <div className="gameBoardWrap">
          <div className="boardLegend"><span><i className="legendGreen"/> {t("Tvůj pozemek", "Your land")}</span><span><i className="legendGold"/> {t("Klepnutím rozšíříš", "Tap to expand")}</span><span className="boardZoom">{t("36 pozemků · ", "36 plots · ")}{owned.length}/36</span></div>
          <svg className="isometricBoard" viewBox="0 0 700 420" role="img" aria-label={t("Izometrická mapa psího centra. Klepni na volný pozemek nebo budovu.", "Isometric dog centre map. Tap land or a building.")}>
            <ellipse cx="350" cy="250" rx="278" ry="130" fill="#7c9c55" opacity=".12"/>
            {plots.map(plot => {
              const {x,y}=tileCenter(plot.r,plot.c);
              const points = `${x},${y} ${x+53},${y+27} ${x},${y+54} ${x-53},${y+27}`;
              const type=buildings[plot.id];
              const item=BUILDINGS.find(b=>b.type===type);
              return <g key={plot.id} className={"plotGroup " + (plot.owned ? "plotOwned" : "plotLocked")} onClick={() => handlePlot(plot)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")handlePlot(plot)}} aria-label={plot.owned ? (item?.name || t("Volný pozemek","Empty plot")) : t("Odemknout pozemek za 100 Hafíků","Unlock plot for 100 Pawcoins")}>
                <polygon points={points} fill={plot.owned ? ((plot.r+plot.c)%3===0 ? "#b5d98a" : (plot.r+plot.c)%3===1 ? "#a8cf7b" : "#c1df99") : "#d9d0a9"} stroke={plot.owned ? "#7ba45a" : "#b7a776"} strokeWidth="1.5"/>
                {plot.owned && <path d={`M ${x-20} ${y+27} l 10 -5 M ${x+9} ${y+35} l 9 -4`} stroke="#8db56b" strokeWidth="2" opacity=".5" strokeLinecap="round"/>}
                {!plot.owned && <><text x={x} y={y+24} textAnchor="middle" fontSize="16">🔒</text><text x={x} y={y+42} textAnchor="middle" fontSize="8" fill="#766b4c">100 🐾</text></>}
                {item && <><ellipse cx={x} cy={y+23} rx="25" ry="10" fill="#647f4b" opacity=".22"/><text x={x} y={y+25} textAnchor="middle" fontSize={type==="garden"?27:32}>{item.icon}</text><text x={x} y={y+43} textAnchor="middle" fontSize="8" fontWeight="700" fill="#4b573d">{item.name}</text></>}
              </g>;
            })}
            <g className="mapDog" onClick={() => setPanel("dogs")} role="button" tabIndex={0} aria-label={t("Vybrat pejska","Choose dog")}><ellipse cx="350" cy="243" rx="23" ry="9" fill="#617a46" opacity=".24"/><text x="350" y="239" textAnchor="middle" fontSize="32">{dog.icon}</text><text x="350" y="255" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4d6239">{dog.name}</text></g>
            <g transform="translate(42 28)"><rect width="112" height="35" rx="12" fill="#fffdf6" stroke="#e8e1ca"/><text x="12" y="14" fontSize="8" fill="#9a936f" fontWeight="700">{t("CENTRUM ÚROVEŇ","CENTRE LEVEL")}</text><text x="12" y="27" fontSize="11" fill="#4d6239" fontWeight="800">LVL {level}</text></g>
          </svg>
          {selectedBuild && <div className="placementHint"><span>📍</span>{t("Vyber volný pozemek pro: ", "Choose an empty plot for: ")}<b>{BUILDINGS.find(b=>b.type===selectedBuild)?.name}</b><button onClick={() => setSelectedBuild(null)}><X size={15}/></button></div>}
        </div>

        <div className="lowerGrid">
          <section className="contentCard"><div className="cardHeading"><div><span className="sectionKicker">{t("DNEŠNÍ PLÁN", "TODAY'S PLAN")}</span><h3>{t("Malé kroky, velké tlapky", "Small steps, big paws")}</h3></div><button onClick={() => setPanel("quests")}>{t("Všechny mise", "All quests")} <ChevronRight size={14}/></button></div>
            {[{id:"welcome",title:t("Vítej v centru!", "Welcome to the centre!"),desc:t("Rozhlédni se po svém novém areálu.", "Take a look around your new centre."),reward:30,icon:"👋",xp:10},{id:"train",title:t("První trénink", "First training"),desc:t("Klepni na cvičiště a splň první výzvu.", "Tap the training field and complete your first challenge."),reward:45,icon:"🎾",xp:25},{id:"garden",title:t("Prozkoumej zahradu", "Explore the garden"),desc:t("Udělej si chvilku na průzkum areálu.", "Take a moment to explore the grounds."),reward:25,icon:"🌿",xp:10}].map(q=><div className={"questRow "+(completed.includes(q.id)?"questComplete":"")} key={q.id}><span className="questIcon">{q.icon}</span><div className="questText"><b>{q.title}</b><small>{q.desc}</small></div><span className="questReward">+{q.reward} 🐾</span><button aria-label={q.title} onClick={() => q.id==="welcome" ? claimQuest(q.id,q.title,q.reward,q.xp) : (setPanel(null),notify(t("Najdi příslušnou budovu na mapě.", "Find the matching building on the map.")))} disabled={completed.includes(q.id)}>{completed.includes(q.id)?<Check size={16}/>:<ChevronRight size={17}/>}</button></div>)}
          </section>
          <section className="contentCard dogCard"><div className="cardHeading"><div><span className="sectionKicker">{t("TVŮJ PARŤÁK", "YOUR COMPANION")}</span><h3>{t("Dnes s tebou", "By your side")}</h3></div><button onClick={() => setPanel("dogs")}>{t("Všichni psi", "All dogs")} <ChevronRight size={14}/></button></div><div className="featuredDog"><div className="featuredDogArt">{dog.icon}<span>♥</span></div><div><span className="dogBreed">{dog.breed}</span><h4>{dog.name}</h4><p>{dog.trait}</p><div className="bondBar"><i style={{width:Math.min(100,35+completed.length*12)+"%"}}/></div><small>{t("Pouto s tebou", "Bond with you")}: {Math.min(100,35+completed.length*12)}%</small></div></div><button className="wideSoftButton" onClick={() => setPanel("dogs")}><Heart size={15}/>{t("Vybrat psího parťáka", "Choose your companion")}</button></section>
        </div>
        <footer className="farmFooter"><span>🐾 {t("Hodný pes · Psí centrum", "Hodný pes · Dog centre")}</span><span>{t("Hra zdarma · Více psí radosti na", "Free game · More dog joy at")} <a href="https://hodnypes.cz/" target="_blank" rel="noreferrer">hodnypes.cz ↗</a></span></footer>
      </section>
    </div>

    {panel && <div className="farmModalBackdrop" onClick={() => {setPanel(null);setSelectedBuild(null);}}><section className="farmModal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><header><div><span className="sectionKicker">{t("HODNÝ PES · TVŮJ AREÁL", "HODNÝ PES · YOUR CENTRE")}</span><h2>{panel==="dogs"?t("Tvoji psí parťáci","Your dog companions"):panel==="build"?t("Budovy a dekorace","Buildings & decor"):panel==="quests"?t("Mise a odměny","Quests & rewards"):panel==="map"?t("Rozšiř svůj areál","Expand your centre"):t("Jak hrát","How to play")}</h2></div><button className="iconButton" onClick={() => {setPanel(null);setSelectedBuild(null);}} aria-label={t("Zavřít","Close")}><X size={19}/></button></header>
      {panel==="dogs" && <><p className="modalIntro">{t("Vyber pejska, který tě dnes bude provázet. Další plemena můžeš postupně odemykat.", "Choose the dog joining you today. More breeds will unlock as you progress.")}</p><div className="dogChoices">{DOGS.map((d,i)=><button key={d.name} className={"dogChoice "+(i===activeDog?"dogChoiceActive":"")} onClick={() => {setActiveDog(i);notify(t("Tvým parťákem je ", "Your companion is now ")+d.name);}}><span className="dogChoiceArt">{d.icon}</span><span><b>{d.name}</b><small>{d.breed}</small><em>{d.trait}</em></span>{i===activeDog&&<Check size={17}/>}</button>)}</div><p className="modalNote">{t("První verze obsahuje pět výběrových psích postav. Další animace a odemykání budou přidávány v dalších etapách.", "This first version includes five selectable dog characters. More animations and unlocks will be added in later stages.")}</p></>}
      {panel==="build" && <><p className="modalIntro">{t("Vyber budovu, kterou chceš postavit. Pak klepni na volný pozemek na mapě.", "Choose a building to build, then tap an empty owned plot on the map.")}</p><div className="buildingChoices">{BUILDINGS.map(b=><button key={b.type} className={"buildingChoice "+(selectedBuild===b.type?"buildingSelected":"")} onClick={() => {setSelectedBuild(b.type);setPanel(null);notify(t("Vyber volný pozemek na mapě.", "Choose an empty plot on the map."));}}><span style={{background:b.color}}>{b.icon}</span><div><b>{b.name}</b><small>{t("Nová budova centra", "New centre building")}</small></div><strong>{b.cost} 🐾</strong></button>)}</div></>}
      {panel==="quests" && <><p className="modalIntro">{t("Plň úkoly, získávej Hafíky a rozšiřuj svůj psí svět.", "Complete quests, earn Pawcoins and expand your dog world.")}</p>{[{id:"welcome",title:t("Vítej v centru!", "Welcome to the centre!"),reward:30,xp:10},{id:"train",title:t("První trénink", "First training"),reward:45,xp:25},{id:"garden",title:t("Prozkoumej zahradu", "Explore the garden"),reward:25,xp:10},{id:"shop",title:t("Navštiv obchůdek", "Visit the shop"),reward:50,xp:15},{id:"puller",title:t("První Dog Puller výzva", "First Dog Puller challenge"),reward:60,xp:25}].map(q=><div className="modalQuest" key={q.id}><div><b>{q.title}</b><small>{completed.includes(q.id)?t("Splněno","Completed"):t("Odměna za první splnění","First completion reward")}</small></div><strong>+{q.reward} 🐾</strong><button disabled={completed.includes(q.id)} onClick={() => {if(q.id==="welcome")claimQuest(q.id,q.title,q.reward,q.xp);else {setPanel(null);notify(t("Navštiv příslušnou budovu na mapě.", "Visit the matching building on the map."));}}}>{completed.includes(q.id)?<Check size={15}/>:t("Zobrazit","Find")}</button></div>)}</>}
      {panel==="map" && <><p className="modalIntro">{t("Rozšiřuj areál po sousedních pozemcích. Každý nový pozemek stojí 100 Hafíků.", "Expand into neighbouring plots. Each new plot costs 100 Pawcoins.")}</p><div className="expandStats"><div><span>{t("Vlastní pozemky","Owned plots")}</span><b>{owned.length}/36</b></div><div><span>{t("Další pozemek","Next plot")}</span><b>100 🐾</b></div><div><span>{t("Budovy","Buildings")}</span><b>{Object.values(buildings).length}</b></div></div><button className="modalPrimary" onClick={() => {setPanel(null);notify(t("Na mapě klepni na sousední zamčený pozemek.", "Tap a neighbouring locked plot on the map."));}}>{t("Vybrat pozemek na mapě","Choose land on the map")} <ArrowUpRight size={16}/></button></>}
      {panel==="help" && <div className="helpContent"><p>🐾 <b>{t("Rozšiřuj","Expand")}</b> — {t("klepni na sousední zamčený pozemek a zaplať 100 Hafíků.", "tap a neighbouring locked plot and pay 100 Pawcoins.")}</p><p>🏡 <b>{t("Stavěj","Build")}</b> — {t("otevři Budovy a dekorace, vyber budovu a umísti ji na volný pozemek.", "open Buildings & decor, choose a building and place it on an empty plot.")}</p><p>🐕 <b>{t("Poznej psy","Meet the dogs")}</b> — {t("v nabídce Moji pejsci vyber jednoho z pěti parťáků.", "choose one of five companions under My dogs.")}</p><p>🎁 <b>{t("Získávej odměny","Earn rewards")}</b> — {t("navštěvuj budovy a plň první úkoly. Postup se ukládá v tomto prohlížeči.", "visit buildings and complete starter quests. Progress saves in this browser.")}</p><p>🌐 <b>{t("Skutečný Hodný pes","Real Hodný pes")}</b> — {t("klikni na odkaz na hodnypes.cz pro skutečné tréninky, akce a informace.", "follow the link to hodnypes.cz for real training, events and information.")}</p></div>}
      <footer className="modalFooter"><span>{t("Hafíky", "Pawcoins")}: <b>{coins}</b> 🐾</span><button onClick={() => {setPanel(null);setSelectedBuild(null);}}>{t("Zpět do centra","Back to centre")}</button></footer>
    </section></div>}
    {toast && <div className="farmToast"><Sparkles size={16}/>{toast}</div>}
    <a className="floatingWebsiteCta" href="https://hodnypes.cz/" target="_blank" rel="noreferrer"><span>🐾</span><span><b>{t("Hodný pes v reálném světě","Hodný pes in real life")}</b><small>{t("Tréninky, akce a psí komunita","Training, events and dog community")}</small></span><ArrowUpRight size={17}/></a>
  </main>;
}
