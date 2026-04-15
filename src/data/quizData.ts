export const quizData: any = {
  categories: [
    {
      name: "Ingliz tili (Boshlang'ich)",
      level: "Beginner",
      type: "quiz",
      items: [
        { id: "eng_beg_1", question: "Ingliz tilida 'salom' qanday aytiladi?", options: ["Hi", "Bye", "Thank you", "Sorry"], answer: "Hi", explanation: "'Hi' - eng ko'p ishlatiladigan salomlashish so'zi." },
        { id: "eng_beg_2", question: "5 dan keyin qaysi raqam keladi?", options: ["4", "6", "7", "8"], answer: "6", explanation: "Sanoq bo'yicha: 5, keyin 6." },
        { id: "eng_beg_3", question: "Onamning opasi mening ______ bo'ladi.", options: ["aunt", "uncle", "cousin", "grandma"], answer: "aunt", explanation: "Onaning opasi yoki singlisi = aunt (xola)." },
        { id: "eng_beg_4", question: "Bo'sh joyni to'ldiring: I ______ a student.", options: ["am", "is", "are", "be"], answer: "am", explanation: "'I' (men) olmoshi bilan har doim 'am' ishlatiladi." },
        { id: "eng_beg_5", question: "12 + 8 nechaga teng?", options: ["18", "20", "22", "24"], answer: "20", explanation: "12+8=20." },
        { id: "eng_beg_6", question: "Qaysi so'z 'ota va ona' degan ma'noni beradi?", options: ["parents", "siblings", "children", "grandparents"], answer: "parents", explanation: "Parents = ota-ona." },
        { id: "eng_beg_7", question: "Rost yoki Yolg'on: 'Good evening' ertalab aytiladi.", options: ["True", "False"], answer: "False", explanation: "'Good evening' kechqurun aytiladi." },
        { id: "eng_beg_8", question: "40 raqami so'z bilan qanday yoziladi:", options: ["fourteen", "forty", "four", "fourth"], answer: "forty", explanation: "40 = forty." },
        { id: "eng_beg_9", question: "Akamning qizi mening ______ bo'ladi.", options: ["niece", "nephew", "cousin", "sister"], answer: "niece", explanation: "Aka yoki ukaning qizi = niece (jiyan)." },
        { id: "eng_beg_10", question: "To'ldiring: They ______ playing soccer.", options: ["is", "am", "are", "be"], answer: "are", explanation: "'They' ko'plikdagi olmosh, shuning uchun 'are' olinadi." }
      ]
    },
    {
      name: "Rus tili (Boshlang'ich)",
      level: "Beginner",
      type: "quiz",
      items: [
        { id: "rus_beg_1", question: "Rus alifbosining birinchi harfi nima?", options: ["Б", "А", "В", "Г"], answer: "А", explanation: "А - alifboning 1-harfi." },
        { id: "rus_beg_2", question: "Rus tilida 'salom' qanday aytiladi?", options: ["Пока", "Привет", "Спасибо", "Да"], answer: "Привет", explanation: "Привет (privet) bu norasmiy salomlashish." },
        { id: "rus_beg_3", question: "Rus tilida 'ona' so'zi qanday tarjima qilinadi?", options: ["Отец", "Мама", "Брат", "Сестра"], answer: "Мама", explanation: "Мама = ona." },
        { id: "rus_beg_4", question: "To'ldiring: Я ______ студент.", options: ["есть", "являюсь", "—", "быть"], answer: "—", explanation: "Rus tilida hozirgi zamonda 'bo'lmoq' (am/is/are) fe'li odatda tushirib qoldiriladi." },
        { id: "rus_beg_5", question: "Inglizchadagi 'B' tovushini qaysi harf beradi?", options: ["В", "Б", "П", "М"], answer: "Б", explanation: "Б harfi = B tovushini beradi." },
        { id: "rus_beg_6", question: "'Ha' deb qanday aytiladi?", options: ["Нет", "Да", "Хорошо", "Плохо"], answer: "Да", explanation: "Да = ha." },
        { id: "rus_beg_7", question: "Rus tilida 'aka/uka' nima?", options: ["Брат", "Сестра", "Дядя", "Тётя"], answer: "Брат", explanation: "Брат = aka yoki uka." }
      ]
    },
    {
      name: "Matematika",
      level: "Basic",
      type: "quiz",
      items: [
        { id: "math_bas_1", question: "15 + 7 nechaga teng?", options: ["21", "22", "23", "24"], answer: "22", explanation: "15 ga 7 qo'shilsa 22 chiqadi." },
        { id: "math_bas_2", question: "30 - 12 nechaga teng?", options: ["18", "16", "20", "22"], answer: "18", explanation: "30 ayirilgan 12 teng 18." },
        { id: "math_bas_3", question: "4 x 6 nechaga teng?", options: ["20", "24", "22", "26"], answer: "24", explanation: "4 ni 6 ga ko'paytirsak 24." },
        { id: "math_bas_4", question: "20 ÷ 5 nechaga teng?", options: ["3", "4", "5", "6"], answer: "4", explanation: "20 ni 5 ga bo'lsak 4 chiqadi." },
        { id: "math_bas_5", question: "x ni toping: 2x + 5 = 13", options: ["3", "4", "5", "6"], answer: "4", explanation: "2x = 8 bo'ladi, x = 4." },
        { id: "math_bas_6", question: "y = 3x - 2 to'g'ri chizig'ining qiyaligi (slope) nima?", options: ["-2", "3", "1/3", "2"], answer: "3", explanation: "Qiyalik har doim x ning oldidagi koeffitsiyent bo'ladi (3)." },
        { id: "math_bas_7", question: "Soddalashtiring: (x²)(x³)", options: ["x⁵", "x⁶", "x⁹", "x¹"], answer: "x⁵", explanation: "Ko'paytirishda darajalar qo'shiladi: 2+3=5." }
      ]
    },
    {
      name: "Fizika",
      level: "Fundamental",
      type: "quiz",
      items: [
        { id: "phy_fun_1", question: "Kuch nima bilan o'lchanadi?", options: ["Joul (J)", "Nyuton (N)", "Vatt (W)", "Paskal (Pa)"], answer: "Nyuton (N)", explanation: "Kuchning SI sistemasidagi o'lchov birligi Nyuton hisoblanadi." },
        { id: "phy_fun_2", question: "F = ma formulasi tarifi nimaga tegishli?", options: ["Nyutonning Birinchi Qonuni", "Nyutonning Ikkinchi Qonuni", "Nyutonning Uchinchi Qonuni", "Tortishish qonuni"], answer: "Nyutonning Ikkinchi Qonuni", explanation: "Nyutonning ikkinchi qonuni: kuch = massa × tezlanish." },
        { id: "phy_fun_3", question: "Jismning o'z harakat holatini saqlab qolish xususiyati nima deyiladi?", options: ["Kuch", "Inertsiya", "Tezlik", "Impuls"], answer: "Inertsiya", explanation: "Inertsiya bu jismning o'zgarishga qarshiligidir." },
        { id: "phy_fun_4", question: "Energiyaning o'lchov birligi nima?", options: ["Nyuton", "Joul", "Vatt", "Volt"], answer: "Joul", explanation: "Energiya Joule (J) bilan o'lchanadi." },
        { id: "phy_fun_5", question: "Rost yoki Yolg'on: Tinch turgan jismga tashqi kuch ta'sir etmaguncha o'z holatini saqlaydi.", options: ["True", "False"], answer: "True", explanation: "Bu Nyutonning birinchi qonuni hisoblanadi." },
        { id: "phy_fun_6", question: "Cho'zilgan rezinada qanday energiya yig'iladi?", options: ["Kinetik", "Potensial", "Issiqlik", "Kimyoviy"], answer: "Potensial", explanation: "Deformatsiyalangan jismlarda potensial energiya yig'iladi." },
        { id: "phy_fun_7", question: "Tezlik = masofa / ?", options: ["Vaqt", "Massa", "Kuch", "Tezlanish"], answer: "Vaqt", explanation: "Tezlik formulasida V = S / t (vaqt)." }
      ]
    },
    {
      name: "Dasturlash",
      level: "Pro",
      type: "quiz",
      items: [
        { id: "prog_bas_1", question: "O'zgaruvchi (variable) nima?", options: ["Funksiya", "Ma'lumot saqlash idishi", "Tsikl", "Shart"], answer: "Ma'lumot saqlash idishi", explanation: "O'zgaruvchilar ma'lumotlarni (raqam, matn) saqlash uchun ishlatiladi." },
        { id: "prog_bas_2", question: "Aksariyat dasturlash tillarida qiymat o'zlashtirish belgisi qaysi?", options: ["==", "=", "===", ":="], answer: "=", explanation: "Bitta tenglik belgisi qiymat berish uchun ishlatiladi." },
        { id: "prog_bas_3", question: "'if' sharti qanday vazifa bajaradi?", options: ["Kodni takrorlaydi", "Shartni tekshiradi", "O'zgaruvchi yaratadi", "Tugmani bosadi"], answer: "Shartni tekshiradi", explanation: "If (agar) shart bajarilishini tekshirib keyin kodni o'qiydi." },
        { id: "prog_bas_4", question: "Tsikl (Loop) ning vazifasi nima?", options: ["Shart tekshirish", "Kodni bir necha marta takrorlash", "Ma'lumot turi", "Xatolikni topish"], answer: "Kodni bir necha marta takrorlash", explanation: "Tsikllar orqali kerakli kod qayta-qayta ishga tushiriladi." },
        { id: "prog_bas_5", question: "Qaysi tsikl oldindan belgilangan marta aylanadi?", options: ["while", "for", "do-while", "if"], answer: "for", explanation: "For tsikli hisoblagich bilan ma'lum miqdorgacha sanoq bajaradi." },
        { id: "prog_bas_6", question: "Ushbu kodning natijasi nima: x = 5; if (x > 3) { print('Yes'); } else { print('No'); }", options: ["Yes", "No", "Xato", "Hech narsa"], answer: "Yes", explanation: "5 soni 3 dan katta bo'lgani uchun 'Yes' qismi ishladi." },
        { id: "prog_bas_7", question: "String nima?", options: ["Raqam", "Matn yoki belgilar ketma-ketligi", "Mantiqiy ifoda", "Array"], answer: "Matn yoki belgilar ketma-ketligi", explanation: "String - bu harflar va belgilar ketma-ketligi (masalan: 'salom')." }
      ]
    },
    {
      name: "IELTS Mock Test",
      level: "Advanced",
      type: "mock",
      items: [
        { id: "ielts_1", question: "Reading: The passage states that the Industrial Revolution began in which country? (Assume passage: 'The Industrial Revolution started in Britain...')", options: ["France", "Germany", "Britain", "USA"], answer: "Britain", explanation: "Text explicitly says Britain." },
        { id: "ielts_2", question: "Reading: 'The author believes technology has only positive effects.'", options: ["True", "False", "Not Given"], answer: "False", explanation: "Author discusses negative effects as well." },
        { id: "ielts_3", question: "Listening: What time does the train to Manchester leave? (Audio script: 'The next train to Manchester departs at 17:45 from platform 3.')", options: ["5:15 PM", "5:45 PM", "6:15 PM", "5:30 PM"], answer: "5:45 PM", explanation: "17:45 = 5:45 PM." }
      ]
    },
    {
      name: "SAT Mock Test",
      level: "Advanced",
      type: "mock",
      items: [
        { id: "sat_1", question: "Math: If 3x + 5 = 20, what is x?", options: ["5", "6", "7", "8"], answer: "5", explanation: "3x=15, x=5." },
        { id: "sat_2", question: "Math: What is the area of a circle with radius 4?", options: ["8π", "16π", "32π", "64π"], answer: "16π", explanation: "Area = πr² = 16π." },
        { id: "sat_3", question: "Reading: The author's tone in the passage can best be described as:", options: ["Sarcastic", "Objective", "Enthusiastic", "Pessimistic"], answer: "Objective", explanation: "Neutral, fact-based tone." }
      ]
    }
  ]
};
