/**
 * Fynex i18n — Full internationalization for uz, en, ru
 */

export type Lang = 'uz' | 'en' | 'ru';

export interface Translations {
  // ── BottomNav ──
  nav_home: string;
  nav_courses: string;
  nav_leaderboard: string;
  nav_profile: string;

  // ── HomePage ──
  home_daily_streak: string;
  home_total_xp: string;
  home_start: string;
  home_continue: string;
  home_continue_label: string;
  home_new_lessons: string;
  home_completed_courses: string;
  home_rating: string;
  home_xp: string;
  home_weekly_progress: string;
  home_today: string;
  home_personal_plan: string;
  home_daily_tasks: string;
  home_min: string;
  home_practice_lab: string;
  home_micro_learning: string;
  home_practice_desc: string;
  home_mock_tests: string;
  home_ielts_sat: string;
  home_mock_desc: string;
  home_hot: string;
  home_new: string;
  home_mode: string;
  home_days: string;

  // ── Profile ──
  profile_title: string;
  profile_user: string;
  profile_pro_user: string;
  profile_active: string;
  profile_total_xp: string;
  profile_completed: string;
  profile_streak: string;
  profile_go_pro: string;
  profile_pro_desc: string;
  profile_per_month: string;
  profile_subscribe: string;
  profile_achievements: string;
  profile_settings: string;
  profile_notifications: string;
  profile_night_mode: string;
  profile_language: string;
  profile_help: string;
  profile_help_value: string;
  profile_privacy: string;
  profile_privacy_view: string;
  profile_logout: string;
  profile_account_settings: string;
  profile_update_info: string;
  profile_name: string;
  profile_phone: string;
  profile_email: string;
  profile_cancel: string;
  profile_save: string;
  profile_later: string;
  profile_understood: string;
  profile_fynex_pro: string;
  profile_pro_features_desc: string;
  profile_monthly_sub: string;
  profile_all_courses: string;
  profile_no_ads: string;
  profile_priority_support: string;
  profile_offline: string;
  profile_privacy_title: string;
  profile_privacy_desc: string;

  // ── LoginPage ──
  login_welcome: string;
  login_enter_phone: string;
  login_phone: string;
  login_verify: string;
  login_code_sent: string;
  login_checking: string;
  login_confirmed: string;
  login_wrong_code: string;
  login_meet: string;
  login_enter_name: string;
  login_name: string;
  login_your_name: string;
  login_who_are_you: string;
  login_select_option: string;
  login_school: string;
  login_school_desc: string;
  login_student: string;
  login_student_desc: string;
  login_applicant: string;
  login_applicant_desc: string;
  login_other: string;
  login_other_desc: string;
  login_grade: string;
  login_grade_desc: string;
  login_subject: string;
  login_subject_desc: string;
  login_offline_course: string;
  login_offline_desc: string;
  login_no_fynex: string;
  login_no_fynex_desc: string;
  login_plan_to_go: string;
  login_plan_to_go_desc: string;
  login_currently_going: string;
  login_currently_going_desc: string;
  login_center: string;
  login_center_desc: string;
  login_center_search: string;
  login_center_add: string;
  login_duration: string;
  login_duration_desc: string;
  login_level: string;
  login_level_desc: string;
  login_advice: string;
  login_summary: string;
  login_summary_desc: string;
  login_user_type: string;
  login_class: string;
  login_subject_label: string;
  login_center_label: string;
  login_plan_note: string;
  login_start_learning: string;
  login_next: string;
  login_back: string;
  login_loading_1: string;
  login_loading_2: string;
  login_loading_3: string;
  login_loading_4: string;
  login_plan_creating: string;

  // ── Courses ──
  courses_title: string;
  courses_subtitle: string;
  courses_search: string;
  courses_all: string;
  courses_lessons: string;
  courses_lesson: string;
  courses_recommended: string;
  courses_shortest: string;
  courses_xp_sort: string;
  courses_lesson_list: string;
  courses_start_lesson: string;
  courses_lessons_count: string;

  // ── Leaderboard ──
  leaderboard_title: string;
  leaderboard_xp: string;
  leaderboard_week: string;
  leaderboard_month: string;
  leaderboard_all: string;
  leaderboard_streak_label: string;
  leaderboard_your_rank: string;
  leaderboard_total_xp: string;
  leaderboard_you: string;

  // ── Achievements ──
  ach_first_step: string;
  ach_first_step_desc: string;
  ach_fast_learner: string;
  ach_fast_learner_desc: string;
  ach_bookworm: string;
  ach_bookworm_desc: string;
  ach_champion: string;
  ach_champion_desc: string;

  // ── Notifications ──
  notif_updated: string;
  notif_updated_desc: string;
  notif_streak: string;
  notif_streak_desc: string;
  notif_pro_discount: string;
  notif_pro_discount_desc: string;
  notif_course_done: string;
  notif_course_done_desc: string;
  notif_notifications: string;
  notif_today: string;
  notif_yesterday: string;
  notif_days_ago: string;

  // ── Privacy ──
  privacy_1: string;
  privacy_2: string;
  privacy_3: string;
  privacy_4: string;

  // ── Welcome ──
  welcome_tag_1: string;
  welcome_title_1: string;
  welcome_subtitle_1: string;
  welcome_tag_2: string;
  welcome_title_2: string;
  welcome_subtitle_2: string;
  welcome_tag_3: string;
  welcome_title_3: string;
  welcome_subtitle_3: string;
  welcome_next: string;
  welcome_start: string;

  // ── Login Subjects ──
  login_subject_en: string;
  login_subject_en_desc: string;
  login_subject_ru: string;
  login_subject_ru_desc: string;
  login_subject_it: string;
  login_subject_it_desc: string;
  login_subject_math: string;
  login_subject_math_desc: string;

  // ── Durations ──
  dur_less_1: string;
  dur_1_3: string;
  dur_3_6: string;
  dur_6_plus: string;

  // ── Generic ──
  admin_panel: string;
}

// ═══ O'ZBEK TILI ═══
const uz: Translations = {
  nav_home: 'Bosh sahifa',
  nav_courses: 'Kurslar',
  nav_leaderboard: 'Reyting',
  nav_profile: 'Profil',

  home_daily_streak: 'Kunlik streak',
  home_total_xp: 'Jami XP',
  home_start: 'START',
  home_continue: 'Davom etish',
  home_continue_label: 'Davom etish',
  home_new_lessons: 'Yangi darslar tayyor',
  home_completed_courses: 'Yakunlangan kurslar',
  home_rating: 'Reyting',
  home_xp: 'XP',
  home_weekly_progress: 'Haftalik progress',
  home_today: 'bugun',
  home_personal_plan: "Shaxsiy o'quv rejangiz",
  home_daily_tasks: 'Kunlik vazifalar',
  home_min: 'daqiqa',
  home_practice_lab: 'Practice Lab',
  home_micro_learning: 'Micro-Learning',
  home_practice_desc: '5-minute daily smart drills',
  home_mock_tests: 'Mock Tests',
  home_ielts_sat: 'IELTS & SAT Testlar',
  home_mock_desc: 'Haqiqiy imtihon muhitini his eting',
  home_hot: 'Hot',
  home_new: 'Yangi',
  home_mode: 'mode',
  home_days: 'kun',

  profile_title: 'Profil',
  profile_user: 'Foydalanuvchi',
  profile_pro_user: 'PRO foydalanuvchi',
  profile_active: 'Aktiv',
  profile_total_xp: 'Umumiy XP',
  profile_completed: 'Tugallangan',
  profile_streak: 'Streak',
  profile_go_pro: "PRO ga o'tish",
  profile_pro_desc: "Barcha kurslar va qo'shimcha imkoniyatlar siz uchun ochiladi.",
  profile_per_month: '/oy',
  profile_subscribe: "Obuna bo'lish",
  profile_achievements: 'Sizning Yutuqlaringiz',
  profile_settings: 'Sozlamalar',
  profile_notifications: 'Bildirishnomalar',
  profile_night_mode: 'Tungi rejim',
  profile_language: 'Interfeys tili',
  profile_help: 'Yordam markazi',
  profile_help_value: 'Online chat',
  profile_privacy: 'Maxfiylik siyosati',
  profile_privacy_view: "Ko'rish",
  profile_logout: 'Chiqish',
  profile_account_settings: 'Akkaunt sozlamalari',
  profile_update_info: "Profil ma'lumotlarini yangilang",
  profile_name: 'Ism',
  profile_phone: 'Telefon',
  profile_email: 'Email',
  profile_cancel: 'Bekor qilish',
  profile_save: 'Saqlash',
  profile_later: 'Keyinroq',
  profile_understood: 'Tushunarli',
  profile_fynex_pro: 'Fynex PRO',
  profile_pro_features_desc: "Barcha premium kurslar va qo'shimcha imkoniyatlar ochiladi.",
  profile_monthly_sub: 'Bir oylik obuna',
  profile_all_courses: 'Barcha kurslar ochiq',
  profile_no_ads: 'Reklamasiz tajriba',
  profile_priority_support: "Priority qo'llab-quvvatlash",
  profile_offline: 'Offline imkoniyatlar',
  profile_privacy_title: 'Maxfiylik siyosati',
  profile_privacy_desc: "Fynex sizning ma'lumotlaringizni ehtiyotkorlik bilan himoya qiladi.",

  login_welcome: 'Xush kelibsiz',
  login_enter_phone: 'Telefon raqamingizni kiriting',
  login_phone: 'Telefon',
  login_verify: 'Tasdiqlash',
  login_code_sent: 'raqamiga yuborilgan kodni kiriting',
  login_checking: 'Kod tekshirilmoqda...',
  login_confirmed: 'Kod tasdiqlandi ✓',
  login_wrong_code: 'Kod xato, qayta kiriting',
  login_meet: 'Tanishaylik',
  login_enter_name: 'Ismingizni kiriting va boshlaymiz',
  login_name: 'Ism',
  login_your_name: 'Ismingiz',
  login_who_are_you: 'siz kimsiz? 🤔',
  login_select_option: "O'zingizga mos variantni tanlang",
  login_school: "Maktab o'quvchisi",
  login_school_desc: "Maktabda o'qiyapman",
  login_student: 'Talaba',
  login_student_desc: "Universitetda o'qiyapman",
  login_applicant: 'Abituriyent',
  login_applicant_desc: 'Universitetga tayyorlanmoqdaman',
  login_other: 'Boshqa',
  login_other_desc: "Mustaqil o'rganmoqdaman",
  login_grade: "nechanchi sinfda o'qiysiz? 📚",
  login_grade_desc: 'Sinf darajangizni tanlang',
  login_subject: "nimani o'rganmoqchisiz? 🎯",
  login_subject_desc: 'Fynex orqali qaysi fanni kuchaytiramiz?',
  login_offline_course: 'ingliz tili kursiga borasizmi? 🏫',
  login_offline_desc: "Ofline ta'lim markaziga borishingizni belgilang",
  login_no_fynex: "Yo'q, faqat Fynex",
  login_no_fynex_desc: "Noldan Fynex yordamida o'rganaman",
  login_plan_to_go: 'Endi boraman',
  login_plan_to_go_desc: 'Yaxshi joy qidiryapman',
  login_currently_going: 'Hozirda boraman',
  login_currently_going_desc: "O'quv markazida o'qiyman",
  login_center: "Qaysi o'quv markazida? 📍",
  login_center_desc: "O'quv markazingizni tanlang yoki qidiring",
  login_center_search: 'Markaz nomini yozing...',
  login_center_add: "qo'shish",
  login_duration: 'ga qanchadan beri borasiz? ⏳',
  login_duration_desc: "Taxminiy o'qiyotgan vaqtingizni belgilang",
  login_level: 'Ingliz tilini qaysi darajada bilasiz? 📈',
  login_level_desc: "Boshlash nuqtani aniqlab olamiz",
  login_advice: 'Siz uchun maslahat ✨',
  login_summary: 'hammasi tayyor! 🎉',
  login_summary_desc: "Sizning ma'lumotlaringiz",
  login_user_type: 'Foydalanuvchi turi',
  login_class: 'Sinf',
  login_subject_label: 'Tanlangan fan',
  login_center_label: 'Markaz',
  login_plan_note: "Bu ma'lumotlar asosida sizga shaxsiy o'quv reja tuziladi ✨",
  login_start_learning: "O'qishni boshlash",
  login_next: 'Davom etish',
  login_back: 'Orqaga',
  login_loading_1: "Ma'lumotlaringiz tahlil qilinmoqda...",
  login_loading_2: 'Sizga mos darslar tanlanmoqda...',
  login_loading_3: 'Shaxsiy reja tuzilmoqda...',
  login_loading_4: 'Deyarli tayyor...',
  login_plan_creating: "siz uchun\nshaxsiy reja tuzilmoqda",

  courses_title: 'Kurslar',
  courses_search: 'Kurs qidirish',
  courses_all: 'Barchasi',
  courses_lessons: 'ta dars',
  courses_lesson: 'Dars',

  leaderboard_title: 'Reyting',
  leaderboard_xp: 'XP',
  leaderboard_week: 'Bu hafta',
  leaderboard_month: 'Bu oy',
  leaderboard_all: 'Barcha davr',
  leaderboard_streak_label: 'kunlik streak',
  leaderboard_your_rank: "Sizning o'rningiz",
  leaderboard_total_xp: 'Jami XP',
  leaderboard_you: '(Siz)',

  courses_subtitle: "O'rganishni boshlang",
  courses_recommended: 'Tavsiya',
  courses_shortest: 'Tez boshlash',
  courses_xp_sort: 'Koʻp XP',
  courses_lesson_list: "Darslar ro'yxati",
  courses_start_lesson: 'Darsni boshlash',
  courses_lessons_count: 'dars',

  ach_first_step: 'Birinchi Qadam',
  ach_first_step_desc: 'Dastlabki dars',
  ach_fast_learner: "Tezkor O'quvchi",
  ach_fast_learner_desc: '1000 XP topildi',
  ach_bookworm: 'Kitobxon',
  ach_bookworm_desc: '1 ta kurs',
  ach_champion: 'Chempion',
  ach_champion_desc: 'Top 1 reyting',

  notif_updated: 'Fynex 3.0 yangilandi!',
  notif_updated_desc: 'Yangi kurslar va yaxshilangan dizayn sizni kutmoqda.',
  notif_streak: 'Streak 3 kunga yetdi!',
  notif_streak_desc: "Ajoyib! O'qishni davom eting va streak'ni yo'qotmang.",
  notif_pro_discount: 'PRO obuna chegirmasi',
  notif_pro_discount_desc: "Hozir PRO ga obuna bo'ling va 30% chegirma oling.",
  notif_course_done: 'Ingliz Tili Beginner tugallandi',
  notif_course_done_desc: 'Tabriklaymiz! Keyingi kursni boshlang.',
  notif_notifications: 'Bildirishnomalar',
  notif_today: 'Bugun',
  notif_yesterday: 'Kecha',
  notif_days_ago: 'kun oldin',

  privacy_1: "Ism va telefon raqamingiz faqat akkauntingizni himoya qilish va kirishni tasdiqlash uchun ishlatiladi.",
  privacy_2: "O'qishdagi natijalar darslarni shaxsiylashtirish va sizga mos tavsiyalar berish uchun saqlanadi.",
  privacy_3: "Ma'lumotlar uchinchi tomonlarga ruxsatsiz uzatilmaydi.",
  privacy_4: "Istalgan vaqtda qo'llab-quvvatlash bo'limi orqali savol berishingiz mumkin.",

  welcome_tag_1: 'FYNEX',
  welcome_title_1: "O'rganish endi\nqo'lingizda",
  welcome_subtitle_1: "Fynex — bu sizning cho'ntak o'qituvchingiz. Istalgan vaqt, istalgan joyda, atigi 5 daqiqada yangi bilim oling.",
  welcome_tag_2: 'NIMA UCHUN?',
  welcome_title_2: "2 soat emas,\n5 daqiqa",
  welcome_subtitle_2: "O'quv markazlaridagi uzoq, zerikarli darslar o'rniga — qisqa, samarali va o'yinga o'xshash mashqlar. Miya buni 3 barobar yaxshiroq eslaydi.",
  welcome_tag_3: 'BOSHLASH',
  welcome_title_3: "Tilni tanlang\nva boshlang",
  welcome_subtitle_3: "Fynex sizning tilingizda ishlaydi. O'zingizga qulay tilni tanlang va sayohatni boshlang!",
  welcome_next: 'Keyingisi',
  welcome_start: 'Boshlash',

  login_subject_en: "Ingliz tili (IELTS / General)",
  login_subject_en_desc: "Chet tili, xorijga ketish",
  login_subject_ru: "Rus tili",
  login_subject_ru_desc: "Muloqot va biznes uchun",
  login_subject_it: "Dasturlash (IT)",
  login_subject_it_desc: "IT va texnologiyalar",
  login_subject_math: "Matematika",
  login_subject_math_desc: "Aniq fanlar va imtihonlar",

  dur_less_1: '1 oydan kam',
  dur_1_3: '1—3 oy',
  dur_3_6: '3—6 oy',
  dur_6_plus: "6 oydan ko'p",

  admin_panel: 'Admin panel',
};

// ═══ ENGLISH ═══
const en: Translations = {
  nav_home: 'Home',
  nav_courses: 'Courses',
  nav_leaderboard: 'Ranking',
  nav_profile: 'Profile',

  home_daily_streak: 'Daily streak',
  home_total_xp: 'Total XP',
  home_start: 'START',
  home_continue: 'Continue',
  home_continue_label: 'Continue',
  home_new_lessons: 'New lessons ready',
  home_completed_courses: 'Completed courses',
  home_rating: 'Rating',
  home_xp: 'XP',
  home_weekly_progress: 'Weekly progress',
  home_today: 'today',
  home_personal_plan: 'Your personal study plan',
  home_daily_tasks: 'Daily tasks',
  home_min: 'min',
  home_practice_lab: 'Practice Lab',
  home_micro_learning: 'Micro-Learning',
  home_practice_desc: '5-minute daily smart drills',
  home_mock_tests: 'Mock Tests',
  home_ielts_sat: 'IELTS & SAT Tests',
  home_mock_desc: 'Experience real exam environment',
  home_hot: 'Hot',
  home_new: 'New',
  home_mode: 'mode',
  home_days: 'days',

  profile_title: 'Profile',
  profile_user: 'User',
  profile_pro_user: 'PRO user',
  profile_active: 'Active',
  profile_total_xp: 'Total XP',
  profile_completed: 'Completed',
  profile_streak: 'Streak',
  profile_go_pro: 'Upgrade to PRO',
  profile_pro_desc: 'Unlock all courses and premium features.',
  profile_per_month: '/month',
  profile_subscribe: 'Subscribe',
  profile_achievements: 'Your Achievements',
  profile_settings: 'Settings',
  profile_notifications: 'Notifications',
  profile_night_mode: 'Dark mode',
  profile_language: 'Interface language',
  profile_help: 'Help center',
  profile_help_value: 'Online chat',
  profile_privacy: 'Privacy policy',
  profile_privacy_view: 'View',
  profile_logout: 'Log out',
  profile_account_settings: 'Account settings',
  profile_update_info: 'Update your profile information',
  profile_name: 'Name',
  profile_phone: 'Phone',
  profile_email: 'Email',
  profile_cancel: 'Cancel',
  profile_save: 'Save',
  profile_later: 'Later',
  profile_understood: 'Got it',
  profile_fynex_pro: 'Fynex PRO',
  profile_pro_features_desc: 'Unlock all premium courses and features.',
  profile_monthly_sub: 'Monthly subscription',
  profile_all_courses: 'All courses unlocked',
  profile_no_ads: 'Ad-free experience',
  profile_priority_support: 'Priority support',
  profile_offline: 'Offline access',
  profile_privacy_title: 'Privacy Policy',
  profile_privacy_desc: 'Fynex carefully protects your data.',

  login_welcome: 'Welcome',
  login_enter_phone: 'Enter your phone number',
  login_phone: 'Phone',
  login_verify: 'Verify',
  login_code_sent: 'Enter the code sent to',
  login_checking: 'Checking code...',
  login_confirmed: 'Code confirmed ✓',
  login_wrong_code: 'Wrong code, try again',
  login_meet: "Let's meet",
  login_enter_name: 'Enter your name to get started',
  login_name: 'Name',
  login_your_name: 'Your name',
  login_who_are_you: 'who are you? 🤔',
  login_select_option: 'Choose the option that fits you',
  login_school: 'School student',
  login_school_desc: "I'm in school",
  login_student: 'University student',
  login_student_desc: "I'm in university",
  login_applicant: 'Applicant',
  login_applicant_desc: "I'm preparing for university",
  login_other: 'Other',
  login_other_desc: 'Self-learner',
  login_grade: 'what grade are you in? 📚',
  login_grade_desc: 'Select your grade level',
  login_subject: 'what do you want to learn? 🎯',
  login_subject_desc: 'Which subject shall we strengthen?',
  login_offline_course: 'do you attend English courses? 🏫',
  login_offline_desc: 'Do you attend an offline learning center?',
  login_no_fynex: 'No, just Fynex',
  login_no_fynex_desc: "I'll learn with Fynex from scratch",
  login_plan_to_go: "I'm planning to go",
  login_plan_to_go_desc: "I'm looking for a good place",
  login_currently_going: "I'm currently attending",
  login_currently_going_desc: 'I study at a learning center',
  login_center: 'Which learning center? 📍',
  login_center_desc: 'Select or search for your center',
  login_center_search: 'Type center name...',
  login_center_add: 'add',
  login_duration: 'How long have you been attending? ⏳',
  login_duration_desc: 'Approximate duration',
  login_level: 'What is your English level? 📈',
  login_level_desc: "Let's determine your starting point",
  login_advice: 'Our advice for you ✨',
  login_summary: 'all set! 🎉',
  login_summary_desc: 'Your information',
  login_user_type: 'User type',
  login_class: 'Grade',
  login_subject_label: 'Selected subject',
  login_center_label: 'Center',
  login_plan_note: 'A personalized study plan will be created based on this ✨',
  login_start_learning: 'Start learning',
  login_next: 'Continue',
  login_back: 'Back',
  login_loading_1: 'Analyzing your data...',
  login_loading_2: 'Finding the right lessons...',
  login_loading_3: 'Creating your plan...',
  login_loading_4: 'Almost ready...',
  login_plan_creating: "creating your\npersonal plan",

  courses_title: 'Courses',
  courses_search: 'Search courses',
  courses_all: 'All',
  courses_lessons: 'lessons',
  courses_lesson: 'Lesson',

  leaderboard_title: 'Ranking',
  leaderboard_xp: 'XP',
  leaderboard_week: 'This week',
  leaderboard_month: 'This month',
  leaderboard_all: 'All time',
  leaderboard_streak_label: 'day streak',
  leaderboard_your_rank: 'Your rank',
  leaderboard_total_xp: 'Total XP',
  leaderboard_you: '(You)',

  courses_subtitle: 'Start learning',
  courses_recommended: 'Recommended',
  courses_shortest: 'Fast track',
  courses_xp_sort: 'High XP',
  courses_lesson_list: 'Lesson list',
  courses_start_lesson: 'Start lesson',
  courses_lessons_count: 'lessons',

  ach_first_step: 'First Step',
  ach_first_step_desc: 'First lesson',
  ach_fast_learner: 'Fast Learner',
  ach_fast_learner_desc: '1000 XP earned',
  ach_bookworm: 'Bookworm',
  ach_bookworm_desc: '1 course completed',
  ach_champion: 'Champion',
  ach_champion_desc: 'Top 1 ranking',

  notif_updated: 'Fynex 3.0 updated!',
  notif_updated_desc: 'New courses and improved design await you.',
  notif_streak: 'Streak reached 3 days!',
  notif_streak_desc: "Great! Keep learning and don't lose your streak.",
  notif_pro_discount: 'PRO subscription discount',
  notif_pro_discount_desc: 'Subscribe to PRO now and get 30% off.',
  notif_course_done: 'English Beginner completed',
  notif_course_done_desc: 'Congratulations! Start the next course.',
  notif_notifications: 'Notifications',
  notif_today: 'Today',
  notif_yesterday: 'Yesterday',
  notif_days_ago: 'days ago',

  privacy_1: 'Your name and phone number are used only to protect your account and verify login.',
  privacy_2: 'Study results are saved to personalize lessons and provide relevant recommendations.',
  privacy_3: 'Data is not shared with third parties without permission.',
  privacy_4: 'You can contact support anytime with questions.',

  welcome_tag_1: 'FYNEX',
  welcome_title_1: "Learning is now\nin your hands",
  welcome_subtitle_1: "Fynex is your pocket tutor. Learn new things anytime, anywhere, in just 5 minutes.",
  welcome_tag_2: 'WHY?',
  welcome_title_2: "Not 2 hours,\nbut 5 minutes",
  welcome_subtitle_2: "Instead of long, boring classes — short, effective, gamified exercises. Your brain remembers them 3x better.",
  welcome_tag_3: 'START',
  welcome_title_3: "Choose your\nlanguage",
  welcome_subtitle_3: "Fynex works in your language. Choose the one that's comfortable and start your journey!",
  welcome_next: 'Next',
  welcome_start: 'Start',

  login_subject_en: "English (IELTS / General)",
  login_subject_en_desc: "Foreign language, traveling",
  login_subject_ru: "Russian",
  login_subject_ru_desc: "Communication and business",
  login_subject_it: "Programming (IT)",
  login_subject_it_desc: "IT and technologies",
  login_subject_math: "Mathematics",
  login_subject_math_desc: "Exact sciences and exams",

  dur_less_1: 'Less than 1 month',
  dur_1_3: '1—3 months',
  dur_3_6: '3—6 months',
  dur_6_plus: 'More than 6 months',

  admin_panel: 'Admin panel',
};

// ═══ РУССКИЙ ═══
const ru: Translations = {
  nav_home: 'Главная',
  nav_courses: 'Курсы',
  nav_leaderboard: 'Рейтинг',
  nav_profile: 'Профиль',

  home_daily_streak: 'Ежедневная серия',
  home_total_xp: 'Всего XP',
  home_start: 'СТАРТ',
  home_continue: 'Продолжить',
  home_continue_label: 'Продолжить',
  home_new_lessons: 'Новые уроки готовы',
  home_completed_courses: 'Завершённые курсы',
  home_rating: 'Рейтинг',
  home_xp: 'XP',
  home_weekly_progress: 'Недельный прогресс',
  home_today: 'сегодня',
  home_personal_plan: 'Ваш личный учебный план',
  home_daily_tasks: 'Ежедневные задания',
  home_min: 'мин',
  home_practice_lab: 'Практика',
  home_micro_learning: 'Микро-обучение',
  home_practice_desc: '5-минутные ежедневные упражнения',
  home_mock_tests: 'Пробные тесты',
  home_ielts_sat: 'IELTS и SAT тесты',
  home_mock_desc: 'Ощутите реальную атмосферу экзамена',
  home_hot: 'Хит',
  home_new: 'Ново',
  home_mode: 'режим',
  home_days: 'дней',

  profile_title: 'Профиль',
  profile_user: 'Пользователь',
  profile_pro_user: 'PRO пользователь',
  profile_active: 'Активный',
  profile_total_xp: 'Всего XP',
  profile_completed: 'Завершено',
  profile_streak: 'Серия',
  profile_go_pro: 'Перейти на PRO',
  profile_pro_desc: 'Все курсы и дополнительные возможности откроются для вас.',
  profile_per_month: '/мес',
  profile_subscribe: 'Подписаться',
  profile_achievements: 'Ваши достижения',
  profile_settings: 'Настройки',
  profile_notifications: 'Уведомления',
  profile_night_mode: 'Тёмная тема',
  profile_language: 'Язык интерфейса',
  profile_help: 'Центр помощи',
  profile_help_value: 'Онлайн чат',
  profile_privacy: 'Политика конфиденциальности',
  profile_privacy_view: 'Смотреть',
  profile_logout: 'Выйти',
  profile_account_settings: 'Настройки аккаунта',
  profile_update_info: 'Обновите информацию профиля',
  profile_name: 'Имя',
  profile_phone: 'Телефон',
  profile_email: 'Email',
  profile_cancel: 'Отмена',
  profile_save: 'Сохранить',
  profile_later: 'Позже',
  profile_understood: 'Понятно',
  profile_fynex_pro: 'Fynex PRO',
  profile_pro_features_desc: 'Все премиум курсы и функции будут разблокированы.',
  profile_monthly_sub: 'Месячная подписка',
  profile_all_courses: 'Все курсы открыты',
  profile_no_ads: 'Без рекламы',
  profile_priority_support: 'Приоритетная поддержка',
  profile_offline: 'Оффлайн доступ',
  profile_privacy_title: 'Политика конфиденциальности',
  profile_privacy_desc: 'Fynex тщательно защищает ваши данные.',

  login_welcome: 'Добро пожаловать',
  login_enter_phone: 'Введите номер телефона',
  login_phone: 'Телефон',
  login_verify: 'Подтверждение',
  login_code_sent: 'Введите код, отправленный на',
  login_checking: 'Проверка кода...',
  login_confirmed: 'Код подтверждён ✓',
  login_wrong_code: 'Неверный код, попробуйте снова',
  login_meet: 'Давайте знакомиться',
  login_enter_name: 'Введите имя, чтобы начать',
  login_name: 'Имя',
  login_your_name: 'Ваше имя',
  login_who_are_you: 'кто вы? 🤔',
  login_select_option: 'Выберите подходящий вариант',
  login_school: 'Школьник',
  login_school_desc: 'Учусь в школе',
  login_student: 'Студент',
  login_student_desc: 'Учусь в университете',
  login_applicant: 'Абитуриент',
  login_applicant_desc: 'Готовлюсь к университету',
  login_other: 'Другое',
  login_other_desc: 'Учусь самостоятельно',
  login_grade: 'в каком вы классе? 📚',
  login_grade_desc: 'Укажите свой класс',
  login_subject: 'что хотите изучать? 🎯',
  login_subject_desc: 'Какой предмет усилим через Fynex?',
  login_offline_course: 'посещаете курсы английского? 🏫',
  login_offline_desc: 'Посещаете ли вы оффлайн учебный центр?',
  login_no_fynex: 'Нет, только Fynex',
  login_no_fynex_desc: 'Буду учиться через Fynex с нуля',
  login_plan_to_go: 'Планирую записаться',
  login_plan_to_go_desc: 'Ищу хорошее место',
  login_currently_going: 'Сейчас посещаю',
  login_currently_going_desc: 'Учусь в учебном центре',
  login_center: 'Какой учебный центр? 📍',
  login_center_desc: 'Выберите или найдите свой центр',
  login_center_search: 'Введите название центра...',
  login_center_add: 'добавить',
  login_duration: 'Как давно посещаете? ⏳',
  login_duration_desc: 'Примерная продолжительность',
  login_level: 'Какой ваш уровень английского? 📈',
  login_level_desc: 'Определим начальную точку',
  login_advice: 'Наш совет для вас ✨',
  login_summary: 'всё готово! 🎉',
  login_summary_desc: 'Ваши данные',
  login_user_type: 'Тип пользователя',
  login_class: 'Класс',
  login_subject_label: 'Выбранный предмет',
  login_center_label: 'Центр',
  login_plan_note: 'На основе этих данных будет создан персональный учебный план ✨',
  login_start_learning: 'Начать учёбу',
  login_next: 'Продолжить',
  login_back: 'Назад',
  login_loading_1: 'Анализируем ваши данные...',
  login_loading_2: 'Подбираем подходящие уроки...',
  login_loading_3: 'Составляем персональный план...',
  login_loading_4: 'Почти готово...',
  login_plan_creating: "создаём вашу\nличную программу",

  courses_title: 'Курсы',
  courses_search: 'Поиск курсов',
  courses_all: 'Все',
  courses_lessons: 'уроков',
  courses_lesson: 'Урок',

  leaderboard_title: 'Рейтинг',
  leaderboard_xp: 'XP',
  leaderboard_week: 'На этой неделе',
  leaderboard_month: 'В этом месяце',
  leaderboard_all: 'За всё время',
  leaderboard_streak_label: 'дн. серия',
  leaderboard_your_rank: 'Ваше место',
  leaderboard_total_xp: 'Всего XP',
  leaderboard_you: '(Вы)',

  courses_subtitle: 'Начните учиться',
  courses_recommended: 'Рекомендуем',
  courses_shortest: 'Быстрый старт',
  courses_xp_sort: 'Больше XP',
  courses_lesson_list: 'Список уроков',
  courses_start_lesson: 'Начать урок',
  courses_lessons_count: 'уроков',

  ach_first_step: 'Первый шаг',
  ach_first_step_desc: 'Первый урок',
  ach_fast_learner: 'Быстрый ученик',
  ach_fast_learner_desc: '1000 XP заработано',
  ach_bookworm: 'Книголюб',
  ach_bookworm_desc: '1 курс завершён',
  ach_champion: 'Чемпион',
  ach_champion_desc: 'Топ 1 рейтинг',

  notif_updated: 'Fynex 3.0 обновлён!',
  notif_updated_desc: 'Новые курсы и улучшенный дизайн ждут вас.',
  notif_streak: 'Серия достигла 3 дней!',
  notif_streak_desc: 'Отлично! Продолжайте учиться и не теряйте серию.',
  notif_pro_discount: 'Скидка на PRO подписку',
  notif_pro_discount_desc: 'Подпишитесь на PRO и получите скидку 30%.',
  notif_course_done: 'English Beginner завершён',
  notif_course_done_desc: 'Поздравляем! Начните следующий курс.',
  notif_notifications: 'Уведомления',
  notif_today: 'Сегодня',
  notif_yesterday: 'Вчера',
  notif_days_ago: 'дней назад',

  privacy_1: 'Имя и номер телефона используются только для защиты аккаунта и подтверждения входа.',
  privacy_2: 'Результаты обучения сохраняются для персонализации уроков и рекомендаций.',
  privacy_3: 'Данные не передаются третьим лицам без разрешения.',
  privacy_4: 'Вы можете обратиться в службу поддержки в любое время.',

  welcome_tag_1: 'FYNEX',
  welcome_title_1: "Обучение теперь\nв ваших руках",
  welcome_subtitle_1: "Fynex — ваш карманный репетитор. Учитесь в любое время, в любом месте, всего за 5 минут.",
  welcome_tag_2: 'ПОЧЕМУ?',
  welcome_title_2: "Не 2 часа,\nа 5 минут",
  welcome_subtitle_2: "Вместо долгих скучных занятий — короткие, эффективные упражнения в формате игры. Мозг запоминает их в 3 раза лучше.",
  welcome_tag_3: 'НАЧАТЬ',
  welcome_title_3: "Выберите язык\nи начинайте",
  welcome_subtitle_3: "Fynex работает на вашем языке. Выберите удобный язык и начните путешествие!",
  welcome_next: 'Далее',
  welcome_start: 'Начать',

  login_subject_en: "Английский (IELTS / General)",
  login_subject_en_desc: "Иностранный язык, переезд",
  login_subject_ru: "Русский язык",
  login_subject_ru_desc: "Для общения и бизнеса",
  login_subject_it: "Программирование (IT)",
  login_subject_it_desc: "IT и технологии",
  login_subject_math: "Математика",
  login_subject_math_desc: "Точные науки и экзамены",

  dur_less_1: 'Менее 1 месяца',
  dur_1_3: '1—3 месяца',
  dur_3_6: '3—6 месяцев',
  dur_6_plus: 'Более 6 месяцев',

  admin_panel: 'Админ панель',
};

const TRANSLATIONS: Record<Lang, Translations> = { uz, en, ru };

// ─── Hook & Utilities ───
export function getTranslations(lang: Lang): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS.uz;
}

export function getCurrentLang(): Lang {
  const stored = localStorage.getItem('fynex_lang');
  if (stored === 'en' || stored === 'uz' || stored === 'ru') return stored;
  return 'uz';
}

export function setCurrentLang(lang: Lang): void {
  localStorage.setItem('fynex_lang', lang);
}
