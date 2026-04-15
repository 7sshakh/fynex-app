import { Roadmap } from './roadmap';
import { ProgressData } from './progress';

export function applyPenalty(roadmap: Roadmap, progress: ProgressData, dayIndex: number): { roadmap: Roadmap, progress: ProgressData, message: string } {
  if (roadmap.mode !== 'strict') {
    return {
      roadmap,
      progress,
      message: "Try to complete your tasks today 😊"
    };
  }

  // Strict mode penalty
  const newProgress = { ...progress, progress: Math.max(0, progress.progress - 10) };
  
  const modifiedRoadmap = { ...roadmap };
  const nextDayIndex = dayIndex + 1;

  if (nextDayIndex < modifiedRoadmap.dailyTasks.length) {
    // Add extra task to next day
    const extraTask = {
      id: `penalty-task-${Date.now()}`,
      title: "Qo'shimcha jazo mashqi",
      type: "practice" as const,
      duration: 30,
      difficulty: "hard" as const,
      completed: false
    };
    modifiedRoadmap.dailyTasks[nextDayIndex].tasks = [...modifiedRoadmap.dailyTasks[nextDayIndex].tasks, extraTask];
  }

  return {
    roadmap: modifiedRoadmap,
    progress: newProgress,
    message: "You missed your task. You are falling behind."
  };
}
