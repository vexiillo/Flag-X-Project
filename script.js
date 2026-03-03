 // --- IMPORT DATA & FIREBASE ---

    import {

        officialCountries,

        subdivisions,

        territories,

        unofficial,

        historicalFlags,

        worldOrganizations,

        continentFlags

    } from './flagsData.js';


    // Import Firebase SDK (Modular)

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



    // --- FIREBASE CONFIGURATION ---

    // ⚠️ GANTI INI DENGAN CONFIG DARI FIREBASE CONSOLE ANDA

 // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyA-f-B0RH9CJDsfxytIIdyBWwAxNJ4vDik",

  authDomain: "flag-x-3439d.firebaseapp.com",

  projectId: "flag-x-3439d",

  storageBucket: "flag-x-3439d.firebasestorage.app",

  messagingSenderId: "576734845240",

  appId: "1:576734845240:web:620dfc7ee7f9e7ad0149cd",

  measurementId: "G-1VKSLQQCPN"

};

    // --- INITIALIZE FIREBASE ---

let app, auth, db, googleProvider; // Gunakan nama googleProvider agar sinkron dengan kode bawahnya

try {

    app = initializeApp(firebaseConfig);

    auth = getAuth(app);

    db = getFirestore(app);

    googleProvider = new GoogleAuthProvider(); // Pastikan namanya googleProvider

} catch (e) {

    console.error("Firebase Init Error:", e);

}

// --- BAGIAN PENDAFTARAN SUARA (TARUH DI ATAS) ---
// Pastikan nama filenya sama persis dengan yang kamu unduh (contoh: correct.mp3)
const sfxCorrect = new Audio('./correct.mp3'); 

// Atur volume (0.0 sampai 1.0)
sfxCorrect.volume = 1.0;

// 2. TULIS FUNGSI showScreen DI LUAR / ATAS

// Update fungsi showScreen yang sudah ada
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        localStorage.setItem('lastActiveScreen', screenId);
        
         // --- LOGIKA SEMBUNYIKAN NAV ---
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            // Sembunyikan jika di Home atau saat sedang mengerjakan Kuis
            if (screenId === 'home-screen' || screenId === 'quiz-screen') {
                bottomNav.style.display = 'none';
                document.body.classList.add('nav-hidden'); // Bantu CSS untuk tombol scroll
            } else {
                bottomNav.style.display = 'flex';
                document.body.classList.remove('nav-hidden');
            }
        }
       
        // Panggil fungsi untuk update status ikon navigasi
        updateNavActiveState(screenId);
    }
}

// Fungsi tambahan untuk sinkronisasi ikon navigasi
function updateNavActiveState(screenId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    if (screenId === 'home-screen') {
        document.getElementById('nav-home')?.classList.add('active');
    } else if (screenId === 'quiz-modes-screen') {
        document.getElementById('nav-quiz')?.classList.add('active');
    } 
    // TAMBAHKAN INI: Supaya ikon library nyala saat di menu kategori maupun saat liat benderanya
    else if (screenId === 'library-categories-screen' || screenId === 'library-screen') {
        document.getElementById('nav-library')?.classList.add('active');
    } 
    else if (screenId === 'leaderboard-screen') {
        document.getElementById('nav-leaderboard')?.classList.add('active');
    }
}

    // --- DATA PROCESSING ---

    const groupDataByCountry = (dataArray) => {

    const grouped = dataArray.reduce((acc, item) => {

        const country = item.country;

        if (!acc[country]) {

            acc[country] = [];

        }

        acc[country].push(item);

        return acc;

    }, {});



    // Urutkan nama negara (Key) secara abjad A-Z

    return Object.keys(grouped)

        .sort()

        .reduce((acc, key) => {

            acc[key] = grouped[key];

            return acc;

        }, {});

};



    const subdivisionFlags = groupDataByCountry(subdivisions);

    const territoryFlags = groupDataByCountry(territories);

    const historicalFlagsByCountry = groupDataByCountry(historicalFlags);



    // --- GLOBAL STATE & ELEMENTS ---

    const beginnerFlagPool = [...officialCountries, ...subdivisions, ...territories, ...unofficial];

    const masterFlagPool = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations];

    const capitalGuessData = officialCountries.filter(f => f.capital);

    

    let currentQuiz = { mode: null, dataset: [], score: 0, questionNumber: 0, totalQuestions: 0, correctAnswer: null, timerId: null, timeLeft: 0, lives: 1, lastMode: null, lastSubMode: null };

    let settings = { language: 'en', difficulty: 4 };



    const screens = document.querySelectorAll('.screen');

    const totalscoreValueEl = document.getElementById('totalscore-value');
   
const settingsPanel = document.getElementById('settings-panel');

    const endQuizModal = document.getElementById('end-quiz-modal');

    const geminiModal = document.getElementById('gemini-modal');

    const geminiContentEl = document.getElementById('gemini-content');

    const infoBtn = document.getElementById('info-btn');

const disclaimerPanel = document.getElementById('disclaimer-panel');

const closeDisclaimerBtn = document.getElementById('close-disclaimer-btn');

const closeDisclaimerX = document.getElementById('close-disclaimer-x');

// Fungsi untuk menghitung level progresif berdasarkan XP
function calculateLevel(xp) {
    if (xp < 5000) return Math.floor(xp / 500) + 1;           // Lv 1 - 10
    if (xp < 20000) return 10 + Math.floor((xp - 5000) / 1000); // Lv 11 - 25
    if (xp < 57500) return 25 + Math.floor((xp - 20000) / 2500); // Lv 26 - 40
    if (xp < 102500) return 40 + Math.floor((xp - 57500) / 5000); // Lv 41 - 49
    return 50; // MAX LEVEL
}

    function toggleTheme() {

    const html = document.documentElement;

    const sunIcon = document.getElementById('sun-icon');

    const moonIcon = document.getElementById('moon-icon');



    // Toggle class 'light' pada HTML

    html.classList.toggle('light');

    

    // Tentukan tema saat ini

    const isLight = html.classList.contains('light');

    

    // Simpan ke localStorage

    localStorage.setItem('flagx-theme', isLight ? 'light' : 'dark');



    // LOGIKA PERUBAHAN IKON:

    if (isLight) {

        // Jika Light Mode: Sembunyikan Matahari, Tampilkan Bulan

        if (sunIcon) sunIcon.classList.add('hidden');

        if (moonIcon) moonIcon.classList.remove('hidden');

    } else {

        // Jika Dark Mode: Tampilkan Matahari, Sembunyikan Bulan

        if (sunIcon) sunIcon.classList.remove('hidden');

        if (moonIcon) moonIcon.classList.add('hidden');

    }

}



function loadTheme() {

  const theme = localStorage.getItem('flagx-theme');

  const sunIcon = document.getElementById('sun-icon');

  const moonIcon = document.getElementById('moon-icon');



  if (theme === 'light') {

    document.documentElement.classList.add('light');

    // Jika light mode, sembunyikan matahari, munculkan bulan

    if (sunIcon) sunIcon.classList.add('hidden');

    if (moonIcon) moonIcon.classList.remove('hidden');

  } else {

    // Jika dark mode (default), pastikan matahari muncul

    document.documentElement.classList.remove('light');

    if (sunIcon) sunIcon.classList.remove('hidden');

    if (moonIcon) moonIcon.classList.add('hidden');

  }

}



        // UI Elements for Profile & Leaderboard

    const profileBtn = document.getElementById('profile-btn');

    const profilePanel = document.getElementById('profile-panel');

    const userPanelImg = document.getElementById('user-panel-img');

    const usernameInput = document.getElementById('username-input');

    const usernameActions = document.getElementById('username-actions');

    const saveUsernameBtn = document.getElementById('save-username-btn');

    const cancelUsernameBtn = document.getElementById('cancel-username-btn');

    

        // --- PERBAIKAN: TARUH DI BARIS 514 (DALAM SCRIPT MODULE) ---



    // Fungsi untuk menutup semua panel

    function closeAllPanels() {
    const panels = ['settings-panel', 'profile-panel', 'disclaimer-panel', 'level-info-panel'];
    panels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
}

// --- LOGIKA UNTUK PANEL LEVEL INFO ---

function openLevelInfo(e) {
    if (e) e.stopPropagation(); 
    
    const levelPanel = document.getElementById('level-info-panel');
    const isCurrentlyActive = levelPanel.classList.contains('active');
    
    closeAllPanels(); // Menutup panel lain
    
    // Jika sebelumnya tidak aktif, maka buka. Jika sudah aktif, biarkan tertutup oleh closeAllPanels
    if (!isCurrentlyActive) {
        levelPanel.classList.add('active');
    }
}

// Pastikan didaftarkan agar bisa dipanggil dari HTML
window.openLevelInfo = openLevelInfo;

     // --- EVENT LISTENERS (YANG SUDAH DIPERBAIKI) ---

    

    // 1. Logika Tombol Profile

// --- PERBAIKAN: Logika Tombol Profile ---
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = profilePanel.classList.contains('active');
        closeAllPanels(); // Tutup semua dulu
        if (!isActive) {
            profilePanel.classList.add('active'); // Buka jika sebelumnya tutup
        }
    });
}
    // 2. Logika Tombol Settings

    const settingsBtn = document.getElementById('settings-btn');

// --- PERBAIKAN: Logika Tombol Settings ---
if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = settingsPanel.classList.contains('active');
        closeAllPanels();
        if (!isActive) {
            settingsPanel.classList.add('active');
        }
    });
}
// --- TAMBAHKAN BLOK INI ---

if (infoBtn) {

    infoBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        // Tutup panel lain agar tidak tumpang tindih

        profilePanel.classList.remove('active');

        settingsPanel.classList.remove('active');

        // Toggle disclaimer

        disclaimerPanel.classList.toggle('active');

    });

}

// --------------------------

           // 3. Logika Tombol Leaderboard (VERSI BARU)

    const leaderboardBtn = document.getElementById('open-leaderboard-btn');

    if (leaderboardBtn) {

        leaderboardBtn.addEventListener('click', () => {

            showScreen('leaderboard-screen'); // Langsung buka screen

            loadLeaderboard(); // Fungsi loadLeaderboard yang akan menentukan tampil gembok atau data

        });

    }

    // --- SCROLL TO TOP LOGIC ---
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        // Deteksi scroll: Munculkan tombol jika layar di-scroll lebih dari 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Aksi klik: Kembali ke atas dengan efek halus (smooth)
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }  

    // Listener Theme Switcher (Sudah Benar, biarkan saja)

    document.getElementById('theme-switcher').addEventListener('click', toggleTheme);

        

    // --- TRANSLATIONS ---

    const translations = {

        en: {

            totalScoreLabel: "XP", homeSubtitle: "Test Your Global Knowledge", homePlayQuiz: "Play Quiz", homeFlagLibrary: "Flag Library",

            quizModesTitle: "Quiz Modes", backToMenu: "Back to Menu", continentClashTitle: "Choose a Continent", backToQuizModes: "Back to Quiz Modes",

            quizScore: "XP", quizEnd: "End Quiz", resultsTitle: "Quiz Over!", resultsFinalScore: "XP Results:", resultsPlayAgain: "Play Again",

            libraryTitle: "Flag Library", continentLibraryTitle: "Choose a Continent", backToLibrary: "Back to Library", backButton: "Back",

            endQuizModalTitle: "End Quiz?", endQuizModalText: "Are you sure you want to end the current quiz? Your XP will be finalized.",

            endQuizModalYes: "Yes, End", endQuizModalCancel: "Cancel", footer: "Flag-X © 2025. All Rights Reserved.",

            settingsLanguage: "Language", settingsDifficulty: "Difficulty", difficultyEasy: "Easy", difficultyNormal: "Normal", difficultyHard: "Hard", settingsContact: "Contact",

            quizPromptFlag: "Which flag is this?", quizPromptGuessCapital: "What is the capital of {countryName}?", quizPromptYear: "Which year is this flag from?",

            resultsMessage: "You gained {score} XP!", 

            survivalResultMessage: "You survived {questions} questions and gained {score} XP!", 

            comboResultMessage: "You survived the Combo Challenge for {questions} questions and gained {score} XP!",

            viewDetailBtn: "View Detail", funFact: "Fun Fact", closeButton: "Close", geminiError: "Sorry, our daily limit has been reached. Please try again tomorrow!", searchPlaceholder: "Search for a flag...",

            mode_classic_title: "Classic Mode", mode_classic_desc: "Guess 20 official country flags. No time limit.",

            mode_continent_title: "Continent Clash", mode_continent_desc: "Focus on flags from a single continent. 20 questions.",

            mode_capital_title: "Capital Guess", mode_capital_desc: "Guess the capital city from the country's flag. 20 questions.",

            mode_year_title: "Year Guess", mode_year_desc: "Guess the year of historical flags. 20 questions.",

            mode_time_title: "Time Attack", mode_time_desc: "Infinite questions in 60 seconds. How many can you get?",

            mode_survival_title: "Survival Mode", mode_survival_desc: "30 questions, one life. Make one mistake and it's over.",

            mode_combo_title: "Combo Challenge", mode_combo_desc: "Mixed questions, 90 seconds, one life. The ultimate test!",

            lib_official_title: "Official Countries", lib_subdivisions_title: "Subdivisions", lib_territories_title: "Territories", 

            lib_unofficial_title: "Unofficial", lib_historical_title: "Historical", lib_organizations_title: "Organizations", lib_continent_title: "Continent Flags",

            subdivisionSelectionTitle: "Choose a Country", territorySelectionTitle: "Choose a Country", historicalSelectionTitle: "Choose a Country",

            playQuizBtn: "Play Quiz", viewBtn: "View",

            // NEW TRANSLATIONS

            loginPrompt: "Login to save your score to the global leaderboard!",

            loginBtn: "Login with Google",

            logoutBtn: "Logout",

            usernameLabel: "Display Name (Rank)",

            homeLeaderboard: "Leaderboard",

            leaderboardTitle: "Top Players",

            leaderboardUser: "Player",

            leaderboardScore: "XP",

            disclaimerTitle: "Flag Accuracy Note",

    disclaimerText: "At Flag-X, we want to provide the maximum global challenge! Please note that some flag images in the Subdivisions, Territories, and Historical Flags categories may not be current official designs or are reconstructions/fan-made. This is because not all regions or historical periods have standardized official flags.\n\nWhy do we still include them? > Because the more flag variations you encounter—even the most unrecognizable ones—the broader your knowledge becomes! Consider this as eye and brain training to recognize unique symbols from all corners of the world and history. Happy learning and playing!"

        },

        id: {

            totalScoreLabel: "XP", homeSubtitle: "Uji Pengetahuan Global Anda", homePlayQuiz: "Main Kuis", homeFlagLibrary: "Pustaka Bendera",

            quizModesTitle: "Mode Kuis", backToMenu: "Kembali ke Menu", continentClashTitle: "Pilih Benua", backToQuizModes: "Kembali ke Mode Kuis",

            quizScore: "XP", quizEnd: "Akhiri Kuis", resultsTitle: "Kuis Selesai!", resultsFinalScore: "Hasil XP:", resultsPlayAgain: "Main Lagi",

            libraryTitle: "Pustaka Bendera", continentLibraryTitle: "Pilih Benua", backToLibrary: "Kembali ke Pustaka", backButton: "Kembali",

            endQuizModalTitle: "Akhiri Kuis?", endQuizModalText: "Apakah Anda yakin ingin mengakhiri kuis saat ini? XP Anda akan difinalisasi.",

            endQuizModalYes: "Ya, Akhiri", endQuizModalCancel: "Batal", footer: "Flag-X © 2025. Hak Cipta Dilindungi.",

            settingsLanguage: "Bahasa", settingsDifficulty: "Tingkat Kesulitan", difficultyEasy: "Mudah", difficultyNormal: "Normal", difficultyHard: "Sulit", settingsContact: "Kontak",

            quizPromptFlag: "Bendera apakah ini?", quizPromptGuessCapital: "Apakah ibu kota dari {countryName}?", quizPromptYear: "Bendera ini dari tahun berapa?",

            resultsMessage: "Anda mendapatkan {score} XP!",

            survivalResultMessage: "Anda bertahan {questions} pertanyaan dan mendapat {score} XP!",

            comboResultMessage: "Anda bertahan di Tantangan Kombo selama {questions} pertanyaan dan mendapat {score} XP!",

            viewDetailBtn: "Lihat Detail", funFact: "Fakta Menarik", closeButton: "Tutup", geminiError: "Maaf, batas harian kami sudah habis. Silakan coba lagi besok!", searchPlaceholder: "Cari bendera...",

            mode_classic_title: "Mode Klasik", mode_classic_desc: "Tebak 20 bendera negara resmi. Tanpa batas waktu.",

            mode_continent_title: "Bentrok Benua", mode_continent_desc: "Fokus pada bendera dari satu benua. 20 pertanyaan.",

            mode_capital_title: "Tebak Ibu Kota", mode_capital_desc: "Tebak ibu kota dari bendera negaranya. 20 pertanyaan.",

            mode_year_title: "Tebak Tahun", mode_year_desc: "Tebak tahun bendera bersejarah. 20 pertanyaan.",

            mode_time_title: "Serangan Waktu", mode_time_desc: "Pertanyaan tak terbatas dalam 60 detik. Berapa banyak yang bisa Anda jawab?",

            mode_survival_title: "Mode Bertahan", mode_survival_desc: "30 pertanyaan, satu nyawa. Satu kesalahan dan permainan berakhir.",

            mode_combo_title: "Tantangan Kombo", mode_combo_desc: "Soal campuran, 90 detik, satu nyawa. Ujian pamungkas!",

            lib_official_title: "Negara Resmi", lib_subdivisions_title: "Subdivisi", lib_territories_title: "Wilayah", 

            lib_unofficial_title: "Tidak Resmi", lib_historical_title: "Bersejarah", lib_organizations_title: "Organisasi", lib_continent_title: "Bendera Benua",

            subdivisionSelectionTitle: "Pilih Negara", territorySelectionTitle: "Pilih Negara", historicalSelectionTitle: "Pilih Negara",

            playQuizBtn: "Main Kuis", viewBtn: "Lihat",

            // NEW TRANSLATIONS

            loginPrompt: "Masuk untuk simpan XP ke papan peringkat global!",

            loginBtn: "Masuk dengan Google",

            logoutBtn: "Keluar",

            usernameLabel: "Nama Tampilan (Peringkat)",

            homeLeaderboard: "Papan Peringkat",

            leaderboardTitle: "Pemain Terbaik",

            leaderboardUser: "Pemain",

            leaderboardScore: "XP",

            disclaimerTitle: "Catatan Akurasi Bendera",

    disclaimerText: "Di Flag-X, kami ingin memberikan tantangan global yang maksimal! Perlu diketahui bahwa beberapa gambar bendera dalam kategori Subdivisions, Territories, dan Historical Flags mungkin bukan merupakan desain resmi saat ini atau bersifat rekonstruksi/fan-made. Hal ini dikarenakan tidak semua wilayah atau periode sejarah memiliki standarisasi bendera resmi.\n\nKenapa tetap kami masukkan? > Karena semakin banyak variasi bendera yang kamu temui—bahkan yang paling sulit dikenali sekalipun—semakin luas pengetahuan yang kamu dapatkan! Anggap ini sebagai latihan mata dan otak untuk mengenali simbol-simbol unik dari seluruh penjuru dunia dan sejarah. Selamat belajar dan bermain!"

        },

    };

    // --- CORE LOGIC ---

    function setLanguage(lang) {

        settings.language = lang;

        localStorage.setItem('flagx-settings', JSON.stringify(settings));

        document.querySelectorAll('[data-translate-key]').forEach(el => {

            const key = el.dataset.translateKey;

            if (translations[lang][key]) {

                if (el.tagName === 'INPUT' && el.placeholder) el.placeholder = translations[lang][key];

                else el.textContent = translations[lang][key];

            }

        });

        renderQuizModes();

        renderLibraryCategories();

        

   // Render Selectors dengan Urutan Abjad

renderSelectorScreen('continent-clash-screen', Object.keys(continentFlags).sort(), (continent) => startQuiz('continent', continent));

renderSelectorScreen('continent-library-screen', Object.keys(continentFlags).sort(), (continent) => showLibrary('continent', continent));

renderSelectorScreen('subdivision-library-screen', Object.keys(subdivisionFlags).sort(), (country) => showLibrary('subdivisions', country));

renderSelectorScreen('territory-library-screen', Object.keys(territoryFlags).sort(), (country) => showLibrary('territories', country));

renderSelectorScreen('historical-library-screen', Object.keys(historicalFlagsByCountry).sort(), (country) => showLibrary('historical', country));

        

        const quizPromptEl = document.getElementById('quiz-prompt');

        if (quizPromptEl.dataset.translateKey) {

            const key = quizPromptEl.dataset.translateKey;

            let text = translations[settings.language][key];

            if (key === 'quizPromptGuessCapital' && quizPromptEl.dataset.countryName) {

                text = text.replace('{countryName}', quizPromptEl.dataset.countryName);

            }

            quizPromptEl.textContent = text;

        }

    }



    function loadSettings() {

        const savedSettings = JSON.parse(localStorage.getItem('flagx-settings'));

        if (savedSettings) settings = savedSettings;

        document.querySelector(`input[name="language"][value="${settings.language}"]`).checked = true;

        document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`).checked = true;

        setLanguage(settings.language);

    }

function updateLevelUI(xp) {
    const level = calculateLevel(xp); // Menggunakan fungsi terpusat
    const levelBadge = document.querySelector('.absolute.-bottom-4'); // Mengambil div badge level dari header HTML
    if (levelBadge) {
        levelBadge.textContent = level === 50 ? 'MAX Lv.' : `Lv. ${level}`;
        
        // Opsional: Ganti warna kalau max level!
        if (level === 50) {
            levelBadge.classList.add('bg-yellow-500'); 
            levelBadge.classList.remove('bg-[var(--primary-color)]');
        }
    }
}

    function loadTotalScore() {
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    totalscoreValueEl.textContent = xp;
    updateLevelUI(xp); // Tambahkan baris ini
}

    // UPDATED: addToTotalScore with Firestore Sync

    async function addToTotalScore(scoreFromQuiz) {

        // 1. Update LocalStorage       
    const currentTotal = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const newTotal = currentTotal + scoreFromQuiz;
    localStorage.setItem('flagx-totalscore', newTotal);
    totalscoreValueEl.textContent = newTotal;
    updateLevelUI(newTotal); // Tambahkan baris ini

        // 2. Update Firestore if Logged In

        if (auth && auth.currentUser) {

            try {

                const userRef = doc(db, "users", auth.currentUser.uid);

                await setDoc(userRef, { 

                    totalScore: newTotal,

                    lastActive: new Date()

                }, { merge: true });

            } catch (e) {

                console.error("Failed to sync score:", e);

            }

        }

    }

    // --- AUTH & DATABASE FUNCTIONS ---

    

    // Ganti seluruh fungsi handleLogin dengan ini:

const handleLogin = async (e) => {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

    }



    if (!auth) return alert("Firebase not configured!");



    try {

        console.log("Mencoba membuka popup Google...");

        await signInWithPopup(auth, googleProvider);

        

        console.log("Login berhasil!");

        

        // SOLUSI MASALAH 1: Tutup panel setelah login sukses

        const profilePanel = document.getElementById('profile-panel');

        if (profilePanel) profilePanel.classList.remove('active');

        

    } catch (error) {

        console.error("Login Error:", error);

        

        // Tutup panel juga jika error/cancel agar tidak menutupi layar

        const profilePanel = document.getElementById('profile-panel');

        if (profilePanel) profilePanel.classList.remove('active');



        if (error.code === 'auth/popup-closed-by-user') {

            console.log("Popup ditutup oleh user");

        } else {

            alert("Gagal Login: " + error.message);

        }

    }

};

    // 2. Handle Logout

    // --- Update Fungsi Logout (Versi Anti-Bug) ---
const handleLogout = async () => {
    try {
        // 1. Proses keluar dari Firebase
        await signOut(auth);

        // 2. Hapus skor lokal agar tidak nyangkut ke user lain/guest
        localStorage.removeItem('flagx-totalscore'); 
                        
        // 3. JALAN NINJA: Paksa refresh halaman!
        // Ini akan otomatis mereset foto profil, nama, dan semua bug tampilan.
        window.location.reload();

    } catch (error) {
        console.error("Logout Error:", error);
        alert("Logout failed, please try again.");
    }
};



    // 3. Sync Score (Cloud <-> Local)

    const syncScoreToCloud = async (user) => {

        const localScore = parseInt(localStorage.getItem('flagx-totalscore') || 0);

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);



        let finalScore = localScore;

        let username = user.displayName;



        if (userSnap.exists()) {

            const data = userSnap.data();

            // Take the HIGHEST score between local and cloud to prevent data loss

            finalScore = Math.max(localScore, data.totalScore || 0);

            username = data.username || user.displayName;

        }

        // Update Local

        localStorage.setItem('flagx-totalscore', finalScore);

        totalscoreValueEl.textContent = finalScore;
        
        updateLevelUI(finalScore); // Tambahkan baris ini

        // Update Cloud

        await setDoc(userRef, {

            username: username,

            photoURL: user.photoURL,

            totalScore: finalScore,

            email: user.email,

            lastActive: new Date()

        }, { merge: true });



        return { username };

    };



    // 4. Update Profile UI

    // Ambil elemen UI

const loggedInView = document.getElementById('auth-logged-in'); // Pastikan ID ini ada di HTML bagian profil

const loggedOutView = document.getElementById('auth-logged-out');

const profileImg = document.getElementById('profile-img');

const profileIconDefault = document.getElementById('profile-icon-default');



// 1. Fungsi untuk Update Tampilan (Sesuai yang kita bahas tadi)

function updateProfileUI(user, customName = null) {

    const loggedOutView = document.getElementById('auth-logged-out');

    const loggedInView = document.getElementById('auth-logged-in');

    

    // Elemen di Pojok (Header)

    const userPhotoPojok = document.getElementById('user-photo'); 

    const userIconDefault = document.getElementById('user-icon-default');



    // Elemen di Profile Panel

    const userPhotoPanel = document.getElementById('user-panel-img');

    const usernameInput = document.getElementById('username-input'); // Input tempat edit nama

    const profileNameDisplay = document.getElementById('profile-name'); // Teks display nama di panel



    if (user) {

        if(loggedOutView) loggedOutView.classList.add('hidden');

        if(loggedInView) loggedInView.classList.remove('hidden');



        // Gunakan customName jika ada, jika tidak ada baru pakai displayName Google

        const finalName = customName || user.displayName || 'User';



        // Update semua elemen nama agar sinkron

        if (usernameInput) usernameInput.value = finalName;

        if (profileNameDisplay) profileNameDisplay.textContent = finalName;



        const photoURL = user.photoURL;

        if (photoURL) {

            if (userPhotoPojok) {

                userPhotoPojok.src = photoURL;

                userPhotoPojok.classList.remove('hidden');

            }

            if (userIconDefault) userIconDefault.classList.add('hidden');

            if (userPhotoPanel) userPhotoPanel.src = photoURL;

        }

    } else {

        // --- LOGIKA SAAT LOGOUT ---

        if(loggedOutView) loggedOutView.classList.remove('hidden');

        if(loggedInView) loggedInView.classList.add('hidden');

        

        if (userPhotoPojok) {

            userPhotoPojok.classList.add('hidden');

            userPhotoPojok.src = '';

        }

        if (userIconDefault) userIconDefault.classList.remove('hidden');

        if (usernameInput) usernameInput.value = '';

        if (profileNameDisplay) profileNameDisplay.textContent = 'Guest';

    }

}



// 2. Fungsi onAuthStateChanged (JANGAN DIBUANG, TAPI DIUPDATE)

// Cari blok kode ini di script.js (sekitar baris 608) dan update isinya:



if (auth) {

    onAuthStateChanged(auth, async (user) => {

        const loginBtn = document.getElementById('login-btn');

        const logoutBtn = document.getElementById('logout-btn');

        

        // Cek apakah user sedang membuka layar leaderboard

        const leaderboardScreen = document.getElementById('leaderboard-screen');

        const isLeaderboardActive = leaderboardScreen && leaderboardScreen.classList.contains('active');



        if (user) {

            // --- KONDISI LOGIN ---

            let nameToDisplay = user.displayName;



            // ... (kode lama kamu untuk ambil username/cache foto biarkan saja) ...

            if (user.photoURL) localStorage.setItem('cachedProfilePic', user.photoURL);

            

            try {

                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (userDoc.exists()) {

                    const userData = userDoc.data();

                    if (userData.username) nameToDisplay = userData.username;

                }

            } catch (err) { console.error(err); }



            updateProfileUI(user, nameToDisplay);

            await syncScoreToCloud(user);

            

            if (loginBtn) loginBtn.classList.add('hidden');

            if (logoutBtn) logoutBtn.classList.remove('hidden');



            // JIKA LOGIN & SEDANG DI LEADERBOARD -> LOAD DATA

            if (isLeaderboardActive) {

                loadLeaderboard(); 

            }



        } else {

            // --- KONDISI GUEST (BELUM LOGIN/LOGOUT) ---

            localStorage.removeItem('cachedProfilePic');

            updateProfileUI(null);

            

            if (loginBtn) loginBtn.classList.remove('hidden');

            if (logoutBtn) logoutBtn.classList.add('hidden');



            // --- PERBAIKAN UTAMA DI SINI ---

            // Bug terjadi karena baris ini TIDAK ADA di kode aslimu.

            // Saat refresh sebagai Guest, leaderboard tetap menampilkan loader bawaan HTML.

            // Kita harus paksa panggil loadLeaderboard() agar tampilan "Terkunci/Lock" muncul.

            if (isLeaderboardActive) {

                loadLeaderboard();

            }

        }

    });

}



    // 5. Load Leaderboard

        const loadLeaderboard = async () => {

        const listContainer = document.getElementById('leaderboard-list');

        

        // 1. CEK STATUS LOGIN DULU

        if (!auth || !auth.currentUser) {

            // Tampilan jika BELUM Login (Terkunci)

            listContainer.innerHTML = `

                <div class="flex flex-col items-center justify-center py-10 px-4 text-center h-full">

                    <div class="w-16 h-16 rounded-full bg-[var(--secondary-color)] flex items-center justify-center text-3xl mb-4 border border-[var(--card-border-color)]">

                        <i class="fa-solid fa-lock text-[var(--subtle-text-color)]"></i>

                    </div>

                    <h3 class="text-xl font-bold mb-2">Leaderboard Locked</h3>

                    <p class="text-subtle mb-6 text-sm max-w-xs mx-auto">

                        Login to view global rankings and compete with others!

                    </p>

                    <button id="leaderboard-login-btn" class="btn btn-primary px-6 py-2 shadow-lg hover:scale-105 transition-transform">

                        <i class="fa-brands fa-google mr-2"></i> Login to Unlock

                    </button>

                </div>

            `;

            

            // Aktifkan tombol login di dalam tampilan terkunci ini

            document.getElementById('leaderboard-login-btn')

  .addEventListener('click', () => {

    signInWithPopup(auth, googleProvider)

      .catch(err => console.error("Login Error:", err));

  });

            return; // BERHENTI DI SINI, jangan load data firebase

        }



        // 2. JIKA SUDAH LOGIN, LOAD DATA FIREBASE (Kode Asli)

        listContainer.innerHTML = `
    <div class="p-8 flex flex-col items-center justify-center gap-3">
        <div class="loader"></div>
        <p class="text-[var(--primary-color)] font-semibold animate-pulse text-sm">
            Loading Leaderboard...
        </p>
    </div>
`;

        try {

            const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(50));

            const querySnapshot = await getDocs(q);

            

            let html = '';

            let rank = 1;



            if (querySnapshot.empty) {

                listContainer.innerHTML = '<div class="p-4 text-subtle text-center">No players yet. Be the first!</div>';

                return;

            }



            querySnapshot.forEach((doc) => {

                const data = doc.data();

                const isMe = auth.currentUser && auth.currentUser.uid === doc.id;

                 // Tambahkan baris ini untuk menghitung level pemain
                const userLevel = calculateLevel(data.totalScore || 0);

                let rankDisplay = rank;

                let rankColor = "text-subtle";

                if(rank === 1) { rankDisplay = '<i class="fa-solid fa-trophy text-yellow-400"></i>'; rankColor="text-yellow-400"; }

                else if(rank === 2) { rankDisplay = '<i class="fa-solid fa-trophy text-gray-400"></i>'; rankColor="text-gray-400"; }

                else if(rank === 3) { rankDisplay = '<i class="fa-solid fa-trophy text-amber-700"></i>'; rankColor="text-amber-700"; }



                const rowClass = `grid grid-cols-12 gap-2 p-3 items-center border-b border-[var(--card-border-color)] text-sm hover:bg-[var(--card-bg-color)] transition ${isMe ? 'bg-[rgba(var(--primary-color-rgb),0.2)] border-[var(--primary-color)]' : ''}`;

                

                html += `
                <div class="${rowClass}">
                    <div class="col-span-2 font-bold text-center ${rankColor}">${rankDisplay}</div>
                    <div class="col-span-7 flex items-center gap-3 pl-2 overflow-hidden">
                        <img src="${data.photoURL || 'https://ui-avatars.com/api/?name='+data.username}" class="w-8 h-8 rounded-full border border-[var(--card-border-color)] object-cover" loading="lazy">
                        <span class="truncate font-semibold flex items-center gap-2 ${isMe ? 'text-[var(--primary-color)]' : ''}">
                            ${data.username || 'Anonymous'}
                            <span class="text-[9px] bg-[var(--primary-color)] text-white px-1.5 py-0.5 rounded shadow-sm">Lv.${userLevel}</span>
                        </span>
                    </div>
                    <div class="col-span-3 text-right font-mono font-bold pr-2">${data.totalScore}</div>
                </div>`;
                rank++;
            });

            listContainer.innerHTML = html;

        } catch (error) {

            console.error("Leaderboard Error:", error);

            listContainer.innerHTML = '<div class="p-4 text-[var(--error-color)] text-center">Error loading leaderboard. Check internet connection.</div>';

        }

    };

    

    function renderQuizModes() {

        const container = document.querySelector('#quiz-modes-screen .grid');

        container.innerHTML = '';

        const modes = [

            { id: 'classic', icon: 'fa-globe', action: () => startQuiz('classic') },

            { id: 'continent', icon: 'fa-map', action: () => showScreen('continent-clash-screen') },

            { id: 'capital', icon: 'fa-landmark', action: () => startQuiz('capitalGuess') },

            { id: 'year', icon: 'fa-hourglass-half', action: () => startQuiz('yearGuess') },

            { id: 'time', icon: 'fa-stopwatch', action: () => startQuiz('timeAttack') },

            { id: 'survival', icon: 'fa-heart-pulse', action: () => startQuiz('survival') },

            { id: 'combo', icon: 'fa-bomb', action: () => startQuiz('combo'), span: 'md:col-span-2' }

        ];

        modes.forEach(mode => {

            const card = document.createElement('div');

            card.className = `card p-4 rounded-lg text-left flex flex-col justify-between ${mode.span || ''}`;

            card.innerHTML = `

                <div>

                    <h3 class="font-bold text-lg flex items-center"><i class="fa-solid ${mode.icon} fa-fw mr-3"></i>${translations[settings.language]['mode_'+mode.id+'_title']}</h3>

                    <p class="text-sm text-subtle pl-9">${translations[settings.language]['mode_'+mode.id+'_desc']}</p>

                </div>

                <div class="mt-4">

                    <button class="btn btn-primary w-full py-2" data-translate-key="playQuizBtn">${translations[settings.language].playQuizBtn}</button>

                </div>`;

            card.querySelector('button').onclick = mode.action;

            container.appendChild(card);

        });

    }

    

    function renderSelectorScreen(screenId, items, action) {

        const container = document.querySelector(`#${screenId} .grid`);

        if (!container) return;

        container.innerHTML = '';

        items.forEach(item => {

            const button = document.createElement('button');

            button.className = 'btn card p-4 rounded-lg';

            button.textContent = item;

            button.onclick = () => action(item);

            container.appendChild(button);

        });

    }

   
    function renderLibraryCategories() {
    const container = document.querySelector('#library-categories-screen .grid');
    container.innerHTML = '';
    const categories = [
        { id: 'official', icon: 'fa-flag', action: () => showLibrary('official') },
        { id: 'continent', icon: 'fa-earth-americas', action: () => showScreen('continent-library-screen') },
        { id: 'subdivisions', icon: 'fa-building-flag', action: () => showScreen('subdivision-library-screen') },
        { id: 'territories', icon: 'fa-signs-post', action: () => showScreen('territory-library-screen') },
        { id: 'historical', icon: 'fa-scroll', action: () => showScreen('historical-library-screen') },
        { id: 'organizations', icon: 'fa-handshake', action: () => showLibrary('organizations') },
        { id: 'unofficial', icon: 'fa-gavel', action: () => showLibrary('unofficial'), span: 'md:col-span-2' }
    ];
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = `card p-4 rounded-lg text-left flex flex-col justify-between ${cat.span || ''}`;
        card.innerHTML = `
            <div>
                 <h3 class="font-bold text-lg flex items-center"><i class="fa-solid ${cat.icon} fa-fw mr-3"></i>${translations[settings.language]['lib_'+cat.id+'_title']}</h3>
            </div>
            <div class="mt-4">
                <button class="btn btn-secondary w-full py-2" data-translate-key="viewBtn">${translations[settings.language].viewBtn}</button>
            </div>`;
        card.querySelector('button').onclick = cat.action;
        container.appendChild(card);
    });
}

    // --- EVENT LISTENERS ---

    

    // Auth Listeners

    document.getElementById('login-google-btn').addEventListener('click', handleLogin);

    document.getElementById('logout-btn').addEventListener('click', handleLogout);



    // Username Editing

    let originalUsername = '';

    usernameInput.addEventListener('focus', () => {

        originalUsername = usernameInput.value;

        usernameActions.classList.remove('hidden');

        usernameActions.classList.add('flex');

    });

    cancelUsernameBtn.addEventListener('click', () => {

        usernameInput.value = originalUsername;

        usernameActions.classList.add('hidden');

        usernameActions.classList.remove('flex');

    });

    saveUsernameBtn.addEventListener('click', async () => {

        const newName = usernameInput.value.trim();

        if (newName && auth.currentUser) {

            try {

                await setDoc(doc(db, "users", auth.currentUser.uid), { username: newName }, { merge: true });

                usernameActions.classList.add('hidden');

                usernameActions.classList.remove('flex');

            } catch (e) { alert("Failed to save name."); }

        }

    });



        // --- SATU-SATUNYA GLOBAL CLICK LISTENER ---
document.addEventListener('click', (e) => {
    const levelPanel = document.getElementById('level-info-panel');
    const totalScoreBtn = document.getElementById('totalscore-container');

    // 1. Logika Level Info Panel (Klik luar untuk tutup)
    if (levelPanel && levelPanel.classList.contains('active')) {
        // Jika yang diklik BUKAN isi panel DAN BUKAN tombol pemicunya
        if (!levelPanel.contains(e.target) && !totalScoreBtn.contains(e.target)) {
            levelPanel.classList.remove('active');
        }
    }

    // 2. Logika Settings Panel
    if (settingsPanel && settingsPanel.classList.contains('active')) {
        if (!settingsPanel.contains(e.target) && !e.target.closest('#settings-btn')) {
            settingsPanel.classList.remove('active');
        }
    }
  
    // 4. Logika Profile Panel
    if (profilePanel && profilePanel.classList.contains('active')) {
        if (!profilePanel.contains(e.target) && 
            !e.target.closest('#profile-btn') && 
            !e.target.closest('#login-google-btn')) { 
            profilePanel.classList.remove('active');
        }
    }
});

    document.querySelectorAll('input[name="language"]').forEach(r => r.addEventListener('change', (e) => setLanguage(e.target.value)));

    document.querySelectorAll('input[name="difficulty"]').forEach(r => r.addEventListener('change', (e) => {

        settings.difficulty = parseInt(e.target.value);

        localStorage.setItem('flagx-settings', JSON.stringify(settings));

    }));



    // 1. Tombol End Quiz
document.getElementById('end-quiz-btn').addEventListener('click', () => {
    endQuizModal.classList.add('active');
    document.body.classList.add('modal-open');
});

// 2. Tombol Cancel End Quiz
document.getElementById('cancel-end-quiz-btn').addEventListener('click', () => {
    endQuizModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

// 3. Tombol Confirm End Quiz (Sudah benar sebelumnya, tapi dirapikan)
document.getElementById('confirm-end-quiz-btn').addEventListener('click', () => { 
    endQuizModal.classList.remove('active'); 
    document.body.classList.remove('modal-open'); 
    endQuiz(); 
});

// 4. Tombol Close Gemini Modal
document.getElementById('close-gemini-modal-btn').addEventListener('click', () => {
    geminiModal.classList.remove('active'); 
    document.body.classList.remove('modal-open');
});
   
// 5. Tombol Close Detail Modal (Sudah Benar)
document.getElementById('close-detail-modal-btn').addEventListener('click', () => {
    document.getElementById('detail-modal').classList.remove('active');
    document.body.classList.remove('modal-open');
});

// 6. Tombol Close Level Up (Sudah Benar)
document.getElementById('close-level-up-btn').addEventListener('click', () => {
    document.getElementById('level-up-modal').classList.remove('active');
    document.body.classList.remove('modal-open');
});

    document.getElementById('library-search-input').addEventListener('input', filterLibrary);



                function startQuiz(mode, subMode = null) {
    // Reset State Kuis
    currentQuiz = { 
        ...currentQuiz, 
        mode: mode, 
        lastMode: mode, 
        lastSubMode: subMode, 
        score: 0, 
        questionNumber: 0, 
        timeLeft: 0, 
        lives: (mode === 'survival' || mode === 'combo') ? 1 : 999 
    };

    // Fungsi pembantu untuk mengacak array
    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    // Tentukan Dataset & Langsung Acak di Awal
    switch (mode) {
        case 'classic': 
            currentQuiz.dataset = shuffle(officialCountries); 
            currentQuiz.totalQuestions = 20; 
            break;
        case 'continent': 
            currentQuiz.dataset = shuffle(continentFlags[subMode]); 
            currentQuiz.totalQuestions = 20; 
            break;
        case 'capitalGuess': 
            currentQuiz.dataset = shuffle(officialCountries.filter(f => f.capital)); 
            currentQuiz.totalQuestions = 20; 
            break;
        case 'yearGuess': 
            currentQuiz.dataset = shuffle(historicalFlags); 
            currentQuiz.totalQuestions = 20; 
            break;
        case 'timeAttack': 
            currentQuiz.dataset = shuffle([...officialCountries, ...subdivisions, ...territories]); 
            currentQuiz.totalQuestions = Infinity; 
            currentQuiz.timeLeft = 60; 
            break;
        case 'survival': 
            currentQuiz.dataset = shuffle([...officialCountries, ...subdivisions]); 
            currentQuiz.totalQuestions = 30; 
            break;
        case 'combo': 
            currentQuiz.dataset = shuffle([...officialCountries, ...subdivisions]); // Tambahkan dataset default untuk combo
            currentQuiz.totalQuestions = Infinity; 
            currentQuiz.timeLeft = 90; 
            break;
    }

    // Update UI Awal
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = "0";

    const timerEl = document.getElementById('timer');
    const hasTimer = currentQuiz.timeLeft > 0;
    
    if (timerEl) {
        timerEl.style.display = hasTimer ? 'block' : 'none';
        timerEl.textContent = currentQuiz.timeLeft;
    }

    if (hasTimer) startTimer(); 

    showScreen('quiz-screen');
    loadQuestion();
}

    // --- INIT APP ---

function initApp() {

    try {

        loadSettings();

        loadTheme();

        loadTotalScore();

        renderQuizModes();

        renderLibraryCategories();



        const cachedPic = localStorage.getItem('cachedProfilePic');

        if (cachedPic) {

            const profileBtn = document.getElementById('profile-btn');

            if (profileBtn) profileBtn.innerHTML = `<img src="${cachedPic}" class="w-full h-full rounded-full object-cover">`;

        }    



        // --- PEMULIHAN LAYAR & DATA ---

        const lastScreen = localStorage.getItem('lastActiveScreen');



        // 1. Logika Library (Aman direfresh)

        if (lastScreen === 'library-display-screen') {

            const libStateRaw = localStorage.getItem('libraryState');

            if (libStateRaw) {

                const libState = JSON.parse(libStateRaw);

                showLibrary(libState.category, libState.subCategory);

            } else {

                showScreen('library-categories-screen');

            }

        }

        // 2. Logika Result (Dipulihkan datanya)

        else if (lastScreen === 'results-screen') {

            const savedResult = localStorage.getItem('lastQuizResult');

            if (savedResult) {

                const data = JSON.parse(savedResult);

                // Pulihkan Tampilan

                document.getElementById('final-score').textContent = data.score;

                document.getElementById('results-message').textContent = data.msg;

                // Pulihkan Fungsi Tombol "Play Again"

                document.getElementById('play-again-btn').onclick = () => startQuiz(data.lastMode, data.lastSubMode);

                showScreen('results-screen');

            } else {

                showScreen('quiz-modes-screen');

            }

        }

        // 3. Logika Sedang Quiz (Reset ke Menu karena data soal hilang)

        else if (lastScreen === 'quiz-screen') {

            showScreen('quiz-modes-screen');

        }

        // 4. Layar Lainnya

        else if (lastScreen && lastScreen !== 'home-screen') {

            showScreen(lastScreen);

        } else {

            showScreen('home-screen');

        }

        

    } catch (error) {

        console.error("Error initializing app:", error);

    }

} // <--- KURUNG KURAWAL INI YANG HILANG SEBELUMNYA

    function loadQuestion() {
    // Cek apakah kuis selesai
    if (currentQuiz.questionNumber >= currentQuiz.totalQuestions || currentQuiz.dataset.length === 0) { 
        endQuiz(); 
        return; 
    }

    currentQuiz.questionNumber++;
    updateQuestionCounter();

    // Logika Progress Bar
    const progressWrapper = document.getElementById('quiz-progress-wrapper');
    const progressFill = document.getElementById('quiz-progress-fill');
    
    if (progressWrapper && progressFill) {
        if (currentQuiz.totalQuestions === Infinity) {
            progressWrapper.style.display = 'none';
        } else {
            progressWrapper.style.display = 'block';
            const percentage = (currentQuiz.questionNumber / currentQuiz.totalQuestions) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    const optionsContainer = document.getElementById('options-container');
    const flagDisplayQuiz = document.getElementById('flag-display-quiz');
    
    optionsContainer.className = `grid gap-4 grid-cols-2 ${settings.difficulty > 4 ? 'lg:grid-cols-3' : ''}`;
    optionsContainer.innerHTML = '';
    flagDisplayQuiz.innerHTML = '';

    if (currentQuiz.mode === 'combo') {
        loadComboQuestion();
        return;
    }
    
    // AMBIL SATU SOAL DAN HAPUS DARI DATASET (Mencegah Duplikat)
    const nextQuestion = currentQuiz.dataset.shift();

    if (currentQuiz.mode === 'capitalGuess') {
        generateCapitalQuestion(nextQuestion);
    } else {
        generateFlagQuestion(nextQuestion, currentQuiz.mode === 'yearGuess');
    }
}

        function loadComboQuestion() {
        const questionTypes = ['flag', 'capital', 'year'];
        const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch(randomType) {
            case 'capital':
                // Tambahkan [0] untuk mengambil satu negara saja
                generateCapitalQuestion([...capitalGuessData].sort(() => 0.5 - Math.random())[0]);
                break;
            case 'year':
                // Tambahkan [0] untuk mengambil satu bendera sejarah saja
                generateFlagQuestion([...historicalFlags].sort(() => 0.5 - Math.random())[0], true);
                break;
            default:
                // Tambahkan [0] untuk mengambil satu bendera acak saja
                generateFlagQuestion([...masterFlagPool].sort(() => 0.5 - Math.random())[0]);
                break;
        }
    }

    function generateCapitalQuestion(targetData) {
    const quizPromptEl = document.getElementById('quiz-prompt');
    const flagDisplayQuiz = document.getElementById('flag-display-quiz');
    const optionsContainer = document.getElementById('options-container');

    currentQuiz.correctAnswer = targetData;
    
    quizPromptEl.dataset.translateKey = 'quizPromptGuessCapital';
    quizPromptEl.dataset.countryName = currentQuiz.correctAnswer.name;
    quizPromptEl.textContent = translations[settings.language].quizPromptGuessCapital.replace('{countryName}', currentQuiz.correctAnswer.name);
    
    flagDisplayQuiz.innerHTML = `<img src="${currentQuiz.correctAnswer.flag}" alt="Flag" class="flag-img mx-auto" loading="lazy" />`;
    
    let options = [currentQuiz.correctAnswer.capital];
    
    // Ambil pengecoh (distractor) dari data global agar tidak mengganggu antrean kuis
    const distractorCapitals = officialCountries
        .filter(c => c.capital && c.capital !== currentQuiz.correctAnswer.capital)
        .map(c => c.capital)
        .sort(() => 0.5 - Math.random());

    while(options.length < settings.difficulty && distractorCapitals.length > 0) {
        options.push(distractorCapitals.shift());
    }
    
    options.sort(() => 0.5 - Math.random()).forEach(capitalName => {
        const button = document.createElement('button');
        button.textContent = capitalName;
        button.className = 'option-btn btn w-full btn-secondary py-3 px-4';
        button.onclick = () => checkAnswer(capitalName);
        optionsContainer.appendChild(button);
    });
}

function generateFlagQuestion(targetData, isYear = false) {
    const quizPromptEl = document.getElementById('quiz-prompt');
    const flagDisplayQuiz = document.getElementById('flag-display-quiz');
    const optionsContainer = document.getElementById('options-container');
    const answerKey = isYear ? 'years' : 'name';
    
    currentQuiz.correctAnswer = targetData;

    quizPromptEl.dataset.translateKey = isYear ? 'quizPromptYear' : 'quizPromptFlag';
    quizPromptEl.textContent = translations[settings.language][quizPromptEl.dataset.translateKey];
    
    flagDisplayQuiz.innerHTML = `<img src="${currentQuiz.correctAnswer.flag}" alt="Flag" class="flag-img mx-auto" loading="lazy" />`;
    
    let options = [currentQuiz.correctAnswer];
    
    // Tentukan kolam pengecoh berdasarkan mode
    const globalPool = isYear ? historicalFlags : officialCountries;
    const distractorPool = globalPool
        .filter(item => item.name !== currentQuiz.correctAnswer.name)
        .sort(() => 0.5 - Math.random());

    while (options.length < settings.difficulty && distractorPool.length > 0) {
        options.push(distractorPool.shift());
    }

    options = options.filter(opt => opt && opt[answerKey]);

    options.sort(() => 0.5 - Math.random()).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option[answerKey] || "????";
        button.className = 'option-btn btn w-full btn-secondary py-3 px-4';
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

        function endQuiz() {
        clearInterval(currentQuiz.timerId);
        
        // 1. CEK LEVEL LAMA SEBELUM SKOR DITAMBAHKAN
        const oldTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
        const oldLevel = calculateLevel(oldTotalXP);
        
        // 2. TAMBAH SKOR KE DATABASE & LOKAL
        addToTotalScore(currentQuiz.score);
        
        // 3. CEK LEVEL BARU
        const newTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
        const newLevel = calculateLevel(newTotalXP);
        
        // Update UI Score
        document.getElementById('final-score').textContent = currentQuiz.score;
        const resultsMessageEl = document.getElementById('results-message');
        
        // Logika Pesan
        let msgText = "";
        if ((currentQuiz.mode === 'survival' || currentQuiz.mode === 'combo') && currentQuiz.lives <= 0) {
            const key = currentQuiz.mode === 'combo' ? 'comboResultMessage' : 'survivalResultMessage';
            msgText = translations[settings.language][key]
                .replace('{questions}', currentQuiz.questionNumber - 1)
                .replace('{score}', currentQuiz.score);
        } else {
            msgText = translations[settings.language].resultsMessage.replace('{score}', currentQuiz.score);
        }
        resultsMessageEl.textContent = msgText;

        const resultData = {
            score: currentQuiz.score,
            msg: msgText,
            lastMode: currentQuiz.lastMode,       
            lastSubMode: currentQuiz.lastSubMode  
        };
        localStorage.setItem('lastQuizResult', JSON.stringify(resultData));

        document.getElementById('play-again-btn').onclick = () => startQuiz(currentQuiz.lastMode, currentQuiz.lastSubMode);
        
        // Pindah ke layar hasil
        showScreen('results-screen');
        
        // 4. LOGIKA MODAL LEVEL UP (Muncul JIKA Level Naik & Dapat Skor)
        if (newLevel > oldLevel && currentQuiz.score > 0) {
            // Beri sedikit jeda agar pemain melihat hasil skornya dulu baru kaget disuguhi modal
            setTimeout(() => {
                const levelModal = document.getElementById('level-up-modal');
                document.getElementById('new-level-display').textContent = `Lv. ${newLevel}`;
                if (levelModal) levelModal.classList.add('active');
                document.body.classList.add('modal-open'); // Tambahkan ini!
                
                // Opsional: Kalau kamu punya sfx Level Up, bisa di-play di sini!
            }, 600); // Muncul 0.6 detik setelah layar hasil terbuka
        }
    }

    function showLibrary(category, subCategory = null) {
    // 0. SIMPAN state library
    localStorage.setItem('libraryState', JSON.stringify({ category, subCategory }));
    
    let data = [], titleKey = '', title = '';
    let backScreen = 'library-categories-screen';

    // 1. Logika Pemilihan Data
    switch(category) {
        case 'official': 
            data = [...officialCountries]; 
            titleKey = 'lib_official_title'; 
            break;
        case 'subdivisions': 
            data = subdivisions.filter(s => s.country === subCategory);
            title = `${subCategory} Subdivisions`; 
            backScreen = 'subdivision-library-screen'; 
            break;
        case 'territories': 
            data = territories.filter(t => t.country === subCategory);
            title = `${subCategory} Territories`; 
            backScreen = 'territory-library-screen'; 
            break;
        case 'unofficial': 
            data = [...unofficial]; 
            titleKey = 'lib_unofficial_title'; 
            break;
        case 'historical': 
            data = historicalFlags.filter(h => h.country === subCategory);
            title = `${subCategory} Historical Flags`; 
            backScreen = 'historical-library-screen'; 
            break;
        case 'organizations': 
            data = [...worldOrganizations]; 
            titleKey = 'lib_organizations_title'; 
            break;
        case 'continent': 
            if (continentFlags[subCategory]) {
                data = [...continentFlags[subCategory]]; 
                data.sort((a, b) => {
                    const typeCompare = (a.type || '').localeCompare(b.type || '');
                    if (typeCompare !== 0) return typeCompare;
                    return a.name.localeCompare(b.name);
                });
            }
            title = `${subCategory} Flags`; 
            backScreen = 'continent-library-screen'; 
            break;
    }

    // 2. Update Judul & Screen
    const titleEl = document.getElementById('library-title-display');
    if (titleEl) {
        if (titleKey) {
            titleEl.dataset.translateKey = titleKey;
            titleEl.textContent = (translations[settings.language] && translations[settings.language][titleKey]) || titleKey;
        } else {
            delete titleEl.dataset.translateKey; 
            titleEl.textContent = title;
        }
    }

    // 3. Setup Tombol Kembali
    const backBtn = document.getElementById('back-from-library-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            localStorage.removeItem('libraryState');
            showScreen(backScreen);
        };
    }

    // 4. Render Grid Bendera
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    
    const fragment = document.createDocumentFragment();
    grid.innerHTML = '';
    grid.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full";
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-subtle">No flags available.</p>`;
        showScreen('library-display-screen');
        return;
    }

    let currentType = null; 
    
    data.forEach(item => {
        // --- LOGIKA HEADER SUB-JUDUL ---
        if (item.type && item.type !== currentType) {
            currentType = item.type;
            const subHeading = document.createElement('div');
            subHeading.className = "col-span-full mt-10 mb-4 border-b-2 border-[var(--card-border-color)] pb-3";
            subHeading.innerHTML = `
                <h3 class="text-xl font-bold text-[var(--primary-color)] flex items-center gap-3">
                    <i class="fa-solid fa-layer-group opacity-70"></i>
                    ${currentType}
                </h3>
            `;
            fragment.appendChild(subHeading);
        }

        // --- 1. PROSES PEMBERSIHAN NAMA (MENGHAPUS KURUNG) ---
        let displayName = item.name;
        // Simpan isi kurung untuk jaga-jaga jika capital kosong
        let infoInParentheses = "";
        const match = displayName.match(/\(([^)]+)\)/);
        if (match) {
            infoInParentheses = match[1];
            displayName = displayName.replace(/\s*\([^)]*\)/g, "").trim();
        }

        // --- 2. LOGIKA STATUS BADGE (HANYA PROPOSED & RECONSTRUCTION) ---
        let badgeHTML = '';
        if (item.status) {
            const statusLower = item.status.toLowerCase();
            if (statusLower === 'proposed' || statusLower === 'reconstruction') {
                let badgeClass = statusLower === 'proposed' ? 'badge-info' : 'badge-warning';
                let iconClass = statusLower === 'proposed' ? 'fa-file-pen' : 'fa-hammer';
                
                badgeHTML = `<span class="status-badge ${badgeClass}">
                                <i class="fa-solid ${iconClass} mr-1"></i>${item.status}
                             </span>`;
            }
        }

        // --- 3. LOGIKA SUB-TEXT (CAPITAL PRIORITY) ---
        let subText = "";
        if (item.capital) {
            subText = item.capital;
        } else if (item.years || item.year) {
            subText = item.years || item.year;
        } else if (infoInParentheses) {
            subText = infoInParentheses; // Misal: "Taliban"
        } else if (item.country) {
            subText = item.country;
        }

                // --- 4. RENDER KARTU ---
        const card = document.createElement('div');
        // Relative & overflow-hidden wajib agar badge Proposed/Recon rapi di pojok
        card.className = 'card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
        card.dataset.name = item.name.toLowerCase();
               
// Tambahkan onerror dan hapus opacity-0 agar lebih pasti
card.innerHTML = `
    ${badgeHTML}
    <div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center">
        <img src="${item.flag}" 
             alt="${item.name} flag" 
             class="flag-img w-full h-full object-cover transition-opacity duration-300" 
             loading="lazy" 
             onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Link+Mati'; this.style.opacity=1;"
             onload="this.style.opacity=1" />
    </div>
            <div class="flex-grow flex flex-col justify-center py-1 w-full">
                 <div class="flex flex-col w-full px-1">
                    <p class="font-semibold text-[13px] leading-tight break-words line-clamp-2">
                        ${displayName}
                    </p>
                    <p class="text-subtle text-[10px] font-medium mt-1 break-words">
                        ${subText || '&nbsp;'}
                    </p>
                </div>
            </div>
            <div class="flex flex-col gap-1 mt-2 w-full">
            <button class="btn bg-[var(--primary-color)] text-white rounded-md text-[10px] py-1.5 px-2 w-full hover:scale-105 active:scale-95 transition-transform shadow-md flex items-center justify-center" 
        onclick="getFlagDetail('${item.name.replace(/'/g, "\\'")}', '${item.flag}')">
    <i class="fa-solid fa-book-open mr-1"></i> 
    <span data-translate-key="viewDetailBtn">${(translations[settings.language] && translations[settings.language].viewDetailBtn) || 'View Detail'}</span>
</button>

<button class="fun-fact-btn btn text-white rounded-md text-[10px] py-1.5 px-2 w-full hover:scale-105 active:scale-95 transition-transform shadow-md flex items-center justify-center" 
        onclick="getFunFact('${item.name.replace(/'/g, "\\'")}')">
    <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> 
    <span data-translate-key="funFact">${(translations[settings.language] && translations[settings.language].funFact) || 'Fun Fact'}</span>
</button>
            </div>`;
        
        fragment.appendChild(card); });

    grid.appendChild(fragment);
    const searchInput = document.getElementById('library-search-input');
    if (searchInput) searchInput.value = '';
    showScreen('library-display-screen');
}

        function checkAnswer(selectedOption) { 
        Array.from(document.getElementById('options-container').children).forEach(btn => btn.disabled = true); 

        const promptKey = document.getElementById('quiz-prompt').dataset.translateKey;
        const isCapitalGuess = promptKey === 'quizPromptGuessCapital';
        const isYearGuess = promptKey === 'quizPromptYear';

        const correctId = isCapitalGuess 
            ? currentQuiz.correctAnswer.capital 
            : (isYearGuess ? currentQuiz.correctAnswer.years : currentQuiz.correctAnswer.name);

        const selectedId = typeof selectedOption === 'object' 
            ? (isYearGuess ? selectedOption.years : selectedOption.name) 
            : selectedOption;

        const selectedButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == selectedId); 
        const correctButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == correctId); 
        const flagImg = document.querySelector("#flag-display-quiz img");

                            if (selectedId === correctId) { 
            // --- JAWABAN BENAR ---        
            sfxCorrect.play(); 
            
            // Menentukan XP berdasarkan mode
            let xpReward = 10; // Default
            switch (currentQuiz.mode) {
                case 'classic':                     
                case 'continent': 
                    xpReward = 5; 
                    break;
                case 'capitalGuess': 
                    xpReward = 10; 
                    break;
                case 'yearGuess':                    
                case 'timeAttack': 
                    xpReward = 25; 
                    break;
                case 'survival': 
                    xpReward = 35; 
                    break;
                case 'combo': 
                    xpReward = 50; 
                    break;
            }
            
            currentQuiz.score += xpReward; 
            document.getElementById('score').textContent = currentQuiz.score; 
            
            if(selectedButton) {
                selectedButton.classList.add('correct'); 
                // PANGGIL ANIMASI XP DI SINI!
                showFloatingXP(xpReward, selectedButton);
            }
            if(flagImg) flagImg.classList.add('correct-flag');
                   
    } else { 
        // --- JAWABAN SALAH ---
        if ("vibrate" in navigator) navigator.vibrate(100); // Haptic peringatan
        
        if (currentQuiz.mode === 'survival' || currentQuiz.mode === 'combo') currentQuiz.lives--; 
        if(selectedButton) selectedButton.classList.add('incorrect'); 
        if(correctButton) correctButton.classList.add('correct'); 
        if(flagImg) flagImg.classList.add('incorrect-flag');
    } 
    
        if ((currentQuiz.mode === 'survival' || currentQuiz.mode === 'combo') && currentQuiz.lives <= 0) {
            setTimeout(endQuiz, 1500);
        } else {
            setTimeout(() => {
                if(flagImg) flagImg.classList.remove("correct-flag", "incorrect-flag");
                loadQuestion();
            }, 1500);
        }
    }

    function filterLibrary(event) {
        const searchTerm = event.target.value.toLowerCase();
        const grid = document.getElementById('library-grid');
        const cards = grid.querySelectorAll('.card'); // Hanya pilih elemen kartu, abaikan header/empty state
        let visibleCount = 0;

        cards.forEach(card => {
            if ((card.dataset.name || '').includes(searchTerm)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // --- EMPTY STATE LOGIC UNTUK SEARCH ---
        let emptyState = document.getElementById('library-empty-state');
        
        if (visibleCount === 0 && cards.length > 0) {
            // Jika tidak ada yang cocok dan grid aslinya punya kartu
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.id = 'library-empty-state';
                emptyState.className = 'col-span-full py-16 text-center text-subtle flex flex-col items-center w-full';
                emptyState.innerHTML = `
                    <i class="fa-solid fa-magnifying-glass text-5xl mb-4 opacity-30"></i>
                    <p class="text-lg font-bold">No flags found</p>
                    <p class="text-sm">Try a different keyword.</p>
                `;
                grid.appendChild(emptyState);
            } else {
                emptyState.style.display = 'flex';
            }
        } else if (emptyState) {
            // Sembunyikan pesan empty state jika ada hasil
            emptyState.style.display = 'none';
        }
    }
    

// --- GEMINI API INTEGRATION ---
async function getFunFact(itemName) {
    if (!itemName) return;
    
    const geminiModal = document.getElementById('gemini-modal');
    const geminiContentEl = document.getElementById('gemini-content');
    const modalTitle = document.getElementById('gemini-modal-title');

    geminiModal.classList.add('active');
    document.body.classList.add('modal-open'); 
    
    geminiContentEl.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-3 py-4 w-full">
        <div class="loader"></div>
        <p class="text-[var(--primary-color)] font-semibold animate-pulse text-sm">Generating Fun Facts...</p>
    </div>
    `;

    const currentLang = settings.language || 'en'; 
    const titleLabel = (translations[currentLang] && translations[currentLang].funFact) 
                       ? translations[currentLang].funFact 
                       : "Fun Fact";

    if (modalTitle) {
        modalTitle.textContent = `${titleLabel}: ${itemName}`;
    }

    // --- 1. LOGIKA DAILY CACHE UNTUK FUN FACT ---
    const cacheKey = `funfact_${currentLang}_${itemName}`;
    const todayStr = new Date().toDateString(); // Contoh: "Tue Mar 03 2026"
    
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
        try {
            const cachedData = JSON.parse(cachedRaw);
            // Cek apakah data di-cache pada hari yang sama
            if (cachedData.date === todayStr) {
                geminiContentEl.textContent = cachedData.fact;
                return; // Langsung pakai data cache, batalkan fetch API
            }
        } catch (e) {
            console.error("Cache parsing error:", e);
        }
    }

    try {
        const response = await fetch('/get-fun-facts', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                countryName: itemName,
                language: currentLang 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error');
        }

        const data = await response.json();
        geminiContentEl.textContent = data.fact;

        // --- 2. SIMPAN CACHE DENGAN TANGGAL HARI INI ---
        localStorage.setItem(cacheKey, JSON.stringify({
            date: todayStr,
            fact: data.fact
        }));

    } catch (error) {
        console.error("Fetch error:", error);
        const errorText = (translations[currentLang] && translations[currentLang].geminiError)       
                         ? translations[currentLang].geminiError 
                         : (currentLang === 'id' ? "Gagal memuat fakta. Silakan coba lagi." : "Connection error. Please try again.");

        geminiContentEl.innerHTML = '';
        const errorPara = document.createElement('p');
        errorPara.className = 'text-center py-4 text-sm font-medium';
        errorPara.textContent = errorText;
        geminiContentEl.appendChild(errorPara);
    }
}

// --- AI FLAG DETAIL LOGIC (With Daily Caching) ---
async function getFlagDetail(itemName, flagUrl) {
    if (!itemName) return;

    const modal = document.getElementById('detail-modal');
    const titleEl = document.getElementById('detail-modal-title');
    const flagImgEl = document.getElementById('detail-flag-img');
    const loaderEl = document.getElementById('detail-loader');
    const dataContainer = document.getElementById('detail-data');

    // 1. Reset & Persiapan Awal
    const oldError = modal.querySelector('.error-message');
    if (oldError) oldError.remove();

    titleEl.textContent = itemName;
    flagImgEl.src = flagUrl;
    loaderEl.classList.remove('hidden');
    dataContainer.classList.add('hidden');
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    const currentLang = settings.language || 'en';
    const cacheKey = `flag_detail_${currentLang}_${itemName}`;
    const todayStr = new Date().toDateString(); // Tanggal hari ini

    // Fungsi Helper untuk Menampilkan Data ke UI
    const renderData = (data) => {
        loaderEl.classList.add('hidden');
        dataContainer.classList.remove('hidden');
        
        document.getElementById('detail-capital').textContent = data.capital || '-';
        document.getElementById('detail-established').textContent = data.established || '-';
        document.getElementById('detail-population').textContent = data.population || '-';
        document.getElementById('detail-region').textContent = data.region || '-';
        document.getElementById('detail-language').textContent = data.language || '-';
        document.getElementById('detail-vexillology').textContent = data.vexillology || 'No info.';
    };

    // 2. Cek Cache Harian di LocalStorage
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
        try {
            const cachedData = JSON.parse(cachedRaw);
            
            // Cek jika cache menggunakan format baru (memiliki .date) dan di-cache hari ini
            if (cachedData.date === todayStr) {
                setTimeout(() => renderData(cachedData.data), 300);
                return;
            } 
            // LOGIKA BACKWARD COMPATIBILITY:
            // Cek jika cache menggunakan format lama (tanpa .date, sisa dari jam/hari sebelumnya)
            else if (!cachedData.date && typeof cachedData === 'object' && cachedData.capital) {
                setTimeout(() => renderData(cachedData), 300);
                // Ubah format lamanya menjadi format cache harian secara otomatis
                localStorage.setItem(cacheKey, JSON.stringify({
                    date: todayStr,
                    data: cachedData
                }));
                return;
            }
        } catch (e) {
            console.error("Cache parsing error:", e);
        }
    }

    // 3. Panggil API jika tidak ada cache hari ini
    try {
        const response = await fetch('/get-flag-details', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ countryName: itemName, language: currentLang })
        });

        if (!response.ok) throw new Error('API Error');

        const result = await response.json();
        
        // Simpan ke cache harian dengan format baru
        localStorage.setItem(cacheKey, JSON.stringify({
            date: todayStr,
            data: result
        }));
        
        renderData(result);

        } catch (error) {
        console.error("Fetch detail error:", error);
        loaderEl.classList.add('hidden');
        
        // Menggunakan geminiError dari translation, dengan fallback gagal memuat detail
        const errorText = (translations[currentLang] && translations[currentLang].geminiError)       
                         ? translations[currentLang].geminiError 
                         : (currentLang === 'id' ? "Gagal memuat detail. Silakan coba lagi." : "Failed to load details. Please try again.");

        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message text-center py-4 text-sm font-medium';
        errorMsg.textContent = errorText;
        dataContainer.parentNode.insertBefore(errorMsg, dataContainer);
    }    
}

    // Fungsi helper untuk mengisi teks ke dalam HTML
    function populateDetailUI(data) {
        loaderEl.classList.add('hidden');
        dataContainer.classList.remove('hidden');
        
        document.getElementById('detail-capital').textContent = data.capital || 'N/A';
        document.getElementById('detail-established').textContent = data.established || 'N/A';
        document.getElementById('detail-population').textContent = data.population || 'N/A';
        document.getElementById('detail-region').textContent = data.region || 'N/A';
        document.getElementById('detail-language').textContent = data.language || 'N/A';
        document.getElementById('detail-vexillology').textContent = data.vexillology || 'No specific vexillology info provided.';
    }
    
    // --- PERBAIKAN FUNGSI INIT FOTD ---

function initFlagOfTheDay() {
    const allFlags = [
        ...(typeof officialCountries !== 'undefined' ? officialCountries : []),
        ...(typeof subdivisions !== 'undefined' ? subdivisions : []),
        ...(typeof territories !== 'undefined' ? territories : []),
        ...(typeof unofficial !== 'undefined' ? unofficial : []),
        ...(typeof historicalFlags !== 'undefined' ? historicalFlags : []),
        ...(typeof worldOrganizations !== 'undefined' ? worldOrganizations : [])
    ];

    if (allFlags.length === 0) {
        console.error("FOTD: Data bendera tidak ditemukan!");
        return;
    }

    const today = new Date();
    const dateSeed = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();
    
    let hash = 0;
    for (let i = 0; i < dateSeed.length; i++) {
        hash = ((hash << 5) - hash) + dateSeed.charCodeAt(i);
        hash |= 0;
    }
    
    const index = Math.abs(hash) % allFlags.length;
    const dailyFlag = allFlags[index];

    const imgEl = document.getElementById('fotd-img');
    const nameEl = document.getElementById('fotd-name');
    const btnEl = document.getElementById('fotd-fun-fact-btn');
    const containerEl = document.getElementById('fotd-container');

    if (dailyFlag) {
        // UPDATE TEKS (Agar tidak "Loading..." lagi)
        if (nameEl) nameEl.textContent = dailyFlag.name;

        // UPDATE GAMBAR
        if (imgEl) {
            imgEl.style.opacity = '0';
            if (containerEl) containerEl.classList.add('animate-pulse');
            
            // PERBAIKAN: Gunakan .image jika .flag tidak muncul
            // Coba dailyFlag.image atau dailyFlag.flag sesuai isi flagsData.js Anda
            imgEl.src = dailyFlag.image || dailyFlag.flag; 
            
            imgEl.onload = () => {
                imgEl.style.opacity = '1';
                if (containerEl) containerEl.classList.remove('animate-pulse');
            };

            // Tambahkan handling jika gambar gagal muat
            imgEl.onerror = () => {
                console.error("Gagal memuat gambar bendera FOTD");
                if (containerEl) containerEl.classList.remove('animate-pulse');
            };
        }

        // UPDATE TOMBOL
        if (btnEl) {
            btnEl.onclick = (e) => {
                e.preventDefault();
                // Pastikan window.getFunFact sudah didaftarkan
                if (typeof window.getFunFact === 'function') {
                    window.getFunFact(dailyFlag.name);
                } else {
                    console.error("Fungsi getFunFact tidak ditemukan di window.");
                }
            };
        }
    }
}

// WAJIB: Panggil fungsi ini agar jalan saat halaman dibuka!
document.addEventListener('DOMContentLoaded', () => {
    initFlagOfTheDay();
});

        // --- UTILITY FUNCTIONS (PINDAHKAN KE SINI) ---

    function updateQuestionCounter() { 

        const el = document.getElementById('question-counter'); 

        if(el) el.textContent = currentQuiz.totalQuestions !== Infinity ? `${currentQuiz.questionNumber} / ${currentQuiz.totalQuestions}` : `Q: ${currentQuiz.questionNumber}`; 

    }



    function startTimer() { 

        clearInterval(currentQuiz.timerId); 

        const timerEl = document.getElementById('timer'); 

        if (timerEl) {

            timerEl.textContent = currentQuiz.timeLeft; 

            currentQuiz.timerId = setInterval(() => { 

                currentQuiz.timeLeft--; 

                timerEl.textContent = currentQuiz.timeLeft; 

                if (currentQuiz.timeLeft <= 0) endQuiz(); 

            }, 1000); 

        }

    }

        function showFloatingXP(amount, targetElement) {
        const xpPopup = document.createElement('div');
        xpPopup.className = 'xp-floating-text';
        xpPopup.textContent = `+${amount} XP`;
        
        // Ambil posisi tombol yang ditekan agar XP muncul tepat di atasnya
        const rect = targetElement.getBoundingClientRect();
        
        // Set posisi popup di tengah atas tombol
        xpPopup.style.left = `${rect.left + (rect.width / 2)}px`;
        xpPopup.style.top = `${rect.top}px`;
        
        document.body.appendChild(xpPopup);
        
        // Hapus elemen dari DOM setelah animasi selesai (1 detik)
        setTimeout(() => {
            xpPopup.remove();
        }, 1000);
    }   

    // Register Service Worker untuk Caching

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

        navigator.serviceWorker.register('./sw.js')

            .then(reg => console.log('Flag-X: Service Worker Aktif!'))

            .catch(err => console.error('Flag-X: Service Worker Gagal:', err));

    });

}

    

        // --- DAFTARKAN SEMUA KE WINDOW DI SINI (PALING BAWAH) ---

    window.showScreen = showScreen;

    window.startQuiz = startQuiz;

    window.showLibrary = showLibrary;
    
    window.showLeaderboard = function() {
    showScreen('leaderboard-screen');
    if (typeof loadLeaderboard === 'function') loadLeaderboard();
};

    window.getFunFact = getFunFact;
    
    window.getFlagDetail = getFlagDetail;  

    window.toggleTheme = toggleTheme;

    window.handleLogin = handleLogin;

    window.handleLogout = handleLogout;

    // Jalankan initApp HANYA SEKALI di sini

    initApp();
    