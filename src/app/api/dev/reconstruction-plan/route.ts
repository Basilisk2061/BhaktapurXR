import {readFile} from "node:fs/promises";
import {join} from "node:path";
export const runtime="nodejs";
export async function GET(){
 if(process.env.NODE_ENV!=="development")return new Response("Not found",{status:404});
 const image=await readFile(join(process.cwd(),"reference/bhaktapur/digital-himalaya/map.jpg"));
 return new Response(new Uint8Array(image),{headers:{"Content-Type":"image/jpeg","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
}
