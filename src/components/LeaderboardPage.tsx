import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Flame, Medal, Trophy } from 'lucide-react';
import { currentUser as baseCurrentUser, mockLeaderboard } from '../data/mockData';
import { useUser } from '../context/UserContext';
import type { LeaderboardEntry } from '../types';
import { getPalette } from '../theme';

type TimeFilter = 'week' | 'month' | 'all';

const seededEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    xp: 15800,
    streak: 19,
    user: { ...baseCurrentUser, id: 'seed-1', name: 'Javohir R.', completedCourses: ['1', '4', '5'], xp: 15800, streak: 19 },
  },
  {
    rank: 2,
    xp: 12400,
    streak: 14,
    user: { ...baseCurrentUser, id: 'seed-2', name: 'Malika A.', completedCourses: ['1', '3'], xp: 12400, streak: 14 },
  },
  {
    rank: 3,
    xp: 11100,
    streak: 11,
    user: { ...baseCurrentUser, id: 'seed-3', name: 'Sardor K.', completedCourses: ['4', '5'], xp: 11100, streak: 11 },
  },
  {
    rank: 4,
    xp: 9842,
    streak: 12,
    user: { ...baseCurrentUser, id: 'seed-4', name: 'Dilnoza M.', completedCourses: ['1', '4'], xp: 9842, streak: 12 },
  },
  {
    rank: 5,
    xp: 8901,
    streak: 8,
    user: { ...baseCurrentUser, id: 'seed-5', name: 'Azizbek G.', completedCourses: ['5'], xp: 8901, streak: 8 },
  },
];

export default function LeaderboardPage() {
  const { user, theme } = useUser();
  const colors = getPalette(theme);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const filters: { key: TimeFilter; label: string }[] = [
    { key: 'week', label: 'Bu hafta' },
    { key: 'month', label: 'Bu oy' },
    { key: 'all', label: 'Barcha davr' },
  ];

  const leaderboardData = useMemo(() => {
    const source = mockLeaderboard.length > 0 ? mockLeaderboard : seededEntries;
    const activeUser = user
      ? {
          rank: 0,
          xp: user.xp,
          streak: user.streak,
          user: {
            ...baseCurrentUser,
            ...user,
          },
        }
      : null;

    const withoutUser = source.filter((entry) => entry.user.id !== activeUser?.user.id);
    const combined = activeUser ? [...withoutUser, activeUser] : [...withoutUser];
    const multiplier = timeFilter === 'week' ? 1 : timeFilter === 'month' ? 1.15 : 1.35;

    return combined
      .map((entry) => ({
        ...entry,
        score: Math.round(entry.xp * multiplier + entry.streak * 17 + entry.user.completedCourses.length * 45),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  }, [timeFilter, user]);

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const currentUserRank = leaderboardData.find((entry) => entry.user.id === user?.id)?.rank ?? null;

  return (
    <div className="page-content min-h-full px-6 pb-8" style={{ background: colors.background }}>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 -mx-6 mb-6 px-6 pb-4 pt-safe-top backdrop-blur-xl"
        style={{ background: theme === 'dark' ? 'rgba(14,14,14,0.88)' : 'rgba(255,255,255,0.92)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: colors.surfaceContainer }}>
            <Trophy className="h-5 w-5" style={{ color: colors.primary }} />
          </div>
          <h1 className="text-lg font-black tracking-[-0.04em]" style={{ color: colors.primary }}>
            Reyting
          </h1>
        </div>
      </motion.header>

      <div className="mb-8 flex gap-2 rounded-full p-1" style={{ background: colors.surfaceContainerLow }}>
        {filters.map((filter) => {
          const active = timeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setTimeFilter(filter.key)}
              className="flex-1 rounded-full px-4 py-2.5 text-xs font-bold transition-all"
              style={{
                background: active ? colors.primary : 'transparent',
                color: active ? colors.onPrimary : colors.onSurfaceVariant,
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <section className="mb-8 rounded-[32px] px-4 pb-10 pt-16" style={{ background: 'linear-gradient(180deg, rgba(195,255,45,0.08) 0%, rgba(14,14,14,0) 100%)' }}>
        <div className="flex items-end justify-center gap-3">
          {topThree[1] && <PodiumCard entry={topThree[1]} place={2} colors={colors} />}
          {topThree[0] && <PodiumCard entry={topThree[0]} place={1} primary colors={colors} />}
          {topThree[2] && <PodiumCard entry={topThree[2]} place={3} colors={colors} />}
        </div>
      </section>

      <section className="space-y-3">
        {rest.map((entry, index) => {
          const isCurrentUser = entry.user.id === user?.id;
          return (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-4 rounded-[24px] p-4"
              style={{
                background: isCurrentUser ? colors.primary : colors.surfaceContainer,
                color: isCurrentUser ? colors.onPrimary : colors.onSurface,
                boxShadow: isCurrentUser ? '0 0 20px rgba(195,255,46,0.18)' : 'none',
              }}
            >
              <span
                className="w-4 text-sm font-black italic"
                style={{ color: isCurrentUser ? colors.onPrimary : colors.onSurfaceVariant }}
              >
                {entry.rank}
              </span>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black"
                style={{ background: isCurrentUser ? 'rgba(0,0,0,0.14)' : colors.surfaceBright, color: isCurrentUser ? colors.onPrimary : colors.primary }}
              >
                {entry.user.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {entry.user.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-[11px]" style={{ color: 'inherit', opacity: 0.75 }}>
                      (Siz)
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: isCurrentUser ? 'inherit' : colors.onSurfaceVariant }}>
                  <Flame className="h-3 w-3" style={{ color: colors.tertiary }} />
                  <span>{entry.streak} kunlik streak</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black">{entry.score.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: isCurrentUser ? 'inherit' : colors.onSurfaceVariant }}>
                  XP
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      <div className="sticky bottom-0 z-10 px-1 pb-2 pt-4">
        <div
          className="flex items-center justify-between rounded-[28px] border px-4 py-4 backdrop-blur-xl"
          style={{
            background: 'rgba(32,31,31,0.9)',
            borderColor: `${colors.outlineVariant}22`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: colors.primary }}>
              <Trophy className="h-4 w-4" style={{ color: colors.onPrimary }} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: colors.onSurfaceVariant }}>
                Sizning o'rningiz
              </p>
              <p className="text-base font-black" style={{ color: colors.onSurface }}>
                #{currentUserRank ?? '-'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: colors.onSurfaceVariant }}>
              Jami XP
            </p>
            <p className="text-base font-black" style={{ color: colors.primary }}>
              {user?.xp || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodiumCard({
  entry,
  place,
  primary = false,
  colors,
}: {
  entry: LeaderboardEntry & { score?: number };
  place: 1 | 2 | 3;
  primary?: boolean;
  colors: ReturnType<typeof getPalette>;
}) {
  const avatar = entry.user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <div className={`flex flex-1 flex-col items-center ${primary ? '-mt-8' : ''}`}>
      <div className="relative mb-3">
        <div
          className={`flex items-center justify-center rounded-full border-4 font-black ${primary ? 'h-24 w-24 text-2xl' : 'h-16 w-16 text-lg'}`}
          style={{
            borderColor: primary ? `${colors.primary}55` : place === 2 ? `${colors.secondary}44` : `${colors.tertiary}44`,
            background: primary ? colors.primary : colors.surfaceContainer,
            color: primary ? colors.onPrimary : colors.onSurface,
          }}
        >
          {avatar}
        </div>

        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1"
          style={{
            background: primary ? colors.primary : colors.surfaceContainer,
            border: `1px solid ${primary ? `${colors.primary}66` : `${colors.outlineVariant}55`}`,
          }}
        >
          <span
            className="text-[10px] font-black"
            style={{ color: primary ? colors.onPrimary : place === 2 ? colors.secondary : colors.tertiary }}
          >
            #{place}
          </span>
        </div>

        {primary ? (
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: colors.primary }}>
            <Crown className="h-4 w-4" style={{ color: colors.onPrimary }} />
          </div>
        ) : (
          <div
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: place === 2 ? colors.surfaceBright : `${colors.tertiary}CC` }}
          >
            <Medal className="h-4 w-4" style={{ color: '#ffffff' }} />
          </div>
        )}
      </div>

      <p className="w-24 truncate text-center text-sm font-bold" style={{ color: colors.onSurface }}>
        {entry.user.name}
      </p>
      <p className="text-[11px] font-black" style={{ color: colors.primary }}>
        {(entry.score || entry.xp).toLocaleString()} XP
      </p>
    </div>
  );
}
