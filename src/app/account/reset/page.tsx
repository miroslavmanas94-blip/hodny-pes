"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) { setMessage("Supabase není nakonfigurované."); return; }
    if (password.length < 8) { setMessage("Heslo musí mít alespoň 8 znaků."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Heslo bylo změněno. Nyní se můžeš vrátit do hry.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Heslo se nepodařilo změnit.");
    } finally { setBusy(false); }
  }

  return <main className="app-shell" style={{maxWidth:560,paddingTop:70}}>
    <Link className="brand" href="/"><span className="brand-mark"><PawPrint size={22}/></span><span><b>HODNÝ PES</b><small>OBNOVA ÚČTU</small></span></Link>
    <section className="feature-panel" style={{marginTop:34}}>
      <h1>Nové heslo</h1>
      <p className="feature-copy">Otevři tuto stránku přes odkaz z e-mailu pro obnovu hesla.</p>
      <form className="auth-form" onSubmit={save}>
        <label className="field-label">Nové heslo</label>
        <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Alespoň 8 znaků"/>
        <button className="primary-cta" type="submit" disabled={busy}>{busy ? "Ukládám…" : "Změnit heslo"}</button>
      </form>
      {message && <p className="feature-copy" role="status">{message}</p>}
      <p><Link href="/">Zpět do hry</Link></p>
    </section>
  </main>;
}
