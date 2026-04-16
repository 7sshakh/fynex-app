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
  // Course 1: Ingliz Tili Beginner will be injected dynamically


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

  // Course 2: Ingliz tili Intermediate
  '2-1': [
    { type: 'flashcard', word: 'have finished', pronunciation: '[hæv ˈfɪnɪʃt]', translation: 'tugatganman', definition: 'Present Perfect shakli' },
    { type: 'quiz', question: 'Present Perfect qaysi formulada to‘g‘ri yozilgan?', options: ['have/has + V3', 'did + V1', 'am/is/are + Ving', 'was/were + V3'], correctIndex: 0, explanation: 'Present Perfect: have/has + past participle (V3).' },
    { type: 'fill_blank', before: 'She has', after: 'her homework already.', correctWord: 'finished', options: ['finished', 'finish', 'finishes', 'finishing'], hint: 'V3 shakli kerak' },
  ],
  '2-2': [
    { type: 'flashcard', word: 'should', pronunciation: '[ʃʊd]', translation: 'kerak', definition: 'Maslahat berishda ishlatiladi' },
    { type: 'quiz', question: 'Qaysi gapda modal verb to‘g‘ri ishlatilgan?', options: ['You should study more.', 'You should to study.', 'You should studying.', 'You should studies.'], correctIndex: 0 },
    { type: 'fill_blank', before: 'You', after: 'drink more water.', correctWord: 'should', options: ['should', 'can', 'musted', 'are'], hint: 'Maslahat beryapsiz' },
  ],
  '2-3': [
    { type: 'flashcard', word: 'If I had time', pronunciation: '[ɪf aɪ hæd taɪm]', translation: 'Agar vaqtim bo‘lsa edi', definition: 'Conditionals misoli' },
    { type: 'quiz', question: 'Second Conditional qaysi ko‘rinishda tuziladi?', options: ['If + past simple, would + V1', 'If + V1, will + V1', 'If + had + V3, would have + V3', 'If + V2, will + V1'], correctIndex: 0 },
    { type: 'fill_blank', before: 'If I had more money, I', after: 'travel more.', correctWord: 'would', options: ['would', 'will', 'am', 'have'], hint: 'Second Conditional' },
  ],

  // Course 6: Dasturlash
  '6-1': [
    { type: 'flashcard', word: 'variable', pronunciation: '[ˈver.i.ə.bəl]', translation: 'o‘zgaruvchi', definition: 'Ma’lumot saqlaydigan nomlangan joy' },
    { type: 'quiz', question: 'Python’da o‘zgaruvchi qanday yaratiladi?', options: ['x = 10', 'int x = 10', 'let x = 10', 'var x:10'], correctIndex: 0, explanation: 'Python’da turini alohida yozish shart emas.' },
    { type: 'fill_blank', before: 'name', after: '"Ali"', correctWord: '=', options: ['=', '==', ':', '->'], hint: 'Qiymat biriktirish belgisi kerak' },
  ],
  '6-2': [
    { type: 'flashcard', word: 'if', pronunciation: '[ɪf]', translation: 'agar', definition: 'Shartli operator' },
    { type: 'quiz', question: 'Qaysi kod bo‘lagi shartni tekshiradi?', options: ['if x > 5:', 'for x > 5:', 'def x > 5:', 'print x > 5:'], correctIndex: 0 },
    { type: 'fill_blank', before: 'if score >= 70', after: ' print("Passed")', correctWord: ':', options: [':', ';', ',', '.'], hint: 'Shartdan keyin ikki nuqta qo‘yiladi' },
  ],
  '6-3': [
    { type: 'flashcard', word: 'for loop', pronunciation: '[fɔːr luːp]', translation: 'takrorlash operatori', definition: 'Bir xil amalni qayta bajaradi' },
    { type: 'quiz', question: 'Python’da 5 marta takrorlash uchun qaysi variant to‘g‘ri?', options: ['for i in range(5):', 'repeat(5):', 'loop i to 5:', 'while 5:'], correctIndex: 0 },
    { type: 'fill_blank', before: 'for i in', after: '(3): print(i)', correctWord: 'range', options: ['range', 'loop', 'list', 'set'], hint: 'Eng ko‘p ishlatiladigan funksiya' },
  ],
  '6-4': [
    { type: 'flashcard', word: 'function', pronunciation: '[ˈfʌŋk.ʃən]', translation: 'funksiya', definition: 'Qayta ishlatiladigan kod bloki' },
    { type: 'quiz', question: 'Python’da funksiya qaysi kalit so‘z bilan ochiladi?', options: ['def', 'func', 'function', 'lambda'], correctIndex: 0 },
    { type: 'fill_blank', before: 'def greet', after: ':\n    print("Hi")', correctWord: '()', options: ['()', '[]', '{}', '<>'], hint: 'Qavslar kerak' },
  ],

  // Course 7: Rus tili Advanced
  '7-1': [
    { type: 'flashcard', word: 'совершенный вид', pronunciation: '[səvʲɪrˈʂenːɨj vʲit]', translation: 'tugallangan harakat', definition: 'Glagolning turi' },
    { type: 'quiz', question: 'Qaysi fe’l tugallangan harakatni bildiradi?', options: ['сделать', 'делать', 'читать', 'говорить'], correctIndex: 0 },
    { type: 'fill_blank', before: 'Я хочу', after: 'домашнее задание сегодня.', correctWord: 'сделать', options: ['сделать', 'делать', 'сделал', 'делаю'], hint: 'Bir martalik yakun' },
  ],
  '7-2': [
    { type: 'flashcard', word: 'сложное предложение', pronunciation: '[ˈsloʐnəjə prʲɪdlɐˈʐenʲɪjə]', translation: 'murakkab gap', definition: 'Bir nechta qismli gap' },
    { type: 'quiz', question: 'Sintaksis nimani o‘rganadi?', options: ['Gap tuzilishini', 'Tovushlarni', 'Harflarni', 'Urg‘uni'], correctIndex: 0 },
    { type: 'fill_blank', before: 'Когда я пришёл, он уже', after: '.', correctWord: 'ушёл', options: ['ушёл', 'идёт', 'идти', 'ушли'], hint: 'O‘tgan zamon' },
  ],

  // Course 8: Matematika Advanced
  '8-1': [
    { type: 'quiz', question: 'x² - 5x + 6 = 0 tenglamaning ildizlari?', options: ['2 va 3', '1 va 6', '-2 va -3', '3 va 5'], correctIndex: 0, explanation: '(x-2)(x-3)=0' },
    { type: 'fill_blank', before: 'Diskriminant formulasi: b² -', after: '.', correctWord: '4ac', options: ['4ac', '2ac', 'a²c', '4ab'], hint: 'Kvadrat tenglama formulasi' },
    { type: 'flashcard', word: 'discriminant', pronunciation: '[dɪˈskrɪmɪnənt]', translation: 'diskriminant' },
  ],
  '8-2': [
    { type: 'flashcard', word: 'logarithm', pronunciation: '[ˈlɒɡərɪðəm]', translation: 'logarifm', definition: 'Darajaga ko‘tarishning teskari amali' },
    { type: 'quiz', question: 'log₁₀(100) nechaga teng?', options: ['1', '2', '10', '100'], correctIndex: 1 },
    { type: 'fill_blank', before: 'log₂(8) =', after: '', correctWord: '3', options: ['2', '3', '4', '8'], hint: '2 ning nechanchi darajasi 8?' },
  ],
  '8-3': [
    { type: 'flashcard', word: 'sin 90°', pronunciation: '[sain nainti dɪˈɡriːz]', translation: '1 ga teng' },
    { type: 'quiz', question: 'cos 0° nechaga teng?', options: ['0', '1', '-1', '90'], correctIndex: 1 },
    { type: 'fill_blank', before: 'sin 30° =', after: '', correctWord: '1/2', options: ['1/2', '1', '0', '√3'], hint: 'Asosiy trigonometrik qiymat' },
  ],
};

import englishData from './english_beginner.json';

englishData.lessons?.forEach((lesson: any) => {
  const steps: LessonStep[] = [];
  lesson.topics?.forEach((topic: any) => {
    if (topic.type === 'vocabulary' && topic.items) {
      topic.items.forEach((item: any) => {
        steps.push({
          type: 'flashcard',
          word: item.word,
          pronunciation: `[${item.word}]`,
          translation: item.translation_uz,
          definition: item.example_uz,
        });
      });
    } else if (topic.type === 'mini_lesson') {
      steps.push({
        type: 'flashcard',
        word: 'Mini Dars',
        pronunciation: '[nazariya]',
        translation: lesson.title,
        definition: topic.content_uz,
      });
    } else if (topic.type === 'quiz' && topic.questions) {
      topic.questions.forEach((q: any) => {
        const correctIndex = q.options?.indexOf(q.answer);
        steps.push({
          type: 'quiz',
          question: q.question_uz || q.question,
          options: q.options || [],
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
        });
      });
    }
  });
  if (steps.length > 0) {
    lessonSteps[`1-${lesson.lesson_id}`] = steps;
  }
});


export function getLessonSteps(lessonId: string, lessonTitle?: string): LessonStep[] {
  const direct = lessonSteps[lessonId];
  if (direct && direct.length > 0) return direct;

  return [
    {
      type: 'flashcard',
      word: lessonTitle || 'Yangi dars',
      pronunciation: '[lesson]',
      translation: 'Asosiy tushuncha',
      definition: 'Bu dars uchun demo kontent tayyorlandi.',
    },
    {
      type: 'quiz',
      question: `${lessonTitle || 'Ushbu dars'} bo‘yicha asosiy maqsad nima?`,
      options: ['Tushunchani anglash', 'Shunchaki o‘tib ketish', 'Tasodifiy belgilash', 'Bekor qilish'],
      correctIndex: 0,
      explanation: 'Avval mazmunni tushunish, keyin amaliyot qilish muhim.',
    },
    {
      type: 'fill_blank',
      before: 'Yaxshi natija uchun darsni',
      after: 'yakunlash kerak.',
      correctWord: 'oxirigacha',
      options: ['tezda', 'oxirigacha', 'bekorga', 'yarimta'],
      hint: 'To‘liq yakunlash progressni oshiradi.',
    },
  ];
}
