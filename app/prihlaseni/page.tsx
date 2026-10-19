"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, PawPrint, Eye, EyeOff, ShieldCheck } from "lucide-react";
import "./login.css";

export default function LoginPage() {
 const router = useRouter();
 const [nextPath,setNextPath] = useState("/hra");
 const [mode,setMode] = useState<"login"|"signup">("login");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [showPassword,setShowPassword] = useState(false);
 const [busy,setBusy] = useState(false);
 const [message,setMessage] = useState("");
 const [configured,setConfigured] = useState(true);
 const [client,setClient] = useState<ReturnType<typeof createBrowserClient>|null>(null);
 useEffect(()=> {
  const params = new URLSearchParams(window.location.search);
  const requested=params.get("next") || "/hra"; setNextPath(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/hra");
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key){setConfigured(false);return;}
  const sb=createBrowserClient(url,key);setClient(sb);
  sb.auth.getUser().then(({data})=>{if(data.user) router.replace(nextPath);});
 },[router]);
 async function submit(e:FormEvent) {
  e.preventDefault(); if(!client)return;
  setBusy(true);setMessage("");
  const result = mode==="login"
   ? await client.auth.signInWithPassword({email,password})
   : await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+"/auth/callback?next=/hra"}});
  setBusy(false);
  if(result.error){setMessage(result.error.message);return;}
  if(mode==="signup"&&!result.data.session){setMessage("Účet je vytvořený. Potvrď e-mail a potom se přihlas.");return;}
  router.replace(nextPath);router.refresh();
 }
 async function oauth(provider:"google"|"apple") {
  if(!client)return;setBusy(true);setMessage("");
  const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+"/auth/callback?next=/hra"}});
  if(error){setBusy(false);setMessage(error.message);}
 }
 return <main className="login-page"><Link href="/" className="login-back"><ArrowLeft size={17}/> Zpět na úvod</Link><section className="login-card"><div className="login-mark"><PawPrint size={28}/></div><span className="login-eyebrow">HODNÝ PES · PSÍ DOBRODRUŽSTVÍ</span><h1>{mode==="login"?"Vítej zpátky!":"Přidej se do dobrodružství."}</h1><p className="login-lead">Přihlas se, ať můžeš pokračovat ve svém světě a mít svůj postup spojený s účtem.</p>
 {configured?<><div className="login-tabs"><button className={mode==="login"?"active":""} onClick={()=>{setMode("login");setMessage("")}}>Přihlášení</button><button className={mode==="signup"?"active":""} onClick={()=>{setMode("signup");setMessage("")}}>Vytvořit účet</button></div><form onSubmit={submit}><label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" placeholder="ty@email.cz"/></label><label>Heslo<span className="password-field"><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} autoComplete={mode==="login"?"current-password":"new-password"} placeholder="Alespoň 6 znaků"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Skrýt heslo":"Zobrazit heslo"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label><button className="login-submit" disabled={busy||!client}>{busy?"Chvilku strpení…":mode==="login"?"Přihlásit se":"Vytvořit účet"}</button></form><div className="login-divider"><span>nebo pokračuj přes</span></div><div className="oauth-row"><button disabled={busy||!client} onClick={()=>oauth("google")}>Google</button><button disabled={busy||!client} onClick={()=>oauth("apple")}>Apple</button></div>{message&&<p className="login-message" role="status">{message}</p>}<p className="login-security"><ShieldCheck size={15}/> Účet a přihlášení zajišťuje Supabase.</p></>:<div className="login-message config-message"><b>Přihlášení zatím není nakonfigurované.</b><p>V prostředí nasazení je potřeba nastavit NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY a povolit Google/Apple v Supabase Authentication.</p></div>}
 </section><p className="login-foot">Hra je inspirovaná pozitivním přístupem ke psům. Nenahrazuje skutečný výcvik.</p></main>;
}
