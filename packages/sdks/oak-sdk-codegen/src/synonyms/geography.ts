/**
 * Geography and environmental theme synonyms.
 *
 * Maps canonical geography topics to alternative terms.
 */

export const geographySynonyms = {
  climate: ['climate change', 'global warming', 'greenhouse effect', 'weather', 'climate crisis'],
  weather: ['meteorology', 'precipitation', 'rainfall', 'temperature'],
  mountains: ['alpine', 'highland', 'upland'],
  rivers: ['fluvial', 'stream', 'drainage basin'],
  coasts: ['coastal', 'shoreline'],
  volcanoes: ['volcanic'],
  earthquakes: ['seismic', 'seismology'],
  glaciation: ['glacier', 'glaciers', 'ice sheet', 'ice age'],
  ecosystems: ['biome', 'biomes', 'habitat', 'habitats'],
  population: ['demography', 'demographic'],
  settlement: ['settlements', 'urbanisation', 'urbanization', 'city', 'cities', 'town', 'towns'],
  industry: ['industrial', 'manufacturing', 'factories'],
  trade: ['trading', 'commerce', 'economy', 'economic'],
  sustainability: ['sustainable development', 'environment', 'environmental'],
} as const;

export type GeographySynonyms = typeof geographySynonyms;
