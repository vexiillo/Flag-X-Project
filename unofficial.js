// --- UNOFFICIAL COUNTRIES ---
const unofficial = [
  { 
    name: "Abkhazia", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_the_Republic_of_Abkhazia.svg", 
    capital: "Sukhumi", 
    country: "Georgia (claimed)" 
  },
  { 
    name: "Catalonia", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg", 
    capital: "Barcelona", 
    country: "Spain" 
  },
  { 
    name: "Kurdistan", 
    flag: "https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Kurdistan.svg", 
    capital: "Erbil", 
    country: "Iraq / Turkey / Syria / Iran" 
  }
];

// --- PROSES PENGGABUNGAN & EXPORT ---
export const allUnofficialRaw = [
  ...unofficial.map(f => ({ ...f, type: "Unofficial" }))
];