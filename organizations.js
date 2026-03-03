// --- WORLD ORGANIZATIONS ---
const worldOrganizations = [
  { 
    name: "United Nations", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_the_United_Nations.svg", 
    capital: "New York City" 
  },
  { 
    name: "NATO", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Flag_of_NATO.svg/960px-Flag_of_NATO.svg.png", 
    capital: "Brussels" 
  },
  { 
    name: "European Union", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg", 
    capital: "Brussels" 
  }
];

// --- PROSES PENGGABUNGAN & EXPORT ---
export const allOrganizationsRaw = [
  ...worldOrganizations.map(f => ({ ...f, type: "International Organization" }))
];
