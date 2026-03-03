// --- HISTORICAL FLAGS ---
// --- HELPER FUNCTION ---
// Fungsi ini harus ada di sini agar data 'year' bisa diproses
const getYear = (name) => {
  if (!name) return null;
  const match = name.match(/\(([^)]+)\)/);
  if (!match) return null;
  return match[1].trim();
};

// --- AFGHANISTAN ---
const afghanistanHistorical = [
  { name: "Hotak Empire", years: "1709–1738", flag: "https://upload.wikimedia.org/wikipedia/commons/8/81/Flag_of_the_Hotak_Empire.svg" },
  { name: "Durrani Empire", years: "1747–1842", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_the_Durrani_Empire.svg" },
  { name: "Emirate of Afghanistan", years: "1880–1901", flag: "https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Afghanistan_%281880%E2%80%931901%29.svg" },
  { name: "Emirate of Afghanistan", years: "1901–1919", flag: "https://upload.wikimedia.org/wikipedia/commons/2/23/Flag_of_Afghanistan_%281901%E2%80%931919%29.svg" },
  { name: "Kingdom of Afghanistan", years: "1926–1928", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Afghanistan_%281926%E2%80%931928%29.svg" },
  { name: "Kingdom of Afghanistan", years: "1928–1929", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Afghanistan_%281928%29.svg" },
  { name: "Kingdom of Afghanistan", years: "1930–1973", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Afghanistan_%281930%E2%80%931973%29.svg" },
  { name: "Republic of Afghanistan", years: "1974–1978", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Afghanistan_%281974%E2%80%931978%29.svg" },
  { name: "Democratic Republic of Afghanistan", years: "1978–1980", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Afghanistan_%281978%E2%80%931980%29.svg" },
  { name: "Republic of Afghanistan (Communist Era)", years: "1987–1992", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Afghanistan_%281987%E2%80%931992%29.svg" },
  { name: "Islamic State of Afghanistan", years: "1992–1996", flag: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Afghanistan_%281992%E2%80%931996%29.svg" },
  { name: "Islamic Emirate of Afghanistan (Taliban)", years: "1996–2001", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_the_Taliban.svg" },
  { name: "Transitional Administration", years: "2002–2004", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Afghanistan_%282002%E2%80%932004%29.svg" },
  { name: "Islamic Republic of Afghanistan", years: "2004–2021", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Islamic_Republic_of_Afghanistan.svg" },
  { name: "Islamic Emirate of Afghanistan (Current)", years: "2021–present", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_the_Taliban.svg" }
];

// --- ALBANIA ---
const albaniaHistorical = [
  { name: "Principality of Albania", years: "1914", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Flag_of_Albania_%281914%29.svg/960px-Flag_of_Albania_%281914%29.svg.png" },
  { name: "Albanian Republic", years: "1925–1928", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_Albania_%281926%E2%80%931928%29.svg/960px-Flag_of_Albania_%281926%E2%80%931928%29.svg.png" },
  { name: "Kingdom of Albania (Zog I)", years: "1928–1939", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Flag_of_Albania_%281934%E2%80%931939%29.svg/960px-Flag_of_Albania_%281934%E2%80%931939%29.svg.png" },
  { name: "Albania under Italy", years: "1939–1943", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Albania_%281939%E2%80%931943%29.svg/960px-Flag_of_Albania_%281939%E2%80%931943%29.svg.png" },
  { name: "Albania under Germany", years: "1943–1944", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Flag_of_Albania_%281934%E2%80%931939%29.svg/960px-Flag_of_Albania_%281934%E2%80%931939%29.svg.png" },
  { name: "Democratic Government of Albania", years: "1944–1946", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Flag_of_Albania_%281944%E2%80%931946%29.svg/960px-Flag_of_Albania_%281944%E2%80%931946%29.svg.png" },
  { name: "People's Socialist Republic of Albania", years: "1946–1992", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Albania_%281946%E2%80%931992%29.svg/960px-Flag_of_Albania_%281946%E2%80%931992%29.svg.png" },
  { name: "Republic of Albania", years: "1992–present", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/960px-Flag_of_Albania.svg.png" }
];

// --- BRAZIL ---
const brazilHistorical = [
  { name: "Dutch Brazil", years: "1630–1654", flag: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_the_Dutch_West_India_Company.svg" },
  { name: "Revolt of Pernambuco", years: "1817", flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_Pernambucan_Revolt_of_1817.svg" },
  { name: "United Kingdom of Portugal, Brazil and the Algarves", years: "1815–1822", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_the_United_Kingdom_of_Portugal%2C_Brazil%2C_and_the_Algarves.svg" },
  { name: "Kingdom of Brazil", years: "1822", flag: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_the_Kingdom_of_Brazil_%281822%29.svg" },
  { name: "Empire of Brazil", years: "1822–1853", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Brazil_%281822-1853%29.svg" },
  { name: "Empire of Brazil", years: "1853–1889", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Brazil_%281853-1889%29.svg" },
  { name: "Provisional Flag of the Republic", years: "November 1889", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Brazil_%28November_1889%29.svg/960px-Flag_of_Brazil_%28November_1889%29.svg.png" },
  { name: "Brazil", years: "1889–1960", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Brazil_%281889%E2%80%931960%29.svg" },
  { name: "Brazil", years: "1960–1968", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Brazil_%281960%E2%80%931968%29.svg" },
  { name: "Brazil", years: "1968–1992", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_Brazil_%281968%E2%80%931992%29.svg" }
];

// --- CANADA ---
const canadaHistorical = [
  { name: "Canadian Red Ensign", years: "1868–1921", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Canada_%281868%E2%80%931921%29.svg" },
  { name: "Canadian Red Ensign", years: "1921–1957", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Canada_%281921%E2%80%931957%29.svg" },
  { name: "Canadian Red Ensign", years: "1957–1965", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_Canada_%281957%E2%80%931965%29.svg" }
];

// --- CHINA ---
const chinaHistorical = [
  { name: "Xia Dynasty", years: "~2070–1600 BC", flag: "flags/Xia-Dynasty.jpg" },
  { name: "Shang Dynasty", years: "~1600–1046 BC", flag: "flags/Shang-Dynasty.jpg" },
  { name: "Zhou Dynasty", years: "~1046–256 BC", flag: "flags/Zhou-Dynasty.jpg" },
  { name: "Qin Dynasty", years: "221–206 BC", flag: "flags/Qin-Dynasty.jpg" },
  { name: "Han Dynasty", years: "202 BC–9 AD; 25–220 AD", flag: "flags/Han-Dynasty.png" },
  { name: "Xin Dynasty", years: "9–23", flag: "https://static.wikia.nocookie.net/extended-timeline/images/7/78/Xin.png/1600px-Xin.png.png" },
  { name: "Cao Wei", years: "220–226", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fb/BanderadeCaoWei.png" },
  { name: "Shu Han", years: "221–263", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Shu_han.jpg" },
  { name: "Eastern Wu", years: "222–280", flag: "flags/Wu-Dynasty.jpg" },
  { name: "Jin Dynasty (Western/Eastern Jin)", years: "266–420", flag: "flags/Jin-Dynasty(266–420).png" },
  { name: "Liu Song", years: "420–479", flag: "flags/Liu-Song.jpg" },
  { name: "Liang Dynasty", years: "502–557", flag: "https://static.wikia.nocookie.net/extended-timeline/images/4/41/Liang.png/960px-Liang.png.png" },
  { name: "Chen Dynasty", years: "557–589", flag: "flags/Chen-Dynasty.jpg" },
  { name: "Sui Dynasty", years: "581–618", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Sui_Dynasty.png" },
  { name: "Tang Dynasty", years: "618–907", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Tang_Dynasty_%28China%29.svg" },
  { name: "Ma Chu", years: "907–951", flag: "flags/Chu-Dynasty.jpg" },
  { name: "Song Dynasty", years: "960–1279", flag: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Song_Dynasty_%28China%29.png" },
  { name: "Liao Dynasty", years: "916–1125", flag: "https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_the_Liao_Dynasty_%28Khitan%29.png" },
  { name: "Jin Dynasty (Jurchen Jin)", years: "1115–1234", flag: "flags/Jin-Dynasty.jpg" },
  { name: "Yuan Dynasty", years: "1271–1368", flag: "flags/Yuan-Dynasty.jpeg" },
  { name: "Ming Dynasty", years: "1368–1644", flag: "https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Ming_Dynasty_%28fictitious%29.svg" },
  { name: "Qing Dynasty", years: "1636/1644–1912 (Flag: 1862–1889)", flag: "https://upload.wikimedia.org/wikipedia/commons/8/86/Flag_of_China_%281862%E2%80%931889%29.svg" },
  { name: "Qing Dynasty", years: "1636/1644–1912 (Flag: 1889–1912)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Flag_of_China_%281889%E2%80%931912%29.svg/960px-Flag_of_China_%281889%E2%80%931912%29.svg.png" },
  { name: "Republic of China", years: "1912–1928", flag: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_China_%281912%E2%80%931928%29.svg" },
  { name: "Empire of China", years: "1915–1916", flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_Empire_of_China_%281915%E2%80%931916%29.svg" },
  { name: "Republic of China", years: "1928–present", flag: "https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_the_Republic_of_China.svg" },
  { name: "People's Republic of China", years: "1949–present", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/960px-Flag_of_the_People%27s_Republic_of_China.svg.png" }
];

// --- FRANCE ---
const franceHistorical = [
  { name: "Kingdom of France", years: "1376–1830", flag: "https://upload.wikimedia.org/wikipedia/commons/8/82/Royal_flag_of_France.svg" },
  { name: "Revolutionary France", years: "1790–1794", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Flag_of_France_%281790%E2%80%931794%29.svg" },
  { name: "French First Republic", years: "1794–1804", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/960px-Flag_of_France.svg.png" },
  { name: "First French Empire", years: "1804–1815", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_the_First_French_Empire_%281804-1815%29_with_coat_of_arms.webp/960px-Flag_of_the_First_French_Empire_%281804-1815%29_with_coat_of_arms.webp.png" },
  { name: "Bourbon Restoration", years: "1814–1830", flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_France_%281814%E2%80%931830%29.svg" },
  { name: "July Monarchy", years: "1830–1848", flag: "https://upload.wikimedia.org/wikipedia/commons/5/52/Royal_Standard_of_Louis-Philippe_I_of_France_%281830%E2%80%931848%29.svg" },
  { name: "French Second Republic", years: "1848–1852", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/960px-Flag_of_France.svg.png" },
  { name: "Second French Empire", years: "1852–1870", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b0/French_empire.png" },
  { name: "French Third Republic", years: "1870–1940", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/960px-Flag_of_France.svg.png" },
  { name: "Vichy France", years: "1940–1944", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Flag_of_Philippe_P%C3%A9tain%2C_Chief_of_State_of_Vichy_France.svg" },
  { name: "Free France", years: "1940–1944", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Flag_of_Free_France_%281940-1944%29.svg/960px-Flag_of_Free_France_%281940-1944%29.svg.png" },
  { name: "French Fourth Republic", years: "1946–1958", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/960px-Flag_of_France.svg.png" }
];

// --- GERMANY ---
const germanyHistorical = [
  { name: "East Francia", years: "843–962", flag: "flags/East-Francia.png" },
  { name: "Holy Roman Empire", years: "962–1806 (Flag: 1430–1806)", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Banner_of_the_Holy_Roman_Emperor_with_haloes_%281430-1806%29.svg" },
  { name: "Confederation of the Rhine", years: "1806–1813", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Alleged_flag_of_the_Rhine_Confederation_1806-13.svg" },
  { name: "German Confederation", years: "1815–1866", flag: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_the_German_Confederation_%28war%29.svg" },
  { name: "North German Confederation", years: "1866–1871", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Germany_%281867%E2%80%931918%29.svg" },
  { name: "German Empire", years: "1871–1918", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_Germany_%281867%E2%80%931918%29.svg" },
  { name: "Weimar Republic", years: "1919–1933", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Germany_%283-2%29.svg" },
  { name: "Germany", years: "1933–1935", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Germany_%281933%E2%80%931935%29.svg/960px-Flag_of_Germany_%281933%E2%80%931935%29.svg.png" },
  { name: "Nazi Germany", years: "1935–1945", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Germany_%281935%E2%80%931945%29.svg/960px-Flag_of_Germany_%281935%E2%80%931945%29.svg.png" },
  { name: "Allied Control Council", years: "1946–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/7/74/Merchant_flag_of_Germany_%281946%E2%80%931949%29.svg" },
  { name: "Saar Protectorate", years: "1947–1956", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Flag_of_Saar_%281947%E2%80%931956%29.svg/960px-Flag_of_Saar_%281947%E2%80%931956%29.svg.png" },
  { name: "West Germany", years: "1949–1990", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/960px-Flag_of_Germany.svg.png" },
  { name: "East Germany", years: "1949–1990 (Flag: 1949–1959)", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Germany_%283-2%29.svg" },
  { name: "East Germany", years: "1949–1990 (Flag: 1959–1990)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Flag_of_the_German_Democratic_Republic.svg/960px-Flag_of_the_German_Democratic_Republic.svg.png" },
  { name: "Germany (Reunified)", years: "1990–present", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/960px-Flag_of_Germany.svg.png" }
];

// --- INDIA ---
const indiaHistorical = [
  { name: "Kingdom of Magadha", years: "~1600 BCE–625 CE", flag: "flags/Magadha-Kingdom.png" },
  { name: "Kosala Kingdom", years: "~1100–345 BCE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/b/bc/Kosala.png/960px-Kosala.png.png" },
  { name: "Panchala Kingdom", years: "~1100 BCE–340 CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/d/d2/Panchala.png/1600px-Panchala.png.png" },
  { name: "Kalinga Kingdom", years: "~1100–261 BCE", flag: "flags/Kalinga-Kingdom.png" },
  { name: "Gandhara Kingdom", years: "~700–518 BCE", flag: "https://escforumwiki.com/images/5/59/Flag_of_Gandhara.png" },
  { name: "Chera Dynasty", years: "~600 BCE–1530 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Chera_dynasty.svg/960px-Flag_of_Chera_dynasty.svg.png" },
  { name: "Pandya Dynasty", years: "400 BCE–1618 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Twin_fish_flag_of_Pandyas.svg/960px-Twin_fish_flag_of_Pandyas.svg.png" },
  { name: "Maurya Empire", years: "~320–185 BCE", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Maurya_Empire.svg/960px-Flag_of_Maurya_Empire.svg.png" },
  { name: "Chola Dynasty", years: "~300s BCE–1279 CE", flag: "flags/Chola-Kingdom.png" },
  { name: "Indo-Greek Kingdom", years: "200 BC–10 CE", flag: "https://static.wikia.nocookie.net/althistory/images/f/fc/Indo-Greek_Kingdom_Flag.png/960px-Indo-Greek_Kingdom_Flag.png.png" },
  { name: "Kingdom of Kangleipak", years: "~200s BCE–1950 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Flag_of_Kangleipak.svg" },
  { name: "Kuninda Kingdom", years: "~2nd cent. BCE–3rd cent. CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/5/55/Kuninda.png/960px-Kuninda.png.png" },
  { name: "Satavahana Dynasty", years: "~late 2nd cent. BCE–224 CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/9/98/Satavahana.png/1600px-Satavahana.png.png" },
  { name: "Indo-Parthian Kingdom", years: "19–226 CE", flag: "https://static.wikia.nocookie.net/age-of-civilizations/images/7/7c/Indo_Parthian_Kingdom_Flag.png/960px-Indo_Parthian_Kingdom_Flag.png.png" },
  { name: "Kushan Empire", years: "30–375 CE", flag: "flags/Kushan-Empire.png" },
  { name: "Western Satraps", years: "35–415 CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/0/04/Western_Satraps.png/960px-Western_Satraps.png.png" },
  { name: "Kalabhra Dynasty", years: "3rd cent. CE–6th cent. CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/7/70/Kalabhras.png/960px-Kalabhras.png.png" },
  { name: "Kingdom of Abhira", years: "~203–370 CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/d/d2/Abhira.png/1600px-Abhira.png.png" },
  { name: "Sasanian Empire", years: "224–651 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Derafsh_kaviani.svg/960px-Derafsh_kaviani.svg.png" },
  { name: "Indo-Sasanian Kingdom", years: "~230–365 CE", flag: "flags/Indo-Sasanian-Kingdom.jpg" },
  { name: "Vakataka Dynasty", years: "~250–510 CE", flag: "flags/Vakataka-Dynasty.jpg" },
  { name: "Pallava Kingdom", years: "275–897", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Simha_flag_of_Pallava_Kingdom.png" },
  { name: "Gupta Empire", years: "320–550 CE", flag: "flags/Gupta-Dynasty.png" },
  { name: "Alchon Huns", years: "370–670 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/5/53/Flag_of_Alcon_Huns.png" },
  { name: "Hephthalite Empire", years: "440s–560 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Hephthalite_Empire.png" },
  { name: "Eastern Ganga Dynasty", years: "493–1947", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Easternganga.png" },
  { name: "Chalukya Dynasty", years: "543–753", flag: "https://static.wikia.nocookie.net/extended-timeline/images/8/85/Chalukya.png/960px-Chalukya.png.png" },
  { name: "Kalachuri Dynasty", years: "~550–1225", flag: "https://static.wikia.nocookie.net/extended-timeline/images/f/f7/Kalachuri.png/960px-Kalachuri.png.png" },
  { name: "Chauhan Dynasty", years: "~551–1315", flag: "https://upload.wikimedia.org/wikipedia/commons/5/55/Chauhan_Dynasty.png" },
  { name: "Kingdom of Mewar", years: "566–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/In_mewar-state.png" },
  { name: "Kingdom of Gauda", years: "~590–626", flag: "https://static.wikia.nocookie.net/extended-timeline/images/a/aa/Gauda.png/960px-Gauda.png.png" },
  { name: "Kingdom of Kumaon", years: "600–1791", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Flag_of_the_Kumaon_Kingdom.svg/960px-Flag_of_the_Kumaon_Kingdom.svg.png" },
  { name: "Karkota Empire", years: "625–855 CE", flag: "https://upload.wikimedia.org/wikipedia/commons/9/99/Karkota_empire.png" },
  { name: "Pratihara Dynasty", years: "730–1036 CE", flag: "https://static.wikia.nocookie.net/extended-timeline/images/f/f7/Gurjara-Pratihara.png/960px-Gurjara-Pratihara.png.png" },
  { name: "Rashtrakuta Empire", years: "753–982", flag: "https://static.wikia.nocookie.net/extended-timeline/images/2/2b/Rashtrakuta.png/1600px-Rashtrakuta.png.png" },
  { name: "Pala Empire", years: "750–1161", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pala_Empire.png/960px-Pala_Empire.png" },
  { name: "Kingdom of Garhwal", years: "823–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Flag_of_the_Princely_State_of_Tehri_Garhwal.svg/960px-Flag_of_the_Princely_State_of_Tehri_Garhwal.svg.png" },
  { name: "Seuna (Yadava) Dynasty", years: "~850–1317", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_Yadava.png" },
  { name: "Kachhwaha Dynasty (Kingdom of Amber)", years: "1028–1727", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Jaipur_%28c._1699-1818%29.svg/960px-Flag_of_Jaipur_%28c._1699-1818%29.svg.png" },
  { name: "Kachhwaha Dynasty (Kingdom of Jaipur)", years: "1727–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_Jaipur.svg" },
  { name: "Hoysala Kingdom", years: "1000–1346", flag: "https://static.wikia.nocookie.net/age-of-civilizations/images/2/29/Hoysala_Flag.png/960px-Hoysala_Flag.png.png" },
  { name: "Lohara Dynasty", years: "1003–1320", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Lohara_Dynasty_Flag%2C_Kingdom_of_Kashmir.png" },
  { name: "Kalahandi State", years: "1005–1948", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_the_Kalahandi_Princely_State.svg" },
  { name: "Sena Dynasty", years: "1070–1230", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sena_Empire_Flag.png" },
  { name: "Kakatiya Dynasty", years: "1163–1323", flag: "https://upload.wikimedia.org/wikipedia/commons/1/17/Kakatiya_flag.png" },
  { name: "Chutia Kingdom", years: "1187–1524", flag: "flags/Chutia-Kingdom.jpg" },
  { name: "Ahom Kingdom", years: "1228–1826", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ahom_Kingdom.webp" },
  { name: "Delhi Sultanate", years: "1206–1526", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Delhi_Sultanate_Flag.svg/960px-Delhi_Sultanate_Flag.svg.png" },
  { name: "Parlakhemundi Estate", years: "~1309–1950", flag: "flags/Parlakhemundi-Estate.png" },
  { name: "Oiniwar Dynasty", years: "1325–1526", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Oiniwar_Mithila_Flag.png" },
  { name: "Vijayanagara Empire", years: "1336–1646", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Vijayanagara_flag.png" },
  { name: "Bahmani Sultanate", years: "1347–1527", flag: "https://static.wikia.nocookie.net/althistory/images/7/7a/Flag_of_the_Bahmani_Sultanate_%28PMIV%29.png/1600px-Flag_of_the_Bahmani_Sultanate_%28PMIV%29.png.png" },
  { name: "Malwa Sultanate", years: "1401–1562", flag: "https://eu4.paradoxwikis.com/File:Malwa.png" },
  { name: "Kingdom of Mysore", years: "1399–1950", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Kingdom_of_Mysore.svg/960px-Flag_of_Kingdom_of_Mysore.svg.png" },
  { name: "Gajapati Empire", years: "1434–1541", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_Gajapati_Empire.jpg/960px-Flag_of_Gajapati_Empire.jpg" },
  { name: "Rathore Dynasty (Kingdom of Marwar)", years: "1226–1947", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Flag_of_Jodhpur.svg/960px-Flag_of_Jodhpur.svg.png" },
  { name: "Bikaner State", years: "1465–1947", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Bikaner.svg" },
  { name: "Deccan Sultanates", years: "~1490–1686", flag: "https://static.wikia.nocookie.net/mcxii/images/3/34/Deccan.png/960px-Deccan.png.png" },
  { name: "Imad Shahi Dynasty (Berar Sultanate)", years: "1490–1547", flag: "https://upload.wikimedia.org/wikipedia/commons/6/63/Berar_Sultanate_Flag.png" },
  { name: "Adil Shahi Dynasty (Bijapur Sultanate)", years: "1490–1686", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_the_Bijapur_Sultanate.png" },
  { name: "Nizam Shahi Dynasty (Ahmadnagar Sultanate)", years: "1490–1636", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/%22Alam%22_Flag_of_the_Nizam_Shahi_dynasty_of_the_Ahmadnagar_Sultanate.png" },
  { name: "Qutb Shahi Dynasty (Sultanate of Golconda)", years: "1518–1687", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Qutbshahi_Flag.svg/960px-Qutbshahi_Flag.svg.png" },
  { name: "Kingdom of Chochin", years: "12th century CE–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_the_Kingdom_of_Cochin.svg" },
  { name: "Koch Dynasty", years: "1515–1949–1956", flag: "flags/Koch-Dynasty.png" },
  { name: "Mughal Empire", years: "1526–1857", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_the_Mughal_Empire.png/960px-Flag_of_the_Mughal_Empire.png" },
  { name: "Sur Empire", years: "1538/1540–1555", flag: "https://static.wikia.nocookie.net/althistory/images/e/ec/Flag_of_the_Suri_Empire_%28Principia_Moderni_III%29.svg/1600px-Flag_of_the_Suri_Empire_%28Principia_Moderni_III%29.svg.png" },
  { name: "Kingdom of Sikkim", years: "1642–1975 (Flag: 1967–1975)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Flag_of_Sikkim_%281967-1975%29.svg/960px-Flag_of_Sikkim_%281967-1975%29.svg.png" },
  { name: "Maratha Empire", years: "1674–1818", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_the_Maratha_Empire.svg/960px-Flag_of_the_Maratha_Empire.svg.png" },
  { name: "Carnatic Sultanate", years: "1692–1855", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_Nawab.svg/960px-Flag_of_Nawab.svg.png" },
  { name: "Bharatpur State", years: "1722–1947 (Flag: ~1880–1943)", flag: "https://upload.wikimedia.org/wikipedia/commons/d/df/Flag_of_the_Bharatpur_Princely_State_%281880-c.1943%29.svg" },
  { name: "Kingdom of Pudukkottai", years: "1680–1948", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Pudukkottai_flag.svg/960px-Pudukkottai_flag.svg.png" },
  { name: "Kingdom of Travancore", years: "1729–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Kingdom_of_Travancore.svg/960px-Flag_of_Kingdom_of_Travancore.svg.png" },
  { name: "Jhansi State", years: "1804–1858", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_the_Princely_State_of_Jhansi.svg/960px-Flag_of_the_Princely_State_of_Jhansi.svg.png" },
  { name: "Kingdom of Kashmir", years: "1754–1762", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Saffron_flag.png" },
  { name: "Nabha State", years: "1763–1947", flag: "https://upload.wikimedia.org/wikipedia/commons/7/73/Nabha_flag.svg" },
  { name: "Hyderabad State", years: "1724–1948 (Flag: 1947–1948)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Asafia_flag_of_Hyderabad_State.svg/960px-Asafia_flag_of_Hyderabad_State.svg.png" },
  { name: "Tripura State", years: "1809–1949", flag: "https://upload.wikimedia.org/wikipedia/commons/5/58/Flag_of_Tripura_State.png" },
  { name: "Dogra Dynasty", years: "1846–1952", flag: "https://upload.wikimedia.org/wikipedia/commons/9/98/Dogra_Flag.png" },
  { name: "Sikh Empire", years: "1799–1849", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Sikh_Empire_flag.svg" },
  { name: "East India Company", years: "1801–1858", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_the_British_East_India_Company_%281801%29.svg" },
  { name: "British Raj", years: "1858–1947", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/British_Raj_Red_Ensign.svg/960px-British_Raj_Red_Ensign.svg.png" },
  { name: "Calcutta Flag", years: "1906", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Flag_of_India_1906_%28Calcutta_Flag%29.svg/960px-Flag_of_India_1906_%28Calcutta_Flag%29.svg.png" },
  { name: "Indian Home Rule Movement", years: "1917", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_the_Indian_Home_Rule_movement.svg/960px-Flag_of_the_Indian_Home_Rule_movement.svg.png" },
  { name: "Indian National Congress", years: "1931", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_Indian_National_Congress.png/960px-Flag_of_Indian_National_Congress.png" },
  { name: "Azad Hind", years: "1943–1945", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Flag_of_the_Indian_Legion.svg/960px-Flag_of_the_Indian_Legion.svg.png" },
  { name: "Dominion of India", years: "1947–1950", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/960px-Flag_of_India.svg.png" }
];

// --- ITALY ---
const italyHistorical = [
  { name: "Roman Kingdom", years: "753–509 BC", flag: "https://static.wikia.nocookie.net/martialartskids/images/4/4e/Roman_Empire.png/960px-Roman_Empire.png.png" },
  { name: "Roman Republic", years: "509–27 BC", flag: "https://static.wikia.nocookie.net/conworld/images/8/80/Roman_Flag.png/960px-Roman_Flag.png.png" },
  { name: "Roman Empire", years: "27 BC–395 AD", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Flag_of_the_Roman_Empire.svg/960px-Flag_of_the_Roman_Empire.svg.png" },
  { name: "Western Roman Empire", years: "395–476", flag: "flags/Western-Roman.jpg" },
  { name: "Ostrogothic Kingdom", years: "493–553", flag: "flags/Ostrogothic-Kingdom.jpeg" },
  { name: "Byzantine Italy", years: "553–751", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Byzantine_imperial_flag%2C_14th_century.svg" },
  { name: "Kingdom of Lombardy–Venetia", years: "1815–1866", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Flag_of_the_Kingdom_of_Lombardy%E2%80%93Venetia.svg" },
  { name: "Papal States", years: "754–1808", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_the_Papal_States_%28pre_1808%29.svg/960px-Flag_of_the_Papal_States_%28pre_1808%29.svg.png" },
  { name: "Papal States", years: "1825–1870", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_the_Papal_States_%281825-1870%29.svg" },
  { name: "Republic of Venice", years: "1659–1675", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Republic_of_Venice_%281659-1675%29.svg/960px-Flag_of_Republic_of_Venice_%281659-1675%29.svg.png" },
  { name: "Republic of Genoa", years: "~1190–1797", flag: "https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Genoa.svg" },
  { name: "Kingdom of Sicily", years: "1130–1816", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Bandiera_del_Regno_di_Sicilia_4.svg" },
  { name: "Kingdom of Naples", years: "1282–1816", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Bandera_de_N%C3%A1poles_-_Trast%C3%A1mara.svg" },
  { name: "Kingdom of Sardinia", years: "1324–1720", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_Kingdom_of_Sardinia_%281324-1720%29.svg" },
  { name: "Kingdom of Sardinia", years: "1816–1848", flag: "https://upload.wikimedia.org/wikipedia/commons/1/17/State_Flag_and_War_Ensign_of_the_Kingdom_of_Sardinia_%281816-1848%29.svg" },
  { name: "Kingdom of Sardinia", years: "1848–1851", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Kingdom_of_Sardinia_%281848-1851%29.svg/1600px-Flag_of_the_Kingdom_of_Sardinia_%281848-1851%29.svg.png" },
  { name: "Kingdom of the Two Sicilies", years: "1816", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_the_Kingdom_of_the_Two_Sicilies_%281816%29.svg/960px-Flag_of_the_Kingdom_of_the_Two_Sicilies_%281816%29.svg.png" },
  { name: "Cisalpine Republic", years: "1797–1802", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_the_Repubblica_Cisalpina.svg/960px-Flag_of_the_Repubblica_Cisalpina.svg.png" },
  { name: "Italian Republic (Napoleonic)", years: "1802–1805", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_the_Italian_Republic_%281802%29.svg/960px-Flag_of_the_Italian_Republic_%281802%29.svg.png" },
  { name: "Kingdom of Italy (Napoleonic)", years: "1805–1814", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Napoleonic_Kingdom_of_Italy.svg" },
  { name: "Kingdom of Italy", years: "1861–1946", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Italy_%281861-1946%29_crowned.svg" },
  { name: "Italian Social Republic", years: "1943–1945", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/960px-Flag_of_Italy.svg.png" }
];

// --- JAPAN ---
const japanHistorical = [
  { name: "Yamato Period", years: "~250–710", flag: "flags/Yamato-Period.jpg" },
  { name: "Nara and Heian Periods", years: "710–1185", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Japanese_crest_Sagari_Fuji.svg/960px-Japanese_crest_Sagari_Fuji.svg.png" },
  { name: "Kamakura Shogunate", years: "1185–1333", flag: "flags/Kamakura-Shogunate.jpeg" },
  { name: "Muromachi Shogunate", years: "1336–1573", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Nishiki_no_Mihata.svg/960px-Nishiki_no_Mihata.svg.png" },
  { name: "Azuchi-Momoyama (Oda Nobunaga)", years: "1573–1582", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Oda_ka_%28No_background_and_Black_color_drawing%29.svg/1024px-Oda_ka_%28No_background_and_Black_color_drawing%29.svg.png" },
  { name: "Azuchi-Momoyama (Toyotomi Hideyoshi)", years: "1582–1598", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Toyotomi_mon.png/960px-Toyotomi_mon.png" },
  { name: "Tokugawa Shogunate", years: "1603–1868", flag: "flags/Tokugawa-Shogunate.png" },
  { name: "Empire of Japan", years: "1870–1945", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Japan_%281870%E2%80%931999%29.svg" },
  { name: "Occupation of Japan", years: "1945–1952", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Flag_of_Allied_Occupied_Japan.svg/960px-Flag_of_Allied_Occupied_Japan.svg.png" }
];

// --- MEXICO ---
const mexicoHistorical = [
  { name: "Aztec Empire", years: "1428–1521", flag: "https://static.wikia.nocookie.net/augment-era/images/d/d3/Aztec.jpg/960px-Aztec.jpg.png" },
  { name: "Viceroyalty of New Spain", years: "1521–1821", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Cross_of_Burgundy.svg" },
  { name: "First Mexican Empire", years: "1821–1823", flag: "https://upload.wikimedia.org/wikipedia/commons/3/32/Bandera_del_Primer_Imperio_Mexicano.svg" },
  { name: "First Mexican Republic", years: "1824–1835", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Bandera_de_la_Primera_Rep%C3%BAblica_Federal_de_los_Estados_Unidos_Mexicanos.svg" },
  { name: "Second Mexican Empire", years: "1863–1867", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_the_Second_Mexican_Empire.svg" },
  { name: "Restored Republic", years: "1867–1876", flag: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Bandera_de_la_Segunda_Rep%C3%BAblica_Federal_de_los_Estados_Unidos_Mexicanos.svg" },
  { name: "Porfiriato Era", years: "1876–1911", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Mexico_%281893-1916%29.svg" },
  { name: "Mexico", years: "1916–1934", flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mexico_%281916%E2%80%931934%29.svg" },
  { name: "Mexico", years: "1934–1968", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Mexico_%281934-1968%29.svg/960px-Flag_of_Mexico_%281934-1968%29.svg.png" }
];

// --- RUSSIA ---
const russiaHistorical = [
  { name: "Kievan Rus'", years: "~988–1240", flag: "flags/Kievan-Rus.jpg" },
  { name: "Grand Duchy of Moscow", years: "1263–1547", flag: "https://static.wikia.nocookie.net/totalwar-ar/images/6/6c/Flag_of_Muscovy.png/960px-Flag_of_Muscovy.png.png" },
  { name: "Tsardom of Russia", years: "1668–1693", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Russia_%281668%E2%80%931693%29.svg" },
  { name: "Tsardom of Russia", years: "1693–1721", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Flag_of_Oryol_ship_%28variant%29.svg/960px-Flag_of_Oryol_ship_%28variant%29.svg.png" },
  { name: "Russian Empire", years: "1721–1858", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_the_Russian_Empire_%281721-1858%29.png" },
  { name: "Russian Empire", years: "1858–1896", flag: "https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Russia_%281858%E2%80%931896%29.svg" },
  { name: "Russian Empire", years: "1896–1914", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/960px-Flag_of_Russia.svg.png" },
  { name: "Russian Empire", years: "1914–1917", flag: "https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Russia_%281914-1917%29.svg" },
  { name: "Russian Provisional Government", years: "1917", flag: "https://static.wikia.nocookie.net/totalwar-ar/images/c/cf/Flag_of_Russia_2.png/960px-Flag_of_Russia_2.png.png" },
  { name: "Russian SFSR", years: "1918", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Flag_of_Russia_%281918%29.svg" },
  { name: "Russian SFSR", years: "1918–1937", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281918%E2%80%931925%29.svg/960px-Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281918%E2%80%931925%29.svg.png" },
  { name: "Russian SFSR", years: "1937–1954", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281937%E2%80%931954%29.svg/960px-Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281937%E2%80%931954%29.svg.png" },
  { name: "Russian SFSR", years: "1954–1991", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281954%E2%80%931991%29.svg/960px-Flag_of_the_Russian_Soviet_Federative_Socialist_Republic_%281954%E2%80%931991%29.svg.png" },
  { name: "Soviet Union", years: "1922–1923", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_the_Soviet_Union_%281922%E2%80%931923%29.svg/960px-Flag_of_the_Soviet_Union_%281922%E2%80%931923%29.svg.png" },
  { name: "Soviet Union", years: "1923–1924", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Soviet_Union_%281924%29.svg/960px-Flag_of_the_Soviet_Union_%281924%29.svg.png" },
  { name: "Soviet Union", years: "1924–1936", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_the_Soviet_Union_%281924%E2%80%931936%29.svg/960px-Flag_of_the_Soviet_Union_%281924%E2%80%931936%29.svg.png" },
  { name: "Soviet Union", years: "1936–1955", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Flag_of_the_Soviet_Union_%281936_%E2%80%93_1955%29.svg/960px-Flag_of_the_Soviet_Union_%281936_%E2%80%93_1955%29.svg.png" },
  { name: "Soviet Union", years: "1955–1991", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_Soviet_Union.svg/960px-Flag_of_the_Soviet_Union.svg.png" }
];

// --- SOUTH KOREA ---
export const southKoreaHistorical = [
  { name: "Gojoseon", years: "~2333–108 BC", flag: "http://www.ageofcivilizationsgame.com/uploads/monthly_2019_01/Gojoseon.png.f08c6d2e9c857bc5d7b1cf59fe3a17b2.png/960px-Gojoseon.png.f08c6d2e9c857bc5d7b1cf59fe3a17b2.png.png" },
  { name: "Buyeo", years: "2nd century BC–494", flag: "http://www.ageofcivilizationsgame.com/uploads/monthly_2019_01/Buyeo.png.4d62683aaa7a9a3a6e853ec32c7f179c.png" },
  { name: "Goguryeo", years: "37 BC–668", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Fictional_flag_of_Goguryeo.svg" },
  { name: "Baekje", years: "18 BC–660", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Military_flag_of_Baekje.svg/960px-Military_flag_of_Baekje.svg.png" },
  { name: "Silla", years: "57 BC–935", flag: "https://upload.wikimedia.org/wikipedia/commons/8/80/Military_Banner_of_Silla.svg" },
  { name: "Gaya Confederacy", years: "42–562", flag: "http://www.ageofcivilizationsgame.com/uploads/monthly_2019_01/Gaya.png.92a08c08c2ee82dc03c1e45e5599aa20.png/960px-Gaya.png.92a08c08c2ee82dc03c1e45e5599aa20.png.png" },
  { name: "Balhae", years: "698–926", flag: "https://static.wikia.nocookie.net/althistory/images/6/68/Flag_of_Balhae_%28Ume%29.png/960px-Flag_of_Balhae_%28Ume%29.png.png" },
  { name: "Later Baekje", years: "892–936", flag: "flags/later_baekje_emblem.png" },
  { name: "Later Goguryeo (Taebong)", years: "901–918", flag: "flags/taebong_emblem.png" },
  { name: "Goryeo Dynasty", years: "918–1392", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Goryeo.svg" },
  { name: "Joseon Dynasty", years: "1392–1897", flag: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_Joseon_Dynasty.svg" },
  { name: "Korean Empire", years: "1897–1910", flag: "https://upload.wikimedia.org/wikipedia/commons/5/58/Flag_of_the_Korean_Empire.svg" },
  { name: "Provisional Government of Korea", years: "1919–1945", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_the_Provisional_Government_of_the_Republic_of_Korea.svg" },
  { name: "South Korea", years: "1945–1948", flag: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg" },
  { name: "South Korea", years: "1948–2011", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/1024px-Flag_of_South_Korea.svg.png" }
];

// --- UK ---
const ukHistorical = [
  { name: "Cross of St. Andrew", years: "~1180s–1707", flag: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Scotland_%281542%E2%80%932003%2C_navy_blue%29.svg" },
  { name: "Cross of St. George", years: "~1190s–present", flag: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg" },
  { name: "Cross of St. Patrick", years: "1783–1922", flag: "https://upload.wikimedia.org/wikipedia/commons/8/81/Saint_Patrick%27s_Saltire.svg" },
  { name: "Union Flag", years: "1707–1801", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/1024px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png" }
];

// --- USA ---
const usHistorical = [
  { name: "Grand Union", years: "1776–1777", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Flag_of_the_United_States_%281776%E2%80%931777%29.svg" },
  { name: "13-Star Flag", years: "1777–1795", flag: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_the_United_States_%281777%E2%80%931795%29.svg" },
  { name: "Hopkinson 13-Star Version", years: "1777–1795", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Hopkinson_Flag.svg" },
  { name: "Bennington 13-Star Version", years: "1777", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Bennington_Flag.svg" },
  { name: "Betsy Ross 13-Star Version", years: "1792", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Betsy_Ross_flag.svg" },
  { name: "Star-Spangled Banner", years: "1795–1818", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_the_United_States_%281795%E2%80%931818%29.svg" },
  { name: "20-Star Flag", years: "1818–1819", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Flag_of_the_United_States_%281818%E2%80%931819%29.svg" },
  { name: "21-Star Flag", years: "1819–1820", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_the_United_States_%281819%E2%80%931820%29.svg" },
  { name: "23-Star Flag", years: "1820–1822", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Flag_of_the_United_States_%281820%E2%80%931822%29.svg" },
  { name: "24-Star Flag", years: "1822–1836", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_the_United_States_%281822%E2%80%931836%29.svg" },
  { name: "25-Star Flag", years: "1836–1837", flag: "https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_the_United_States_%281836%E2%80%931837%29.svg" },
  { name: "26-Star Flag", years: "1837–1845", flag: "https://upload.wikimedia.org/wikipedia/commons/d/de/Flag_of_the_United_States_%281837%E2%80%931845%29.svg" },
  { name: "27-Star Flag", years: "1845–1846", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_the_United_States_%281845%E2%80%931846%29.svg" },
  { name: "28-Star Flag", years: "1846–1847", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_the_United_States_%281846%E2%80%931847%29.svg" },
  { name: "29-Star Flag", years: "1847–1848", flag: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_the_United_States_%281847%E2%80%931848%29.svg" },
  { name: "30-Star Flag", years: "1848–1851", flag: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_the_United_States_%281848%E2%80%931851%29.svg" },
  { name: "31-Star Flag", years: "1851–1858", flag: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Flag_of_the_United_States_%281851%E2%80%931858%29.svg" },
  { name: "32-Star Flag", years: "1858–1859", flag: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Flag_of_the_United_States_%281858%E2%80%931859%29.svg" },
  { name: "33-Star Flag", years: "1859–1861", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_the_United_States_%281859%E2%80%931861%29.svg" },
  { name: "34-Star Flag", years: "1861–1863", flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_the_United_States_%281861%E2%80%931863%29.svg" },
  { name: "35-Star Flag", years: "1863–1865", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_the_United_States_%281863%E2%80%931865%29.svg/960px-Flag_of_the_United_States_%281863%E2%80%931865%29.svg.png" },
  { name: "36-Star Flag", years: "1865–1867", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_the_United_States_%281865%E2%80%931867%29.svg" },
  { name: "37-Star Flag", years: "1867–1877", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_the_United_States_%281867%E2%80%931877%29.svg" },
  { name: "38-Star Flag", years: "1877–1890", flag: "https://upload.wikimedia.org/wikipedia/commons/8/80/Flag_of_the_United_States_%281877%E2%80%931890%29.svg" },
  { name: "43-Star Flag", years: "1890–1891", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_States_%281890%E2%80%931891%29.svg" },
  { name: "44-Star Flag", years: "1891–1896", flag: "https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_the_United_States_%281891%E2%80%931896%29.svg" },
  { name: "45-Star Flag", years: "1896–1908", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_the_United_States_%281896%E2%80%931908%29.svg" },
  { name: "46-Star Flag", years: "1908–1912", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_the_United_States_%281908%E2%80%931912%29.svg" },
  { name: "48-Star Flag", years: "1912–1959", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_the_United_States_%281912-1959%29.svg" },
  { name: "49-Star Flag", years: "1959–1960", flag: "https://upload.wikimedia.org/wikipedia/commons/8/87/US_flag_49_stars.svg" },
  { name: "United States of America (50-Star Flag)", years: "1960–present", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/960px-Flag_of_the_United_States.svg.png" }
];

// --- PROSES PENGGABUNGAN & EXPORT ---
export const allHistoricalRaw = [
  ...usHistorical.map(f => ({ ...f, year: getYear(f.name), country: "USA" })),
  ...chinaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "China" })),
  ...germanyHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Germany" })),
  ...indiaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "India" })),
  ...japanHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Japan" })),
  ...ukHistorical.map(f => ({ ...f, year: getYear(f.name), country: "UK" })),
  ...franceHistorical.map(f => ({ ...f, year: getYear(f.name), country: "France" })),
  ...italyHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Italy" })),
  ...canadaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Canada" })),
  ...brazilHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Brazil" })),
  ...russiaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Russia" })),
  ...mexicoHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Mexico" })),
  ...southKoreaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "South Korea" })),
  ...afghanistanHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Afghanistan"})),
  ...albaniaHistorical.map(f => ({ ...f, year: getYear(f.name), country: "Albania"})),
];