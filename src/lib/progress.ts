export interface ProgressData {
  completedTasks: number;
  missedTasks: number;
  streak: number;
  progress: number; // percentage
  lastCheckIn: number; // timestamp
}

export function loadProgress(): ProgressData {
  const stored = localStorage.getItem('fynex_progress');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    completedTasks: 0,
    missedTasks: 0,
    streak: 0,
    progress: 0,
    lastCheckIn: Date.now()
  };
}

export function saveProgress(data: ProgressData) {
  localStorage.setItem('fynex_progress', JSON.stringify(data));
}

export function markTaskComplete(progress: ProgressData, totalTasks: number): ProgressData {
  const newCompleted = progress.completedTasks + 1;
  const newProgress = Math.min(100, Math.round((newCompleted / totalTasks) * 100));
  
  return {
    ...progress,
    completedTasks: newCompleted,
    progress: newProgress,
  };
}

export function updateDailyAccountability(
  progress: ProgressData, 
  allTasksCompleted: boolean, 
  tasksMissed: boolean,
  isStrict: boolean
): ProgressData {
  let newStreak = progress.streak;
  let newMissed = progress.missedTasks;
  let newProgress = progress.progress;

  if (allTasksCompleted) {
    newStreak += 1;
  } else if (tasksMissed) {
    newStreak = 0;
    newMissed += 1;
    if (isStrict) {
      newProgress = Math.max(0, newProgress - 10);
    }
  }

  return {
    ...progress,
    streak: newStreak,
    missedTasks: newMissed,
    progress: newProgress,
    lastCheckIn: Date.now(),
  };
}
