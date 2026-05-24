// Demo parcel boundaries (simple rectangles around each project's lat/lng).
// In production these would come from licensed surveyor site plans + LC registry.
export type Parcel = {
  projectId: string;
  name: string;
  ringMeters: number; // half-diagonal in metres
  status: "clean" | "encroachment" | "disputed";
  encroachment?: {
    note: string;
    polygon: [number, number][]; // [lng, lat]
  };
};

function rectAround(lng: number, lat: number, halfM: number): [number, number][] {
  const dLat = halfM / 111_000;
  const dLng = halfM / (111_000 * Math.cos((lat * Math.PI) / 180));
  return [
    [lng - dLng, lat - dLat],
    [lng + dLng, lat - dLat],
    [lng + dLng, lat + dLat],
    [lng - dLng, lat + dLat],
    [lng - dLng, lat - dLat],
  ];
}

export const PARCELS: Record<string, { polygon: [number, number][]; meta: Parcel }> = {
  "east-legon-plot": {
    polygon: rectAround(-0.1421, 5.6512, 90),
    meta: {
      projectId: "east-legon-plot",
      name: "East Legon Hills — 2.5 acres",
      ringMeters: 90,
      status: "encroachment",
      encroachment: {
        note: "3rd-party foundation works 14 m inside the eastern boundary",
        polygon: [
          [-0.14130, 5.65095],
          [-0.14110, 5.65095],
          [-0.14110, 5.65135],
          [-0.14130, 5.65135],
          [-0.14130, 5.65095],
        ],
      },
    },
  },
  "kasoa-4bed": {
    polygon: rectAround(-0.4156, 5.5421, 28),
    meta: {
      projectId: "kasoa-4bed",
      name: "Kasoa 4-bed parcel",
      ringMeters: 28,
      status: "clean",
    },
  },
  "ho-poultry": {
    polygon: rectAround(0.471, 6.612, 80),
    meta: {
      projectId: "ho-poultry",
      name: "Ho poultry coop footprint",
      ringMeters: 80,
      status: "clean",
    },
  },
  "tema-civic": {
    polygon: rectAround(0.012, 5.671, 60),
    meta: {
      projectId: "tema-civic",
      name: "Tema Port — customs yard",
      ringMeters: 60,
      status: "clean",
    },
  },
};
