// --- SUBDIVISIONS ---
// --- AFGHANISTAN ---
const afghanistanProvinces = [
  { name: "Badakhshan", capital: "Fayzabad", flag: "https://static.wikia.nocookie.net/vexillology/images/9/90/Badakhshan.jpeg/960px-Badakhshan.jpeg.png", status: "Proposed" },
  { name: "Badghis", capital: "Qala i Naw", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0c/Flag_of_Badghis_Province.svg/960px-Flag_of_Badghis_Province.svg.png", status: "Proposed" },
  { name: "Baghlan", capital: "Puli Khumri", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/Baghlan.jpeg/960px-Baghlan.jpeg.png", status: "Proposed" },
  { name: "Balkh", capital: "Mazar-i-Sharif", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d6/Flag_of_Balkh.jpg/960px-Flag_of_Balkh.jpg.png", status: "Proposed" },
  { name: "Bamyan", capital: "Bamyan", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3f/Bamyan.jpeg/960px-Bamyan.jpeg.png", status: "Proposed" },
  { name: "Daykundi", capital: "Nili", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8a/Daykundi.jpeg/960px-Daykundi.jpeg.png", status: "Proposed" },
  { name: "Farah", capital: "Farah", flag: "https://static.wikia.nocookie.net/vexillology/images/d/dc/Farah.jpeg/960px-Farah.jpeg.png", status: "Proposed" },
  { name: "Faryab", capital: "Maymana", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ab/Flag_of_Faryab.png/960px-Flag_of_Faryab.png.png", status: "Proposed" },
  { name: "Ghazni", capital: "Ghazni", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4d/Flag_of_Ghazni.png/960px-Flag_of_Ghazni.png.png", status: "Proposed" },
  { name: "Ghor", capital: "Chaghcharan", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ac/Ghor.jpeg/960px-Ghor.jpeg.png", status: "Proposed" },
  { name: "Helmand", capital: "Lashkargah", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f0/Flag_of_Helmand_Province.svg/960px-Flag_of_Helmand_Province.svg.png", status: "Proposed" },
  { name: "Herat", capital: "Herat", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b9/Flag_of_Herat_Province.svg/960px-Flag_of_Herat_Province.svg.png", status: "Proposed" },
  { name: "Jowzjan", capital: "Sheberghan", flag: "https://static.wikia.nocookie.net/vexillology/images/a/af/Jowzjan.jpeg/960px-Jowzjan.jpeg.png", status: "Proposed" },
  { name: "Kabul", capital: "Kabul", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Kabul.svg/960px-Flag_of_Kabul.svg.png", status: "Proposed" },
  { name: "Kandahar", capital: "Kandahar", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e1/Flag_of_Kandahar.png/960px-Kandahar.png.png", status: "Proposed" },
  { name: "Kapisa", capital: "Mahmud-i-Raqi", flag: "https://static.wikia.nocookie.net/vexillology/images/2/26/Flag_of_Kapisa.jpg/960px-Flag_of_Kapisa.jpg.png", status: "Proposed" },
  { name: "Khost", capital: "Khost", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ac/Khost.jpeg/960px-Khost.jpeg.png", status: "Proposed" },
  { name: "Kunar", capital: "Asadabad", flag: "https://static.wikia.nocookie.net/vexillology/images/4/46/Flag_of_Kunar.jpg/960px-Flag_of_Kunar.jpg.png", status: "Proposed" },
  { name: "Kunduz", capital: "Kunduz", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e5/Kunduz.jpeg/960px-Kunduz.jpeg.png", status: "Proposed" },
  { name: "Laghman", capital: "Mihtarlam", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5a/Laghman_Province.jpeg/960px-Laghman_Province.jpeg.png", status: "Proposed" },
  { name: "Logar", capital: "Pul-i-Alam", flag: "https://static.wikia.nocookie.net/vexillology/images/1/17/Flag_of_Logar.jpg/960px-Flag_of_Logar.jpg.png", status: "Proposed" },
  { name: "Maidan Wardak", capital: "Maidan Shar", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d7/Flag_of_Wardak.jpg/960px-Flag_of_Wardak.jpg.png", status: "Proposed" },
  { name: "Nangarhar", capital: "Jalalabad", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fa/Flag_of_Nangarhar.png/960px-Flag_of_Nangarhar.png.png", status: "Proposed" },
  { name: "Nimruz", capital: "Zaranj", flag: "https://static.wikia.nocookie.net/vexillology/images/2/26/Flag_of_Nimruz_Province.svg/960px-Flag_of_Nimruz_Province.svg.png", status: "Proposed" },
  { name: "Nuristan", capital: "Parun", flag: "https://static.wikia.nocookie.net/vexillology/images/3/30/Flag_of_Nuristan.png/960px-Flag_of_Nuristan.png.png", status: "Proposed" },
  { name: "Paktia", capital: "Gardez", flag: "https://static.wikia.nocookie.net/vexillology/images/f/ff/Flag_of_Paktia.png/960px-Flag_of_Paktia.png.png", status: "Proposed" },
  { name: "Paktika", capital: "Sharana", flag: "https://static.wikia.nocookie.net/vexillology/images/9/93/Flag_of_Paktika.png/960px-Flag_of_Paktika.png.png", status: "Proposed" },
  { name: "Panjshir", capital: "Bazarak", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9c/Flag_flown_in_Panjshir_%282019%29.svg/960px-Flag_flown_in_Panjshir_%282019%29.svg.png", status: "Proposed" },
  { name: "Parwan", capital: "Charikar", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a5/Flag_of_Parwan.png/960px-Flag_of_Parwan.png.png", status: "Proposed" },
  { name: "Samangan", capital: "Aybak", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6d/Samangan.jpeg/960px-Samangan.jpeg.png", status: "Proposed" },
  { name: "Sar-e Pol", capital: "Sar-e Pol", flag: "https://static.wikia.nocookie.net/vexillology/images/2/2d/Flag_of_Sar-e-Pol.png/960px-Flag_of_Sar-e-Pol.png.png", status: "Proposed" },
  { name: "Takhar", capital: "Taloqan", flag: "https://static.wikia.nocookie.net/vexillology/images/c/cf/Flag_of_Takhar_Province.svg/960px-Flag_of_Takhar_Province.svg.png", status: "Proposed" },
  { name: "Urozgan", capital: "Tarin Kowt", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6b/Flag_of_Oruzgan.png/960px-Flag_of_Oruzgan.png.png", status: "Proposed" },  
  { name: "Zabul", capital: "Qalat", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3c/Flag_of_Zabul.jpg/960px-Flag_of_Zabul.jpg.png", status: "Proposed" }
];

// --- ALBANIA ---
const albaniaCounties = [
  { name: "Berat", capital: "Berat", flag: "https://static.wikia.nocookie.net/vexillology/images/4/49/Flag_of_Berat.svg/960px-Flag_of_Berat.svg.png" },
  { name: "Dibër", capital: "Peshkopi", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/ALB_Qarku_i_Dibr%C3%ABs_flag.svg/960px-ALB_Qarku_i_Dibr%C3%ABs_flag.svg.png" },
  { name: "Durrës", capital: "Durrës", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_Durr%C3%ABs.svg/960px-Flag_of_Durr%C3%ABs.svg.png" },
  { name: "Elbasan", capital: "Elbasan", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4d/Flag_of_Elbasan.svg/960px-Flag_of_Elbasan.svg.png" },
  { name: "Fier", capital: "Fier", flag: "https://static.wikia.nocookie.net/vexillology/images/e/eb/Flag_of_Fier.png/960px-Flag_of_Fier.png.png" },
  { name: "Gjirokastër", capital: "Gjirokastër", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8d/Flag_of_Gjirokast%C3%ABr_County.png/960px-Flag_of_Gjirokast%C3%ABr_County.png.png" },
  { name: "Korçë", capital: "Korçë", flag: "https://static.wikia.nocookie.net/vexillology/images/2/2b/Flag_of_Kor%C3%A7%C3%AB.svg/960px-Flag_of_Kor%C3%A7%C3%AB.svg.png" },
  { name: "Kukës", capital: "Kukës", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7e/Flag_of_Kuk%C3%ABs.svg/960px-Flag_of_Kuk%C3%ABs.svg.png" },
  { name: "Lezhë", capital: "Lezhë", flag: "https://static.wikia.nocookie.net/vexillology/images/5/53/Flag_of_Lezhe.png/960px-Flag_of_Lezhe.png.png" },
  { name: "Shkodër", capital: "Shkodër", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f0/Flag_of_Shkoder_County.png/960px-Flag_of_Shkoder_County.png.png" },
  { name: "Tirana", capital: "Tirana", flag: "https://static.wikia.nocookie.net/vexillology/images/1/13/Flag_of_Tiran%C3%AB.svg/960px-Flag_of_Tiran%C3%AB.svg.png" },
  { name: "Vlorë", capital: "Vlorë", flag: "https://static.wikia.nocookie.net/vexillology/images/3/30/Flag_of_Vlor%C3%AB.svg/960px-Flag_of_Vlor%C3%AB.svg.png" }
];

// --- ALGERIA ---
const algeriaProvinces = [
  { name: "Adrar", capital: "Adrar", flag: "https://static.wikia.nocookie.net/vexillology/images/d/da/Adrar.jpeg/960px-Adrar.jpeg.png", status: "Proposed" },
  { name: "Aïn Defla", capital: "Aïn Defla", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bc/Ain_Defla.jpeg/960px-Ain_Defla.jpeg.png", status: "Proposed" },
  { name: "Aïn Témouchent", capital: "Aïn Témouchent", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b9/A%C3%AFn_T%C3%A9mouchent_Province.png/960px-A%C3%AFn_T%C3%A9mouchent_Province.png.png", status: "Proposed" },
  { name: "Algiers", capital: "Algiers", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b4/Algiers_Province_FlagDesign_bilalodes.png/960px-Algiers_Province_FlagDesign_bilalodes.png.png", status: "Proposed" },
  { name: "Annaba", capital: "Annaba", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b2/Annaba.jpeg/960px-Annaba.jpeg.png", status: "Proposed" },
  { name: "Batna", capital: "Batna", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d5/Batna.jpeg/960px-Batna.jpeg.png", status: "Proposed" },
  { name: "Béchar", capital: "Béchar", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d2/B%C3%A9char_Province.png/960px-B%C3%A9char_Province.png.png", status: "Proposed" },
  { name: "Béjaïa", capital: "Béjaïa", flag: "https://static.wikia.nocookie.net/vexillology/images/9/98/Bejala.jpeg/960px-Bejala.jpeg.png", status: "Proposed" },
  { name: "Béni Abbès", capital: "Béni Abbès", flag: "https://static.wikia.nocookie.net/vexillology/images/1/1c/Beni_Abbes.png/960px-Beni_Abbes.png.png", status: "Proposed" },
  { name: "Biskra", capital: "Biskra", flag: "https://static.wikia.nocookie.net/vexillology/images/4/48/Biskra.jpeg/960px-Biskra.jpeg.png", status: "Proposed" },
  { name: "Blida", capital: "Blida", flag: "https://static.wikia.nocookie.net/vexillology/images/d/df/Blida.jpeg/960px-Blida.jpeg.png", status: "Proposed" },
  { name: "Bordj Badji Mokhtar", capital: "Bordj Badji Mokhtar", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c8/Bordj_Badji_Mokhtar.png/960px-Bordj_Badji_Mokhtar.png.png", status: "Proposed" },
  { name: "Bordj Bou Arréridj", capital: "Bordj Bou Arréridj", flag: "https://static.wikia.nocookie.net/vexillology/images/8/81/Bordj_Bou_Arreridj.png/960px-Bordj_Bou_Arreridj.png.png", status: "Proposed" },
  { name: "Bouïra", capital: "Bouïra", flag: "https://static.wikia.nocookie.net/vexillology/images/7/74/Bouira.jpeg/960px-Bouira.jpeg.png", status: "Proposed" },
  { name: "Boumerdès", capital: "Boumerdès", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e0/Boumerdes.jpeg/960px-Boumerdes.jpeg.png", status: "Proposed" },
  { name: "Chlef", capital: "Chlef", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0a/Chlef.jpeg/960px-Chlef.jpeg.png", status: "Proposed" },
  { name: "Constantine", capital: "Constantine", flag: "https://static.wikia.nocookie.net/vexillology/images/4/40/Constantine.jpeg/960px-Constantine.jpeg.png", status: "Proposed" },  
  { name: "Djanet", capital: "Djanet", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d2/Djanet.png/960px-Djanet.png.png", status: "Proposed" },
  { name: "Djelfa", capital: "Djelfa", flag: "https://static.wikia.nocookie.net/vexillology/images/9/94/Djelfa.jpeg/960px-Djelfa.jpeg.png", status: "Proposed" },
  { name: "El Bayadh", capital: "El Bayadh", flag: "https://static.wikia.nocookie.net/vexillology/images/d/da/El_Bayadh.jpeg/960px-El_Bayadh.jpeg.png", status: "Proposed" },
  { name: "El Meniaa", capital: "El Meniaa", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/El_Menia_Province.png/960px-El_Menia_Province.png.png", status: "Proposed" },
  { name: "El M'Ghair", capital: "El M'Ghair", flag: "https://static.wikia.nocookie.net/vexillology/images/6/64/El_M%27Ghair.png/960px-El_M%27Ghair.png.png", status: "Proposed" },
  { name: "El Oued", capital: "El Oued", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b5/El_Oued.jpeg/960px-El_Oued.jpeg.png", status: "Proposed" },
  { name: "El Tarf", capital: "El Tarf", flag: "https://static.wikia.nocookie.net/vexillology/images/0/03/Flag_of_El_Taref_Province.svg/960px-Flag_of_El_Taref_Province.svg.png", status: "Proposed" },
  { name: "Ghardaïa", capital: "Ghardaïa", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8b/Ghardaia.jpeg/960px-Ghardaia.jpeg.png", status: "Proposed" },
  { name: "Guelma", capital: "Guelma", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7b/Guelma.jpeg/960px-Guelma.jpeg.png", status: "Proposed" },
  { name: "Illizi", capital: "Illizi", flag: "https://static.wikia.nocookie.net/vexillology/images/5/59/Illizi.jpeg/960px-Illizi.jpeg.png", status: "Proposed" },
  { name: "In Guezzam", capital: "In Guezzam", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fd/In_Guezzam.png/960px-In_Guezzam.png.png", status: "Proposed" },
  { name: "In Salah", capital: "In Salah", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b4/In_Salah_Province.png/960px-In_Salah_Province.png.png", status: "Proposed" },
  { name: "Jijel", capital: "Jijel", flag: "https://static.wikia.nocookie.net/vexillology/images/c/cd/Jijel.jpeg/960px-Jijel.jpeg.png", status: "Proposed" },
  { name: "Khenchela", capital: "Khenchela", flag: "https://static.wikia.nocookie.net/vexillology/images/2/28/Khenchela.jpeg/960px-Khenchela.jpeg.png", status: "Proposed" },
  { name: "Laghouat", capital: "Laghouat", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8b/Laghouat.jpeg/960px-Laghouat.jpeg.png", status: "Proposed" },
  { name: "Mascara", capital: "Mascara", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4b/Mascara.jpeg/960px-Mascara.jpeg.png", status: "Proposed" },
  { name: "Médéa", capital: "Médéa", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fc/Medea.jpeg/960px-Medea.jpeg.png", status: "Proposed" },
  { name: "Mila", capital: "Mila", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a0/Mila.jpeg/960px-Mila.jpeg.png", status: "Proposed" },
  { name: "Mostaganem", capital: "Mostaganem", flag: "https://static.wikia.nocookie.net/vexillology/images/1/10/Mostaganem.jpeg/960px-Mostaganem.jpeg.png", status: "Proposed" },
  { name: "M'Sila", capital: "M'Sila", flag: "https://static.wikia.nocookie.net/vexillology/images/4/41/MSila.jpeg/960px-MSila.jpeg.png", status: "Proposed" },
  { name: "Naâma", capital: "Naâma", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0e/Naama.jpeg/960px-Naama.jpeg.png", status: "Proposed" },
  { name: "Oran", capital: "Oran", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0b/Flag_of_Oran_2.png/960px-Flag_of_Oran_2.png.png", status: "Proposed" },
  { name: "Ouargla", capital: "Ouargla", flag: "https://static.wikia.nocookie.net/vexillology/images/d/da/Ouargla.jpeg/960px-Ouargla.jpeg.png", status: "Proposed" },
  { name: "Ouled Djellal", capital: "Ouled Djellal", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a5/Ouled_Djellal.png/960px-Ouled_Djellal.png.png", status: "Proposed" },
  { name: "Oum El Bouaghi", capital: "Oum El Bouaghi", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e3/Oum_El_Bouaghi.png/960px-Oum_El_Bouaghi.png.png", status: "Proposed" },
  { name: "Relizane", capital: "Relizane", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b4/Relizane.jpeg/960px-Relizane.jpeg.png", status: "Proposed" },
  { name: "Saïda", capital: "Saïda", flag: "https://static.wikia.nocookie.net/vexillology/images/9/92/Saida.jpeg/960px-Saida.jpeg.png", status: "Proposed" },
  { name: "Sétif", capital: "Sétif", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d8/Setif.jpeg/960px-Setif.jpeg.png", status: "Proposed" },
  { name: "Sidi Bel Abbès", capital: "Sidi Bel Abbès", flag: "https://static.wikia.nocookie.net/vexillology/images/9/96/Sidi_Bel_Abbes.jpeg/960px-Sidi_Bel_Abbes.jpeg.png", status: "Proposed" },
  { name: "Skikda", capital: "Skikda", flag: "https://static.wikia.nocookie.net/vexillology/images/b/ba/Skikda.jpeg/960px-Skikda.jpeg.png", status: "Proposed" },
  { name: "Souk Ahras", capital: "Souk Ahras", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8e/Souk_Ahras.jpeg/960px-Souk_Ahras.jpeg.png", status: "Proposed" },
  { name: "Tamanrasset", capital: "Tamanrasset", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0a/Tamanrasset.jpeg/960px-Tamanrasset.jpeg.png", status: "Proposed" },
  { name: "Tébessa", capital: "Tébessa", flag: "https://static.wikia.nocookie.net/vexillology/images/2/29/Tebessa.jpeg/960px-Tebessa.jpeg.png", status: "Proposed" },
  { name: "Tiaret", capital: "Tiaret", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7b/Tiaret.jpeg/960px-Tiaret.jpeg.png", status: "Proposed" },
  { name: "Timimoun", capital: "Timimoun", flag: "https://static.wikia.nocookie.net/vexillology/images/3/36/Timimoun.png/960px-Timimoun.png.png", status: "Proposed" },
  { name: "Tindouf", capital: "Tindouf", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c2/Tindouf.jpeg/960px-Tindouf.jpeg.png", status: "Proposed" },
  { name: "Tipaza", capital: "Tipaza", flag: "https://static.wikia.nocookie.net/vexillology/images/0/09/Tipaza.png/960px-Tipaza.png.png", status: "Proposed" },
  { name: "Tissemsilt", capital: "Tissemsilt", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8c/Tissemslit.jpeg/960px-Tissemslit.jpeg.png", status: "Proposed" },
  { name: "Tizi Ouzou", capital: "Tizi Ouzou", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b6/Tizi_Ouzou.jpeg/960px-Tizi_Ouzou.jpeg.png", status: "Proposed" },
  { name: "Tlemcen", capital: "Tlemcen", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b2/Tlemcen.jpeg/960px-Tlemcen.jpeg.png", status: "Proposed" },
  { name: "Touggourt", capital: "Touggourt", flag: "https://static.wikia.nocookie.net/vexillology/images/3/31/Flag_of_Touggourt.webp/960px-Flag_of_Touggourt.webp.png", status: "Proposed" }
];

// --- ANDORRA ---
const andorraParishes = [
  { name: "Andorra la Vella", capital: "Andorra la Vella", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Andorra_la_Vella.svg/960px-Flag_of_Andorra_la_Vella.svg.png" },
  { name: "Canillo", capital: "Canillo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Hypothetical_flag_of_Canillo.svg/960px-Hypothetical_flag_of_Canillo.svg.png" },
  { name: "Encamp", capital: "Encamp", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hypothetical_flag_of_Encamp.svg/960px-Hypothetical_flag_of_Encamp.svg.png" },
  { name: "Escaldes-Engordany", capital: "Escaldes-Engordany", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Hypothetical_flag_of_Escaldes-Engordany.svg/960px-Hypothetical_flag_of_Escaldes-Engordany.svg.png" },
  { name: "La Massana", capital: "La Massana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Hypothetical_flag_of_La_Massana.svg/960px-Hypothetical_flag_of_La_Massana.svg.png" },
  { name: "Ordino", capital: "Ordino", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Hypothetical_flag_of_Ordino.svg/960px-Hypothetical_flag_of_Ordino.svg.png" },
  { name: "Sant Julià de Lòria", capital: "Sant Julià de Lòria", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hypothetical_flag_of_San_Juli%C3%A1n_de_Loria.svg/1024px-Hypothetical_flag_of_San_Juli%C3%A1n_de_Loria.svg.png" }
];

// --- ANGOLA ---
const angolaProvinces = [
  { name: "Bengo", capital: "Caxito", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/Bengo_Province_V2.png/960px-Bengo_Province_V2.png.png", status: "Proposed" },
  { name: "Benguela", capital: "Benguela", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ae/Bandeira_da_Benguela.gif/960px-Bandeira_da_Benguela.gif.png", status: "Proposed" },
  { name: "Bié", capital: "Kuito", flag: "https://static.wikia.nocookie.net/vexillology/images/1/11/Bie_Province_V2.png/960px-Bie_Province_V2.png.png", status: "Proposed" },
  { name: "Cabinda", capital: "Cabinda", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c4/Flag_of_the_Republic_of_Cabinda.svg/960px-Flag_of_the_Republic_of_Cabinda.svg.png", status: "Proposed" },
  { name: "Cuando Cubango", capital: "Menongue", flag: "https://static.wikia.nocookie.net/vexillology/images/2/25/Cuando.png/960px-Cuando.png.png", status: "Proposed" },
  { name: "Cuanza Norte", capital: "N'dalatando", flag: "https://static.wikia.nocookie.net/vexillology/images/a/af/CuanzaNorteV2.png/960px-CuanzaNorteV2.png.png", status: "Proposed" },
  { name: "Cuanza Sul", capital: "Sumbe", flag: "https://static.wikia.nocookie.net/vexillology/images/9/96/CuanzaSulV2.png/960px-CuanzaSulV2.png.png", status: "Proposed" },
  { name: "Cunene", capital: "Ondjiva", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c0/CuneneV2.png/960px-CuneneV2.png.png", status: "Proposed" },
  { name: "Huambo", capital: "Huambo", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8e/Bandeira_do_Huambo.png/960px-Bandeira_do_Huambo.png.png", status: "Proposed" },
  { name: "Huíla", capital: "Lubango", flag: "https://static.wikia.nocookie.net/vexillology/images/8/85/Huila_ProvinceV2.png/960px-Huila_ProvinceV2.png.png", status: "Proposed" },
  { name: "Luanda", capital: "Luanda", flag: "https://static.wikia.nocookie.net/vexillology/images/8/88/Flag_of_Portuguese_Luanda.svg/960px-Flag_of_Portuguese_Luanda.svg.png", status: "Proposed" },
  { name: "Lunda Norte", capital: "Dundo", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fa/LundaNorteV2.png/960px-LundaNorteV2.png.png", status: "Proposed" },
  { name: "Lunda Sul", capital: "Saurimo", flag: "https://static.wikia.nocookie.net/vexillology/images/6/68/LundaSulV2.png/960px-LundaSulV2.png.png", status: "Proposed" },
  { name: "Malanje", capital: "Malanje", flag: "https://static.wikia.nocookie.net/vexillology/images/d/dc/MalanjeV2.png/960px-MalanjeV2.png.png", status: "Proposed" },
  { name: "Moxico", capital: "Luena", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/MoxicoV2.png/960px-MoxicoV2.png.png", status: "Proposed" },
  { name: "Namibe", capital: "Moçâmedes", flag: "https://static.wikia.nocookie.net/vexillology/images/2/27/NamibeV2.png/960px-NamibeV2.png.png", status: "Proposed" },
  { name: "Uíge", capital: "Uíge", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fd/UigeV2.png/960px-UigeV2.png.png", status: "Proposed" },
  { name: "Zaire", capital: "M'banza-Kongo", flag: "https://static.wikia.nocookie.net/vexillology/images/9/96/ZaireProvinceV2.png/960px-ZaireProvinceV2.png.png", status: "Proposed" }
];

// --- ANTIGUA AND BARBUDA ---
const antiguaParishes = [
  { name: "Saint George", capital: "Piggots", flag: "https://static.wikia.nocookie.net/vexillology/images/2/29/SaintGeorgeAntiguaAndBarbuda.png/960px-SaintGeorgeAntiguaAndBarbuda.png.png", status: "Proposed" },
  { name: "Saint John", capital: "Saint John's", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4a/SaintJohnAntiguaAndBarbuda.png/960px-SaintJohnAntiguaAndBarbuda.png.png", status: "Proposed" },
  { name: "Saint Mary", capital: "Bolans", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5b/SaintMaryAntiguaAndBarbuda.png/960px-SaintMaryAntiguaAndBarbuda.png.png", status: "Proposed" },
  { name: "Saint Paul", capital: "Falmouth", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/SaintPaulAntiguaAndBarbuda.png/960px-SaintPaulAntiguaAndBarbuda.png.png", status: "Proposed" },
  { name: "Saint Peter", capital: "Parham", flag: "https://static.wikia.nocookie.net/vexillology/images/5/58/SaintPeterAntiguaAndBarbuda.png/960px-SaintPeterAntiguaAndBarbuda.png.png", status: "Proposed" },
  { name: "Saint Philip", capital: "Freetown", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d8/SaintPhilipAntiguaAndBarbuda.png/960px-SaintPhilipAntiguaAndBarbuda.png.png", status: "Proposed" }
];
const antiguaDependencies = [
  { name: "Barbuda", capital: "Codrington", flag: "https://static.wikia.nocookie.net/vexillology/images/c/c3/Flag_of_Barbuda.svg/960px-Flag_of_Barbuda.svg.png", status: "Proposed" },
  { name: "Redonda", capital: "Uninhabited", flag: "https://static.wikia.nocookie.net/vexillology/images/2/27/Flag_of_the_Kingdom_of_Redonda.svg/960px-Flag_of_the_Kingdom_of_Redonda.svg.png", status: "Proposed" }
];

// --- ARGENTINA ---
const argentinaProvinces = [
  { name: "Buenos Aires", capital: "La Plata", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bandera_de_la_Provincia_de_Buenos_Aires.svg/960px-Bandera_de_la_Provincia_de_Buenos_Aires.svg.png" },
  { name: "Catamarca", capital: "San Fernando", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bandera_de_la_Provincia_de_Catamarca.svg/960px-Bandera_de_la_Provincia_de_Catamarca.svg.png" },
  { name: "Chaco", capital: "Resistencia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Bandera_de_la_Provincia_del_Chaco.svg/960px-Bandera_de_la_Provincia_del_Chaco.svg.png" },
  { name: "Chubut", capital: "Rawson", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bandera_de_la_Provincia_del_Chubut.svg/960px-Bandera_de_la_Provincia_del_Chubut.svg.png" },
  { name: "Córdoba", capital: "Córdoba", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bandera_de_la_Provincia_de_C%C3%B3rdoba_2014.svg/960px-Bandera_de_la_Provincia_de_C%C3%B3rdoba_2014.svg.png" },
  { name: "Corrientes", capital: "Corrientes", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bandera_de_la_Provincia_de_Corrientes.svg/960px-Bandera_de_la_Provincia_de_Corrientes.svg.png" },
  { name: "Entre Ríos", capital: "Paraná", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bandera_de_la_Provincia_de_Entre_R%C3%ADos.svg/960px-Bandera_de_la_Provincia_de_Entre_R%C3%ADos.svg.png" },
  { name: "Formosa", capital: "Formosa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Bandera_de_la_Provincia_de_Formosa.svg/960px-Bandera_de_la_Provincia_de_Formosa.svg.png" },
  { name: "Jujuy", capital: "San Salvador", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Bandera_de_la_Provincia_de_Jujuy.svg/960px-Bandera_de_la_Provincia_de_Jujuy.svg.png" },
  { name: "La Pampa", capital: "Santa Rosa", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bandera_de_la_Provincia_de_La_Pampa.svg/960px-Bandera_de_la_Provincia_de_La_Pampa.svg.png" },
  { name: "La Rioja", capital: "La Rioja", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Bandera_de_la_Provincia_de_La_Rioja.svg/960px-Bandera_de_la_Provincia_de_La_Rioja.svg.png" },
  { name: "Mendoza", capital: "Mendoza", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Bandera_de_la_Provincia_de_Mendoza.svg/960px-Bandera_de_la_Provincia_de_Mendoza.svg.png" },
  { name: "Misiones", capital: "Posadas", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Bandera_de_la_Provincia_de_Misiones.svg/960px-Bandera_de_la_Provincia_de_Misiones.svg.png" },
  { name: "Neuquén", capital: "Neuquén", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bandera_de_la_Provincia_del_Neuquen.svg/960px-Bandera_de_la_Provincia_del_Neuquen.svg.png" },
  { name: "Río Negro", capital: "Viedma", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bandera_de_la_Provincia_del_R%C3%ADo_Negro.svg/960px-Bandera_de_la_Provincia_del_R%C3%ADo_Negro.svg.png" },
  { name: "Salta", capital: "Salta", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Bandera_de_la_Provincia_de_Salta.svg/960px-Bandera_de_la_Provincia_de_Salta.svg.png" },
  { name: "San Juan", capital: "San Juan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Flag_of_the_San_Juan_Province.svg/960px-Flag_of_the_San_Juan_Province.svg.png" },
  { name: "San Luis", capital: "San Luis", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Bandera_de_la_Provincia_de_San_Luis.svg/960px-Bandera_de_la_Provincia_de_San_Luis.svg.png" },
  { name: "Santa Cruz", capital: "Río Gallegos", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Bandera_de_la_Provincia_de_Santa_Cruz.svg/960px-Bandera_de_la_Provincia_de_Santa_Cruz.svg.png" },
  { name: "Santa Fe", capital: "Santa Fe", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Bandera_de_la_Provincia_de_Santa_Fe.svg/960px-Bandera_de_la_Provincia_de_Santa_Fe.svg.png" },
  { name: "Santiago del Estero", capital: "Santiago del Estero", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bandera_de_la_Provincia_de_Santiago_del_Estero.svg/960px-Bandera_de_la_Provincia_de_Santiago_del_Estero.svg.png" },
  { name: "Tierra del Fuego", capital: "Ushuaia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bandera_de_la_Provincia_de_Tierra_del_Fuego.svg/960px-Bandera_de_la_Provincia_de_Tierra_del_Fuego.svg.png" },
  { name: "Tucumán", capital: "San Miguel", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Bandera_de_la_Provincia_de_Tucum%C3%A1n.svg/960px-Bandera_de_la_Provincia_de_Tucum%C3%A1n.svg.png" }
];
const argentinaAutonomousCity = [
  { name: "Buenos Aires City", capital: "Buenos Aires", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Bandera_de_la_Ciudad_de_Buenos_Aires.svg/960px-Bandera_de_la_Ciudad_de_Buenos_Aires.svg.png" }
];

// --- ARMENIA ---
const armeniaProvinces = [
  { name: "Aragatsotn", capital: "Ashtarak", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7f/Aragatsotn_Province.png/960px-Aragatsotn_Province.png.png", status: "Proposed" },
  { name: "Ararat", capital: "Artashat", flag: "https://static.wikia.nocookie.net/vexillology/images/6/67/Ararat_Province.png/960px-Ararat_Province.png.png", status: "Proposed" },
  { name: "Armavir", capital: "Armavir", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e1/Armavir_Province.png/960px-Armavir_Province.png.png", status: "Proposed" },
  { name: "Gegharkunik", capital: "Gavar", flag: "https://static.wikia.nocookie.net/vexillology/images/2/22/Flags-of-provinces-of-armenia-v0-ndzyqck1zyda1.webp/960px-Flags-of-provinces-of-armenia-v0-ndzyqck1zyda1.webp.png", status: "Proposed" },
  { name: "Kotayk", capital: "Hrazdan", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f4/Flags-of-provinces-of-armenia-v0-xdfne5q2zyda1.webp/960px-Flags-of-provinces-of-armenia-v0-xdfne5q2zyda1.webp.png", status: "Proposed" },
  { name: "Lori", capital: "Vanadzor", flag: "https://static.wikia.nocookie.net/vexillology/images/1/14/Flags-of-provinces-of-armenia-v0-vhqu03a5zyda1.webp/960px-Flags-of-provinces-of-armenia-v0-vhqu03a5zyda1.webp.png", status: "Proposed" },
  { name: "Shirak", capital: "Gyumri", flag: "https://static.wikia.nocookie.net/vexillology/images/0/01/Province_of_Shirak.png/960px-Province_of_Shirak.png.png", status: "Proposed" },
  { name: "Syunik", capital: "Kapan", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d4/Province_of_Syunik.png/960px-Province_of_Syunik.png.png", status: "Proposed" },
  { name: "Tavush", capital: "Ijevan", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a3/Province_of_Tavush.png/960px-Province_of_Tavush.png.png", status: "Proposed" },
  { name: "Vayots Dzor", capital: "Yeghegnadzor", flag: "https://static.wikia.nocookie.net/vexillology/images/8/82/Flags-of-provinces-of-armenia-v0-brigun37zyda1.webp/960px-Flags-of-provinces-of-armenia-v0-brigun37zyda1.webp.png", status: "Proposed" }
];
const armeniaSpecialCity = [
  { name: "Yerevan", capital: "Yerevan", flag: "https://static.wikia.nocookie.net/vexillology/images/4/43/Flag_of_Yerevan.svg/960px-Flag_of_Yerevan.svg.png" }
];

// --- AUSTRALIA ---
const australiaStates = [
  { name: "New South Wales", capital: "Sydney", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_New_South_Wales.svg/960px-Flag_of_New_South_Wales.svg.png" },
  { name: "Queensland", capital: "Brisbane", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Queensland.svg/960px-Flag_of_Queensland.svg.png" },
  { name: "South Australia", capital: "Adelaide", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_South_Australia.svg/960px-Flag_of_South_Australia.svg.png" },
  { name: "Tasmania", capital: "Hobart", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Flag_of_Tasmania.svg/960px-Flag_of_Tasmania.svg.png" },
  { name: "Victoria", capital: "Melbourne", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Victoria_%28Australia%29.svg/960px-Flag_of_Victoria_%28Australia%29.svg.png" },
  { name: "Western Australia", capital: "Perth", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_Western_Australia.svg/960px-Flag_of_Western_Australia.svg.png" }
];
const australiaInternalTerritories = [
  { name: "Australian Capital Territory", capital: "Canberra", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Flag_of_the_Australian_Capital_Territory.svg/960px-Flag_of_the_Australian_Capital_Territory.svg.png" },
  { name: "Northern Territory", capital: "Darwin", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_the_Northern_Territory.svg/960px-Flag_of_the_Northern_Territory.svg.png" }
];

// --- AUSTRIA ---
const austriaStates = [
  { name: "Burgenland", capital: "Eisenstadt", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_Burgenland.svg/1024px-Flag_of_Burgenland.svg.png" },
  { name: "Carinthia", capital: "Klagenfurt", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Carinthia.svg/1024px-Flag_of_Carinthia.svg.png" },
  { name: "Lower Austria", capital: "Sankt Pölten", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Lower_Austria.svg/1024px-Flag_of_Lower_Austria.svg.png" },
  { name: "Salzburg", capital: "Salzburg", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Salzburg.svg/1024px-Flag_of_Salzburg.svg.png" },
  { name: "Styria", capital: "Graz", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Flag_of_Styria.svg/1024px-Flag_of_Styria.svg.png" },
  { name: "Tyrol", capital: "Innsbruck", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Flag_of_Tyrol.svg/1024px-Flag_of_Tyrol.svg.png" },
  { name: "Upper Austria", capital: "Linz", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Upper_Austria.svg/1024px-Flag_of_Upper_Austria.svg.png" },
  { name: "Vienna", capital: "Vienna", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Flag_of_Vienna.svg/1024px-Flag_of_Vienna.svg.png" },
  { name: "Vorarlberg", capital: "Bregenz", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Flag_of_Vorarlberg.svg/1024px-Flag_of_Vorarlberg.svg.png" }
];

// --- AZERBAIJAN ---
const azerbaijanDistricts = [
  { name: "Absheron", capital: "Xirdalan", flag: "https://static.wikia.nocookie.net/vexillology/images/b/ba/AbsheronDistrict2.webp/960px-AbsheronDistrict2.webp.png", status: "Proposed" },
  { name: "Aghdam", capital: "Aghdam", flag: "https://static.wikia.nocookie.net/vexillology/images/f/ff/Flag_of_Aghdam.svg/960px-Flag_of_Aghdam.svg.png", status: "Proposed" },
  { name: "Aghdara", capital: "Aghdara", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4a/AghdaraDistrict.png/960px-AghdaraDistrict.png.png", status: "Proposed" },
  { name: "Aghdash", capital: "Aghdash", flag: "https://static.wikia.nocookie.net/vexillology/images/8/84/Agdash_District_%282%29.webp/960px-Agdash_District_%282%29.webp.png", status: "Proposed" },
  { name: "Aghjabadi", capital: "Aghjabadi", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e7/Aghjabadi_District.webp/960px-Aghjabadi_District.webp.png", status: "Proposed" },
  { name: "Aghstafa", capital: "Aghstafa", flag: "https://static.wikia.nocookie.net/vexillology/images/b/ba/Aghstafa_District.webp/960px-Aghstafa_District.webp.png", status: "Proposed" },
  { name: "Aghsu", capital: "Aghsu", flag: "https://static.wikia.nocookie.net/vexillology/images/3/33/Agsu_District.webp/960px-Agsu_District.webp.png", status: "Proposed" },
  { name: "Astara", capital: "Astara", flag: "https://static.wikia.nocookie.net/vexillology/images/8/88/Flag_of_Astara%2C_Azerbaijan.svg/960px-Flag_of_Astara%2C_Azerbaijan.svg.png", status: "Proposed" },
  { name: "Balakan", capital: "Balakan", flag: "https://static.wikia.nocookie.net/vexillology/images/5/57/Balakan_District.webp/960px-Balakan_District.webp.png", status: "Proposed" },
  { name: "Barda", capital: "Barda", flag: "https://static.wikia.nocookie.net/vexillology/images/0/08/Barda_District.webp/960px-Barda_District.webp.png", status: "Proposed" },
  { name: "Beylagan", capital: "Beylagan", flag: "https://static.wikia.nocookie.net/vexillology/images/6/63/Flag_of_Beylagan_%28city%29.svg/960px-Flag_of_Beylagan_%28city%29.svg.png", status: "Proposed" },
  { name: "Bilasuvar", capital: "Bilasuvar", flag: "https://static.wikia.nocookie.net/vexillology/images/8/86/Bilasuvar_District.webp/960px-Bilasuvar_District.webp.png", status: "Proposed" },
  { name: "Dashkasan", capital: "Dashkasan", flag: "https://static.wikia.nocookie.net/vexillology/images/9/95/Flag_of_Dashkasan.jpg/960px-Flag_of_Dashkasan.jpg.png", status: "Proposed" },
  { name: "Fuzuli", capital: "Fuzuli", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b1/Fuzuli_District.png/960px-Fuzuli_District.png.png", status: "Proposed" },
  { name: "Gadabay", capital: "Gadabay", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8b/Gadabay_District.webp/960px-Gadabay_District.webp.png", status: "Proposed" },
  { name: "Gobustan", capital: "Gobustan", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7a/Gobustan_District.webp/960px-Gobustan_District.webp.png", status: "Proposed" },
  { name: "Goranboy", capital: "Goranboy", flag: "https://static.wikia.nocookie.net/vexillology/images/2/2c/Flag_of_Goranboy_%28city%29.svg/960px-Flag_of_Goranboy_%28city%29.svg.png", status: "Proposed" },
  { name: "Goychay", capital: "Goychay", flag: "https://static.wikia.nocookie.net/vexillology/images/3/37/Goychay_District.webp/960px-Goychay_District.webp.png", status: "Proposed" },
  { name: "Goygol", capital: "Goygol", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fa/Goygol_District.webp/960px-Goygol_District.webp.png", status: "Proposed" },
  { name: "Hajigabul", capital: "Hajigabul", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f7/Hajigabul_District.webp/960px-Hajigabul_District.webp.png", status: "Proposed" },
  { name: "Imishli", capital: "Imishli", flag: "https://static.wikia.nocookie.net/vexillology/images/3/39/Imishli_District.webp/960px-Imishli_District.webp.png", status: "Proposed" },
  { name: "Ismayilli", capital: "Ismayilli", flag: "https://static.wikia.nocookie.net/vexillology/images/8/80/Ismayilli_District.webp/960px-Ismayilli_District.webp.png", status: "Proposed" },
  { name: "Jabrayil", capital: "Jabrayil", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a4/JabrayilDistrict.png/960px-JabrayilDistrict.png.png", status: "Proposed" },
  { name: "Jalilabad", capital: "Jalilabad", flag: "https://static.wikia.nocookie.net/vexillology/images/5/54/Jalilabad_District.webp/960px-Jalilabad_District.webp.png", status: "Proposed" },
  { name: "Kalbajar", capital: "Kalbajar", flag: "https://static.wikia.nocookie.net/vexillology/images/1/18/Kalbajar_District.webp/960px-Kalbajar_District.webp.png", status: "Proposed" },
  { name: "Khachmaz", capital: "Khachmaz", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e8/Flag_of_Khachmaz_%28city%29.svg/960px-Flag_of_Khachmaz_%28city%29.svg.png", status: "Proposed" },
  { name: "Khizi", capital: "Khizi", flag: "https://static.wikia.nocookie.net/vexillology/images/e/ed/Khizi_District_3.png/960px-Khizi_District_3.png.png", status: "Proposed" },
  { name: "Khojaly", capital: "Khojaly", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6f/KhojalyDistrict.png/960px-KhojalyDistrict.png.png", status: "Proposed" },
  { name: "Khojavend", capital: "Khojavend", flag: "https://static.wikia.nocookie.net/vexillology/images/3/39/KhojavendDistrict.png/960px-KhojavendDistrict.png.png", status: "Proposed" },
  { name: "Kurdamir", capital: "Kurdamir", flag: "https://static.wikia.nocookie.net/vexillology/images/3/37/Kurdamir_District.webp/960px-Kurdamir_District.webp.png", status: "Proposed" },
  { name: "Lachin", capital: "Lachin", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8e/LachinDistrict.png/960px-LachinDistrict.png.png", status: "Proposed" },
  { name: "Lankaran", capital: "Lankaran", flag: "https://static.wikia.nocookie.net/vexillology/images/6/60/Lankaran_District.png/960px-Lankaran_District.png.png", status: "Proposed" },
  { name: "Lerik", capital: "Lerik", flag: "https://static.wikia.nocookie.net/vexillology/images/9/95/Lerik_District.webp/960px-Lerik_District.webp.png", status: "Proposed" },
  { name: "Masally", capital: "Masally", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a5/Masally_District.webp/960px-Masally_District.webp.png", status: "Proposed" },
  { name: "Neftchala", capital: "Neftchala", flag: "https://static.wikia.nocookie.net/vexillology/images/0/02/Neftchala_District.webp/960px-Neftchala_District.webp.png", status: "Proposed" },
  { name: "Oghuz", capital: "Oghuz", flag: "https://static.wikia.nocookie.net/vexillology/images/6/65/Oghuz_District.webp/960px-Oghuz_District.webp.png", status: "Proposed" },
  { name: "Qabala", capital: "Qabala", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fe/Qabala_District.webp/960px-Qabala_District.webp.png", status: "Proposed" },
  { name: "Qakh", capital: "Qakh", flag: "https://static.wikia.nocookie.net/vexillology/images/9/99/Qakh_District.webp/960px-Qakh_District.webp.png", status: "Proposed" },
  { name: "Qazakh", capital: "Qazakh", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5b/Flag_of_Gazakh.jpg/960px-Flag_of_Gazakh.jpg.png", status: "Proposed" },
  { name: "Quba", capital: "Quba", flag: "https://static.wikia.nocookie.net/vexillology/images/4/42/Quba_District.webp/960px-Quba_District.webp.png", status: "Proposed" },
  { name: "Qubadli", capital: "Qubadli", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d6/Qubadli_District.webp/960px-Qubadli_District.webp.png", status: "Proposed" },
  { name: "Qusar", capital: "Qusar", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5a/Qusar_District.webp/960px-Qusar_District.webp.png", status: "Proposed" },
  { name: "Saatly", capital: "Saatly", flag: "https://static.wikia.nocookie.net/vexillology/images/0/07/Saatly_District.webp/960px-Saatly_District.webp.png", status: "Proposed" },
  { name: "Sabirabad", capital: "Sabirabad", flag: "https://static.wikia.nocookie.net/vexillology/images/5/55/Sabirabad_District.webp/960px-Sabirabad_District.webp.png", status: "Proposed" },
  { name: "Salyan", capital: "Salyan", flag: "https://static.wikia.nocookie.net/vexillology/images/1/1c/Salyan_District.webp/960px-Salyan_District.webp.png", status: "Proposed" },
  { name: "Samukh", capital: "Samukh", flag: "https://static.wikia.nocookie.net/vexillology/images/2/24/Samukh_District.webp/960px-Samukh_District.webp.png", status: "Proposed" },
  { name: "Shabran", capital: "Shabran", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a1/Shabran_Distric.webp/960px-Shabran_Distric.webp.png", status: "Proposed" },
  { name: "Shaki", capital: "Shaki", flag: "https://static.wikia.nocookie.net/vexillology/images/4/44/ShakiDistrict.png/960px-ShakiDistrict.png.png", status: "Proposed" },
  { name: "Shamakhi", capital: "Shamakhi", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0c/Shamakhi_District.webp/960px-Shamakhi_District.webp.png", status: "Proposed" },
  { name: "Shamkir", capital: "Shamkir", flag: "https://static.wikia.nocookie.net/vexillology/images/d/dc/Shamkir_District.webp/960px-Shamkir_District.webp.png", status: "Proposed" },
  { name: "Shusha", capital: "Shusha", flag: "https://static.wikia.nocookie.net/vexillology/images/7/7e/ShushaDistrict.png/960px-ShushaDistrict.png.png", status: "Proposed" },
  { name: "Siyazan", capital: "Siyazan", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5f/Siyazan_District.webp/960px-Siyazan_District.webp.png", status: "Proposed" },
  { name: "Tartar", capital: "Tartar", flag: "https://static.wikia.nocookie.net/vexillology/images/0/09/Tartar_District.webp/960px-Tartar_District.webp.png", status: "Proposed" },
  { name: "Tovuz", capital: "Tovuz", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3b/Flag_of_Tovuz%2C_Azerbaijan.svg/960px-Flag_of_Tovuz%2C_Azerbaijan.svg.png", status: "Proposed" },
  { name: "Ujar", capital: "Ujar", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6f/Ujar_District.webp/960px-Ujar_District.webp.png", status: "Proposed" },
  { name: "Yardimli", capital: "Yardimli", flag: "https://static.wikia.nocookie.net/vexillology/images/c/ce/Yardimli_District.webp/960px-Yardimli_District.webp.png", status: "Proposed" },
  { name: "Yevlakh", capital: "Yevlakh", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5e/Yevlakh_District.png/960px-Yevlakh_District.png.png", status: "Proposed" },
  { name: "Zagatala", capital: "Zagatala", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bf/ZagatalaDistrict.png/960px-ZagatalaDistrict.png.png", status: "Proposed" },
  { name: "Zangilan", capital: "Zangilan", flag: "https://static.wikia.nocookie.net/vexillology/images/5/53/Zangilan_District.png/960px-Zangilan_District.png.png", status: "Proposed" },
  { name: "Zardab", capital: "Zardab", flag: "https://static.wikia.nocookie.net/vexillology/images/c/ca/Zardab_District.webp/960px-Zardab_District.webp.png", status: "Proposed" }
];
const azerbaijanIndependentCities = [
  { name: "Baku", capital: "Baku", flag: "https://static.wikia.nocookie.net/vexillology/images/e/eb/Flag_of_Baku.svg/960px-Flag_of_Baku.svg.png", status: "Proposed" },
  { name: "Ganja", capital: "Ganja", flag: "", status: "Proposed" },
  { name: "Khankendi", capital: "Khankendi", flag: "", status: "Proposed" },
  { name: "Lankaran City", capital: "Lankaran", flag: "", status: "Proposed" },
  { name: "Mingachevir", capital: "Mingachevir", flag: "", status: "Proposed" },
  { name: "Naftalan", capital: "Naftalan", flag: "", status: "Proposed" },
  { name: "Shaki City", capital: "Shaki", flag: "", status: "Proposed" },
  { name: "Shirvan", capital: "Shirvan", flag: "", status: "Proposed" },
  { name: "Shusha City", capital: "Shusha", flag: "", status: "Proposed" },
  { name: "Sumqayit", capital: "Sumqayit", flag: "", status: "Proposed" },
  { name: "Yevlakh City", capital: "Yevlakh", flag: "", status: "Proposed" }
];
const azerbaijanAutonomousRepublic = [
  { name: "Nakhchivan", capital: "Nakhchivan City", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9c/Unofficial_Nakhchivan_Flag.png/960px-Unofficial_Nakhchivan_Flag.png.png", status: "Proposed" }
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

// --- CHINA ---
const chinaProvinces = [
  { name: "Anhui", capital: "Hefei", flag: "https://static.wikia.nocookie.net/vexillology/images/d/d2/Flag_of_Anhui.png/960px-Flag_of_Anhui.png.png", status: "Proposed" },
  { name: "Fujian", capital: "Fuzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bb/Flag_of_Fujian.svg/960px-Flag_of_Fujian.svg.png", status: "Proposed" },
  { name: "Gansu", capital: "Lanzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/4/49/Flag_of_Gansu.svg/960px-Flag_of_Gansu.svg.png", status: "Proposed" },
  { name: "Guangdong", capital: "Guangzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/7/74/Flag_of_Guangdong.jpg/960px-Flag_of_Guangdong.jpg.png", status: "Proposed" },
  { name: "Guizhou", capital: "Guiyang", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b4/Flag_of_Guizhou.svg/960px-Flag_of_Guizhou.svg.png", status: "Proposed" },
  { name: "Hainan", capital: "Haikou", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b7/Flag_of_Hainan.svg/960px-Flag_of_Hainan.svg.png", status: "Proposed" },
  { name: "Hebei", capital: "Shijiazhuang", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9b/Flag_of_Hebei.svg/960px-Flag_of_Hebei.svg.png", status: "Proposed" },
  { name: "Heilongjiang", capital: "Harbin", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8b/Flag_of_Heilongjiang.svg/960px-Flag_of_Heilongjiang.svg.png", status: "Proposed" },
  { name: "Henan", capital: "Zhengzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/7/73/Flag_of_Henan_Province.svg/960px-Flag_of_Henan_Province.svg.png", status: "Proposed" },
  { name: "Hubei", capital: "Wuhan", flag: "https://static.wikia.nocookie.net/vexillology/images/8/83/Flag_of_Hubei.svg/960px-Flag_of_Hubei.svg.png", status: "Proposed" },
  { name: "Hunan", capital: "Changsha", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/Flag_of_Hunan.svg/960px-Flag_of_Hunan.svg.png", status: "Proposed" },
  { name: "Jiangsu", capital: "Nanjing", flag: "https://static.wikia.nocookie.net/vexillology/images/a/ae/Flag_of_Jiangsu.jpg/960px-Flag_of_Jiangsu.jpg.png", status: "Proposed" },
  { name: "Jiangxi", capital: "Nanchang", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/Flag_of_Jiangxi.svg/960px-Flag_of_Jiangxi.svg.png", status: "Proposed" },
  { name: "Jilin", capital: "Changchun", flag: "https://static.wikia.nocookie.net/vexillology/images/6/6c/Jilin_flag.png/960px-Jilin_flag.png.png", status: "Proposed" },
  { name: "Liaoning", capital: "Shenyang", flag: "https://static.wikia.nocookie.net/vexillology/images/4/46/Flag_of_Liaoning.svg/960px-Flag_of_Liaoning.svg.png", status: "Proposed" },
  { name: "Qinghai", capital: "Xining", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f2/Flag_of_Qinghai.png/960px-Flag_of_Qinghai.png.png", status: "Proposed" },
  { name: "Shaanxi", capital: "Xi'an", flag: "https://static.wikia.nocookie.net/vexillology/images/8/84/Flag_of_Shaanxi.png/960px-Flag_of_Shaanxi.png.png", status: "Proposed" },
  { name: "Shandong", capital: "Jinan", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4f/Flag_of_Shandong.svg/960px-Flag_of_Shandong.svg.png", status: "Proposed" },
  { name: "Shanxi", capital: "Taiyuan", flag: "https://static.wikia.nocookie.net/vexillology/images/5/5e/Flag_of_Shanxi.jpg/960px-Flag_of_Shanxi.jpg.png", status: "Proposed" },
  { name: "Sichuan", capital: "Chengdu", flag: "https://static.wikia.nocookie.net/vexillology/images/4/42/Flag_of_Sichuan.jpg/960px-Flag_of_Sichuan.jpg.png", status: "Proposed" },
  { name: "Yunnan", capital: "Kunming", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8c/Flag_of_Yunnan.svg/960px-Flag_of_Yunnan.svg.png", status: "Proposed" },
  { name: "Zhejiang", capital: "Hangzhou", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8f/Flag_of_Zhejiang.png/960px-Flag_of_Zhejiang.png.png", status: "Proposed" }
];
const chinaAutonomous = [
  { name: "Guangxi", capital: "Nanning", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b1/Flag_of_Guangxi.svg/960px-Flag_of_Guangxi.svg.png", status: "Proposed" },
  { name: "Inner Mongolia", capital: "Hohhot", flag: "https://static.wikia.nocookie.net/vexillology/images/6/62/Flag_of_the_Inner_Mongolian_People%27s_Party.svg/960px-Flag_of_the_Inner_Mongolian_People%27s_Party.svg.png", status: "Proposed" },
  { name: "Ningxia", capital: "Yinchuan", flag: "https://static.wikia.nocookie.net/vexillology/images/a/aa/Ningxia.png/960px-Flag_of_Ningxia.png.png", status: "Proposed" },
  { name: "Tibet", capital: "Lhasa", flag: "https://static.wikia.nocookie.net/vexillology/images/0/03/Tibet.png/1600px-Tibet.png.png", status: "Proposed" },
  { name: "Xinjiang", capital: "Ürümqi", flag: "https://static.wikia.nocookie.net/vexillology/images/4/46/Flag_of_Xinjiang.png/1600px-Flag_of_Xinjiang.png.png", status: "Proposed" }
];
const chinaMunicipalities = [
  { name: "Beijing", capital: "Beijing", flag: "https://static.wikia.nocookie.net/vexillology/images/5/52/Beijing_FlagRedesign_S020730zm.svg/960px-Beijing_FlagRedesign_S020730zm.svg.png", status: "Proposed" },
  { name: "Chongqing", capital: "Chongqing", flag: "https://static.wikia.nocookie.net/vexillology/images/4/4a/Flag_of_Chongqing.svg/960px-Flag_of_Chongqing.svg.png", status: "Proposed" },
  { name: "Shanghai", capital: "Shanghai", flag: "https://static.wikia.nocookie.net/vexillology/images/2/26/Flag_of_Shanghai.svg/960px-Flag_of_Shanghai.svg.png", status: "Proposed" },
  { name: "Tianjin", capital: "Tianjin", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e0/Flag_of_Tianjin.svg/960px-Flag_of_Tianjin.svg.png", status: "Proposed" }
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
  { name: "Andhra Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/8/8e/Andhra_Pradesh.png/960px-Andhra_Pradesh.png.png", status: "Proposed" },
  { name: "Arunachal Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/0/01/Arunachal_Pradesh.png/960px-Arunachal_Pradesh.png.png", status: "Proposed" },
  { name: "Assam", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f5/Assam.png/1600px-Assam.png.png", status: "Proposed" },
  { name: "Bihar", flag: "https://static.wikia.nocookie.net/vexillology/images/1/1f/Bihar.png/1600px-Bihar.png.png", status: "Proposed" },
  { name: "Chhattisgarh", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3c/Chhattisgarh.png/960px-Chhattisgarh.png.png", status: "Proposed" },
  { name: "Goa", flag: "https://static.wikia.nocookie.net/vexillology/images/1/19/Flag_of_Goa.svg/960px-Flag_of_Goa.svg.png", status: "Proposed" },
  { name: "Gujarat", flag: "https://static.wikia.nocookie.net/vexillology/images/5/53/Gujarat.png/960px-Gujarat.png.png", status: "Proposed" },
  { name: "Haryana", flag: "https://static.wikia.nocookie.net/vexillology/images/e/e9/Haryana.png/960px-Haryana.png.png", status: "Proposed" },
  { name: "Himachal Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/4/44/Himachal_Pradesh.png/960px-Himachal_Pradesh.png.png", status: "Proposed" },
  { name: "Jharkhand", flag: "https://static.wikia.nocookie.net/vexillology/images/a/a3/Jharkhand.png/1600px-Jharkhand.png.png", status: "Proposed" },
  { name: "Karnataka", flag: "https://static.wikia.nocookie.net/vexillology/images/1/18/Karnataka.png/1600px-Karnataka.png.png", status: "Proposed" },
  { name: "Kerala", flag: "https://static.wikia.nocookie.net/vexillology/images/3/30/Kerala.png/1600px-Kerala.png.png", status: "Proposed" },
  { name: "Madhya Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/b/b0/Madhya_Pradesh.png/960px-Madhya_Pradesh.png.png", status: "Proposed" },
  { name: "Maharashtra", flag: "https://static.wikia.nocookie.net/vexillology/images/e/ec/Maharashtra.png/960px-Maharashtra.png.png", status: "Proposed" },
  { name: "Manipur", flag: "https://static.wikia.nocookie.net/vexillology/images/7/71/Manipur.png/1600px-Manipur.png.png", status: "Proposed" },
  { name: "Meghalaya", flag: "https://static.wikia.nocookie.net/vexillology/images/6/65/Meghalaya.png/960px-Meghalaya.png.png", status: "Proposed" },
  { name: "Mizoram", flag: "https://static.wikia.nocookie.net/vexillology/images/e/eb/Mizoram.png/960px-Mizoram.png.png", status: "Proposed" },
  { name: "Nagaland", flag: "https://static.wikia.nocookie.net/vexillology/images/9/9c/In_nagaland.png/960px-In_nagaland.png.png", status: "Proposed" },
  { name: "Odisha", flag: "https://static.wikia.nocookie.net/vexillology/images/f/f0/Odisha.png/960px-Odisha.png.png", status: "Proposed" },
  { name: "Punjab", flag: "https://static.wikia.nocookie.net/vexillology/images/6/63/Punjab.png/1600px-Punjab.png.png", status: "Proposed" },
  { name: "Rajasthan", flag: "https://static.wikia.nocookie.net/vexillology/images/3/3d/Rajasthan.png/1600px-Rajasthan.png.png", status: "Proposed" },
  { name: "Sikkim", flag: "https://static.wikia.nocookie.net/vexillology/images/8/83/1024px-Flag_of_Sikkim_%281967-1975%29.svg_%281%29.png/640px-1024px-Flag_of_Sikkim_%281967-1975%29.svg_%281%29.png.png", status: "Proposed" },
  { name: "Tamil Nadu", flag: "https://static.wikia.nocookie.net/vexillology/images/f/fd/Tamil_Nadu.png/960px-Tamil_Nadu.png.png", status: "Proposed" },
  { name: "Telangana", flag: "https://static.wikia.nocookie.net/vexillology/images/4/48/Telangana.png/960px-Telangana.png.png", status: "Proposed" },
  { name: "Tripura", flag: "https://static.wikia.nocookie.net/vexillology/images/9/94/Tripura.png/960px-Tripura.png.png", status: "Proposed" },
  { name: "Uttar Pradesh", flag: "https://static.wikia.nocookie.net/vexillology/images/1/18/Uttar_Pradesh.png/960px-Uttar_Pradesh.png.png", status: "Proposed" },
  { name: "Uttarakhand", flag: "https://static.wikia.nocookie.net/vexillology/images/b/bd/Uttarakhand.png/1600px-Uttarakhand.png.png", status: "Proposed" },
  { name: "West Bengal", flag: "https://static.wikia.nocookie.net/vexillology/images/0/0b/West_Bengal.png/1600px-West_Bengal.png.png", status: "Proposed" }
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

// --- UK ---
const ukConstituentCountries = [
  { name: "England", capital: "London", flag: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg" },
  { name: "Northern Ireland", capital: "Belfast", flag: "https://static.wikia.nocookie.net/vexillology/images/4/43/Flag_of_Northern_Ireland_%281953%E2%80%931972%29.svg/960px-Flag_of_Northern_Ireland_%281953%E2%80%931972%29.svg.png" },
  { name: "Scotland", capital: "Edinburgh", flag: "https://upload.wikimedia.org/wikipedia/commons/1/10/Flag_of_Scotland.svg" },
  { name: "Wales", capital: "Cardiff", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Flag_of_Wales.svg" }
];

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
  
  // =============================================================================
// --- PROSES PENGGABUNGAN & EXPORT LENGKAP ---
// =============================================================================

export const allSubdivisionsRaw = [
// Afghanistan
  ...afghanistanProvinces.map(s => ({ ...s, country: "Afghanistan", type: "Provinces" })),
  
  // Albania
  ...albaniaCounties.map(s => ({ ...s, country: "Albania", type: "Counties" })),
  
  // Algeria
  ...algeriaProvinces.map(s => ({ ...s, country: "Algeria", type: "Provinces" })),
  
  // Andorra
  ...andorraParishes.map(s => ({ ...s, country: "Andorra", type: "Parishes" })),
  
  // Angola
  ...angolaProvinces.map(s => ({ ...s, country: "Angola", type: "Provinces" })),
  
  // Antigua and Barbuda
  ...antiguaParishes.map(s => ({ ...s, country: "Antigua and Barbuda", type: "Parishes" })),
  ...antiguaDependencies.map(s => ({ ...s, country: "Antigua and Barbuda", type: "Dependencies" })),
  
  // Argentina
  ...argentinaProvinces.map(s => ({ ...s, country: "Argentina", type: "Provinces" })),
  ...argentinaAutonomousCity.map(s => ({ ...s, country: "Argentina", type: "Autonomous City" })),
  
  // Armenia
  ...armeniaProvinces.map(s => ({ ...s, country: "Armenia", type: "Provinces" })),
  ...armeniaSpecialCity.map(s => ({ ...s, country: "Armenia", type: "Special City" })),
  
  // Australia
  ...australiaStates.map(s => ({ ...s, country: "Australia", type: "States" })),
  ...australiaInternalTerritories.map(s => ({ ...s, country: "Australia", type: "Internal Territories" })),
  
  // Austria
  ...austriaStates.map(s => ({ ...s, country: "Austria", type: "States" })),
  
  // Azerbaijan
  ...azerbaijanDistricts.map(s => ({ ...s, country: "Azerbaijan", type: "Districts" })),
  ...azerbaijanIndependentCities.map(s => ({ ...s, country: "Azerbaijan", type: "Independent Cities" })),
  ...azerbaijanAutonomousRepublic.map(s => ({ ...s, country: "Azerbaijan", type: "Autonomous Republic" })),
  
  // Brazil
  ...brazilStates.map(s => ({ ...s, country: "Brazil", type: "States" })),
  ...brazilFederal.map(s => ({ ...s, country: "Brazil", type: "Federal District" })),
  
  // Canada
  ...canadaProvinces.map(s => ({ ...s, country: "Canada", type: "Provinces" })),
  
  // China
  ...chinaProvinces.map(s => ({ ...s, country: "China", type: "Provinces" })),
  ...chinaAutonomous.map(s => ({ ...s, country: "China", type: "Autonomous Regions" })),
  ...chinaMunicipalities.map(s => ({ ...s, country: "China", type: "Municipalities" })),
  
  // France
  ...franceRegions.map(s => ({ ...s, country: "France", type: "Regions" })),
  
  // Germany
  ...germanyStates.map(s => ({ ...s, country: "Germany", type: "States" })),
  
  // India
  ...indiaStates.map(s => ({ ...s, country: "India", type: "States" })),
  
  // Italy
  ...italyRegions.map(s => ({ ...s, country: "Italy", type: "Regions" })),
  ...italyAutonomousRegions.map(s => ({ ...s, country: "Italy", type: "Autonomous Regions" })),
  
  // Japan
  ...japanPrefectures.map(s => ({ ...s, country: "Japan", type: "Prefectures" })),
  
  // Mexico
  ...mexicoStates.map(s => ({ ...s, country: "Mexico", type: "States" })),
  ...mexicoFederalEntity.map(s => ({ ...s, country: "Mexico", type: "Federal Entity" })),
  
  // Russia
  ...russiaRepublics.map(s => ({ ...s, country: "Russia", type: "Republics" })),
  ...russiaKrais.map(s => ({ ...s, country: "Russia", type: "Krais" })),
  ...russiaOblasts.map(s => ({ ...s, country: "Russia", type: "Oblasts" })),
  ...russiaFederalCities.map(s => ({ ...s, country: "Russia", type: "Federal Cities" })),
  ...russiaAutonomousOblast.map(s => ({ ...s, country: "Russia", type: "Autonomous Oblast" })),
  ...russiaAutonomousOkrugs.map(s => ({ ...s, country: "Russia", type: "Autonomous Okrugs" })),
  
  // South Korea
  ...southKoreaProvinces.map(s => ({ ...s, country: "South Korea", type: "Provinces" })),
  ...southKoreaMetropolitanCities.map(s => ({ ...s, country: "South Korea", type: "Metropolitan Cities" })),
  ...southKoreaSpecialCities.map(s => ({ ...s, country: "South Korea", type: "Special Cities" })),
  
  // UK
  ...ukConstituentCountries.map(s => ({ ...s, country: "UK", type: "Constituent Countries" })),
  
  // USA
  ...usStates.map(s => ({ ...s, country: "USA", type: "States" })),
  ...usFederal.map(s => ({ ...s, country: "USA", type: "Federal District" })),
];
