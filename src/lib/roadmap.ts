export interface OnboardingData {
  userType: string;
  grade?: string;
  goal: string;
  target: {
    type: string;
    university: string;
  };
}

export interface RoadmapTask {
  id: string;
  title: string;
  type: 'lesson' | 'practice' | 'test';
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  completed?: boolean;
}

export interface DailyPlan {
  day: number;
  date: number; // timestamp for the day
  deadline: number; // end of the day deadline timestamp
  tasks: RoadmapTask[];
}

export interface Roadmap {
  mode: 'soft' | 'strict';
  dailyTasks: DailyPlan[];
}

export function generateRoadmap(userData: OnboardingData): Roadmap {
  let mode: 'soft' | 'strict' = 'soft';
  if (userData.grade === '10' || userData.grade === '11') {
    mode = 'strict';
  } else if (userData.goal === 'ielts' || userData.goal === 'university') {
    mode = 'strict';
  }

  const tasksPool: Omit<RoadmapTask, 'id'>[] = [];

  if (userData.goal === 'programming') {
    tasksPool.push(
      { title: "Python asoslari", type: "lesson", duration: 30, difficulty: 'easy' },
      { title: "Sikllar amaliyoti", type: "practice", duration: 40, difficulty: 'medium' },
      { title: "Algoritmik mashq", type: "test", duration: 25, difficulty: 'hard' }
    );
  } else if (userData.goal === 'ielts') {
    tasksPool.push(
      { title: "Reading: True/False/Not Given", type: "lesson", duration: 40, difficulty: 'medium' },
      { title: "Listening Section 1 Mock", type: "test", duration: 30, difficulty: 'easy' },
      { title: "Writing Task 1", type: "practice", duration: 45, difficulty: 'hard' }
    );
  } else {
    // Default / general university prep
    tasksPool.push(
      { title: "Matematika: Tenglamalar", type: "lesson", duration: 35, difficulty: 'easy' },
      { title: "Insho yozish mashqi", type: "practice", duration: 30, difficulty: 'medium' },
      { title: "Mantiqiy savollar mini-test", type: "test", duration: 20, difficulty: 'medium' }
    );
  }

  const now = new Date();
  
  // Strip time from now for midnight alignment
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dailyTasks: DailyPlan[] = [];

  // Generate 7 day plan
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today.getTime());
    dayDate.setDate(dayDate.getDate() + i);
    
    // Deadline is end of that day
    const deadlineDate = new Date(dayDate.getTime());
    deadlineDate.setHours(23, 59, 59, 999);

    const numTasks = Math.floor(Math.random() * 3) + 2; // 2 to 4 tasks
    const dayTasks: RoadmapTask[] = [];

    for (let j = 0; j < numTasks; j++) {
      const pTask = tasksPool[j % tasksPool.length];
      dayTasks.push({
        ...pTask,
        id: `day${i + 1}-task${j + 1}`,
        completed: false
      });
    }

    dailyTasks.push({
      day: i + 1,
      date: dayDate.getTime(),
      deadline: deadlineDate.getTime(),
      tasks: dayTasks
    });
  }

  return {
    mode,
    dailyTasks
  };
}
