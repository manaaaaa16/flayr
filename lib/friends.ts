import { supabase } from "./supabase";

export type Profile = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  friendCode: string;
};

export type LeaderboardEntry = {
  userId: string;
  name: string;
  avatarUrl: string | null;
  friendCode: string;
  currentStreak: number;
  weeklyQuizzes: number;
};

function generateFriendCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FL-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function getOrCreateProfile(
  userId: string,
  name: string,
  avatarUrl: string | null
): Promise<Profile> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) {
    return {
      userId: existing.user_id,
      name: existing.name,
      avatarUrl: existing.avatar_url,
      friendCode: existing.friend_code,
    };
  }

  let friendCode = generateFriendCode();
  let attempts = 0;

  while (attempts < 10) {
    const { data: conflict } = await supabase
      .from("profiles")
      .select("friend_code")
      .eq("friend_code", friendCode)
      .single();

    if (!conflict) break;
    friendCode = generateFriendCode();
    attempts++;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .insert({ user_id: userId, name, avatar_url: avatarUrl, friend_code: friendCode })
    .select()
    .single();

  return {
    userId: profile.user_id,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    friendCode: profile.friend_code,
  };
}

export async function addFriendByCode(
  userId: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("friend_code", code.toUpperCase())
    .single();

  if (!profile) return { success: false, message: "Friend code not found" };
  if (profile.user_id === userId) return { success: false, message: "That's your own code!" };

  const { error } = await supabase
    .from("friendships")
    .insert({ user_id: userId, friend_id: profile.user_id });

  if (error) {
    if (error.code === "23505") return { success: false, message: "Already friends!" };
    return { success: false, message: "Something went wrong" };
  }

  await supabase
    .from("friendships")
    .insert({ user_id: profile.user_id, friend_id: userId });

  return { success: true, message: `Added ${profile.name}!` };
}

export async function getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  const { data: friendships } = await supabase
    .from("friendships")
    .select("friend_id")
    .eq("user_id", userId);

  const friendIds = (friendships || []).map((f) => f.friend_id);
  const allIds = [userId, ...friendIds];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", allIds);

  const { data: streakRows } = await supabase
    .from("streaks")
    .select("*")
    .in("user_id", allIds);

  const streakMap = new Map(
    (streakRows || []).map((s) => [s.user_id, s])
  );

  const entries: LeaderboardEntry[] = (profiles || []).map((p) => {
    const s = streakMap.get(p.user_id);
    return {
      userId: p.user_id,
      name: p.name,
      avatarUrl: p.avatar_url,
      friendCode: p.friend_code,
      currentStreak: s?.current_streak || 0,
      weeklyQuizzes: s?.weekly_quizzes || 0,
    };
  });

  return entries.sort((a, b) => b.weeklyQuizzes - a.weeklyQuizzes);
}
