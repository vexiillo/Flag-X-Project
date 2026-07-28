// ============================================================================
// 1. IMPORT DATA & FIREBASE
// ============================================================================
import {
    officialCountries,
    subdivisions,
    territories,
    unofficial,
    historicalFlags,
    worldOrganizations,
    continentFlags
} from './flagsData.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, orderBy, limit, getDocs, writeBatch, where, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// ============================================================================
// 2. FIREBASE CONFIGURATION & INITIALIZATION
// ============================================================================
const firebaseConfig = {
    apiKey: "AIzaSyA-f-B0RH9CJDsfxytIIdyBWwAxNJ4vDik",
    authDomain: "flag-x-3439d.firebaseapp.com",
    projectId: "flag-x-3439d",
    storageBucket: "flag-x-3439d.firebasestorage.app",
    messagingSenderId: "576734845240",
    appId: "1:576734845240:web:620dfc7ee7f9e7ad0149cd",
    measurementId: "G-1VKSLQQCPN"
};

let app, auth, db, googleProvider, messaging;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    messaging = getMessaging(app);
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// ============================================================================
// 3. GLOBAL STATE & VARIABLES
// ============================================================================
// Audio
const sfxCorrect = new Audio('./correct.mp3');
sfxCorrect.volume = 1.0;

// Flag Pools
// Item hanya boleh dijadikan SOAL (gambar ditampilkan) kalau field flag terisi.
const hasFlagImage = (item) => !!(item && item.flag && item.flag.trim() !== '');

const beginnerFlagPool = [...officialCountries, ...subdivisions, ...territories, ...unofficial].filter(hasFlagImage);
const masterFlagPool = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations].filter(hasFlagImage);
// Capital Guess: official countries + subdivisions (yang punya capital sendiri)
// Sengaja TIDAK difilter hasFlagImage di sini — pool ini juga sumber distractor teks ibu
// kota di generateCapitalQuestion(). Filter gambar diterapkan saat pemilihan soal saja.
const capitalGuessData = [...officialCountries, ...subdivisions].filter(f => f.capital);
// Sub-tipe "capital" di Combo: pool lebih luas. historicalFlags disiapkan untuk masa depan —
// otomatis aktif begitu field capital ditambahkan di historical.js nanti.
// (Sama seperti capitalGuessData: tidak difilter agar tetap kaya sebagai distractor.)
const comboCapitalPool = [...officialCountries, ...subdivisions, ...territories, ...historicalFlags, ...worldOrganizations, ...unofficial].filter(f => f.capital);
// Pool khusus Time Attack & Survival — wajib punya gambar karena langsung jadi soal
const generalFlagPool = [...officialCountries, ...subdivisions, ...territories, ...worldOrganizations, ...unofficial].filter(hasFlagImage);

// Game State
let currentQuiz = {
    mode: null, dataset: [], score: 0, questionNumber: 0, totalQuestions: 0, 
    correctAnswer: null, timerId: null, timeLeft: 0, lives: 1, lastMode: null, 
    lastSubMode: null, correctCount: 0, wrongCount: 0, timeoutCount: 0, 
    responseTimes: [], questionStartTime: null, missedFlags: []
};

let leaderboardCurrentTab = 'alltime';
let leaderboardSortMode = 'xp';
let leaderboardAllData = [];
let pendingDifficulty = null;
let isLeaderboardLoading = false;
let lbCountdownInterval = null;
let activeLibCard = null;
let _rankFetchToken = 0;

const APP_LOADING_STEPS = ['fonts', 'auth', 'appInit'];
const appLoadingState = {};
function markAppLoadingStep(step) {
    if (appLoadingState[step]) return;
    appLoadingState[step] = true;
    const doneCount = Object.keys(appLoadingState).length;
    const pct = Math.min(100, Math.round((doneCount / APP_LOADING_STEPS.length) * 100));
    const ring = document.getElementById('app-loading-ring');
    const percentText = document.getElementById('app-loading-percent');
    const circumference = 301.6;
    if (ring) ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
    if (percentText) percentText.textContent = pct + '%';
    if (doneCount >= APP_LOADING_STEPS.length) {
        const screen = document.getElementById('app-loading-screen');
        if (screen) {
            setTimeout(() => {
                screen.style.opacity = '0';
                setTimeout(() => screen.remove(), 400);
            }, 250);
        }
    }
}
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => markAppLoadingStep('fonts')).catch(() => markAppLoadingStep('fonts'));
} else {
    markAppLoadingStep('fonts');
}
setTimeout(() => APP_LOADING_STEPS.forEach(markAppLoadingStep), 6000);
let historyActiveFilter = 'all';
let historyActiveSort = 'newest';
const historyFilterOptions = [
    { value: 'all', labelKey: 'filterAll', icon: 'fa-border-all' },
    { value: 'bookmarks', label: 'Bookmarks', icon: 'fa-bookmark' },
    { value: 'daily', labelKey: 'mode_daily_title', icon: 'fa-calendar-check' },    
    { value: 'classic', label: 'Classic', icon: 'fa-globe' },
    { value: 'continent', label: 'Continent', icon: 'fa-map' },
    { value: 'capitalGuess', label: 'Capital Guess', icon: 'fa-building-columns' },
    { value: 'yearGuess', label: 'Year Guess', icon: 'fa-calendar-days' },
    { value: 'timeAttack', label: 'Time Attack', icon: 'fa-stopwatch' },
    { value: 'survival', label: 'Survival', icon: 'fa-heart-pulse' },
    { value: 'combo', label: 'Combo', icon: 'fa-bomb' }
];
const historySortOptions = [
    { value: 'newest', labelKey: 'sortNewest', icon: 'fa-clock-rotate-left' },
    { value: 'highest', labelKey: 'sortHighest', icon: 'fa-arrow-up-wide-short' }
];
let originalUsername = '';

let settings = { language: 'en', difficulty: 4, typeNameMode: false, soundEnabled: true };

// DOM Elements
const totalscoreValueEl = document.getElementById('totalscore-value');
const settingsPanel = document.getElementById('settings-panel');
const endQuizModal = document.getElementById('end-quiz-modal');
const geminiModal = document.getElementById('gemini-modal');
const geminiContentEl = document.getElementById('gemini-content');
const infoBtn = document.getElementById('info-btn');
const disclaimerPanel = document.getElementById('disclaimer-panel');
const profileBtn = document.getElementById('profile-btn');
const profilePanel = document.getElementById('profile-panel');
const usernameInput = document.getElementById('username-input');
const usernameActions = document.getElementById('username-actions');
const saveUsernameBtn = document.getElementById('save-username-btn');
const cancelUsernameBtn = document.getElementById('cancel-username-btn');

// ============================================================================
// 4. TRANSLATIONS DICTIONARY
// ============================================================================
const translations = {
    en: {
        totalScoreLabel: "XP", homeSubtitle: "Test Your Global Knowledge", homePlayQuiz: "Play Quiz", homeFlagLibrary: "Flag Library",
        quizModesTitle: "Quiz Modes", backToMenu: "Back to Menu", continentClashTitle: "Choose a Continent", backToQuizModes: "Back to Quiz Modes", backToBookmarks: "Back to Bookmark",
        quizScore: "XP", quizEnd: "End Quiz", resultsTitle: "Quiz Over!", resultsFinalScore: "XP Results:", resultsPlayAgain: "Play Again",
        libraryTitle: "Flag Library", continentLibraryTitle: "Choose a Continent", backToLibrary: "Back to Library", backButton: "Back",
        endQuizModalTitle: "End Quiz?", endQuizModalText: "Are you sure you want to end the current quiz? Your XP will be finalized.",
        endQuizModalYes: "Yes, End", endQuizModalCancel: "Cancel", footer: "Flag-X © 2025. All Rights Reserved.",
        settingsSectionLabel: "Settings", settingsLanguage: "Language", settingsDifficulty: "Difficulty (Options)", difficultyEasy: "Easy", difficultyNormal: "Normal", difficultyHard: "Hard", settingsContact: "Contact",
        quizPromptFlag: "Which flag is this?", quizPromptGuessCapital: "What is the capital of {countryName}?", quizPromptYear: "Which year is this flag from?",
        resultsMessage: "You gained {score} XP!",
        timeAttackResultMessage: "You answered {questions} questions and gained {score} XP!",
        survivalResultMessage: "You survived {questions} questions and gained {score} XP!", 
        comboResultMessage: "You survived the Combo Challenge for {questions} questions and gained {score} XP!",
        viewDetailBtn: "View Detail", funFact: "Fun Fact", closeBtn: "Close", geminiError: "Sorry, our daily limit has been reached. Please try again tomorrow!",
        searchPlaceholder: "Search for a flag...", searchCountryPlaceholder: "Search for a country...",
        mode_classic_title: "Classic Mode", mode_classic_desc: "Guess 20 official country flags. No time limit.",
        mode_continent_title: "Continent Clash", mode_continent_desc: "Focus on flags from a single continent. 20 questions.",
        mode_capital_title: "Capital Guess", mode_capital_desc: "Guess the capital city based on the flag. 20 questions.",
        mode_year_title: "Year Guess", mode_year_desc: "Guess the year associated with historical flags. 20 questions.",
        mode_time_title: "Time Attack", mode_time_desc: "Answer as many questions as possible in 60 seconds.",
        mode_survival_title: "Survival Mode", mode_survival_desc: "30 questions, one life. One mistake and the game is over.",
        mode_combo_title: "Combo Challenge", mode_combo_desc: "Infinite mixed questions, 90 seconds, one life. The ultimate Flag-X challenge!",
        lib_official_title: "Official Countries", lib_subdivisions_title: "Subdivisions", lib_territories_title: "Territories",
        lib_unofficial_title: "Unofficial", lib_historical_title: "Historical",
        lib_organizations_title: "World Organizations", lib_continent_title: "Continent Flags",
        lib_official_desc: "All internationally recognized sovereign states.",
        lib_subdivisions_desc: "First-level administrative divisions only. Second-level divisions and below are not included.",
        lib_territories_desc: "Dependent territories and overseas possessions.",
        lib_unofficial_desc: "Disputed territories and regions with contested sovereignty.",
        lib_historical_desc: "Flags formerly used by countries or regions that are no longer in official use.",
        lib_organizations_desc: "Flags of international organizations such as the UN, NATO, and the EU.",
        lib_continent_desc: "Official country flags organized by continent and geographic region.",
        subdivisionSelectionTitle: "Choose a Country", territorySelectionTitle: "Choose a Country", historicalSelectionTitle: "Choose a Country",
        playQuizBtn: "Play Quiz", viewBtn: "View", awesomeBtn: "AWESOME!", reachedInfo: "You've reached", levelUpInfo: "LEVEL UP!",
        vexillologyInfo: "Vexillology Corner", languageInfo: "Primary Language", regionInfo: "Region", populationInfo: "Population", establishedInfo: "Established",
        capitalInfo: "Capital", versionInfo: "v.2.5 (Beta Version)", saveBtn: "Save", cancelBtn: "Cancel", yourName: "Display Name", maxLevelInfo: "Max Level: 50",
        levelingSystem: "Leveling System", loginPrompt: "Login to save your XP to the global leaderboard!", loginBtn: "Login with Google", logoutBtn: "Logout",
        usernameLabel: "Display Name (Rank)", homeLeaderboard: "Leaderboard", leaderboardTitle: "Top Players", leaderboardUser: "Player", leaderboardScore: "XP",
        disclaimerTitle: "Flag Accuracy Note",
        disclaimerText: "At Flag-X, our goal is to provide the ultimate global flag challenge! Please note that some flags in the Subdivisions, Territories, and Historical Flags categories are labeled as Unofficial. These flags are not necessarily current official designs, as not every region, territory, or historical period has an officially recognized or well-documented flag.\n\nWhy do we still include them? Because discovering a wider variety of flags—even the rarest or most unfamiliar ones—helps expand your knowledge of world geography, history, and vexillology. Think of it as training your eyes and brain to recognize unique symbols from around the world. Happy learning and have fun!",
        toastNameBlank: "Name cannot be blank! ⚠️", toastNameSaved: "Name saved!", toastSaveFailed: "Failed to save. Try again.", btnSaving: "Saving...",
        maxLevelReached: "MAX LEVEL reached!", leaderboardError: "Error loading leaderboard.", leaderboardErrorSub: "Check your internet connection and try again in a moment.",
        libNoFlags: "No flags available.", searchNoFlags: "No flags found.", searchTryDifferent: "Try a different keyword.", detailNoInfo: "No specific vexillology info provided.", noDesignAvailable: "No design available.",
        unofficialModalTitle: "Unofficial", unofficialModalText: "This flag has no officially recognized legal status. It may be an unofficial flag in real-world use, a proposed design, a hypothetical reconstruction, or a fan-made creation. It is displayed for educational and vexillological purposes only.",
        toastLoginSuccess: "Login successful!", toastLoginFailed: "Login failed: ", switchAccount: "Switch Account", toastSwitchSuccess: "Successfully switched account!",
        toastSwitchFailed: "Failed to switch account: ", leaderboardGuestCTA: "Login to enter global rankings and compete with others!", retryBtn: "Try Again",
        navHome: "Home", navPlay: "Play", navLibrary: "Library", navLeaderboard: "Rank", dayStreak: "day streak", shareScore: "Share Score", scoredCopied: "Score copied to clipboard!",
        missedFlagsTitle: "Flags to Review", missedFlagsShort: "Review", missedFlagsNone: "Perfect run — no mistakes!", correctAnswer: "Correct:", wrongAnswer: "Answer:", correctCapital: "Capital:", wrongCapital: "Capital:",
        bookmarkAdded: "Bookmarked! ⭐", bookmarkRemoved: "Bookmark removed", noBookmarksMsg: "No bookmarks yet! Star flags in the library.",
        noBookmarksSub: "Explore the library and click the star icon on any flag to save it here for a quick study session!", notEnoughBookmarks: "Add at least 4 bookmarked flags to start a quiz.",
        notEnoughBookmarksCapital: "Add at least 4 bookmarked flags that have a capital to start this quiz.",
        bookmarkQuizTypeModalTitle: "Choose Quiz Type", bookmarkQuizFlagDesc: "Guess the name from the flag", bookmarkQuizCapitalDesc: "Guess the capital city",
        lib_bookmarks_title: "My Bookmarks", lib_bookmarks_desc: "Save your favorite flags for quick access and focused study.", startBookmarkQuiz: "Study Quiz",
        startBookmarkQuizCapital: "Capital Quiz", onboardingWelcomeTitle: "Welcome to Flag-X!",
        onboardingWelcomeText: "Test your knowledge of world flags from official countries, subdivisions, historical flags, and more.", onboardingXpTitle: "Earn XP & Level Up",
        onboardingXpText: "Answer correctly to earn XP. Progress through 50 levels and compete on the global leaderboard!", onboardingStreakTitle: "Build Your Streak",
        onboardingStreakText: "Play every day to keep your streak alive, bookmark flags to study, and share your best scores!", skipBtn: "Skip", nextBtn: "Next", letsGoBtn: "LET'S GO!",
        settingsTypeName: "Input Mode", typeNameLabel: "Type the Answer", typeNamePlaceholder: "Type country name...", settingsSound: "Sound", soundLabel: "Sound Effects",
        submitBtn: "Submit", resCorrect: "Correct", resWrong: "Wrong", resAccuracy: "Accuracy", resTimeout: "Timeout", resAvgTime: "Avg. Time", historyTitle: "Quiz History",
        homeHistory: "Quiz History", shareCardTitle: "Share Your Score", downloadBtn: "Save", shareBtn: "Share", tabAllTime: "All Time", tabThisWeek: "This Week", leaderboardWeeklyReset: "WEEKLY RESET", leaderboardResetsIn: "Resets in", leaderboardYou: "You", leaderboardSortXP: "XP", leaderboardSortStreak: "Streak",
        profileTotalQuizzes: "Total Quizzes", profileAccuracy: "Accuracy", profileRank: "Rank", profileLevelLabel: "Level", profileMemberSince: "Member since {date}",
        profileBestStreak: "Best", profileTotalQuizzesDesc: "Quizzes taken",
        profileMotivationNew: "Keep learning!", profileMotivationExcellent: "Excellent! You're a flag master!", profileMotivationGreat: "Great work! Keep it up!", profileMotivationGood: "Good effort! Practice more!", profileMotivationPractice: "Keep practicing!",
        achievementSheetTitle: "Achievements", homeQuickExplore: "Quick Explore",
        leaderboardStreak: "Streak", navHistory: "History", switchModalTitle: "Switch Quiz Mode?", switchModalDesc: "Changing the input type mid-game will reset all of your current quiz progress.",
        confirmSwitchBtn: "Yes, Reset", cancelSwitchBtn: "Cancel", notifModalTitle: "Enable Reminders?", notifModalDesc: "We'll send you a daily notification so your Streak doesn't break!",
        notifLaterBtn: "Maybe Later", notifAllowBtn: "Allow", historyEmptyTitle: "No History Yet", historyEmptyDesc: "Play your first quiz and become a flag master!",
        streakLegendary: "Legendary dedication! 🏆", streakOnFire: "You're on fire! Keep it going!", streakWeekly: "One week streak! Amazing consistency!", streakBonusSub: "Applied to all quiz XP while streak lasts",
        leaderboardNoData: "No data for this period.", leaderboardNoDataSub: "Be the first to claim the top spot on the leaderboard!", notifGrantedTitle: "Flag-X Reminder Active!",
        notifGrantedBody: "Great! We'll remind you to keep your Streak alive.", notifNotSupported: "Notifications are not supported on this browser.",
        notifAlreadyActive: "🔔 Streak reminders are already active!", notifBlocked: "Notifications are blocked. Enable them in your browser settings.",
        switchDiffModalTitle: "Change Difficulty?", switchDiffModalDesc: "Changing difficulty mid-quiz will reset all current quiz progress.",
        filterModalTitle: "Filter by Mode", sortModalTitle: "Sort By", filterAll: "All Modes", sortNewest: "Newest First", sortHighest: "Highest XP",
        deleteModalTitle: "Delete History", delete24h: "Last 24 Hours", delete7d: "Last 7 Days", delete30d: "Last 30 Days", deleteAll: "All History",
        deleteConfirmTitle: "Delete History?", confirmDeleteBtn: "Yes, Delete", historyDeleted: "History deleted!",
        deleteConfirm24h: "This will permanently delete all quiz history from the last 24 hours. This cannot be undone.",
        deleteConfirm7d: "This will permanently delete all quiz history from the last 7 days. This cannot be undone.",
        deleteConfirm30d: "This will permanently delete all quiz history from the last 30 days. This cannot be undone.",
        deleteConfirmAll: "This will permanently delete ALL of your quiz history. This cannot be undone.",
        diffDisabledHint: "Difficulty locked while Input Mode is active", typeCapitalPlaceholder: "Type the capital city...", typeSubdivisionPlaceholder: "Type the region name...",
        typeOrgPlaceholder: "Type the organization name...", yearInputDisabledHint: "Input Mode unavailable for Year Guess", inputModeLocked: "Reach Level 10 to unlock Input Mode",
        usernamePlaceholder: "Your name...", guestName: "Guest Explorer", flagOfTheDay: "Flag of the Day", loadingLeaderboard: "Loading Leaderboard...", generatingFunFact: "Generating Fun Facts...",
        mode_daily_title: "Daily Challenge", mode_daily_desc: "10 same questions for everyone today. Can you beat your friends?",
        dailyCompleted: "✅ Already completed today! Come back tomorrow.", dailyCompletedTitle: "See You Tomorrow!",
        feedbackModalTitle: "Send Feedback", feedbackTypeLabel: "What's this about?", feedbackTypeFlag: "Suggest a Flag", feedbackTypeCorrection: "Report Wrong Info",
        feedbackTypeFeature: "Suggest a Feature", feedbackTypeBug: "Report a Bug", feedbackEntityLabel: "Related Country/Region (Optional)", feedbackEntityPlaceholder: "e.g. Kazakhstan, Tibet...",
        feedbackMessageLabel: "Your Message", feedbackMessagePlaceholder: "Tell us more...", feedbackSubmitBtn: "Send Feedback", feedbackErrorEmpty: "Please write your message first.",
        feedbackErrorType: "Please choose a category first.", feedbackCooldown: "Please wait a moment before sending again.", feedbackSending: "Sending...",
        feedbackSuccess: "✅ Thank you! Feedback sent.", feedbackFailed: "Failed to send. Please try again.",
        homeHeroTagline: "Learn flags. Beat quizzes. Climb the leaderboard.", fotdTagline: "A new flag to discover, every single day.",
        streakKeepGoing: "Keep it going!", leaderboardViewAll: "View All"
    },
    id: {
        totalScoreLabel: "XP", homeSubtitle: "Uji Pengetahuan Global Anda", homePlayQuiz: "Main Kuis", homeFlagLibrary: "Pustaka Bendera",
        quizModesTitle: "Mode Kuis", backToMenu: "Kembali ke Menu", continentClashTitle: "Pilih Benua", backToQuizModes: "Kembali ke Mode Kuis", backToBookmarks: "Kembali ke Bookmark",
        quizScore: "XP", quizEnd: "Akhiri Kuis", resultsTitle: "Kuis Selesai!", resultsFinalScore: "Hasil XP:", resultsPlayAgain: "Main Lagi",
        libraryTitle: "Pustaka Bendera", continentLibraryTitle: "Pilih Benua", backToLibrary: "Kembali ke Pustaka", backButton: "Kembali",
        endQuizModalTitle: "Akhiri Kuis?", endQuizModalText: "Apakah Anda yakin ingin mengakhiri kuis saat ini? XP Anda akan difinalisasi.",
        endQuizModalYes: "Ya, Akhiri", endQuizModalCancel: "Batal", footer: "Flag-X © 2025. Hak Cipta Dilindungi.",
        settingsSectionLabel: "Pengaturan", settingsLanguage: "Bahasa", settingsDifficulty: "Tingkat Kesulitan (Opsi)", difficultyEasy: "Mudah", difficultyNormal: "Normal", difficultyHard: "Sulit", settingsContact: "Kontak",
        quizPromptFlag: "Bendera apakah ini?", quizPromptGuessCapital: "Apakah ibu kota dari {countryName}?", quizPromptYear: "Bendera ini dari tahun berapa?",
        resultsMessage: "Anda mendapatkan {score} XP!", timeAttackResultMessage: "Anda menjawab {questions} pertanyaan dan mendapat {score} XP!",
        survivalResultMessage: "Anda bertahan {questions} pertanyaan dan mendapat {score} XP!", comboResultMessage: "Anda bertahan di Tantangan Kombo selama {questions} pertanyaan dan mendapat {score} XP!",
        viewDetailBtn: "Lihat Detail", funFact: "Fakta Menarik", closeBtn: "Tutup", geminiError: "Maaf, batas harian kami sudah habis. Silakan coba lagi besok!",
        searchPlaceholder: "Cari bendera...", searchCountryPlaceholder: "Cari negara...",
        mode_classic_title: "Mode Klasik", mode_classic_desc: "Tebak 20 bendera negara resmi. Tanpa batas waktu.",
        mode_continent_title: "Bentrok Benua", mode_continent_desc: "Fokus pada bendera dari satu benua. 20 pertanyaan.",
        mode_capital_title: "Tebak Ibu Kota", mode_capital_desc: "Tebak ibu kota berdasarkan benderanya. 20 pertanyaan.",
        mode_year_title: "Tebak Tahun", mode_year_desc: "Tebak tahun yang terkait dengan bendera bersejarah. 20 pertanyaan.",
        mode_time_title: "Serangan Waktu", mode_time_desc: "Jawab sebanyak mungkin pertanyaan dalam 60 detik.",
        mode_survival_title: "Mode Bertahan", mode_survival_desc: "30 pertanyaan, satu nyawa. Satu kesalahan dan permainan berakhir.",
        mode_combo_title: "Tantangan Kombo", mode_combo_desc: "Pertanyaan campuran tanpa batas, 90 detik, satu nyawa. Tantangan Flag-X yang sesungguhnya!",
        lib_official_title: "Negara Resmi", lib_subdivisions_title: "Subdivisi", lib_territories_title: "Wilayah", lib_unofficial_title: "Tidak Resmi", lib_historical_title: "Bersejarah",
        lib_organizations_title: "Organisasi Dunia", lib_continent_title: "Bendera Benua",
        lib_official_desc: "Semua negara berdaulat yang diakui secara internasional.",
        lib_subdivisions_desc: "Hanya mencakup divisi administratif tingkat pertama. Divisi tingkat kedua dan seterusnya tidak disertakan.",
        lib_territories_desc: "Wilayah dependensi dan wilayah seberang laut.",
        lib_unofficial_desc: "Wilayah sengketa dengan status kedaulatan yang masih diperdebatkan.",
        lib_historical_desc: "Bendera yang pernah digunakan oleh suatu negara atau wilayah, tetapi kini sudah tidak berlaku.",
        lib_organizations_desc: "Bendera organisasi internasional seperti PBB, NATO, dan UE.",
        lib_continent_desc: "Bendera negara resmi yang dikelompokkan berdasarkan benua dan kawasan geografis.",
        subdivisionSelectionTitle: "Pilih Negara", territorySelectionTitle: "Pilih Negara", historicalSelectionTitle: "Pilih Negara", playQuizBtn: "Main Kuis", viewBtn: "Lihat",
        awesomeBtn: "LUAR BIASA!", reachedInfo: "Anda telah mencapai", levelUpInfo: "NAIK LEVEL!", vexillologyInfo: "Sudut Vexillologi", languageInfo: "Bahasa Utama", regionInfo: "Wilayah", 
        populationInfo: "Populasi", establishedInfo: "Didirikan", capitalInfo: "Ibukota", versionInfo: "v.2.5 (Versi Beta)", saveBtn: "Simpan", cancelBtn: "Batal", yourName: "Nama Tampilan", 
        maxLevelInfo: "Level Maks: 50", levelingSystem: "Sistem Level", loginPrompt: "Masuk untuk simpan XP ke papan peringkat global!", loginBtn: "Masuk dengan Google", logoutBtn: "Keluar",
        usernameLabel: "Nama Tampilan (Peringkat)", homeLeaderboard: "Papan Peringkat", leaderboardTitle: "Pemain Terbaik", leaderboardUser: "Pemain", leaderboardScore: "XP",
        disclaimerTitle: "Catatan Akurasi Bendera",
        disclaimerText: "Di Flag-X, tujuan kami adalah memberikan tantangan mengenal bendera dari seluruh dunia semaksimal mungkin! Perlu diketahui bahwa beberapa bendera dalam kategori Subdivisions, Territories, dan Historical Flags diberi status Unofficial (Tidak Resmi). Artinya, bendera tersebut belum tentu merupakan desain resmi yang berlaku saat ini, karena tidak semua wilayah, teritori, maupun periode sejarah memiliki bendera yang diakui secara resmi atau terdokumentasi dengan baik.\n\nMengapa tetap kami tampilkan? Karena semakin banyak variasi bendera yang Anda kenali—termasuk yang paling langka atau sulit dikenali—semakin luas pula pengetahuan Anda tentang geografi, sejarah, dan vexillology. Anggap saja ini sebagai latihan mata dan otak untuk mengenali simbol-simbol unik dari berbagai penjuru dunia. Selamat belajar dan selamat bermain!",
        toastNameBlank: "Nama tidak boleh kosong! ⚠️", toastNameSaved: "Nama disimpan!", toastSaveFailed: "Gagal menyimpan. Coba lagi.", btnSaving: "Menyimpan...",
        maxLevelReached: "LEVEL MAKS tercapai!", leaderboardError: "Gagal memuat papan peringkat.", leaderboardErrorSub: "Periksa koneksi internet Anda dan coba beberapa saat lagi.",
        libNoFlags: "Bendera tidak tersedia.", searchNoFlags: "Bendera tidak ditemukan", searchTryDifferent: "Coba kata kunci lain.", detailNoInfo: "Tidak ada info vexillologi spesifik.", noDesignAvailable: "Desain tidak tersedia.",
        unofficialModalTitle: "Tidak Resmi", unofficialModalText: "Bendera ini tidak memiliki status hukum resmi. Bendera ini dapat berupa bendera yang digunakan secara tidak resmi, desain usulan, rekonstruksi hipotetis, atau karya penggemar. Ditampilkan hanya untuk tujuan edukasi dan pembelajaran vexillology.",
        toastLoginSuccess: "Berhasil masuk!", toastLoginFailed: "Gagal masuk: ", switchAccount: "Ganti Akun", toastSwitchSuccess: "Berhasil mengganti akun!", toastSwitchFailed: "Gagal mengganti akun: ",
        leaderboardGuestCTA: "Login untuk masuk ke peringkat global dan bersaing dengan yang lain!", retryBtn: "Coba Lagi", navHome: "Beranda", navPlay: "Main", navLibrary: "Pustaka", 
        navLeaderboard: "Peringkat", dayStreak: "hari berturut", shareScore: "Bagikan Skor", scoredCopied: "Skor disalin ke clipboard!", missedFlagsTitle: "Bendera untuk Ditinjau", missedFlagsShort: "Ulas", missedFlagsNone: "Sempurna — tanpa kesalahan!",
        correctAnswer: "Benar:", wrongAnswer: "Jawaban:", correctCapital: "Ibu Kota:", wrongCapital: "Ibu Kota:", bookmarkAdded: "Ditandai! ⭐", bookmarkRemoved: "Tanda dihapus",
        noBookmarksMsg: "Belum ada bookmark! Tandai bendera di pustaka.", noBookmarksSub: "Jelajahi pustaka dan klik ikon bintang pada bendera mana pun untuk menyimpannya di sini agar dapat dipelajari dengan cepat!",
        notEnoughBookmarks: "Tambahkan minimal 4 bendera bookmark untuk memulai kuis.", notEnoughBookmarksCapital: "Tambahkan minimal 4 bookmark yang punya ibu kota untuk memulai kuis ini.",
        bookmarkQuizTypeModalTitle: "Pilih Jenis Kuis", bookmarkQuizFlagDesc: "Tebak nama dari benderanya", bookmarkQuizCapitalDesc: "Tebak ibu kotanya",
        lib_bookmarks_title: "Bookmark Saya", lib_bookmarks_desc: "Bendera yang kamu simpan untuk akses cepat dan sesi belajar.", startBookmarkQuiz: "Kuis Belajar", startBookmarkQuizCapital: "Kuis Ibu Kota",
        onboardingWelcomeTitle: "Selamat Datang di Flag-X!", onboardingWelcomeText: "Uji pengetahuan Anda tentang bendera dunia dari negara resmi, subdivisi, bendera bersejarah, dan banyak lagi.",
        onboardingXpTitle: "Kumpulkan XP & Naik Level", onboardingXpText: "Jawab dengan benar untuk mendapatkan XP. Capai 50 level dan bersaing di papan peringkat global!",
        onboardingStreakTitle: "Bangun Streak Anda", onboardingStreakText: "Main setiap hari untuk menjaga streak, bookmark bendera untuk belajar, dan bagikan skor terbaikmu!",
        skipBtn: "Lewati", nextBtn: "Lanjut", letsGoBtn: "AYO MULAI!", settingsTypeName: "Mode Input", typeNameLabel: "Ketik Jawaban", typeNamePlaceholder: "Ketik nama negara...",
        settingsSound: "Suara", soundLabel: "Efek Suara", submitBtn: "Kirim", resCorrect: "Benar", resWrong: "Salah", resAccuracy: "Akurasi", resTimeout: "Habis Waktu", resAvgTime: "Rata-rata",
        historyTitle: "Riwayat Kuis", homeHistory: "Riwayat Kuis", shareCardTitle: "Bagikan Skor", downloadBtn: "Simpan", shareBtn: "Bagikan", tabAllTime: "Sepanjang Masa", tabThisWeek: "Minggu Ini", leaderboardWeeklyReset: "RESET MINGGUAN", leaderboardResetsIn: "Reset dalam", leaderboardYou: "Kamu", leaderboardSortXP: "XP", leaderboardSortStreak: "Streak",
        profileTotalQuizzes: "Total Kuis", profileAccuracy: "Akurasi", profileRank: "Peringkat", profileLevelLabel: "Level", profileMemberSince: "Bergabung sejak {date}",
        profileBestStreak: "Terbaik", profileTotalQuizzesDesc: "Kuis dimainkan",
        profileMotivationNew: "Ayo mulai belajar!", profileMotivationExcellent: "Luar biasa! Kamu master bendera!", profileMotivationGreat: "Kerja bagus! Terus pertahankan!", profileMotivationGood: "Usaha bagus! Terus berlatih!", profileMotivationPractice: "Terus berlatih!",
        achievementSheetTitle: "Achievement", homeQuickExplore: "Jelajah Cepat",
        leaderboardStreak: "Streak", navHistory: "Riwayat", switchModalTitle: "Ganti Mode Kuis?", switchModalDesc: "Mengubah jenis input kuis di tengah permainan akan memuat ulang seluruh progres kuis berjalan Anda.",
        confirmSwitchBtn: "Ya, Reset", cancelSwitchBtn: "Batal", notifModalTitle: "Aktifkan Pengingat?", notifModalDesc: "Kami akan mengirimkan notifikasi harian agar Streak kamu tidak hangus dan terus berlanjut!",
        notifLaterBtn: "Nanti Saja", notifAllowBtn: "Izinkan", historyEmptyTitle: "Belum Ada Riwayat", historyEmptyDesc: "Mainkan kuis pertamamu dan jadilah master bendera!",
        streakLegendary: "Dedikasi luar biasa! 🏆", streakOnFire: "Kamu luar biasa! Terus pertahankan!", streakWeekly: "Satu minggu berturut-turut! Konsistensi yang menakjubkan!",
        streakBonusSub: "Berlaku untuk semua XP kuis selama streak aktif", leaderboardNoData: "Tidak ada data untuk periode ini.", leaderboardNoDataSub: "Jadilah yang pertama meraih posisi teratas di papan peringkat!",
        notifGrantedTitle: "Pengingat Flag-X Aktif!", notifGrantedBody: "Bagus! Kami akan mengingatkanmu mempertahankan Streak.",
        notifNotSupported: "Notifikasi tidak didukung di browser ini.", notifAlreadyActive: "🔔 Notifikasi streak sudah aktif!",
        notifBlocked: "Notifikasi diblokir. Aktifkan lewat pengaturan browser.", switchDiffModalTitle: "Ganti Tingkat Kesulitan?",
        switchDiffModalDesc: "Mengubah tingkat kesulitan di tengah kuis akan me-reset progres kuis yang sedang berjalan.", filterModalTitle: "Filter berdasarkan Mode", sortModalTitle: "Urutkan",
        filterAll: "Semua Mode", sortNewest: "Terbaru", sortHighest: "XP Tertinggi", diffDisabledHint: "Difficulty dikunci saat Mode Input aktif", typeCapitalPlaceholder: "Ketik nama ibu kota...",
        deleteModalTitle: "Hapus Riwayat", delete24h: "24 Jam Terakhir", delete7d: "7 Hari Terakhir", delete30d: "30 Hari Terakhir", deleteAll: "Semua Riwayat",
        deleteConfirmTitle: "Hapus Riwayat?", confirmDeleteBtn: "Ya, Hapus", historyDeleted: "Riwayat dihapus!",
        deleteConfirm24h: "Ini akan menghapus permanen semua riwayat kuis dalam 24 jam terakhir. Tindakan ini tidak dapat dibatalkan.",
        deleteConfirm7d: "Ini akan menghapus permanen semua riwayat kuis dalam 7 hari terakhir. Tindakan ini tidak dapat dibatalkan.",
        deleteConfirm30d: "Ini akan menghapus permanen semua riwayat kuis dalam 30 hari terakhir. Tindakan ini tidak dapat dibatalkan.",
        deleteConfirmAll: "Ini akan menghapus permanen SEMUA riwayat kuis kamu. Tindakan ini tidak dapat dibatalkan.",
        typeSubdivisionPlaceholder: "Ketik nama wilayah...", typeOrgPlaceholder: "Ketik nama organisasi...", yearInputDisabledHint: "Mode Input tidak tersedia untuk Year Guess",
        inputModeLocked: "Raih Level 10 untuk membuka Mode Input", usernamePlaceholder: "Nama kamu...", guestName: "Penjelajah Tamu", flagOfTheDay: "Bendera Hari Ini",
        loadingLeaderboard: "Memuat Papan Peringkat...", generatingFunFact: "Menghasilkan Fakta Menarik...", mode_daily_title: "Tantangan Harian",
        mode_daily_desc: "10 soal yang sama untuk semua orang hari ini. Bisakah kamu mengalahkan temanmu?",
        dailyCompleted: "✅ Sudah dimainkan hari ini! Kembali lagi besok.", dailyCompletedTitle: "Sampai Jumpa Besok!",
        feedbackModalTitle: "Kirim Masukan", feedbackTypeLabel: "Ini soal apa?", feedbackTypeFlag: "Usulkan Bendera", feedbackTypeCorrection: "Laporkan Info Salah",
        feedbackTypeFeature: "Usulkan Fitur", feedbackTypeBug: "Laporkan Bug", feedbackEntityLabel: "Negara/Wilayah Terkait (Opsional)", feedbackEntityPlaceholder: "cth. Kazakhstan, Tibet...",
        feedbackMessageLabel: "Pesan Kamu", feedbackMessagePlaceholder: "Ceritakan lebih lanjut...", feedbackSubmitBtn: "Kirim Masukan", feedbackErrorEmpty: "Tulis pesan kamu terlebih dahulu.",
        feedbackErrorType: "Pilih kategori terlebih dahulu.", feedbackCooldown: "Tunggu sebentar sebelum mengirim lagi.", feedbackSending: "Mengirim...",
        feedbackSuccess: "✅ Terima kasih! Masukan terkirim.", feedbackFailed: "Gagal mengirim. Silakan coba lagi.",
        homeHeroTagline: "Pelajari bendera. Taklukkan kuis. Naik ke puncak peringkat.", fotdTagline: "Satu bendera baru untuk dipelajari, setiap hari.",
        streakKeepGoing: "Terus pertahankan!", leaderboardViewAll: "Lihat Semua"
        }
};

// Bagian judul hero di-split manual (bukan lewat data-translate-key) karena kata yang di-highlight
// ("Knowledge" / "Pengetahuan") posisinya beda urutan antar bahasa.
const heroTitleParts = {
    en: { pre: "Test Your Global", accent: "Knowledge", post: "" },
    id: { pre: "Uji", accent: "Pengetahuan", post: " Global Anda" }
};

// ============================================================================
// 5. DATA PROCESSING & UTILITIES
// ============================================================================
const groupDataByCountry = (dataArray) => {
    const grouped = dataArray.reduce((acc, item) => {
        const country = item.country;
        if (!acc[country]) acc[country] = [];
        acc[country].push(item);
        return acc;
    }, {});
    return Object.keys(grouped).sort().reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
    }, {});
};

const subdivisionFlags = groupDataByCountry(subdivisions);
const territoryFlags = groupDataByCountry(territories);
const historicalFlagsByCountry = groupDataByCountry(historicalFlags);

const formatXP = (xp) => {
    const num = parseInt(xp) || 0;
    if (num >= 1000000) return (Math.floor(num / 100000) / 10) + 'M';
    if (num >= 100000) return (Math.floor(num / 100) / 10) + 'K';
    return num;
};

// Warna aksen untuk card Quiz Mode & Library Category.
// Beberapa id sengaja berbagi warna yang sama (mis. "continent", "historical")
// karena mewakili pool data yang sama antara Quiz Mode & Library.
const accentColors = {
    // Quiz Modes (quiz-modes-screen)
    classic: '#7B47F5',
    continent: '#28a745',
    capital: '#15B4CC',
    year: '#f59e0b',
    time: '#3b82f6',
    survival: '#84CC16',
    combo: '#dc3545',
    // Library Categories (library-categories-screen)
    bookmarks: '#EC41B1',
    official: '#7B47F5',
    subdivisions: '#6366f1',
    territories: '#14b8a6',
    historical: '#f59e0b',
    organizations: '#0ea5e9',
    unofficial: '#dc3545'
};

// Durasi minimum skeleton loading ditampilkan (ms) — Leaderboard, Fun Fact, View Detail.
// Dipakai lewat Promise.all/setTimeout supaya animasi shimmer sempat kelihatan penuh,
// meski data asli (cache/network) sudah siap lebih cepat dari durasi ini.
const SKELETON_MIN_DELAY = 2500;

// Toast Notification
function showToast(message) {
    let toast = document.querySelector('.toast-msg');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.remove('show');
    void toast.offsetWidth; 
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Fuzzy Matching
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
    const normalize = (str) => str.trim().toLowerCase()
        .replace(/\bst\.?\b/g, 'saint')
        .replace(/\bsts\.?\b/g, 'saints')
        .replace(/\brep\.?\b/g, 'republic')
        .replace(/\bdem\.?\b/g, 'democratic')
        .replace(/\bisls?\.?\b/g, 'island')
        .replace(/\s+/g, ' ').trim();
    const a = normalize(input);
    const b = normalize(target);
    if (a === b) return true;
    const bSimple = b.replace(/\s*\(.*?\)/g, '').trim();
    if (a === bSimple) return true;
    const threshold = b.length <= 5 ? 1 : 2;
    return levenshtein(a, b) <= threshold || levenshtein(a, bSimple) <= threshold;
}

// ============================================================================
// 6. UI & NAVIGATION LOGIC
// ============================================================================
function showScreen(screenId) {
    if (screenId !== 'quiz-screen' && currentQuiz && currentQuiz.timerId) {
        clearInterval(currentQuiz.timerId);
        currentQuiz.timerId = null;
    }
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.body.classList.toggle('quiz-mode-active', screenId === 'quiz-screen');
    
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
        document.body.style.paddingBottom = '81px'; 
        
        requestAnimationFrame(() => {
            document.body.style.paddingBottom = '80px';
            window.dispatchEvent(new Event('resize'));
        });
        localStorage.setItem('lastActiveScreen', screenId);
        
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            if (screenId === 'quiz-screen') {
                bottomNav.style.display = 'none';
                document.body.classList.add('nav-hidden');
            } else {
                bottomNav.style.display = 'flex';
                document.body.classList.remove('nav-hidden');
            }
        }
        updateNavActiveState(screenId);

        // Reset pencarian Country Selector setiap kali screen ini dibuka
        const selectorSearchInput = target.querySelector('.country-selector-search');
        if (selectorSearchInput) { selectorSearchInput.value = ''; filterCountrySelector(selectorSearchInput); }
    }
}

const NAV_ORDER = ['nav-library', 'nav-quiz', 'nav-home', 'nav-leaderboard', 'nav-history'];

function updateNavActiveState(screenId) {
    document.querySelectorAll('.nav-item, .desktop-nav-item').forEach(item => item.classList.remove('active'));
    let activeId = null;
    if (screenId === 'home-screen') activeId = 'nav-home';
    else if (screenId === 'quiz-modes-screen' || screenId === 'quiz-screen') activeId = 'nav-quiz';
    else if (screenId === 'library-categories-screen' || screenId === 'library-display-screen' || screenId.includes('library-screen')) activeId = 'nav-library';
    else if (screenId === 'leaderboard-screen') activeId = 'nav-leaderboard';
    else if (screenId === 'history-screen') activeId = 'nav-history';

    if (activeId) {
        document.getElementById(activeId)?.classList.add('active');
        document.getElementById(`desktop-${activeId}`)?.classList.add('active');
        const pill = document.getElementById('nav-pill');
        const idx = NAV_ORDER.indexOf(activeId);
        if (pill && idx !== -1) pill.style.transform = `translateX(${idx * 100}%)`;
    }
}

// --- DESKTOP SIDEBAR: keep settings-panel in the right host, and keep the
// compact profile card (avatar/name/level/streak/achievements) in sync with
// whatever already drives the mobile header + hamburger drawer. ---
function relocateSettingsPanel() {
    const settingsPanel = document.getElementById('settings-panel');
    const desktopSlot = document.getElementById('desktop-settings-modal-slot');
    const mobileHost = document.querySelector('#hamburger-drawer .side-drawer-panel');
    const contactPanel = document.getElementById('contact-panel');
    if (!settingsPanel || !desktopSlot || !mobileHost) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop && settingsPanel.parentElement !== desktopSlot) desktopSlot.appendChild(settingsPanel);
    else if (!isDesktop && settingsPanel.parentElement !== mobileHost) mobileHost.insertBefore(settingsPanel, contactPanel || null);
}

function toggleDesktopSidebarCollapse() {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('flagx-sidebar-collapsed', collapsed ? 'true' : 'false');
}

function syncDesktopProfileCard() {
    const nameEl = document.getElementById('desktop-header-profile-name');
    if (!nameEl) return;
    const imgEl = document.getElementById('desktop-header-profile-img');
    const iconEl = document.getElementById('desktop-header-profile-icon');
    const achvBadge = document.getElementById('desktop-header-profile-achv-badge');

    if (auth && auth.currentUser) {
        const shownName = document.getElementById('profile-name')?.textContent;
        nameEl.textContent = (shownName && shownName !== 'User' && shownName !== 'Guest') ? shownName : (auth.currentUser.displayName || 'User');
        const photo = auth.currentUser.photoURL || localStorage.getItem('cachedProfilePic');
        if (photo) { if (imgEl) { imgEl.src = photo; imgEl.classList.remove('hidden'); } if (iconEl) iconEl.classList.add('hidden'); }
    } else {
        nameEl.textContent = (translations[settings.language] && translations[settings.language].guestName) || 'Guest Explorer';
        if (imgEl) { imgEl.classList.add('hidden'); imgEl.src = ''; }
        if (iconEl) iconEl.classList.remove('hidden');
    }

    if (achvBadge && typeof ACHIEVEMENTS !== 'undefined') {
        const stats = getPlayerStatsSnapshot();
        const unlocked = ACHIEVEMENTS.filter(a => a.test(stats)).length;
        if (unlocked > 0) { achvBadge.textContent = unlocked; achvBadge.classList.remove('hidden'); }
        else achvBadge.classList.add('hidden');
    }

    const xpValueEl = document.getElementById('desktop-header-xp-value');
    const levelBadgeEl = document.getElementById('desktop-header-level-badge');
    if (xpValueEl || levelBadgeEl) {
        const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
        if (xpValueEl) xpValueEl.textContent = formatXP(xp);
        if (levelBadgeEl) levelBadgeEl.textContent = `Lv. ${calculateLevel(xp)}`;
    }
}

function closeAllPanels() {
    const panels = ['hamburger-drawer', 'disclaimer-panel', 'level-info-panel'];
    panels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active', 'closing');
    });
}

function closeSheet(overlay) {
    if (!overlay || !overlay.classList.contains('active') || overlay.classList.contains('closing')) return;
    overlay.classList.add('closing');
    const panel = overlay.querySelector('.side-drawer-panel, .bottom-sheet-panel');
    const finish = () => {
        overlay.classList.remove('active', 'closing');
        document.body.classList.remove('modal-open');
    };
    if (panel) panel.addEventListener('animationend', finish, { once: true });
    else setTimeout(finish, 300);
}

function openLevelInfo(e) {
    if (e) e.stopPropagation(); 
    const levelPanel = document.getElementById('level-info-panel');
    if (levelPanel.classList.contains('active')) { closeSheet(levelPanel); return; }
    closeAllPanels();
    levelPanel.classList.add('active');
    document.body.classList.add('modal-open');
}

// Notification Bell
function updateNotificationBellUI() {
    const isGranted = 'Notification' in window && Notification.permission === 'granted';
    const dot = document.getElementById('notif-bell-dot');
    if (dot) dot.classList.toggle('hidden', isGranted);
    const desktopDot = document.getElementById('desktop-header-notif-dot');
    if (desktopDot) desktopDot.classList.toggle('hidden', isGranted);
}

function handleNotificationBellClick() {
    const lang = settings.language;
    if (!('Notification' in window)) {
        showToast(translations[lang].notifNotSupported);
        return;
    }
    if (Notification.permission === 'granted') {
        showToast(translations[lang].notifAlreadyActive);
        return;
    }
    if (Notification.permission === 'denied') {
        showToast(translations[lang].notifBlocked);
        return;
    }
    requestNotificationPermission();
}

// ============================================================================
// 7. LEVELING & XP SYSTEM
// ============================================================================
function calculateLevel(xp) {
    if (xp < 5000) return Math.floor(xp / 500) + 1;           
    if (xp < 20000) return 10 + Math.floor((xp - 5000) / 1000); 
    if (xp < 57500) return 25 + Math.floor((xp - 20000) / 2500); 
    if (xp < 102500) return 40 + Math.floor((xp - 57500) / 5000); 
    return 50; 
}

function updateLevelUI(xp) {
    let level = 1, currentXPInLevel = 0, nextLevelXPThreshold = 500;
    if (xp < 5000) { level = Math.floor(xp / 500) + 1; currentXPInLevel = xp % 500; nextLevelXPThreshold = 500; } 
    else if (xp < 20000) { level = 10 + Math.floor((xp - 5000) / 1000); currentXPInLevel = (xp - 5000) % 1000; nextLevelXPThreshold = 1000; } 
    else if (xp < 57500) { level = 25 + Math.floor((xp - 20000) / 2500); currentXPInLevel = (xp - 20000) % 2500; nextLevelXPThreshold = 2500; } 
    else if (xp < 102500) { level = 40 + Math.floor((xp - 57500) / 5000); currentXPInLevel = (xp - 57500) % 5000; nextLevelXPThreshold = 5000; } 
    else { level = 50; currentXPInLevel = 1; nextLevelXPThreshold = 1; }

    const percentage = level >= 50 ? 100 : (currentXPInLevel / nextLevelXPThreshold) * 100;

    const progressBar = document.getElementById('level-progress-bar');
    const progressCurrentEl = document.getElementById('level-progress-current');
    const progressSuffixEl = document.getElementById('level-progress-suffix');
    const percentageText = document.getElementById('level-percentage');
    const levelBadge = document.getElementById('level-badge'); 

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (level >= 50) {
        if (progressCurrentEl) progressCurrentEl.textContent = translations[settings.language].maxLevelReached;
        if (progressSuffixEl) progressSuffixEl.textContent = '';
    } else {
        if (progressCurrentEl) progressCurrentEl.textContent = currentXPInLevel.toLocaleString();
        if (progressSuffixEl) progressSuffixEl.textContent = ` / ${nextLevelXPThreshold.toLocaleString()} XP`;
    }
    if (percentageText) percentageText.textContent = `${Math.floor(percentage)}%`;
    if (levelBadge) levelBadge.textContent = `Lv. ${level}`;    
}

function loadTotalScore() {
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    if (totalscoreValueEl) totalscoreValueEl.textContent = formatXP(xp);
    updateLevelUI(xp);
    syncDesktopProfileCard();
}

async function addToTotalScore(scoreFromQuiz) {
    const currentTotal = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const newTotal = currentTotal + scoreFromQuiz;
    localStorage.setItem('flagx-totalscore', newTotal);
    if (totalscoreValueEl) totalscoreValueEl.textContent = formatXP(newTotal);
    
    updateLevelUI(newTotal); 
    syncDesktopProfileCard();

    if (auth && auth.currentUser) {
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const now = new Date();
            const monday = new Date(now);
            monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
            monday.setHours(0, 0, 0, 0);
            const weekStartISO = monday.toISOString();

            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};

            let weeklyScore = userData.weeklyScore || 0;
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

// ============================================================================
// 8. USER, AUTHENTICATION & PROFILE
// ============================================================================
const handleLogin = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!auth) {
        showToast(translations[settings.language].toastLoginFailed);
        return;
    }
    try {
        await signInWithPopup(auth, googleProvider);
        showToast(translations[settings.language].toastLoginSuccess);
        if (profilePanel) profilePanel.classList.remove('active');
    } catch (error) {
        console.error("Login Error:", error);
        if (profilePanel) profilePanel.classList.remove('active');
        if (error.code !== 'auth/popup-closed-by-user') {
            showToast(translations[settings.language].toastLoginFailed + ": " + error.message);
        }
    }
};

async function switchAccount() {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
        showToast(translations[settings.language].toastSwitchSuccess);
        setTimeout(() => { window.location.reload(); }, 800); 
    } catch (error) {
        console.error("Gagal mengganti akun: ", error);
        if (error.code !== 'auth/popup-closed-by-user') {
            showToast(translations[settings.language].toastSwitchFailed + error.message);
        }
    }
}

const handleLogout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('flagx-totalscore'); 
        window.location.reload();
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Logout failed, please try again.");
    }
};

const syncScoreToCloud = async (user) => {
    const localScore = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let finalScore = localScore;
    let username = user.displayName;

    if (userSnap.exists()) {
        const data = userSnap.data();
        finalScore = Math.max(localScore, data.totalScore || 0);
        username = data.username || user.displayName;
    }

    localStorage.setItem('flagx-totalscore', finalScore);
    if (totalscoreValueEl) totalscoreValueEl.textContent = formatXP(finalScore);
    updateLevelUI(finalScore);

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

function updateProfileUI(user, customName = null) {
    const loggedOutView = document.getElementById('auth-logged-out');
    const loggedInView  = document.getElementById('auth-logged-in');
    const userPhotoPojok   = document.getElementById('user-photo');
    const userIconDefault  = document.getElementById('user-icon-default');
    const userPhotoPanel   = document.getElementById('user-panel-img');
    const profileNameDisplay = document.getElementById('profile-name');

    if (user) {
        if (loggedOutView) loggedOutView.classList.add('hidden');
        if (loggedInView)  loggedInView.classList.remove('hidden');

        const finalName = customName || user.displayName || 'User';
        if (usernameInput) {
            usernameInput.value = finalName;
            usernameInput.dispatchEvent(new Event('input')); 
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
    syncDesktopProfileCard();
}

function formatMemberSince(creationTime, lang) {
    if (!creationTime) return '';
    const date = new Date(creationTime);
    if (isNaN(date.getTime())) return '';
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    const formatted = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    return (translations[lang].profileMemberSince || 'Member since {date}').replace('{date}', formatted);
}

function getProfileMotivationText(lifetimeAttempted, accuracy, lang) {
    const t = translations[lang];
    if (lifetimeAttempted <= 0) return t.profileMotivationNew || 'Keep learning!';
    if (accuracy >= 90) return t.profileMotivationExcellent || "Excellent! You're a flag master!";
    if (accuracy >= 70) return t.profileMotivationGreat || 'Great work! Keep it up!';
    if (accuracy >= 50) return t.profileMotivationGood || 'Good effort! Practice more!';
    return t.profileMotivationPractice || 'Keep practicing!';
}

async function fetchUserRank(userXP) {
    if (!db) return null;
    try {
        const higherQuery = query(collection(db, "users"), where("totalScore", ">", userXP));
        const snap = await getCountFromServer(higherQuery);
        return snap.data().count + 1;
    } catch (e) {
        console.error("Rank fetch error:", e);
        return null;
    }
}

if (auth) {
    onAuthStateChanged(auth, async (user) => {
        markAppLoadingStep('auth');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const leaderboardScreen = document.getElementById('leaderboard-screen');
        const isLeaderboardActive = leaderboardScreen && leaderboardScreen.classList.contains('active');

        if (user) {
            // Admin-only Eruda dev console
            const ADMIN_UID = 'wE4eP1X9iefGC6GnKIT101RqZk72';
            if (user.uid === ADMIN_UID && !window.eruda) {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/eruda';
                s.onload = () => eruda.init();
                document.head.appendChild(s);
            }

            let nameToDisplay = user.displayName;
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
            if (isLeaderboardActive) loadLeaderboard(); 
            loadHomeLeaderboardPreview();

        } else {
            localStorage.removeItem('cachedProfilePic');
            updateProfileUI(null);
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (isLeaderboardActive) loadLeaderboard();
            loadHomeLeaderboardPreview();
        }
    });
}

// ============================================================================
// 9. SETTINGS & LANGUAGE
// ============================================================================
function loadSettings() {
    let savedSettings = null;
    try {
        const raw = localStorage.getItem('flagx-settings');
        if (raw) savedSettings = JSON.parse(raw);
    } catch (e) {
        console.warn('Settings corrupt, using defaults:', e);
        localStorage.removeItem('flagx-settings'); // bersihkan data corrupt
    }
        
    if (savedSettings) settings = savedSettings;
    
    document.querySelector(`input[name="language"][value="${settings.language}"]`)?.setAttribute('checked', true);
    document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`)?.setAttribute('checked', true);
    
    setLanguage(settings.language);

    const typeNameSettingDiv = document.getElementById('type-name-setting');
    const typeNameTrack = document.getElementById('type-name-toggle-track');
    const typeNameThumb = document.getElementById('type-name-toggle-thumb');
    
    if (typeNameSettingDiv && typeNameTrack && typeNameThumb) {
        const totalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
        const lvl = calculateLevel(totalXP);
        if (lvl >= 10) {
            typeNameSettingDiv.classList.remove('hidden');
            document.getElementById('input-mode-locked-hint')?.remove();
        } else {
            typeNameSettingDiv.classList.remove('hidden'); 
            settings.typeNameMode = false;
            const toggleLabel = typeNameSettingDiv.querySelector('label[onclick="toggleTypeNameMode()"]');
            if (toggleLabel) {
                toggleLabel.style.opacity = '0.4';
                toggleLabel.style.pointerEvents = 'none';
                toggleLabel.style.cursor = 'not-allowed';
            }
            if (!document.getElementById('input-mode-locked-hint')) {
                const hint = document.createElement('p');
                hint.id = 'input-mode-locked-hint';
                hint.className = 'text-xs mt-2';
                hint.style.color = 'var(--subtle-text-color)';
                hint.setAttribute('data-translate-key', 'inputModeLocked');
                hint.textContent = translations[settings.language].inputModeLocked || 'Reach Level 10 to unlock Input Mode';
                typeNameSettingDiv.appendChild(hint);
            }
        }
        
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
    }

    const soundTrack = document.getElementById('sound-toggle-track');
    const soundThumb = document.getElementById('sound-toggle-thumb');
    if (soundTrack && soundThumb) {
        const isOn = settings.soundEnabled !== false; 
        if (isOn) {
            soundTrack.classList.add('bg-[var(--primary-color)]');
            soundTrack.classList.remove('bg-[var(--secondary-color)]');
            soundThumb.style.transform = 'translateX(16px)';
            soundThumb.style.backgroundColor = '#ffffff'; 
        } else {
            soundTrack.classList.remove('bg-[var(--primary-color)]');
            soundTrack.classList.add('bg-[var(--secondary-color)]');
            soundThumb.style.transform = 'translateX(0)';
            soundThumb.style.backgroundColor = ''; 
        }
    }
    updateCustomRadioUI();
    _syncDifficultyAvailability();
}

function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    settings.language = lang;
    localStorage.setItem('flagx-settings', JSON.stringify(settings));
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (translations[lang][key]) {
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) el.placeholder = translations[lang][key];
            else if (el.dataset.count !== undefined) el.textContent = `${translations[lang][key]} (${el.dataset.count})`;
            else el.textContent = translations[lang][key];
        }
    });

    const heroParts = heroTitleParts[lang] || heroTitleParts.en;
    const heroPreEl = document.getElementById('hero-title-pre');
    const heroAccentEl = document.getElementById('hero-title-accent');
    const heroPostEl = document.getElementById('hero-title-post');
    if (heroPreEl) heroPreEl.textContent = heroParts.pre;
    if (heroAccentEl) heroAccentEl.textContent = heroParts.accent;
    if (heroPostEl) heroPostEl.textContent = heroParts.post;

    renderQuizModes();
    renderLibraryCategories();
    renderHomeQuickExplore();
    renderQuizHistory();
    initDailyChallengeBanner();

    renderSelectorScreen('continent-clash-screen', Object.keys(continentFlags).sort(), (continent) => startQuiz('continent', continent));
    renderSelectorScreen('continent-library-screen', Object.keys(continentFlags).sort(), (continent) => showLibrary('continent', continent));
    renderSelectorScreen('subdivision-library-screen', Object.keys(subdivisionFlags).sort(), (country) => showLibrary('subdivisions', country));
    renderSelectorScreen('territory-library-screen', Object.keys(territoryFlags).sort(), (country) => showLibrary('territories', country));
    renderSelectorScreen('historical-library-screen', Object.keys(historicalFlagsByCountry).sort(), (country) => showLibrary('historical', country));
    
    const quizPromptEl = document.getElementById('quiz-prompt');
    if (quizPromptEl && quizPromptEl.dataset.translateKey) {
        const key = quizPromptEl.dataset.translateKey;
        let text = translations[settings.language][key];
        if (key === 'quizPromptGuessCapital' && quizPromptEl.dataset.countryName) {
            text = text.replace('{countryName}', quizPromptEl.dataset.countryName);
        }
        quizPromptEl.textContent = text;
    }
}

function updateCustomRadioUI() {
    ['en', 'id'].forEach(val => {
        const card = document.getElementById(`lang-card-${val}`);
        if (card) card.classList.toggle('active', settings.language === val);
    });
    [2, 4, 6].forEach(val => {
        const card = document.getElementById(`diff-card-${val}`);
        if (card) card.classList.toggle('active', settings.difficulty === val);
    });
}

function toggleTypeNameMode() {
    const quizScreen = document.getElementById('quiz-screen');
    if (quizScreen && quizScreen.classList.contains('active')) {
        closeAllPanels();
        const modal = document.getElementById('switch-mode-modal');
        if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
    } else {
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
    _syncDifficultyAvailability();
}

function _syncDifficultyAvailability(forceUnlocked = false) {
    const diffRadios = document.querySelectorAll('input[name="difficulty"]');
    const diffCards = document.querySelectorAll('[id^="diff-card-"]');
    const isTypeName = settings.typeNameMode && !forceUnlocked;

    diffRadios.forEach(r => { r.disabled = isTypeName; });
    diffCards.forEach(card => {
        if (isTypeName) {
            card.style.opacity = '0.4'; card.style.pointerEvents = 'none'; card.style.cursor = 'not-allowed';
        } else {
            card.style.opacity = ''; card.style.pointerEvents = ''; card.style.cursor = '';
        }
    });

    let hint = document.getElementById('diff-disabled-hint');
    if (isTypeName) {
        if (!hint) {
            hint = document.createElement('p');
            hint.id = 'diff-disabled-hint';
            hint.className = 'text-xs mt-2';
            hint.style.color = 'var(--subtle-text-color)';
            hint.setAttribute('data-translate-key', 'diffDisabledHint');
            hint.textContent = settings.language === 'id' ? 'Difficulty dikunci saat Mode Input aktif' : 'Difficulty locked while Input Mode is active';
            const diffBlock = document.querySelector('#settings-panel .mb-4:nth-child(3)');
            if (diffBlock) diffBlock.appendChild(hint);
        }
    } else {
        if (hint) hint.remove();
    }
}

function _syncInputModeForMode(mode) {
    const toggleLabel = document.querySelector('label[onclick="toggleTypeNameMode()"]');
    let hint = document.getElementById('year-input-disabled-hint');

    if (mode === 'yearGuess') {
        if (toggleLabel) { toggleLabel.style.opacity = '0.4'; toggleLabel.style.pointerEvents = 'none'; toggleLabel.style.cursor = 'not-allowed'; }
        if (!hint) {
            hint = document.createElement('p');
            hint.id = 'year-input-disabled-hint';
            hint.className = 'text-xs mt-2';
            hint.style.color = 'var(--subtle-text-color)';
            hint.setAttribute('data-translate-key', 'yearInputDisabledHint');
            hint.textContent = settings.language === 'id' ? 'Mode Input tidak tersedia untuk Year Guess' : 'Input Mode unavailable for Year Guess';
            const typeNameBlock = document.getElementById('type-name-setting');
            if (typeNameBlock) typeNameBlock.appendChild(hint);
        }
    } else {
        if (hint) hint.remove();
        const totalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
        const lvl = calculateLevel(totalXP);
        if (lvl >= 10) {
            if (toggleLabel) { toggleLabel.style.opacity = ''; toggleLabel.style.pointerEvents = ''; toggleLabel.style.cursor = ''; }
        } else {
            if (toggleLabel) { toggleLabel.style.opacity = '0.4'; toggleLabel.style.pointerEvents = 'none'; toggleLabel.style.cursor = 'not-allowed'; }
        }
    }
    _syncDifficultyAvailability(mode === 'yearGuess');
}

function toggleSound() {
    settings.soundEnabled = !settings.soundEnabled;
    localStorage.setItem('flagx-settings', JSON.stringify(settings));
    const track = document.getElementById('sound-toggle-track');
    const thumb = document.getElementById('sound-toggle-thumb');
    if (settings.soundEnabled) {
        track.classList.add('bg-[var(--primary-color)]'); track.classList.remove('bg-[var(--secondary-color)]');
        thumb.style.transform = 'translateX(16px)'; thumb.style.backgroundColor = '#ffffff'; 
    } else {
        track.classList.remove('bg-[var(--primary-color)]'); track.classList.add('bg-[var(--secondary-color)]');
        thumb.style.transform = 'translateX(0)'; thumb.style.backgroundColor = ''; 
    }
}

// 10. LEADERBOARD SYSTEM
// ============================================================================
// SESUDAH
function renderLeaderboardSkeleton(count = 7) {
    const podiumEl = document.getElementById('leaderboard-podium');
    if (podiumEl) {
        podiumEl.innerHTML = `
            <div class="flex items-end justify-center gap-3 sm:gap-5 px-2 mb-2">
                <div class="flex flex-col items-center w-20 order-1"><div class="skeleton-block w-16 h-16 rounded-full mb-2"></div><div class="skeleton-block h-3 w-14 rounded-full mb-1"></div><div class="skeleton-block h-2.5 w-10 rounded-full mb-2"></div><div class="skeleton-block w-full h-16 rounded-t-lg"></div></div>
                <div class="flex flex-col items-center w-24 order-2"><div class="skeleton-block w-20 h-20 rounded-full mb-2"></div><div class="skeleton-block h-3 w-16 rounded-full mb-1"></div><div class="skeleton-block h-2.5 w-12 rounded-full mb-2"></div><div class="skeleton-block w-full h-24 rounded-t-lg"></div></div>
                <div class="flex flex-col items-center w-20 order-3"><div class="skeleton-block w-16 h-16 rounded-full mb-2"></div><div class="skeleton-block h-3 w-14 rounded-full mb-1"></div><div class="skeleton-block h-2.5 w-10 rounded-full mb-2"></div><div class="skeleton-block w-full h-11 rounded-t-lg"></div></div>
            </div>`;
    }
    let rows = '';
    for (let i = 0; i < count; i++) {
        rows += `<div class="flex items-center gap-2.5 p-2.5 mb-2 rounded-xl bg-[var(--card-bg-color)] border border-[var(--card-border-color)]">
            <div class="skeleton-block w-4 h-3.5 rounded flex-shrink-0"></div>
            <div class="skeleton-block w-8 h-8 rounded-full flex-shrink-0"></div>
            <div class="flex-1 min-w-0"><div class="skeleton-block h-3.5 w-24 rounded-full mb-1.5"></div><div class="skeleton-block h-2.5 w-16 rounded-full"></div></div>
            <div class="skeleton-block h-4 w-12 rounded-full flex-shrink-0"></div>
        </div>`;
    }
    return `<div class="p-1 pb-2">${rows}</div>`;
}

function renderLeaderboardPodium(topThree, tab) {
    const podiumEl = document.getElementById('leaderboard-podium');
    if (!topThree.length) { if (podiumEl) podiumEl.innerHTML = ''; return ''; }
    const TIER = {
        1: { order: 'order-2', avatar: 'w-20 h-20', standH: 'h-24', ring: 'ring-yellow-400', standBg: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-400', glow: 'shadow-[0_0_16px_rgba(250,204,21,0.45)]' },
        2: { order: 'order-1', avatar: 'w-16 h-16', standH: 'h-16', ring: 'ring-gray-300', standBg: 'from-gray-300 to-gray-500', textColor: 'text-gray-300', glow: 'shadow-[0_0_10px_rgba(209,213,219,0.35)]' },
        3: { order: 'order-3', avatar: 'w-16 h-16', standH: 'h-11', ring: 'ring-amber-600', standBg: 'from-amber-500 to-amber-700', textColor: 'text-amber-600', glow: 'shadow-[0_0_10px_rgba(217,119,6,0.35)]' }
    };
    const hiddenCls = 'opacity-0 translate-y-6 scale-90';
    const isStreak = leaderboardSortMode === 'streak';
    let html = '<div class="flex items-end justify-center gap-3 sm:gap-5 px-2">';
    topThree.forEach((d, i) => {
        const rank = i + 1;
        const t = TIER[rank];
        const displayName = d.username || 'User' + Math.floor(1000 + Math.random() * 9000);
        const valDisplay = isStreak
            ? (d.streak || 0) + (settings.language === 'id' ? ' hari' : ' days')
            : formatXP(tab === 'thisweek' ? (d.weeklyScore || 0) : (d.totalScore || 0));
        const valGradient = isStreak ? 'from-orange-400 to-amber-500' : 'from-[var(--primary-color)] to-[#a78bfa]';
        const ringClass = t.ring;
        const glowClass = t.glow;
        html += `
            <div class="lb-podium-col flex flex-col items-center flex-shrink-0 w-20 sm:w-24 ${t.order} ${hiddenCls} transition-all duration-500 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100" data-rank="${rank}">
                <div class="relative mb-2">
                    ${rank === 1 ? `<i class="lb-podium-crown fa-solid fa-crown text-2xl text-yellow-400 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)] opacity-0 scale-50 transition-all duration-350 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100"></i>` : ''}
                    <img src="${d.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName)}" class="${t.avatar} rounded-full object-cover ring-4 ${ringClass} ${glowClass}">
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--card-bg-color)] border-2 border-[var(--card-border-color)] flex items-center justify-center text-xs font-black ${t.textColor}">${rank}</div>
                </div>
                <p class="font-bold text-xs sm:text-sm text-center leading-[1.15] line-clamp-2 min-h-[2.3em] px-0.5 ${isMe ? 'text-[var(--primary-color)]' : 'text-[var(--text-color)]'}">${displayName}</p>
                <p class="text-[11px] font-semibold bg-clip-text text-transparent bg-gradient-to-r ${valGradient} mb-2">${valDisplay}</p>
                <div class="w-full ${t.standH} rounded-t-lg bg-gradient-to-t ${t.standBg} shadow-inner"></div>
            </div>`;
    });
    html += '</div>';
    if (podiumEl) podiumEl.innerHTML = html;
    return html;
}

function playLeaderboardReveal() {
    const cols = document.querySelectorAll('#leaderboard-podium .lb-podium-col');
    if (!cols.length) return;
    const revealCls = ['opacity-100', 'translate-y-0', 'scale-100'];
    const hiddenCls = ['opacity-0', 'translate-y-6', 'scale-90'];
    cols.forEach(el => { el.classList.remove(...revealCls); el.classList.add(...hiddenCls); });
    const crown = document.querySelector('#leaderboard-podium .lb-podium-crown');
    if (crown) { crown.classList.remove('opacity-100', 'scale-100'); crown.classList.add('opacity-0', 'scale-50'); }
    void document.body.offsetWidth;
    [3, 2, 1].forEach((rank, idx) => {
        const el = document.querySelector(`#leaderboard-podium .lb-podium-col[data-rank="${rank}"]`);
        if (el) setTimeout(() => { el.classList.remove(...hiddenCls); el.classList.add(...revealCls); }, idx * 160);
    });
    setTimeout(() => {
        if (crown) { crown.classList.remove('opacity-0', 'scale-50'); crown.classList.add('opacity-100', 'scale-100'); }
    }, 3 * 160 + 180);
}

function updateLeaderboardCountdown() {
    const el = document.getElementById('leaderboard-countdown-text');
    if (!el) return;
    const now = new Date();
    const day = now.getDay();
    const daysUntil = ((8 - day) % 7) || 7;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntil);
    next.setHours(0, 0, 0, 0);
    const totalMin = Math.max(0, Math.floor((next - now) / 60000));
    const d = Math.floor(totalMin / 1440);
    const h = Math.floor((totalMin % 1440) / 60);
    const m = totalMin % 60;
    const prefix = translations[settings.language].leaderboardResetsIn;
    const unit = settings.language === 'id' ? { d: 'h', h: 'j', m: 'm' } : { d: 'd', h: 'h', m: 'm' };
    el.textContent = d > 0 ? `${prefix} ${d}${unit.d} ${h}${unit.h}` : `${prefix} ${h}${unit.h} ${m}${unit.m}`;
}

function startLeaderboardCountdown() {
    updateLeaderboardCountdown();
    stopLeaderboardCountdown();
    lbCountdownInterval = setInterval(updateLeaderboardCountdown, 30000);
}

function stopLeaderboardCountdown() {
    if (lbCountdownInterval) { clearInterval(lbCountdownInterval); lbCountdownInterval = null; }
}

const loadLeaderboard = async () => {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer || isLeaderboardLoading) return; 

    isLeaderboardLoading = true;
    if (!listContainer.querySelector('.skeleton-block')) {
        listContainer.innerHTML = renderLeaderboardSkeleton();
    }

    try {
        if (!navigator.onLine) throw new Error('offline');
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(50));
        const [querySnapshot] = await Promise.all([
            getDocs(q),
            new Promise(resolve => setTimeout(resolve, SKELETON_MIN_DELAY))
        ]);

        leaderboardAllData = [];
        querySnapshot.forEach((docSnap) => { leaderboardAllData.push({ id: docSnap.id, ...docSnap.data() }); });
        renderLeaderboardRows(leaderboardAllData, leaderboardCurrentTab);

    } catch (error) {
        console.error("Leaderboard Error:", error);
        const podiumErrEl = document.getElementById('leaderboard-podium');
        if (podiumErrEl) podiumErrEl.innerHTML = '';
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
                    <i class="fa-solid fa-rotate-right text-xs"></i><span>${translations[settings.language].retryBtn}</span>
                </button>
            </div>
        `;
        document.getElementById('retry-leaderboard-btn')?.addEventListener('click', loadLeaderboard);
    } finally {
        isLeaderboardLoading = false; 
    }
};

function renderLeaderboardRows(allData, tab) {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;

    listContainer.style.transition = 'none';
    listContainer.classList.remove('active-slide');
    listContainer.classList.add('leaderboard-slide');

    let data = allData;
    if (leaderboardSortMode === 'streak') {
        data = [...allData].sort((a, b) => (b.streak || 0) - (a.streak || 0));
    } else if (tab === 'thisweek') {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        const currentWeekStart = monday.toISOString();
        data = allData.filter(d => d.weekStart === currentWeekStart && (d.weeklyScore || 0) > 0)
                      .sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
    }

    let html = '';
    if (!auth || !auth.currentUser) {
        html += `
            <div class="bg-[var(--secondary-color)] p-4 m-2 rounded-lg border border-[var(--primary-color)] text-center flex flex-col items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.2)] mb-4">
                <p class="text-sm font-semibold text-[var(--text-color)]">${translations[settings.language].leaderboardGuestCTA}</p>
                <button id="leaderboard-login-btn" class="btn btn-primary btn-shimmer px-6 py-2 shadow-md flex items-center gap-2">
                    <i class="fa-brands fa-google"></i> <span>${translations[settings.language].loginBtn}</span>
                </button>
            </div>`;
    }

    if (data.length === 0) {
        renderLeaderboardPodium([], tab);
        html += `
            <div class="p-10 text-center flex flex-col items-center gap-4 animate-fadeIn">
                <div class="w-16 h-16 bg-[rgba(var(--primary-color-rgb),0.1)] rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-calendar-xmark text-3xl text-[var(--primary-color)]"></i>
                </div>
                <div>
                    <p class="text-[var(--text-color)] font-bold text-lg">${translations[settings.language].leaderboardNoData || 'No data for this period.'}</p>
                    <p class="text-[var(--subtle-text-color)] text-sm mt-1">${translations[settings.language].leaderboardNoDataSub || 'Be the first to score points and claim the top spot!'}</p>
                </div>
            </div>`;
        listContainer.innerHTML = `<div class="p-1 pb-2">${html}</div>`;
        requestAnimationFrame(() => {
            listContainer.style.transition = '';
            requestAnimationFrame(() => listContainer.classList.add('active-slide'));
        });
        document.getElementById('leaderboard-login-btn')?.addEventListener('click', handleLogin);
        return;
    }

    renderLeaderboardPodium(data.slice(0, 3), tab);

    const formatLbStreak = (days) => {
        if (days <= 0) return `0d`;
        const years = Math.floor(days / 365);
        if (years >= 2) return `${years}yrs`;
        if (years === 1) return `1yr`;
        return `${days}d`;
    };

    const isStreakSort = leaderboardSortMode === 'streak';
    const buildRow = (d, rank, sticky) => {
        const isMe = auth && auth.currentUser && auth.currentUser.uid === d.id;
        const userLevel = calculateLevel(d.totalScore || 0);
        const displayName = d.username || 'User' + Math.floor(1000 + Math.random() * 9000);
        const streakLabel = formatLbStreak(d.streak || 0);
        const xpVal = formatXP(tab === 'thisweek' ? (d.weeklyScore || 0) : (d.totalScore || 0));
        const primaryVal = isStreakSort ? streakLabel : xpVal;
        const primaryGradient = isStreakSort ? 'from-orange-400 to-amber-500' : 'from-[var(--primary-color)] to-[#a78bfa]';
        const metaLine = isStreakSort
            ? `<i class="fa-solid fa-star text-[var(--primary-color)] text-[10px]"></i>${xpVal} &middot; Lv.${userLevel}`
            : `<i class="fa-solid fa-fire text-orange-500 text-[10px]"></i>${streakLabel} &middot; Lv.${userLevel}`;
        const wrapClass = sticky
    ? 'sticky bottom-0 mt-2 border-2 z-10 border-[var(--home-leaderboard-accent)] bg-[var(--bg-color-dark)] shadow-[0_-6px_18px_rgba(0,0,0,0.45),0_0_16px_rgba(250,204,21,0.3)]'
    : `mb-2 transition-all duration-300 hover:border-[var(--primary-color)] active:border-[var(--primary-color)] hover:-translate-y-0.5 active:-translate-y-0.5 ${isMe ? 'border-2 border-[var(--primary-color)] bg-[rgba(var(--primary-color-rgb),0.15)] shadow-[0_0_12px_rgba(var(--primary-color-rgb),0.5)]' : 'border-[var(--card-border-color)] bg-[var(--card-bg-color)]'}`;
const rankColor = sticky ? 'text-[var(--home-leaderboard-accent)]' : 'text-[var(--subtle-text-color)]';
const nameColor = sticky ? 'text-[var(--home-leaderboard-accent)]' : (isMe ? 'text-[var(--primary-color)]' : 'text-[var(--text-color)]');
        const youTag = sticky ? ` <span class="font-normal opacity-70">(${translations[settings.language].leaderboardYou})</span>` : '';
        return `
            <div class="flex items-center gap-2.5 p-2.5 rounded-xl border ${wrapClass}">
                <div class="w-5 flex-shrink-0 text-center font-bold text-xs ${rankColor}">${rank}</div>
                <img src="${d.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName)}" class="w-8 h-8 rounded-full object-cover border border-[var(--card-border-color)] flex-shrink-0">
                <div class="flex-1 min-w-0 text-left">
                    <p class="font-semibold text-sm truncate ${nameColor}">${displayName}${youTag}</p>
                    <p class="text-[11px] text-[var(--subtle-text-color)] flex items-center gap-1 mt-0.5">
                        ${metaLine}
                    </p>
                </div>
                <div class="flex-shrink-0 font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r ${primaryGradient}">${primaryVal}</div>
            </div>`;
    };

    data.slice(3).forEach((d, i) => { html += buildRow(d, i + 4, false); });

    listContainer.innerHTML = `<div class="p-1 pb-2">${html}</div>`;

    if (auth && auth.currentUser) {
        const myIndex = data.findIndex(d => d.id === auth.currentUser.uid);
        if (myIndex !== -1) {
            listContainer.insertAdjacentHTML('beforeend', buildRow(data[myIndex], myIndex + 1, true));
        }
    }

    requestAnimationFrame(() => {
        listContainer.style.transition = '';
        requestAnimationFrame(() => listContainer.classList.add('active-slide'));
    });
    if (!auth || !auth.currentUser) document.getElementById('leaderboard-login-btn')?.addEventListener('click', handleLogin);

    playLeaderboardReveal();
}

function setLeaderboardSort(mode) {
    if (leaderboardSortMode === mode) return;
    leaderboardSortMode = mode;
    const xpBtn = document.getElementById('lb-sort-xp');
    const streakBtn = document.getElementById('lb-sort-streak');
    const periodTabs = document.getElementById('lb-period-tabs');
    const banner = document.getElementById('leaderboard-week-banner');

    if (xpBtn && streakBtn) {
        if (mode === 'xp') {
            xpBtn.style.background = 'rgba(var(--primary-color-rgb),0.18)';
            xpBtn.style.color = 'var(--primary-color)';
            xpBtn.style.borderColor = 'rgba(var(--primary-color-rgb),0.4)';
            streakBtn.style.background = 'transparent';
            streakBtn.style.color = 'var(--subtle-text-color)';
            streakBtn.style.borderColor = 'var(--card-border-color)';
        } else {
            streakBtn.style.background = 'rgba(249,115,22,0.18)';
            streakBtn.style.color = '#fb923c';
            streakBtn.style.borderColor = 'rgba(249,115,22,0.4)';
            xpBtn.style.background = 'transparent';
            xpBtn.style.color = 'var(--subtle-text-color)';
            xpBtn.style.borderColor = 'var(--card-border-color)';
        }
    }

    if (periodTabs) periodTabs.style.display = mode === 'streak' ? 'none' : 'flex';
    if (mode === 'streak') {
        if (banner) banner.style.display = 'none';
        stopLeaderboardCountdown();
    } else if (leaderboardCurrentTab === 'thisweek') {
        if (banner) banner.style.display = 'flex';
        startLeaderboardCountdown();
    }

    if (leaderboardAllData.length > 0) renderLeaderboardRows(leaderboardAllData, leaderboardCurrentTab);
}

function filterLeaderboard(tab) {
    leaderboardCurrentTab = tab;
    const indicator = document.getElementById('lb-tab-indicator');
    const allBtn = document.getElementById('tab-alltime');
    const weekBtn = document.getElementById('tab-thisweek');
    const banner = document.getElementById('leaderboard-week-banner');

    if (indicator) indicator.style.transform = tab === 'thisweek' ? 'translateX(100%)' : 'translateX(0)';
    if (allBtn && weekBtn) {
        allBtn.classList.remove('text-[#241b03]', 'text-[var(--subtle-text-color)]');
        weekBtn.classList.remove('text-[#241b03]', 'text-[var(--subtle-text-color)]');
        allBtn.classList.add(tab === 'alltime' ? 'text-[#241b03]' : 'text-[var(--subtle-text-color)]');
        weekBtn.classList.add(tab === 'thisweek' ? 'text-[#241b03]' : 'text-[var(--subtle-text-color)]');
    }
    if (banner) banner.style.display = tab === 'thisweek' ? 'flex' : 'none';

    if (tab === 'thisweek') startLeaderboardCountdown();
    else stopLeaderboardCountdown();

    if (leaderboardAllData.length > 0) renderLeaderboardRows(leaderboardAllData, tab);
}

// --- Home Screen Leaderboard Preview (top 3, lightweight — separate from the full leaderboard screen) ---
async function loadHomeLeaderboardPreview() {
    const wrap = document.getElementById('home-leaderboard-preview');
    if (!wrap) return;
    wrap.innerHTML = renderHomeLeaderboardSkeleton();

    try {
        if (!navigator.onLine) throw new Error('offline');
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((docSnap) => data.push({ id: docSnap.id, ...docSnap.data() }));
        renderHomeLeaderboardPreview(data);
    } catch (error) {
        console.error("Home leaderboard preview error:", error);
        wrap.innerHTML = `<p class="text-center text-xs py-3" style="color:var(--subtle-text-color);">${translations[settings.language].leaderboardError || 'Error loading leaderboard.'}</p>`;
    }
}

function renderHomeLeaderboardSkeleton(count = 3) {
    let rows = '';
    for (let i = 0; i < count; i++) {
        rows += `<div class="flex items-center gap-2.5 p-2 rounded-xl mb-1.5">
            <div class="skeleton-block w-5 h-5 rounded-full flex-shrink-0"></div>
            <div class="skeleton-block w-7 h-7 rounded-full flex-shrink-0"></div>
            <div class="flex-1 min-w-0"><div class="skeleton-block h-3 w-20 rounded-full"></div></div>
            <div class="skeleton-block h-3 w-10 rounded-full flex-shrink-0"></div>
        </div>`;
    }
    return rows;
}

function renderHomeLeaderboardPreview(data) {
    const wrap = document.getElementById('home-leaderboard-preview');
    if (!wrap) return;

    if (!data || data.length === 0) {
        wrap.innerHTML = `<p class="text-center text-xs py-3" style="color:var(--subtle-text-color);">${translations[settings.language].leaderboardNoData || 'No data for this period.'}</p>`;
        return;
    }

    const rankColors = ['#facc15', '#d1d5db', '#d97706'];
    wrap.innerHTML = data.map((d, i) => {
        const isMe = auth && auth.currentUser && auth.currentUser.uid === d.id;
        const displayName = d.username || 'User' + Math.floor(1000 + Math.random() * 9000);
        const userLevel = calculateLevel(d.totalScore || 0);
        const xpVal = formatXP(d.totalScore || 0);
        return `
        <div class="flex items-center gap-2.5 p-2 rounded-xl mb-1.5 last:mb-0" style="${isMe ? 'background:rgba(var(--primary-color-rgb),0.14); border:1px solid var(--primary-color);' : 'background:var(--secondary-color); border:1px solid transparent;'}">
            <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style="background:${rankColors[i] || 'var(--card-bg-color)'}; color:#1a1330;">${i + 1}</div>
            <img src="${d.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName)}" class="w-7 h-7 rounded-full object-cover border border-[var(--card-border-color)] flex-shrink-0">
            <div class="flex-1 min-w-0 text-left">
                <div class="flex items-center gap-1.5">
                    <span class="font-bold text-xs truncate" style="color:${isMe ? 'var(--primary-color)' : 'var(--text-color)'};">${displayName}</span>
                    <span class="text-[9px] px-1 py-0.5 rounded font-medium flex-shrink-0" style="background:var(--card-bg-color); border:1px solid var(--card-border-color); color:var(--subtle-text-color);">Lv.${userLevel}</span>
                </div>
            </div>
            <div class="flex items-center gap-1 text-xs font-bold flex-shrink-0" style="color:var(--text-color);">
                <i class="fa-solid fa-star text-[10px]" style="color:#facc15;"></i>${xpVal}
            </div>
        </div>`;
    }).join('');
}

// ============================================================================
// 11. LIBRARY, BOOKMARKS & FOTD
// ============================================================================
function renderLibraryCategories() {
    const container = document.querySelector('#library-categories-screen .grid');
    if(!container) return;
    container.innerHTML = '';
    const categories = [
        { id: 'bookmarks', icon: 'fa-bookmark', action: () => showBookmarksLibrary(), span: 'md:col-span-2' },
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
        card.className = `card accent-card p-4 rounded-lg text-left flex flex-col justify-between ${cat.span || ''}`;        
        card.innerHTML = `
            <div>
                <h3 class="font-bold text-lg flex items-center"><i class="fa-solid ${cat.icon} fa-fw mr-3 accent-icon"></i>${translations[settings.language]['lib_'+cat.id+'_title']}</h3>
                <p class="text-sm text-subtle pl-9">${translations[settings.language]['lib_'+cat.id+'_desc'] || ''}</p>
            </div>
            <div class="mt-4"><button class="btn btn-view-outline w-full py-2 flex items-center justify-center gap-2"><span data-translate-key="viewBtn">${translations[settings.language].viewBtn}</span><i class="fa-solid fa-chevron-right text-xs"></i></button></div>`;
        card.querySelector('button').onclick = cat.action;
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

// Filter tombol negara di screen Subdivisions/Territories/Historical
function filterCountrySelector(inputEl) {
    const screen = inputEl.closest('.screen');
    if (!screen) return;
    const searchTerm = inputEl.value.toLowerCase().trim();
    const grid = screen.querySelector('.grid');
    if (!grid) return;
    const buttons = grid.querySelectorAll('button');
    let visibleCount = 0;

    buttons.forEach(btn => {
        const match = btn.textContent.toLowerCase().includes(searchTerm);
        btn.style.display = match ? '' : 'none';
        if (match) visibleCount++;
    });

    let emptyState = grid.querySelector('.selector-empty-state');
    if (visibleCount === 0 && buttons.length > 0) {
        if (!emptyState) {
            emptyState = document.createElement('p');
            emptyState.className = 'selector-empty-state col-span-full py-10 text-center text-subtle text-sm';
            emptyState.textContent = translations[settings.language].searchNoFlags || 'No results found.';
            grid.appendChild(emptyState);
        } else {
            emptyState.style.display = 'block';
        }
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
}

function showLibrary(category, subCategory = null) {
    localStorage.setItem('libraryState', JSON.stringify({ category, subCategory }));
    let data = [], titleKey = '', title = '', backScreen = 'library-categories-screen';

    switch(category) {
        case 'official': data = [...officialCountries]; titleKey = 'lib_official_title'; break;
        case 'subdivisions': data = subdivisions.filter(s => s.country === subCategory); title = `${subCategory} Subdivisions`; backScreen = 'subdivision-library-screen'; break;
        case 'territories': data = territories.filter(t => t.country === subCategory); title = `${subCategory} Territories`; backScreen = 'territory-library-screen'; break;
        case 'unofficial': data = [...unofficial]; titleKey = 'lib_unofficial_title'; break;
        case 'historical': data = historicalFlags.filter(h => h.country === subCategory); title = `${subCategory} Historical Flags`; backScreen = 'historical-library-screen'; break;
        case 'organizations': data = [...worldOrganizations]; titleKey = 'lib_organizations_title'; break;
        case 'continent': 
            if (continentFlags[subCategory]) {
                data = [...continentFlags[subCategory]]; 
                data.sort((a, b) => {
                    const typeCompare = (a.type || '').localeCompare(b.type || '');
                    if (typeCompare !== 0) return typeCompare;
                    return a.name.localeCompare(b.name);
                });
            }
            title = `${subCategory} Flags`; backScreen = 'continent-library-screen'; break;
    }

    const titleEl = document.getElementById('library-title-display');
    if (titleEl) {
        if (titleKey) {
            titleEl.dataset.translateKey = titleKey;
            titleEl.textContent = (translations[settings.language] && translations[settings.language][titleKey]) || titleKey;
        } else {
            delete titleEl.dataset.translateKey; titleEl.textContent = title;
        }
    }

    const backBtn = document.getElementById('back-from-library-btn');
    if (backBtn) backBtn.onclick = () => { localStorage.removeItem('libraryState'); showScreen(backScreen); };

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
    let isFirstHeading = true;
    data.forEach(item => {
        if (item.type && item.type !== currentType) {
            currentType = item.type;
            const subHeading = document.createElement('div');
            const topSpacing = isFirstHeading ? 'mt-1.5' : 'mt-10';
            subHeading.className = `col-span-full ${topSpacing} mb-4 border-b-2 border-[var(--card-border-color)] pb-3`;
            subHeading.innerHTML = `<h3 class="text-xl font-bold text-[var(--primary-color)] flex items-center justify-start gap-3 text-left"><i class="fa-solid fa-layer-group opacity-70"></i>${currentType}</h3>`;
            fragment.appendChild(subHeading);
            isFirstHeading = false;
        }

        let displayName = item.name;
        let infoInParentheses = "";
        const match = displayName.match(/\(([^)]+)\)/);
        if (match) {
            infoInParentheses = match[1];
            displayName = displayName.replace(/\s*\([^)]*\)/g, "").trim();
        }

        let badgeHTML = '';
        if (item.status) {
            const unofficialLabel = (translations[settings.language] && translations[settings.language].unofficialModalTitle) || 'Unofficial';
            badgeHTML = `<span class="status-badge badge-unofficial" onclick="event.stopPropagation(); openUnofficialInfoModal();"><i class="fa-solid fa-circle-info mr-1"></i>${unofficialLabel}</span>`;
        }

        let subText = item.capital || item.years || item.year || infoInParentheses || "";
        const sourceBadgeHTML = item.source ? `<span class="flag-source-badge">${item.source}</span>` : '';

        const card = document.createElement('div');
        card.className = 'card lib-flag-card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
        card.dataset.name = item.name.toLowerCase();
        const bmarkSet = loadBookmarks();
        const isStarred = bmarkSet.has(item.name);
        const flagVisual = hasFlagImage(item)
            ? `<img src="${item.flag}" alt="${item.name} flag" class="flag-img w-full h-full object-cover transition-opacity duration-300" loading="lazy" onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Dead+Link'; this.style.opacity=1;" onload="this.style.opacity=1" />`
            : `<span class="text-subtle text-[10px] font-semibold leading-tight px-2 text-center" data-translate-key="noDesignAvailable">${translations[settings.language].noDesignAvailable || 'No design available.'}</span>`;

        card.innerHTML = `
            ${badgeHTML}
            <button class="bookmark-btn absolute top-1 left-1 p-1 z-20 ${isStarred ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}" onclick="event.stopPropagation(); toggleBookmarkUI(this, '${item.name.replace(/'/g, "\\'")}')">
                <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star text-sm"></i>
            </button>    
            <div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center">
    <div class="flag-img-frame">
        ${flagVisual}
        ${sourceBadgeHTML}
    </div>
</div>
            <div class="flex-grow flex flex-col justify-center py-1 w-full">
                <div class="flex flex-col w-full px-1">
                    <p class="font-semibold text-[13px] leading-tight break-words line-clamp-2">${displayName}</p>
                    <p class="text-subtle text-[10px] font-medium mt-1 break-words">${subText || '&nbsp;'}</p>
                </div>
            </div>
            </div>`;
        card.onclick = () => openLibraryQuickSheet(item, card);
        fragment.appendChild(card); 
    });

    grid.appendChild(fragment);
    const searchInput = document.getElementById('library-search-input');
    if (searchInput) searchInput.value = '';
    showScreen('library-display-screen');
}

function filterLibrary(event) {
    const searchTerm = event.target.value.toLowerCase();
    const grid = document.getElementById('library-grid');
    const cards = grid.querySelectorAll('.card');
    let visibleCount = 0;

    cards.forEach(card => {
        if ((card.dataset.name || '').includes(searchTerm)) {
            card.style.display = 'flex'; visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    let emptyState = document.getElementById('library-empty-state');
    if (visibleCount === 0 && cards.length > 0) {
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.id = 'library-empty-state';
            emptyState.className = 'col-span-full py-16 text-center text-subtle flex flex-col items-center w-full';
            emptyState.innerHTML = `
                <i class="fa-solid fa-magnifying-glass text-5xl mb-4 opacity-30"></i>
                <p class="text-lg font-bold">${translations[settings.language].searchNoFlags}</p>
                <p class="text-sm">${translations[settings.language].searchTryDifferent}</p>`;
            grid.appendChild(emptyState);
        } else {
            emptyState.style.display = 'flex';
        }
    } else if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// Bookmarks Logic
function loadBookmarks() {
    try { return new Set(JSON.parse(localStorage.getItem('flagx-bookmarks') || '[]')); }
    catch(e) { return new Set(); }
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('flagx-bookmarks', JSON.stringify([...bookmarks]));
}

function toggleBookmarkUI(btn, flagName) {
    const bookmarks = loadBookmarks();
    let isStarred = false;

    if (bookmarks.has(flagName)) {
        bookmarks.delete(flagName);
        btn.classList.remove('text-yellow-400');
        btn.classList.add('text-gray-500');
        btn.innerHTML = '<i class="fa-regular fa-star text-sm"></i>';
        showToast(translations[settings.language].bookmarkRemoved || 'Bookmark removed');
    } else {
        bookmarks.add(flagName);
        btn.classList.remove('text-gray-500');
        btn.classList.add('text-yellow-400');
        btn.innerHTML = '<i class="fa-solid fa-star text-sm"></i>';
        showToast(translations[settings.language].bookmarkAdded || 'Bookmarked! ⭐');
    }
    saveBookmarks(bookmarks);
    btn.classList.remove('right-1');
    btn.classList.add('left-1', 'absolute', 'top-1');
}

function showBookmarksLibrary() {
    const b = loadBookmarks();
    const allFlags = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations];
    const data = allFlags.filter(f => b.has(f.name));
    
    const titleEl = document.getElementById('library-title-display');
    if (titleEl) {
        titleEl.dataset.translateKey = 'lib_bookmarks_title';
        titleEl.textContent = translations[settings.language].lib_bookmarks_title || 'My Bookmarks';
    }
    
    const backBtn = document.getElementById('back-from-library-btn');
    if (backBtn) backBtn.onclick = () => { localStorage.removeItem('libraryState'); showScreen('library-categories-screen'); };
    
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full';
    
    if (data.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'col-span-full text-center py-12 text-subtle flex flex-col items-center justify-center';
        emptyState.innerHTML = `
            <i class="fa-regular fa-star text-5xl mb-4 opacity-40"></i>
            <p class="font-bold text-xl mb-1" data-translate-key="noBookmarksMsg">${translations[settings.language].noBookmarksMsg || "You haven't bookmarked any flags."}</p>
            <p class="text-sm mb-12" data-translate-key="noBookmarksSub">${translations[settings.language].noBookmarksSub || "Explore the library and click the star icon on any flag to save it here for a quick study session!"}</p>
            <button onclick="openBookmarkQuizTypeModal()" class="btn btn-primary w-[80%] max-w-[300px] py-3 text-white font-bold flex items-center justify-center gap-2 mx-auto shadow-lg">
                <i class="fa-solid fa-graduation-cap"></i> <span data-translate-key="startBookmarkQuiz">${translations[settings.language].startBookmarkQuiz || 'Study Quiz'}</span>
            </button>
        `;
        grid.appendChild(emptyState);
        showScreen('library-display-screen');
        return;
    }

    const studyBtn = document.createElement('div');
    studyBtn.className = 'col-span-full mb-2';
    studyBtn.innerHTML = `<button onclick="openBookmarkQuizTypeModal()" class="btn btn-primary w-full py-3 text-white font-bold flex items-center justify-center gap-2"><i class="fa-solid fa-graduation-cap"></i> <span data-translate-key="startBookmarkQuiz">${translations[settings.language].startBookmarkQuiz || 'Study Quiz'}</span></button>`;
    grid.appendChild(studyBtn);

    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card lib-flag-card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
        card.dataset.name = item.name.toLowerCase();
        const flagVisual = hasFlagImage(item)
            ? `<img src="${item.flag}" alt="${item.name} flag" class="flag-img w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image';">`
            : `<span class="text-subtle text-[10px] font-semibold leading-tight px-2 text-center" data-translate-key="noDesignAvailable">${translations[settings.language].noDesignAvailable || 'No design available.'}</span>`;
        const sourceBadgeHTML = item.source ? `<span class="flag-source-badge">${item.source}</span>` : '';
        
        card.innerHTML = `
            <button class="bookmark-btn absolute top-1 left-1 p-1 z-20 text-yellow-400" onclick="event.stopPropagation(); toggleBookmarkUI(this, '${item.name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-star text-sm"></i>
            </button>
            <div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center">
                ${flagVisual}
                ${sourceBadgeHTML}
            </div>
            <div class="flex-grow flex flex-col justify-center py-1 w-full">
                 <div class="flex flex-col w-full px-1">
                    <p class="font-semibold text-[13px] leading-tight break-words line-clamp-2">${item.name}</p>
                 </div>
            </div>
            </div>`;
        card.onclick = () => openLibraryQuickSheet(item, card);
        fragment.appendChild(card);
    });
    grid.appendChild(fragment);
    showScreen('library-display-screen');
}

function openLibraryQuickSheet(item, cardEl) {
    const sheet = document.getElementById('library-quick-sheet');
    if (!sheet) return;
    if (activeLibCard && activeLibCard !== cardEl) activeLibCard.classList.remove('card-active');
    activeLibCard = cardEl || null;
    if (cardEl) cardEl.classList.add('card-active');
    const imgEl = document.getElementById('quick-sheet-img');
    const placeholderEl = document.getElementById('quick-sheet-img-placeholder');
    const nameEl = document.getElementById('quick-sheet-name');
    const subEl = document.getElementById('quick-sheet-sub');
    const detailBtn = document.getElementById('quick-sheet-detail-btn');
    const funFactBtn = document.getElementById('quick-sheet-funfact-btn');

    if (hasFlagImage(item)) {
        imgEl.src = item.flag;
        imgEl.classList.remove('hidden');
        if (placeholderEl) placeholderEl.classList.add('hidden');
    } else {
        imgEl.classList.add('hidden');
        if (placeholderEl) placeholderEl.classList.remove('hidden');
    }

    const parenMatch = item.name.match(/\(([^)]+)\)/);
    nameEl.textContent = parenMatch ? item.name.replace(/\s*\([^)]*\)/g, '').trim() : item.name;
    const subText = item.capital || item.years || item.year || (parenMatch ? parenMatch[1] : '') || item.country || '';
    subEl.textContent = subText;
    subEl.classList.toggle('hidden', !subText);

    detailBtn.onclick = () => { closeLibraryQuickSheet(); getFlagDetail(item.name, item.flag); };
    funFactBtn.onclick = () => { closeLibraryQuickSheet(); getFunFact(item.name); };

    sheet.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeLibraryQuickSheet() {
    closeSheet(document.getElementById('library-quick-sheet'));
}

function releaseActiveLibCardIfAllClosed() {
    const quickSheet = document.getElementById('library-quick-sheet');
    const detailModal = document.getElementById('detail-modal');
    const funFactModal = document.getElementById('gemini-modal');
    const stillOpen = [quickSheet, detailModal, funFactModal].some(el => el && el.classList.contains('active'));
    if (!stillOpen && activeLibCard) {
        activeLibCard.classList.remove('card-active');
        activeLibCard = null;
    }
}

function initFlagOfTheDay() {
    const allFlags = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations].filter(hasFlagImage);
    if (allFlags.length === 0) return;

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
        if (nameEl) nameEl.textContent = dailyFlag.name;
        if (imgEl) {
            imgEl.style.opacity = '0';
            if (containerEl) containerEl.classList.add('animate-pulse');
            imgEl.src = dailyFlag.image || dailyFlag.flag; 
            imgEl.onload = () => { imgEl.style.opacity = '1'; if (containerEl) containerEl.classList.remove('animate-pulse'); };
            imgEl.onerror = () => { if (containerEl) containerEl.classList.remove('animate-pulse'); };
        }
        if (btnEl) btnEl.onclick = (e) => { e.preventDefault(); getFunFact(dailyFlag.name); };
    }
}

function initDailyChallengeBanner() {
    const badge = document.getElementById('daily-done-badge');
    const sub   = document.getElementById('daily-banner-sub');
    const isDone = localStorage.getItem('flagx-daily-date') === new Date().toDateString();
    const lang = settings.language;
    if (badge) badge.classList.toggle('hidden', !isDone);
    if (sub) sub.textContent = isDone
        ? (lang === 'id' ? 'Sudah dimainkan hari ini! Besok ada soal baru.' : 'Completed! Come back tomorrow for new flags.')
        : (lang === 'id' ? '10 soal · Sama untuk semua orang hari ini' : '10 flags · Same for everyone today');
}

// ============================================================================
// 12. QUIZ ENGINE
// ============================================================================
function renderHomeQuickExplore() {
    const wrap = document.getElementById('home-quick-explore');
    if (!wrap) return;
    const items = [
        { key: 'bookmarks', icon: 'fa-bookmark', action: () => showBookmarksLibrary() },
        { key: 'continent', icon: 'fa-earth-americas', action: () => showScreen('continent-library-screen') },
        { key: 'historical', icon: 'fa-scroll', action: () => showScreen('historical-library-screen') },
        { key: 'official', icon: 'fa-flag', action: () => showLibrary('official') }
    ];
    wrap.innerHTML = '';
    items.forEach(item => {
        const chip = document.createElement('button');
        chip.className = 'carousel-chip w-full aspect-square flex flex-col items-center justify-center gap-1.5 rounded-2xl py-2';
        chip.style.background = 'var(--card-bg-color)';
        chip.style.border = '1px solid var(--card-border-color)';
        chip.innerHTML = `
            <i class="fa-solid ${item.icon} text-lg" style="color:var(--home-library-accent);"></i>
            <span class="text-[10px] font-bold leading-tight text-center px-1">${translations[settings.language]['lib_'+item.key+'_title']}</span>`;
        chip.onclick = item.action;
        wrap.appendChild(chip);
    });
}

function renderQuizModes() {
    const container = document.querySelector('#quiz-modes-screen .grid');
    const carousel = document.getElementById('quiz-modes-carousel');
    if(!container) return;
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

    if (carousel) {
        carousel.innerHTML = '';
        const quickAccessIds = ['classic', 'time', 'survival', 'capital'];
        quickAccessIds.forEach(id => {
            const mode = modes.find(m => m.id === id);
            if (!mode) return;
            const chip = document.createElement('button');
            chip.className = 'carousel-chip flex-shrink-0 flex flex-col items-center justify-center gap-1.5 w-24 h-24 rounded-2xl';
            chip.style.background = 'var(--card-bg-color)';
            chip.style.border = '1px solid var(--card-border-color)';
            chip.innerHTML = `
                <i class="fa-solid ${mode.icon} text-xl accent-icon"></i>
                <span class="text-[11px] font-bold leading-tight text-center px-1">${translations[settings.language]['mode_'+mode.id+'_title']}</span>`;
            chip.onclick = mode.action;
            carousel.appendChild(chip);
        });
    }

    modes.forEach(mode => {
        const card = document.createElement('div');
        card.className = `card accent-card p-4 rounded-lg text-left flex flex-col justify-between ${mode.span || ''}`;        
        card.innerHTML = `
            <div>
                <h3 class="font-bold text-lg flex items-center"><i class="fa-solid ${mode.icon} fa-fw mr-3 accent-icon"></i>${translations[settings.language]['mode_'+mode.id+'_title']}</h3>
                <p class="text-sm text-subtle pl-9">${translations[settings.language]['mode_'+mode.id+'_desc']}</p>
            </div>
            <div class="mt-4"><button class="btn btn-primary w-full py-2 flex items-center justify-center gap-2"><i class="fa-solid fa-play text-xs"></i><span data-translate-key="playQuizBtn">${translations[settings.language].playQuizBtn}</span></button></div>`;
        card.querySelector('button').onclick = mode.action;
        container.appendChild(card);
    });
}

function startQuiz(mode, subMode = null) {
    if (mode === 'daily') { startDailyChallenge(); return; } // redirect agar kena cek "sudah selesai"  
    currentQuiz = {
        ...currentQuiz, mode: mode, lastMode: mode, lastSubMode: subMode, score: 0, questionNumber: 0, 
        timeLeft: 0, lives: (mode === 'survival' || mode === 'combo') ? 1 : 999, correctCount: 0, wrongCount: 0, 
        timeoutCount: 0, responseTimes: [], questionStartTime: null, missedFlags: [], comboStreak: 0
    };

    const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());

    switch (mode) {
        case 'classic': currentQuiz.dataset = shuffle(officialCountries.filter(hasFlagImage)); currentQuiz.totalQuestions = 20; break;
        case 'continent': currentQuiz.dataset = shuffle((continentFlags[subMode] || []).filter(hasFlagImage)); currentQuiz.totalQuestions = 20; break;
        case 'capitalGuess': currentQuiz.dataset = shuffle(capitalGuessData.filter(hasFlagImage)); currentQuiz.totalQuestions = 20; break;
        case 'yearGuess': currentQuiz.dataset = shuffle(historicalFlags.filter(hasFlagImage)); currentQuiz.totalQuestions = 20; break;
        case 'timeAttack': currentQuiz.dataset = shuffle(generalFlagPool); currentQuiz.totalQuestions = Infinity; currentQuiz.timeLeft = 60; break;
        case 'survival': currentQuiz.dataset = shuffle(generalFlagPool); currentQuiz.totalQuestions = 30; break;
        case 'combo': currentQuiz.dataset = shuffle([...officialCountries, ...subdivisions]); currentQuiz.totalQuestions = Infinity; currentQuiz.timeLeft = 90; break;
    }

    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = "0";

    const timerEl = document.getElementById('timer');
    const hasTimer = currentQuiz.timeLeft > 0;
    if (timerEl) { timerEl.style.display = hasTimer ? 'block' : 'none'; timerEl.textContent = currentQuiz.timeLeft; }

    // Timer bar reset
    const timerBarWrapper = document.getElementById('timer-bar-wrapper');
    const timerBarFill = document.getElementById('timer-bar-fill');
    if (timerBarWrapper) timerBarWrapper.classList.toggle('hidden', !hasTimer);
    if (timerBarFill && hasTimer) {
        timerBarFill.style.transition = 'none';
        timerBarFill.style.width = '100%';
        timerBarFill.style.background = 'var(--success-color)';
    }

    if (hasTimer) startTimer();
    _syncInputModeForMode(mode); 
    showScreen('quiz-screen');
    loadQuestion();
}

// --- DAILY CHALLENGE ---
function seededRandom(seed) {
    let s = seed;
    return function() {
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
        return (s >>> 0) / 0xFFFFFFFF;
    };
}

function getDailyQuestions() {
    const t = new Date();
    const seed = t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
    const rand = seededRandom(seed);
    const pool = officialCountries.filter(hasFlagImage);
    const selected = []; const used = new Set();
    while (selected.length < 10) {
        const idx = Math.floor(rand() * pool.length);
        if (!used.has(idx)) { used.add(idx); selected.push(pool[idx]); }
    }
    return selected;
}

function startDailyChallenge() {
    const todayStr = new Date().toDateString();
    if (localStorage.getItem('flagx-daily-date') === todayStr) {
        showToast(translations[settings.language].dailyCompleted || '✅ Already completed today!');
        return;
    }
    currentQuiz = {
        ...currentQuiz, mode: 'classic', lastMode: 'daily', lastSubMode: null,
        score: 0, questionNumber: 0, timeLeft: 0, lives: 999,
        missedFlags: [], comboStreak: 0,
        dataset: getDailyQuestions(), totalQuestions: 10,
        correctCount: 0, wrongCount: 0, timeoutCount: 0,
        responseTimes: [], questionStartTime: null
    };
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = '0';
    const timerEl = document.getElementById('timer');
    if (timerEl) { timerEl.style.display = 'none'; }
    const timerBarWrapper = document.getElementById('timer-bar-wrapper');
    if (timerBarWrapper) timerBarWrapper.classList.add('hidden');
    _syncInputModeForMode('daily');
    showScreen('quiz-screen');
    loadQuestion();
}

function startBookmarkQuiz(quizType = 'flag') {
    const b = loadBookmarks();
    if (b.size === 0) { showToast(translations[settings.language].noBookmarksMsg || 'No bookmarks yet!'); return; }
    const allFlags = [...officialCountries, ...subdivisions, ...territories, ...unofficial, ...historicalFlags, ...worldOrganizations];
    const bookmarkedData = allFlags.filter(f => b.has(f.name));
    // distractorSource: dipakai sebagai opsi teks ibu kota (tidak butuh gambar)
    // pool: subset yang benar-benar punya gambar — hanya ini yang boleh jadi soal
    const distractorSource = quizType === 'capital' ? bookmarkedData.filter(f => f.capital) : bookmarkedData;
    const pool = distractorSource.filter(hasFlagImage);

    if (pool.length < 4) {
        const msg = quizType === 'capital' ? translations[settings.language].notEnoughBookmarksCapital : translations[settings.language].notEnoughBookmarks;
        showToast(msg || 'Add at least 4 bookmarked flags to start a quiz.');
        return;
    }

    currentQuiz = { 
        ...currentQuiz, mode: quizType === 'capital' ? 'capitalGuess' : 'classic', lastMode: 'bookmarks', lastSubMode: null,
        bookmarkQuizType: quizType, score: 0, questionNumber: 0, 
        timeLeft: 0, lives: 999, missedFlags: [], comboStreak: 0, dataset: [...pool].sort(() => 0.5 - Math.random()), 
        bookmarkedPool: [...distractorSource], totalQuestions: Math.min(pool.length, 20),
        correctCount: 0, wrongCount: 0, timeoutCount: 0, responseTimes: [], questionStartTime: null 
    };
    
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = '0';
    const timerEl = document.getElementById('timer');
    if (timerEl) { timerEl.style.display = 'none'; timerEl.textContent = ''; }
    const timerBarWrapper = document.getElementById('timer-bar-wrapper');
    if (timerBarWrapper) timerBarWrapper.classList.add('hidden');
    _syncInputModeForMode('bookmarks');
    showScreen('quiz-screen');
    loadQuestion();
}

function openBookmarkQuizTypeModal() {
    const modal = document.getElementById('bookmark-quiz-type-modal');
    if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
}

function closeBookmarkQuizTypeModal() {
    closeSheet(document.getElementById('bookmark-quiz-type-modal'));
}

function selectBookmarkQuizType(quizType) {
    closeBookmarkQuizTypeModal();
    startBookmarkQuiz(quizType);
}

function openUnofficialInfoModal() {
    const modal = document.getElementById('unofficial-info-modal');
    if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
}

function closeUnofficialInfoModal() {
    document.getElementById('unofficial-info-modal')?.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function updateQuestionCounter() { 
    const el = document.getElementById('question-counter'); 
    if(el) el.textContent = currentQuiz.totalQuestions !== Infinity ? `${currentQuiz.questionNumber} / ${currentQuiz.totalQuestions}` : `Q: ${currentQuiz.questionNumber}`; 
}

function startTimer() {
    clearInterval(currentQuiz.timerId);
    const timerEl = document.getElementById('timer');
    const timerBarFill = document.getElementById('timer-bar-fill');
    const maxTime = currentQuiz.timeLeft;

    if (timerEl) {
        timerEl.textContent = currentQuiz.timeLeft;
        currentQuiz.timerId = setInterval(() => {
            currentQuiz.timeLeft--;
            timerEl.textContent = currentQuiz.timeLeft;

            // Update visual bar
            if (timerBarFill) {
                const pct = (currentQuiz.timeLeft / maxTime) * 100;
                timerBarFill.style.transition = 'width 1s linear, background 0.5s ease';
                timerBarFill.style.width = `${pct}%`;
                if (pct > 60) timerBarFill.style.background = 'var(--success-color)';
                else if (pct > 25) timerBarFill.style.background = '#f59e0b';
                else timerBarFill.style.background = 'var(--error-color)';
            }

            if (currentQuiz.timeLeft <= 0) endQuiz();
        }, 1000);
    }
}

function getTypeNamePlaceholderKey(mode, item) {
    if (mode === 'capitalGuess') return 'typeCapitalPlaceholder';
    if (item && item.type === 'International Organization') return 'typeOrgPlaceholder';
    if (item && item.country && !item.years) return 'typeSubdivisionPlaceholder';
    return 'typeNamePlaceholder';
}

function loadQuestion() {
    if (currentQuiz.questionNumber >= currentQuiz.totalQuestions || currentQuiz.dataset.length === 0) { endQuiz(); return; }
    currentQuiz.questionNumber++;
    currentQuiz.questionStartTime = Date.now();
    updateQuestionCounter();

    const progressWrapper = document.getElementById('quiz-progress-wrapper');
    const progressFill = document.getElementById('quiz-progress-fill');
    if (progressWrapper && progressFill) {
        if (currentQuiz.totalQuestions === Infinity) { progressWrapper.style.display = 'none'; } 
        else {
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
    
    const isTypeNameMode = settings.typeNameMode && currentQuiz.mode !== 'yearGuess';
    if (isTypeNameMode) {
        optionsContainer.className = 'hidden'; optionsContainer.innerHTML = '';
        if (typeNameContainer) typeNameContainer.classList.remove('hidden');
        
        const typeNameSubmitBtn = document.getElementById('type-name-submit');
        if (typeNameSubmitBtn) typeNameSubmitBtn.disabled = false;
        
        if (typeNameInput) { 
            typeNameInput.value = ''; typeNameInput.disabled = false;
            const mode = currentQuiz.mode;
            const dataset = currentQuiz.dataset;
            // Untuk mode combo, dataset ini statis/tidak pernah di-shift, jadi tidak relevan
            // untuk ditebak di sini — placeholder-nya diatur ulang secara akurat di loadComboQuestion().
            const nextItem = (mode !== 'combo' && dataset && dataset.length > 0) ? dataset[0] : null;
            const placeholderKey = getTypeNamePlaceholderKey(mode, nextItem);

            typeNameInput.placeholder = translations[settings.language][placeholderKey] || translations['en'][placeholderKey] || 'Type the answer...';
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
    if (currentQuiz.mode === 'combo') { loadComboQuestion(); return; }
    
    const nextQuestion = currentQuiz.dataset.shift();
    if (currentQuiz.mode === 'capitalGuess') generateCapitalQuestion(nextQuestion);
    else generateFlagQuestion(nextQuestion, currentQuiz.mode === 'yearGuess');
}

function loadComboQuestion() {
    const questionTypes = ['flag', 'capital', 'year'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    if (settings.typeNameMode && randomType === 'year') {
        const optionsContainer = document.getElementById('options-container');
        const typeNameContainer = document.getElementById('type-name-input-container');
        if (optionsContainer) { optionsContainer.className = `grid gap-4 grid-cols-2`; optionsContainer.innerHTML = ''; optionsContainer.style.display = ''; }
        if (typeNameContainer) typeNameContainer.classList.add('hidden');
    }

    if (settings.typeNameMode && randomType === 'capital') {
        const optionsContainer = document.getElementById('options-container');
        const typeNameContainer = document.getElementById('type-name-input-container');
        const typeNameInput = document.getElementById('type-name-input');
        if (optionsContainer) { optionsContainer.className = 'hidden'; optionsContainer.innerHTML = ''; }
        if (typeNameContainer) typeNameContainer.classList.remove('hidden');
        if (typeNameInput) {
            typeNameInput.value = ''; typeNameInput.disabled = false;
            typeNameInput.placeholder = translations[settings.language].typeCapitalPlaceholder || 'Type the capital city...';
            setTimeout(() => typeNameInput.focus(), 100);
        }
        const typeNameSubmitBtn = document.getElementById('type-name-submit');
        if (typeNameSubmitBtn) typeNameSubmitBtn.disabled = false;
        const typeNameFeedback = document.getElementById('type-name-feedback');
        if (typeNameFeedback) typeNameFeedback.classList.add('hidden');
    }

    switch(randomType) {
        case 'capital': generateCapitalQuestion(comboCapitalPool.filter(hasFlagImage).sort(() => 0.5 - Math.random())[0]); break;
        case 'year': generateFlagQuestion(historicalFlags.filter(hasFlagImage).sort(() => 0.5 - Math.random())[0], true); break;
        default: {
            const item = [...masterFlagPool].sort(() => 0.5 - Math.random())[0];
            if (settings.typeNameMode) {
                const typeNameInput = document.getElementById('type-name-input');
                const placeholderKey = getTypeNamePlaceholderKey('combo', item);
                if (typeNameInput) typeNameInput.placeholder = translations[settings.language][placeholderKey] || translations['en'][placeholderKey] || 'Type the answer...';
            }
            generateFlagQuestion(item);
            break;
        }
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

    if (settings.typeNameMode) return;

    let options = [currentQuiz.correctAnswer.capital];
    let capitalSourcePool;
    if (currentQuiz.lastMode === 'bookmarks' && currentQuiz.bookmarkedPool) {
        const bkCaps = currentQuiz.bookmarkedPool.filter(c => c.capital && c.capital !== currentQuiz.correctAnswer.capital);
        capitalSourcePool = bkCaps.length >= settings.difficulty - 1 ? bkCaps : capitalGuessData.filter(c => c.capital !== currentQuiz.correctAnswer.capital);
    } else if (currentQuiz.mode === 'combo') {
        capitalSourcePool = comboCapitalPool.filter(c => c.capital !== currentQuiz.correctAnswer.capital);
    } else {
        capitalSourcePool = capitalGuessData.filter(c => c.capital !== currentQuiz.correctAnswer.capital);
    }
    const distractorCapitals = capitalSourcePool.map(c => c.capital).sort(() => 0.5 - Math.random());

    while(options.length < settings.difficulty && distractorCapitals.length > 0) options.push(distractorCapitals.shift());
    
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
// SESUDAH
    let globalPool;
    if (isYear) {
        // Year Guess: selalu dari historical
        globalPool = historicalFlags;
    } else if (currentQuiz.lastMode === 'bookmarks' && currentQuiz.bookmarkedPool) {
        globalPool = currentQuiz.bookmarkedPool;
    } else if (currentQuiz.mode === 'continent') {
        // Opsi jawaban dibatasi ke benua yang sedang dipilih, bukan seluruh dunia
        globalPool = continentFlags[currentQuiz.lastSubMode] || officialCountries;
    } else if (currentQuiz.mode === 'classic' || currentQuiz.lastMode === 'daily') {
        // Mode ini HANYA boleh official countries
        globalPool = officialCountries;
    } else {
        // Survival, Combo, dll → deteksi via PROPERTI targetData (bukan nama)
        // Tiap sumber data punya properti unik sehingga tidak bisa collision:
        // - officialCountries: punya .region/.subRegion, TIDAK punya .type
        // - subdivisions/territories: punya .type (misal "States", "Provinces")
        // - unofficial: punya .type = "Unofficial"
        // - historicalFlags: SATU-SATUNYA yang punya .years
        // - worldOrganizations: punya .type = "International Organization"
        if (targetData.type === 'International Organization') globalPool = worldOrganizations;
        else if (targetData.years)                            globalPool = historicalFlags;
        else if (targetData.type === 'Unofficial')           globalPool = unofficial;
        else if (targetData.type)                            globalPool = [...subdivisions, ...territories];
        else                                                 globalPool = officialCountries;
    }

    const distractorPool = globalPool.filter(item => item.name !== currentQuiz.correctAnswer.name).sort(() => 0.5 - Math.random());
    while (options.length < settings.difficulty && distractorPool.length > 0) options.push(distractorPool.shift());
    options = options.filter(opt => opt && typeof opt[answerKey] === 'string' && opt[answerKey].trim() !== '');

    if (settings.typeNameMode && !isYear) return;
    
    options.sort(() => 0.5 - Math.random()).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option[answerKey] || "????";
        button.className = 'option-btn btn w-full btn-secondary py-3 px-4';
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption) { 
    if (currentQuiz.questionStartTime) {
        const responseTime = (Date.now() - currentQuiz.questionStartTime) / 1000;
        currentQuiz.responseTimes.push(responseTime);
        currentQuiz.questionStartTime = null;
    }

    Array.from(document.getElementById('options-container').children).forEach(btn => btn.disabled = true); 
    const typeNameSubmit = document.getElementById('type-name-submit');
    if (typeNameSubmit) typeNameSubmit.disabled = true;

    const promptKey = document.getElementById('quiz-prompt').dataset.translateKey;
    const isCapitalGuess = promptKey === 'quizPromptGuessCapital';
    const isYearGuess = promptKey === 'quizPromptYear';
    const correctId = isCapitalGuess ? currentQuiz.correctAnswer.capital : (isYearGuess ? currentQuiz.correctAnswer.years : currentQuiz.correctAnswer.name);

    let selectedId;
    if (settings.typeNameMode && !isYearGuess && typeof selectedOption === 'string') {
        selectedId = correctId;
        const targetText = isCapitalGuess ? currentQuiz.correctAnswer.capital : correctId;
        const isMatch = fuzzyMatch(selectedOption, targetText);
        selectedId = isMatch ? targetText : selectedOption;
    } else {
        selectedId = typeof selectedOption === 'object' ? (isYearGuess ? selectedOption.years : selectedOption.name) : selectedOption;
    }

    const selectedButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == selectedId); 
    const correctButton = Array.from(document.getElementById('options-container').children).find(b => b.textContent == correctId); 
    const flagImg = document.querySelector("#flag-display-quiz img");

    if (selectedId === correctId) { 
        if (settings.soundEnabled !== false) sfxCorrect.play().catch(e => {});
        if ("vibrate" in navigator) navigator.vibrate([40, 20, 40]); // Haptic: 2 ketukan pendek
        currentQuiz.correctCount++;
        currentQuiz.comboStreak = (currentQuiz.comboStreak || 0) + 1;
        if (currentQuiz.comboStreak >= 2) showComboNotification(currentQuiz.comboStreak);
        
        let xpReward = 10; 
        switch (currentQuiz.mode) {
            case 'classic': case 'continent': xpReward = 5; break;
            case 'capitalGuess': xpReward = 10; break;
            case 'yearGuess': case 'timeAttack': xpReward = 25; break;
            case 'survival': xpReward = 35; break;
            case 'combo': xpReward = 50; break;
        }
        
        const multiplier = getStreakMultiplier();
        xpReward = Math.round(xpReward * multiplier);
        currentQuiz.score += xpReward; 
        document.getElementById('score').textContent = currentQuiz.score; 
        
        const typeNameFeedback = document.getElementById('type-name-feedback');
        if (settings.typeNameMode && !isYearGuess && typeNameFeedback) {
            const feedbackLabel = isCapitalGuess ? (translations[settings.language].correctCapital || 'Capital:') : (translations[settings.language].correctAnswer || 'Correct:');
            typeNameFeedback.innerHTML = `<i class="fa-solid fa-check text-base mr-1"></i> ${feedbackLabel} <span class="ml-1">${correctId}</span>`;
            typeNameFeedback.className = 'mt-2 text-sm font-bold flex items-center justify-center';
            typeNameFeedback.style.color = 'var(--success-color)';
            typeNameFeedback.classList.remove('hidden');
        }
        if(selectedButton) { selectedButton.classList.add('correct'); showFloatingXP(xpReward, selectedButton); }
        if(flagImg) flagImg.classList.add('correct-flag');
               
    } else { 
        if ("vibrate" in navigator) navigator.vibrate(100);
        currentQuiz.wrongCount++;
        currentQuiz.comboStreak = 0; // Reset combo
        if (currentQuiz.mode === 'survival' || currentQuiz.mode === 'combo') currentQuiz.lives--;
        if (!currentQuiz.missedFlags) currentQuiz.missedFlags = [];
        if (currentQuiz.correctAnswer && !currentQuiz.missedFlags.some(f => f.name === currentQuiz.correctAnswer.name)) currentQuiz.missedFlags.push(currentQuiz.correctAnswer);

        const typeNameFeedback = document.getElementById('type-name-feedback');
        if (settings.typeNameMode && !isYearGuess && typeNameFeedback) {
            const wrongLabel = isCapitalGuess ? (translations[settings.language].wrongCapital || 'Capital:') : (translations[settings.language].wrongAnswer || 'Answer:');
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
        clearInterval(currentQuiz.timerId);
        currentQuiz.timerId = null;
        setTimeout(endQuiz, 1500);
    } else {
        setTimeout(() => { if(flagImg) flagImg.classList.remove("correct-flag", "incorrect-flag"); loadQuestion(); }, 1500);
    }
}

function showComboNotification(count) {
    document.getElementById('combo-notification')?.remove();
    const badge = document.createElement('div');
    badge.id = 'combo-notification';
    badge.style.cssText = 'position:fixed; top:110px; left:50%; z-index:9999; pointer-events:none; animation: comboIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;';
    badge.innerHTML = `
        <div style="background:linear-gradient(90deg,#f97316,#f59e0b); padding:7px 18px; border-radius:999px; font-weight:900; color:#fff; font-size:0.85rem; box-shadow:0 4px 15px rgba(249,115,22,0.4); white-space:nowrap; display:flex; align-items:center; gap:6px; border:1px solid rgba(255,255,255,0.2);">
            <i class="fa-solid fa-fire" style="filter:drop-shadow(0 0 8px rgba(255,255,255,0.8));"></i>
            ${count}x COMBO!
        </div>`;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 1500);
}

function showFloatingXP(amount, targetElement) {
    const xpPopup = document.createElement('div');
    xpPopup.className = 'xp-floating-text';
    xpPopup.textContent = `+${amount} XP`;
    const rect = targetElement.getBoundingClientRect();
    xpPopup.style.left = `${rect.left + (rect.width / 2)}px`;
    xpPopup.style.top = `${rect.top}px`;
    document.body.appendChild(xpPopup);
    setTimeout(() => { xpPopup.remove(); }, 1000);
}

const ACHIEVEMENTS = [
    { id: 'first_quiz', icon: 'fa-flag', name: { en: 'First Quiz', id: 'Kuis Pertama' }, desc: { en: 'Complete your first quiz', id: 'Selesaikan kuis pertamamu' }, test: s => s.totalQuizzes >= 1 },
    { id: 'on_fire', icon: 'fa-fire', name: { en: 'On Fire', id: 'Lagi Panas' }, desc: { en: '10-day streak', id: 'Streak 10 hari' }, test: s => s.streak >= 10 },
    { id: 'legend_streak', icon: 'fa-bolt', name: { en: 'Streak Legend', id: 'Legenda Streak' }, desc: { en: '30-day streak', id: 'Streak 30 hari' }, test: s => s.streak >= 30 },
    { id: 'quiz_nerd', icon: 'fa-book', name: { en: 'Quiz Nerd', id: 'Kutu Kuis' }, desc: { en: '25 quizzes played', id: '25 kuis dimainkan' }, test: s => s.totalQuizzes >= 25 },
    { id: 'veteran', icon: 'fa-medal', name: { en: 'Veteran', id: 'Veteran' }, desc: { en: '100 quizzes played', id: '100 kuis dimainkan' }, test: s => s.totalQuizzes >= 100 },
    { id: 'accurate', icon: 'fa-bullseye', name: { en: 'Sharp Shooter', id: 'Akurat' }, desc: { en: '90%+ accuracy (min. 5 quizzes)', id: 'Akurasi 90%+ (min. 5 kuis)' }, test: s => s.totalQuizzes >= 5 && s.accuracy >= 90 },
    { id: 'perfectionist', icon: 'fa-star', name: { en: 'Perfectionist', id: 'Perfeksionis' }, desc: { en: '5 perfect quizzes', id: '5 kuis sempurna' }, test: s => s.perfectQuizzes >= 5 },
    { id: 'xp_master', icon: 'fa-crown', name: { en: 'XP Master', id: 'Master XP' }, desc: { en: 'Reach Level 10', id: 'Capai Level 10' }, test: s => s.level >= 10 }
];

function getPlayerStatsSnapshot() {
    const totalQuizzes = parseInt(localStorage.getItem('flagx-totalquizzes') || 0);
    const lifetimeCorrect = parseInt(localStorage.getItem('flagx-lifetimecorrect') || 0);
    const lifetimeAttempted = parseInt(localStorage.getItem('flagx-lifetimeattempted') || 0);
    const perfectQuizzes = parseInt(localStorage.getItem('flagx-perfectquizzes') || 0);
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    return {
        totalQuizzes, perfectQuizzes, streak,
        accuracy: lifetimeAttempted > 0 ? Math.round((lifetimeCorrect / lifetimeAttempted) * 100) : 0,
        level: calculateLevel(xp)
    };
}

function renderAchievementSheet() {
    const stats = getPlayerStatsSnapshot();
    const lang = settings.language;
    let unlockedCount = 0;
    const grid = document.getElementById('achievement-grid');
    const cardsHtml = ACHIEVEMENTS.map(a => {
        const unlocked = a.test(stats);
        if (unlocked) unlockedCount++;
        return `
            <div class="flex flex-col items-center text-center p-3 rounded-xl border ${unlocked ? 'border-yellow-400 bg-[rgba(250,204,21,0.1)]' : 'border-[var(--card-border-color)] bg-[var(--card-bg-color)] opacity-40 grayscale'}">
                <i class="fa-solid ${a.icon} text-2xl mb-2 ${unlocked ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : 'text-[var(--subtle-text-color)]'}"></i>
                <p class="text-xs font-bold m-0 ${unlocked ? 'text-[var(--text-color)]' : 'text-[var(--subtle-text-color)]'}">${a.name[lang] || a.name.en}</p>
                <p class="text-[10px] text-[var(--subtle-text-color)] m-0 mt-0.5">${a.desc[lang] || a.desc.en}</p>
            </div>`;
    }).join('');
    if (grid) grid.innerHTML = cardsHtml;
    const countText = `${unlockedCount}/${ACHIEVEMENTS.length}`;
    const sheetCount = document.getElementById('achievement-unlock-count');
    const profileCount = document.getElementById('profile-achievement-count');
    if (sheetCount) sheetCount.textContent = countText;
    if (profileCount) profileCount.textContent = countText;
}

function fireConfetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#7B47F5', '#EC41B1', '#facc15', '#a78bfa', '#22c55e'];
    const burst = document.createElement('div');
    burst.className = 'confetti-burst';
    for (let i = 0; i < 42; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = (Math.random() * 100) + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * 0.35) + 's';
        piece.style.animationDuration = (2 + Math.random() * 1.3) + 's';
        piece.style.setProperty('--confetti-drift', (Math.random() * 160 - 80) + 'px');
        burst.appendChild(piece);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 3600);
}

async function endQuiz() {
    clearInterval(currentQuiz.timerId);
    _syncInputModeForMode(null); 

    const correct = currentQuiz.correctCount || 0;
    const wrong = currentQuiz.wrongCount || 0;
    const timeouts = currentQuiz.timeoutCount || 0;
    const totalAttempted = correct + wrong + timeouts;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    const avgTime = currentQuiz.responseTimes && currentQuiz.responseTimes.length > 0 ? (currentQuiz.responseTimes.reduce((a, b) => a + b, 0) / currentQuiz.responseTimes.length).toFixed(1) + 's' : '-';

    const elMap = { 'res-correct': correct, 'res-wrong': wrong, 'res-accuracy': accuracy + '%', 'res-avg-time': avgTime };
    Object.entries(elMap).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });

    const newTotalQuizzes = parseInt(localStorage.getItem('flagx-totalquizzes') || 0) + 1;
    const newLifetimeCorrect = parseInt(localStorage.getItem('flagx-lifetimecorrect') || 0) + correct;
    const newLifetimeAttempted = parseInt(localStorage.getItem('flagx-lifetimeattempted') || 0) + totalAttempted;
    localStorage.setItem('flagx-totalquizzes', newTotalQuizzes);
    localStorage.setItem('flagx-lifetimecorrect', newLifetimeCorrect);
    localStorage.setItem('flagx-lifetimeattempted', newLifetimeAttempted);
    if (auth && auth.currentUser) {
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await setDoc(userRef, {
                totalQuizzes: newTotalQuizzes,
                lifetimeCorrect: newLifetimeCorrect,
                lifetimeAttempted: newLifetimeAttempted
            }, { merge: true });
        } catch (e) {
            console.error("Failed to sync lifetime stats:", e);
        }
    }
   
    saveQuizToHistory({
        mode: currentQuiz.lastMode || currentQuiz.mode,
        score: currentQuiz.score, correct, wrong, accuracy,
        avgTime: currentQuiz.responseTimes && currentQuiz.responseTimes.length > 0 ? parseFloat((currentQuiz.responseTimes.reduce((a, b) => a + b, 0) / currentQuiz.responseTimes.length).toFixed(1)) : null,
        date: new Date().toISOString()
    });

    const oldTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const oldLevel = calculateLevel(oldTotalXP);
    
    await addToTotalScore(currentQuiz.score);
    
    const newTotalXP = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const newLevel = calculateLevel(newTotalXP);
        
    const finalScoreEl = document.getElementById('final-score');
    if (finalScoreEl) animateCounter(finalScoreEl, currentQuiz.score);
    const resultsMessageEl = document.getElementById('results-message');
        
    let msgText = "";
    const lang = settings.language;
    const mode = currentQuiz.lastMode || currentQuiz.mode;

    if ((mode === 'survival' || mode === 'combo') && currentQuiz.lives <= 0) {
        const key = mode === 'combo' ? 'comboResultMessage' : 'survivalResultMessage';
        msgText = translations[lang][key].replace('{questions}', currentQuiz.questionNumber - 1).replace('{score}', currentQuiz.score);
    } else if (mode === 'timeAttack') {
        msgText = (translations[lang].timeAttackResultMessage || translations[lang].resultsMessage).replace('{questions}', currentQuiz.correctCount || 0).replace('{score}', currentQuiz.score);
    } else {
        msgText = translations[lang].resultsMessage.replace('{score}', currentQuiz.score);
    }
    resultsMessageEl.textContent = msgText;

    const resultData = { score: currentQuiz.score, msg: msgText, lastMode: currentQuiz.lastMode, lastSubMode: currentQuiz.lastSubMode, bookmarkQuizType: currentQuiz.bookmarkQuizType, missedFlags: currentQuiz.missedFlags, correct: correct, wrong: wrong, accuracy: accuracy, avgTime: avgTime };
    localStorage.setItem('lastQuizResult', JSON.stringify(resultData));

    document.getElementById('play-again-btn').onclick = () => { if (currentQuiz.lastMode === 'bookmarks') startBookmarkQuiz(currentQuiz.bookmarkQuizType); else startQuiz(currentQuiz.lastMode, currentQuiz.lastSubMode); };

    const shareBtn = document.getElementById('share-score-btn');
    if (shareBtn) shareBtn.onclick = shareScore;
        
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const backToMenuLabel = document.getElementById('back-to-menu-label');
    if (backToMenuBtn && backToMenuLabel) {
        if (currentQuiz.lastMode === 'bookmarks') {
            backToMenuLabel.setAttribute('data-translate-key', 'backToBookmarks');
            backToMenuLabel.textContent = translations[settings.language].backToBookmarks;
            backToMenuBtn.onclick = () => showBookmarksLibrary();
        } else {
            backToMenuLabel.setAttribute('data-translate-key', 'backToQuizModes');
            backToMenuLabel.textContent = translations[settings.language].backToQuizModes;
            backToMenuBtn.onclick = () => showScreen('quiz-modes-screen');
        }
    }

    renderMissedFlags(currentQuiz.missedFlags);
    if (currentQuiz.score > 0) updateStreak();

    // Simpan completion Daily Challenge
    if ((currentQuiz.lastMode || currentQuiz.mode) === 'daily') {
        localStorage.setItem('flagx-daily-date', new Date().toDateString());
        initDailyChallengeBanner(); // Update tampilan banner di home
    }

    if (accuracy === 100 && correct > 0) {
        const newPerfectCount = parseInt(localStorage.getItem('flagx-perfectquizzes') || 0) + 1;
        localStorage.setItem('flagx-perfectquizzes', newPerfectCount);
        setTimeout(() => fireConfetti(), 250);
    }

    showScreen('results-screen');
        
    if (newLevel > oldLevel && currentQuiz.score > 0) {
        setTimeout(() => {
            const levelModal = document.getElementById('level-up-modal');
            const display = document.getElementById('new-level-display');
            if (display) display.textContent = `Lv. ${newLevel}`;
            if (levelModal) { levelModal.classList.add('active'); document.body.classList.add('modal-open'); }
        }, 600);
    }
}

function animateCounter(element, targetValue, duration = 1200) {
    const startTime = performance.now();
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

// ============================================================================
// 13. STREAK & NOTIFICATIONS
// ============================================================================
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
    if (lastPlayed === today) { /* No change */ } 
    else {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        if (lastPlayed === yesterday.toDateString()) streak++;
        else streak = 1;
        
        localStorage.setItem('flagx-last-played', today);
        localStorage.setItem('flagx-streak', streak);
        const bestStreakSoFar = Math.max(streak, parseInt(localStorage.getItem('flagx-beststreak') || 0));
        localStorage.setItem('flagx-beststreak', bestStreakSoFar);

        if (auth && auth.currentUser && db) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { streak: streak, lastActive: new Date() }, { merge: true }).catch(e => console.error("Streak sync error:", e));
        }

        const milestones = [7, 14, 30];
        if (milestones.includes(streak)) setTimeout(() => showStreakMilestoneModal(streak), 1200);

        if (streak === 1 && 'Notification' in window && Notification.permission !== 'granted') setTimeout(() => requestNotificationPermission(), 2500);
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

    let multiplierText = ''; let subText = ''; const lang = settings.language;
    if (streak >= 30) { multiplierText = '+100% XP Bonus!'; subText = translations[lang].streakLegendary || 'Legendary dedication! 🏆'; } 
    else if (streak >= 14) { multiplierText = '+50% XP Bonus!'; subText = translations[lang].streakOnFire || "You're on fire! Keep it going!"; } 
    else { multiplierText = '+25% XP Bonus!'; subText = translations[lang].streakWeekly || 'One week streak! Amazing consistency!'; }

    if (titleEl) titleEl.textContent = `🔥 ${streak}-Day Streak!`;
    if (subEl) subEl.textContent = subText;
    if (bonusEl) bonusEl.textContent = multiplierText;
    if (bonusSubEl) bonusSubEl.textContent = translations[lang].streakBonusSub || 'Applied to all quiz XP while streak lasts';

    modal.classList.add('active'); document.body.classList.add('modal-open');
}

function displayStreak() {
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const labelEl = document.querySelector('[data-translate-key="dayStreak"]');
    if (labelEl && settings.language === 'en') labelEl.textContent = streak === 1 ? 'day streak' : 'days streak';
    const el = document.getElementById('streak-display');
    const countEl = document.getElementById('streak-count');
    if (countEl) countEl.textContent = streak;
    if (el) { if (streak >= 1) el.classList.remove('hidden'); else el.classList.add('hidden'); }
    syncDesktopProfileCard();
}

function checkDailyStreakReset() {
    const lastPlayedStr = localStorage.getItem('flagx-last-played');
    if (!lastPlayedStr) return;
    const lastDate = new Date(lastPlayedStr); lastDate.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) { 
        localStorage.setItem('flagx-streak', '0');
        if (auth && auth.currentUser && db) {
            const userRef = doc(db, "users", auth.currentUser.uid);
            setDoc(userRef, { streak: 0 }, { merge: true }).catch(console.error);
        }
    }
}

async function requestNotificationPermission() {
    const notifModal = document.getElementById('notification-modal');
    if (notifModal) notifModal.classList.add('active');

    document.getElementById('accept-notif-btn').onclick = async () => {        
        if (notifModal) notifModal.classList.remove('active');

        if (!('Notification' in window)) return;

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') return;

            // Update dot & toast SEGERA setelah izin diberikan — jangan digantungkan pada
            // keberhasilan registrasi FCM token, karena itu bisa gagal karena banyak faktor
            // di luar kendali (dukungan browser, jaringan, dll).
            const lang = settings.language;
            updateNotificationBellUI();
            showToast(translations[lang].notifGrantedTitle || '🔔 Notifications enabled!');

            if (!messaging) return;

            // Daftarkan service worker FCM
            const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

            // Ambil FCM token
            const fcmToken = await getToken(messaging, {
                vapidKey: 'BFyttser0oI2dq7FRsg8q-6d0Pg44_3UcIW1FGaInlqiu4ujubTb9WTVOCgwZ60KJFat6pQ4BMg8NLccqzdHr0M',
                serviceWorkerRegistration: swReg
            });

            if (fcmToken && auth.currentUser) {
                // Simpan token ke Firestore agar Worker bisa baca nanti
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    fcmToken      : fcmToken,
                    fcmUpdatedAt  : new Date()
                }, { merge: true });
            }

            // Handle notifikasi saat app FOREGROUND
            onMessage(messaging, (payload) => {
                showToast(`🔥 ${payload.notification?.title}: ${payload.notification?.body}`);
            });

        } catch (error) {
            console.error('FCM registration error:', error);
        }
    };

    document.getElementById('decline-notif-btn').onclick = () => {       
        if (notifModal) notifModal.classList.remove('active');
    };
}

// ============================================================================
// 14. HISTORY & SHARE CARD
// ============================================================================
function saveQuizToHistory(data) {
    const KEY = 'flagx-quiz-history'; let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { history = []; }
    history.unshift(data);
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(history));
}

function showQuizHistory() { renderQuizHistory(); showScreen('history-screen'); }

function renderQuizHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    const KEY = 'flagx-quiz-history'; let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}

    const filterMode = historyActiveFilter || 'all';
    const sortMode = historyActiveSort || 'newest';

    if (filterMode !== 'all') history = history.filter(h => (h.mode || 'classic') === filterMode);
    if (sortMode === 'highest') history = [...history].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    if (history.length === 0) {
        list.innerHTML = `
            <div class="col-span-full text-center py-12 text-subtle flex flex-col items-center justify-center animate-fadeIn w-full mt-8">
                <i class="fa-solid fa-clock-rotate-left text-5xl mb-4 opacity-40"></i>
                <p class="font-bold text-xl mb-1">${translations[settings.language].historyEmptyTitle || 'No History Yet'}</p>
                <p class="text-sm">${translations[settings.language].historyEmptyDesc || 'Play your first quiz and become a flag master!'}</p>
            </div>`;
        return;
    }

    const modeInfo = { 
        classic: { color: '#7B47F5', icon: 'fa-globe' }, continent: { color: '#28a745', icon: 'fa-map' }, capitalGuess: { color: '#15B4CC', icon: 'fa-building-columns' },
        yearGuess: { color: '#f59e0b', icon: 'fa-calendar-days' }, timeAttack: { color: '#3b82f6', icon: 'fa-stopwatch' }, survival: { color: '#84CC16', icon: 'fa-heart-pulse' },
        combo: { color: '#dc3545', icon: 'fa-bomb' }, bookmarks: { color: '#EC41B1', icon: 'fa-bookmark' },
        daily: { color: '#eab308', icon: 'fa-calendar-check' }
    };

    list.innerHTML = history.map((h, i) => {
        const dt = new Date(h.date);
        const locale = settings.language === 'en' ? 'en-US' : 'id-ID';
        const dateStr = dt.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
        const timeStr = dt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const currentMode = h.mode ? (h.mode.charAt(0).toLowerCase() + h.mode.slice(1)) : 'classic';
        const info = modeInfo[currentMode] || modeInfo[h.mode] || { color: '#7B47F5', icon: 'fa-gamepad' };
        let modeName = h.mode ? h.mode.replace(/([A-Z])/g, ' $1').trim() : 'Classic'; modeName = modeName.charAt(0).toUpperCase() + modeName.slice(1);
        const acc = parseFloat(h.accuracy) || 0;
        let badge = acc >= 90 ? '<i class="fa-solid fa-star text-yellow-400 text-xs drop-shadow-md"></i>' : acc >= 70 ? '<i class="fa-solid fa-fire text-orange-500 text-xs drop-shadow-md"></i>' : '';

        return `
        <div class="bg-[var(--card-bg-color)] border border-[var(--card-border-color)] rounded-xl p-4 text-left animate-fadeIn shadow-[0_4px_15px_rgba(0,0,0,0.1)] relative overflow-hidden group hover:border-[var(--primary-color)] active:border-[var(--primary-color)] hover:-translate-y-0.5 active:-translate-y-0.5 transition-all duration-300">
            <div class="absolute left-0 top-0 bottom-0 w-1.5 opacity-90" style="background-color: ${info.color};"></div>
            <div class="pl-2">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2"><span class="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm" style="background:${info.color}1a; color:${info.color}; border: 1px solid ${info.color}40;"><i class="fa-solid ${info.icon}"></i> ${modeName}</span>${badge}</div>
                    <div class="text-right leading-tight"><span class="text-xs font-bold text-[var(--text-color)] block">${dateStr}</span><span class="text-[10px] text-[var(--subtle-text-color)] font-medium">${timeStr}</span></div>
                </div>
                <div class="flex justify-between items-end mt-2">
                    <div><p class="text-[9px] text-[var(--subtle-text-color)] font-bold uppercase tracking-wider mb-0.5">Total XP</p><div class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[#a78bfa]">+${h.score || 0}</div></div>
                    <div class="flex gap-1.5">
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" style="background: rgba(40, 167, 69, 0.1); border: 1px solid rgba(40, 167, 69, 0.2);"><i class="fa-solid fa-check text-[10px] mb-0.5" style="color: #28a745;"></i><span class="font-bold text-xs" style="color: #28a745;">${h.correct || 0}</span></div>
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" style="background: rgba(220, 53, 69, 0.1); border: 1px solid rgba(220, 53, 69, 0.2);"><i class="fa-solid fa-xmark text-[10px] mb-0.5" style="color: #dc3545;"></i><span class="font-bold text-xs" style="color: #dc3545;">${h.wrong || 0}</span></div>
                        <div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2);"><i class="fa-solid fa-bullseye text-[10px] mb-0.5" style="color: #f59e0b;"></i><span class="font-bold text-xs" style="color: #f59e0b;">${h.accuracy || 0}%</span></div>
                        ${h.avgTime ? `<div class="flex flex-col items-center justify-center rounded-md px-2 py-1 min-w-[38px]" style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);"><i class="fa-solid fa-stopwatch text-[10px] mb-0.5" style="color: #3b82f6;"></i><span class="font-bold text-xs" style="color: #3b82f6;">${h.avgTime}s</span></div>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderMissedFlags(missed) {
    const gridWrap = document.getElementById('missed-flags-grid-wrap');
    const grid = document.getElementById('missed-flags-grid');
    const emptyState = document.getElementById('missed-flags-empty');
    const toggleBtn = document.getElementById('toggle-missed-btn');
    const countBadge = document.getElementById('missed-flags-count-badge');
    if (!gridWrap || !grid) return;

    const hasMissed = !!(missed && missed.length > 0);

    if (countBadge) {
        countBadge.textContent = hasMissed ? missed.length : '';
        countBadge.classList.toggle('hidden', !hasMissed);
    }

    grid.innerHTML = '';
    if (hasMissed) {
        if (emptyState) emptyState.classList.add('hidden');
        grid.classList.remove('hidden');
        missed.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card rounded-lg p-2 text-center flex flex-col items-center animate-fadeIn relative overflow-hidden';
            card.innerHTML = `<div class="flag-wrapper mb-2 bg-[var(--secondary-color)] rounded overflow-hidden w-full aspect-[3/2] flex items-center justify-center"><img src="${item.flag}" alt="${item.name} flag" class="flag-img w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image';"></div><p class="font-semibold text-[12px] leading-tight break-words line-clamp-2 w-full px-1">${item.name}</p>`;
            grid.appendChild(card);
        });
    } else {
        grid.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
    }

    let isOpen = false;
    gridWrap.classList.add('hidden');
    if (toggleBtn) {
        toggleBtn.onclick = () => { isOpen = !isOpen; gridWrap.classList.toggle('hidden', !isOpen); };
    }
}

// ============================================================================
// FITUR SHARE CARD (HYBRID CANVAS API)
// ============================================================================

// Helper untuk membuat kotak dengan sudut melengkung
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r);
    } else {
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
}

/**
 * Fungsi Utama: Menggambar Data ke atas Template.
 */
async function generateShareCard(returnDataUrl = false) {
    let canvas = document.getElementById('share-canvas');
    if (returnDataUrl || !canvas) {
        canvas = document.createElement('canvas');
    }
    
    const ctx = canvas.getContext('2d');

    // Setup Resolusi (1080x1440 standar portrait)
    const W = 1080;
    const H = 1440; 
    canvas.width = W; 
    canvas.height = H;

    // PASTIKAN FONT POPPINS TER-LOAD
    await document.fonts.ready;

    // === 1. AMBIL DATA STATISTIK ===
    const saved = (() => { try { const r = localStorage.getItem('lastQuizResult'); return r ? JSON.parse(r) : null; } catch { return null; } })();
    const score = parseInt(document.getElementById('final-score')?.textContent || saved?.score || 0);
    const correct = (typeof currentQuiz !== 'undefined' ? currentQuiz.correctCount : null) || saved?.correct || 0;
    const wrong = (typeof currentQuiz !== 'undefined' ? currentQuiz.wrongCount : null) || saved?.wrong || 0;
    const timeoutCount = typeof currentQuiz !== 'undefined' && currentQuiz.timeoutCount ? currentQuiz.timeoutCount : 0;
    
    const accuracy = saved?.accuracy ?? (() => { const t = correct + wrong + timeoutCount; return t > 0 ? Math.round((correct / t) * 100) : 0; })();
    const avgTime = saved?.avgTime || '0.0s';

    try {
        // === 2. LOAD TEMPLATE GAMBAR LOKAL (KOSONG) ===
        const templateImg = new Image();
        templateImg.crossOrigin = "Anonymous"; 
        templateImg.src = 'card-template.png'; 

        await new Promise((resolve, reject) => {
            templateImg.onload = resolve;
            templateImg.onerror = () => reject(new Error("Gagal load template gambar."));
        });

        // === 3. GAMBAR LAYER BACKGROUND ===
        ctx.drawImage(templateImg, 0, 0, W, H);

        // === 4. GAMBAR ELEMEN DINAMIS OVERLAY ===
        const cx = W / 2; // Sumbu Tengah Horizontal (540)
        
        // KUNCI PRESISI: Rata tengah secara absolut
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; 

                // -- Teks Title --
        ctx.font = 'bold 76px "Poppins", sans-serif';        
        // Buat gradasi untuk "Your Result"
        const titleGrd = ctx.createLinearGradient(cx, 190, cx, 260);
        titleGrd.addColorStop(0, '#ffffff');      // Atas: Putih
        titleGrd.addColorStop(0.4, '#ffffff');    // Mulai transisi warna dari 40% area atas
        titleGrd.addColorStop(1, '#e8a5f8');      // Bawah: Pink-ungu pastel yang lebih nyata
        ctx.fillStyle = titleGrd;
        ctx.fillText('Your Result', cx, 230); 

                // -- Circular Progress Arc (Speedometer Style) --
const cy = 570;  
const R = 240;   
const startAngle = Math.PI * 0.65; 
const endAngleBase = Math.PI * 2.35; 

const totalAngleSpread = endAngleBase - startAngle;
const totalFraction = totalAngleSpread / (Math.PI * 2);

// ======== A. Garis Tipis (Inner & Outer Ring) ========
ctx.save();
ctx.lineCap = 'round';

// 1. Outer Thin Ring (Dibuat lebih tebal & ada aksen Cyan Blue di awal)
const outerGrd = ctx.createConicGradient(startAngle - 0.1, cx, cy);

// Cyan → Blue → Indigo → Purple → Pink
outerGrd.addColorStop(0.00, 'rgba(18, 168, 224, 0.85)');              // Sedikit lebih blue
outerGrd.addColorStop(0.015, 'rgba(18, 168, 224, 0.85)');
outerGrd.addColorStop(totalFraction * 0.32, 'rgba(59, 130, 246, 0.82)'); // Blue muncul lebih cepat
outerGrd.addColorStop(totalFraction * 0.68, 'rgba(139, 92, 246, 0.76)'); // Indigo/Purple
outerGrd.addColorStop(totalFraction, 'rgba(236, 72, 153, 0.85)');        // Pink
outerGrd.addColorStop(1, 'rgba(236, 72, 153, 0)');

ctx.lineWidth = 3.5; // Lebih tebal dari sebelumnya (2)
ctx.strokeStyle = outerGrd;
ctx.shadowBlur  = 15;
ctx.shadowColor = 'rgba(6, 182, 212, 0.6)'; // Glow biru dingin
ctx.beginPath(); ctx.arc(cx, cy, R + 35, startAngle, endAngleBase); ctx.stroke();

// 2. Inner Thin Ring (Dibuat lebih tebal & tegas)
const innerGrd = ctx.createConicGradient(startAngle - 0.1, cx, cy);

// Cyan → Blue → Indigo → Purple → Pink (lebih lembut)
innerGrd.addColorStop(0.00, 'rgba(14, 165, 233, 0.82)');               // Cyan tipis
innerGrd.addColorStop(0.04, 'rgba(14, 165, 233, 0.82)');

innerGrd.addColorStop(totalFraction * 0.18, 'rgba(30, 64, 175, 0.88)'); // Deep Blue
innerGrd.addColorStop(totalFraction * 0.38, 'rgba(79, 70, 229, 0.84)'); // Indigo
innerGrd.addColorStop(totalFraction * 0.68, 'rgba(168, 85, 247, 0.76)'); // Purple
innerGrd.addColorStop(totalFraction, 'rgba(236, 72, 153, 0.85)');        // Pink
innerGrd.addColorStop(1, 'rgba(236, 72, 153, 0)');

ctx.lineWidth = 3.5; // Lebih tebal dari sebelumnya (2)
ctx.strokeStyle = innerGrd;
ctx.shadowBlur  = 15;
ctx.shadowColor = 'rgba(168, 85, 247, 0.6)'; // Glow ungu hangat
ctx.beginPath(); ctx.arc(cx, cy, R - 35, startAngle, endAngleBase); ctx.stroke();
ctx.restore();

// ======== B. Kalkulasi Progress ========
const progressRatio = Math.min(Math.max(accuracy / 100, 0), 1);
const arcEnd = startAngle + (totalAngleSpread * progressRatio);

// ======== C. Track Kosong (Sudah Akurat) ========
if (progressRatio < 1) {
    ctx.save();
    const trackGrd = ctx.createConicGradient(startAngle, cx, cy);
    trackGrd.addColorStop(0, 'rgba(160, 150, 190, 0.12)'); 
    trackGrd.addColorStop(totalFraction, 'rgba(220, 160, 210, 0.08)'); 
    trackGrd.addColorStop(1, 'rgba(220, 160, 210, 0)');

    ctx.beginPath(); ctx.arc(cx, cy, R, arcEnd, endAngleBase);
    ctx.strokeStyle = trackGrd;
    ctx.lineWidth = 28;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = 'rgba(160, 150, 190, 0.15)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath(); ctx.arc(cx, cy, R, arcEnd, endAngleBase);
    ctx.strokeStyle = 'rgba(180, 170, 210, 0.35)'; 
    ctx.lineWidth = 28;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore(); 
}

// ======== D. Main Progress Arc & Dynamic Glow ========
if (progressRatio > 0) {
    ctx.save(); 

    // Menggeser start gradient mundur sebesar 0.2 radian agar lineCap tidak bocor warna pink
    const gradientOffset = 0.2;
    const arcGrd = ctx.createConicGradient(startAngle - gradientOffset, cx, cy);
    
    const totalCircle = Math.PI * 2;
    const stopStart = gradientOffset / totalCircle; 
    const stopEnd = (gradientOffset + totalAngleSpread * progressRatio) / totalCircle; 
    const stopMax = Math.max(stopEnd, 0.0001);

    // Distribusi spektrum warna dinamis yang aman dari kebocoran
arcGrd.addColorStop(0, '#0891b2'); // Cyan sedikit (padding)
arcGrd.addColorStop(stopStart, '#0891b2'); // Start aktual (cyan)

arcGrd.addColorStop(stopStart + (stopMax - stopStart) * 0.10, '#2563eb'); // Blue
arcGrd.addColorStop(stopStart + (stopMax - stopStart) * 0.32, '#4f46e5'); // Indigo
arcGrd.addColorStop(stopStart + (stopMax - stopStart) * 0.58, '#9333ea'); // Purple
arcGrd.addColorStop(stopStart + (stopMax - stopStart) * 0.82, '#d946ef'); // Magenta
arcGrd.addColorStop(stopMax, '#ec4899'); // Pink
arcGrd.addColorStop(1, '#ec4899'); // Lock pink

    ctx.beginPath(); 
    ctx.arc(cx, cy, R, startAngle, arcEnd);
    ctx.lineCap = 'round';

    // --- Efek Gradient Glow Alami (Menggunakan ketebalan bertingkat + opacity) ---
    // Pass 1: Glow terluar yang sangat halus dan super lebar
    ctx.save();
    ctx.lineWidth = 65;
    ctx.globalAlpha = 0.20;
    ctx.strokeStyle = arcGrd;
    ctx.stroke();
    ctx.restore();

    // Pass 2: Glow medium yang memperkuat intensitas warna neon
    ctx.save();
    ctx.lineWidth = 42;
    ctx.globalAlpha = 0.40;
    ctx.strokeStyle = arcGrd;
    ctx.stroke();
    ctx.restore();

    // Pass 3: Batang Arc Utama (Solid)
    ctx.save();
    ctx.lineWidth = 28;
    ctx.strokeStyle = arcGrd;
    ctx.stroke();

    // Pass 4: Inti cahaya putih/terang di bagian tengah arc (Neon Core Highlight)
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 235, 255, 0.65)';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.stroke();
    ctx.restore();

    // ======== E. Flare (Overexposure Bloom Physics) ========
    const dotX = cx + Math.cos(arcEnd) * R;
    const dotY = cy + Math.sin(arcEnd) * R;

    ctx.save(); 

    // 1. Aura Ungu Terluar (Ambient Bloom)
    const amb = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 150);
    amb.addColorStop(0,    'rgba(236, 72, 153, 0.25)');
    amb.addColorStop(0.35, 'rgba(147, 51, 234, 0.12)');
    amb.addColorStop(1,    'rgba(147, 51, 234, 0)');
    ctx.fillStyle = amb;
    ctx.beginPath(); ctx.arc(dotX, dotY, 150, 0, Math.PI * 2); ctx.fill();

    // 2. Aura Pink Pekat (Medium Bloom)
    const bloom = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 65);
    bloom.addColorStop(0,    'rgba(255, 105, 180, 0.75)'); 
    bloom.addColorStop(0.50, 'rgba(236, 72, 153, 0.25)');
    bloom.addColorStop(1,    'rgba(236, 72, 153, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath(); ctx.arc(dotX, dotY, 65, 0, Math.PI * 2); ctx.fill();

    // 3. Inti Gradasi Overexposure (Membaurkan putih ke pink tanpa garis tegas)
    const inner = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 26);
    inner.addColorStop(0,   'rgba(255, 255, 255, 1.0)');  // Putih murni di pusat absolut
    inner.addColorStop(0.2, 'rgba(255, 215, 240, 0.95)'); // Putih semburat pink hangat
    inner.addColorStop(0.5, 'rgba(236, 72, 153, 0.55)');  // Melembut menjadi pink pudar
    inner.addColorStop(1,   'rgba(236, 72, 153, 0)');
    ctx.fillStyle = inner;
    ctx.beginPath(); ctx.arc(dotX, dotY, 26, 0, Math.PI * 2); ctx.fill();

    ctx.restore(); 
    ctx.restore(); 
}

ctx.save();

// -- Ambient Light yang Lebih Halus (Soft Bloom) --
ctx.save();
ctx.globalCompositeOperation = 'screen'; 

// Radius pas di area ring
const ambCenter = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 20);

// Turunkan alpha ke 0.05 - 0.20 agar lebih subtle
ambCenter.addColorStop(0,    'rgba(168, 85, 247, 0.05)'); // Hampir transparan di tengah
ambCenter.addColorStop(0.5,  'rgba(139, 92, 246, 0.12)'); // Transisi tipis
ambCenter.addColorStop(0.9,  'rgba(120, 50, 220, 0.20)'); // Peak intensitas hanya 0.20
ambCenter.addColorStop(1,    'rgba(120, 50, 220, 0)');

ctx.fillStyle = ambCenter;
ctx.fillRect(cx - (R + 20), cy - (R + 20), (R + 20) * 2, (R + 20) * 2); 
ctx.restore();

                // -- Teks "SCORE" --
const scoreY = cy - 120;
ctx.font = '600 28px "Poppins", sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
ctx.textBaseline = 'middle'; // ← FIX centering: visual center teks = scoreY

const scoreText = 'SCORE';
if(ctx.letterSpacing !== undefined) ctx.letterSpacing = "6px";
ctx.fillText(scoreText, cx, scoreY);

const scoreTextWidth = ctx.measureText(scoreText).width;
if(ctx.letterSpacing !== undefined) ctx.letterSpacing = "0px";
ctx.textBaseline = 'alphabetic'; // reset

// -- Garis Kanan Kiri --
const lineMargin = 25;
const lineLength = 50;
const lineThickness = 1.5;
const tipH = 1; // ← FIX pointy: ujung flat kecil, bukan satu titik

// Garis Kiri
const leftStartX = cx - (scoreTextWidth / 2) - lineMargin;
const leftEndX = leftStartX - lineLength;
const leftGrd = ctx.createLinearGradient(leftStartX, scoreY, leftEndX, scoreY);
leftGrd.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
leftGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
ctx.fillStyle = leftGrd;
ctx.beginPath();
ctx.moveTo(leftStartX, scoreY - lineThickness);
ctx.lineTo(leftEndX,   scoreY - tipH); // ← ujung atas, tidak lancip sempurna
ctx.lineTo(leftEndX,   scoreY + tipH); // ← ujung bawah, flat kecil
ctx.lineTo(leftStartX, scoreY + lineThickness);
ctx.fill();

// Garis Kanan
const rightStartX = cx + (scoreTextWidth / 2) + lineMargin;
const rightEndX = rightStartX + lineLength;
const rightGrd = ctx.createLinearGradient(rightStartX, scoreY, rightEndX, scoreY);
rightGrd.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
rightGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
ctx.fillStyle = rightGrd;
ctx.beginPath();
ctx.moveTo(rightStartX, scoreY - lineThickness);
ctx.lineTo(rightEndX,   scoreY - tipH); // ← ujung atas
ctx.lineTo(rightEndX,   scoreY + tipH); // ← ujung bawah
ctx.lineTo(rightStartX, scoreY + lineThickness);
ctx.fill();
ctx.restore();

        // -- Teks Skor Angka Besar dengan Gradasi Putih-Ungu-Pink --
        ctx.font = 'bold 180px "Poppins", sans-serif';        
        // Sesuaikan titik Y gradasi agar menyelimuti tinggi font angka
        const scoreGradient = ctx.createLinearGradient(cx, cy - 80, cx, cy + 90);
        scoreGradient.addColorStop(0, '#ffffff');      
        scoreGradient.addColorStop(0.4, '#ffffff');   // Putih sampai ke agak tengah
        scoreGradient.addColorStop(1, '#e8a5f8');     // Bawah: Pink-ungu pastel
        ctx.fillStyle = scoreGradient;
        ctx.fillText(score, cx, cy + 44); 
        
        // Teks "/ 100%"
        ctx.font = '600 40px "Poppins", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('/ 100%', cx, cy + 180);              
        
                // -- Pill Box Glassmorphism --
const isExcellent = accuracy >= 90;
const perfMsg = isExcellent ? 'Excellent! You did an amazing job!' :
                accuracy >= 70 ? 'Great work! Keep it up!' :
                accuracy >= 50 ? 'Good effort! Practice more!' :
                                  'Keep practicing!';

ctx.font = 'italic 600 32px "Poppins", sans-serif';
const textWidth = ctx.measureText(perfMsg).width;
const iconAreaW = 90;   // area crown di kiri
const textPadX  = 45;   // padding kiri & kanan teks (equal → teks seimbang)
const pillW = isExcellent
    ? iconAreaW + textWidth + (textPadX * 2)  // crown + teks centered di sisa area
    : textWidth + (textPadX * 2);             // tanpa crown, full center
const pillH = 84;
const pillR = pillH / 2;
const pillX  = cx - (pillW / 2);
const pillY  = cy + R + 65;
const pillCY = pillY + pillH / 2;

ctx.save();

// ======================================================
// A. Glass Background
// ======================================================

ctx.beginPath();
roundRect(ctx, pillX, pillY, pillW, pillH, pillR);

const pillFill = ctx.createLinearGradient(
    pillX,
    pillY,
    pillX,
    pillY + pillH
);

pillFill.addColorStop(0.00, 'rgba(100,60,205,.42)');
pillFill.addColorStop(0.55, 'rgba(78,36,170,.44)');
pillFill.addColorStop(1.00, 'rgba(48,20,115,.46)');

ctx.fillStyle = pillFill;

// Soft outer glow
ctx.shadowBlur = 36;
ctx.shadowColor = 'rgba(125,90,255,.28)';
ctx.fill();

ctx.shadowBlur = 0;


// ======================================================
// B. Glass Highlight + Border
// ======================================================

// Top glass highlight
ctx.save();

ctx.beginPath();
roundRect(ctx, pillX, pillY, pillW, pillH, pillR);
ctx.clip();

const gloss = ctx.createLinearGradient(
    pillX,
    pillY,
    pillX,
    pillY + pillH * 0.55
);

gloss.addColorStop(0.00, 'rgba(255,255,255,.20)');
gloss.addColorStop(0.35, 'rgba(255,255,255,.08)');
gloss.addColorStop(1.00, 'rgba(255,255,255,0)');

ctx.fillStyle = gloss;
ctx.fillRect(
    pillX,
    pillY,
    pillW,
    pillH * 0.55
);

ctx.restore();

// Bottom reflection
ctx.save();

ctx.beginPath();
roundRect(ctx, pillX, pillY, pillW, pillH, pillR);
ctx.clip();

const bottomGlow = ctx.createLinearGradient(
    pillX,
    pillY + pillH * .65,
    pillX,
    pillY + pillH
);

bottomGlow.addColorStop(0, 'rgba(255,255,255,0)');
bottomGlow.addColorStop(1, 'rgba(255,255,255,.05)');

ctx.fillStyle = bottomGlow;
ctx.fillRect(
    pillX,
    pillY,
    pillW,
    pillH
);

ctx.restore();

// ======================================================
// Gradient Glass Border
// ======================================================

// ---------- Layer 1 : Gradient Border + Gradient Glow ----------
ctx.beginPath();
roundRect(ctx, pillX, pillY, pillW, pillH, pillR);

const borderGrad = ctx.createLinearGradient(
    pillX,
    pillY,
    pillX + pillW,
    pillY + pillH
);

borderGrad.addColorStop(0.00, 'rgba(45,105,255,.95)');   // Deep Electric Blue
borderGrad.addColorStop(0.18, 'rgba(75,110,255,.95)');   // Blue
borderGrad.addColorStop(0.40, 'rgba(108,74,255,.96)');   // Indigo
borderGrad.addColorStop(0.60, 'rgba(145,62,255,.96)');   // Purple
borderGrad.addColorStop(0.82, 'rgba(225,78,245,.95)');   // Pink Purple
borderGrad.addColorStop(1.00, 'rgba(255,90,205,.95)');   // Pink

ctx.strokeStyle = borderGrad;
ctx.lineWidth = 2.4;

ctx.shadowBlur = 16;
ctx.shadowColor = 'rgba(180,120,255,.28)';

ctx.stroke();

ctx.shadowBlur = 0;


// ---------- Layer 2 : White Glass Edge ----------
ctx.beginPath();
roundRect(ctx, pillX, pillY, pillW, pillH, pillR);

ctx.strokeStyle = 'rgba(255,255,255,.18)';
ctx.lineWidth = 1;

ctx.stroke();


// ---------- Layer 3 : Soft Top Highlight ----------
ctx.save();

ctx.beginPath();
roundRect(ctx, pillX + 1, pillY + 1, pillW - 2, pillH - 2, pillR - 1);
ctx.clip();

const edgeHighlight = ctx.createLinearGradient(
    pillX,
    pillY,
    pillX,
    pillY + pillH * 0.35
);

edgeHighlight.addColorStop(0.00, 'rgba(255,255,255,.18)');
edgeHighlight.addColorStop(1.00, 'rgba(255,255,255,0)');

ctx.fillStyle = edgeHighlight;
ctx.fillRect(
    pillX,
    pillY,
    pillW,
    pillH * 0.35
);

ctx.restore();

// C. Crown icon (vertikal lebih presisi)
if (isExcellent) {
    const crownPath = new Path2D("M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z");
    ctx.save();
    const sc = 2.5;
    // SVG crown: center visual ≈ x=12, y=12 → sejajarkan ke pillCY
    ctx.translate(pillX + (iconAreaW / 2) - (12 * sc) + 32, pillCY - (12 * sc) - 3);
    ctx.scale(sc, sc);
    const crownGrd = ctx.createLinearGradient(0, 0, 0, 21);
    crownGrd.addColorStop(0,   '#f5d0fe'); // purple muda / fuchsia light
    crownGrd.addColorStop(0.4, '#e879f9'); // fuchsia terang
    crownGrd.addColorStop(1,   '#a855f7'); // purple
    ctx.fillStyle   = crownGrd;
    ctx.shadowBlur  = 22;
    ctx.shadowColor = '#d946ef'; // fuchsia glow
    ctx.fill(crownPath);
    ctx.restore();
}

// D. Teks pesan (textBaseline = 'middle' → benar-benar center vertikal)
ctx.fillStyle    = '#ffffff';
ctx.font         = 'italic 600 32px "Poppins", sans-serif';
ctx.textAlign    = 'center';
ctx.textBaseline = 'middle';
ctx.shadowBlur   = 5;
ctx.shadowColor  = 'rgba(255,255,255,0.20)';
const textCenterX = isExcellent
    ? pillX + iconAreaW + textPadX + (textWidth / 2)  // center di area kanan setelah crown
    : pillX + (pillW / 2);                            // center penuh (non-excellent)
ctx.fillText(perfMsg, textCenterX - 10, pillCY);
ctx.shadowBlur   = 0;
ctx.textBaseline = 'alphabetic'; // reset
ctx.restore();

        // -- Teks 4 Kotak Statistik --
        ctx.textAlign = 'center'; 
        const statY = 1130;  // Y Label
        const valueY = 1185; // Y Angka
        const lineY = 1218;  // Y Garis ditarik naik agar 'inside box'

        // Sumbu X dengan adjustment spesifik hasil ujicoba
        const statItems = [
            { x: 194, label: 'CORRECT', val: correct, color: '#4ade80' },     
            { x: 421, label: 'WRONG', val: wrong, color: '#f87171' },         
            { x: 649, label: 'ACCURACY', val: `${accuracy}%`, color: '#fbbf24' }, 
            { x: 879, label: 'AVG. TIME', val: avgTime, color: '#60a5fa' }    
        ];

        statItems.forEach(item => {
            // Gambar Label
            ctx.font = 'bold 22px "Poppins", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText(item.label, item.x, statY);

            // Gambar Angka Result
            ctx.font = 'bold 50px "Poppins", sans-serif';
            ctx.fillStyle = '#ffffff';
            const textVal = item.val.toString();
            ctx.fillText(textVal, item.x, valueY);

            // Ukur lebar teks angka secara dinamis untuk lebar garis (underline)
            const valWidth = ctx.measureText(textVal).width;

            // Gambar Garis Bawah
            ctx.save();
            const lineW = valWidth; // Lebar garis sekarang otomatis mengikuti teks angka
            const lineH = 8;
            // Gambar rounded rectangle, posisinya berpusat pada item.x
            roundRect(ctx, item.x - lineW/2, lineY, lineW, lineH, lineH/2);
            ctx.fillStyle = item.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = item.color;
            ctx.fill();
            ctx.restore();
        });

        // === 5. RETURN ===
        if (returnDataUrl) {
            return canvas.toDataURL('image/png');
        }

    } catch (error) {
        console.error("Gagal menggambar Share Card:", error);
        return null;
    }
}

// ============================================================================
// FUNGSI TRIGGER TOMBOL (UI)
// ============================================================================

// Panggil ini saat Modal UI terbuka
function shareScore() {
    generateShareCard(false); // Render visualnya ke DOM <canvas>
    
    const modal = document.getElementById('share-card-modal');
    if (modal) { 
        modal.classList.add('active'); 
        document.body.classList.add('modal-open'); 
    }
}

function copyScoreToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => { showToast(translations[settings.language].scoredCopied || 'Copied to clipboard!'); })
    .catch(() => {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        showToast(translations[settings.language].scoredCopied || 'Copied to clipboard!');
    });
}

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
        return `<button onclick="${isMode ? 'selectHistoryFilter' : 'selectHistorySort'}('${opt.value}')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-[rgba(var(--primary-color-rgb),0.15)] text-[var(--primary-color)] border border-[rgba(var(--primary-color-rgb),0.3)]' : 'hover:bg-[var(--secondary-color)] text-[var(--text-color)]'}"><i class="fa-solid ${opt.icon} w-4 text-center ${isActive ? 'text-[var(--primary-color)]' : 'text-[var(--subtle-text-color)]'}"></i><span class="flex-1">${label}</span>${isActive ? '<i class="fa-solid fa-check text-[var(--primary-color)] text-xs ml-auto"></i>' : ''}</button>`;
    }).join('');

    modal.classList.add('active'); document.body.classList.add('modal-open');
}

function closeHistoryFilterModal() {
    closeSheet(document.getElementById('history-filter-modal'));
    closeSheet(document.getElementById('history-sort-modal'));
    closeSheet(document.getElementById('history-delete-modal'));
}

// --- HAPUS HISTORY BERDASARKAN PERIODE ---
const historyDeleteOptions = [
    { value: '24h', labelKey: 'delete24h', icon: 'fa-clock' },
    { value: '7d', labelKey: 'delete7d', icon: 'fa-calendar-week' },
    { value: '30d', labelKey: 'delete30d', icon: 'fa-calendar-days' },
    { value: 'all', labelKey: 'deleteAll', icon: 'fa-trash-can' }
];
let pendingDeletePeriod = null;

function openHistoryDeleteModal() {
    const modal = document.getElementById('history-delete-modal');
    const container = document.getElementById('history-delete-options');
    if (!modal || !container) return;
    const lang = settings.language;

    container.innerHTML = historyDeleteOptions.map(opt => {
        const label = translations[lang][opt.labelKey] || opt.value;
        const isDanger = opt.value === 'all';
        return `<button onclick="confirmHistoryDelete('${opt.value}')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left hover:bg-[var(--secondary-color)] ${isDanger ? 'text-[var(--error-color)]' : 'text-[var(--text-color)]'}"><i class="fa-solid ${opt.icon} w-4 text-center ${isDanger ? 'text-[var(--error-color)]' : 'text-[var(--subtle-text-color)]'}"></i><span class="flex-1">${label}</span></button>`;
    }).join('');

    modal.classList.add('active'); document.body.classList.add('modal-open');
}

function confirmHistoryDelete(period) {
    closeHistoryFilterModal();
    pendingDeletePeriod = period;
    const lang = settings.language;
    const descKeyMap = { '24h': 'deleteConfirm24h', '7d': 'deleteConfirm7d', '30d': 'deleteConfirm30d', 'all': 'deleteConfirmAll' };
    const descEl = document.getElementById('delete-confirm-desc');
    if (descEl) descEl.textContent = translations[lang][descKeyMap[period]] || '';
    const modal = document.getElementById('history-delete-confirm-modal');
    if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
}

function deleteHistoryByPeriod(period) {
    const KEY = 'flagx-quiz-history';
    let history = [];
    try { history = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { history = []; }

    if (period === 'all') {
        history = [];
    } else {
        const periodMs = { '24h': 24 * 60 * 60 * 1000, '7d': 7 * 24 * 60 * 60 * 1000, '30d': 30 * 24 * 60 * 60 * 1000 }[period] || 0;
        const cutoff = Date.now() - periodMs;
        history = history.filter(h => new Date(h.date).getTime() < cutoff);
    }

    localStorage.setItem(KEY, JSON.stringify(history));
    renderQuizHistory();
    showToast(translations[settings.language].historyDeleted || 'History deleted!');
}

function performHistoryDelete() {
    if (!pendingDeletePeriod) return;
    deleteHistoryByPeriod(pendingDeletePeriod);
    pendingDeletePeriod = null;
    document.getElementById('history-delete-confirm-modal')?.classList.remove('active');
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

// ============================================================================
// 15. AI GEMINI LOGIC (Fun Facts & Details)
// ============================================================================
async function getFunFact(itemName) {
    if (!itemName) return;
    const modalTitle = document.getElementById('gemini-modal-title');
    geminiModal.classList.add('active'); document.body.classList.add('modal-open');

    const currentLang = settings.language || 'en';
    geminiContentEl.innerHTML = `<div class="w-full flex flex-col items-center gap-2.5 py-2"><div class="skeleton-block h-4 w-full rounded"></div><div class="skeleton-block h-4 w-[85%] rounded"></div><div class="skeleton-block h-4 w-3/5 rounded"></div></div>`;
    if (modalTitle) modalTitle.textContent = `${(translations[currentLang] && translations[currentLang].funFact) ? translations[currentLang].funFact : "Fun Fact"}: ${itemName}`;

    const cacheKey = `funfact_${currentLang}_${itemName}`;
    const todayStr = new Date().toDateString(); 
    
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
        try {
            const cachedData = JSON.parse(cachedRaw);
            if (cachedData.date === todayStr) { await new Promise(resolve => setTimeout(resolve, SKELETON_MIN_DELAY)); geminiContentEl.textContent = cachedData.fact; return; }
        } catch (e) { console.error("Cache parsing error:", e); }
    }

    try {
        const [response] = await Promise.all([
            fetch('/get-fun-facts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ countryName: itemName, language: currentLang }) }),
            new Promise(resolve => setTimeout(resolve, SKELETON_MIN_DELAY))
        ]);
        if (!response.ok) throw new Error('Server error');
        const data = await response.json();
        geminiContentEl.textContent = data.fact;
        localStorage.setItem(cacheKey, JSON.stringify({ date: todayStr, fact: data.fact }));
    } catch (error) {
        console.error("Fetch error:", error);
        geminiContentEl.innerHTML = '';
        const errorPara = document.createElement('p');
        errorPara.className = 'text-center py-4 text-sm font-medium'; errorPara.style.color = 'var(--error-color)';       
        errorPara.textContent = (translations[currentLang] && translations[currentLang].geminiError) ? translations[currentLang].geminiError : (currentLang === 'id' ? "Gagal memuat fakta. Silakan coba lagi." : "Connection error. Please try again.");
        geminiContentEl.appendChild(errorPara);
    }
}

async function getFlagDetail(itemName, flagUrl) {
    if (!itemName) return;
    const modal = document.getElementById('detail-modal');
    const titleEl = document.getElementById('detail-modal-title');
    const flagImgEl = document.getElementById('detail-flag-img');
    const flagPlaceholderEl = document.getElementById('detail-flag-placeholder');
    const loaderEl = document.getElementById('detail-loader');
    const dataContainer = document.getElementById('detail-data');

    const oldError = modal.querySelector('.error-message'); if (oldError) oldError.remove();

    titleEl.textContent = itemName;
    if (flagUrl) {
        flagImgEl.classList.remove('hidden'); flagImgEl.src = flagUrl;
        if (flagPlaceholderEl) { flagPlaceholderEl.classList.add('hidden'); flagPlaceholderEl.classList.remove('flex'); }
    } else {
        flagImgEl.classList.add('hidden');
        if (flagPlaceholderEl) { flagPlaceholderEl.classList.remove('hidden'); flagPlaceholderEl.classList.add('flex'); }
    }
    loaderEl.classList.remove('hidden'); dataContainer.classList.add('hidden');
    modal.classList.add('active'); document.body.classList.add('modal-open');

    const currentLang = settings.language || 'en';
    const cacheKey = `flag_detail_${currentLang}_${itemName}`;
    const todayStr = new Date().toDateString();

    const renderData = (data) => {
        loaderEl.classList.add('hidden'); dataContainer.classList.remove('hidden');
        document.getElementById('detail-capital').textContent = data.capital || '-'; document.getElementById('detail-established').textContent = data.established || '-';
        document.getElementById('detail-population').textContent = data.population || '-'; document.getElementById('detail-region').textContent = data.region || '-';
        document.getElementById('detail-language').textContent = data.language || '-'; document.getElementById('detail-vexillology').textContent = data.vexillology || translations[settings.language].detailNoInfo;
    };

    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
        try {
            const cachedData = JSON.parse(cachedRaw);
            if (cachedData.date === todayStr) { setTimeout(() => renderData(cachedData.data), SKELETON_MIN_DELAY); return; } 
            else if (!cachedData.date && typeof cachedData === 'object' && cachedData.capital) {
                setTimeout(() => renderData(cachedData), SKELETON_MIN_DELAY);
                localStorage.setItem(cacheKey, JSON.stringify({ date: todayStr, data: cachedData })); return;
            }
        } catch (e) { console.error("Cache parsing error:", e); }
    }

    try {
        const [response] = await Promise.all([
            fetch('/get-flag-details', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ countryName: itemName, language: currentLang }) }),
            new Promise(resolve => setTimeout(resolve, SKELETON_MIN_DELAY))
        ]);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ date: todayStr, data: result }));
        renderData(result);
    } catch (error) {
        console.error("Fetch detail error:", error);
        loaderEl.classList.add('hidden');
        const errorMsg = document.createElement('p'); errorMsg.className = 'error-message text-center py-4 text-sm font-medium'; errorMsg.style.color = 'var(--error-color)';        
        errorMsg.textContent = (translations[currentLang] && translations[currentLang].geminiError) ? translations[currentLang].geminiError : (currentLang === 'id' ? "Gagal memuat detail. Silakan coba lagi." : "Failed to load details. Please try again.");
        dataContainer.parentNode.insertBefore(errorMsg, dataContainer);
    }    
}

// ============================================================================
// 15B. FEEDBACK SYSTEM
// ============================================================================
let selectedFeedbackType = null;
const FEEDBACK_COOLDOWN_KEY = 'flagx-feedback-last-submit';
const FEEDBACK_COOLDOWN_MS = 60000;

function openFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (!modal) return;

    selectedFeedbackType = null;
    document.querySelectorAll('.feedback-type-card').forEach(c => c.classList.remove('active'));
    document.getElementById('feedback-entity-wrap')?.classList.add('hidden');
    const entityInput = document.getElementById('feedback-entity-input');
    if (entityInput) entityInput.value = '';
    const msgInput = document.getElementById('feedback-message-input');
    if (msgInput) msgInput.value = '';
    updateFeedbackCharCount();
    document.getElementById('feedback-error-msg')?.classList.add('hidden');

    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeFeedbackModal() {
    closeSheet(document.getElementById('feedback-modal'));
}

function selectFeedbackType(type) {
    selectedFeedbackType = type;
    document.querySelectorAll('.feedback-type-card').forEach(c => {
        c.classList.toggle('active', c.dataset.type === type);
    });
    const entityWrap = document.getElementById('feedback-entity-wrap');
    if (entityWrap) entityWrap.classList.toggle('hidden', !(type === 'flag' || type === 'correction'));
    document.getElementById('feedback-error-msg')?.classList.add('hidden');
}

function updateFeedbackCharCount() {
    const input = document.getElementById('feedback-message-input');
    const counter = document.getElementById('feedback-char-count');
    if (!input || !counter) return;
    const len = input.value.length;
    counter.textContent = `${len}/500`;
    counter.style.color = len >= 500 ? 'var(--error-color)' : 'var(--subtle-text-color)';
}

async function submitFeedback() {
    const lang = settings.language;
    const errorEl = document.getElementById('feedback-error-msg');
    const messageInput = document.getElementById('feedback-message-input');
    const message = messageInput ? messageInput.value.trim() : '';

    if (!selectedFeedbackType) {
        if (errorEl) { errorEl.textContent = translations[lang].feedbackErrorType || 'Please choose a category first.'; errorEl.classList.remove('hidden'); }
        return;
    }
    if (!message) {
        if (errorEl) { errorEl.textContent = translations[lang].feedbackErrorEmpty || 'Please write your message first.'; errorEl.classList.remove('hidden'); }
        messageInput?.classList.add('shake-input');
        setTimeout(() => messageInput?.classList.remove('shake-input'), 400);
        return;
    }
    if (errorEl) errorEl.classList.add('hidden');

    const lastSubmit = parseInt(localStorage.getItem(FEEDBACK_COOLDOWN_KEY) || '0');
    const now = Date.now();
    if (now - lastSubmit < FEEDBACK_COOLDOWN_MS) {
        showToast(translations[lang].feedbackCooldown || 'Please wait a moment before sending again.');
        return;
    }

    const submitBtn = document.getElementById('submit-feedback-btn');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${translations[lang].feedbackSending || 'Sending...'}</span>`;
    }

    try {
        const entityInput = document.getElementById('feedback-entity-input');
        await addDoc(collection(db, "feedback"), {
            type: selectedFeedbackType,
            message: message,
            entityName: entityInput ? entityInput.value.trim() : '',
            userId: (auth && auth.currentUser) ? auth.currentUser.uid : null,
            username: (auth && auth.currentUser) ? auth.currentUser.displayName : null,
            screen: localStorage.getItem('lastActiveScreen') || 'unknown',
            appVersion: 'v.2.5',
            userAgent: navigator.userAgent,
            language: lang,
            status: 'new',
            createdAt: new Date()
        });

        localStorage.setItem(FEEDBACK_COOLDOWN_KEY, String(now));
        showToast(translations[lang].feedbackSuccess || '✅ Thank you! Feedback sent.');
        closeFeedbackModal();
    } catch (error) {
        console.error('Feedback submission error:', error);
        showToast(translations[lang].feedbackFailed || 'Failed to send. Please try again.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalHTML;
        }
    }
}

// ============================================================================
// 16. ONBOARDING
// ============================================================================
function initOnboarding() {
    if (localStorage.getItem('flagx-onboarded')) return;
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    modal.classList.add('active'); document.body.classList.add('modal-open');
    let currentSlide = 0; const slides = modal.querySelectorAll('.onboard-slide'); const dots = modal.querySelectorAll('.onboard-dot');
    
    function showSlide(n) {
        slides.forEach((s, i) => s.classList.toggle('active-slide', i === n));
        dots.forEach((d, i) => d.classList.toggle('active-dot', i === n));
        currentSlide = n;
        const nextBtn = document.getElementById('onboard-next-btn');
        if (nextBtn) nextBtn.textContent = n === slides.length - 1 ? (translations[settings.language].letsGoBtn || "Let's Go!") : (translations[settings.language].nextBtn || 'Next');
    }

    showSlide(0);
    const nextBtn = document.getElementById('onboard-next-btn');
    const skipBtn = document.getElementById('onboard-skip-btn');
    if (nextBtn) nextBtn.onclick = () => { if (currentSlide < slides.length - 1) showSlide(currentSlide + 1); else closeOnboarding(); };
    if (skipBtn) skipBtn.onclick = closeOnboarding;
}

function closeOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) closeSheet(modal);
    localStorage.setItem('flagx-onboarded', '1');
}

// ============================================================================
// 17. CENTRALIZED EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
    // Top Bar & Menus
    document.getElementById('notification-bell-btn')?.addEventListener('click', handleNotificationBellClick);
    document.getElementById('login-google-btn')?.addEventListener('click', handleLogin);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    // Desktop Sidebar & Header (profile chip lives in the header and reuses the existing
    // hamburger drawer/profile-panel, restyled as an anchored dropdown at desktop breakpoint;
    // Settings is a centered modal — settings-panel itself is relocated into it via
    // relocateSettingsPanel())
    document.getElementById('desktop-header-notif-btn')?.addEventListener('click', handleNotificationBellClick);
    document.getElementById('desktop-header-profile-chip')?.addEventListener('click', () => { document.getElementById('profile-btn')?.click(); });
    document.getElementById('desktop-header-settings-btn')?.addEventListener('click', () => { const m = document.getElementById('desktop-settings-modal'); if (m) { m.classList.add('active'); document.body.classList.add('modal-open'); } });
    document.getElementById('close-desktop-settings-btn')?.addEventListener('click', () => { document.getElementById('desktop-settings-modal')?.classList.remove('active'); document.body.classList.remove('modal-open'); });
    document.getElementById('desktop-sidebar-collapse-btn')?.addEventListener('click', toggleDesktopSidebarCollapse);
    
    // Panels & Modals Open/Close
    // sesudah
if (profileBtn) profileBtn.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    const drawer = document.getElementById('hamburger-drawer');
    if (drawer.classList.contains('active')) { closeSheet(drawer); return; }
    closeAllPanels();
    
    const xp = parseInt(localStorage.getItem('flagx-totalscore') || 0);
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const level = calculateLevel(xp);
    const lang = settings.language;

    const levelStat = document.getElementById('profile-level-stat');
    const hexLevelText = document.getElementById('profile-hex-level-text');
    const xpStat = document.getElementById('profile-xp-stat');
    const streakStat = document.getElementById('profile-streak-stat');
    if (levelStat) levelStat.textContent = level;
    if (hexLevelText) hexLevelText.textContent = level;
    if (xpStat) xpStat.textContent = xp.toLocaleString();
    if (streakStat) {
        streakStat.textContent = streak;
        const fireIcon = streakStat.previousElementSibling; 
        if (streak < 1) {
            streakStat.className = "font-black text-gray-400 text-xl";
            if (fireIcon) fireIcon.className = "fa-solid fa-fire text-gray-400 text-lg mb-1";
        } else {
            streakStat.className = "font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-xl drop-shadow-md";
            if (fireIcon) fireIcon.className = "fa-solid fa-fire text-orange-500 text-lg mb-1 animate-pulse drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]";
        }
    }

    const storedBestStreak = parseInt(localStorage.getItem('flagx-beststreak') || 0);
    const bestStreak = Math.max(streak, storedBestStreak);
    if (bestStreak !== storedBestStreak) localStorage.setItem('flagx-beststreak', bestStreak);
    const bestStreakStat = document.getElementById('profile-best-streak-stat');
    if (bestStreakStat) bestStreakStat.textContent = bestStreak;

    const pillStreak = document.getElementById('profile-pill-streak');
    if (pillStreak) pillStreak.textContent = streak;
    const pillLevel = document.getElementById('profile-pill-level');
    if (pillLevel) pillLevel.textContent = `Lv. ${level}`;

    const totalQuizzesStat = document.getElementById('profile-total-quizzes-stat');
    const accuracyStat = document.getElementById('profile-accuracy-stat');
    const lifetimeCorrect = parseInt(localStorage.getItem('flagx-lifetimecorrect') || 0);
    const lifetimeAttempted = parseInt(localStorage.getItem('flagx-lifetimeattempted') || 0);
    const accuracyPct = lifetimeAttempted > 0 ? Math.round((lifetimeCorrect / lifetimeAttempted) * 100) : 0;
    if (totalQuizzesStat) totalQuizzesStat.textContent = parseInt(localStorage.getItem('flagx-totalquizzes') || 0).toLocaleString();
    if (accuracyStat) accuracyStat.textContent = lifetimeAttempted > 0 ? accuracyPct + '%' : '–';

    const motivationEl = document.getElementById('profile-motivation-text');
    if (motivationEl) motivationEl.textContent = getProfileMotivationText(lifetimeAttempted, accuracyPct, lang);

    const memberSinceEl = document.getElementById('profile-member-since');
    if (memberSinceEl) memberSinceEl.textContent = (auth && auth.currentUser && auth.currentUser.metadata) ? formatMemberSince(auth.currentUser.metadata.creationTime, lang) : '';

    const rankStat = document.getElementById('profile-rank-stat');
    if (rankStat) {
        rankStat.textContent = '…';
        if (auth && auth.currentUser) {
            const myToken = ++_rankFetchToken;
            fetchUserRank(xp).then(rank => {
                if (myToken !== _rankFetchToken) return;
                if (rankStat) rankStat.textContent = rank ? `#${rank}` : '–';
            });
        } else {
            rankStat.textContent = '–';
        }
    }

    renderAchievementSheet();
    drawer.classList.add('active');
    document.body.classList.add('modal-open');
});
    if (infoBtn) infoBtn.addEventListener('click', (e) => { e.stopPropagation(); closeAllPanels(); disclaimerPanel.classList.add('active'); document.body.classList.add('modal-open'); });
    document.getElementById('open-leaderboard-btn')?.addEventListener('click', () => { showScreen('leaderboard-screen'); loadLeaderboard(); });
    
    // Quiz Flow
    document.getElementById('end-quiz-btn')?.addEventListener('click', () => { endQuizModal.classList.add('active'); document.body.classList.add('modal-open'); });
    document.getElementById('cancel-end-quiz-btn')?.addEventListener('click', () => { closeSheet(endQuizModal); });
    document.getElementById('confirm-end-quiz-btn')?.addEventListener('click', () => { closeSheet(endQuizModal); endQuiz(); });
    
    // Standard Modal Close Buttons
    document.getElementById('close-gemini-modal-btn')?.addEventListener('click', () => { closeSheet(geminiModal); setTimeout(releaseActiveLibCardIfAllClosed, 320); });
    document.getElementById('close-gemini-modal-x-btn')?.addEventListener('click', () => { closeSheet(geminiModal); setTimeout(releaseActiveLibCardIfAllClosed, 320); });
    document.getElementById('close-detail-modal-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('detail-modal')); setTimeout(releaseActiveLibCardIfAllClosed, 320); });
    document.getElementById('open-achievement-sheet-btn')?.addEventListener('click', (e) => { e.stopPropagation(); renderAchievementSheet(); document.getElementById('achievement-sheet').classList.add('active'); document.body.classList.add('modal-open'); });
    document.getElementById('close-achievement-sheet-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('achievement-sheet')); });
    document.getElementById('close-detail-modal-x-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('detail-modal')); setTimeout(releaseActiveLibCardIfAllClosed, 320); });
    document.getElementById('close-share-card-x-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('share-card-modal')); });
    document.getElementById('close-hamburger-drawer-btn')?.addEventListener('click', () => closeSheet(document.getElementById('hamburger-drawer')));
    document.getElementById('close-level-info-btn')?.addEventListener('click', () => closeSheet(document.getElementById('level-info-panel')));
    document.getElementById('close-library-sheet-btn')?.addEventListener('click', () => { closeLibraryQuickSheet(); setTimeout(releaseActiveLibCardIfAllClosed, 320); });
    document.querySelectorAll('.bottom-sheet-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeSheet(overlay);
            if (['library-quick-sheet', 'detail-modal', 'gemini-modal'].includes(overlay.id)) {
                setTimeout(releaseActiveLibCardIfAllClosed, 320);
            }
        }
    });
});
    document.getElementById('close-level-up-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('level-up-modal')); });
    document.getElementById('close-streak-milestone-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('streak-milestone-modal')); });
    document.getElementById('close-share-card-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('share-card-modal')); });
    document.getElementById('close-disclaimer-x-btn')?.addEventListener('click', () => { closeSheet(disclaimerPanel); });
    document.getElementById('close-unofficial-info-btn')?.addEventListener('click', closeUnofficialInfoModal);
    document.getElementById('confirm-delete-history-btn')?.addEventListener('click', performHistoryDelete);
    document.getElementById('cancel-delete-history-btn')?.addEventListener('click', () => { pendingDeletePeriod = null; closeSheet(document.getElementById('history-delete-confirm-modal')); });
    
    // Share & Download
    document.getElementById('download-card-btn')?.addEventListener('click', () => {
    const canvas = document.getElementById('share-canvas');
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
        if (!blob) return;
        if (window.ClipboardItem && navigator.clipboard?.write) {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': Promise.resolve(blob) })
                ]);
                showToast(settings.language === 'id' ? '📋 Gambar disalin ke clipboard!' : '📋 Image copied to clipboard!');
                return;
            } catch (e) {
                console.warn('Clipboard gagal, fallback ke download:', e);
            }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'flagx-score.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast(settings.language === 'id' ? '📥 Gambar disimpan!' : '📥 Image saved!');
    }, 'image/png');
});

// GANTI listener share-card-btn
document.getElementById('share-card-btn')?.addEventListener('click', () => {
    const canvas = document.getElementById('share-canvas');
    if (!canvas) return;
    
    const score = document.getElementById('final-score')?.textContent || '0';
    const streak = parseInt(localStorage.getItem('flagx-streak') || 0);
    const shareText = `🌍 Flag-X score: +${score} XP${streak > 0 ? ` | 🔥 ${streak} day streak` : ''}!\nflag-x-project.pages.dev`;
    
    // Gunakan toBlob() callback — user gesture context tetap terjaga
    canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], 'flagx-score.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            // Share dengan gambar (Android native sheet)
            navigator.share({ title: 'My Flag-X Score!', text: shareText, files: [file] })
                .catch(err => { if (err.name !== 'AbortError') copyScoreToClipboard(shareText); });
        } else if (navigator.share) {
            // Share teks + URL saja (tanpa file)
            navigator.share({ title: 'My Flag-X Score!', text: shareText, url: 'https://flag-x-project.pages.dev' })
                .catch(() => copyScoreToClipboard(shareText));
        } else {
            // Fallback: salin teks ke clipboard
            copyScoreToClipboard(shareText);
        }
    }, 'image/png');
});
    
    // Input Mode logic
    document.getElementById('type-name-submit')?.addEventListener('click', () => { const input = document.getElementById('type-name-input'); if (input && input.value.trim()) checkAnswer(input.value.trim()); });
    document.getElementById('type-name-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const val = document.getElementById('type-name-input').value.trim(); if (val) checkAnswer(val); } });
    
    // Settings Interactions
    // Debounced search
    let _searchDebounce;
    document.getElementById('library-search-input')?.addEventListener('input', (e) => {
        clearTimeout(_searchDebounce);
        _searchDebounce = setTimeout(() => filterLibrary(e), 300);
    });

    // Search di screen pemilihan negara (Subdivisions/Territories/Historical)
    document.querySelectorAll('.country-selector-search').forEach(input => {
        let selectorDebounce;
        input.addEventListener('input', (e) => {
            clearTimeout(selectorDebounce);
            selectorDebounce = setTimeout(() => filterCountrySelector(e.target), 200);
        });
    });

    // Offline / Online banner
    window.addEventListener('offline', () => showToast('⚠️ You are offline. Some features may not work.'));
    window.addEventListener('online',  () => showToast('✅ Back online!'));

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window._pwaPrompt = e;
        const hasPlayed = localStorage.getItem('flagx-quiz-history');
        const dismissed = localStorage.getItem('flagx-pwa-dismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (hasPlayed && !dismissed && !isStandalone) {
            setTimeout(showPWABanner, 2000);
        }
    });
    document.querySelectorAll('input[name="language"]').forEach(r => r.addEventListener('change', (e) => { settings.language = e.target.value; localStorage.setItem('flagx-settings', JSON.stringify(settings)); setLanguage(settings.language); updateCustomRadioUI(); }));
    document.querySelectorAll('input[name="difficulty"]').forEach(r => { r.addEventListener('change', (e) => { const quizScreen = document.getElementById('quiz-screen'); if (quizScreen && quizScreen.classList.contains('active')) { pendingDifficulty = parseInt(e.target.value); e.target.checked = false; const currentRadio = document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`); if (currentRadio) currentRadio.checked = true; updateCustomRadioUI(); closeAllPanels(); const modal = document.getElementById('switch-difficulty-modal'); if (modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); } } else { settings.difficulty = parseInt(e.target.value); localStorage.setItem('flagx-settings', JSON.stringify(settings)); updateCustomRadioUI(); closeSheet(document.getElementById('hamburger-drawer')); } }); });
    
    // Confirm Modals (Mode Switch)
    document.getElementById('confirm-switch-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('switch-mode-modal')); closeAllPanels(); _applyTypeNameModeToggle(); endQuiz(); });
    document.getElementById('cancel-switch-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('switch-mode-modal')); });
    document.getElementById('confirm-diff-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('switch-difficulty-modal')); if (pendingDifficulty !== null) { settings.difficulty = pendingDifficulty; localStorage.setItem('flagx-settings', JSON.stringify(settings)); const radio = document.querySelector(`input[name="difficulty"][value="${settings.difficulty}"]`); if (radio) radio.checked = true; pendingDifficulty = null; updateCustomRadioUI(); } closeAllPanels(); endQuiz(); });
    document.getElementById('cancel-diff-btn')?.addEventListener('click', () => { closeSheet(document.getElementById('switch-difficulty-modal')); pendingDifficulty = null; });
    
    // Profile Editing
    if(usernameInput && document.getElementById('char-count')) {
        const updateCharCount = () => { const length = usernameInput.value.length; document.getElementById('char-count').textContent = `${length}/15`; document.getElementById('char-count').style.color = length >= 15 ? 'var(--error-color)' : 'var(--subtle-text-color)'; };
        usernameInput.addEventListener('input', updateCharCount); usernameInput.addEventListener('focus', updateCharCount); updateCharCount();
        usernameInput.addEventListener('focus', () => { if (usernameActions.classList.contains('hidden')) originalUsername = usernameInput.value; usernameActions.classList.remove('hidden'); usernameActions.classList.add('flex'); });
    }
    cancelUsernameBtn?.addEventListener('click', () => { usernameInput.value = originalUsername; usernameInput.dispatchEvent(new Event('input')); usernameInput.classList.remove('shake-input'); usernameActions.classList.add('hidden'); usernameActions.classList.remove('flex'); });
    saveUsernameBtn?.addEventListener('click', async () => {
        const newName = usernameInput.value.trim();
        if (!newName) { usernameInput.classList.add('shake-input'); showToast(translations[settings.language].toastNameBlank); setTimeout(() => usernameInput.classList.remove('shake-input'), 400); return; }
        if (auth.currentUser) {
            try {
                const originalBtnText = saveUsernameBtn.innerText; saveUsernameBtn.innerText = translations[settings.language].btnSaving || "Saving..."; saveUsernameBtn.classList.add('btn-loading');
                await setDoc(doc(db, "users", auth.currentUser.uid), { username: newName }, { merge: true });
                const profileNameDisplay = document.getElementById('profile-name'); if (profileNameDisplay) profileNameDisplay.textContent = newName;
                originalUsername = newName; showToast(translations[settings.language].toastNameSaved);
                usernameActions.classList.add('hidden'); usernameActions.classList.remove('flex'); saveUsernameBtn.innerText = originalBtnText; saveUsernameBtn.classList.remove('btn-loading');
            } catch (e) { console.error(e); showToast(translations[settings.language].toastSaveFailed); saveUsernameBtn.innerText = translations[settings.language].saveBtn; saveUsernameBtn.classList.remove('btn-loading'); }
        }
    });

    // Scroll to Top
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => { if (window.scrollY > 100) scrollToTopBtn.classList.add('show'); else scrollToTopBtn.classList.remove('show'); });
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ============================================================================
// 18. INITIALIZATION
// ============================================================================
// --- PWA INSTALL BANNER ---
function showPWABanner() {
    if (document.getElementById('pwa-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'pwa-banner';
    banner.className = 'fixed z-50 card rounded-xl p-4 flex items-center gap-3 shadow-xl';
    banner.style.cssText = 'bottom: 85px; left: 12px; right: 12px; border: 1px solid var(--primary-color);';
    banner.innerHTML = `
        <div class="text-2xl flex-shrink-0">📱</div>
        <div class="flex-1 min-w-0">
            <p class="font-bold text-sm leading-tight">Install Flag-X</p>
            <p class="text-xs leading-tight" style="color:var(--subtle-text-color)">Play offline, faster access!</p>
        </div>
        <button onclick="installPWA()" class="btn btn-primary px-3 py-1.5 text-xs text-white font-bold flex-shrink-0">Install</button>
        <button onclick="dismissPWA()" class="flex-shrink-0 ml-1" style="color:var(--subtle-text-color)"><i class="fa-solid fa-xmark"></i></button>`;
    document.body.appendChild(banner);
    setTimeout(() => banner?.remove(), 12000);
}

function installPWA() {
    if (window._pwaPrompt) {
        window._pwaPrompt.prompt();
        window._pwaPrompt.userChoice.then(c => {
            if (c.outcome === 'accepted') showToast('🎉 Flag-X installed!');
            localStorage.setItem('flagx-pwa-dismissed', 'true');
            window._pwaPrompt = null;
        });
    }
    document.getElementById('pwa-banner')?.remove();
}

function dismissPWA() {
    localStorage.setItem('flagx-pwa-dismissed', 'true');
    document.getElementById('pwa-banner')?.remove();
}

function initApp() {
    try {
        setupEventListeners();
        loadSettings();
        updateNotificationBellUI();
        loadTotalScore();
        if (localStorage.getItem('flagx-sidebar-collapsed') === 'true') document.body.classList.add('sidebar-collapsed');
        relocateSettingsPanel();
        const desktopBreakpointMQ = window.matchMedia('(min-width: 1024px)');
        if (desktopBreakpointMQ.addEventListener) desktopBreakpointMQ.addEventListener('change', relocateSettingsPanel);
        else if (desktopBreakpointMQ.addListener) desktopBreakpointMQ.addListener(relocateSettingsPanel);
        checkDailyStreakReset();
        renderQuizModes();
        renderLibraryCategories();
        renderHomeQuickExplore();
        displayStreak();
        initFlagOfTheDay();
        initDailyChallengeBanner();
        loadHomeLeaderboardPreview();
        setTimeout(initOnboarding, 300);
               
        const lastScreen = localStorage.getItem('lastActiveScreen');
        if (lastScreen === 'library-display-screen') {
            const libStateRaw = localStorage.getItem('libraryState');
            if (libStateRaw) { const libState = JSON.parse(libStateRaw); showLibrary(libState.category, libState.subCategory); } else showScreen('library-categories-screen');
        } else if (lastScreen === 'results-screen') {
            const savedResult = localStorage.getItem('lastQuizResult');
            if (savedResult) {
                const data = JSON.parse(savedResult);
                const finalScoreEl = document.getElementById('final-score');
                if (finalScoreEl) animateCounter(finalScoreEl, data.score || 0);
                document.getElementById('results-message').textContent = data.msg;
                
                if(document.getElementById('res-correct')) document.getElementById('res-correct').textContent = data.correct || 0;
                if(document.getElementById('res-wrong')) document.getElementById('res-wrong').textContent = data.wrong || 0;
                if(document.getElementById('res-accuracy')) document.getElementById('res-accuracy').textContent = (data.accuracy || 0) + '%';        
                if(document.getElementById('res-avg-time')) document.getElementById('res-avg-time').textContent = data.avgTime || '-';
                
                document.getElementById('play-again-btn').onclick = () => { if (data.lastMode === 'bookmarks') startBookmarkQuiz(data.bookmarkQuizType); else startQuiz(data.lastMode, data.lastSubMode); };
                renderMissedFlags(data.missedFlags || []);      

                const backToMenuBtn = document.getElementById('back-to-menu-btn');
                const backToMenuLabel = document.getElementById('back-to-menu-label');
                if (backToMenuBtn && backToMenuLabel) {
                    if (data.lastMode === 'bookmarks') { backToMenuLabel.setAttribute('data-translate-key', 'backToBookmarks'); backToMenuLabel.textContent = translations[settings.language].backToBookmarks; backToMenuBtn.onclick = () => showBookmarksLibrary(); } 
                    else { backToMenuLabel.setAttribute('data-translate-key', 'backToQuizModes'); backToMenuLabel.textContent = translations[settings.language].backToQuizModes; backToMenuBtn.onclick = () => showScreen('quiz-modes-screen'); }
                }
                const shareBtnRestore = document.getElementById('share-score-btn');
            if (shareBtnRestore) shareBtnRestore.onclick = shareScore;
                showScreen('results-screen');
            } else { showScreen('quiz-modes-screen'); }
        } else if (lastScreen === 'quiz-screen') { showScreen('quiz-modes-screen'); }
        else if (lastScreen === 'history-screen') { if (typeof showQuizHistory === 'function') showQuizHistory(); else { renderQuizHistory(); showScreen('history-screen'); } }
        else if (lastScreen === 'leaderboard-screen') { showScreen('leaderboard-screen'); loadLeaderboard(); }
        else if (lastScreen && lastScreen !== 'home-screen') showScreen(lastScreen);
        else showScreen('home-screen');

    } catch (error) { console.error("Error initializing app:", error); }
}

if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').then(reg => console.log('Flag-X: Service Worker Aktif!')).catch(err => console.error('Flag-X: Service Worker Gagal:', err)); }); }

// ============================================================================
// 19. WINDOW BINDINGS (Exposing Functions to HTML Global Scope)
// ============================================================================
window.showScreen = showScreen;
window.startQuiz = startQuiz;
window.showLibrary = showLibrary;  
window.showLeaderboard = function() { showScreen('leaderboard-screen'); if (typeof loadLeaderboard === 'function') loadLeaderboard(); };
window.getFunFact = getFunFact;    
window.getFlagDetail = getFlagDetail;  
window.handleLogin = handleLogin;    
window.switchAccount = switchAccount;
window.handleLogout = handleLogout;
window.toggleBookmarkUI = toggleBookmarkUI;
window.startBookmarkQuiz = startBookmarkQuiz;
window.showBookmarksLibrary = showBookmarksLibrary;
window.openBookmarkQuizTypeModal = openBookmarkQuizTypeModal;
window.closeBookmarkQuizTypeModal = closeBookmarkQuizTypeModal;
window.selectBookmarkQuizType = selectBookmarkQuizType;
window.openUnofficialInfoModal = openUnofficialInfoModal;
window.shareScore = shareScore;
window.closeOnboarding = closeOnboarding;
window.filterLeaderboard = filterLeaderboard;
window.setLeaderboardSort = setLeaderboardSort;
window.showQuizHistory = showQuizHistory;
window.generateShareCard = generateShareCard;
window.fuzzyMatch = fuzzyMatch;
window.getStreakMultiplier = getStreakMultiplier;
window.showStreakMilestoneModal = showStreakMilestoneModal;
window.requestNotificationPermission = requestNotificationPermission;    
window.showToast = showToast;
window.cekLeaderboard = renderLeaderboardRows;
window.loadHomeLeaderboardPreview = loadHomeLeaderboardPreview;
window.toggleTypeNameMode = toggleTypeNameMode;
window.toggleSound = toggleSound;
window._syncDifficultyAvailability = _syncDifficultyAvailability;
window._syncInputModeForMode = _syncInputModeForMode;
window.openHistoryFilterModal = openHistoryFilterModal;
window.closeHistoryFilterModal = closeHistoryFilterModal;
window.selectHistoryFilter = selectHistoryFilter;
window.selectHistorySort = selectHistorySort;
window.openHistoryDeleteModal = openHistoryDeleteModal;
window.confirmHistoryDelete = confirmHistoryDelete;
window.openLevelInfo = openLevelInfo;
window.startDailyChallenge = startDailyChallenge;
window.installPWA = installPWA;
window.dismissPWA = dismissPWA;
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.selectFeedbackType = selectFeedbackType;
window.updateFeedbackCharCount = updateFeedbackCharCount;
window.submitFeedback = submitFeedback;

// ============================================================================
// 20. ADMIN / DEV TOOLS
// ============================================================================
window.devLogin = async function(namaPalsu = "Sahrul Dev Mobile", skorPalsu = 2500) {
    console.log("🤖 Memulai proses bypass login...");
    const mockUser = { uid: "mock_user_" + Math.floor(Math.random() * 8999 + 1000), displayName: namaPalsu, photoURL: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(namaPalsu)}` };
    if (auth) { Object.defineProperty(auth, 'currentUser', { value: mockUser, writable: true, configurable: true }); console.log("✅ Properti auth.currentUser berhasil dimanipulasi dengan Mock User!"); } else { console.error("❌ Objek 'auth' Firebase belum terinisialisasi."); return; }
    try {
        const userRef = doc(db, "users", mockUser.uid);
        await setDoc(userRef, { username: mockUser.displayName, photoURL: mockUser.photoURL, totalScore: parseInt(skorPalsu), lastUpdated: new Date() }, { merge: true });
        console.log("🔥 Sukses terdaftar di database Firestore!");
        if (typeof showToast === 'function') showToast("🚀 Debug: Terdaftar di Leaderboard!");
        showScreen('leaderboard-screen'); if (typeof loadLeaderboard === 'function') await loadLeaderboard();
    } catch (error) { console.error("❌ Gagal mendaftarkan user ke Firestore:", error); }
};

window.adminResetAllScores = async function() {
    if (!db || !auth || !auth.currentUser) { alert('⚠️ GAGAL: Kamu harus Login ke dalam game terlebih dahulu untuk mereset database.'); return; }
    if (!confirm('⚠️ SUPER ADMIN: Ini akan mereset XP, Level, Streak, dan Leaderboard (All Time & Weekly) untuk SEMUA USER di Firestore. Lanjutkan?')) return;
    console.log('Memulai proses reset massal...');
    try {
        const q = query(collection(db, "users")); const snap = await getDocs(q);
        const batches = []; let batch = writeBatch(db); let count = 0;
        snap.forEach((docSnap) => { batch.update(doc(db, "users", docSnap.id), { totalScore: 0, weeklyScore: 0, streak: 0, weekStart: null }); count++; if (count % 499 === 0) { batches.push(batch); batch = writeBatch(db); } });
        batches.push(batch); for (const b of batches) await b.commit();
        
        localStorage.removeItem('flagx-totalscore'); localStorage.removeItem('flagx-streak'); localStorage.removeItem('flagx-quiz-history'); localStorage.removeItem('flagx-last-played'); localStorage.removeItem('lastQuizResult');
        console.log(`✅ Reset ${count} users to 0 XP.`); alert(`✅ Sukses! ${count} akun user telah di-reset ke nol.\nHalaman akan dimuat ulang.`);
        window.location.reload();
    } catch (error) { console.error("Gagal melakukan reset:", error); alert("Error: Gagal mereset data. Cek tab Console untuk melihat detail."); }
};

// ============================================================================
// START APP
// ============================================================================
initApp();
markAppLoadingStep('appInit');