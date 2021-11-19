export const vectorMapStyleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL || null;
export const vectorMapAttribution =
  "\u003ca href='https://www.maptiler.com/copyright/' target='_blank' \u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e";

export const fallbackMapLayerUrl =
  process.env.NEXT_PUBLIC_FALLBACK_MAP_URL || "";
export const fallbackMapAttribution =
  "\u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e";

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "/";

export const GEOCODER_API_URL = process.env.NEXT_PUBLIC_GEOCODER_API_URL || "/";
