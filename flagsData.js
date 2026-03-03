/*
================================================================================
| This file contains all the flag data for the Flag-X application.             |
| It processes raw data arrays into the specific categories required by the UI.|
================================================================================
*/
import { officialCountriesRaw } from './officialCountries.js';
import { allSubdivisionsRaw } from './subdivisions.js';
import { allTerritoriesRaw } from './territories.js';
import { allHistoricalRaw } from './historical.js';
import { allUnofficialRaw } from './unofficial.js';
import { allOrganizationsRaw } from './organizations.js';

// --- Category 1: Official Countries ---
// Kita ambil data mentah, lalu kita urutkan A-Z berdasarkan properti 'name'
export const officialCountries = [...officialCountriesRaw].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// --- Category 2: Subdivisions ---
export const subdivisions = [...allSubdivisionsRaw].sort((a, b) => 
  a.name.localeCompare(b.name)
);
  
// --- Category 3: Territories ---
export const territories = [...allTerritoriesRaw].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// --- Category 4: Historical Flags ---
export const historicalFlags = [...allHistoricalRaw].sort((a, b) => {
  a.name.localeCompare(b.name);
});

// --- Category 5: Unofficial Countries ---
export const unofficial = [...allUnofficialRaw].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// --- Category 6: World Organizations ---
// Nama variabelnya harus 'worldOrganizations' sesuai yang diminta script.js kamu
export const worldOrganizations = [...allOrganizationsRaw].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// --- Category 7: Continent Flags ---
// Helper untuk mempermudah pengambilan data berdasarkan subRegion
const getSub = (sub) => officialCountriesRaw.filter(c => c.subRegion === sub);

// Tetap simpan helper mapContinent Anda
const mapContinent = (arr, regionName) => 
  [...arr].sort((a, b) => a.name.localeCompare(b.name))
          .map(f => ({ ...f, type: regionName }));

export const continentFlags = {
  Asia: [
    ...mapContinent(getSub("Central Asia"), "Central Asia"),
    ...mapContinent(getSub("East Asia"), "East Asia"),
    ...mapContinent(getSub("South Asia"), "South Asia"),
    ...mapContinent(getSub("Southeast Asia"), "Southeast Asia"),
    ...mapContinent(getSub("West Asia"), "West Asia")
  ],
  Europe: [
    ...mapContinent(getSub("Eastern Europe"), "Eastern Europe"),
    ...mapContinent(getSub("Northern Europe"), "Northern Europe"),    
    ...mapContinent(getSub("Southern Europe"), "Southern Europe"),  
    ...mapContinent(getSub("Western Europe"), "Western Europe")  
  ],
  Africa: [
    ...mapContinent(getSub("Central Africa"), "Central Africa"),
    ...mapContinent(getSub("Eastern Africa"), "Eastern Africa"),
    ...mapContinent(getSub("Northern Africa"), "Northern Africa"),
    ...mapContinent(getSub("Southern Africa"), "Southern Africa"),
    ...mapContinent(getSub("Western Africa"), "Western Africa")      
  ],
  "North America": mapContinent(getSub("North America & Caribbean"), "North America & Caribbean"),
  "South America": mapContinent(getSub("South America"), "South America"),
  "Oceania": mapContinent(getSub("Oceania"), "Oceania")
};
