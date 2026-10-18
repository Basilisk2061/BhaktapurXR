import {defineCloudflareConfig} from "@opennextjs/cloudflare";

// No database, R2, KV or additional cache services are needed by this prototype.
export default {
 ...defineCloudflareConfig(),
 // Use the committed npm lockfile workflow and retain the existing prebuild hook.
 buildCommand:"npm run build",
};
