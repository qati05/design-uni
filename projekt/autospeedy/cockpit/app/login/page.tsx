import { LoginFormular } from "./LoginFormular";

export default function LoginSeite() {
  const demo = process.env.COCKPIT_DEMO === "1";
  return (
    <main className="seite schmal anmelden">
      <img src="/bilder/logo-96.webp" width={135} height={48} alt="Auto Speedy AG" />
      <h1>Werkstatt-Cockpit</h1>
      <p className="unterzeile">Anmelden mit einem Code per Mail, danach mit dem Code aus der Authenticator-App.</p>
      <LoginFormular />
      {demo ? <p className="hinweis">Demo: Mail-Adresse <b>werkstatt@autospeedy.example</b>. Den Code finden Sie im <a href="/demo/postfach" target="_blank">Demo-Postfach</a>, den zweiten Code im <a href="/demo/authenticator" target="_blank">Demo-Authenticator</a>.</p> : null}
    </main>
  );
}
