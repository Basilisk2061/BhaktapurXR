/** Palace/Chyasilin use rendered-geometry areas in spatial-zones; their radius is
 * the local viewing depth/margin. Other records retain local entrance-side offsets in the final rendered assembly frame, in metres.
 * These are interaction affordances, not surveyed monument coordinates. */
export const heritageZoneSpecifications:Readonly<Record<string,{offset:readonly [number,number];radius:number}>>={
 "golden-gate":{offset:[0,5.5],radius:4.5},
 "fifty-five-frontage":{offset:[0,0],radius:7},
 "gallery-frontage":{offset:[0,4.5],radius:4.5}, // X comes from the existing museum doorway geometry.
 "gopinath-krishna":{offset:[0,8.2],radius:4.5},
 "vatsala-durga":{offset:[-6.8,0],radius:4.5}, // The corrected stairs face local -X.
 "large-bell":{offset:[-4.8,0],radius:3.5},
 "malla-column":{offset:[-2.7,0],radius:3},
 "chyasilin":{offset:[0,0],radius:3.5},
 "khauma-gate":{offset:[0,5],radius:4.5},
 "yaksheshwar":{offset:[0,6.6],radius:4.5},
 "siddhi-lakshmi":{offset:[0,5.6],radius:4.5}, // Stair foot: local Z=4.5.
 "silu-mahadev":{offset:[0,11.3],radius:4.5}, // Stair foot: local Z=10.1.
};
