"use client";

import dynamic from "next/dynamic";

const Game3D = dynamic(() => import("./Game3D"), {
  ssr: false,
  loading: () => <main className="gameLoading"><div className="loadingPaw">🐾</div><b>Načítám svět Hodný Pes Academy…</b><span>Připravuji areál, pejska a tréninkové zóny</span><div className="loadingBar"><i /></div></main>,
});

export default function Home() {
  return <main className="gamePage"><Game3D /></main>;
}
