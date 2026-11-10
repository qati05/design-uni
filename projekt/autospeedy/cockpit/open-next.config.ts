// OpenNext für Cloudflare. Das Cockpit rendert jede Seite pro Anfrage (force-dynamic) und nutzt keinen Next-Cache:
// darum braucht es keinen R2-, KV- oder D1-Cache.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig({});
