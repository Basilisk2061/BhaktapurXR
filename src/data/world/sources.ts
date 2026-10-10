import type { SourceReference } from "@/types/landmark";

export const unescoSources: SourceReference[] = [
  {
    id: "unesco-bhaktapur-monument-zone-2006",
    title: "Bhaktapur monument-zone boundary map (2006)",
    type: "publication", reference: "https://whc.unesco.org/en/documents/103370",
    accessedDate: "2026-10-10",
    supportedClaims: ["Official document 103370 title, date 2006-02-01, and association with Kathmandu Valley; designated primary reference for future map measurements"],
    notes: "UNESCO identifies the source as ICOMOS Evaluation. PDF: https://whc.unesco.org/document/103370. Metadata inspected; local download returned HTTP 403 and screenshot pixels were unavailable. Boundary geometry, footprints, scale-bar endpoints and north-arrow endpoints have NOT been measured. No exact 3D architecture supported.",
  },
  {
    id: "unesco-kathmandu-valley-property",
    title: "UNESCO Kathmandu Valley property",
    type: "publication", reference: "https://whc.unesco.org/en/list/121",
    accessedDate: "2026-10-10",
    supportedClaims: ["Bhaktapur Durbar Square is one of the seven monument-zone components of the Kathmandu Valley World Heritage property"],
    notes: "Property-level context only; not building positions, dimensions or the local world origin.",
  },
  {
    id: "unesco-kathmandu-valley-maps",
    title: "UNESCO Kathmandu Valley maps and component table",
    type: "publication", reference: "https://whc.unesco.org/en/list/121/maps/",
    accessedDate: "2026-10-10",
    supportedClaims: ["Bhaktapur component ID 121bis-003", "Published component coordinate N27 40 20.734 / E85 25 42.481", "Published property area 3.61 ha and buffer area 10.71 ha", "Official maps index lists the 2006 Bhaktapur boundary map"],
    notes: "Coordinate identifies the component. It does not identify an exact building, map anchor, visitor entrance or the BhaktapurXR local origin. Published areas do not determine polygon shape.",
  },
];

export const bhaktapurComponent = {
  id: "121bis-003", name: "Bhaktapur Durbar Square",
  publishedCoordinate: { northDms: [27, 40, 20.734], eastDms: [85, 25, 42.481] },
  propertyAreaHa: 3.61, bufferAreaHa: 10.71,
  accuracy: "VERIFIED", sourceIds: ["unesco-kathmandu-valley-maps"],
  claimScope: "Published component metadata only; not a surveyed local position or boundary geometry",
} as const;
