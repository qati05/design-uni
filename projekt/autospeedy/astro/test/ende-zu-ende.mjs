// Ende-zu-Ende: echte Anfrage aus dem Browser (Playwright-Mitschnitt) durch die echte Serverfunktion. Aufruf:
//   node test/ende-zu-ende.mjs <post.bin> <post.ct>
import fs from "node:fs";
import { onRequestPost } from "../functions/api/schaden.js";
const [bin, ct] = process.argv.slice(2);
const body = fs.readFileSync(bin), typ = fs.readFileSync(ct, "utf8");
let gesendet = null;
globalThis.fetch = async (url, opt) => { gesendet = JSON.parse(opt.body); return new Response("{}", { status: 200 }); };
const r = await onRequestPost({ request: new Request("https://x.example/api/schaden", { method: "POST", headers: { "Content-Type": typ, "Content-Length": String(body.length) }, body }), env: { MAIL_ENDPUNKT: "https://mail.example", MAIL_SCHLUESSEL: "T", MAIL_AN: "a@example.invalid" } });
console.log("Status", r.status, "Betreff:", gesendet && gesendet.betreff, "Anhänge:", gesendet && gesendet.anhaenge.map((a) => a.name + " " + Math.round(a.inhalt.length * 0.75 / 1024) + " KB").join(", "));
console.log(gesendet && gesendet.text);
