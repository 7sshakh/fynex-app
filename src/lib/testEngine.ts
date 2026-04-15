export interface TestResult {
  score: number; // 0-9 scale
  feedback: string;
}

export function evaluateTest(type: 'reading' | 'listening' | 'writing', answers: Record<string, string>, rawScoreScale?: number): TestResult {
  if (type === 'reading' || type === 'listening') {
    // rawScoreScale: standard percentage
    const rawScore = rawScoreScale || Math.random() * 100;
    
    // Simulate IELTS band
    let band = 0;
    if (rawScore > 90) band = 9.0;
    else if (rawScore > 80) band = 8.0;
    else if (rawScore > 70) band = 7.0;
    else if (rawScore > 60) band = 6.0;
    else if (rawScore > 50) band = 5.0;
    else band = 4.0;

    return {
      score: band,
      feedback: `You got ${Math.round(rawScore)}% correct answers.`
    };
  }

  if (type === 'writing') {
    // simple AI evaluation simulation
    const text = answers['text'] || '';
    const wordCount = text.trim().split(/\s+/).length;
    let band = 5.0;
    let feedbackStr = 'Keep practicing.';

    if (wordCount > 250) {
      band = 7.0;
      feedbackStr = 'Good length and vocabulary.';
    } else if (wordCount > 150) {
      band = 6.0;
      feedbackStr = 'Minimum word count met, but needs more depth.';
    } else {
      band = 4.0;
      feedbackStr = 'Text is too short. Try to write more than 150 words.';
    }

    return {
      score: band,
      feedback: feedbackStr
    };
  }

  return { score: 0, feedback: '' };
}
