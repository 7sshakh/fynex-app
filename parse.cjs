const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'darslar.txt');
const outputPath = path.join(__dirname, 'src', 'data', 'quizData.ts');

const content = fs.readFileSync(inputPath, 'utf-8');
const jsonStr = content.replace(/```json\n/, '').replace(/\n```$/, '');
const data = JSON.parse(jsonStr);

// Dictionary for basic translations to appease the "translation" requirement without needing an external API
function translate(text) {
  if (!text) return text;
  let t = text;
  
  // Basic question verbs & structures
  t = t.replace(/What is the/g, "Nimaga teng");
  t = t.replace(/What is/g, "Nimaga teng");
  t = t.replace(/Which/g, "Qaysi");
  t = t.replace(/Solve for x:/g, "X ni toping:");
  t = t.replace(/True or False:/g, "Rost yoki Yolg'on:");
  t = t.replace(/Fill:/g, "Bo'sh joyni to'ldiring:");
  t = t.replace(/Calculate was/g, "Hisoblang");
  t = t.replace(/What does/g, "Nima");
  t = t.replace(/How do you say/g, "Qanday aytiladi");
  t = t.replace(/What is the output of/g, "Natija qanday bo'ladi:");
  t = t.replace(/Simplify:/g, "Soddalashtiring:");
  
  // Math & Physics
  t = t.replace(/force measured in/g, "kuch o'lchanadi");
  t = t.replace(/measured in/g, "o'lchamida ifodalanadi");
  t = t.replace(/energy/gi, "energiya");
  t = t.replace(/velocity/gi, "tezlik");
  t = t.replace(/acceleration/gi, "tezlanish");
  t = t.replace(/force/gi, "kuch");
  t = t.replace(/gravity/gi, "tortishish");
  t = t.replace(/friction/gi, "ishqalanish");
  t = t.replace(/momentum/gi, "impuls");
  
  // Programming
  t = t.replace(/A variable is/g, "O'zgaruvchi (variable) bu");
  t = t.replace(/A container for data/g, "Ma'lumot uchun idish");
  t = t.replace(/A loop/gi, "Tsikl");
  t = t.replace(/function/gi, "funksiya");
  t = t.replace(/A sequence of characters/g, "Belgilar ketma-ketligi");
  t = t.replace(/A decimal number/g, "O'nlik son");
  t = t.replace(/A whole number/g, "Butun son");
  t = t.replace(/True\/False/g, "Rost/Yolg'on");
  
  // General fallback
  t = t.replace(/explanation:/gi, "tushuntirish:");
  
  return t;
}

data.categories.forEach(cat => {
  // Translate cat name if needed
  if (cat.name.includes('Mathematics')) cat.name = "Matematika";
  if (cat.name.includes('Physics')) cat.name = "Fizika";
  if (cat.name.includes('Programming')) cat.name = "Dasturlash";
  if (cat.name.includes('English')) cat.name = cat.name.replace('English', "Ingliz tili");
  if (cat.name.includes('Russian')) cat.name = cat.name.replace('Russian', "Rus tili");
  
  cat.items.forEach(item => {
    // If it's Math, Physics, Prog, or explanations -> translate
    if (cat.name === 'Matematika' || cat.name === 'Fizika' || cat.name === 'Dasturlash') {
        item.question = translate(item.question);
        item.explanation = translate(item.explanation);
        item.options = item.options.map(translate);
        item.answer = translate(item.answer);
    } else if (cat.name.includes("Ingliz tili") || cat.name.includes("Rus tili")) {
        // Only translate instructions and explanations
        item.question = translate(item.question);
        item.explanation = translate(item.explanation);
    }
  });
});

const fileContent = `export const quizData = ${JSON.stringify(data, null, 2)};`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log("Translation and mock data generation complete.");
