import { supabase } from "./supabase";

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  freezeUsedThisWeek: boolean;
};

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function loadStreak(userId: string): Promise<StreakData> {
  const { data } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return { currentStreak: 0, longestStreak: 0, lastStudyDate: null, freezeUsedThisWeek: false };
  }

  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const freezeUsedThisWeek = data.freeze_week_number === currentWeek && data.freeze_used_week > 0;

  return {
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
    lastStudyDate: data.last_study_date,
    freezeUsedThisWeek,
  };
}

export async function recordStudySession(userId: string): Promise<StreakData> {
  const today = new Date();
  const todayStr = toDateString(today);
  const yesterdayStr = toDateString(new Date(today.getTime() - 86400000));

  const { data: existing } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  let currentStreak = 1;
  let longestStreak = 1;
  let freezeUsedWeek = 0;
  let freezeWeekNumber = 0;

  if (existing) {
    // Already studied today — no change needed
    if (existing.last_study_date === todayStr) {
      return {
        currentStreak: existing.current_streak,
        longestStreak: existing.longest_streak,
        lastStudyDate: existing.last_study_date,
        freezeUsedThisWeek: false,
      };
    }

    const currentWeek = getWeekNumber(today);
    freezeUsedWeek = existing.freeze_used_week || 0;
    freezeWeekNumber = existing.freeze_week_number || 0;

    if (existing.last_study_date === yesterdayStr) {
      // Studied yesterday — continue streak
      currentStreak = existing.current_streak + 1;
    } else {
      // Missed a day — check if freeze is available
      const freezeAvailableThisWeek = freezeWeekNumber !== currentWeek || freezeUsedWeek === 0;
      if (freezeAvailableThisWeek && existing.current_streak > 0) {
        // Use freeze — streak continues
        currentStreak = existing.current_streak + 1;
        freezeUsedWeek = 1;
        freezeWeekNumber = currentWeek;
      } else {
        // Streak broken
        currentStreak = 1;
      }
    }

    longestStreak = Math.max(currentStreak, existing.longest_streak);
  }

  const currentWeekNum = getWeekNumber(today);
  const prevWeeklyQuizzes = existing?.week_reset_number === currentWeekNum
    ? (existing?.weekly_quizzes || 0)
    : 0;

  await supabase.from("streaks").upsert({
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_study_date: todayStr,
    freeze_used_week: freezeUsedWeek,
    freeze_week_number: freezeWeekNumber,
    weekly_quizzes: prevWeeklyQuizzes + 1,
    week_reset_number: currentWeekNum,
  });

  return {
    currentStreak,
    longestStreak,
    lastStudyDate: todayStr,
    freezeUsedThisWeek: freezeUsedWeek > 0,
  };
}
