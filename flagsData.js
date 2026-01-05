/*
================================================================================
| This file contains all the flag data for the Flag-X application.             |
| It processes raw data arrays into the specific categories required by the UI.|
================================================================================
*/

// Helper function to extract the starting year from historical flag names
const getYear = (name) => {
  if (!name) return null;

  // Ambil isi dalam tanda kurung (misalnya "(1945–present)" → "1945–present")
  const match = name.match(/\(([^)]+)\)/);
  if (!match) return null;

  // Hapus spasi di pinggir dan kembalikan teks apa adanya
  return match[1].trim();
};

// =============================================================================
// I. RAW DATA ARRAYS
// (All the original data arrays go here, unmodified)
// =============================================================================
// --- OFFICIAL COUNTRIES ---
const officialCountriesRaw = [
  { name: "Afghanistan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/960px-Flag_of_the_Taliban.svg.png", capital: "Kabul" },
  { name: "Albania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/960px-Flag_of_Albania.svg.png", capital: "Tirana" },
  { name: "Algeria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/960px-Flag_of_Algeria.svg.png", capital: "Algiers" },
  { name: "Andorra", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Andorra.svg/960px-Flag_of_Andorra.svg.png", capital: "Andorra la Vella" },
  { name: "Angola", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/960px-Flag_of_Angola.svg.png", capital: "Luanda" },
  { name: "Antigua and Barbuda", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Antigua_and_Barbuda.svg/960px-Flag_of_Antigua_and_Barbuda.svg.png", capital: "St. John's" },
  { name: "Argentina", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/960px-Flag_of_Argentina.svg.png", capital: "Buenos Aires" },
  { name: "Armenia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/960px-Flag_of_Armenia.svg.png", capital: "Yerevan" },
  { name: "Australia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/960px-Flag_of_Australia_%28converted%29.svg.png", capital: "Canberra" },
  { name: "Austria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/960px-Flag_of_Austria.svg.png", capital: "Vienna" },
  { name: "Azerbaijan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/960px-Flag_of_Azerbaijan.svg.png", capital: "Baku" },
  { name: "Bahamas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flag_of_the_Bahamas.svg/960px-Flag_of_the_Bahamas.svg.png", capital: "Nassau" },
  { name: "Bahrain", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/960px-Flag_of_Bahrain.svg.png", capital: "Manama" },
  { name: "Bangladesh", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/960px-Flag_of_Bangladesh.svg.png", capital: "Dhaka" },
  { name: "Barbados", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Barbados.svg/960px-Flag_of_Barbados.svg.png", capital: "Bridgetown" },
  { name: "Belarus", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Flag_of_Belarus.svg/960px-Flag_of_Belarus.svg.png", capital: "Minsk" },
  { name: "Belgium", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/960px-Flag_of_Belgium.svg.png", capital: "Brussels" },
  { name: "Belize", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/960px-Flag_of_Belize.svg.png", capital: "Belmopan" },
  { name: "Benin", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/960px-Flag_of_Benin.svg.png", capital: "Porto-Novo" },
  { name: "Bhutan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/960px-Flag_of_Bhutan.svg.png", capital: "Thimphu" },
  { name: "Bolivia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/960px-Flag_of_Bolivia.svg.png", capital: "Sucre" },
  { name: "Bosnia and Herzegovina", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Flag_of_Bosnia_and_Herzegovina.svg/960px-Flag_of_Bosnia_and_Herzegovina.svg.png", capital: "Sarajevo" },
  { name: "Botswana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/960px-Flag_of_Botswana.svg.png", capital: "Gaborone" },
  { name: "Brazil", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/960px-Flag_of_Brazil.svg.png", capital: "Brasília" },
  { name: "Brunei", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/960px-Flag_of_Brunei.svg.png", capital: "Bandar Seri Begawan" },
  { name: "Bulgaria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/960px-Flag_of_Bulgaria.svg.png", capital: "Sofia" },
  { name: "Burkina Faso", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Burkina_Faso.svg/960px-Flag_of_Burkina_Faso.svg.png", capital: "Ouagadougou" },
  { name: "Burundi", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Burundi.svg/960px-Flag_of_Burundi.svg.png", capital: "Gitega" },
  { name: "Cabo Verde (Cape Verde)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/960px-Flag_of_Cape_Verde.svg.png", capital: "Praia" },
  { name: "Cambodia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/960px-Flag_of_Cambodia.svg.png", capital: "Phnom Penh" },
  { name: "Cameroon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/960px-Flag_of_Cameroon.svg.png", capital: "Yaoundé" },
  { name: "Canada", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/960px-Flag_of_Canada_%28Pantone%29.svg.png", capital: "Ottawa" },
  { name: "Central African Republic", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Central_African_Republic.svg/960px-Flag_of_the_Central_African_Republic.svg.png", capital: "Bangui" },
  { name: "Chad", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flag_of_Chad.svg/960px-Flag_of_Chad.svg.png", capital: "N'Djamena" },
  { name: "Chile", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/960px-Flag_of_Chile.svg.png", capital: "Santiago" },
  { name: "China", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/960px-Flag_of_the_People%27s_Republic_of_China.svg.png", capital: "Beijing" },
  { name: "Colombia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/960px-Flag_of_Colombia.svg.png", capital: "Bogotá" },
  { name: "Comoros", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Flag_of_the_Comoros.svg/960px-Flag_of_the_Comoros.svg.png", capital: "Moroni" },
  { name: "Congo Republic", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/960px-Flag_of_the_Republic_of_the_Congo.svg.png", capital: "Brazzaville" },
  { name: "Costa Rica", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Costa_Rica_%28state%29.svg/960px-Flag_of_Costa_Rica_%28state%29.svg.png", capital: "San José" },
  { name: "Côte D'Ivoire (Ivory Coast)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg/960px-Flag_of_C%C3%B4te_d%27Ivoire.svg.png", capital: "Yamoussoukro" },
  { name: "Croatia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/960px-Flag_of_Croatia.svg.png", capital: "Zagreb" },
  { name: "Cuba", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/960px-Flag_of_Cuba.svg.png", capital: "Havana" },
  { name: "Cyprus", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Cyprus.svg/960px-Flag_of_Cyprus.svg.png", capital: "Nicosia" },
  { name: "Czech Republic", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/960px-Flag_of_the_Czech_Republic.svg.png", capital: "Prague" },
  { name: "Democratic Republic of the Congo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/960px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png", capital: "Kinshasa" },
  { name: "Denmark", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/960px-Flag_of_Denmark.svg.png", capital: "Copenhagen" },
  { name: "Djibouti", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_Djibouti.svg/960px-Flag_of_Djibouti.svg.png", capital: "Djibouti" },
  { name: "Dominica", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Dominica.svg/960px-Flag_of_Dominica.svg.png", capital: "Roseau" },
  { name: "Dominican Republic", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/960px-Flag_of_the_Dominican_Republic.svg.png", capital: "Santo Domingo" },
  { name: "Ecuador", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/960px-Flag_of_Ecuador.svg.png", capital: "Quito" },
  { name: "Egypt", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/960px-Flag_of_Egypt.svg.png", capital: "Cairo" },
  { name: "El Salvador", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/960px-Flag_of_El_Salvador.svg.png", capital: "San Salvador" },
  { name: "Equatorial Guinea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Equatorial_Guinea.svg/960px-Flag_of_Equatorial_Guinea.svg.png", capital: "Malabo" },
  { name: "Eritrea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_Eritrea.svg/960px-Flag_of_Eritrea.svg.png", capital: "Asmara" },
  { name: "Estonia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Estonia.svg/960px-Flag_of_Estonia.svg.png", capital: "Tallinn" },
  { name: "Eswatini", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Flag_of_Eswatini.svg/960px-Flag_of_Eswatini.svg.png", capital: "Mbabane" },
  { name: "Ethiopia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/960px-Flag_of_Ethiopia.svg.png", capital: "Addis Ababa" },
  { name: "Fiji", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/960px-Flag_of_Fiji.svg.png", capital: "Suva" },
  { name: "Finland", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/960px-Flag_of_Finland.svg.png", capital: "Helsinki" },
  { name: "France", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/960px-Flag_of_France.svg.png", capital: "Paris" },
  { name: "Gabon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/960px-Flag_of_Gabon.svg.png", capital: "Libreville" },
  { name: "Gambia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_The_Gambia.svg/960px-Flag_of_The_Gambia.svg.png", capital: "Banjul" },
  { name: "Georgia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/960px-Flag_of_Georgia.svg.png", capital: "Tbilisi" },
  { name: "Germany", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/960px-Flag_of_Germany.svg.png", capital: "Berlin" },
  { name: "Ghana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/960px-Flag_of_Ghana.svg.png", capital: "Accra" },
  { name: "Greece", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/960px-Flag_of_Greece.svg.png", capital: "Athens" },
  { name: "Grenada", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Grenada.svg/960px-Flag_of_Grenada.svg.png", capital: "St. George's" },
  { name: "Guatemala", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/960px-Flag_of_Guatemala.svg.png", capital: "Guatemala City" },
  { name: "Guinea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Guinea.svg/960px-Flag_of_Guinea.svg.png", capital: "Conakry" },
  { name: "Guinea-Bissau", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Guinea-Bissau.svg/960px-Flag_of_Guinea-Bissau.svg.png", capital: "Bissau" },
  { name: "Guyana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/960px-Flag_of_Guyana.svg.png", capital: "Georgetown" },
  { name: "Haiti", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/960px-Flag_of_Haiti.svg.png", capital: "Port-au-Prince" },
  { name: "Honduras", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Honduras_%282022%E2%80%93present%29.svg/960px-Flag_of_Honduras_%282022%E2%80%93present%29.svg.png", capital: "Tegucigalpa" },
  { name: "Hungary", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/960px-Flag_of_Hungary.svg.png", capital: "Budapest" },
  { name: "Iceland", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/960px-Flag_of_Iceland.svg.png", capital: "Reykjavik" },
  { name: "India", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/960px-Flag_of_India.svg.png", capital: "New Delhi" },
  { name: "Indonesia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/960px-Flag_of_Indonesia.svg.png", capital: "Jakarta" },
  { name: "Iran", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/960px-Flag_of_Iran.svg.png", capital: "Tehran" },
  { name: "Iraq", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/960px-Flag_of_Iraq.svg.png", capital: "Baghdad" },
  { name: "Ireland", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/960px-Flag_of_Ireland.svg.png", capital: "Dublin" },
  { name: "Israel", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/960px-Flag_of_Israel.svg.png", capital: "Jerusalem" },
  { name: "Italy", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/960px-Flag_of_Italy.svg.png", capital: "Rome" },
  { name: "Jamaica", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/960px-Flag_of_Jamaica.svg.png", capital: "Kingston" },
  { name: "Japan", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/960px-Flag_of_Japan.svg.png", capital: "Tokyo" },
  { name: "Jordan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/960px-Flag_of_Jordan.svg.png", capital: "Amman" },
  { name: "Kazakhstan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/960px-Flag_of_Kazakhstan.svg.png", capital: "Astana" },
  { name: "Kenya", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/960px-Flag_of_Kenya.svg.png", capital: "Nairobi" },
  { name: "Kiribati", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kiribati.svg/960px-Flag_of_Kiribati.svg.png", capital: "South Tarawa" },
  { name: "Kuwait", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/960px-Flag_of_Kuwait.svg.png", capital: "Kuwait City" },
  { name: "Kyrgyzstan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/960px-Flag_of_Kyrgyzstan.svg.png", capital: "Bishkek" },
  { name: "Laos", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/960px-Flag_of_Laos.svg.png", capital: "Vientiane" },
  { name: "Latvia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/960px-Flag_of_Latvia.svg.png", capital: "Riga" },
  { name: "Lebanon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Lebanon.svg/960px-Flag_of_Lebanon.svg.png", capital: "Beirut" },
  { name: "Lesotho", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Lesotho.svg/960px-Flag_of_Lesotho.svg.png", capital: "Maseru" },
  { name: "Liberia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Liberia.svg/960px-Flag_of_Liberia.svg.png", capital: "Monrovia" },
  { name: "Libya", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Libya.svg/960px-Flag_of_Libya.svg.png", capital: "Tripoli" },
  { name: "Liechtenstein", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Liechtenstein.svg/960px-Flag_of_Liechtenstein.svg.png", capital: "Vaduz" },
  { name: "Lithuania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Lithuania.svg/960px-Flag_of_Lithuania.svg.png", capital: "Vilnius" },
  { name: "Luxembourg", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Luxembourg.svg/960px-Flag_of_Luxembourg.svg.png", capital: "Luxembourg City" },
  { name: "Madagascar", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/960px-Flag_of_Madagascar.svg.png", capital: "Antananarivo" },
  { name: "Malawi", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/960px-Flag_of_Malawi.svg.png", capital: "Lilongwe" },
  { name: "Malaysia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/960px-Flag_of_Malaysia.svg.png", capital: "Kuala Lumpur" },
  { name: "Maldives", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/960px-Flag_of_Maldives.svg.png", capital: "Malé" },
  { name: "Mali", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Mali.svg/960px-Flag_of_Mali.svg.png", capital: "Bamako" },
  { name: "Malta", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Malta.svg/960px-Flag_of_Malta.svg.png", capital: "Valletta" },
  { name: "Marshall Islands", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/960px-Flag_of_the_Marshall_Islands.svg.png", capital: "Majuro" },
  { name: "Mauritania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Flag_of_Mauritania.svg/960px-Flag_of_Mauritania.svg.png", capital: "Nouakchott" },
  { name: "Mauritius", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Mauritius.svg/960px-Flag_of_Mauritius.svg.png", capital: "Port Louis" },
  { name: "Mexico", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/960px-Flag_of_Mexico.svg.png", capital: "Mexico City" },
  { name: "Micronesia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg/960px-Flag_of_the_Federated_States_of_Micronesia.svg.png", capital: "Palikir" },
  { name: "Moldova", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/960px-Flag_of_Moldova.svg.png", capital: "Chișinău" },
  { name: "Monaco", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/960px-Flag_of_Monaco.svg.png", capital: "Monaco" },
  { name: "Mongolia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/960px-Flag_of_Mongolia.svg.png", capital: "Ulaanbaatar" },
  { name: "Montenegro", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Montenegro.svg/960px-Flag_of_Montenegro.svg.png", capital: "Podgorica" },
  { name: "Morocco", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/960px-Flag_of_Morocco.svg.png", capital: "Rabat" },
  { name: "Mozambique", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/960px-Flag_of_Mozambique.svg.png", capital: "Maputo" },
  { name: "Myanmar", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_Myanmar.svg/960px-Flag_of_Myanmar.svg.png", capital: "Naypyidaw" },
  { name: "Namibia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/960px-Flag_of_Namibia.svg.png", capital: "Windhoek" },
  { name: "Nauru", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Nauru.svg/960px-Flag_of_Nauru.svg.png", capital: "Yaren" },
  { name: "Nepal", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/261px-Flag_of_Nepal.svg.png", capital: "Kathmandu" },
  { name: "Netherlands", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/960px-Flag_of_the_Netherlands.svg.png", capital: "Amsterdam" },
  { name: "New Zealand", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/960px-Flag_of_New_Zealand.svg.png", capital: "Wellington" },
  { name: "Nicaragua", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/960px-Flag_of_Nicaragua.svg.png", capital: "Managua" },
  { name: "Niger", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/960px-Flag_of_Niger.svg.png", capital: "Niamey" },
  { name: "Nigeria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/960px-Flag_of_Nigeria.svg.png", capital: "Abuja" },
  { name: "North Korea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/960px-Flag_of_North_Korea.svg.png", capital: "Pyongyang" },
  { name: "North Macedonia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_North_Macedonia.svg/960px-Flag_of_North_Macedonia.svg.png", capital: "Skopje" },
  { name: "Norway", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/960px-Flag_of_Norway.svg.png", capital: "Oslo" },
  { name: "Oman", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/960px-Flag_of_Oman.svg.png", capital: "Muscat" },
  { name: "Pakistan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/960px-Flag_of_Pakistan.svg.png", capital: "Islamabad" },
  { name: "Palau", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Palau.svg/960px-Flag_of_Palau.svg.png", capital: "Ngerulmud" },
  { name: "Palestine", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Palestine.svg/960px-Flag_of_Palestine.svg.png", capital: "Ramallah" },
  { name: "Panama", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/960px-Flag_of_Panama.svg.png", capital: "Panama City" },
  { name: "Papua New Guinea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/960px-Flag_of_Papua_New_Guinea.svg.png", capital: "Port Moresby" },
  { name: "Paraguay", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/960px-Flag_of_Paraguay.svg.png", capital: "Asunción" },
  { name: "Peru", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/960px-Flag_of_Peru.svg.png", capital: "Lima" },
  { name: "Philippines", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/960px-Flag_of_the_Philippines.svg.png", capital: "Manila" },
  { name: "Poland", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/960px-Flag_of_Poland.svg.png", capital: "Warsaw" },
  { name: "Portugal", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/960px-Flag_of_Portugal.svg.png", capital: "Lisbon" },
  { name: "Qatar", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/960px-Flag_of_Qatar.svg.png", capital: "Doha" },
  { name: "Romania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/960px-Flag_of_Romania.svg.png", capital: "Bucharest" },
  { name: "Russia", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/960px-Flag_of_Russia.svg.png", capital: "Moscow" },
  { name: "Rwanda", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/960px-Flag_of_Rwanda.svg.png", capital: "Kigali" },
  { name: "Saint Kitts and Nevis", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg/960px-Flag_of_Saint_Kitts_and_Nevis.svg.png", capital: "Basseterre" },
  { name: "Saint Lucia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Saint_Lucia.svg/960px-Flag_of_Saint_Lucia.svg.png", capital: "Castries" },
  { name: "Saint Vincent and the Grenadines", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg/960px-Flag_of_Saint_Vincent_and_the_Grenadines.svg.png", capital: "Kingstown" },
  { name: "Samoa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/960px-Flag_of_Samoa.svg.png", capital: "Apia" },
  { name: "San Marino", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Flag_of_San_Marino.svg/960px-Flag_of_San_Marino.svg.png", capital: "San Marino" },
  { name: "Sao Tome and Principe", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe.svg/960px-Flag_of_S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe.svg.png", capital: "São Tomé" },
  { name: "Saudi Arabia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/960px-Flag_of_Saudi_Arabia.svg.png", capital: "Riyadh" },
  { name: "Senegal", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/960px-Flag_of_Senegal.svg.png", capital: "Dakar" },
  { name: "Serbia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/960px-Flag_of_Serbia.svg.png", capital: "Belgrade" },
  { name: "Seychelles", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/960px-Flag_of_Seychelles.svg.png", capital: "Victoria" },
  { name: "Sierra Leone", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Sierra_Leone.svg/960px-Flag_of_Sierra_Leone.svg.png", capital: "Freetown" },
  { name: "Singapore", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/960px-Flag_of_Singapore.svg.png", capital: "Singapore" },
  { name: "Slovakia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/960px-Flag_of_Slovakia.svg.png", capital: "Bratislava" },
  { name: "Slovenia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Flag_of_Slovenia.svg/960px-Flag_of_Slovenia.svg.png", capital: "Ljubljana" },
  { name: "Solomon Islands", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/960px-Flag_of_the_Solomon_Islands.svg.png", capital: "Honiara" },
  { name: "Somalia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Somalia.svg/960px-Flag_of_Somalia.svg.png", capital: "Mogadishu" },
  { name: "South Africa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/960px-Flag_of_South_Africa.svg.png", capital: "Pretoria" },
  { name: "South Korea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/960px-Flag_of_South_Korea.svg.png", capital: "Seoul" },
  { name: "South Sudan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_South_Sudan.svg/960px-Flag_of_South_Sudan.svg.png", capital: "Juba" },
  { name: "Spain", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/960px-Flag_of_Spain.svg.png", capital: "Madrid" },
  { name: "Sri Lanka", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/960px-Flag_of_Sri_Lanka.svg.png", capital: "Sri Jayawardenepura Kotte" },
  { name: "Sudan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Sudan.svg/960px-Flag_of_Sudan.svg.png", capital: "Khartoum" },
  { name: "Suriname", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Suriname.svg/960px-Flag_of_Suriname.svg.png", capital: "Paramaribo" },
  { name: "Sweden", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/960px-Flag_of_Sweden.svg.png", capital: "Stockholm" },
  { name: "Switzerland", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/250px-Flag_of_Switzerland.svg.png", capital: "Bern" },
  { name: "Syria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Syria_%282025-%29.svg/960px-Flag_of_Syria_%282025-%29.svg.png", capital: "Damascus" },
  { name: "Taiwan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Flag_of_the_Republic_of_China.svg/960px-Flag_of_the_Republic_of_China.svg.png", capital: "Taipei" },
  { name: "Tajikistan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/960px-Flag_of_Tajikistan.svg.png", capital: "Dushanbe" },
  { name: "Tanzania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/960px-Flag_of_Tanzania.svg.png", capital: "Dodoma" },
  { name: "Thailand", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/960px-Flag_of_Thailand.svg.png", capital: "Bangkok" },
  { name: "Timor Leste (East Timor)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_East_Timor.svg/960px-Flag_of_East_Timor.svg.png", capital: "Dili" },
  { name: "Togo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Togo.svg/960px-Flag_of_Togo.svg.png", capital: "Lomé" },
  { name: "Tonga", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/960px-Flag_of_Tonga.svg.png", capital: "Nukuʻalofa" },
  { name: "Trinidad and Tobago", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Trinidad_and_Tobago.svg/960px-Flag_of_Trinidad_and_Tobago.svg.png", capital: "Port of Spain" },
  { name: "Tunisia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/960px-Flag_of_Tunisia.svg.png", capital: "Tunis" },
  { name: "Türkiye", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/960px-Flag_of_Turkey.svg.png", capital: "Ankara" },
  { name: "Turkmenistan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/960px-Flag_of_Turkmenistan.svg.png", capital: "Ashgabat" },
  { name: "Tuvalu", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tuvalu.svg/960px-Flag_of_Tuvalu.svg.png", capital: "Funafuti" },
  { name: "Uganda", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Uganda.svg/960px-Flag_of_Uganda.svg.png", capital: "Kampala" },
  { name: "Ukraine", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/960px-Flag_of_Ukraine.svg.png", capital: "Kyiv" },
  { name: "United Arab Emirates", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/960px-Flag_of_the_United_Arab_Emirates.svg.png", capital: "Abu Dhabi" },
  { name: "United Kingdom", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/960px-Flag_of_the_United_Kingdom.svg.png", capital: "London" },
  { name: "United States", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/960px-Flag_of_the_United_States.svg.png", capital: "Washington, D.C." },
  { name: "Uruguay", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/960px-Flag_of_Uruguay.svg.png", capital: "Montevideo" },
  { name: "Uzbekistan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/960px-Flag_of_Uzbekistan.svg.png", capital: "Tashkent" },
  { name: "Vanuatu", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Vanuatu.svg/960px-Flag_of_Vanuatu.svg.png", capital: "Port Vila" },
  { name: "Vatican City", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Flag_of_Vatican_City_%282023%E2%80%93present%29.svg/960px-Flag_of_Vatican_City_%282023%E2%80%93present%29.svg.png", capital: "Vatican City" },
  { name: "Venezuela", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/960px-Flag_of_Venezuela.svg.png", capital: "Caracas" },
  { name: "Vietnam", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/960px-Flag_of_Vietnam.svg.png", capital: "Hanoi" },
  { name: "Yemen", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Yemen.svg/960px-Flag_of_Yemen.svg.png", capital: "Sana'a" },
  { name: "Zambia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/960px-Flag_of_Zambia.svg.png", capital: "Lusaka" },
  { name: "Zimbabwe", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/960px-Flag_of_Zimbabwe.svg.png", capital: "Harare" }
];

// --- SUBDIVISIONS ---
// --- USA ---
const usStates = [
  { name: "Alabama", capital: "Montgomery", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Alabama.svg" },
  { name: "Alaska", capital: "Juneau", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg" },
  { name: "Arizona", capital: "Phoenix", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg" },
  { name: "Arkansas", capital: "Little Rock", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg" },
  { name: "California", capital: "Sacramento", flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg" },
  { name: "Colorado", capital: "Denver", flag: "https://upload.wikimedia.org/wikipedia/commons/4/46/Flag_of_Colorado.svg" },
  { name: "Connecticut", capital: "Hartford", flag: "https://upload.wikimedia.org/wikipedia/commons/9/96/Flag_of_Connecticut.svg" },
  { name: "Delaware", capital: "Dover", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Flag_of_Delaware.svg" },
  { name: "Florida", capital: "Tallahassee", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg" },
  { name: "Georgia", capital: "Atlanta", flag: "https://upload.wikimedia.org/wikipedia/commons/0/08/Flag_of_the_State_of_Georgia.svg" },
  { name: "Hawaii", capital: "Honolulu", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Hawaii.svg" },
  { name: "Idaho", capital: "Boise", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_Idaho.svg" },
  { name: "Illinois", capital: "Springfield", flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg" },
  { name: "Indiana", capital: "Indianapolis", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg" },
  { name: "Iowa", capital: "Des Moines", flag: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Iowa.svg" },
  { name: "Kansas", capital: "Topeka", flag: "https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Kansas.svg" },
  { name: "Kentucky", capital: "Frankfort", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Flag_of_Kentucky.svg" },
  { name: "Louisiana", capital: "Baton Rouge", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Louisiana.svg" },
  { name: "Maine", capital: "Augusta", flag: "https://upload.wikimedia.org/wikipedia/commons/3/35/Flag_of_Maine.svg" },
  { name: "Maryland", capital: "Annapolis", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg" },
  { name: "Massachusetts", capital: "Boston", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Massachusetts.svg" },
  { name: "Michigan", capital: "Lansing", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/960px-Flag_of_Michigan.svg.png" },
  { name: "Minnesota", capital: "St. Paul", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Minnesota.svg" },
  { name: "Mississippi", capital: "Jackson", flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Mississippi.svg" },
  { name: "Missouri", capital: "Jefferson City", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Missouri.svg" },
  { name: "Montana", capital: "Helena", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Montana.svg" },
  { name: "Nebraska", capital: "Lincoln", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Flag_of_Nebraska.svg" },
  { name: "Nevada", capital: "Carson City", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Nevada.svg" },
  { name: "New Hampshire", capital: "Concord", flag: "https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_New_Hampshire.svg" },
  { name: "New Jersey", capital: "Trenton", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/960px-Flag_of_New_Jersey.svg.png" },
  { name: "New Mexico", capital: "Santa Fe", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_New_Mexico.svg" },
  { name: "New York", capital: "Albany", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg" },
  { name: "North Carolina", capital: "Raleigh", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg" },
  { name: "North Dakota", capital: "Bismarck", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Flag_of_North_Dakota.svg" },
  { name: "Ohio", capital: "Columbus", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg" },
  { name: "Oklahoma", capital: "Oklahoma City", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Oklahoma.svg" },
  { name: "Oregon", capital: "Salem", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg" },
  { name: "Pennsylvania", capital: "Harrisburg", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pennsylvania.svg" },
  { name: "Rhode Island", capital: "Providence", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Rhode_Island.svg" },
  { name: "South Carolina", capital: "Columbia", flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_South_Carolina.svg" },
  { name: "South Dakota", capital: "Pierre", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_South_Dakota.svg" },
  { name: "Tennessee", capital: "Nashville", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg" },
  { name: "Texas", capital: "Austin", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg" },
  { name: "Utah", capital: "Salt Lake City", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Utah.svg" },
  { name: "Vermont", capital: "Montpelier", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Vermont.svg" },
  { name: "Virginia", capital: "Richmond", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/960px-Flag_of_Virginia.svg.png" },
  { name: "Washington", capital: "Olympia", flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg" },
  { name: "West Virginia", capital: "Charleston", flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_West_Virginia.svg" },
  { name: "Wisconsin", capital: "Madison", flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Wisconsin.svg" },
  { name: "Wyoming", capital: "Cheyenne", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Wyoming.svg" }
];
const usFederal = [
  { name: "Washington D.C. (District of Columbia)", capital: "Washington D.C.", flag: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Washington%2C_D.C.svg" }
];
  
 // --- CHINA ---
const chinaProvinces = [
  { name: "Anhui", capital: "Hefei", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d2/Flag_of_Anhui.png/960px-Flag_of_Anhui.png.png" },
  { name: "Fujian", capital: "Fuzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bb/Flag_of_Fujian.svg/960px-Flag_of_Fujian.svg.png" },
  { name: "Gansu", capital: "Lanzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/4/49/Flag_of_Gansu.svg/960px-Flag_of_Gansu.svg.png" },
  { name: "Guangdong", capital: "Guangzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/7/74/Flag_of_Guangdong.jpg/960px-Flag_of_Guangdong.jpg.png" },
  { name: "Guizhou", capital: "Guiyang", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b4/Flag_of_Guizhou.svg/960px-Flag_of_Guizhou.svg.png" },
  { name: "Hainan", capital: "Haikou", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b7/Flag_of_Hainan.svg/960px-Flag_of_Hainan.svg.png" },
  { name: "Hebei", capital: "Shijiazhuang", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9b/Flag_of_Hebei.svg/960px-Flag_of_Hebei.svg.png" },
  { name: "Heilongjiang", capital: "Harbin", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8b/Flag_of_Heilongjiang.svg/960px-Flag_of_Heilongjiang.svg.png" },
  { name: "Henan", capital: "Zhengzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/7/73/Flag_of_Henan_Province.svg/960px-Flag_of_Henan_Province.svg.png" },
  { name: "Hubei", capital: "Wuhan", flag: "https://static.wikia.nocookie.net/vexillology/images/8/83/Flag_of_Hubei.svg/960px-Flag_of_Hubei.svg.png" },
  { name: "Hunan", capital: "Changsha", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/Flag_of_Hunan.svg/960px-Flag_of_Hunan.svg.png" },
  { name: "Jiangsu", capital: "Nanjing", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ae/Flag_of_Jiangsu.jpg/960px-Flag_of_Jiangsu.jpg.png" },
  { name: "Jiangxi", capital: "Nanchang", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/Flag_of_Jiangxi.svg/960px-Flag_of_Jiangxi.svg.png" },
  { name: "Jilin", capital: "Changchun", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6c/Jilin_flag.png/960px-Jilin_flag.png.png" },
  { name: "Liaoning", capital: "Shenyang", flag: "https://static.wikia.nocookie.net/vexillology/images/4/46/Flag_of_Liaoning.svg/960px-Flag_of_Liaoning.svg.png" },
  { name: "Qinghai", capital: "Xining", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f2/Flag_of_Qinghai.png/960px-Flag_of_Qinghai.png.png" },
  { name: "Shaanxi", capital: "Xi'an", flag: "https://static.wikia.nocookie.net/vexillology/images/8/84/Flag_of_Shaanxi.png/960px-Flag_of_Shaanxi.png.png" },
  { name: "Shandong", capital: "Jinan", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4f/Flag_of_Shandong.svg/960px-Flag_of_Shandong.svg.png" },
  { name: "Shanxi", capital: "Taiyuan", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5e/Flag_of_Shanxi.jpg/960px-Flag_of_Shanxi.jpg.png" },
  { name: "Sichuan", capital: "Chengdu", flag: "https://static.wikia.nocookie.net/vexillology/images/4/42/Flag_of_Sichuan.jpg/960px-Flag_of_Sichuan.jpg.png" },
  { name: "Yunnan", capital: "Kunming", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8c/Flag_of_Yunnan.svg/960px-Flag_of_Yunnan.svg.png" },
  { name: "Zhejiang", capital: "Hangzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8f/Flag_of_Zhejiang.png/960px-Flag_of_Zhejiang.png.png" }
];
const chinaAutonomous = [
  { name: "Guangxi", capital: "Nanning", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b1/Flag_of_Guangxi.svg/960px-Flag_of_Guangxi.svg.png" },
  { name: "Inner Mongolia", capital: "Hohhot", flag: "https://static.wikia.nocookie.net/vexillology/images/6/62/Flag_of_the_Inner_Mongolian_People%27s_Party.svg/960px-Flag_of_the_Inner_Mongolian_People%27s_Party.svg.png" },
  { name: "Ningxia", capital: "Yinchuan", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/Ningxia.png/960px-Flag_of_Ningxia.png.png" },
  { name: "Tibet", capital: "Lhasa", flag: "https://static.wikia.nocookie.net/vexillology/images/0/03/Tibet.png/1600px-Tibet.png.png" },
  { name: "Xinjiang", capital: "Ürümqi", flag: "https://static.wikia.nocookie.net/vexillology/images/4/46/Flag_of_Xinjiang.png/1600px-Flag_of_Xinjiang.png.png" }
];
const chinaMunicipalities = [
  { name: "Beijing", capital: "Beijing", flag: "https://static.wikia.nocookie.net/vexillology/images/5/52/Beijing_FlagRedesign_S020730zm.svg/960px-Beijing_FlagRedesign_S020730zm.svg.png" },
  { name: "Chongqing", capital: "Chongqing", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4a/Flag_of_Chongqing.svg/960px-Flag_of_Chongqing.svg.png" },
  { name: "Shanghai", capital: "Shanghai", flag: "https://static.wikia.nocookie.net/vexillology/images/2/26/Flag_of_Shanghai.svg/960px-Flag_of_Shanghai.svg.png" },
  { name: "Tianjin", capital: "Tianjin", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e0/Flag_of_Tianjin.svg/960px-Flag_of_Tianjin.svg.png" }
];

// --- GERMANY ---
const germanyStates = [
  { name: "Baden-Württemberg", capital: "Stuttgart", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Baden-W%C3%BCrttemberg_%28state%2C_greater_arms%29_2020.svg" },
  { name: "Bavaria", capital: "Munich", flag: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_Bavaria_%28lozengy%29.svg" },
  { name: "Berlin", capital: "Berlin", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Berlin.svg" },
  { name: "Brandenburg", capital: "Potsdam", flag:"https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Brandenburg.svg" },
  { name: "Bremen", capital: "Bremen", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/State_flag_of_Bremen.svg" },
  { name: "Hamburg", capital: "Hamburg", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Flagge_Hamburg.svg" },
  { name: "Hesse", capital: "Wiesbaden", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Flag_of_Hesse_%28state%29.svg" },
  { name: "Lower Saxony", capital: "Hanover", flag: "https://upload.wikimedia.org/wikipedia/commons/2/28/Flag_of_Lower_Saxony_%28state_ensign%29.svg" },
  { name: "Mecklenburg-Vorpommern", capital: "Schwerin", flag: "https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Mecklenburg-Western_Pomerania_%28state%29.svg" },
  { name: "North Rhine-Westphalia", capital: "Düsseldorf", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_North_Rhine-Westphalia_%28state%29.svg" },
  { name: "Rhineland-Palatinate", capital: "Mainz", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Rhineland-Palatinate.svg" },
  { name: "Saarland", capital: "Saarbrücken", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Saarland.svg/960px-Flag_of_Saarland.svg.png" },
  { name: "Saxony", capital: "Dresden", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Flag_of_Saxony_%28state%29.svg" },
  { name: "Saxony-Anhalt", capital: "Magdeburg", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Flag_of_Saxony-Anhalt_%28state%29.svg" },
  { name: "Schleswig-Holstein", capital: "Kiel", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Schleswig-Holstein_%28state%29.svg" },
  { name: "Thuringia", capital: "Erfurt", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Thuringia_%28state%29.svg" }
];

// --- INDIA ---
const indiaStates = [
  { name: "Andhra Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8e/Andhra_Pradesh.png/960px-Andhra_Pradesh.png.png" },
  { name: "Arunachal Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/0/01/Arunachal_Pradesh.png/960px-Arunachal_Pradesh.png.png" },
  { name: "Assam", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/Assam.png/1600px-Assam.png.png" },
  { name: "Bihar", flag: "https://static.wikia.nocookie.net/vexillology/images/1/1f/Bihar.png/1600px-Bihar.png.png" },
  { name: "Chhattisgarh", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3c/Chhattisgarh.png/960px-Chhattisgarh.png.png" },
  { name: "Goa", flag: "https://static.wikia.nocookie.net/vexillology/images/1/19/Flag_of_Goa.svg/960px-Flag_of_Goa.svg.png" },
  { name: "Gujarat", flag: "https://static.wikia.nocookie.net/vexillology/images/5/53/Gujarat.png/960px-Gujarat.png.png" },
  { name: "Haryana", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e9/Haryana.png/960px-Haryana.png.png" },
  { name: "Himachal Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/4/44/Himachal_Pradesh.png/960px-Himachal_Pradesh.png.png" },
  { name: "Jharkhand", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a3/Jharkhand.png/1600px-Jharkhand.png.png" },
  { name: "Karnataka", flag: "https://static.wikia.nocookie.net/vexillology/images/1/18/Karnataka.png/1600px-Karnataka.png.png" },
  { name: "Kerala", flag: "https://static.wikia.nocookie.net/vexillology/images/3/30/Kerala.png/1600px-Kerala.png.png" },
  { name: "Madhya Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b0/Madhya_Pradesh.png/960px-Madhya_Pradesh.png.png" },
  { name: "Maharashtra", flag: "https://static.wikia.nocookie.net/vexillology/images/e/ec/Maharashtra.png/960px-Maharashtra.png.png" },
  { name: "Manipur", flag: "https://static.wikia.nocookie.net/vexillology/images/7/71/Manipur.png/1600px-Manipur.png.png" },
  { name: "Meghalaya", flag: "https://static.wikia.nocookie.net/vexillology/images/6/65/Meghalaya.png/960px-Meghalaya.png.png" },
  { name: "Mizoram", flag: "https://static.wikia.nocookie.net/vexillology/images/e/eb/Mizoram.png/960px-Mizoram.png.png" },
  { name: "Nagaland", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9c/In_nagaland.png/960px-In_nagaland.png.png" },
  { name: "Odisha", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f0/Odisha.png/960px-Odisha.png.png" },
  { name: "Punjab", flag: "https://static.wikia.nocookie.net/vexillology/images/6/63/Punjab.png/1600px-Punjab.png.png" },
  { name: "Rajasthan", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3d/Rajasthan.png/1600px-Rajasthan.png.png" },
  { name: "Sikkim", flag: "https://static.wikia.nocookie.net/vexillology/images/8/83/1024px-Flag_of_Sikkim_%281967-1975%29.svg_%281%29.png/640px-1024px-Flag_of_Sikkim_%281967-1975%29.svg_%281%29.png.png" },
  { name: "Tamil Nadu", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fd/Tamil_Nadu.png/960px-Tamil_Nadu.png.png" },
  { name: "Telangana", flag: "https://static.wikia.nocookie.net/vexillology/images/4/48/Telangana.png/960px-Telangana.png.png" },
  { name: "Tripura", flag: "https://static.wikia.nocookie.net/vexillology/images/9/94/Tripura.png/960px-Tripura.png.png" },
  { name: "Uttar Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/1/18/Uttar_Pradesh.png/960px-Uttar_Pradesh.png.png" },
  { name: "Uttarakhand", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bd/Uttarakhand.png/1600px-Uttarakhand.png.png" },
  { name: "West Bengal", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0b/West_Bengal.png/1600px-West_Bengal.png.png" }
];

// --- JAPAN ---
const japanPrefectures = [
  { name: "Aichi", capital: "Nagoya", flag: "https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Aichi_Prefecture.svg" },
  { name: "Akita", capital: "Akita", flag: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Akita_Prefecture.svg" },
  { name: "Aomori", capital: "Aomori", flag: "https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Aomori_Prefecture.svg" },
  { name: "Chiba", capital: "Chiba", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Chiba_Prefecture.svg" },
  { name: "Ehime", capital: "Matsuyama", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_Ehime_Prefecture.svg" },
  { name: "Fukui", capital: "Fukui", flag: "https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Fukui_Prefecture.svg" },
  { name: "Fukuoka", capital: "Fukuoka", flag: "https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Fukuoka_Prefecture.svg" },
  { name: "Fukushima", capital: "Fukushima", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Fukushima_Prefecture.svg" },
  { name: "Gifu", capital: "Gifu", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Gifu_Prefecture.svg" },
  { name: "Gunma", capital: "Maebashi", flag: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Gunma_Prefecture.svg" },
  { name: "Hiroshima", capital: "Hiroshima", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Hiroshima_Prefecture.svg" },
  { name: "Hokkaido", capital: "Sapporo", flag: "https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Hokkaido_Prefecture.svg" },
  { name: "Hyogo", capital: "Kobe", flag: "https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_Hyogo_Prefecture.svg" },
  { name: "Ibaraki", capital: "Mito", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Flag_of_Ibaraki_Prefecture.svg" },
  { name: "Ishikawa", capital: "Kanazawa", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Ishikawa_Prefecture.svg" },
  { name: "Iwate", capital: "Morioka", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Iwate_Prefecture.svg" },
  { name: "Kagawa", capital: "Takamatsu", flag: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Kagawa_Prefecture.svg" },
  { name: "Kagoshima", capital: "Kagoshima", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Flag_of_Kagoshima_Prefecture.svg" },
  { name: "Kanagawa", capital: "Yokohama", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Flag_of_Kanagawa_Prefecture.svg" },
  { name: "Kochi", capital: "Kochi", flag: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Kochi_Prefecture.svg" },
  { name: "Kumamoto", capital: "Kumamoto", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Kumamoto_Prefecture.svg" },
  { name: "Kyoto", capital: "Kyoto", flag: "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Kyoto_Prefecture.svg" },
  { name: "Mie", capital: "Tsu", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Mie_Prefecture.svg" },
  { name: "Miyagi", capital: "Sendai", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Miyagi_Prefecture.svg" },
  { name: "Miyazaki", capital: "Miyazaki", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Flag_of_Miyazaki_Prefecture.svg" },
  { name: "Nagano", capital: "Nagano", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Nagano_Prefecture.svg" },
  { name: "Nagasaki", capital: "Nagasaki", flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Nagasaki_Prefecture.svg" },
  { name: "Nara", capital: "Nara", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Nara_Prefecture.svg" },
  { name: "Niigata", capital: "Niigata", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_Niigata_Prefecture.svg" },
  { name: "Oita", capital: "Oita", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Oita_Prefecture.svg" },
  { name: "Okayama", capital: "Okayama", flag: "https://upload.wikimedia.org/wikipedia/commons/3/33/Flag_of_Okayama_Prefecture.svg" },
  { name: "Okinawa", capital: "Naha", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Okinawa_Prefecture.svg" },
  { name: "Osaka", capital: "Osaka", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Osaka_Prefecture.svg" },
  { name: "Saga", capital: "Saga", flag: "https://upload.wikimedia.org/wikipedia/commons/1/18/Flag_of_Saga_Prefecture.svg" },
  { name: "Saitama", capital: "Saitama", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Flag_of_Saitama_Prefecture.svg" },
  { name: "Shiga", capital: "Otsu", flag: "https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Shiga_Prefecture.svg" },
  { name: "Shimane", capital: "Matsue", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Shimane_Prefecture.svg" },
  { name: "Shizuoka", capital: "Shizuoka", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Shizuoka_Prefecture.svg" },
  { name: "Tochigi", capital: "Utsunomiya", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Tochigi_Prefecture.svg" },
  { name: "Tokushima", capital: "Tokushima", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Tokushima_Prefecture.svg" },
  { name: "Tokyo", capital: "Tokyo", flag: "https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Tokyo_Metropolis.svg" },
  { name: "Tottori", capital: "Tottori", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Tottori_Prefecture.svg" },
  { name: "Toyama", capital: "Toyama", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Flag_of_Toyama_Prefecture.svg" },
  { name: "Wakayama", capital: "Wakayama", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Flag_of_Wakayama_Prefecture.svg" },
  { name: "Yamagata", capital: "Yamagata", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Flag_of_Yamagata_Prefecture.svg" },
  { name: "Yamaguchi", capital: "Yamaguchi", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Yamaguchi_Prefecture.svg" },
  { name: "Yamanashi", capital: "Kofu", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Yamanashi_Prefecture.svg" }
];

// --- UK ---
const ukConstituentCountries = [
  { name: "England", capital: "London", flag: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg" },
  { name: "Northern Ireland", capital: "Belfast", flag: "https://static.wikia.nocookie.net/vexillology/images/4/43/Flag_of_Northern_Ireland_%281953%E2%80%931972%29.svg/960px-Flag_of_Northern_Ireland_%281953%E2%80%931972%29.svg.png" },
  { name: "Scotland", capital: "Edinburgh", flag: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Scotland.svg" },
  { name: "Wales", capital: "Cardiff", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Wales.svg" }
];

// --- FRANCE ---
const franceRegions = [
  { name: "Auvergne-Rhône-Alpes", capital: "Lyon", flag: "https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_the_region_Auvergne-Rh%C3%B4ne-Alpes.svg" },
  { name: "Bourgogne-Franche-Comté", capital: "Dijon", flag: "https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_the_region_Bourgogne-Franche-Comt%C3%A9_%28fixed%29.svg" },
  { name: "Brittany", capital: "Rennes", flag: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Brittany_%28Gwenn_ha_du%29.svg" },
  { name: "Centre-Val de Loire", capital: "Orléans", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Flag_of_Centre-Val_de_Loire.svg" },
  { name: "Corsica", capital: "Ajaccio", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7c/Flag_of_Corsica.svg/960px-Flag_of_Corsica.svg.png" },
  { name: "Grand Est", capital: "Strasbourg", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Proposed_design_for_the_flag_of_Grand_Est.svg" },
  { name: "Hauts-de-France", capital: "Lille", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Proposed_design_for_the_flag_of_Hauts-de-France.svg" },
  { name: "Île-de-France", capital: "Paris", flag: "https://static.wikia.nocookie.net/vexillology/images/b/ba/Flag_of_%C3%8Ele-de-France_%28arms%29.svg/960px-Flag_of_%C3%8Ele-de-France_%28arms%29.svg.png" },
  { name: "Normandy", capital: "Rouen", flag: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Normandie.svg" },
  { name: "Nouvelle-Aquitaine", capital: "Bordeaux", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Flag_of_Nouvelle-Aquitaine.svg" },
  { name: "Occitanie", capital: "Toulouse", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Flag_of_R%C3%A9gion_Occitanie_%28symbol_only%29.svg" },
  { name: "Pays de la Loire", capital: "Nantes", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e4/Flag_of_Pays_de_la_Loire.svg/960px-Flag_of_Pays_de_la_Loire.svg" },
  { name: "Provence-Alpes-Côte d'Azur", capital: "Marseille", flag: "https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_Provence-Alpes-C%C3%B4te_d%27Azur.svg" }
];

// --- ITALY ---
const italyRegions = [
  { name: "Abruzzo", capital: "L'Aquila", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Abruzzo.svg/1200px-Flag_of_Abruzzo.svg.png" },
  { name: "Apulia", capital: "Bari", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Apulia.svg/800px-Flag_of_Apulia.svg.png" },
  { name: "Basilicata", capital: "Potenza", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Flag_of_Basilicata.svg" },
  { name: "Calabria", capital: "Catanzaro", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Flag_of_Calabria.svg" },
  { name: "Campania", capital: "Naples (Napoli)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Flag_of_Campania.svg/960px-Flag_of_Campania.svg.png" },
  { name: "Emilia-Romagna", capital: "Bologna", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Emilia-Romagna_%28de_facto%29.svg/960px-Flag_of_Emilia-Romagna_%28de_facto%29.svg.png" },
  { name: "Lazio", capital: "Rome (Roma)", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Flag_of_Lazio.svg" },
  { name: "Liguria", capital: "Genoa (Genova)", flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Liguria.svg" },
  { name: "Lombardy", capital: "Milan (Milano)", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Lombardy.svg" },
  { name: "Marche", capital: "Ancona", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Flag_of_Marche.svg/960px-Flag_of_Marche.svg.png" },
  { name: "Molise", capital: "Campobasso", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Molise.svg/960px-Flag_of_Molise.svg.png" },
  { name: "Piedmont", capital: "Turin (Torino)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Piedmont.svg/960px-Flag_of_Piedmont.svg.png" },
  { name: "Tuscany", capital: "Florence (Firenze)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Tuscany.svg/960px-Flag_of_Tuscany.svg.png" },
  { name: "Umbria", capital: "Perugia", flag: "https://static.wikia.nocookie.net/vexillology/images/c/cc/Flag_of_Umbria.svg/960px-Flag_of_Umbria.svg.png" },
  { name: "Veneto", capital: "Venice (Venezia)", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d5/Flag_of_Veneto.svg/1600px-Flag_of_Veneto.svg.png" }
];
const italyAutonomousRegions = [
  { name: "Aosta Valley", capital: "Aosta", flag: "https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Valle_d%27Aosta.svg" },
  { name: "Friuli Venezia Giulia", capital: "Trieste", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flag_of_Friuli-Venezia_Giulia.svg/960px-Flag_of_Friuli-Venezia_Giulia.svg.png" },
  { name: "Sardinia", capital: "Cagliari", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Sardinia%2C_Italy.svg/960px-Flag_of_Sardinia%2C_Italy.svg.png" },
  { name: "Sicily", capital: "Palermo", flag: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_Sicily.svg" },
  { name: "Trentino-Alto Adige/Südtirol", capital: "Trento", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Flag_of_Trentino-South_Tyrol.svg/960px-Flag_of_Trentino-South_Tyrol.svg.png" }
];

// --- CANADA ---
const canadaProvinces = [
  { name: "Alberta", capital: "Edmonton", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Alberta.svg" },
  { name: "British Columbia", capital: "Victoria", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_British_Columbia.svg" },
  { name: "Manitoba", capital: "Winnipeg", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Manitoba.svg" },
  { name: "New Brunswick", capital: "Fredericton", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_New_Brunswick.svg" },
  { name: "Newfoundland and Labrador", capital: "St. John's", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Newfoundland_and_Labrador.svg" },
  { name: "Nova Scotia", capital: "Halifax", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Nova_Scotia.svg" },
  { name: "Ontario", capital: "Toronto", flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Ontario.svg" },
  { name: "Prince Edward Island", capital: "Charlottetown", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Flag_of_Prince_Edward_Island.svg" },
  { name: "Quebec", capital: "Quebec City", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg" },
  { name: "Saskatchewan", capital: "Regina", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_Saskatchewan.svg" },
];

// --- BRAZIL ---
const brazilStates = [
  { name: "Acre", capital: "Rio Branco", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bandeira_do_Acre.svg/960px-Bandeira_do_Acre.svg.png" },
  { name: "Alagoas", capital: "Maceió", flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg" },
  { name: "Amapá", capital: "Macapá", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Bandeira_do_Amap%C3%A1.svg" },
  { name: "Amazonas", capital: "Manaus", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bandeira_do_Amazonas.svg/960px-Bandeira_do_Amazonas.svg.png" },
  { name: "Bahia", capital: "Salvador", flag: "https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg" },
  { name: "Ceará", capital: "Fortaleza", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bandeira_do_Cear%C3%A1.svg/960px-Bandeira_do_Cear%C3%A1.svg.png" },
  { name: "Espírito Santo", capital: "Vitória", flag: "https://upload.wikimedia.org/wikipedia/commons/4/43/Bandeira_do_Esp%C3%ADrito_Santo.svg" },
  { name: "Goiás", capital: "Goiânia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Flag_of_Goi%C3%A1s.svg/960px-Flag_of_Goi%C3%A1s.svg.png" },
  { name: "Maranhão", capital: "São Luís", flag: "https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranh%C3%A3o.svg" },
  { name: "Mato Grosso", capital: "Cuiabá", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg" },
  { name: "Mato Grosso do Sul", capital: "Campo Grande", flag: "https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg" },
  { name: "Minas Gerais", capital: "Belo Horizonte", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg" },
  { name: "Pará", capital: "Belém", flag: "https://upload.wikimedia.org/wikipedia/commons/0/02/Bandeira_do_Par%C3%A1.svg" },
  { name: "Paraíba", capital: "João Pessoa", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg" },
  { name: "Paraná", capital: "Curitiba", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Bandeira_do_Paran%C3%A1.svg/960px-Bandeira_do_Paran%C3%A1.svg.png" },
  { name: "Pernambuco", capital: "Recife", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Bandeira_de_Pernambuco.svg/960px-Bandeira_de_Pernambuco.svg.png" },
  { name: "Piauí", capital: "Teresina", flag: "https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piau%C3%AD.svg" },
  { name: "Rio de Janeiro", capital: "Rio de Janeiro", flag: "https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg" },
  { name: "Rio Grande do Norte", capital: "Natal", flag: "https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg" },
  { name: "Rio Grande do Sul", capital: "Porto Alegre", flag: "https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg" },
  { name: "Rondônia", capital: "Porto Velho", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rond%C3%B4nia.svg" },
  { name: "Roraima", capital: "Boa Vista", flag: "https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg" },
  { name: "Santa Catarina", capital: "Florianópolis", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg" },
  { name: "São Paulo", capital: "São Paulo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg/960px-Bandeira_do_estado_de_S%C3%A3o_Paulo.svg.png" },
  { name: "Sergipe", capital: "Aracaju", flag: "https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg" },
  { name: "Tocantins", capital: "Palmas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Bandeira_do_Tocantins.svg/960px-Bandeira_do_Tocantins.svg.png" },
];
const brazilFederal = [
  { name: "Distrito Federal (Federal District)", capital: "Brasília", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bandeira_do_Distrito_Federal_%28Brasil%29.svg" }
];

// --- RUSSIA ---
const russiaRepublics = [
  { name: "Adygea", capital: "Maykop", flag: "https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_Adygea.svg" },
  { name: "Altai Republic", capital: "Gorno-Altaysk", flag: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Altai_Republic.svg" },
  { name: "Bashkortostan", capital: "Ufa", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Flag_of_Bashkortostan.svg" },
  { name: "Buryatia", capital: "Ulan-Ude", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Buryatia.svg/960px-Flag_of_Buryatia.svg.png" },
  { name: "Chechnya (Chechen Republic)", capital: "Grozny", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Flag_of_the_Chechen_Republic.svg/960px-Flag_of_the_Chechen_Republic.svg.png" },
  { name: "Chuvashia", capital: "Cheboksary", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Flag_of_Chuvashia.svg/960px-Flag_of_Chuvashia.svg.png" },
  { name: "Dagestan", capital: "Makhachkala", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_Dagestan.svg" },
  { name: "Ingushetia", capital: "Magas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Ingushetia.svg/960px-Flag_of_Ingushetia.svg.png" },
  { name: "Kabardino-Balkaria", capital: "Nalchik", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Kabardino-Balkaria.svg" },
  { name: "Kalmykia", capital: "Elista", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Kalmykia.svg/960px-Flag_of_Kalmykia.svg.png" },
  { name: "Karachay-Cherkessia", capital: "Cherkessk", flag: "https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Karachay-Cherkessia.svg" },
  { name: "Karelia", capital: "Petrozavodsk", flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Karelia.svg" },
  { name: "Khakassia", capital: "Abakan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Khakassia.svg/960px-Flag_of_Khakassia.svg.png" },
  { name: "Komi Republic", capital: "Syktyvkar", flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Komi.svg" },
  { name: "Mari El", capital: "Yoshkar-Ola", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Flag_of_Mari_El.svg" },
  { name: "Mordovia", capital: "Saransk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Mordovia.svg/960px-Flag_of_Mordovia.svg.png" },
  { name: "North Ossetia–Alania", capital: "Vladikavkaz", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Flag_of_North_Ossetia.svg/960px-Flag_of_North_Ossetia.svg.png" },
  { name: "Sakha Republic (Yakutia)", capital: "Yakutsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Flag_of_Sakha.svg/960px-Flag_of_Sakha.svg.png" },
  { name: "Tatarstan", capital: "Kazan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Tatarstan.svg/960px-Flag_of_Tatarstan.svg.png" },
  { name: "Tuva Republic", capital: "Kyzyl", flag: "https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Tuva.svg" },
  { name: "Udmurtia", capital: "Izhevsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Udmurtia.svg/960px-Flag_of_Udmurtia.svg.png" }
];
const russiaKrais = [
  { name: "Altai Krai", capital: "Barnaul", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Altai_Krai.svg" },
  { name: "Kamchatka Krai", capital: "Petropavlovsk-Kamchatsky", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Flag_of_Kamchatka_Krai.svg" },
  { name: "Khabarovsk Krai", capital: "Khabarovsk", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Flag_of_Khabarovsk_Krai.svg" },
  { name: "Krasnodar Krai", capital: "Krasnodar", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Flag_of_Krasnodar_Krai.svg/960px-Flag_of_Krasnodar_Krai.svg.png" },
  { name: "Krasnoyarsk Krai", capital: "Krasnoyarsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_Krasnoyarsk_Krai.svg/960px-Flag_of_Krasnoyarsk_Krai.svg.png" },
  { name: "Perm Krai", capital: "Perm", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Perm_Krai.svg" },
  { name: "Primorsky Krai", capital: "Vladivostok", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Primorsky_Krai.svg/960px-Flag_of_Primorsky_Krai.svg.png" },
  { name: "Stavropol Krai", capital: "Stavropol", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Stavropol_Krai.svg/960px-Flag_of_Stavropol_Krai.svg.png" },
  { name: "Zabaykalsky Krai", capital: "Chita", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Zabaykalsky_Krai.svg/960px-Flag_of_Zabaykalsky_Krai.svg.png" }
];
const russiaOblasts = [
  { name: "Amur Oblast", capital: "Blagoveshchensk", flag: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_Amur_Oblast.svg" },
  { name: "Arkhangelsk Oblast", capital: "Arkhangelsk", flag: "https://upload.wikimedia.org/wikipedia/commons/1/16/Flag_of_Arkhangelsk_Oblast.svg" },
  { name: "Astrakhan Oblast", capital: "Astrakhan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Flag_of_Astrakhan_Oblast.svg/960px-Flag_of_Astrakhan_Oblast.svg.png" },
  { name: "Belgorod Oblast", capital: "Belgorod", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Flag_of_Belgorod_Oblast.svg/960px-Flag_of_Belgorod_Oblast.svg.png" },
  { name: "Bryansk Oblast", capital: "Bryansk", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Bryansk_Oblast.svg" },
  { name: "Chelyabinsk Oblast", capital: "Chelyabinsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Chelyabinsk_Oblast.svg/960px-Flag_of_Chelyabinsk_Oblast.svg.png" },
  { name: "Irkutsk Oblast", capital: "Irkutsk", flag: "https://upload.wikimedia.org/wikipedia/commons/1/14/Flag_of_Irkutsk_Oblast.svg" },
  { name: "Ivanovo Oblast", capital: "Ivanovo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Ivanovo_Oblast.svg/960px-Flag_of_Ivanovo_Oblast.svg.png" },
  { name: "Kaliningrad Oblast", capital: "Kaliningrad", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_Kaliningrad_Oblast.svg/960px-Flag_of_Kaliningrad_Oblast.svg.png" },
  { name: "Kaluga Oblast", capital: "Kaluga", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Kaluga_Oblast.svg/960px-Flag_of_Kaluga_Oblast.svg.png" },
  { name: "Kemerovo Oblast", capital: "Kemerovo", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_Kemerovo_Oblast.svg" },
  { name: "Kirov Oblast", capital: "Kirov", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Kirov_Oblast.svg/960px-Flag_of_Kirov_Oblast.svg.png" },
  { name: "Kostroma Oblast", capital: "Kostroma", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Kostroma_Oblast.svg" },
  { name: "Kurgan Oblast", capital: "Kurgan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Kurgan_Oblast.svg/960px-Flag_of_Kurgan_Oblast.svg.png" },
  { name: "Kursk Oblast", capital: "Kursk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Flag_of_Kursk_Oblast.svg/960px-Flag_of_Kursk_Oblast.svg.png" },
  { name: "Leningrad Oblast", capital: "Gatchina", flag: "https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Leningrad_Oblast.svg" },
  { name: "Lipetsk Oblast", capital: "Lipetsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Lipetsk_Oblast.svg/960px-Flag_of_Lipetsk_Oblast.svg.png" },
  { name: "Magadan Oblast", capital: "Magadan", flag: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Magadan_Oblast.svg" },
  { name: "Moscow Oblast", capital: "Krasnogorsk", flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Moscow_oblast.svg" },
  { name: "Murmansk Oblast", capital: "Murmansk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Flag_of_Murmansk_Oblast.svg/960px-Flag_of_Murmansk_Oblast.svg.png" },
  { name: "Nizhny Novgorod Oblast", capital: "Nizhny Novgorod", flag: "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Nizhny_Novgorod_Region.svg" },
  { name: "Novgorod Oblast", capital: "Veliky Novgorod", flag: "https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Novgorod_Oblast.svg" },
  { name: "Novosibirsk Oblast", capital: "Novosibirsk", flag: "https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Novosibirsk_Oblast.svg" },
  { name: "Omsk Oblast", capital: "Omsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Omsk_Oblast.svg/960px-Flag_of_Omsk_Oblast.svg.png" },
  { name: "Orenburg Oblast", capital: "Orenburg", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Flag_of_Orenburg_Oblast.svg/960px-Flag_of_Orenburg_Oblast.svg.png" },
  { name: "Oryol Oblast", capital: "Oryol", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Oryol_Oblast.svg/960px-Flag_of_Oryol_Oblast.svg.png" },
  { name: "Penza Oblast", capital: "Penza", flag: "https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Penza_Oblast.svg" },
  { name: "Pskov Oblast", capital: "Pskov", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Pskov_Oblast.svg" },
  { name: "Rostov Oblast", capital: "Rostov-on-Don", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Rostov_Oblast.svg" },
  { name: "Ryazan Oblast", capital: "Ryazan", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Ryazan_Oblast.svg" },
  { name: "Sakhalin Oblast", capital: "Yuzhno-Sakhalinsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Flag_of_Sakhalin_Oblast.svg/960px-Flag_of_Sakhalin_Oblast.svg.png" },
  { name: "Samara Oblast", capital: "Samara", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Flag_of_Samara_Oblast.svg/960px-Flag_of_Samara_Oblast.svg.png" },
  { name: "Saratov Oblast", capital: "Saratov", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Flag_of_Saratov_Oblast.svg" },
  { name: "Smolensk Oblast", capital: "Smolensk", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Smolensk_Oblast.svg" },
  { name: "Sverdlovsk Oblast", capital: "Yekaterinburg", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Sverdlovsk_Oblast.svg/960px-Flag_of_Sverdlovsk_Oblast.svg.png" },
  { name: "Tambov Oblast", capital: "Tambov", flag: "https://upload.wikimedia.org/wikipedia/commons/3/39/Flag_of_Tambov_Oblast.svg" },
  { name: "Tomsk Oblast", capital: "Tomsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Tomsk_Oblast.svg/960px-Flag_of_Tomsk_Oblast.svg.png" },
  { name: "Tula Oblast", capital: "Tula", flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Tula_Oblast.svg" },
  { name: "Tver Oblast", capital: "Tver", flag: "https://upload.wikimedia.org/wikipedia/commons/6/60/Flag_of_Tver_Oblast.svg" },
  { name: "Tyumen Oblast", capital: "Tyumen", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Tyumen_Oblast.svg" },
  { name: "Ulyanovsk Oblast", capital: "Ulyanovsk", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Flag_of_Ulyanovsk_Oblast.svg" },
  { name: "Vladimir Oblast", capital: "Vladimir", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_Vladimir_Oblast.svg" },
  { name: "Volgograd Oblast", capital: "Volgograd", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Volgograd_Oblast.svg/960px-Flag_of_Volgograd_Oblast.svg.png" },
  { name: "Vologda Oblast", capital: "Vologda", flag: "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_Vologda_oblast.svg" },
  { name: "Voronezh Oblast", capital: "Voronezh", flag: "https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Voronezh_Oblast.svg" },
  { name: "Yaroslavl Oblast", capital: "Yaroslavl", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Yaroslavl_Oblast.svg/960px-Flag_of_Yaroslavl_Oblast.svg.png" }
];
const russiaFederalCities = [
  { name: "Moscow", capital: "Moscow", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Moscow%2C_Russia.svg/960px-Flag_of_Moscow%2C_Russia.svg.png" },
  { name: "Saint Petersburg", capital: "Saint Petersburg", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Saint_Petersburg.svg/960px-Flag_of_Saint_Petersburg.svg.png" }
];
const russiaAutonomousOblast = [
  { name: "Jewish Autonomous Oblast", capital: "Birobidzhan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Flag_of_the_Jewish_Autonomous_Oblast.svg/960px-Flag_of_the_Jewish_Autonomous_Oblast.svg.png" }
];
const russiaAutonomousOkrugs = [
  { name: "Chukotka Autonomous Okrug", capital: "Anadyr", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Chukotka.svg" },
  { name: "Khanty-Mansi Autonomous Okrug", capital: "Khanty-Mansiysk", flag: "https://upload.wikimedia.org/wikipedia/commons/7/70/Flag_of_Yugra.svg" },
  { name: "Nenets Autonomous Okrug", capital: "Naryan-Mar", flag: "https://upload.wikimedia.org/wikipedia/commons/1/15/Flag_of_Nenets_Autonomous_District.svg" },
  { name: "Yamalo-Nenets Autonomous Okrug", capital: "Salekhard", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Yamal-Nenets_Autonomous_District.svg" }
];

// --- MEXICO ---
const mexicoStates = [
  { name: "Aguascalientes", capital: "Aguascalientes", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Aguascalientes.svg/960px-Flag_of_Aguascalientes.svg.png" },
  { name: "Baja California", capital: "Mexicali", flag: "https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Baja_California.svg" },
  { name: "Baja California Sur", capital: "La Paz", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Baja_California_Sur.svg/960px-Flag_of_Baja_California_Sur.svg.png" },
  { name: "Campeche", capital: "San Francisco de Campeche", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Flag_of_Campeche.svg/960px-Flag_of_Campeche.svg.png" },
  { name: "Chiapas", capital: "Tuxtla Gutiérrez", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Chiapas.svg" },
  { name: "Chihuahua", capital: "Chihuahua", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Bandera_del_Estado_de_Chihuahua.png" },
  { name: "Coahuila", capital: "Saltillo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Flag_of_Coahuila.svg/960px-Flag_of_Coahuila.svg.png" },
  { name: "Colima", capital: "Colima", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Flag_of_Colima.svg/960px-Flag_of_Colima.svg.png" },
  { name: "Durango", capital: "Victoria de Durango", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Flag_of_Durango.svg/960px-Flag_of_Durango.svg.png" },
  { name: "Guanajuato", capital: "Guanajuato", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Flag_of_Guanajuato.svg" },
  { name: "Guerrero", capital: "Chilpancingo de los Bravo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Guerrero.svg/960px-Flag_of_Guerrero.svg.png" },
  { name: "Hidalgo", capital: "Pachuca de Soto", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Hidalgo.svg/960px-Flag_of_Hidalgo.svg.png" },
  { name: "Jalisco", capital: "Guadalajara", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Jalisco.svg" },
  { name: "Mexico (State)", capital: "Toluca de Lerdo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_the_State_of_Mexico.svg/960px-Flag_of_the_State_of_Mexico.svg.png" },
  { name: "Michoacán", capital: "Morelia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Flag_of_Michoacan.svg/960px-Flag_of_Michoacan.svg.png" },
  { name: "Morelos", capital: "Cuernavaca", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Morelos.svg/960px-Flag_of_Morelos.svg.png" },
  { name: "Nayarit", capital: "Tepic", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Nayarit.svg/960px-Flag_of_Nayarit.svg.png" },
  { name: "Nuevo León", capital: "Monterrey", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Flag_of_Nuevo_Leon.svg/960px-Flag_of_Nuevo_Leon.svg.png" },
  { name: "Oaxaca", capital: "Oaxaca de Juárez", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Flag_of_Oaxaca.svg/960px-Flag_of_Oaxaca.svg.png" },
  { name: "Puebla", capital: "Puebla de Zaragoza", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Flag_of_Puebla.svg/960px-Flag_of_Puebla.svg.png" },
  { name: "Querétaro", capital: "Santiago de Querétaro", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Flag_of_Queretaro.svg/960px-Flag_of_Queretaro.svg.png" },
  { name: "Quintana Roo", capital: "Chetumal", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Quintana_Roo.svg" },
  { name: "San Luis Potosí", capital: "San Luis Potosí", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_San_Luis_Potosi.svg/960px-Flag_of_San_Luis_Potosi.svg.png" },
  { name: "Sinaloa", capital: "Culiacán Rosales", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Flag_of_Sinaloa.svg/960px-Flag_of_Sinaloa.svg.png" },
  { name: "Sonora", capital: "Hermosillo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_Sonora.svg/960px-Flag_of_Sonora.svg.png" },
  { name: "Tabasco", capital: "Villahermosa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Flag_of_Tabasco.svg/960px-Flag_of_Tabasco.svg.png" },
  { name: "Tamaulipas", capital: "Ciudad Victoria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Tamaulipas.svg/960px-Flag_of_Tamaulipas.svg.png" },
  { name: "Tlaxcala", capital: "Tlaxcala de Xicohténcatl", flag: "https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_Tlaxcala.svg" },
  { name: "Veracruz", capital: "Xalapa-Enríquez", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Veracruz.svg/960px-Flag_of_Veracruz.svg.png" },
  { name: "Yucatán", capital: "Mérida", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_the_Republic_of_Yucatan.svg/960px-Flag_of_the_Republic_of_Yucatan.svg.png" },
  { name: "Zacatecas", capital: "Zacatecas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Zacatecas.svg/960px-Flag_of_Zacatecas.svg.png" }
];
const mexicoFederalEntity = [
  { name: "Mexico City (Ciudad de México)", capital: "Mexico City", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_Mexico_City_%28variant%29.svg/960px-Flag_of_Mexico_City_%28variant%29.svg.png" }
];

// --- SOUTH KOREA ---
const southKoreaProvinces = [
  { name: "Gangwon State", capital: "Chuncheon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Flag_of_Gangwon_State.svg/960px-Flag_of_Gangwon_State.svg.png" },
  { name: "Gyeonggi Province", capital: "Suwon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Flag_of_Gyeonggi_Province.svg/960px-Flag_of_Gyeonggi_Province.svg.png" },
  { name: "Jeju Province", capital: "Jeju City", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Jeju_Province.svg/960px-Flag_of_Jeju_Province.svg.png" },
  { name: "Jeonbuk State (North Jeolla)", capital: "Jeonju", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_Jeonbuk_State%2C_South_Korea.svg/960px-Flag_of_Jeonbuk_State%2C_South_Korea.svg.png" },
  { name: "North Chungcheong", capital: "Cheongju", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Flag_of_North_Chungcheong_Province.svg/960px-Flag_of_North_Chungcheong_Province.svg.png" },
  { name: "North Gyeongsang", capital: "Andong", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_North_Gyeongsang_Province.svg" },
  { name: "South Chungcheong", capital: "Hongseong County", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Flag_of_South_Chungcheong_Province.svg/960px-Flag_of_South_Chungcheong_Province.svg.png" },
  { name: "South Gyeongsang", capital: "Changwon", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_South_Gyeongsang_Province.svg" },
  { name: "South Jeolla", capital: "Muan County", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Flag_of_South_Jeolla_Province.svg/960px-Flag_of_South_Jeolla_Province.svg.png" }
];
const southKoreaMetropolitanCities = [
  { name: "Busan", capital: "Busan", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_Busan.svg" },
  { name: "Daegu", capital: "Daegu", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Daegu.svg/960px-Flag_of_Daegu.svg.png" },
  { name: "Daejeon", capital: "Daejeon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flag_of_Daejeon.svg/960px-Flag_of_Daejeon.svg.png" },
  { name: "Gwangju", capital: "Gwangju", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Gwangju.svg/960px-Flag_of_Gwangju.svg.png" },
  { name: "Incheon", capital: "Incheon", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Flag_of_Incheon.svg/960px-Flag_of_Incheon.svg.png" },
  { name: "Ulsan", capital: "Ulsan", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Ulsan.svg" }
];
const southKoreaSpecialCities = [
  { name: "Seoul (Special City)", capital: "Seoul", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Seoul.svg/960px-Flag_of_Seoul.svg.png" },
  { name: "Sejong (Special Self-Governing City)", capital: "Sejong", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Flag_of_Sejong_City.svg/960px-Flag_of_Sejong_City.svg.png" }
];

// --- TERRITORIES ---
// --- USA ---
const usTerritories = [
  { name: "American Samoa", capital: "Pago Pago (de jure)/Fagatogo (de facto)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Flag_of_American_Samoa.svg/960px-Flag_of_American_Samoa.svg.png" },
  { name: "Guam", capital: "Hagåtña", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Flag_of_Guam.svg/960px-Flag_of_Guam.svg.png" },
  { name: "Northern Mariana Islands", capital: "Saipan (Capitol Hill)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_the_Northern_Mariana_Islands.svg/960px-Flag_of_the_Northern_Mariana_Islands.svg.png" },
  { name: "Puerto Rico", capital: "San Juan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Puerto_Rico.svg/960px-Flag_of_Puerto_Rico.svg.png" },
  { name: "United States Virgin Islands", capital: "Charlotte Amalie", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Flag_of_the_United_States_Virgin_Islands.svg/960px-Flag_of_the_United_States_Virgin_Islands.svg.png" }
];
const usMinorOutlyingIslands = [
  { name: "Baker Island", flag: "https://static.wikia.nocookie.net/vexillology/images/7/75/Flag_of_Baker_Island.svg/960px-Flag_of_Baker_Island.svg.png" },
  { name: "Howland Island", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f8/Flag_of_Howland_Island.jpg/960px-Flag_of_Howland_Island.jpg.png" },
  { name: "Jarvis Island", flag: "https://static.wikia.nocookie.net/vexillology/images/7/74/Flag_of_jarvis_island.svg/960px-Flag_of_jarvis_island.svg.png" },
  { name: "Johnston Atoll", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e5/Flag_of_Johnston_Atoll_%28local%29.svg/960px-Flag_of_Johnston_Atoll_%28local%29.svg.png" },
  { name: "Kingman Reef", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6d/Unofficial_flag_of_Kingman_Reef.svg/960px-Unofficial_flag_of_Kingman_Reef.svg.png" },
  { name: "Midway Atoll", flag: "https://static.wikia.nocookie.net/vexillology/images/2/2a/Flag_of_the_Midway_Islands_%28local%29.svg/960px-Flag_of_the_Midway_Islands_%28local%29.svg.png" },
  { name: "Navassa Island", flag: "https://static.wikia.nocookie.net/vexillology/images/1/1b/Flag_of_Navassa_Island_%28local%29.svg/960px-Flag_of_Navassa_Island_%28local%29.svg.png" },
  { name: "Palmyra Atoll", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a3/Flag_of_Palmyra_Atoll_%28local%29.svg/960px-Flag_of_Palmyra_Atoll_%28local%29.svg.png" },
  { name: "Wake Island", flag: "https://static.wikia.nocookie.net/vexillology/images/4/47/Flag_of_Wake_Island.svg/960px-Flag_of_Wake_Island.svg.png" }
];

// --- CHINA ---
const chinaSARs = [
  { name: "Hong Kong", capital: "Hong Kong", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Flag_of_Hong_Kong.svg" },
  { name: "Macau", capital: "Macau", flag: "https://upload.wikimedia.org/wikipedia/commons/6/63/Flag_of_Macau.svg" }
];

// --- INDIA ---
const indiaUnionTerritories = [
  { name: "Andaman and Nicobar Islands", capital: "Port Blair", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8c/Andaman_and_Nicobar.png/960px-Andaman_and_Nicobar.png.png" },
  { name: "Chandigarh", capital: "Chandigarh", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c7/Chandigarh.jpeg/960px-Chandigarh.jpeg.png" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", capital: "Daman", flag: "https://static.wikia.nocookie.net/vexillology/images/7/73/Dadra_Nagar_Haveli_Daman_Diu.png/960px-Dadra_Nagar_Haveli_Daman_Diu.png.png" },
  { name: "Delhi (National Capital Territory)", capital: "New Delhi", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d5/Delhi.png/960px-Delhi.png.png" },
  { name: "Jammu and Kashmir", capital: "Srinagar (Summer) / Jammu (Winter)", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9d/IN_t_JAMMU_KASHMIR_proj.png/960px-IN_t_JAMMU_KASHMIR_proj.png.png" },
  { name: "Ladakh", capital: "Leh / Kargil (Joint Administrative Capitals)", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f6/Flag_of_Ladakh.png/960px-Flag_of_Ladakh.png.png" },
  { name: "Lakshadweep", capital: "Kavaratti", flag: "https://static.wikia.nocookie.net/vexillology/images/c/cc/Lakshadweep.png/960px-Lakshadweep.png.png" },
  { name: "Puducherry", capital: "Puducherry", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e1/Puducherry.png/960px-Puducherry.png.png" }
];

// --- UK ---
const ukCrownDependencies = [
  { name: "Guernsey", capital: "St Peter Port", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Guernsey.svg" },
  { name: "Isle of Man", capital: "Douglas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_the_Isle_of_Man.svg/960px-Flag_of_the_Isle_of_Man.svg.png" },
  { name: "Jersey", capital: "St Helier", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Flag_of_Jersey.svg" }
];
const ukOverseasTerritories = [
  { name: "Akrotiri and Dhekelia", capital: "Episkopi Cantonment", flag: "flags/Akrotiri-And-Dhekelia.jpg" },
  { name: "Anguilla", capital: "The Valley", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Anguilla.svg" },
  { name: "Ascension Island", capital: "Georgetown", flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Ascension_Island.svg" },
  { name: "Bermuda", capital: "Hamilton", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bermuda.svg" },
  { name: "British Antarctic Territory", capital: "London (Administered)", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_the_British_Antarctic_Territory.svg" },
  { name: "British Indian Ocean Territory", capital: "London (Administered)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_the_Commissioner_of_the_British_Indian_Ocean_Territory.svg/960px-Flag_of_the_Commissioner_of_the_British_Indian_Ocean_Territory.svg.png" },
  { name: "British Virgin Islands", capital: "Road Town", flag: "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_the_British_Virgin_Islands.svg" },
  { name: "Cayman Islands", capital: "George Town", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_the_Cayman_Islands.svg" },
  { name: "Falkland Islands", capital: "Stanley", flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_Falkland_Islands.svg" },
  { name: "Gibraltar", capital: "Gibraltar", flag: "https://upload.wikimedia.org/wikipedia/commons/0/02/Flag_of_Gibraltar.svg" },
  { name: "Montserrat", capital: "Little Bay (De jure) / Brades (De facto)", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Montserrat.svg" },
  { name: "Pitcairn Islands", capital: "Adamstown", flag: "https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_the_Pitcairn_Islands.svg" },
  { name: "Saint Helena", capital: "Jamestown", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Saint_Helena.svg" },
  { name: "South Georgia and the South Sandwich Islands", capital: "King Edward Point", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_South_Georgia_and_the_South_Sandwich_Islands.svg/960px-Flag_of_South_Georgia_and_the_South_Sandwich_Islands.svg.png" },
  { name: "Tristan da Cunha", capital: "Edinburgh of the Seven Seas", flag: "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Tristan_da_Cunha.svg" },
  { name: "Turks and Caicos Islands", capital: "Cockburn Town", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_the_Turks_and_Caicos_Islands.svg" }
];
// --- FRANCE ---
const franceOverseasRegions = [
  { name: "French Guiana", capital: "Cayenne", flag: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_French_Guiana.svg" },
  { name: "Guadeloupe", capital: "Basse-Terre", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Flag_of_Guadeloupe_%28local%29_variant.svg/960px-Flag_of_Guadeloupe_%28local%29_variant.svg.png" },
  { name: "Martinique", capital: "Fort-de-France", flag: "https://upload.wikimedia.org/wikipedia/commons/2/27/Flag-of-Martinique.svg" },
  { name: "Mayotte", capital: "Mamoudzou", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Mayotte_%28local%29.svg/960px-Flag_of_Mayotte_%28local%29.svg.png" },
  { name: "Réunion", capital: "Saint-Denis", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Proposed_flag_of_R%C3%A9union_%28VAR%29.svg" },
];
const franceOverseasCollectivities = [
  { name: "French Polynesia", capital: "Papeete", flag: "https://upload.wikimedia.org/wikipedia/commons/d/db/Flag_of_French_Polynesia.svg" },
  { name: "New Caledonia", capital: "Nouméa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_FLNKS.svg/960px-Flag_of_FLNKS.svg.png" },
  { name: "Saint Barthélemy", capital: "Gustavia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Saint_Barth%C3%A9lemy_%28local%29.svg/960px-Flag_of_Saint_Barth%C3%A9lemy_%28local%29.svg.png" },
  { name: "Saint Martin", capital: "Marigot", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Local_flag_of_the_Collectivity_of_Saint_Martin.svg/960px-Local_flag_of_the_Collectivity_of_Saint_Martin.svg.png" },
  { name: "Saint Pierre and Miquelon", capital: "Saint-Pierre", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_Saint-Pierre_and_Miquelon.svg/960px-Flag_of_Saint-Pierre_and_Miquelon.svg.png" },
  { name: "Wallis and Futuna", capital: "Mata-Utu", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Flag_of_Wallis_and_Futuna.svg" }
];
const franceOverseasTerritory = [
  { name: "French Southern and Antarctic Lands", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Flag_of_the_Senior_Administrator_of_the_French_Southern_and_Antarctic_Lands.svg/960px-Flag_of_the_Senior_Administrator_of_the_French_Southern_and_Antarctic_Lands.svg.png" }
];
const franceSpecialStatus = [
{ name: "Clipperton Island", flag: "https://static.wikia.nocookie.net/vexillology/images/3/35/Flag_of_Clipperton_Island.png/960px-Flag_of_Clipperton_Island.png.png" }
];

// --- CANADA ---
const canadaTerritories = [
  { name: "Northwest Territories", capital: "Yellowknife", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_the_Northwest_Territories.svg" },
  { name: "Nunavut", capital: "Iqaluit", flag: "https://upload.wikimedia.org/wikipedia/commons/9/90/Flag_of_Nunavut.svg" },
  { name: "Yukon", capital: "Whitehorse", flag: "https://upload.wikimedia.org/wikipedia/commons/6/69/Flag_of_Yukon.svg" }
];

// --- BRAZIL ---
const brazilSpecialStatus = [
  { name: "Fernando de Noronha", capital: "Vila dos Remédios", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Bandeira_de_Fernando_de_Noronha.png" }
];

// --- RUSSIA ---
const russiaClaimedTerritories = [
  { name: "Crimea", capital: "Simferopol", flag: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Crimea.svg" },
  { name: "Donetsk People's Republic", capital: "Donetsk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Donetsk_People%27s_Republic.svg/960px-Flag_of_Donetsk_People%27s_Republic.svg.png" },
  { name: "Luhansk People's Republic", capital: "Luhansk", flag: "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_the_Luhansk_People%27s_Republic.svg" },
  { name: "Kherson Oblast", capital: "Henichesk (de facto)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Flag_of_Kherson_Oblast_%28Russia%29.svg/960px-Flag_of_Kherson_Oblast_%28Russia%29.svg.png" },
  { name: "Zaporozhye Oblast", capital: "Melitopol (de facto)", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_the_Russian_administered_Zaporizhzhia_Oblast.svg/960px-Flag_of_the_Russian_administered_Zaporizhzhia_Oblast.svg.png" }
];

// --- HISTORICAL FLAGS ---
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

// --- UK ---
const ukHistorical = [
  { name: "Cross of St. Andrew", years: "~1180s–1707", flag: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Flag_of_Scotland_%281542%E2%80%932003%2C_navy_blue%29.svg" },
  { name: "Cross of St. George", years: "~1190s–present", flag: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg" },
  { name: "Cross of St. Patrick", years: "1783–1922", flag: "https://upload.wikimedia.org/wikipedia/commons/8/81/Saint_Patrick%27s_Saltire.svg" },
  { name: "Union Flag", years: "1707–1801", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/1024px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png" }
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

// --- CANADA ---
const canadaHistorical = [
  { name: "Canadian Red Ensign", years: "1868–1921", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Canada_%281868%E2%80%931921%29.svg" },
  { name: "Canadian Red Ensign", years: "1921–1957", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Canada_%281921%E2%80%931957%29.svg" },
  { name: "Canadian Red Ensign", years: "1957–1965", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_Canada_%281957%E2%80%931965%29.svg" }
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

// --- CONTINENTS ---
// --- ASIA ---

const centralAsiaCountries = [
  { name: "Kazakhstan", capital: "Astana", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg" },
  { name: "Kyrgyzstan", capital: "Bishkek", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg" },
  { name: "Tajikistan", capital: "Dushanbe", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Tajikistan.svg" },
  { name: "Turkmenistan", capital: "Ashgabat", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg" },
  { name: "Uzbekistan", capital: "Tashkent", flag: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg" }
];

const eastAsiaCountries = [
  { name: "China", capital: "Beijing", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg" },
  { name: "Japan", capital: "Tokyo", flag: "https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg" },
  { name: "Mongolia", capital: "Ulaanbaatar", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Mongolia.svg" },
  { name: "North Korea", capital: "Pyongyang", flag: "https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg" },
  { name: "South Korea", capital: "Seoul", flag: "https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg" },
  { name: "Taiwan", capital: "Taipei", flag: "https://upload.wikimedia.org/wikipedia/commons/7/72/Flag_of_the_Republic_of_China.svg" }
];

const southAsiaCountries = [
  { name: "Afghanistan", capital: "Kabul", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg" },
  { name: "Bangladesh", capital: "Dhaka", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg" },
  { name: "Bhutan", capital: "Thimphu", flag: "https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Bhutan.svg" },
  { name: "India", capital: "New Delhi", flag: "https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" },
  { name: "Maldives", capital: "Malé", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Maldives.svg" },
  { name: "Nepal", capital: "Kathmandu", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg" },
  { name: "Pakistan", capital: "Islamabad", flag: "https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" },
  { name: "Sri Lanka", capital: "Sri Jayawardenepura Kotte", flag: "https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Sri_Lanka.svg" }
];

const southeastAsiaCountries = [
  { name: "Brunei", capital: "Bandar Seri Begawan", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Brunei.svg" },
  { name: "Cambodia", capital: "Phnom Penh", flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg" },
  { name: "Indonesia", capital: "Jakarta", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg" },
  { name: "Laos", capital: "Vientiane", flag: "https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Laos.svg" },
  { name: "Malaysia", capital: "Kuala Lumpur", flag: "https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg" },
  { name: "Myanmar", capital: "Naypyidaw", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Myanmar.svg" },
  { name: "Philippines", capital: "Manila", flag: "https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_the_Philippines.svg" },
  { name: "Singapore", capital: "Singapore", flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg" },
  { name: "Thailand", capital: "Bangkok", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg" },
  { name: "Timor Leste (East Timor)", capital: "Dili", flag: "https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_East_Timor.svg" },
  { name: "Vietnam", capital: "Hanoi", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" }
];

const westAsiaCountries = [
  { name: "Armenia", capital: "Yerevan", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Armenia.svg" },
  { name: "Azerbaijan", capital: "Baku", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg" },
  { name: "Bahrain", capital: "Manama", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Bahrain.svg" },
  { name: "Cyprus", capital: "Nicosia", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Cyprus.svg" },
  { name: "Georgia", capital: "Tbilisi", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Georgia.svg" },
  { name: "Iran", capital: "Tehran", flag: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Iran.svg" },
  { name: "Iraq", capital: "Baghdad", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg" },
  { name: "Israel", capital: "Jerusalem", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg" },
  { name: "Jordan", capital: "Amman", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Jordan.svg" },
  { name: "Kuwait", capital: "Kuwait City", flag: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Kuwait.svg" },
  { name: "Lebanon", capital: "Beirut", flag: "https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg" },
  { name: "Oman", capital: "Muscat", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Oman.svg" },
  { name: "Palestine", capital: "Ramallah", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Palestine.svg" },
  { name: "Qatar", capital: "Doha", flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg" },
  { name: "Saudi Arabia", capital: "Riyadh", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg" },
  { name: "Syria", capital: "Damascus", flag: "https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Syria_%282025-%29.svg" },
  { name: "Türkiye", capital: "Ankara", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" },
  { name: "United Arab Emirates", capital: "Abu Dhabi", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg" },
  { name: "Yemen", capital: "Sanaʽa", flag: "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Yemen.svg" }
];
// --- EUROPE ---

const northernEuropeCountries = [
  { name: "Denmark", capital: "Copenhagen", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Denmark.svg" },
  { name: "Estonia", capital: "Tallinn", flag: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Estonia.svg" },
  { name: "Finland", capital: "Helsinki", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Finland.svg" },
  { name: "Iceland", capital: "Reykjavík", flag: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Iceland.svg" },
  { name: "Ireland", capital: "Dublin", flag: "https://upload.wikimedia.org/wikipedia/commons/4/45/Flag_of_Ireland.svg" },
  { name: "Latvia", capital: "Riga", flag: "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Latvia.svg" },
  { name: "Lithuania", capital: "Vilnius", flag: "https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Lithuania.svg" },
  { name: "Norway", capital: "Oslo", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg" },
  { name: "Sweden", capital: "Stockholm", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Sweden.svg" },
  { name: "United Kingdom", capital: "London", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/960px-Flag_of_the_United_Kingdom.svg.png" }
];

const westernEuropeCountries = [
  { name: "Austria", capital: "Vienna", flag: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg" },
  { name: "Belgium", capital: "Brussels", flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg" },
  { name: "France", capital: "Paris", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg" },
  { name: "Germany", capital: "Berlin", flag: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg" },
  { name: "Liechtenstein", capital: "Vaduz", flag: "https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Liechtenstein.svg" },
  { name: "Luxembourg", capital: "Luxembourg City", flag: "https://upload.wikimedia.org/wikipedia/commons/d/da/Flag_of_Luxembourg.svg" },
  { name: "Monaco", capital: "Monaco", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Flag_of_Monaco.svg" },
  { name: "Netherlands", capital: "Amsterdam", flag: "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg" },
  { name: "Switzerland", capital: "Bern", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg" }
];

const southernEuropeCountries = [
  { name: "Albania", capital: "Tirana", flag: "https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Albania.svg" },
  { name: "Andorra", capital: "Andorra la Vella", flag: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Andorra.svg" },
  { name: "Bosnia and Herzegovina", capital: "Sarajevo", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg" },
  { name: "Croatia", capital: "Zagreb", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg" },
  { name: "Greece", capital: "Athens", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Greece.svg" },
  { name: "Italy", capital: "Rome", flag: "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg" },
  { name: "Malta", capital: "Valletta", flag: "https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Malta.svg" },
  { name: "Montenegro", capital: "Podgorica", flag: "https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Montenegro.svg" },
  { name: "North Macedonia", capital: "Skopje", flag: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_North_Macedonia.svg" },
  { name: "Portugal", capital: "Lisbon", flag: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg" },
  { name: "San Marino", capital: "San Marino", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Flag_of_San_Marino.svg" },
  { name: "Serbia", capital: "Belgrade", flag: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg" },
  { name: "Slovenia", capital: "Ljubljana", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Slovenia.svg" },
  { name: "Spain", capital: "Madrid", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" },
  { name: "Vatican City", capital: "Vatican City", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Flag_of_Vatican_City_%282023%E2%80%93present%29.svg" }
];

const easternEuropeCountries = [
  { name: "Belarus", capital: "Minsk", flag: "https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Belarus.svg" },
  { name: "Bulgaria", capital: "Sofia", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Bulgaria.svg" },
  { name: "Czech Republic", capital: "Prague", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Czech_Republic.svg" },
  { name: "Hungary", capital: "Budapest", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Flag_of_Hungary.svg" },
  { name: "Moldova", capital: "Chișinău", flag: "https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Moldova.svg" },
  { name: "Poland", capital: "Warsaw", flag: "https://upload.wikimedia.org/wikipedia/commons/1/12/Flag_of_Poland.svg" },
  { name: "Romania", capital: "Bucharest", flag: "https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg" },
  { name: "Russia", capital: "Moscow", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg" },
  { name: "Slovakia", capital: "Bratislava", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Slovakia.svg" },
  { name: "Ukraine", capital: "Kyiv", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Ukraine.svg" }
];
// --- AFRICA ---
const northernAfricaCountries = [
  { name: "Algeria", capital: "Algiers", flag: "https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg" },
  { name: "Egypt", capital: "Cairo", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg" },
  { name: "Libya", capital: "Tripoli", flag: "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Libya.svg" },
  { name: "Mauritania", capital: "Nouakchott", flag: "https://upload.wikimedia.org/wikipedia/commons/4/43/Flag_of_Mauritania.svg" },
  { name: "Morocco", capital: "Rabat", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg" },
  { name: "Sudan", capital: "Khartoum", flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Sudan.svg" },
  { name: "Tunisia", capital: "Tunis", flag: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Tunisia.svg" }
];

const westernAfricaCountries = [
  { name: "Benin", capital: "Porto-Novo", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Benin.svg" },
  { name: "Burkina Faso", capital: "Ouagadougou", flag: "https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Burkina_Faso.svg" },
  { name: "Cape Verde", capital: "Praia", flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Cape_Verde.svg" },
  { name: "Côte D'Ivoire (Ivory Coast)", capital: "Yamoussoukro", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg" },
  { name: "Gambia", capital: "Banjul", flag: "https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_The_Gambia.svg" },
  { name: "Ghana", capital: "Accra", flag: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Ghana.svg" },
  { name: "Guinea", capital: "Conakry", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Flag_of_Guinea.svg" },
  { name: "Guinea-Bissau", capital: "Bissau", flag: "https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Guinea-Bissau.svg" },
  { name: "Liberia", capital: "Monrovia", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_Liberia.svg" },
  { name: "Mali", capital: "Bamako", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_Mali.svg" },
  { name: "Niger", capital: "Niamey", flag: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Flag_of_Niger.svg" },
  { name: "Nigeria", capital: "Abuja", flag: "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg" },
  { name: "Senegal", capital: "Dakar", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg" },
  { name: "Sierra Leone", capital: "Freetown", flag: "https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Sierra_Leone.svg" },
  { name: "Togo", capital: "Lomé", flag: "https://upload.wikimedia.org/wikipedia/commons/6/68/Flag_of_Togo.svg" }
];

const centralAfricaCountries = [
  { name: "Cameroon", capital: "Yaoundé", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Flag_of_Cameroon.svg" },
  { name: "Central African Republic", capital: "Bangui", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Central_African_Republic.svg" },
  { name: "Chad", capital: "N'Djamena", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Chad.svg" },
  { name: "Congo Republic", capital: "Brazzaville", flag: "https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_the_Republic_of_the_Congo.svg" },
  { name: "Democratic Republic of the Congo", capital: "Kinshasa", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg" },
  { name: "Equatorial Guinea", capital: "Malabo", flag: "https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Equatorial_Guinea.svg" },
  { name: "Gabon", capital: "Libreville", flag: "https://upload.wikimedia.org/wikipedia/commons/0/04/Flag_of_Gabon.svg" },
  { name: "São Tomé and Príncipe", capital: "São Tomé", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe.svg" }
];

const easternAfricaCountries = [
  { name: "Burundi", capital: "Gitega", flag: "https://upload.wikimedia.org/wikipedia/commons/5/50/Flag_of_Burundi.svg" },
  { name: "Comoros", capital: "Moroni", flag: "https://upload.wikimedia.org/wikipedia/commons/9/94/Flag_of_the_Comoros.svg" },
  { name: "Djibouti", capital: "Djibouti City", flag: "https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_Djibouti.svg" },
  { name: "Eritrea", capital: "Asmara", flag: "https://upload.wikimedia.org/wikipedia/commons/2/29/Flag_of_Eritrea.svg" },
  { name: "Ethiopia", capital: "Addis Ababa", flag: "https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg" },
  { name: "Kenya", capital: "Nairobi", flag: "https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg" },
  { name: "Madagascar", capital: "Antananarivo", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Madagascar.svg" },
  { name: "Mauritius", capital: "Port Louis", flag: "https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Mauritius.svg" },
  { name: "Mozambique", capital: "Maputo", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Mozambique.svg" },
  { name: "Rwanda", capital: "Kigali", flag: "https://upload.wikimedia.org/wikipedia/commons/1/17/Flag_of_Rwanda.svg" },
  { name: "Seychelles", capital: "Victoria", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Seychelles.svg" },
  { name: "Somalia", capital: "Mogadishu", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Somalia.svg" },
  { name: "South Sudan", capital: "Juba", flag: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flag_of_South_Sudan.svg" },
  { name: "Tanzania", capital: "Dodoma", flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg" },
  { name: "Uganda", capital: "Kampala", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Uganda.svg" }
];

const southernAfricaCountries = [
  { name: "Angola", capital: "Luanda", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Angola.svg" },
  { name: "Botswana", capital: "Gaborone", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_Botswana.svg" },
  { name: "Eswatini", capital: "Mbabane", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Flag_of_Eswatini.svg" },
  { name: "Lesotho", capital: "Maseru", flag: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Flag_of_Lesotho.svg" },
  { name: "Malawi", capital: "Lilongwe", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Flag_of_Malawi.svg" },
  { name: "Mozambique", capital: "Maputo", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Mozambique.svg" },
  { name: "Namibia", capital: "Windhoek", flag: "https://upload.wikimedia.org/wikipedia/commons/0/00/Flag_of_Namibia.svg" },
  { name: "South Africa", capital: "Pretoria (administrative)", flag: "https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg" },
  { name: "Zambia", capital: "Lusaka", flag: "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Zambia.svg" },
  { name: "Zimbabwe", capital: "Harare", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Flag_of_Zimbabwe.svg" }
];
// --- OCEANIA ---
const oceaniaCountries = [
  { name: "Australia", capital: "Canberra", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Australia.svg" },
  { name: "Fiji", capital: "Suva", flag: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Fiji.svg" },
  { name: "Kiribati", capital: "Tarawa", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kiribati.svg" },
  { name: "Marshall Islands", capital: "Majuro", flag: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_the_Marshall_Islands.svg" },
  { name: "Micronesia", capital: "Palikir", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg" },
  { name: "Nauru", capital: "Yaren", flag: "https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Nauru.svg" },
  { name: "New Zealand", capital: "Wellington", flag: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg" },
  { name: "Palau", capital: "Ngerulmud", flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Palau.svg" },
  { name: "Papua New Guinea", capital: "Port Moresby", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Flag_of_Papua_New_Guinea.svg" },
  { name: "Samoa", capital: "Apia", flag: "https://upload.wikimedia.org/wikipedia/commons/3/31/Flag_of_Samoa.svg" },
  { name: "Solomon Islands", capital: "Honiara", flag: "https://upload.wikimedia.org/wikipedia/commons/7/74/Flag_of_the_Solomon_Islands.svg" },
  { name: "Tonga", capital: "Nukuʻalofa", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Tonga.svg" },
  { name: "Tuvalu", capital: "Funafuti", flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tuvalu.svg" },
  { name: "Vanuatu", capital: "Port Vila", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Vanuatu.svg" }
];
// --- AMERICAS ---
const northAmericaCountries = [
  { name: "Antigua and Barbuda", capital: "St. John's", flag: "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Antigua_and_Barbuda.svg" },
  { name: "Bahamas", capital: "Nassau", flag: "https://upload.wikimedia.org/wikipedia/commons/9/93/Flag_of_the_Bahamas.svg" },
  { name: "Barbados", capital: "Bridgetown", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Flag_of_Barbados.svg" },
  { name: "Belize", capital: "Belmopan", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Flag_of_Belize.svg" },
  { name: "Canada", capital: "Ottawa", flag: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg" },
  { name: "Costa Rica", capital: "San José", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Costa_Rica_%28state%29.svg" },
  { name: "Cuba", capital: "Havana", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Flag_of_Cuba.svg" },
  { name: "Dominica", capital: "Roseau", flag: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Flag_of_Dominica.svg" },
  { name: "Dominican Republic", capital: "Santo Domingo", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_the_Dominican_Republic.svg" },
  { name: "El Salvador", capital: "San Salvador", flag: "https://upload.wikimedia.org/wikipedia/commons/3/34/Flag_of_El_Salvador.svg" },
  { name: "Grenada", capital: "St. George's", flag: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_Grenada.svg" },
  { name: "Guatemala", capital: "Guatemala City", flag: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Flag_of_Guatemala.svg" },
  { name: "Haiti", capital: "Port-au-Prince", flag: "https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Haiti.svg" },
  { name: "Honduras", capital: "Tegucigalpa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Honduras_%282022%E2%80%93present%29.svg/960px-Flag_of_Honduras_%282022%E2%80%93present%29.svg.png" },
  { name: "Jamaica", capital: "Kingston", flag: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Flag_of_Jamaica.svg" },
  { name: "Mexico", capital: "Mexico City", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg" },
  { name: "Nicaragua", capital: "Managua", flag: "https://upload.wikimedia.org/wikipedia/commons/1/19/Flag_of_Nicaragua.svg" },
  { name: "Panama", capital: "Panama City", flag: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Panama.svg" },
  { name: "Saint Kitts and Nevis", capital: "Basseterre", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg" },
  { name: "Saint Lucia", capital: "Castries", flag: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Saint_Lucia.svg" },
  { name: "Saint Vincent and the Grenadines", capital: "Kingstown", flag: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg" },
  { name: "Trinidad and Tobago", capital: "Port of Spain", flag: "https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Trinidad_and_Tobago.svg" },
  { name: "United States", capital: "Washington, D.C.", flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" }
];

const southAmericaCountries = [
  { name: "Argentina", capital: "Buenos Aires", flag: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" },
  { name: "Bolivia", capital: "Sucre", flag: "https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Bolivia.svg" },
  { name: "Brazil", capital: "Brasília", flag: "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" },
  { name: "Chile", capital: "Santiago", flag: "https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Chile.svg" },
  { name: "Colombia", capital: "Bogotá", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Colombia.svg" },
  { name: "Ecuador", capital: "Quito", flag: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Flag_of_Ecuador.svg" },
  { name: "Guyana", capital: "Georgetown", flag: "https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_Guyana.svg" },
  { name: "Paraguay", capital: "Asunción", flag: "https://upload.wikimedia.org/wikipedia/commons/2/27/Flag_of_Paraguay.svg" },
  { name: "Peru", capital: "Lima", flag: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg" },
  { name: "Suriname", capital: "Paramaribo", flag: "https://upload.wikimedia.org/wikipedia/commons/6/60/Flag_of_Suriname.svg" },
  { name: "Uruguay", capital: "Montevideo", flag: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg" },
  { name: "Venezuela", capital: "Caracas", flag: "https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg" }
];

// =============================================================================
// II. FINAL EXPORTED CATEGORIES
// =============================================================================

// --- Category 1: Official Countries ---
export const officialCountries = officialCountriesRaw;

// --- Category 2: Subdivisions ---
export const subdivisions = [
  // USA
  ...usStates.map(s => ({ ...s, country: "USA", type: "States" })),
  ...usFederal.map(s => ({ ...s, country: "USA", type: "Federal District" })),
  
  // China
  ...chinaProvinces.map(s => ({ ...s, country: "China", type: "Provinces" })),
  ...chinaAutonomous.map(s => ({ ...s, country: "China", type: "Autonomous Regions" })),
  ...chinaMunicipalities.map(s => ({ ...s, country: "China", type: "Municipalities" })),
  
  // Germany
  ...germanyStates.map(s => ({ ...s, country: "Germany", type: "States" })),
  
  // India
  ...indiaStates.map(s => ({ ...s, country: "India", type: "States" })),
  
  // Japan
  ...japanPrefectures.map(s => ({ ...s, country: "Japan", type: "Prefectures" })),
  
  // UK
  ...ukConstituentCountries.map(s => ({ ...s, country: "UK", type: "Constituent Countries" })),
  
  // France
  ...franceRegions.map(s => ({ ...s, country: "France", type: "Regions" })),
  
  // Italy
  ...italyRegions.map(s => ({ ...s, country: "Italy", type: "Regions" })),
  ...italyAutonomousRegions.map(s => ({ ...s, country: "Italy", type: "Autonomous Regions" })),
  
  // Canada
  ...canadaProvinces.map(s => ({ ...s, country: "Canada", type: "Provinces" })),
  
  // Brazil
  ...brazilStates.map(s => ({ ...s, country: "Brazil", type: "States" })),
  ...brazilFederal.map(s => ({ ...s, country: "Brazil", type: "Federal District" })),
  
  // Russia
  ...russiaRepublics.map(s => ({ ...s, country: "Russia", type: "Republics" })),
  ...russiaKrais.map(s => ({ ...s, country: "Russia", type: "Krais" })),
  ...russiaOblasts.map(s => ({ ...s, country: "Russia", type: "Oblasts" })),
  ...russiaFederalCities.map(s => ({ ...s, country: "Russia", type: "Federal Cities" })),
  ...russiaAutonomousOblast.map(s => ({ ...s, country: "Russia", type: "Autonomous Oblast" })),
  ...russiaAutonomousOkrugs.map(s => ({ ...s, country: "Russia", type: "Autonomous Okrugs" })),
  
  // Mexico
  ...mexicoStates.map(s => ({ ...s, country: "Mexico", type: "States" })),
  ...mexicoFederalEntity.map(s => ({ ...s, country: "Mexico", type: "Federal Entity" })),
  
  // South Korea
  ...southKoreaProvinces.map(s => ({ ...s, country: "South Korea", type: "Provinces" })),
  ...southKoreaMetropolitanCities.map(s => ({ ...s, country: "South Korea", type: "Metropolitan Cities" })),
  ...southKoreaSpecialCities.map(s => ({ ...s, country: "South Korea", type: "Special Cities" })),
];

// --- Category 3: Territories ---
export const territories = [
  // USA
  ...usTerritories.map(t => ({ ...t, country: "USA", type: "Territories" })),
  ...usMinorOutlyingIslands.map(t => ({ ...t, country: "USA", type: "Minor Outlying Islands" })),
  
  // China
  ...chinaSARs.map(s => ({ ...s, country: "China", type: "Special Administrative Regions" })),
  
  // India
  ...indiaUnionTerritories.map(s => ({ ...s, country: "India", type: "Union Territories" })),
  
  // UK
  ...ukOverseasTerritories.map(t => ({ ...t, country: "UK", type: "Overseas Territories" })),
  
  // France
  ...franceOverseasRegions.map(s => ({ ...s, country: "France", type: "Overseas Regions" })),
  ...franceOverseasCollectivities.map(s => ({ ...s, country: "France", type: "Overseas Collectivities" })),
  ...franceOverseasTerritory.map(s => ({ ...s, country: "France", type: "Overseas Territory" })),
  ...franceSpecialStatus.map(s => ({ ...s, country: "France", type: "Special Status" })),
  
  // Canada
  ...canadaTerritories.map(t => ({ ...t, country: "Canada", type: "Territories" })),
  
  // Brazil
  ...brazilSpecialStatus.map(s => ({ ...s, country: "Brazil", type: "Special Status" })),
  
  // Russia
  ...russiaClaimedTerritories.map(s => ({ ...s, country: "Russia", type: "Claimed Territories" })),
];

// --- Category 4: Unofficial Regions ---
export const unofficial = [
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

// --- Category 5: World Organizations ---
export const worldOrganizations = [
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

// --- Category 6: Historical Flags ---
export const historicalFlags = [
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
];

// --- Category 7: Continent Flags ---
export const continentFlags = {
  Asia: [...centralAsiaCountries, ...eastAsiaCountries, ...southAsiaCountries, ...southeastAsiaCountries, ...westAsiaCountries].sort((a, b) => a.name.localeCompare(b.name)),
  Europe: [...northernEuropeCountries, ...westernEuropeCountries, ...southernEuropeCountries, ...easternEuropeCountries].sort((a, b) => a.name.localeCompare(b.name)),
  Africa: [...northernAfricaCountries, ...westernAfricaCountries, ...centralAfricaCountries, ...easternAfricaCountries, ...southernAfricaCountries].sort((a, b) => a.name.localeCompare(b.name)),
  "North America": [...northAmericaCountries].sort((a, b) => a.name.localeCompare(b.name)),
  "South America": [...southAmericaCountries].sort((a, b) => a.name.localeCompare(b.name)),
  Oceania: [...oceaniaCountries].sort((a, b) => a.name.localeCompare(b.name))

};
