import { Unmutable } from "src/types/Unmutable";

const constants = {
  vectorMapStyleUrl: process.env.NEXT_PUBLIC_MAP_STYLE_URL!,
  vectorMapAttribution:
    "\u003ca href='https://www.maptiler.com/copyright/' target='_blank' \u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
  fallbackMapLayerUrl: process.env.NEXT_PUBLIC_FALLBACK_MAP_URL!,
  fallbackMapAttribution:
    "\u003ca href='https://www.openstreetmap.org/copyright' target='_blank'\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL!,
  CONFIG_API_URL: process.env.NEXT_PUBLIC_CONFIG_API_URL!,
  GEOCODER_API_URL: process.env.NEXT_PUBLIC_GEOCODER_API_URL!,
  IS_URL: process.env.NEXT_PUBLIC_IS_URL!,
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID!,
};

console.log("Config check");
for (const [key, value] of Object.entries(constants)) {
  if (!value) throw new Error(`Missing ${key} config setting`);
}

type ConstantsType = Unmutable<typeof constants>;

export default constants as ConstantsType;
