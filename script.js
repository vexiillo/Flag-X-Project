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

import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, writeBatch, updateDoc, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



    // --- FIREBASE CONFIGURATION ---

    //  GANTI INI DENGAN CONFIG DARI FIREBASE CONSOLE ANDA

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
        window.scrollTo(0, 0)
         // 3. Trik "Kick" Viewport:
        // Kita paksa browser melakukan render ulang dengan mengubah padding body sedikit
        document.body.style.paddingBottom = '81px'; 
        
        requestAnimationFrame(() => {
            // Setelah frame berikutnya, kembalikan ke normal
            document.body.style.paddingBottom = '80px';
            
            // Opsional: Jika masih bandel, paksa sinkronisasi scroll
            window.dispatchEvent(new Event('resize'));
            });
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
    } else if (screenId === 'quiz-modes-screen' || screenId === 'quiz-screen') {
        document.getElementById('nav-quiz')?.classList.add('active');
    } else if (screenId === 'library-categories-screen' || screenId === 'library-display-screen' || screenId.includes('library-screen')) {
        document.getElementById('nav-library')?.classList.add('active');
    } else if (screenId === 'leaderboard-screen') {
        document.getElementById('nav-leaderboard')?.classList.add('active');
    } else if (screenId === 'history-screen') { // Tambahan
        document.getElementById('nav-history')?.classList.add('active');
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

    

    let currentQuiz = { mode: null, dataset: [], score: 0, questionNumber: 0, totalQuestions: 0, correctAnswer: null, timerId: null, timeLeft: 0, lives: 1, lastMode: null, lastSubMode: null, correctCount: 0, wrongCount: 0, timeoutCount: 0, responseTimes: [], questionStartTime: null };
    let leaderboardCurrentTab = 'alltime';
    let leaderboardAllData = [];
    let pendingDifficulty = null;

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

// --- PERBAIKAN: Logika Tombol Profile + Update Stats ---
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = profilePanel.classList.contains('active');
        closeAllPanels();
        
        if (!isActive) {
            // Ambil data terbaru dari localStorage
            const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
            const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
            const level = calculateLevel(xp); // Menggunakan fungsi yang sudah ada
            
            // Render ke elemen stat panel
            const levelStat = document.getElementById('profile-level-stat');
const xpStat = document.getElementById('profile-xp-stat');
const streakStat = document.getElementById('profile-streak-stat');

if (levelStat) levelStat.textContent = `Lv. ${level}`;
if (xpStat) xpStat.textContent = xp.toLocaleString();

if (streakStat) {
    streakStat.textContent = streak;
    const fireIcon = streakStat.previousElementSibling; // Mengambil icon api (<i>) tepat sebelum span angka
    
    if (streak < 1) {
        // 1. Tampilan abu-abu pasif jika Streak = 0
        streakStat.className = "font-black text-gray-400 text-sm";
        if (fireIcon) {
            fireIcon.className = "fa-solid fa-fire text-gray-400 text-xs"; // Menghapus efek pulse & warna orange
        }
    } else {
        // 2. Kembalikan ke tampilan api menyala aktif jika Streak >= 1
        streakStat.className = "font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-sm drop-shadow-md";
        if (fireIcon) {
            fireIcon.className = "fa-solid fa-fire text-orange-500 text-xs animate-pulse drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]";
        }
    }
}
            // Buka panel setelah data siap
            profilePanel.classList.add('active');
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

            quizModesTitle: "Quiz Modes", backToMenu: "Back to Menu", continentClashTitle: "Choose a Continent", backToQuizModes: "Back to Quiz Modes", backToBookmarks: "Back to Bookmark",

            quizScore: "XP", quizEnd: "End Quiz", resultsTitle: "Quiz Over!", resultsFinalScore: "XP Results:", resultsPlayAgain: "Play Again",

            libraryTitle: "Flag Library", continentLibraryTitle: "Choose a Continent", backToLibrary: "Back to Library", backButton: "Back",

            endQuizModalTitle: "End Quiz?", endQuizModalText: "Are you sure you want to end the current quiz? Your XP will be finalized.",

            endQuizModalYes: "Yes, End", endQuizModalCancel: "Cancel", footer: "Flag-X  2025. All Rights Reserved.",

            settingsLanguage: "Language", settingsDifficulty: "Difficulty (Options)", difficultyEasy: "Easy", difficultyNormal: "Normal", difficultyHard: "Hard", settingsContact: "Contact",

            quizPromptFlag: "Which flag is this?", quizPromptGuessCapital: "What is the capital of {countryName}?", quizPromptYear: "Which year is this flag from?",

            resultsMessage: "You gained {score} XP!",
 
timeAttackResultMessage: "You answered {questions} questions and gained {score} XP!",

            survivalResultMessage: "You survived {questions} questions and gained {score} XP!", 

            comboResultMessage: "You survived the Combo Challenge for {questions} questions and gained {score} XP!",

            viewDetailBtn: "View Detail", funFact: "Fun Fact", closeBtn: "Close", geminiError: "Sorry, our daily limit has been reached. Please try again tomorrow!", searchPlaceholder: "Search for a flag...",

            mode_classic_title: "Classic Mode", mode_classic_desc: "Guess 20 official country flags. No time limit.",

            mode_continent_title: "Continent Clash", mode_continent_desc: "Focus on flags from a single continent. 20 questions.",

            mode_capital_title: "Capital Guess", mode_capital_desc: "Guess the capital city from the country's flag. 20 questions.",

            mode_year_title: "Year Guess", mode_year_desc: "Guess the year of historical flags. 20 questions.",

            mode_time_title: "Time Attack", mode_time_desc: "Infinite questions in 60 seconds. How many can you get?",

            mode_survival_title: "Survival Mode", mode_survival_desc: "30 questions, one life. Make one mistake and it's over.",

            mode_combo_title: "Combo Challenge", mode_combo_desc: "Mixed questions, 90 seconds, one life. The ultimate test!",

            lib_official_title: "Official Countries", lib_subdivisions_title: "Subdivisions", lib_territories_title: "Territories", 

            lib_unofficial_title: "Unofficial", lib_historical_title: "Historical", lib_organizations_title: "World Organizations", lib_continent_title: "Continent Flags",

            subdivisionSelectionTitle: "Choose a Country", territorySelectionTitle: "Choose a Country", historicalSelectionTitle: "Choose a Country",

            playQuizBtn: "Play Quiz", viewBtn: "View",

            // NEW TRANSLATIONS
            awesomeBtn: "AWESOME!",
            
            reachedInfo: "You've reached",
            
            levelUpInfo: "LEVEL UP!",
            
            vexillologyInfo: "Vexillology Corner",
            
            languageInfo: "Primary Language",
            
            regionInfo: "Region",
            
            populationInfo: "Population",
            
            establishedInfo: "Established",
            
            capitalInfo: "Capital",
            
            versionInfo: "v.2.5 (Beta Version)",
            
            saveBtn: "Save",
            
            cancelBtn: "Cancel",
            
            yourName: "Display Name",
            
            maxLevelInfo: "Max Level: 50",
            
            levelingSystem: "Leveling System",

            loginPrompt: "Login to save your XP to the global leaderboard!",

            loginBtn: "Login with Google",

            logoutBtn: "Logout",

            usernameLabel: "Display Name (Rank)",

            homeLeaderboard: "Leaderboard",

            leaderboardTitle: "Top Players",

            leaderboardUser: "Player",

            leaderboardScore: "XP",

            disclaimerTitle: "Flag Accuracy Note",

    disclaimerText: "At Flag-X, we want to provide the maximum global challenge! Please note that some flag images in the Subdivisions, Territories, and Historical Flags categories may not be current official designs or are reconstructions/fan-made. This is because not all regions or historical periods have standardized official flags.\n\nWhy do we still include them? > Because the more flag variations you encountereven the most unrecognizable onesthe broader your knowledge becomes! Consider this as eye and brain training to recognize unique symbols from all corners of the world and history. Happy learning and playing!",

// Tambahkan di dalam objek 'en', di bawah teks yang sudah ada:
toastNameBlank: "Name cannot be blank!",
toastNameSaved: "Name saved!",
toastSaveFailed: "Failed to save. Try again.",
btnSaving: "Saving...",
maxLevelReached: "MAX LEVEL reached!",
leaderboardError: "Error loading leaderboard.",
leaderboardErrorSub: "Check your internet connection and try again in a moment.",
libNoFlags: "No flags available.",
searchNoFlags: "No flags found.",
searchTryDifferent: "Try a different keyword.",
detailNoInfo: "No specific vexillology info provided.",
toastLoginSuccess: "Login successful!",
toastLoginFailed: "Login failed: ",
switchAccount: "Switch Account",
toastSwitchSuccess: "Successfully switched account!",
toastSwitchFailed: "Failed to switch account: ",
leaderboardGuestCTA: "Login to enter global rankings and compete with others!",
retryBtn: "Try Again",
navHome: "Home",
navPlay: "Play",
navLibrary: "Library",
navLeaderboard: "Rank",
dayStreak: "day streak",
shareScore: "Share Score",
scoredCopied: "Score copied to clipboard!",
missedFlagsTitle: "Flags to Review",
correctAnswer: "Correct:",
wrongAnswer: "Answer:",
correctCapital: "Capital:",
wrongCapital: "Capital:",
bookmarkAdded: "Bookmarked! \u2B50",
bookmarkRemoved: "Bookmark removed",
noBookmarksMsg: "No bookmarks yet! Star flags in the library.",
noBookmarksSub: "Explore the library and click the star icon on any flag to save it here for a quick study session!",
notEnoughBookmarks: "Add at least 4 bookmarked flags to start a quiz.",
lib_bookmarks_title: "My Bookmarks",
startBookmarkQuiz: "Study Quiz",
onboardingWelcomeTitle: "Welcome to Flag-X!",
onboardingWelcomeText: "Test your knowledge of world flags from official countries, subdivisions, historical flags, and more.",
onboardingXpTitle: "Earn XP & Level Up",
onboardingXpText: "Answer correctly to earn XP. Progress through 50 levels and compete on the global leaderboard!",
onboardingStreakTitle: "Build Your Streak",
onboardingStreakText: "Play every day to keep your streak alive, bookmark flags to study, and share your best scores!",
skipBtn: "Skip",
nextBtn: "Next",
letsGoBtn: "LET'S GO!",
settingsTypeName: "Input Mode",
typeNameLabel: "Type the Answer",
typeNamePlaceholder: "Type the answer...",
settingsSound: "Sound",
soundLabel: "Sound Effects",
submitBtn: "Submit",
resCorrect: "Correct",
resWrong: "Wrong",
resAccuracy: "Accuracy",
resTimeout: "Timeout",
resAvgTime: "Avg. Time",
historyTitle: "Quiz History",
homeHistory: "Quiz History",
shareCardTitle: "Share Your Score",
downloadBtn: "Save",
shareBtn: "Share",
closeBtn: "Close",
tabAllTime: "All Time",
tabThisWeek: "This Week",
leaderboardStreak: "Streak",
navHistory: "History",
switchModalTitle: "Switch Quiz Mode?",
switchModalDesc: "Changing the input type mid-game will reset all of your current quiz progress.",
confirmSwitchBtn: "Yes, Reset",
cancelSwitchBtn: "Cancel",
notifModalTitle: "Enable Reminders?",
notifModalDesc: "We'll send you a daily notification so your Streak doesn't break!",
notifLaterBtn: "Maybe Later",
notifAllowBtn: "Allow",
historyEmptyTitle: "No History Yet",
historyEmptyDesc: "Play your first quiz and become a flag master!",
streakLegendary: "Legendary dedication! 🏆",
streakOnFire: "You're on fire! Keep it going!",
streakWeekly: "One week streak! Amazing consistency!",
streakBonusSub: "Applied to all quiz XP while streak lasts",
leaderboardNoData: "No data for this period.",
notifGrantedTitle: "Flag-X Reminder Active!",
notifGrantedBody: "Great! We'll remind you to keep your Streak alive.",
switchDiffModalTitle: "Change Difficulty?",
switchDiffModalDesc: "Changing difficulty mid-quiz will reset all current quiz progress.",
filterModalTitle: "Filter by Mode",
sortModalTitle: "Sort By",
filterAll: "All Modes",
sortNewest: "Newest First",
sortHighest: "Highest XP",
diffDisabledHint: "Difficulty locked while Input Mode is active",
typeNamePlaceholder: "Type country name...",
typeCapitalPlaceholder: "Type the capital city...",
typeSubdivisionPlaceholder: "Type the region/state name...",
typeOrgPlaceholder: "Type the organization name...",
yearInputDisabledHint: "Input Mode unavailable for Year Guess",
inputModeLocked: "Reach Level 10 to unlock Input Mode"
        },

        id: {

            totalScoreLabel: "XP", homeSubtitle: "Uji Pengetahuan Global Anda", homePlayQuiz: "Main Kuis", homeFlagLibrary: "Pustaka Bendera",

            quizModesTitle: "Mode Kuis", backToMenu: "Kembali ke Menu", continentClashTitle: "Pilih Benua", backToQuizModes: "Kembali ke Mode Kuis", backToBookmarks: "Kembali ke Bookmark",

            quizScore: "XP", quizEnd: "Akhiri Kuis", resultsTitle: "Kuis Selesai!", resultsFinalScore: "Hasil XP:", resultsPlayAgain: "Main Lagi",

            libraryTitle: "Pustaka Bendera", continentLibraryTitle: "Pilih Benua", backToLibrary: "Kembali ke Pustaka", backButton: "Kembali",

            endQuizModalTitle: "Akhiri Kuis?", endQuizModalText: "Apakah Anda yakin ingin mengakhiri kuis saat ini? XP Anda akan difinalisasi.",

            endQuizModalYes: "Ya, Akhiri", endQuizModalCancel: "Batal", footer: "Flag-X  2025. Hak Cipta Dilindungi.",

            settingsLanguage: "Bahasa", settingsDifficulty: "Tingkat Kesulitan (Opsi)", difficultyEasy: "Mudah", difficultyNormal: "Normal", difficultyHard: "Sulit", settingsContact: "Kontak",

            quizPromptFlag: "Bendera apakah ini?", quizPromptGuessCapital: "Apakah ibu kota dari {countryName}?", quizPromptYear: "Bendera ini dari tahun berapa?",

            resultsMessage: "Anda mendapatkan {score} XP!",
            
            timeAttackResultMessage: "Anda menjawab {questions} pertanyaan dan mendapat {score} XP!",

            survivalResultMessage: "Anda bertahan {questions} pertanyaan dan mendapat {score} XP!",

            comboResultMessage: "Anda bertahan di Tantangan Kombo selama {questions} pertanyaan dan mendapat {score} XP!",

            viewDetailBtn: "Lihat Detail", funFact: "Fakta Menarik", closeBtn: "Tutup", geminiError: "Maaf, batas harian kami sudah habis. Silakan coba lagi besok!", searchPlaceholder: "Cari bendera...",

            mode_classic_title: "Mode Klasik", mode_classic_desc: "Tebak 20 bendera negara resmi. Tanpa batas waktu.",

            mode_continent_title: "Bentrok Benua", mode_continent_desc: "Fokus pada bendera dari satu benua. 20 pertanyaan.",

            mode_capital_title: "Tebak Ibu Kota", mode_capital_desc: "Tebak ibu kota dari bendera negaranya. 20 pertanyaan.",

            mode_year_title: "Tebak Tahun", mode_year_desc: "Tebak tahun bendera bersejarah. 20 pertanyaan.",

            mode_time_title: "Serangan Waktu", mode_time_desc: "Pertanyaan tak terbatas dalam 60 detik. Berapa banyak yang bisa Anda jawab?",

            mode_survival_title: "Mode Bertahan", mode_survival_desc: "30 pertanyaan, satu nyawa. Satu kesalahan dan permainan berakhir.",

            mode_combo_title: "Tantangan Kombo", mode_combo_desc: "Soal campuran, 90 detik, satu nyawa. Ujian pamungkas!",

            lib_official_title: "Negara Resmi", lib_subdivisions_title: "Subdivisi", lib_territories_title: "Wilayah", 

            lib_unofficial_title: "Tidak Resmi", lib_historical_title: "Bersejarah", lib_organizations_title: "Organisasi Dunia", lib_continent_title: "Bendera Benua",

            subdivisionSelectionTitle: "Pilih Negara", territorySelectionTitle: "Pilih Negara", historicalSelectionTitle: "Pilih Negara",

            playQuizBtn: "Main Kuis", viewBtn: "Lihat",

            // NEW TRANSLATIONS
            awesomeBtn: "LUAR BIASA!",
            
            reachedInfo: "Anda telah mencapai",
            
            levelUpInfo: "NAIK LEVEL!",
            
            vexillologyInfo: "Sudut Vexillologi",
            
            languageInfo: "Bahasa Utama",
            
            regionInfo: "Wilayah",
            
            populationInfo: "Populasi",
            
            establishedInfo: "Didirikan",
            
            capitalInfo: "Ibukota",
            
            versionInfo: "v.2.5 (Versi Beta)",
            
            saveBtn: "Simpan",
            
            cancelBtn: "Batal",
            
            yourName: "Nama Tampilan",
            
            maxLevelInfo: "Level Maks: 50",
            
            levelingSystem: "Sistem Level",

            loginPrompt: "Masuk untuk simpan XP ke papan peringkat global!",

            loginBtn: "Masuk dengan Google",

            logoutBtn: "Keluar",

            usernameLabel: "Nama Tampilan (Peringkat)",

            homeLeaderboard: "Papan Peringkat",

            leaderboardTitle: "Pemain Terbaik",

            leaderboardUser: "Pemain",

            leaderboardScore: "XP",

            disclaimerTitle: "Catatan Akurasi Bendera",

    disclaimerText: "Di Flag-X, kami ingin memberikan tantangan global yang maksimal! Perlu diketahui bahwa beberapa gambar bendera dalam kategori Subdivisions, Territories, dan Historical Flags mungkin bukan merupakan desain resmi saat ini atau bersifat rekonstruksi/fan-made. Hal ini dikarenakan tidak semua wilayah atau periode sejarah memiliki standarisasi bendera resmi.\n\nKenapa tetap kami masukkan? > Karena semakin banyak variasi bendera yang Anda temuibahkan yang paling sulit dikenali sekalipunsemakin luas pengetahuan yang Anda dapatkan! Anggap ini sebagai latihan mata dan otak untuk mengenali simbol-simbol unik dari seluruh penjuru dunia dan sejarah. Selamat belajar dan bermain!",

// Tambahkan di dalam objek 'id', di bawah teks yang sudah ada:
toastNameBlank: "Nama tidak boleh kosong!",
toastNameSaved: "Nama disimpan!",
toastSaveFailed: "Gagal menyimpan. Coba lagi.",
btnSaving: "Menyimpan...",
maxLevelReached: "LEVEL MAKS tercapai!",
leaderboardError: "Gagal memuat papan peringkat.",
leaderboardErrorSub: "Periksa koneksi internet Anda dan coba beberapa saat lagi.",
libNoFlags: "Tidak ada bendera tersedia.",
searchNoFlags: "Bendera tidak ditemukan",
searchTryDifferent: "Coba kata kunci lain.",
detailNoInfo: "Tidak ada info vexillologi spesifik.",
toastLoginSuccess: "Berhasil masuk!",
toastLoginFailed: "Gagal masuk: ",
switchAccount: "Ganti Akun",
toastSwitchSuccess: "Berhasil mengganti akun!",
toastSwitchFailed: "Gagal mengganti akun: ",
leaderboardGuestCTA: "Login untuk masuk ke peringkat global dan bersaing dengan yang lain!",
retryBtn: "Coba Lagi",
navHome: "Beranda",
navPlay: "Main",
navLibrary: "Pustaka",
navLeaderboard: "Peringkat",
dayStreak: "hari berturut",
shareScore: "Bagikan Skor",
scoredCopied: "Skor disalin!",
missedFlagsTitle: "Bendera untuk Ditinjau",
correctAnswer: "Benar:",
wrongAnswer: "Jawaban:",
correctCapital: "Ibu Kota:",
wrongCapital: "Ibu Kota:",
bookmarkAdded: "Ditandai! \u2B50",
bookmarkRemoved: "Tanda dihapus",
noBookmarksMsg: "Belum ada bookmark! Tandai bendera di pustaka.",
noBookmarksSub: "Jelajahi pustaka dan klik ikon bintang pada bendera mana pun untuk menyimpannya di sini agar dapat dipelajari dengan cepat!",
notEnoughBookmarks: "Tambahkan minimal 4 bendera bookmark untuk memulai kuis.",
lib_bookmarks_title: "Bookmark Saya",
startBookmarkQuiz: "Kuis Belajar",
onboardingWelcomeTitle: "Selamat Datang di Flag-X!",
onboardingWelcomeText: "Uji pengetahuan Anda tentang bendera dunia dari negara resmi, subdivisi, bendera bersejarah, dan banyak lagi.",
onboardingXpTitle: "Kumpulkan XP & Naik Level",
onboardingXpText: "Jawab dengan benar untuk mendapatkan XP. Capai 50 level dan bersaing di papan peringkat global!",
onboardingStreakTitle: "Bangun Streak Anda",
onboardingStreakText: "Main setiap hari untuk menjaga streak, bookmark bendera untuk belajar, dan bagikan skor terbaikmu!",
skipBtn: "Lewati",
nextBtn: "Lanjut",
letsGoBtn: "AYO MULAI!",
settingsTypeName: "Mode Input",
typeNameLabel: "Ketik Jawaban",
typeNamePlaceholder: "Ketik nama negara...",
settingsSound: "Suara",
soundLabel: "Efek Suara",
submitBtn: "Kirim",
resCorrect: "Benar",
resWrong: "Salah",
resAccuracy: "Akurasi",
resTimeout: "Habis Waktu",
resAvgTime: "Rata-rata",
historyTitle: "Riwayat Kuis",
homeHistory: "Riwayat Kuis",
shareCardTitle: "Bagikan Skor",
downloadBtn: "Simpan",
shareBtn: "Bagikan",
closeBtn: "Tutup",
tabAllTime: "Sepanjang Masa",
tabThisWeek: "Minggu Ini",
leaderboardStreak: "🔥 Streak",
navHistory: "Riwayat",
switchModalTitle: "Ganti Mode Kuis?",
switchModalDesc: "Mengubah jenis input kuis di tengah permainan akan memuat ulang seluruh progres kuis berjalan Anda.",
confirmSwitchBtn: "Ya, Reset",
cancelSwitchBtn: "Batal",
notifModalTitle: "Aktifkan Pengingat?",
notifModalDesc: "Kami akan mengirimkan notifikasi harian agar Streak kamu tidak hangus dan terus berlanjut!",
notifLaterBtn: "Nanti Saja",
notifAllowBtn: "Izinkan",
historyEmptyTitle: "Belum Ada Riwayat",
historyEmptyDesc: "Mainkan kuis pertamamu dan jadilah master bendera!",
streakLegendary: "Dedikasi luar biasa! 🏆",
streakOnFire: "Kamu luar biasa! Terus pertahankan!",
streakWeekly: "Satu minggu berturut-turut! Konsistensi yang menakjubkan!",
streakBonusSub: "Berlaku untuk semua XP kuis selama streak aktif",
leaderboardNoData: "Tidak ada data untuk periode ini.",
notifGrantedTitle: "Pengingat Flag-X Aktif!",
notifGrantedBody: "Bagus! Kami akan mengingatkanmu mempertahankan Streak.",
switchDiffModalTitle: "Ganti Tingkat Kesulitan?",
switchDiffModalDesc: "Mengubah tingkat kesulitan di tengah kuis akan me-reset progres kuis yang sedang berjalan.",
filterModalTitle: "Filter berdasarkan Mode",
sortModalTitle: "Urutkan",
filterAll: "Semua Mode",
sortNewest: "Terbaru",
sortHighest: "XP Tertinggi",
diffDisabledHint: "Difficulty dikunci saat Mode Input aktif",
typeNamePlaceholder: "Ketik nama negara...",
typeCapitalPlaceholder: "Ketik nama ibu kota...",
typeSubdivisionPlaceholder: "Ketik nama wilayah/negara bagian...",
typeOrgPlaceholder: "Ketik nama organisasi...",
yearInputDisabledHint: "Mode Input tidak tersedia untuk Year Guess",
inputModeLocked: "Raih Level 10 untuk membuka Mode Input",
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

        // Type Name Mode toggle
        const typeNameSettingDiv = document.getElementById('type-name-setting');
        const typeNameTrack = document.getElementById('type-name-toggle-track');
        const typeNameThumb = document.getElementById('type-name-toggle-thumb');
        if (typeNameSettingDiv && typeNameTrack && typeNameThumb) {
            const totalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
            const lvl = calculateLevel(totalXP);
            if (lvl >= 10) {
    typeNameSettingDiv.classList.remove('hidden');
    // Hapus hint locked jika ada
    document.getElementById('input-mode-locked-hint')?.remove();
} else {
    typeNameSettingDiv.classList.remove('hidden'); // tetap tampil
    settings.typeNameMode = false;

    // Disable toggle secara visual
    const toggleLabel = typeNameSettingDiv.querySelector('label[onclick="toggleTypeNameMode()"]');
    if (toggleLabel) {
        toggleLabel.style.opacity = '0.4';
        toggleLabel.style.pointerEvents = 'none';
        toggleLabel.style.cursor = 'not-allowed';
    }

    // Tambahkan hint jika belum ada
    if (!document.getElementById('input-mode-locked-hint')) {
        const hint = document.createElement('p');
        hint.id = 'input-mode-locked-hint';
        hint.className = 'text-xs mt-2';
        hint.style.color = 'var(--subtle-text-color)';
        hint.setAttribute('data-translate-key', 'inputModeLocked');
        hint.textContent = translations[settings.language].inputModeLocked
            || 'Reach Level 10 to unlock Input Mode';
        typeNameSettingDiv.appendChild(hint);
    }
}
            if (settings.typeNameMode) {
    typeNameTrack.classList.add('bg-[var(--primary-color)]');
    typeNameTrack.classList.remove('bg-[var(--secondary-color)]');
    typeNameThumb.style.transform = 'translateX(16px)';
    typeNameThumb.style.backgroundColor = '#ffffff';       // ← tambahkan
} else {
    typeNameTrack.classList.remove('bg-[var(--primary-color)]');
    typeNameTrack.classList.add('bg-[var(--secondary-color)]');
    typeNameThumb.style.transform = 'translateX(0px)';
    typeNameThumb.style.backgroundColor = '';              // ← tambahkan (reset ke CSS)
}            
        }
const soundTrack = document.getElementById('sound-toggle-track');
const soundThumb = document.getElementById('sound-toggle-thumb');
if (soundTrack && soundThumb) {
    const isOn = settings.soundEnabled !== false; // default true jika belum ada
    if (isOn) {
        soundTrack.classList.add('bg-[var(--primary-color)]');
        soundTrack.classList.remove('bg-[var(--secondary-color)]');
        soundThumb.style.transform = 'translateX(16px)';
        soundThumb.style.backgroundColor = '#ffffff'; // <-- INI YANG KURANG
    } else {
        soundTrack.classList.remove('bg-[var(--primary-color)]');
        soundTrack.classList.add('bg-[var(--secondary-color)]');
        soundThumb.style.transform = 'translateX(0)';
        soundThumb.style.backgroundColor = ''; // <-- RESET KE CSS
    }
}
// Tambahkan ini sebagai baris TERAKHIR loadSettings():
updateCustomRadioUI();
// Tambahkan di akhir loadSettings(), setelah updateCustomRadioUI():
_syncDifficultyAvailability();
    }

// ============================================
// FEATURE: TOGGLE TYPE NAME MODE (dengan modal konfirmasi jika sedang kuis)
// ============================================
function toggleTypeNameMode() {
    const quizScreen = document.getElementById('quiz-screen');
    const isQuizActive = quizScreen && quizScreen.classList.contains('active');

    if (isQuizActive) {
        // Jika sedang kuis, tampilkan modal konfirmasi dulu
        const modal = document.getElementById('switch-mode-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    } else {
        // Jika tidak sedang kuis, langsung toggle
        _applyTypeNameModeToggle();
    }
}

function _applyTypeNameModeToggle() {
    const typeNameTrack = document.getElementById('type-name-toggle-track');
    const typeNameThumb = document.getElementById('type-name-toggle-thumb');

    settings.typeNameMode = !settings.typeNameMode;
    localStorage.setItem('flagx-settings', JSON.stringify(settings));

    if (settings.typeNameMode) {
        typeNameTrack.classList.add('bg-[var(--primary-color)]');
        typeNameTrack.classList.remove('bg-[var(--secondary-color)]');
        typeNameThumb.style.transform = 'translateX(16px)';
        typeNameThumb.style.backgroundColor = '#ffffff';
    } else {
        typeNameTrack.classList.remove('bg-[var(--primary-color)]');
        typeNameTrack.classList.add('bg-[var(--secondary-color)]');
        typeNameThumb.style.transform = 'translateX(0px)';
        typeNameThumb.style.backgroundColor = '';
    }

    // ← TAMBAHKAN: Sync difficulty UI
    _syncDifficultyAvailability();
}

// Tambahkan fungsi helper ini di dekat _applyTypeNameModeToggle:
function _syncDifficultyAvailability() {
    const diffRadios = document.querySelectorAll('input[name="difficulty"]');
    const diffCards = document.querySelectorAll('[id^="diff-card-"]');
    const isTypeName = settings.typeNameMode;

    diffRadios.forEach(r => { r.disabled = isTypeName; });
    diffCards.forEach(card => {
        if (isTypeName) {
            card.style.opacity = '0.4';
            card.style.pointerEvents = 'none';
            card.style.cursor = 'not-allowed';
        } else {
            card.style.opacity = '';
            card.style.pointerEvents = '';
            card.style.cursor = '';
        }
    });

    // Tampilkan hint di bawah difficulty
    let hint = document.getElementById('diff-disabled-hint');
    if (isTypeName) {
        if (!hint) {
            hint = document.createElement('p');
            hint.id = 'diff-disabled-hint';
            hint.className = 'text-xs mt-2';
            hint.style.color = 'var(--subtle-text-color)';
            hint.setAttribute('data-translate-key', 'diffDisabledHint');
            hint.textContent = settings.language === 'id' 
                ? 'Difficulty dikunci saat Mode Input aktif' 
                : 'Difficulty locked while Input Mode is active';
            // Sisipkan setelah blok difficulty
            const diffBlock = document.querySelector('#settings-panel .mb-4:nth-child(2)');
            if (diffBlock) diffBlock.appendChild(hint);
        }
    } else {
        if (hint) hint.remove();
    }
}

// ============================================
// HELPER: Sync Input Mode toggle availability based on active quiz mode
// ============================================
function _syncInputModeForMode(mode) {
    const toggleLabel = document.querySelector('label[onclick="toggleTypeNameMode()"]');
    let hint = document.getElementById('year-input-disabled-hint');

    if (mode === 'yearGuess') {
        // Disable toggle secara visual (tanpa ubah settings.typeNameMode)
        if (toggleLabel) {
            toggleLabel.style.opacity = '0.4';
            toggleLabel.style.pointerEvents = 'none';
            toggleLabel.style.cursor = 'not-allowed';
        }
        // Tambahkan hint
        if (!hint) {
            hint = document.createElement('p');
            hint.id = 'year-input-disabled-hint';
            hint.className = 'text-xs mt-2';
            hint.style.color = 'var(--subtle-text-color)';
            hint.setAttribute('data-translate-key', 'yearInputDisabledHint');
            hint.textContent = settings.language === 'id'
                ? 'Mode Input tidak tersedia untuk Year Guess'
                : 'Input Mode unavailable for Year Guess';
            const typeNameBlock = document.getElementById('type-name-setting');
            if (typeNameBlock) typeNameBlock.appendChild(hint);
        }
    } else {
        // Kembalikan ke normal
        if (toggleLabel) {
            toggleLabel.style.opacity = '';
            toggleLabel.style.pointerEvents = '';
            toggleLabel.style.cursor = '';
        }
        if (hint) hint.remove();
    }
}
window.toggleTypeNameMode = toggleTypeNameMode;
window._syncDifficultyAvailability = _syncDifficultyAvailability;
window._syncInputModeForMode = _syncInputModeForMode;

// Event listeners untuk tombol modal switch-mode
const confirmSwitchBtn = document.getElementById('confirm-switch-btn');
const cancelSwitchBtn = document.getElementById('cancel-switch-btn');

if (confirmSwitchBtn) {
    confirmSwitchBtn.addEventListener('click', () => {
        const modal = document.getElementById('switch-mode-modal');
        if (modal) { 
            modal.classList.remove('active'); 
            document.body.classList.remove('modal-open'); 
        }
        closeAllPanels(); // <-- Tambahan: Otomatis menutup panel settings
        _applyTypeNameModeToggle();
        endQuiz();
    });
}

if (cancelSwitchBtn) {
    cancelSwitchBtn.addEventListener('click', () => {
        const modal = document.getElementById('switch-mode-modal');
        if (modal) { 
            modal.classList.remove('active'); 
            document.body.classList.remove('modal-open'); 
        }
    });
}

// Fungsi baru untuk menghitung detail progres level
function updateLevelUI(xp) {
    let level = 1;
    let currentXPInLevel = 0;
    let nextLevelXPThreshold = 500;

    // Logika disesuaikan dengan threshold yang ada di calculateLevel() kamu
    if (xp < 5000) {
        level = Math.floor(xp / 500) + 1;
        currentXPInLevel = xp % 500;
        nextLevelXPThreshold = 500;
    } else if (xp < 20000) {
        level = 10 + Math.floor((xp - 5000) / 1000);
        currentXPInLevel = (xp - 5000) % 1000;
        nextLevelXPThreshold = 1000;
    } else if (xp < 57500) {
        level = 25 + Math.floor((xp - 20000) / 2500);
        currentXPInLevel = (xp - 20000) % 2500;
        nextLevelXPThreshold = 2500;
    } else if (xp < 102500) {
        level = 40 + Math.floor((xp - 57500) / 5000);
        currentXPInLevel = (xp - 57500) % 5000;
        nextLevelXPThreshold = 5000;
    } else {
        level = 50;
        currentXPInLevel = 1; // Max
        nextLevelXPThreshold = 1;
    }

    const percentage = level >= 50 ? 100 : (currentXPInLevel / nextLevelXPThreshold) * 100;

    // Update elemen DOM        
    const progressBar = document.getElementById('level-progress-bar');
    const progressText = document.getElementById('level-progress-text');
    const percentageText = document.getElementById('level-percentage');
    const levelBadge = document.getElementById('level-badge'); // <-- 1. Tambahkan baris ini

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) {
        progressText.textContent = level >= 50 
            ? translations[settings.language].maxLevelReached 
            : `${currentXPInLevel.toLocaleString()} / ${nextLevelXPThreshold.toLocaleString()} XP`;
    }
    if (percentageText) percentageText.textContent = `${Math.floor(percentage)}%`;
    if (levelBadge) levelBadge.textContent = `Lv. ${level}`;

    // Update home screen mini XP bar
    const homeFill = document.getElementById('home-xp-fill');
    const homeLabel = document.getElementById('home-level-label');
    const homeXpLabel = document.getElementById('home-xp-label');
    if (homeFill) homeFill.style.width = `${percentage}%`;
    if (homeLabel) homeLabel.textContent = `Lv. ${level}`;
    if (homeXpLabel) {
        homeXpLabel.textContent = level >= 50
            ? (translations[settings.language] && translations[settings.language].maxLevelReached || 'MAX')
            : `${currentXPInLevel.toLocaleString()} / ${nextLevelXPThreshold.toLocaleString()} XP`;
    }
    }

// Pastikan fungsi ini dipanggil setiap kali skor XP berubah
// Misalnya, panggil di dalam listener onAuthStateChanged setelah mengambil data dari Firestore:
/* const userXP = docSnap.data().totalScore || 0;
   updateLevelUI(userXP); 
*/

    function loadTotalScore() {
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    if (totalscoreValueEl) totalscoreValueEl.textContent = formatXP(xp);
    updateLevelUI(xp);
    updateHomeXPBar();
}

    async function addToTotalScore(scoreFromQuiz) {
    const currentTotal = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const newTotal = currentTotal + scoreFromQuiz;
    localStorage.setItem('flagx-totalscore', newTotal);
    if (totalscoreValueEl) totalscoreValueEl.textContent = formatXP(newTotal);
    updateHomeXPBar();
    updateLevelUI(newTotal); 

    if (auth && auth.currentUser) {
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);

            // Hitung awal minggu ini (Senin)
            const now = new Date();
            const monday = new Date(now);
            monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
            monday.setHours(0, 0, 0, 0);
            const weekStartISO = monday.toISOString();

            // ← FIX: getDoc HARUS dipanggil sebelum userSnap dipakai
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};

            let weeklyScore = userData.weeklyScore || 0;
            // Reset jika sudah masuk minggu baru
            if (!userData.weekStart || userData.weekStart !== weekStartISO) {
                weeklyScore = 0;
            }
            weeklyScore += scoreFromQuiz;

            await setDoc(userRef, { 
                totalScore: newTotal,
                weeklyScore,
                weekStart: weekStartISO,
                lastActive: new Date()
            }, { merge: true });

        } catch (e) {
            console.error("Failed to sync score:", e);
        }
    }
}

    // --- AUTH & DATABASE FUNCTIONS ---

// 1. HandleLogin
const handleLogin = async (e) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Perubahan di sini: Mengganti pesan teknis dengan pesan Login Failed dari terjemahan
    if (!auth) {
        showToast(translations[settings.language].toastLoginFailed);
        return;
    }

    try {
        await signInWithPopup(auth, googleProvider);
        
        // Memanggil toast sukses
        showToast(translations[settings.language].toastLoginSuccess);
        
        const profilePanel = document.getElementById('profile-panel');
        if (profilePanel) profilePanel.classList.remove('active');
        
    } catch (error) {
        console.error("Login Error:", error);
        
        const profilePanel = document.getElementById('profile-panel');
        if (profilePanel) profilePanel.classList.remove('active');

        if (error.code !== 'auth/popup-closed-by-user') {
            // Menggabungkan pesan gagal dengan pesan error teknis di belakangnya
            showToast(translations[settings.language].toastLoginFailed + ": " + error.message);
        }
    }
};

// Fungsi untuk Ganti Akun (Switch Account) Anti-Nyangkut
async function switchAccount() {
    try {
        // 1. Siapkan Google Provider dengan paksaan pilih akun
        // Catatan: KITA TIDAK LAGI memanggil signOut() di sini.
        // Tujuannya agar jika user membatalkan (cancel), akun lamanya tetap aman.
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account' 
        });

        // 2. Tampilkan popup login untuk pilih akun baru
        // Firebase otomatis akan menimpa (overwrite) sesi lama jika login ini berhasil
        await signInWithPopup(auth, provider);

        // 3. Jika berhasil sampai baris ini, berarti user BENAR-BENAR sukses ganti akun
        showToast(translations[settings.language].toastSwitchSuccess);

        // 4. Refresh halaman web agar foto profil, xp, dan level akun baru termuat dengan sempurna
        setTimeout(() => {
            window.location.reload();
        }, 800); 

    } catch (error) {
        console.error("Gagal mengganti akun: ", error);
        
        // Jika error-nya karena user nge-klik 'X' (cancel/tutup popup), 
        // kita tidak perlu melakukan apa-apa. User akan tetap berada di akun lamanya,
        // UI tidak akan berubah menjadi mode logout, dan skor/level tetap aman.
        if (error.code !== 'auth/popup-closed-by-user') {
            showToast(translations[settings.language].toastSwitchFailed + error.message);
        }
    }
}

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

        if (totalscoreValueEl) totalscoreValueEl.textContent = finalScore;
        updateHomeXPBar();
        
        updateLevelUI(finalScore); // Tambahkan baris ini

        // Update Cloud
        const localStreak = parseInt(localStorage.getItem('flagx-streak') || 0);

        await setDoc(userRef, {

            username: username,

            photoURL: user.photoURL,

            totalScore: finalScore,

            email: user.email,

            lastActive: new Date(),

            streak: localStreak

        }, { merge: true });



        return { username };

    };



    // 4. Update Profile UI

    // Ambil elemen UI

const loggedInView = document.getElementById('auth-logged-in'); // Pastikan ID ini ada di HTML bagian profil

const loggedOutView = document.getElementById('auth-logged-out');

const profileImg = document.getElementById('profile-img');

const profileIconDefault = document.getElementById('profile-icon-default');

// --- LOGIKA PENGHITUNG KARAKTER USERNAME ---
const charCountEl = document.getElementById('char-count');

if (usernameInput && charCountEl) {
    const updateCharCount = () => {
        const length = usernameInput.value.length;
        charCountEl.textContent = `${length}/15`;
        if (length >= 15) {
            charCountEl.style.color = 'var(--error-color)';
        } else {
            charCountEl.style.color = 'var(--subtle-text-color)';
        }
    };

    usernameInput.addEventListener('input', updateCharCount);
    usernameInput.addEventListener('focus', updateCharCount);

    updateCharCount();
}

function updateProfileUI(user, customName = null) {
    const loggedOutView = document.getElementById('auth-logged-out');
    const loggedInView  = document.getElementById('auth-logged-in');
    const userPhotoPojok   = document.getElementById('user-photo');
    const userIconDefault  = document.getElementById('user-icon-default');
    const userPhotoPanel   = document.getElementById('user-panel-img');
    const usernameInput    = document.getElementById('username-input');
    const profileNameDisplay = document.getElementById('profile-name');

    if (user) {
        if (loggedOutView) loggedOutView.classList.add('hidden');
        if (loggedInView)  loggedInView.classList.remove('hidden');

        const finalName = customName || user.displayName || 'User';
        if (usernameInput) {
    usernameInput.value = finalName;
    usernameInput.dispatchEvent(new Event('input')); // Memaksa updateCharCount berjalan
}
        if (profileNameDisplay) profileNameDisplay.textContent = finalName;

        if (user.photoURL) {
            if (userPhotoPojok) { userPhotoPojok.src = user.photoURL; userPhotoPojok.classList.remove('hidden'); }
            if (userIconDefault) userIconDefault.classList.add('hidden');
            if (userPhotoPanel)  userPhotoPanel.src = user.photoURL;
        }

        
    } else {
        if (loggedOutView) loggedOutView.classList.remove('hidden');
        if (loggedInView)  loggedInView.classList.add('hidden');
        if (userPhotoPojok) { userPhotoPojok.classList.add('hidden'); userPhotoPojok.src = ''; }
        if (userIconDefault) userIconDefault.classList.remove('hidden');
        if (usernameInput)   usernameInput.value = '';
        if (profileNameDisplay) profileNameDisplay.textContent = 'Guest';
    }
}

// 2. Fungsi onAuthStateChanged (JANGAN DIBUANG, TAPI DIUPDATE)
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
                    
                    const userXP = userData.totalScore || 0;
   updateLevelUI(userXP); 

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
// Tambahkan guard flag di luar fungsi
let isLeaderboardLoading = false; 

const loadLeaderboard = async () => {
    const listContainer = document.getElementById('leaderboard-list');
    
    // Cegah fungsi berjalan dobel jika sedang loading
    if (!listContainer || isLeaderboardLoading) return; 

    isLeaderboardLoading = true;

    // Cek apakah loader sudah ada bawaan dari HTML. 
    // Jika belum ada (misal setelah refresh list), baru kita inject.
    // Ini mencegah animasi loader ter-reset dan patah/glitch.
    if (!listContainer.querySelector('.loader')) {
        listContainer.innerHTML = `
            <div class="p-8 flex flex-col items-center justify-center gap-3 h-full">
                <div class="loader"></div>
                <p class="text-[var(--primary-color)] font-semibold animate-pulse text-sm">
                    Loading Leaderboard...
                </p>
            </div>
        `;
    }

    try {
        // TRICK UX: Berikan jeda waktu agar browser sempat merender animasi
        await new Promise(resolve => setTimeout(resolve, 400));

        // Ambil data dari Firestore
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(50));
        const querySnapshot = await getDocs(q);

        leaderboardAllData = [];
        querySnapshot.forEach((docSnap) => {
            leaderboardAllData.push({ id: docSnap.id, ...docSnap.data() });
        });

        renderLeaderboardRows(leaderboardAllData, leaderboardCurrentTab);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        
        listContainer.innerHTML = `
            <div class="p-10 text-center flex flex-col items-center gap-4 animate-fadeIn">
                <div class="w-16 h-16 bg-[rgba(var(--error-color-rgb),0.1)] rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-triangle-exclamation text-3xl text-[var(--error-color)]"></i>
                </div>
                <div>
                    <p class="text-[var(--error-color)] font-bold text-lg">${translations[settings.language].leaderboardError}</p>
                    <p class="text-[var(--subtle-text-color)] text-sm mt-1">${translations[settings.language].leaderboardErrorSub}</p>
                </div>
                <button id="retry-leaderboard-btn" class="btn btn-secondary px-6 py-2 flex items-center gap-2 border border-[var(--card-border-color)] hover:bg-[var(--secondary-hover-color)] transition-all active:scale-95">
                    <i class="fa-solid fa-rotate-right text-xs"></i>
                    <span>${translations[settings.language].retryBtn}</span>
                </button>
            </div>
        `;

        const retryBtn = document.getElementById('retry-leaderboard-btn');
        if (retryBtn) retryBtn.addEventListener('click', () => { loadLeaderboard(); });
    } finally {
        // Bebaskan kembali pengaman setelah proses selesai
        isLeaderboardLoading = false; 
    }
};

// 1. Letakkan fungsi helper ini di ATAS renderLeaderboardRows agar aman dari Hoisting Error
const formatXP = (xp) => {
    const num = parseInt(xp) || 0;
    if (num >= 1000000) return (Math.floor(num / 100000) / 10) + 'M';
    if (num >= 100000) return (Math.floor(num / 100) / 10) + 'K';
    return num;
};

function renderLeaderboardRows(allData, tab) {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;

    // Apply the base animation class to hide it initially
    listContainer.style.transition = 'none';
    listContainer.classList.remove('active-slide');
    listContainer.classList.add('leaderboard-slide');

    // Filter for This Week: lastActive within last 7 days
    let data = allData;
    if (tab === 'thisweek') {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        const currentWeekStart = monday.toISOString();

        data = allData
            .filter(d => {
                return d.weekStart === currentWeekStart && (d.weeklyScore || 0) > 0;
            })
            .sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
    }
    let html = '';

    // Guest CTA banner
    if (!auth || !auth.currentUser) {
        html += `
            <div class="bg-[var(--secondary-color)] p-4 m-2 rounded-lg border border-[var(--primary-color)] text-center flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.2)] mb-4">
                <p class="text-sm font-semibold text-[var(--text-color)]">${translations[settings.language].leaderboardGuestCTA}</p>
                <button id="leaderboard-login-btn" class="btn btn-primary px-6 py-2 shadow-md flex items-center gap-2">
                    <i class="fa-brands fa-google"></i> <span>${translations[settings.language].loginBtn}</span>
                </button>
            </div>
        `;
    }

    if (data.length === 0) {
        html += `<div class="p-8 text-center text-subtle">${translations[settings.language].leaderboardNoData || 'No data for this period.'}</div>`;
        listContainer.innerHTML = html;
        
        // Trigger animation
        requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        listContainer.classList.add('active-slide');
    });
});
        return;
    }

    const MEDALS = ['🥇', '🥈', '🥉'];
    const formatStreak = (days) => {
        if (days <= 0) return `0d`;
        const years = Math.floor(days / 365);
        if (years >= 2) return `${years}yrs`;
        if (years === 1) return `1yr`;
        return `${days}d`;
    };

    data.forEach((d, i) => {
        const rank = i + 1;
        const isMe = auth && auth.currentUser && auth.currentUser.uid === d.id;
        const userLevel = calculateLevel(d.totalScore || 0);
        const displayName = d.username || 'User' + Math.floor(1000 + Math.random() * 9000);
        
        const streakVal = d.streak || 0;
        const streakDisplay = streakVal > 0 
            ? `<span class="text-orange-500 font-bold text-xs ml-1 drop-shadow-md">🔥${streakVal}</span>` 
            : `<span class="text-gray-500 font-bold text-xs ml-1 opacity-60">🔥0</span>`;

        const rankDisplay = rank <= 3 ? MEDALS[rank - 1] : rank;
        let rankColor = "text-[var(--subtle-text-color)]";
        if (rank === 1) rankColor = "text-yellow-400";
        else if (rank === 2) rankColor = "text-gray-300";
        else if (rank === 3) rankColor = "text-amber-600";

        // 🔥 GOALS 2 & 3: Upgraded Row Styles! 
        // Changed from plain border-b to a floating card style (rounded-xl, drop-shadow, dynamic border)
        const rowClass = `grid grid-cols-12 gap-2 p-3 mb-2.5 items-center bg-[var(--card-bg-color)] border rounded-xl text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:border-[var(--primary-color)] hover:-translate-y-0.5 relative overflow-hidden group ${isMe ? 'border-2 border-[var(--primary-color)] shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.6)] bg-[rgba(var(--primary-color-rgb),0.15)] z-10' : 'border-[var(--card-border-color)]'}`;

        html += `<div class="${rowClass}">
            <div class="col-span-1 font-bold text-center ${rankColor}">${rankDisplay}</div>
            <div class="col-span-4 flex items-center gap-2 pl-1 min-w-0">        
        <img src="${d.photoURL || 'https://ui-avatars.com/api/?name=' + displayName}" class="w-7 h-7 rounded-full border border-[var(--card-border-color)] object-cover flex-shrink-0">
                <span class="font-semibold leading-tight break-words min-w-0 text-left ${isMe ? 'text-[var(--primary-color)]' : ''}">
            ${displayName}
        </span>
            </div>
            
            <div class="col-span-3 flex justify-center items-center min-w-0">
            ${streakVal > 0 
                ? `<div class="flex justify-center items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-[0_2px_8px_rgba(249,115,22,0.4)] border-0 ring-0 max-w-full">
                        <i class="fa-solid fa-fire text-white text-xs animate-pulse drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] flex-shrink-0"></i>
                        <span class="text-white font-black text-xs leading-tight drop-shadow-md min-w-0 break-all text-left">${formatStreak(streakVal)}</span>
                   </div>`
                : `<div class="flex justify-center items-center gap-1 px-2 py-1 bg-gray-500/20 rounded-full border-0 ring-0 max-w-full">
                        <i class="fa-solid fa-fire text-gray-400 text-xs flex-shrink-0"></i>
                        <span class="text-gray-400 font-black text-xs leading-tight min-w-0 break-all text-left">${formatStreak(streakVal)}</span>
                   </div>`
            }
        </div> 

            <div class="col-span-2 flex justify-center items-center">
            <div class="flex justify-center items-center px-2 py-1 bg-[rgba(var(--primary-color-rgb),0.2)] rounded-lg border border-[rgba(var(--primary-color-rgb),0.3)]">
                <span class="text-[var(--primary-color)]  font-black text-xs leading-none">Lv.${userLevel}</span>
            </div>
        </div>
            <div class="col-span-2 text-right font-semibold pr-1 text-sm bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[#a78bfa]">
            ${formatXP(tab === 'thisweek' ? (d.weeklyScore || 0) : (d.totalScore || 0))}
        </div>
        </div>`;
    });
        
    // Wrapped in a padded div to prevent glowing borders from clipping on the scrollbar
    listContainer.innerHTML = `<div class="p-1 pb-4">${html}</div>`;

    // Force browser reflow to trigger the CSS transition
    requestAnimationFrame(() => {
        listContainer.style.transition = '';
        requestAnimationFrame(() => {
            listContainer.classList.add('active-slide');
        });
    });

    if (!auth || !auth.currentUser) {
        const loginBtn = document.getElementById('leaderboard-login-btn');
        if (loginBtn) loginBtn.addEventListener('click', () => { handleLogin(); });
    }
}

function filterLeaderboard(tab) {
    leaderboardCurrentTab = tab;
    const allBtn = document.getElementById('tab-alltime');
    const weekBtn = document.getElementById('tab-thisweek');
    
    if (allBtn && weekBtn) {
        if (tab === 'alltime') {
            allBtn.className = 'btn btn-primary flex-1 py-2 text-sm font-bold';
            weekBtn.className = 'btn btn-secondary flex-1 py-2 text-sm font-bold';
        } else {
            weekBtn.className = 'btn btn-primary flex-1 py-2 text-sm font-bold';
            allBtn.className = 'btn btn-secondary flex-1 py-2 text-sm font-bold';
        }
    }
    
    // Smoothly render the slide animation when switching tabs
    if (leaderboardAllData.length > 0) {
    renderLeaderboardRows(leaderboardAllData, tab);
}
}

    function renderQuizModes() {

        const container = document.querySelector('#quiz-modes-screen .grid');

        container.innerHTML = '';

        const modes = [

            { id: 'classic', icon: 'fa-globe', action: () => startQuiz('classic') },

            { id: 'continent', icon: 'fa-map', action: () => showScreen('continent-clash-screen') },

            { id: 'capital', icon: 'fa-building-columns', action: () => startQuiz('capitalGuess') },

            { id: 'year', icon: 'fa-calendar-days', action: () => startQuiz('yearGuess') },

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
        // Hapus "span: 'md:col-span-2'" dari unofficial agar kembali ke ukuran normal
        { id: 'unofficial', icon: 'fa-gavel', action: () => showLibrary('unofficial'), span: 'md:col-span-2' } 
    ];
    
    // Ubah span bookmarks menjadi col-span-full agar terbentang lebar (full)
    categories.unshift({ id: 'bookmarks', icon: 'fa-bookmark', action: () => showBookmarksLibrary(), span: 'md:col-span-2' });
   
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



    // --- Fungsi Helper untuk Toast (Diletakkan di luar listener) ---
function showToast(message) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    // Paksa browser me-reset state agar animasi ulang bisa jalan jika diklik cepat
    toast.classList.remove('show');
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// --- Username Editing ---
let originalUsername = '';

usernameInput.addEventListener('focus', () => {
    // Hanya simpan originalUsername saat action button masih sembunyi 
    // (mencegah variabel tertimpa jika user klik bolak-balik)
    if (usernameActions.classList.contains('hidden')) {
        originalUsername = usernameInput.value;
    }
    usernameActions.classList.remove('hidden');
    usernameActions.classList.add('flex');
});

cancelUsernameBtn.addEventListener('click', () => {
    usernameInput.value = originalUsername;
    
    // PENTING: Trigger event 'input' secara manual agar character counter (0/15) ikut terupdate!
    usernameInput.dispatchEvent(new Event('input')); 
    
    usernameInput.classList.remove('shake-input'); // Bersihkan error jika ada
    usernameActions.classList.add('hidden');
    usernameActions.classList.remove('flex');
});

saveUsernameBtn.addEventListener('click', async () => {
    const newName = usernameInput.value.trim();

    if (!newName) {
        usernameInput.classList.add('shake-input');
        showToast(translations[settings.language].toastNameBlank);
        setTimeout(() => { usernameInput.classList.remove('shake-input'); }, 400);
        return; 
    }
        
    if (auth.currentUser) {
        try {
            const originalBtnText = saveUsernameBtn.innerText;
            saveUsernameBtn.innerText = translations[settings.language].btnSaving || "Saving...";
            saveUsernameBtn.classList.add('btn-loading');

            // 1. Simpan nama baru ke Firebase
            await setDoc(doc(db, "users", auth.currentUser.uid), { username: newName }, { merge: true });

            // 2. UPDATE DOM SECARA INSTAN DI SINI
            const profileNameDisplay = document.getElementById('profile-name');
            if (profileNameDisplay) {
                profileNameDisplay.textContent = newName; // Teks besar di bawah avatar langsung berubah
            }
            
            // 3. Update variabel originalUsername agar tombol "Cancel" tahu nama terbarunya
            originalUsername = newName; 

            showToast(translations[settings.language].toastNameSaved);
            
            usernameActions.classList.add('hidden');
            usernameActions.classList.remove('flex');
            saveUsernameBtn.innerText = originalBtnText; 
            saveUsernameBtn.classList.remove('btn-loading');

        } catch (e) { 
            console.error(e);
            showToast(translations[settings.language].toastSaveFailed);
            saveUsernameBtn.innerText = translations[settings.language].saveBtn; 
            saveUsernameBtn.classList.remove('btn-loading');
        }
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
        // TAMBAHKAN !e.target.closest('.modal') di sini
        if (!settingsPanel.contains(e.target) && !e.target.closest('#settings-btn') && !e.target.closest('.modal')) {
            settingsPanel.classList.remove('active');
        }
    }
    
    // 3. Logika Profile Panel
    if (profilePanel && profilePanel.classList.contains('active')) {
        // TAMBAHKAN !e.target.closest('.modal') di sini
        if (!profilePanel.contains(e.target) && !e.target.closest('#profile-btn') && !e.target.closest('#login-google-btn') && !e.target.closest('.modal')) { 
            profilePanel.classList.remove('active');
        }
    }
});

    document.querySelectorAll('input[name="language"]').forEach(r => r.addEventListener('change', (e) => {
    settings.language = e.target.value;
    localStorage.setItem('flagx-settings', JSON.stringify(settings));
    setLanguage(settings.language);
    updateCustomRadioUI(); // ← TAMBAHKAN
}));
    
// ============ SESUDAH — GANTI DENGAN INI ============
document.querySelectorAll('input[name="difficulty"]').forEach(r => {
    r.addEventListener('change', (e) => {
        const quizScreen = document.getElementById('quiz-screen');
        const isQuizActive = quizScreen && quizScreen.classList.contains('active');

        if (isQuizActive) {
    pendingDifficulty = parseInt(e.target.value);
    e.target.checked = false;
    const currentRadio = document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`);
    if (currentRadio) currentRadio.checked = true;
    updateCustomRadioUI(); // ← tambahkan ini

    const modal = document.getElementById('switch-difficulty-modal');
    if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
} else {
    settings.difficulty = parseInt(e.target.value);
    localStorage.setItem('flagx-settings', JSON.stringify(settings));
    updateCustomRadioUI(); // ← tambahkan ini
}
    });
});

// Tambahkan event listeners tombol di modal difficulty
document.getElementById('confirm-diff-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('switch-difficulty-modal');
    if (modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
    if (pendingDifficulty !== null) {
        settings.difficulty = pendingDifficulty;
        localStorage.setItem('flagx-settings', JSON.stringify(settings));
        const radio = document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`);
        if (radio) radio.checked = true;
        pendingDifficulty = null;
    }
    closeAllPanels();
    endQuiz();
});

document.getElementById('cancel-diff-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('switch-difficulty-modal');
    if (modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
    pendingDifficulty = null;
});
    
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

// 7. Close Streak Milestone Modal
const closeStreakMilestoneBtn = document.getElementById('close-streak-milestone-btn');
if (closeStreakMilestoneBtn) {
    closeStreakMilestoneBtn.addEventListener('click', () => {
        document.getElementById('streak-milestone-modal').classList.remove('active');
        document.body.classList.remove('modal-open');
    });
}

// 8. Share Card Modal Buttons
const closeShareCardBtn = document.getElementById('close-share-card-btn');
if (closeShareCardBtn) {
    closeShareCardBtn.addEventListener('click', () => {
        document.getElementById('share-card-modal').classList.remove('active');
        document.body.classList.remove('modal-open');
    });
}

const downloadCardBtn = document.getElementById('download-card-btn');
if (downloadCardBtn) {
    downloadCardBtn.addEventListener('click', () => {
        const canvas = document.getElementById('share-canvas');
        if (!canvas) return;
        const a = document.createElement('a');
        a.download = 'flagx-score.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
}

const shareCardBtn = document.getElementById('share-card-btn');
if (shareCardBtn) {
    shareCardBtn.addEventListener('click', () => {
        const canvas = document.getElementById('share-canvas');
        if (!canvas) return;
        canvas.toBlob(async (blob) => {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'flagx-score.png', { type: 'image/png' })] })) {
                const file = new File([blob], 'flagx-score.png', { type: 'image/png' });
                navigator.share({ title: 'Flag-X Score', files: [file] }).catch(() => {});
            } else {
                const score = document.getElementById('final-score')?.textContent || '0';
                const url = window.location.href;
                copyScoreToClipboard(`🏆 I scored ${score} XP on Flag-X! ${url}`);
            }
        });
    });
}

// 9. Type Name Mode input submit
const typeNameSubmitBtn = document.getElementById('type-name-submit');
if (typeNameSubmitBtn) {
    typeNameSubmitBtn.addEventListener('click', () => {
        const input = document.getElementById('type-name-input');
        if (input && input.value.trim()) checkAnswer(input.value.trim());
    });
}
const typeNameInputEl = document.getElementById('type-name-input');
if (typeNameInputEl) {
    typeNameInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = typeNameInputEl.value.trim();
            if (val) checkAnswer(val);
        }
    });
}

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
        lives: (mode === 'survival' || mode === 'combo') ? 1 : 999,
        correctCount: 0,
        wrongCount: 0,
        timeoutCount: 0,
        responseTimes: [],
        questionStartTime: null,
        missedFlags: []
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
// Tambahkan di akhir startQuiz(), sebelum showScreen / loadQuestion:
_syncInputModeForMode(mode); // mode adalah parameter startQuiz
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



        displayStreak();
        updateHomeXPBar();
        setTimeout(initOnboarding, 300);

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
        // Temukan "else if (lastScreen === 'results-screen')" di initApp()
else if (lastScreen === 'results-screen') {
    const savedResult = localStorage.getItem('lastQuizResult');
    if (savedResult) {
        const data = JSON.parse(savedResult);
        const finalScoreEl = document.getElementById('final-score');
if (finalScoreEl) animateCounter(finalScoreEl, data.score || 0);
        document.getElementById('results-message').textContent = data.msg;
        
        // Pulihkan Data Akurasi di UI
        if(document.getElementById('res-correct')) document.getElementById('res-correct').textContent = data.correct || 0;
        if(document.getElementById('res-wrong')) document.getElementById('res-wrong').textContent = data.wrong || 0;
        if(document.getElementById('res-accuracy')) document.getElementById('res-accuracy').textContent = (data.accuracy || 0) + '%';        
        if(document.getElementById('res-avg-time')) document.getElementById('res-avg-time').textContent = data.avgTime || '-';
        
                // Pulihkan Fungsi Tombol "Play Again"
                document.getElementById('play-again-btn').onclick = () => {
    if (data.lastMode === 'bookmarks') {
        startBookmarkQuiz();
    } else {
        startQuiz(data.lastMode, data.lastSubMode);
    }
};
                
                renderMissedFlags(data.missedFlags || []);      

                // --- TAMBAHKAN JUGA DI SINI ---
                const backToMenuBtn = document.getElementById('back-to-menu-btn');
                if (backToMenuBtn) {
                    // FIX: Gunakan 'data.lastMode', bukan 'currentQuiz.lastMode'
                    if (data.lastMode === 'bookmarks') {
                        backToMenuBtn.setAttribute('data-translate-key', 'backToBookmarks');
                        backToMenuBtn.textContent = translations[settings.language].backToBookmarks;
                        backToMenuBtn.onclick = () => showBookmarksLibrary();
                    } else {
                        backToMenuBtn.setAttribute('data-translate-key', 'backToQuizModes');
                        backToMenuBtn.textContent = translations[settings.language].backToQuizModes;
                        backToMenuBtn.onclick = () => showScreen('quiz-modes-screen');
                    }
                }
        
                showScreen('results-screen');
            } else {
                showScreen('quiz-modes-screen');
            }
        }

                // 3. Logika Sedang Quiz (Reset ke Menu karena data soal hilang)
        else if (lastScreen === 'quiz-screen') {
            showScreen('quiz-modes-screen');
        }

        // --- TAMBAHKAN LOGIKA 4 KHUSUS UNTUK HISTORY DI SINI ---
        else if (lastScreen === 'history-screen') {
            // Panggil fungsi render isinya agar data riwayat tidak kosong
            if (typeof showQuizHistory === 'function') {
                showQuizHistory();
            } else if (typeof renderQuizHistory === 'function') {
                renderQuizHistory();
                showScreen('history-screen');
            }
        }

        // 5. Layar Lainnya (Tangkap layar-layar statis lainnya)
        else if (lastScreen && lastScreen !== 'home-screen') {
            showScreen(lastScreen);
        } else {
            showScreen('home-screen');
        }

    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

    function loadQuestion() {
    // Cek apakah kuis selesai
    if (currentQuiz.questionNumber >= currentQuiz.totalQuestions || currentQuiz.dataset.length === 0) { 
        endQuiz(); 
        return; 
    }

    currentQuiz.questionNumber++;
    currentQuiz.questionStartTime = Date.now();
    updateQuestionCounter();

    // Logika Progress Bar
    const progressWrapper = document.getElementById('quiz-progress-wrapper');
    const progressFill = document.getElementById('quiz-progress-fill');
    
    if (progressWrapper && progressFill) {
        if (currentQuiz.totalQuestions === Infinity) {
            progressWrapper.style.display = 'none';
        } else {
            progressWrapper.style.display = 'block';
            const percentage = ((currentQuiz.questionNumber - 1) / currentQuiz.totalQuestions) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    const optionsContainer = document.getElementById('options-container');
    const typeNameContainer = document.getElementById('type-name-input-container');
    const typeNameInput = document.getElementById('type-name-input');
    const typeNameFeedback = document.getElementById('type-name-feedback');
    const flagDisplayQuiz = document.getElementById('flag-display-quiz');
    
    // Handle type-name mode visibility
        // Handle type-name mode visibility
    const isTypeNameMode = settings.typeNameMode 
    && currentQuiz.mode !== 'yearGuess';
    if (isTypeNameMode) {
    optionsContainer.className = 'hidden';
    optionsContainer.innerHTML = '';
    if (typeNameContainer) typeNameContainer.classList.remove('hidden');
    
    const typeNameSubmitBtn = document.getElementById('type-name-submit');
    if (typeNameSubmitBtn) typeNameSubmitBtn.disabled = false;
    
    if (typeNameInput) { 
        typeNameInput.value = ''; 
        typeNameInput.disabled = false;

        // ← TAMBAHKAN: Set placeholder dinamis berdasarkan mode & dataset soal
        const mode = currentQuiz.mode;
        const dataset = currentQuiz.dataset;
        let placeholderKey = 'typeNamePlaceholder'; // default: "Type country name..."

        if (mode === 'capitalGuess') {
            placeholderKey = 'typeCapitalPlaceholder';
        } else if (dataset && dataset.length > 0) {
            // Deteksi kategori dari soal berikutnya (yang akan diambil)
            const nextItem = dataset[0];
            if (nextItem) {
                if (nextItem.country && !nextItem.capital && !nextItem.years) {
                    // Subdivisions atau Territories — punya field 'country'
                    placeholderKey = 'typeSubdivisionPlaceholder';
                } else if (nextItem.acronym || (nextItem.type && nextItem.type === 'organization')) {
                    // World Organizations
                    placeholderKey = 'typeOrgPlaceholder';
                }
            }
        }

        typeNameInput.placeholder = translations[settings.language][placeholderKey] 
            || translations['en'][placeholderKey] 
            || 'Type the answer...';
        typeNameInput.setAttribute('data-translate-key', placeholderKey);

        setTimeout(() => typeNameInput.focus(), 100); 
    }
        if (typeNameFeedback) typeNameFeedback.classList.add('hidden');
    } else {
        optionsContainer.className = `grid gap-4 grid-cols-2 ${settings.difficulty > 4 ? 'lg:grid-cols-3' : ''}`;
        optionsContainer.innerHTML = '';
        if (typeNameContainer) typeNameContainer.classList.add('hidden');
    }

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

    // Jika input mode aktif DAN soalnya adalah 'year' → paksa balik ke pilihan ganda
    if (settings.typeNameMode && randomType === 'year') {
        const optionsContainer = document.getElementById('options-container');
        const typeNameContainer = document.getElementById('type-name-input-container');
        if (optionsContainer) {
            optionsContainer.className = `grid gap-4 grid-cols-2`;
            optionsContainer.innerHTML = '';
            optionsContainer.style.display = '';
        }
        if (typeNameContainer) typeNameContainer.classList.add('hidden');
    }

    // Jika input mode aktif DAN soalnya bukan 'year' → pastikan input container muncul
    // (sudah ditangani oleh loadQuestion, tapi kita pastikan ulang untuk capital di combo)
    if (settings.typeNameMode && randomType === 'capital') {
        const optionsContainer = document.getElementById('options-container');
        const typeNameContainer = document.getElementById('type-name-input-container');
        const typeNameInput = document.getElementById('type-name-input');
        if (optionsContainer) { optionsContainer.className = 'hidden'; optionsContainer.innerHTML = ''; }
        if (typeNameContainer) typeNameContainer.classList.remove('hidden');
        if (typeNameInput) {
            typeNameInput.value = '';
            typeNameInput.disabled = false;
            typeNameInput.placeholder = translations[settings.language].typeCapitalPlaceholder || 'Type the capital city...';
            setTimeout(() => typeNameInput.focus(), 100);
        }
        const typeNameSubmitBtn = document.getElementById('type-name-submit');
        if (typeNameSubmitBtn) typeNameSubmitBtn.disabled = false;
        const typeNameFeedback = document.getElementById('type-name-feedback');
        if (typeNameFeedback) typeNameFeedback.classList.add('hidden');
    }

    switch(randomType) {
        case 'capital':
            generateCapitalQuestion([...capitalGuessData].sort(() => 0.5 - Math.random())[0]);
            break;
        case 'year':
            generateFlagQuestion([...historicalFlags].sort(() => 0.5 - Math.random())[0], true);
            break;
        default:
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
    quizPromptEl.textContent = translations[settings.language].quizPromptGuessCapital
        .replace('{countryName}', currentQuiz.correctAnswer.name);
    
    flagDisplayQuiz.innerHTML = `<img src="${currentQuiz.correctAnswer.flag}" alt="Flag" class="flag-img mx-auto" loading="lazy" />`;

    // ← TAMBAHKAN: jika type-name mode aktif, jangan render tombol opsi
    if (settings.typeNameMode) {
        return;
    }

    let options = [currentQuiz.correctAnswer.capital];
    let capitalSourcePool;
if (currentQuiz.lastMode === 'bookmarks' && currentQuiz.bookmarkedPool) {
    const bkCaps = currentQuiz.bookmarkedPool.filter(c => c.capital && c.capital !== currentQuiz.correctAnswer.capital);
    capitalSourcePool = bkCaps.length >= settings.difficulty - 1 
        ? bkCaps 
        : officialCountries.filter(c => c.capital && c.capital !== currentQuiz.correctAnswer.capital);
} else {
    capitalSourcePool = officialCountries.filter(c => c.capital && c.capital !== currentQuiz.correctAnswer.capital);
}
const distractorCapitals = capitalSourcePool
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
    let globalPool;
if (isYear) {
    globalPool = historicalFlags;
} else if (currentQuiz.lastMode === 'bookmarks' && currentQuiz.bookmarkedPool) {
    globalPool = currentQuiz.bookmarkedPool;
} else if (worldOrganizations.some(o => o.name === targetData.name)) {
    globalPool = worldOrganizations;
} else if (historicalFlags.some(h => h.name === targetData.name)) {
    globalPool = historicalFlags;
} else if (subdivisions.some(s => s.name === targetData.name) || territories.some(t => t.name === targetData.name)) {
    globalPool = [...subdivisions, ...territories];
} else if (unofficial.some(u => u.name === targetData.name)) {
    globalPool = unofficial;
} else {
    globalPool = officialCountries;
}
const distractorPool = globalPool
    .filter(item => item.name !== currentQuiz.correctAnswer.name)
    .sort(() => 0.5 - Math.random());

    while (options.length < settings.difficulty && distractorPool.length > 0) {
        options.push(distractorPool.shift());
    }

    options = options.filter(opt => opt && opt[answerKey]);

    // --- TAMBAHKAN BARIS INI ---
    // Cegah tombol ganda di-render secara internal jika mode Type Name sedang jalan
    if (settings.typeNameMode && !isYear && document.getElementById('quiz-prompt').dataset.translateKey !== 'quizPromptGuessCapital') {
        return; 
    }
    
    options.sort(() => 0.5 - Math.random()).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option[answerKey] || "????";
        button.className = 'option-btn btn w-full btn-secondary py-3 px-4';
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

        // 1. Tambahkan kata 'async' di depan function
async function endQuiz() {
    clearInterval(currentQuiz.timerId);
_syncInputModeForMode(null); // ← Kembalikan toggle ke normal saat kuis selesai
    // Update results breakdown UI
    const correct = currentQuiz.correctCount || 0;
    const wrong = currentQuiz.wrongCount || 0;
    const timeouts = currentQuiz.timeoutCount || 0;
    const totalAttempted = correct + wrong + timeouts;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    const avgTime = currentQuiz.responseTimes && currentQuiz.responseTimes.length > 0
        ? (currentQuiz.responseTimes.reduce((a, b) => a + b, 0) / currentQuiz.responseTimes.length).toFixed(1) + 's'
        : '-';

    const elMap = { 
    'res-correct': correct, 
    'res-wrong': wrong, 
    'res-accuracy': accuracy + '%', 
    'res-avg-time': avgTime 
};
Object.entries(elMap).forEach(([id, val]) => { 
    const el = document.getElementById(id); 
    if (el) el.textContent = val; 
});
   
    // Save to quiz history
    saveQuizToHistory({
    mode: currentQuiz.lastMode || currentQuiz.mode,  // ✅ 'bookmarks', atau mode lain jika tidak ada lastMode
    score: currentQuiz.score,
    correct,
    wrong,
    accuracy,
    avgTime: currentQuiz.responseTimes && currentQuiz.responseTimes.length > 0
        ? parseFloat((currentQuiz.responseTimes.reduce((a, b) => a + b, 0) / currentQuiz.responseTimes.length).toFixed(1))
        : null,
    date: new Date().toISOString()
});

    // 2. Cek Level LAMA
    const oldTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const oldLevel = calculateLevel(oldTotalXP);
    
    // 3. TAMBAHKAN 'await' di sini! 
    // Ini penting agar kode di bawahnya tidak jalan sebelum skor sukses masuk.
    await addToTotalScore(currentQuiz.score);
    
    // 4. Cek Level BARU (Sekarang XP pasti sudah ter-update)
    const newTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const newLevel = calculateLevel(newTotalXP);
        
        // Update UI Score
        const finalScoreEl = document.getElementById('final-score');
if (finalScoreEl) animateCounter(finalScoreEl, currentQuiz.score);
        const resultsMessageEl = document.getElementById('results-message');
        
        // Logika Pesan
        let msgText = "";
const lang = settings.language;
const mode = currentQuiz.lastMode || currentQuiz.mode;

if ((mode === 'survival' || mode === 'combo') && currentQuiz.lives <= 0) {
    const key = mode === 'combo' ? 'comboResultMessage' : 'survivalResultMessage';
    msgText = translations[lang][key]
        .replace('{questions}', currentQuiz.questionNumber - 1)
        .replace('{score}', currentQuiz.score);
} else if (mode === 'timeAttack') {
    msgText = (translations[lang].timeAttackResultMessage || translations[lang].resultsMessage)
        .replace('{questions}', currentQuiz.correctCount || 0)
        .replace('{score}', currentQuiz.score);
} else {
    msgText = translations[lang].resultsMessage.replace('{score}', currentQuiz.score);
}
        resultsMessageEl.textContent = msgText;

        // Temukan bagian ini di dalam endQuiz()
const resultData = {
    score: currentQuiz.score,
    msg: msgText,
    lastMode: currentQuiz.lastMode,       
    lastSubMode: currentQuiz.lastSubMode,
    missedFlags: currentQuiz.missedFlags,
    correct: correct, // <-- Tambahkan baris ini
    wrong: wrong,     // <-- Tambahkan baris ini
    accuracy: accuracy, // <-- Tambahkan baris ini
    avgTime: avgTime    // <-- Tambahkan baris ini
};
localStorage.setItem('lastQuizResult', JSON.stringify(resultData));

        document.getElementById('play-again-btn').onclick = () => {
    if (currentQuiz.lastMode === 'bookmarks') {
        startBookmarkQuiz();
    } else {
        startQuiz(currentQuiz.lastMode, currentQuiz.lastSubMode);
    }
};

        // Set up share button
        const shareBtn = document.getElementById('share-score-btn');
        if (shareBtn) shareBtn.onclick = shareScore;
        
                // --- TAMBAHKAN LOGIKA TOMBOL BACK DINAMIS DI SINI ---
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        if (backToMenuBtn) {
            if (currentQuiz.lastMode === 'bookmarks') {
                // HAPUS removeAttribute, GANTI dengan setAttribute
                backToMenuBtn.setAttribute('data-translate-key', 'backToBookmarks');
                backToMenuBtn.textContent = translations[settings.language].backToBookmarks;
                backToMenuBtn.onclick = () => showBookmarksLibrary();
            } else {
                backToMenuBtn.setAttribute('data-translate-key', 'backToQuizModes');
                backToMenuBtn.textContent = translations[settings.language].backToQuizModes;
                backToMenuBtn.onclick = () => showScreen('quiz-modes-screen');
            }
        }

        // Render missed flags section
        renderMissedFlags(currentQuiz.missedFlags);

        // Update daily streak
        if (currentQuiz.score > 0) updateStreak();
        
        // Pindah ke layar hasil
        showScreen('results-screen');
        
         // 5. LOGIKA MODAL LEVEL UP
    if (newLevel > oldLevel && currentQuiz.score > 0) {
        setTimeout(() => {
            const levelModal = document.getElementById('level-up-modal');
            const display = document.getElementById('new-level-display');
            
            if (display) display.textContent = `Lv. ${newLevel}`;
            
            if (levelModal) {
                // Gunakan 'active' sesuai CSS-mu
                levelModal.classList.add('active'); 
                document.body.classList.add('modal-open');
            }
        }, 600);
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
        grid.innerHTML = `<p class="col-span-full text-center text-subtle">${translations[settings.language].libNoFlags}</p>`;
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
        const bmarkSet = loadBookmarks();
        const isStarred = bmarkSet.has(item.name);
               
card.innerHTML = `
    ${badgeHTML}
    <button class="bookmark-btn absolute top-1 left-1 p-1 z-20 ${isStarred ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}" onclick="event.stopPropagation(); toggleBookmarkUI(this, '${item.name.replace(/'/g, "\\'")}')">
        <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star text-sm"></i>
    </button>    
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
        // Track response time
        if (currentQuiz.questionStartTime) {
            const responseTime = (Date.now() - currentQuiz.questionStartTime) / 1000;
            currentQuiz.responseTimes.push(responseTime);
            currentQuiz.questionStartTime = null;
        }

        Array.from(document.getElementById('options-container').children).forEach(btn => btn.disabled = true); 
        const typeNameSubmit = document.getElementById('type-name-submit');
        const typeNameInput = document.getElementById('type-name-input');
        if (typeNameSubmit) typeNameSubmit.disabled = true;

        const promptKey = document.getElementById('quiz-prompt').dataset.translateKey;
        const isCapitalGuess = promptKey === 'quizPromptGuessCapital';
        const isYearGuess = promptKey === 'quizPromptYear';

        const correctId = isCapitalGuess 
            ? currentQuiz.correctAnswer.capital 
            : (isYearGuess ? currentQuiz.correctAnswer.years : currentQuiz.correctAnswer.name);

        let selectedId;
        if (settings.typeNameMode && !isYearGuess && typeof selectedOption === 'string') {
    selectedId = correctId;
    // Capital Guess: bandingkan dengan nama ibu kota
    const targetText = isCapitalGuess ? currentQuiz.correctAnswer.capital : correctId;
    const isMatch = fuzzyMatch(selectedOption, targetText);
    selectedId = isMatch ? targetText : selectedOption;
} else {
    selectedId = typeof selectedOption === 'object' 
        ? (isYearGuess ? selectedOption.years : selectedOption.name) 
        : selectedOption;
}

        const selectedButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == selectedId); 
        const correctButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == correctId); 
        const flagImg = document.querySelector("#flag-display-quiz img");

        if (selectedId === correctId) { 
            // --- JAWABAN BENAR ---        
            if (settings.soundEnabled !== false) sfxCorrect.play();
            currentQuiz.correctCount++;
            
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
            
            // Apply streak multiplier
            const multiplier = getStreakMultiplier();
            xpReward = Math.round(xpReward * multiplier);
            
            currentQuiz.score += xpReward; 
            document.getElementById('score').textContent = currentQuiz.score; 
            
            // Show feedback for type-name mode
            const typeNameFeedback = document.getElementById('type-name-feedback');
if (settings.typeNameMode && !isYearGuess && typeNameFeedback) {
    const feedbackLabel = isCapitalGuess 
        ? (translations[settings.language].correctCapital || 'Capital:')
        : (translations[settings.language].correctAnswer || 'Correct:');
    typeNameFeedback.innerHTML = `<i class="fa-solid fa-check text-base mr-1"></i> ${feedbackLabel} <span class="ml-1">${correctId}</span>`;
    typeNameFeedback.className = 'mt-2 text-sm font-bold flex items-center justify-center';
    typeNameFeedback.style.color = 'var(--success-color)';
    typeNameFeedback.classList.remove('hidden');
}
            if(selectedButton) {
                selectedButton.classList.add('correct'); 
                showFloatingXP(xpReward, selectedButton);
            }
            if(flagImg) flagImg.classList.add('correct-flag');
                   
    } else { 
        // --- JAWABAN SALAH ---
        if ("vibrate" in navigator) navigator.vibrate(100);
        currentQuiz.wrongCount++;
        
        if (currentQuiz.mode === 'survival' || currentQuiz.mode === 'combo') currentQuiz.lives--;
        if (!currentQuiz.missedFlags) currentQuiz.missedFlags = [];
        if (currentQuiz.correctAnswer && !currentQuiz.missedFlags.some(f => f.name === currentQuiz.correctAnswer.name)) {
            currentQuiz.missedFlags.push(currentQuiz.correctAnswer);
        }

        // Show feedback for type-name mode
        const typeNameFeedback = document.getElementById('type-name-feedback');
if (settings.typeNameMode && !isYearGuess && typeNameFeedback) {
    const wrongLabel = isCapitalGuess
        ? (translations[settings.language].wrongCapital || 'Capital:')
        : (translations[settings.language].wrongAnswer || 'Answer:');
    typeNameFeedback.innerHTML = `<i class="fa-solid fa-xmark text-base mr-1"></i> ${wrongLabel} <span class="ml-1">${correctId}</span>`;
    typeNameFeedback.className = 'mt-2 text-sm font-bold flex items-center justify-center';
    typeNameFeedback.style.color = 'var(--error-color)';
    typeNameFeedback.classList.remove('hidden');
}
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
                    <p class="text-lg font-bold">${translations[settings.language].searchNoFlags}</p>
                    <p class="text-sm">${translations[settings.language].searchTryDifferent}</p>
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
        errorPara.style.color = 'var(--error-color)';       
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
        document.getElementById('detail-vexillology').textContent = data.vexillology || translations[settings.language].detailNoInfo;
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
        
        const errorText = (translations[currentLang] && translations[currentLang].geminiError)       
                         ? translations[currentLang].geminiError 
                         : (currentLang === 'id' ? "Gagal memuat detail. Silakan coba lagi." : "Failed to load details. Please try again.");

        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message text-center py-4 text-sm font-medium';               
        errorMsg.style.color = 'var(--error-color)';        
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
        document.getElementById('detail-vexillology').textContent = data.vexillology || translations[settings.language].detailNoInfo;
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
        console.error("FOTD: Flag data not found!");
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
                console.error("Failed to load FOTD flag image");
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
                    console.error("getFunFact function not found in window.");
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

    

    
// ============================================
// FEATURE: DAILY STREAK
// ============================================
function getStreakMultiplier() {
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    if (streak >= 30) return 2.0;
    if (streak >= 14) return 1.5;
    if (streak >= 7) return 1.25;
    return 1.0;
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem('flagx-last-played');
    let streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    let isNewDay = false;
    if (lastPlayed === today) {
        // Already played today, no change
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastPlayed === yesterday.toDateString()) {
            streak++;
        } else if (!lastPlayed) {
            streak = 1;
        } else {
            streak = 1;
        }
        isNewDay = true;
        localStorage.setItem('flagx-last-played', today);
        localStorage.setItem('flagx-streak', streak);

        // Save streak to Firebase
        if (auth && auth.currentUser && db) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { streak: streak, lastActive: new Date() }, { merge: true }).catch(e => console.error("Streak sync error:", e));
        }

        // Check for milestone celebrations (only on new streak days)
        const milestones = [7, 14, 30];
        if (milestones.includes(streak)) {
            setTimeout(() => showStreakMilestoneModal(streak), 1200);
        }

        // BARU — muncul saat pertama kali main (streak = 1, belum pernah ditanya)
if (streak === 1 && localStorage.getItem('flagx-notif-asked') !== 'true') {
            setTimeout(() => requestNotificationPermission(), 2500); // Muncul sedikit lambat
        }
    }
    displayStreak();
}

function showStreakMilestoneModal(streak) {
    const modal = document.getElementById('streak-milestone-modal');
    const titleEl = document.getElementById('streak-milestone-title');
    const subEl = document.getElementById('streak-milestone-sub');
    const bonusEl = document.getElementById('streak-milestone-bonus');
    const bonusSubEl = document.getElementById('streak-milestone-bonus-sub');
    if (!modal) return;

    let multiplierText = '';
    let subText = '';    
const lang = settings.language;
if (streak >= 30) {
    multiplierText = '+100% XP Bonus!';
    subText = translations[lang].streakLegendary || 'Legendary dedication! 🏆';
} else if (streak >= 14) {
    multiplierText = '+50% XP Bonus!';
    subText = translations[lang].streakOnFire || "You're on fire! Keep it going!";
} else {
    multiplierText = '+25% XP Bonus!';
    subText = translations[lang].streakWeekly || 'One week streak! Amazing consistency!';
}

    if (titleEl) titleEl.textContent = `🔥 ${streak}-Day Streak!`;
    if (subEl) subEl.textContent = subText;
    if (bonusEl) bonusEl.textContent = multiplierText;
    if (bonusSubEl) bonusSubEl.textContent = translations[lang].streakBonusSub || 'Applied to all quiz XP while streak lasts';

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function displayStreak() {
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const el = document.getElementById('streak-display');
    const countEl = document.getElementById('streak-count');
    if (countEl) countEl.textContent = streak;
    if (el) {
        if (streak >= 1) el.classList.remove('hidden');
        else el.classList.add('hidden');
    }
}

// Fungsi untuk membatalkan/reset streak jika tidak login seharian
function checkDailyStreakReset() {
    const lastPlayedStr = localStorage.getItem('flagx-last-played');
    if (!lastPlayedStr) return;

    const lastDate = new Date(lastPlayedStr);
    lastDate.setHours(0,0,0,0);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diffTime = today - lastDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 1) { // Lebih dari 1 hari terlewat
        localStorage.setItem('flagx-streak', '0');
        if (auth && auth.currentUser && db) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { streak: 0 }, { merge: true }).catch(console.error);
        }
    }
}

// Fungsi meminta izin Notifikasi Native Web
function requestNotificationPermission() {
    const notifModal = document.getElementById('notification-modal');
    if (notifModal) notifModal.classList.add('active');

    document.getElementById('accept-notif-btn').onclick = () => {
        if ("Notification" in window) {
            Notification.requestPermission().then(permission => {
                // BARU
                if (permission === "granted") {
                    const lang = settings.language;
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(reg => {
                            reg.showNotification(
                                translations[lang].notifGrantedTitle || "Flag-X Reminder Active!",
                                {
                                    body: translations[lang].notifGrantedBody || "Great! We'll remind you to keep your Streak alive.",
                                    icon: "logo.png"
                                }
                            );
                        });
                    }
                }
                localStorage.setItem('flagx-notif-asked', 'true');
                notifModal.classList.remove('active');
            }); // <-- 1. Diperbaiki: Ditambah ')' untuk menutup .then()
        } // <-- 2. Diperbaiki: Ditambah '}' untuk menutup if ("Notification"...)
    }; // <-- 3. Diperbaiki: Ditambah '};' untuk menutup onclick = () =>

    document.getElementById('decline-notif-btn').onclick = () => {
        localStorage.setItem('flagx-notif-asked', 'true');
        notifModal.classList.remove('active');
    };
}

function updateHomeXPBar() {
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    let level = 1, currentXPInLevel = 0, nextLevelXPThreshold = 500;
    if (xp < 5000) { level = Math.floor(xp / 500) + 1; currentXPInLevel = xp % 500; nextLevelXPThreshold = 500; }
    else if (xp < 20000) { level = 10 + Math.floor((xp - 5000) / 1000); currentXPInLevel = (xp - 5000) % 1000; nextLevelXPThreshold = 1000; }
    else if (xp < 57500) { level = 25 + Math.floor((xp - 20000) / 2500); currentXPInLevel = (xp - 20000) % 2500; nextLevelXPThreshold = 2500; }
    else { level = 40 + Math.floor((xp - 57500) / 5000); currentXPInLevel = (xp - 57500) % 5000; nextLevelXPThreshold = 5000; }
    const pct = Math.min(100, (currentXPInLevel / nextLevelXPThreshold) * 100);
    const lvLabel = document.getElementById('home-level-label');
    const xpLabel = document.getElementById('home-xp-label');
    const fill = document.getElementById('home-xp-fill');
    if (lvLabel) lvLabel.textContent = `Lv. ${level}`;
    if (xpLabel) xpLabel.textContent = `${currentXPInLevel.toLocaleString()} / ${nextLevelXPThreshold.toLocaleString()} XP`;
    if (fill) fill.style.width = `${pct}%`;
}

// ============================================
// FEATURE: FLAG BOOKMARKS
// ============================================
function loadBookmarks() {
    try { return new Set(JSON.parse(localStorage.getItem('flagx-bookmarks') || '[]')); }
    catch(e) { return new Set(); }
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('flagx-bookmarks', JSON.stringify([...bookmarks]));
}

function toggleBookmark(flagName) {
    const b = loadBookmarks();
    if (b.has(flagName)) b.delete(flagName); else b.add(flagName);
    saveBookmarks(b);
    return b.has(flagName);
}

function toggleBookmarkUI(btn, flagName) {
    const bookmarks = loadBookmarks();
    let isStarred = false;

    if (bookmarks.has(flagName)) {
        bookmarks.delete(flagName);
        btn.classList.remove('text-yellow-400');
        btn.classList.add('text-gray-500');
        btn.innerHTML = '<i class="fa-regular fa-star text-sm"></i>';
        
        // TAMBAHKAN INI UNTUK TOAST REMOVE
        showToast(translations[settings.language].bookmarkRemoved || 'Bookmark removed');
    } else {
        bookmarks.add(flagName);
        btn.classList.remove('text-gray-500');
        btn.classList.add('text-yellow-400');
        btn.innerHTML = '<i class="fa-solid fa-star text-sm"></i>';
        
        // TAMBAHKAN INI UNTUK TOAST ADD
        showToast(translations[settings.language].bookmarkAdded || 'Bookmarked! ⭐');
    }
    
    saveBookmarks(bookmarks);
    
    // PAKSA POSISI: Pastikan class 'left-1' tetap ada dan tidak berubah ke 'right-1'
    btn.classList.remove('right-1');
    btn.classList.add('left-1', 'absolute', 'top-1');
}

function showBookmarksLibrary() {
    const b = loadBookmarks();
    const allFlags = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations];
    const data = allFlags.filter(f => b.has(f.name));
    
    const titleEl = document.getElementById('library-title-display');
    if (titleEl) {
        // Tambahkan data-translate-key agar otomatis terganti saat switch bahasa
        titleEl.dataset.translateKey = 'lib_bookmarks_title';
        titleEl.textContent = translations[settings.language].lib_bookmarks_title || 'My Bookmarks';
    }
    
    const backBtn = document.getElementById('back-from-library-btn');
    if (backBtn) backBtn.onclick = () => { localStorage.removeItem('libraryState'); showScreen('library-categories-screen'); };
    
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full';
    
    // PEMBARUAN: Jika kosong, tombol Quiz pindah ke bawah teks dengan jarak jauh (mb-12)
    if (data.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-full text-center py-12 text-subtle flex flex-col items-center justify-center';
        emptyState.innerHTML = `
            <i class="fa-regular fa-star text-5xl mb-4 opacity-40"></i>
            <p class="font-bold text-xl mb-1" data-translate-key="noBookmarksMsg">${translations[settings.language].noBookmarksMsg || "You haven't bookmarked any flags."}</p>
            <p class="text-sm mb-12" data-translate-key="noBookmarksSub">${translations[settings.language].noBookmarksSub || "Explore the library and click the star icon on any flag to save it here for a quick study session!"}</p>
            
            <button onclick="startBookmarkQuiz()" class="btn btn-primary w-[80%] max-w-[300px] py-3 text-white font-bold flex items-center justify-center gap-2 mx-auto shadow-lg">
                <i class="fa-solid fa-graduation-cap"></i> 
                <span data-translate-key="startBookmarkQuiz">${translations[settings.language].startBookmarkQuiz || 'Study Quiz'}</span>
            </button>
        `;
        grid.appendChild(emptyState);
        showScreen('library-display-screen');
        return;
    }

    // Jika ADA data, letakkan tombol Kuis di paling atas
    const studyBtn = document.createElement('div');
    studyBtn.className = 'col-span-full mb-2';
    studyBtn.innerHTML = `<button onclick="startBookmarkQuiz()" class="btn btn-primary w-full py-3 text-white font-bold flex items-center justify-center gap-2"><i class="fa-solid fa-graduation-cap"></i> <span data-translate-key="startBookmarkQuiz">${translations[settings.language].startBookmarkQuiz || 'Study Quiz'}</span></button>`;
    grid.appendChild(studyBtn);

    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
        card.dataset.name = item.name.toLowerCase();
        
        card.innerHTML = `
            <button class="bookmark-btn absolute top-1 left-1 p-1 z-20 text-yellow-400" onclick="event.stopPropagation(); toggleBookmarkUI(this, '${item.name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-star text-sm"></i>
            </button>
            <div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center">
                <img src="${item.flag}" alt="${item.name} flag" class="flag-img w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image';">
            </div>
            
            <div class="flex-grow flex flex-col justify-center py-1 w-full">
                 <div class="flex flex-col w-full px-1">
                    <p class="font-semibold text-[13px] leading-tight break-words line-clamp-2">${item.name}</p>
                 </div>
            </div>

            <div class="flex flex-col gap-1 mt-2 w-full">
                <button class="btn bg-[var(--primary-color)] text-white rounded-md text-[10px] py-1.5 px-2 w-full hover:scale-105 active:scale-95 transition-transform shadow-md flex items-center justify-center" 
                        onclick="getFlagDetail('${item.name.replace(/'/g, "\\'")}', '${item.flag}')">
                    <i class="fa-solid fa-book-open mr-1"></i> 
                    <span data-translate-key="viewDetailBtn">${(translations[settings.language] && translations[settings.language].viewDetailBtn) || 'View Detail'}</span>
                </button>
                <button class="fun-fact-btn btn text-white rounded-md text-[10px] py-1.5 px-2 w-full hover:scale-105 active:scale-95 transition-transform shadow-md flex items-center justify-center" onclick="getFunFact('${item.name.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-wand-magic-sparkles mr-1"></i>
                    <span data-translate-key="funFact">${(translations[settings.language] && translations[settings.language].funFact) || 'Fun Fact'}</span>
                </button>
            </div>`;
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
    
    const searchInput = document.getElementById('library-search-input');
    if (searchInput) searchInput.value = '';
    showScreen('library-display-screen');
}

function startBookmarkQuiz() {
    const b = loadBookmarks();
    if (b.size === 0) { showToast(translations[settings.language].noBookmarksMsg || 'No bookmarks yet!'); return; }
    const allFlags = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations];
    const bookmarkedData = allFlags.filter(f => b.has(f.name));
    if (bookmarkedData.length < 4) { showToast(translations[settings.language].notEnoughBookmarks || 'Add at least 4 bookmarks!'); return; }
    // PERBAIKAN: Masukkan reset variabel akurasi di sini!
    currentQuiz = { 
        ...currentQuiz, 
        mode: 'classic', 
        lastMode: 'bookmarks', 
        lastSubMode: null, 
        score: 0, 
        questionNumber: 0, 
        timeLeft: 0, 
        lives: 999, 
        missedFlags: [], 
        dataset: [...bookmarkedData].sort(() => 0.5 - Math.random()), 
        bookmarkedPool: [...bookmarkedData],
        totalQuestions: Math.min(bookmarkedData.length, 20),
        correctCount: 0,    // <- Reset
        wrongCount: 0,      // <- Reset
        timeoutCount: 0,    // <- Reset
        responseTimes: [],  // <- Reset
        questionStartTime: null // <- Reset
    };
    
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = '0';
    const timerEl = document.getElementById('timer');
    if (timerEl) { timerEl.style.display = 'none'; timerEl.textContent = ''; }
    _syncInputModeForMode('bookmarks'); // null/bookmarks = tidak disable
showScreen('quiz-screen');
    loadQuestion();
}

// ============================================
// FEATURE: SHARE SCORE
// ============================================
function shareScore() {
    // Open canvas share card modal
    generateShareCard();
    const modal = document.getElementById('share-card-modal');
    if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
}

function generateShareCard() {
    const canvas = document.getElementById('share-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 400, H = 480;
    canvas.width = W; canvas.height = H;

    // --- DETEKSI TEMA & WARNA ---
    const isLight = document.documentElement.classList.contains('light');
    const rootStyle = getComputedStyle(document.documentElement);
    const primaryHex = rootStyle.getPropertyValue('--primary-color').trim() || '#7B47F5';
    
    // Warna Dinamis Berdasarkan Tema
    const bgTop = isLight ? '#eef2f9' : '#0f0f23';
    const bgBottom = isLight ? '#ffffff' : '#1a1a3e';
    const textColor = isLight ? '#1f2937' : 'rgba(255,255,255,0.6)';
    const textBold = isLight ? '#000000' : '#ffffff';
    const cardBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)';

    // ... sisa data skor tetap sama ...
    const score = document.getElementById('final-score') ? document.getElementById('final-score').textContent : '0';
    const totalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const lvl = calculateLevel(totalXP);
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const correct = currentQuiz.correctCount || 0;
    const wrong = currentQuiz.wrongCount || 0;
    const total = correct + wrong + (currentQuiz.timeoutCount || 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const mode = currentQuiz.lastMode || 'classic';

    // Background gradient dinamis
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, bgTop);
    bgGrad.addColorStop(1, bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.beginPath(); ctx.arc(350, 80, 120, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${isLight ? '99,102,241' : '123,71,245'}, 0.08)`; ctx.fill();
    ctx.beginPath(); ctx.arc(50, 400, 90, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${isLight ? '99,102,241' : '123,71,245'}, 0.06)`; ctx.fill();

    // Brand header
    ctx.fillStyle = primaryHex; // <-- Menggunakan warna primer dinamis
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLAG-X', W / 2, 54);

    ctx.fillStyle = textColor;
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('Global Flag Quiz', W / 2, 76);

    // Score section
    ctx.fillStyle = textColor;
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('QUIZ SCORE', W / 2, 120);
    
    // Gradient Skor Utama menggunakan Primary Color
    const scoreGrad = ctx.createLinearGradient(0, 130, 0, 190);
    scoreGrad.addColorStop(0, primaryHex); 
    scoreGrad.addColorStop(1, isLight ? '#4338ca' : '#a78bfa');
    ctx.fillStyle = scoreGrad;
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText(score, W / 2, 195);

    // Stats row
    const stats = [
        { label: 'Level', value: `Lv.${lvl}` },
        { label: 'Accuracy', value: accuracy + '%' },
        { label: 'Streak', value: streak > 0 ? `🔥${streak}` : '-' }
    ];
    const colW = W / 3;
    stats.forEach((s, i) => {
        const cx = colW * i + colW / 2;
        ctx.fillStyle = cardBg;
        roundRect(ctx, colW * i + 10, 248, colW - 20, 60, 8, cardBg, null);
        ctx.fillStyle = primaryHex; 
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillText(s.value, cx, 278);
        ctx.fillStyle = textColor;
        ctx.font = '11px Arial, sans-serif';
        ctx.fillText(s.label, cx, 296);
    });

    // Correct/Wrong
    ctx.fillStyle = cardBg;
    roundRect(ctx, 20, 325, W - 40, 50, 8, cardBg, null);
    ctx.fillStyle = '#4ade80'; // Hijau aman di kedua tema
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.fillText(`✓ ${correct}`, W / 4, 355);
    ctx.fillStyle = '#f87171'; // Merah aman di kedua tema
    ctx.fillText(`✗ ${wrong}`, (3 * W) / 4, 355);
    ctx.fillStyle = textColor;
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText('Correct', W / 4, 370);
    ctx.fillText('Wrong', (3 * W) / 4, 370);

    // Footer
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('flag-x-project.pages.dev', W / 2, 430);
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    ctx.fillText(today, W / 2, 448);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function copyScoreToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(translations[settings.language].scoredCopied || 'Copied to clipboard!');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        showToast(translations[settings.language].scoredCopied || 'Copied to clipboard!');
    });
}

// ============================================
// FEATURE: FUZZY MATCHING (Type Name Mode)
// ============================================
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

function fuzzyMatch(input, target) {
    const a = input.trim().toLowerCase();
    const b = target.trim().toLowerCase();
    if (a === b) return true;
    // Allow partial match for long names (parenthetical alternative names)
    const bSimple = b.replace(/\s*\(.*?\)/g, '').trim();
    if (a === bSimple) return true;
    const threshold = b.length <= 5 ? 1 : 2;
    return levenshtein(a, b) <= threshold || levenshtein(a, bSimple) <= threshold;
}

// ============================================
// FEATURE: QUIZ HISTORY LOG (REDESIGN)
// ============================================
function saveQuizToHistory(data) {
    const KEY = 'flagx-quiz-history';
    let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { history = []; }
    history.unshift(data);
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(history));
}

function showQuizHistory() {
    renderQuizHistory();
    showScreen('history-screen');
}

function renderQuizHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    const KEY = 'flagx-quiz-history';
    let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}

    // --- FILTER & SORT ---
    const filterMode = historyActiveFilter || 'all';
const sortMode = historyActiveSort || 'newest';

if (filterMode !== 'all') {
    history = history.filter(h => (h.mode || 'classic') === filterMode);
}
if (sortMode === 'highest') {
    history = [...history].sort((a, b) => (b.score || 0) - (a.score || 0));
}
    // Tampilan Saat Riwayat Kosong (Empty State)
        if (history.length === 0) {
        list.innerHTML = `
            <div class="col-span-full text-center py-12 text-subtle flex flex-col items-center justify-center animate-fadeIn w-full mt-8">
                <i class="fa-solid fa-clock-rotate-left text-5xl mb-4 opacity-40"></i>
                <p class="font-bold text-xl mb-1">${translations[settings.language].historyEmptyTitle || 'No History Yet'}</p>
                <p class="text-sm">${translations[settings.language].historyEmptyDesc || 'Play your first quiz and become a flag master!'}</p>
            </div>`;
        return;
    }


    // Pemetaan Warna & Ikon sesuai Request (Menggunakan Hex murni & sinkron dengan root style)
    const modeInfo = { 
    classic:      { color: '#7B47F5', icon: 'fa-globe' },
    continent:    { color: '#14b8a6', icon: 'fa-map' },
    capitalGuess: { color: '#f59e0b', icon: 'fa-building-columns' },
    yearGuess:    { color: '#f97316', icon: 'fa-calendar-days' },
    timeAttack:   { color: '#3b82f6', icon: 'fa-stopwatch' },
    survival:     { color: '#28a745', icon: 'fa-heart-pulse' },
    combo:        { color: '#dc3545', icon: 'fa-bomb' },
    bookmarks:    { color: '#EC41B1', icon: 'fa-bookmark' } 
};

    list.innerHTML = history.map((h, i) => {
        const dt = new Date(h.date);
        
        // Format Tanggal (Contoh: 22 Mei, 11:34)
        const dateStr = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const timeStr = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        
        // Normalisasi key untuk mendeteksi camelCase maupun lowercase dari data h.mode
        const currentMode = h.mode ? (h.mode.charAt(0).toLowerCase() + h.mode.slice(1)) : 'classic';
        const info = modeInfo[currentMode] || modeInfo[h.mode] || { color: '#7B47F5', icon: 'fa-gamepad' };
        
        // Format Nama Mode (CamelCase to Normal + Spasi jika perlu)
        let modeName = h.mode ? h.mode.replace(/([A-Z])/g, ' $1').trim() : 'Classic';
        modeName = modeName.charAt(0).toUpperCase() + modeName.slice(1);
        
        // Logic Lencana Akurasi (Akurasi >= 90 Bintang Emas, >= 70 Api Orange)
        const acc = parseFloat(h.accuracy) || 0;
        let badge = acc >= 90 ? '<i class="fa-solid fa-star text-yellow-400 text-xs drop-shadow-md"></i>' : 
                    acc >= 70 ? '<i class="fa-solid fa-fire text-orange-500 text-xs drop-shadow-md"></i>' : '';

        return `
        <div class="bg-[var(--card-bg-color)] border border-[var(--card-border-color)] rounded-xl p-4 text-left animate-fadeIn shadow-[0_4px_15px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-[var(--primary-color)] hover:-translate-y-0.5 transition-all duration-300">
            
            <div class="absolute left-0 top-0 bottom-0 w-1.5 opacity-90" style="background-color: ${info.color};"></div>
            
            <div class="pl-2">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <span class="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm" 
                              style="background:${info.color}1a; color:${info.color}; border: 1px solid ${info.color}40;">
                            <i class="fa-solid ${info.icon}"></i> ${modeName}
                        </span>
                        ${badge}
                    </div>
                    <div class="text-right leading-tight">
                        <span class="text-xs font-bold text-[var(--text-color)] block">${dateStr}</span>
                        <span class="text-[10px] text-[var(--subtle-text-color)] font-medium">${timeStr}</span>
                    </div>
                </div>
                
                <div class="flex justify-between items-end mt-2">
                    <div>
                        <p class="text-[9px] text-[var(--subtle-text-color)] font-bold uppercase tracking-wider mb-0.5">Total XP</p>
                        <div class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[#a78bfa]">
                            +${h.score || 0}
                        </div>
                    </div>
                    
                    <div class="flex gap-1.5">
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" 
                             style="background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.2);">
                            <i class="fa-solid fa-check text-[10px] mb-0.5" style="color: #28a745;"></i>
                            <span class="font-bold text-xs" style="color: #28a745;">${h.correct || 0}</span>
                        </div>
                        
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" 
                             style="background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2);">
                            <i class="fa-solid fa-xmark text-[10px] mb-0.5" style="color: #dc3545;"></i>
                            <span class="font-bold text-xs" style="color: #dc3545;">${h.wrong || 0}</span>
                        </div>
                        
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" 
                             style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);">
                            <i class="fa-solid fa-bullseye text-[10px] mb-0.5" style="color: #f59e0b;"></i>
                            <span class="font-bold text-xs" style="color: #f59e0b;">${h.accuracy || 0}%</span>
                        </div>
                        
                        ${h.avgTime ? `
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" 
                             style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);">
                            <i class="fa-solid fa-stopwatch text-[10px] mb-0.5" style="color: #3b82f6;"></i>
                            <span class="font-bold text-xs" style="color: #3b82f6;">${h.avgTime}s</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ============================================
// FEATURE: MISSED FLAGS REVIEW
// ============================================
function renderMissedFlags(missed) {
    const section = document.getElementById('missed-flags-section');
    const grid = document.getElementById('missed-flags-grid');
    const toggleBtn = document.getElementById('toggle-missed-btn');
    const toggleIcon = document.getElementById('missed-toggle-icon');
    const label = document.getElementById('missed-flags-label');
    if (!section || !grid) return;
    if (!missed || missed.length === 0) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    if (label) label.textContent = `${translations[settings.language].missedFlagsTitle || 'Flags to Review'} (${missed.length})`;
    grid.innerHTML = '';
    missed.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
        card.innerHTML = `
            <div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center">
                <img src="${item.flag}" alt="${item.name} flag" class="flag-img w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image';">
            </div>
            <p class="font-semibold text-[12px] leading-tight break-words line-clamp-2 w-full px-1">${item.name}</p>`;
        grid.appendChild(card);
    });
    let isOpen = false;
    toggleBtn.onclick = () => {
        isOpen = !isOpen;
        grid.classList.toggle('hidden', !isOpen);
        if (toggleIcon) toggleIcon.style.transform = isOpen ? 'rotate(180deg)' : '';
    };
}

function animateCounter(element, targetValue, duration = 1200) {
    const startTime = performance.now();
    const startValue = 0;
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(easeOut(progress) * targetValue);
        element.textContent = current;
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = targetValue;
    }
    requestAnimationFrame(update);
}

// ============================================
// HELPER: Update Custom Radio Visual State
// ============================================
function updateCustomRadioUI() {
    // Language
    ['en', 'id'].forEach(val => {
        const card = document.getElementById(`lang-card-${val}`);
        if (card) card.classList.toggle('active', settings.language === val);
    });

    // Difficulty
    [2, 4, 6].forEach(val => {
        const card = document.getElementById(`diff-card-${val}`);
        if (card) card.classList.toggle('active', settings.difficulty === val);
    });
}
window.updateCustomRadioUI = updateCustomRadioUI;

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    localStorage.setItem('flagx-settings', JSON.stringify(settings));
    const track = document.getElementById('sound-toggle-track');
    const thumb = document.getElementById('sound-toggle-thumb');
    if (settings.soundEnabled) {
        track.classList.add('bg-[var(--primary-color)]');
        track.classList.remove('bg-[var(--secondary-color)]');
        thumb.style.transform = 'translateX(16px)';
        thumb.style.backgroundColor = '#ffffff'; // Nyala = Putih
    } else {
        track.classList.remove('bg-[var(--primary-color)]');
        track.classList.add('bg-[var(--secondary-color)]');
        thumb.style.transform = 'translateX(0)';
        thumb.style.backgroundColor = ''; // Mati = Kembali ke CSS (subtle text)
    }
}
window.toggleSound = toggleSound;

// ============================================
// FEATURE: CUSTOM HISTORY FILTER DROPDOWNS
// ============================================
let historyActiveFilter = 'all';
let historyActiveSort = 'newest';

const historyFilterOptions = [
    { value: 'all',         labelKey: 'filterAll',      icon: 'fa-border-all' },
    { value: 'bookmarks',   label: 'Bookmarks',         icon: 'fa-bookmark' },
    { value: 'classic',     label: 'Classic',           icon: 'fa-globe' },    
    { value: 'continent',   label: 'Continent',         icon: 'fa-map' },
    { value: 'capitalGuess',label: 'Capital Guess',     icon: 'fa-building-columns' },
    { value: 'yearGuess',   label: 'Year Guess',        icon: 'fa-calendar-days' },
    { value: 'timeAttack',  label: 'Time Attack',       icon: 'fa-stopwatch' },
    { value: 'survival',    label: 'Survival',          icon: 'fa-heart-pulse' },
    { value: 'combo',       label: 'Combo',             icon: 'fa-bomb' },
];

const historySortOptions = [
    { value: 'newest',  labelKey: 'sortNewest',  icon: 'fa-clock-rotate-left' },
    { value: 'highest', labelKey: 'sortHighest', icon: 'fa-arrow-up-wide-short' },
];

function openHistoryFilterModal(type) {
    const isMode = type === 'mode';
    const modal = document.getElementById(isMode ? 'history-filter-modal' : 'history-sort-modal');
    const container = document.getElementById(isMode ? 'history-filter-options' : 'history-sort-options');
    const options = isMode ? historyFilterOptions : historySortOptions;
    const activeVal = isMode ? historyActiveFilter : historyActiveSort;
    const lang = settings.language;

    if (!modal || !container) return;

    container.innerHTML = options.map(opt => {
        const label = opt.labelKey ? (translations[lang][opt.labelKey] || opt.label || opt.value) : (opt.label || opt.value);
        const isActive = opt.value === activeVal;
        return `
        <button onclick="${isMode ? 'selectHistoryFilter' : 'selectHistorySort'}('${opt.value}')"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                   ${isActive 
                     ? 'bg-[rgba(var(--primary-color-rgb),0.15)] text-[var(--primary-color)] border border-[rgba(var(--primary-color-rgb),0.3)]' 
                     : 'hover:bg-[var(--secondary-color)] text-[var(--text-color)]'}">
            <i class="fa-solid ${opt.icon} w-4 text-center ${isActive ? 'text-[var(--primary-color)]' : 'text-[var(--subtle-text-color)]'}"></i>
            <span class="flex-1">${label}</span>
            ${isActive ? '<i class="fa-solid fa-check text-[var(--primary-color)] text-xs ml-auto"></i>' : ''}
        </button>`;
    }).join('');

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeHistoryFilterModal() {
    document.getElementById('history-filter-modal')?.classList.remove('active');
    document.getElementById('history-sort-modal')?.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function selectHistoryFilter(value) {
    historyActiveFilter = value;
    const lang = settings.language;
    const opt = historyFilterOptions.find(o => o.value === value);
    const label = opt?.labelKey ? (translations[lang][opt.labelKey] || opt.label) : opt?.label;
    const labelEl = document.getElementById('history-filter-label');
    if (labelEl) labelEl.textContent = label || value;
    closeHistoryFilterModal();
    renderQuizHistory();
}

function selectHistorySort(value) {
    historyActiveSort = value;
    const lang = settings.language;
    const opt = historySortOptions.find(o => o.value === value);
    const label = opt?.labelKey ? (translations[lang][opt.labelKey] || opt.label) : opt?.label;
    const labelEl = document.getElementById('history-sort-label');
    if (labelEl) labelEl.textContent = label || value;
    closeHistoryFilterModal();
    renderQuizHistory();
}

window.openHistoryFilterModal = openHistoryFilterModal;
window.closeHistoryFilterModal = closeHistoryFilterModal;
window.selectHistoryFilter = selectHistoryFilter;
window.selectHistorySort = selectHistorySort;

// ============================================
// FEATURE: ONBOARDING
// ============================================
function initOnboarding() {
    if (localStorage.getItem('flagx-onboarded')) return;
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    let currentSlide = 0;
    const slides = modal.querySelectorAll('.onboard-slide');
    const dots = modal.querySelectorAll('.onboard-dot');
        function showSlide(n) {
    slides.forEach((s, i) => s.classList.toggle('active-slide', i === n));
    dots.forEach((d, i) => d.classList.toggle('active-dot', i === n));
    currentSlide = n;
    const nextBtn = document.getElementById('onboard-next-btn');
    if (nextBtn) nextBtn.textContent = n === slides.length - 1
        ? (translations[settings.language].letsGoBtn || "Let's Go!")
        : (translations[settings.language].nextBtn || 'Next');
}

    showSlide(0);
    const nextBtn = document.getElementById('onboard-next-btn');
    const skipBtn = document.getElementById('onboard-skip-btn');
    if (nextBtn) nextBtn.onclick = () => {
        if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        else closeOnboarding();
    };
    if (skipBtn) skipBtn.onclick = closeOnboarding;
}

function closeOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) { modal.classList.remove('active'); document.body.classList.remove('modal-open'); }
    localStorage.setItem('flagx-onboarded', '1');
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
    window.switchAccount = switchAccount;
    window.handleLogout = handleLogout;
    window.toggleBookmarkUI = toggleBookmarkUI;
    window.startBookmarkQuiz = startBookmarkQuiz;
    window.showBookmarksLibrary = showBookmarksLibrary;
    window.shareScore = shareScore;
    window.closeOnboarding = closeOnboarding;
    window.filterLeaderboard = filterLeaderboard;
    window.showQuizHistory = showQuizHistory;
    window.adminResetAllScores = adminResetAllScores;
    window.generateShareCard = generateShareCard;
    window.fuzzyMatch = fuzzyMatch;
    window.getStreakMultiplier = getStreakMultiplier;
    window.showStreakMilestoneModal = showStreakMilestoneModal;
    window.requestNotificationPermission = requestNotificationPermission;    
    window.showToast = showToast;
    window._setDoc = setDoc;
window._doc = doc;
window._db = db;
    
    // ========================================================
// 🛠️ DEVELOPER BACKDOOR: OVERRIDE AUTH & FIREBASE REGISTER
// ========================================================
window.devLogin = async function(namaPalsu = "Sahrul Dev Mobile", skorPalsu = 2500) {
    console.log("🤖 Memulai proses bypass login...");
    
    // 1. Buat data objek user palsu
    const mockUser = {
        uid: "mock_user_" + Math.floor(Math.random() * 8999 + 1000),
        displayName: namaPalsu,
        photoURL: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(namaPalsu)}`
    };

    // 2. JALAN NINJA: Paksa timpa properti read-only auth.currentUser dengan Object.defineProperty
    if (auth) {
        Object.defineProperty(auth, 'currentUser', {
            value: mockUser,
            writable: true,
            configurable: true
        });
        console.log("✅ Properti auth.currentUser berhasil dimanipulasi dengan Mock User!");
    } else {
        console.error("❌ Objek 'auth' Firebase belum terinisialisasi.");
        return;
    }

    try {
        // 3. Langsung daftarkan data skor palsu ini ke Firestore (Koleksi "users")
        const userRef = doc(db, "users", mockUser.uid);
        await setDoc(userRef, {
            username: mockUser.displayName, // Sesuai dengan field database kamu (username)
            photoURL: mockUser.photoURL,
            totalScore: parseInt(skorPalsu),
            lastUpdated: new Date()
        }, { merge: true });

        console.log("🔥 Sukses terdaftar di database Firestore!");
        
        // Tampilkan feedback toast jika fungsinya tersedia
        if (typeof showToast === 'function') {
            showToast("🚀 Debug: Terdaftar di Leaderboard!");
        }

        // 4. Alihkan layar ke leaderboard dan refresh datanya
        showScreen('leaderboard-screen');
        if (typeof loadLeaderboard === 'function') {
            await loadLeaderboard();
        }

    } catch (error) {
        console.error("❌ Gagal mendaftarkan user ke Firestore:", error);
    }
};

// ============================================
// FEATURE: ADMIN RESET ALL SCORES (SAPU JAGAT)
// ============================================
async function adminResetAllScores() {
    // 1. Peringatan pop-up jika belum login
    if (!db || !auth || !auth.currentUser) { 
        alert('⚠️ GAGAL: Kamu harus Login ke dalam game terlebih dahulu untuk mereset database.');
        console.error('Must be logged in to reset scores.'); 
        return; 
    }

    // 2. Konfirmasi Ganda
    if (!confirm('⚠️ SUPER ADMIN: Ini akan mereset XP, Level, Streak, dan Leaderboard (All Time & Weekly) untuk SEMUA USER di Firestore. Lanjutkan?')) {
        return;
    }

    console.log('Memulai proses reset massal...');
    try {
        const q = query(collection(db, "users"));
        const snap = await getDocs(q);
        
        const batches = [];
        let batch = writeBatch(db);
        let count = 0;
        
        // 3. Menyapu Firestore
        snap.forEach((docSnap) => {
            batch.update(doc(db, "users", docSnap.id), { 
                totalScore: 0,
                weeklyScore: 0,
                streak: 0,
                weekStart: null // Reset minggu
            });
            count++;
            if (count % 499 === 0) { 
                batches.push(batch); 
                batch = writeBatch(db); 
            }
        });
        
        batches.push(batch);
        for (const b of batches) await b.commit();
        
        // 4. Bersihkan History Kuis & XP di Local Storage (Perangkat Admin)
        localStorage.removeItem('flagx-totalscore');
        localStorage.removeItem('flagx-streak');
        localStorage.removeItem('flagx-quiz-history');
        localStorage.removeItem('flagx-last-played');
        localStorage.removeItem('lastQuizResult');
        
        console.log(`✅ Reset ${count} users to 0 XP.`);
        alert(`✅ Sukses! ${count} akun user telah di-reset ke nol.\nHalaman akan dimuat ulang.`);
        
        // 5. Muat ulang halaman
        window.location.reload();

    } catch (error) {
        console.error("Gagal melakukan reset:", error);
        alert("Error: Gagal mereset data. Cek tab Console untuk melihat detail.");
    }
}

    // Jalankan initApp HANYA SEKALI di sini

    initApp();
    