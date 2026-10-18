import type {NextConfig} from "next";
import {networkInterfaces} from "node:os";
// Next dev validates Origin/Referer hostnames independently of its bind address.
// Allow this server's current interface addresses, not every host on a private network.
const lanDevOrigins=process.env.NODE_ENV==='development'
 ? [...new Set(Object.values(networkInterfaces()).flatMap(entries=>(entries??[]).filter(entry=>!entry.internal&&entry.family==='IPv4').map(entry=>entry.address)))]
 : [];
const nextConfig:NextConfig={allowedDevOrigins:lanDevOrigins,devIndicators:false,async headers(){return [{source:"/world-data/chunk-:file",headers:[{key:"Cache-Control",value:"public, max-age=31536000, immutable"}]}];}};
export default nextConfig;
