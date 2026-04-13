export interface QuizStep {
  type: 'quiz';
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface FillBlankStep {
  type: 'fill_blank';
  before: string;
  after: string;
  correctWord: string;
  options: string[];
  hint?: string;
}

export interface FlashcardStep {
  type: 'flashcard';
  word: string;
  pronunciation: string;
  translation: string;
  definition?: string;
}

export type LessonStep = QuizStep | FillBlankStep | FlashcardStep;

export const lessonSteps: Record<string, LessonStep[]> = {
  // Course 1: Ingliz Tili Beginner
  '1-1': [
    { type: 'flashcard', word: 'Hello', pronunciation: '[həˈloʊ]', translation: 'Salom', definition: 'Uchrashganda ishlatiladigan so\'z' },
    { type: 'flashcard', word: 'Good morning', pronunciation: '[ɡʊd ˈmɔːrnɪŋ]', translation: 'Xayrli tong', definition: 'Ertalab salomlashish' },
    { type: 'flashcard', word: 'Goodbye', pronunciation: '[ɡʊdˈbaɪ]', translation: 'Xayr', definition: 'Xayrlashish so\'zi' },
    { type: 'quiz', question: '"Salom" so\'zining inglizcha tarjimasi qaysi?', options: ['Goodbye', 'Hello', 'Thanks', 'Sorry'], correctIndex: 1, explanation: '"Hello" — ingliz tilida eng ko\'p ishlatiladigan salomlashish so\'zi.' },
    { type: 'fill_blank', before: 'Good', after: '! How are you?', correctWord: 'morning', options: ['morning', 'night', 'hello', 'bye'], hint: 'Ertalab aytiladi' },
    { type: 'quiz', question: '"Xayr" inglizcha nima?', options: ['Hello', 'Sorry', 'Goodbye', 'Please'], correctIndex: 2, explanation: '"Goodbye" — xayrlashishda ishlatiladi.' },
  ],
  '1-2': [
    { type: 'flashcard', word: 'One', pronunciation: '[wʌn]', translation: 'Bir' },
    { type: 'flashcard', word: 'Five', pronunciation: '[faɪv]', translation: 'Besh' },
    { type: 'flashcard', word: 'Ten', pronunciation: '[ten]', translation: 'O\'n' },
    { type: 'quiz', question: '"Seven" raqami nechaga teng?', options: ['6', '7', '8', '9'], correctIndex: 1, explanation: 'Seven = 7' },
    { type: 'fill_blank', before: 'I have', after: 'apples.', correctWord: 'three', options: ['three', 'tree', 'free', 'thee'], hint: '3 ta olma' },
    { type: 'quiz', question: '"O\'n" inglizcha nima?', options: ['Tin', 'Ten', 'Tan', 'Ton'], correctIndex: 1 },
  ],
  '1-3': [
    { type: 'flashcard', word: 'Red', pronunciation: '[red]', translation: 'Qizil' },
    { type: 'flashcard', word: 'Blue', pronunciation: '[bluː]', translation: 'Ko\'k' },
    { type: 'flashcard', word: 'Green', pronunciation: '[ɡriːn]', translation: 'Yashil' },
    { type: 'quiz', question: '"Ko\'k" rangi inglizcha nima?', options: ['Red', 'Green', 'Blue', 'Yellow'], correctIndex: 2, explanation: 'Blue = Ko\'k rang' },
    { type: 'fill_blank', before: 'The sky is', after: '.', correctWord: 'blue', options: ['red', 'blue', 'green', 'black'], hint: 'Osmon rangi' },
    { type: 'quiz', question: '"Green" qanday rang?', options: ['Qizil', 'Sariq', 'Yashil', 'Oq'], correctIndex: 2 },
  ],
  '1-4': [
    { type: 'flashcard', word: 'Mother', pronunciation: '[ˈmʌðər]', translation: 'Ona' },
    { type: 'flashcard', word: 'Father', pronunciation: '[ˈfɑːðər]', translation: 'Ota' },
    { type: 'flashcard', word: 'Brother', pronunciation: '[ˈbrʌðər]', translation: 'Aka/Uka' },
    { type: 'quiz', question: '"Ona" inglizcha nima?', options: ['Father', 'Mother', 'Sister', 'Brother'], correctIndex: 1 },
    { type: 'fill_blank', before: 'My', after: 'is a doctor.', correctWord: 'father', options: ['father', 'feather', 'further', 'faster'], hint: 'Otangiz haqida' },
  ],
  '1-5': [
    { type: 'flashcard', word: 'Water', pronunciation: '[ˈwɔːtər]', translation: 'Suv' },
    { type: 'flashcard', word: 'Bread', pronunciation: '[bred]', translation: 'Non' },
    { type: 'flashcard', word: 'Apple', pronunciation: '[ˈæp.əl]', translation: 'Olma' },
    { type: 'quiz', question: '"Non" inglizcha nima?', options: ['Bread', 'Butter', 'Milk', 'Rice'], correctIndex: 0, explanation: 'Bread = Non. Kundalik ovqatlanishda ishlatiladi.' },
    { type: 'fill_blank', before: 'I drink', after: 'every day.', correctWord: 'water', options: ['water', 'stone', 'paper', 'wood'], hint: 'Suv ichish' },
  ],

  // Course 3: Rus Tili Beginner
  '3-1': [
    { type: 'flashcard', word: 'А а', pronunciation: '[a]', translation: 'A harfi', definition: 'Kirill alifbosining birinchi harfi' },
    { type: 'flashcard', word: 'Б б', pronunciation: '[b]', translation: 'B harfi' },
    { type: 'flashcard', word: 'В в', pronunciation: '[v]', translation: 'V harfi' },
    { type: 'quiz', question: 'Kirill alifbosida nechta harf bor?', options: ['26', '29', '33', '36'], correctIndex: 2, explanation: 'Kirill alifbosida 33 ta harf bor.' },
  ],
  '3-2': [
    { type: 'flashcard', word: 'Привет', pronunciation: '[priˈvʲet]', translation: 'Salom' },
    { type: 'flashcard', word: 'Спасибо', pronunciation: '[spɐˈsʲibə]', translation: 'Rahmat' },
    { type: 'quiz', question: '"Salom" ruscha nima?', options: ['Спасибо', 'Привет', 'Пока', 'Извините'], correctIndex: 1 },
    { type: 'fill_blank', before: '', after: ', как дела?', correctWord: 'Привет', options: ['Привет', 'Пока', 'Нет', 'Да'], hint: 'Salomlashish' },
  ],
  '3-3': [
    { type: 'flashcard', word: 'Один', pronunciation: '[ɐˈdʲin]', translation: 'Bir' },
    { type: 'flashcard', word: 'Два', pronunciation: '[dva]', translation: 'Ikki' },
    { type: 'quiz', question: '"Три" nechaga teng?', options: ['2', '3', '4', '5'], correctIndex: 1 },
  ],

  // Course 4: Matematika
  '4-1': [
    { type: 'quiz', question: '15 + 27 = ?', options: ['41', '42', '43', '44'], correctIndex: 1, explanation: '15 + 27 = 42' },
    { type: 'quiz', question: '100 - 37 = ?', options: ['53', '63', '73', '67'], correctIndex: 1 },
    { type: 'fill_blank', before: '8 ×', after: '= 56', correctWord: '7', options: ['6', '7', '8', '9'], hint: 'Ko\'paytirish jadvali' },
  ],
  '4-2': [
    { type: 'quiz', question: '1/2 + 1/4 = ?', options: ['2/6', '3/4', '1/6', '2/4'], correctIndex: 1, explanation: '1/2 = 2/4, shuning uchun 2/4 + 1/4 = 3/4' },
    { type: 'quiz', question: '3/5 ning kasr ko\'rinishi qanday?', options: ['0.5', '0.6', '0.3', '0.35'], correctIndex: 1 },
  ],
  '4-3': [
    { type: 'quiz', question: 'x + 5 = 12 bo\'lsa, x = ?', options: ['5', '6', '7', '8'], correctIndex: 2, explanation: 'x = 12 - 5 = 7' },
    { type: 'fill_blank', before: '2x =', after: ', x = 5', correctWord: '10', options: ['8', '10', '12', '15'], hint: '2 × 5 = ?' },
  ],
  '4-4': [
    { type: 'quiz', question: 'Uchburchakning burchaklari yig\'indisi nechaga teng?', options: ['90°', '180°', '270°', '360°'], correctIndex: 1, explanation: 'Har qanday uchburchakning ichki burchaklari yig\'indisi 180° ga teng.' },
    { type: 'quiz', question: 'Doiraning yuzasi formulasi qaysi?', options: ['2πr', 'πr²', 'πd', '2r²'], correctIndex: 1 },
  ],

  // Course 5: Fizika
  '5-1': [
    { type: 'quiz', question: 'Nyutonning 2-qonuni formulasi?', options: ['F = ma', 'E = mc²', 'P = mv', 'W = Fs'], correctIndex: 0, explanation: 'F = ma — kuch = massa × tezlanish' },
    { type: 'fill_blank', before: 'Erkin tushish tezlanishi g ≈', after: 'm/s²', correctWord: '9.8', options: ['9.8', '10.2', '8.9', '11.0'], hint: 'Yer sayyorasida' },
    { type: 'quiz', question: 'Tezlik birligi qaysi?', options: ['kg', 'm/s', 'N', 'J'], correctIndex: 1 },
  ],
  '5-2': [
    { type: 'quiz', question: 'Suvning qaynash harorati necha °C?', options: ['90', '100', '110', '120'], correctIndex: 1 },
    { type: 'quiz', question: 'Absolyut nol necha Kelvin?', options: ['-273°C', '0°C', '100°C', '-100°C'], correctIndex: 0, explanation: 'Absolyut nol = 0 K = -273.15°C' },
  ],
  '5-3': [
    { type: 'quiz', question: 'Om qonuni formulasi?', options: ['U = IR', 'P = UI', 'W = Pt', 'F = qE'], correctIndex: 0, explanation: 'U = I × R — kuchlanish = tok × qarshilik' },
    { type: 'fill_blank', before: 'Tok kuchi birligi —', after: '.', correctWord: 'Amper', options: ['Amper', 'Volt', 'Vatt', 'Om'], hint: 'Andre-Mari ... nomi bilan' },
  ],
};
