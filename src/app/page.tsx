"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PawPrint, Play, Trophy, GraduationCap, Map, Settings, Volume2, VolumeX, ChevronRight, CircleHelp } from "lucide-react";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), { ssr: false, loading: () => <div className="scene-loading">Připravujeme cvičiště…</div> });

const menu = [
  { id: "world", label: "Otevřený svět", detail: "Prozkoumej cvičiště a okolní louky", icon: Map },
  { id: "school", label: "Psí škola", detail: "Nauč se první povely", icon: GraduationCap },
  { id: "puller", label: "Dog Puller", detail: "Vyzkoušej házení a chytání kruhu", icon: Trophy }
] as const;

export default function Home() {
  const [started, setStarted] = useState(false);
  const [section, setSection] = useState<"world" | "school" | "puller">("world");
  const [muted, setMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Hodný pes – domů"><span className="brand-mark"><PawPrint size={22}/></span><span><b>HODNÝ PES</b><small>PSÍ DOBRODRUŽSTVÍ</small></span></a>
      <div className="top-actions"><span className="build-tag"><i/> VÝPRAVA ZAČÍNÁ</span><button className="icon-button" aria-label={muted ? "Zapnout zvuk" : "Vypnout zvuk"} onClick={() => setMuted(!muted)}>{muted ? <VolumeX/> : <Volume2/>}</button><button className="icon-button" aria-label="Nastavení" onClick={() => setShowSettings(!showSettings)}><Settings/></button></div>
    </header>
    <section className="hero-layout">
      <div className="hero-copy">
        <div className="eyebrow"><span/> TVŮJ PES. TVOJE DOBRODRUŽSTVÍ.</div>
        <h1>Každý den<br/>je <em>nová stopa.</em></h1>
        <p className="intro">Objevuj svět, uč se společně se svým parťákem a ukaž, co ve vás je. Dobrodružství začíná na cvičišti.</p>
        {!started ? <button className="primary-cta" onClick={() => setStarted(true)}><Play size={18} fill="currentColor"/> Vyrazit do hry <ChevronRight size={18}/></button> : <div className="active-pill"><span/> Hra spuštěna · Ovládání je aktivní</div>}
        <div className="quick-stats"><div><span className="stat-icon"><PawPrint size={18}/></span><span><b>15 plemen</b><small>Vyber si parťáka</small></span></div><div><span className="stat-icon"><Trophy size={18}/></span><span><b>Dog Puller</b><small>Trénink i výzvy</small></span></div></div>
        <div className="menu-list" aria-label="Výběr aktivity">{menu.map(item => { const Icon = item.icon; return <button key={item.id} className={section === item.id ? "menu-item selected" : "menu-item"} onClick={() => { setSection(item.id); if(item.id !== "world") setStarted(true); }}><span className="menu-icon"><Icon size={20}/></span><span className="menu-text"><b>{item.label}</b><small>{item.detail}</small></span><ChevronRight className="menu-chevron" size={18}/></button> })}</div>
        {showSettings && <div className="settings-panel"><b>Nastavení hry</b><p>Grafika: automatická · Ovládání: klávesnice nebo dotyk</p><p>Zvuk: {muted ? "vypnutý" : "zapnutý"} (zvukové soubory zatím nejsou připojené)</p><button onClick={() => setShowSettings(false)}>Zavřít</button></div>}
        <p className="disclaimer"><CircleHelp size={14}/> První vývojová verze · Postup se zatím ukládá pouze v této relaci.</p>
      </div>
      <div className="game-frame">
        <div className="frame-top"><span><i/> ŽIVÉ CVIČIŠTĚ</span><span>PROTOTYP 0.1</span></div>
        <div className="canvas-wrap"><GameCanvas mode={section} active={started}/><div className="scene-caption"><span className="caption-dot"/><span><b>{section === "puller" ? "Puller aréna" : section === "school" ? "Psí škola" : "Hlavní cvičiště"}</b><small>{started ? "WASD / šipky · myš nebo dotyk" : "3D svět čeká na tvůj povel"}</small></span></div>{!started && <button className="scene-play" onClick={() => setStarted(true)}><Play size={16} fill="currentColor"/> Spustit průzkum</button>}</div>
        <div className="frame-bottom"><span><PawPrint size={15}/> HODNÝ PES</span><span>VÝCVIK · PŘÁTELSTVÍ · ZÁBAVA</span></div>
      </div>
    </section>
    <footer><span>© Hodný pes: Psí dobrodružství</span><span>Hra je ve vývoji. Online režim zatím není dostupný.</span></footer>
  </main>;
}
