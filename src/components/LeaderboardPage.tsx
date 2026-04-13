import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { currentUser as baseCurrentUser, mockLeaderboard } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { Trophy, Flame, Crown, Medal, ChevronUp } from 'lucide-react';

type TimeFilter = 'week' | 'month' | 'all';

export default function LeaderboardPage() {
  const { user, theme } = useUser();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const filters: { key: TimeFilter; label: string }[] = [
    { key: 'week', label: 'Bu hafta' },
    { key: 'month', label: 'Bu oy' },
    { key: 'all', label: 'Barcha davr' },
  ];

  const leaderboardData = useMemo(() => {
    const activeUser = user
      ? {
          rank: 0,
          user: {
            ...baseCurrentUser,
            ...user,
          },
          xp: user.xp,
          streak: user.streak,
        }
      : null;

    const otherEntries = mockLeaderboard.filter((entry) => entry.user.id !== activeUser?.user.id);
    const combined = activeUser ? [...otherEntries, activeUser] : [...mockLeaderboard];
    const multiplier = timeFilter === 'week' ? 1 : timeFilter === 'month' ? 1.2 : 1.45;

    return combined
      .map((entry) => ({
        ...entry,
        score: Math.round(entry.xp * multiplier + entry.streak * 12 + entry.user.completedCourses.length * 25),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  }, [timeFilter, user]);

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);
  const currentUserRank = leaderboardData.find((entry) => entry.user.id === user?.id)?.rank ?? null;

  return (
    <div className="page-content min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Leaderboard</h1>
            <p className="text-gray-500">Eng faol o'quvchilar reytingi</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-gradient-to-br from-lime-300 to-yellow-400 shadow-lime-500/20' : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200'}`}>
            <Trophy className={`w-6 h-6 ${theme === 'dark' ? 'text-black' : 'text-white'}`} />
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="px-6 mb-6"
      >
        <div className="bg-white rounded-2xl p-1.5 inline-flex shadow-sm border border-gray-100">
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setTimeFilter(filter.key)}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                timeFilter === filter.key ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 mb-8"
      >
        <div className="flex items-end justify-center gap-3">
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {topThree[1].user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center"
                >
                  <Medal className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <p className="font-semibold text-gray-900 text-sm truncate w-full text-center">
                {topThree[1].user.name.split(' ')[0]}
              </p>
              <p className="text-gray-500 text-xs mb-2">
                {topThree[1].score.toLocaleString()} XP
              </p>
              <div className="w-full bg-gray-200 rounded-t-3xl rounded-b-2xl p-3 bg-gradient-to-t from-gray-100 to-gray-200">
                <p className="text-center font-bold text-gray-600">2</p>
              </div>
            </motion.div>
          )}

          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                className="relative mb-3"
              >
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-lime-300 to-yellow-400 text-black shadow-lime-400/30' : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-amber-200'}`}>
                  {topThree[0].user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.9 }}
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-lime-300' : 'bg-amber-500'}`}
                >
                  <Crown className={`w-5 h-5 ${theme === 'dark' ? 'text-black' : 'text-white'}`} />
                </motion.div>
              </motion.div>
              <p className="font-bold text-gray-900 text-sm truncate w-full text-center">
                {topThree[0].user.name.split(' ')[0]}
              </p>
              <p className={`${theme === 'dark' ? 'text-lime-400' : 'text-amber-600'} text-xs font-medium mb-2`}>
                {topThree[0].score.toLocaleString()} XP
              </p>
              <div className={`w-full rounded-t-3xl rounded-b-2xl p-4 bg-gradient-to-t ${theme === 'dark' ? 'from-lime-200 to-yellow-300' : 'from-amber-200 to-amber-300'}`}>
                <p className={`text-center font-bold ${theme === 'dark' ? 'text-black' : 'text-amber-800'}`}>1</p>
              </div>
            </motion.div>
          )}

          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {topThree[2].user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.9, delay: 0.4 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center"
                >
                  <Medal className="w-4 h-4 text-white" />
                </motion.div>
              </div>
              <p className="font-semibold text-gray-900 text-sm truncate w-full text-center">
                {topThree[2].user.name.split(' ')[0]}
              </p>
              <p className="text-gray-500 text-xs mb-2">
                {topThree[2].score.toLocaleString()} XP
              </p>
              <div className="w-full bg-orange-200 rounded-t-3xl rounded-b-2xl p-3 bg-gradient-to-t from-orange-100 to-orange-200">
                <p className="text-center font-bold text-orange-700">3</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-6 space-y-3"
      >
        <AnimatePresence>
          {remaining.map((entry, index) => {
            const isCurrentUser = entry.user.id === user?.id;

            return (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isCurrentUser
                    ? theme === 'dark'
                      ? 'bg-lime-300 shadow-lg shadow-lime-500/20'
                      : 'bg-indigo-600 shadow-lg shadow-indigo-200'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isCurrentUser
                    ? theme === 'dark'
                      ? 'bg-black/10 text-black'
                      : 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {entry.rank}
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${
                  isCurrentUser
                    ? theme === 'dark'
                      ? 'bg-gradient-to-br from-black to-zinc-800'
                      : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {entry.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    isCurrentUser
                      ? theme === 'dark'
                        ? 'text-black'
                        : 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {entry.user.name}
                    {isCurrentUser && (
                      <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-black/60' : 'text-white/70'}`}>(Siz)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${
                      isCurrentUser
                        ? theme === 'dark'
                          ? 'text-black/70'
                          : 'text-white/70'
                        : 'text-gray-500'
                    }`}>
                      {entry.user.completedCourses.length} kurs
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${
                      isCurrentUser
                        ? theme === 'dark'
                          ? 'text-black/70'
                          : 'text-white/70'
                        : 'text-gray-400'
                    }`}>
                      <Flame className="w-3 h-3 text-orange-500" />
                      {entry.streak}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${
                    isCurrentUser
                      ? theme === 'dark'
                        ? 'text-black'
                        : 'text-white'
                      : 'text-gray-900'
                  }`}>
                    {entry.score.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    isCurrentUser
                      ? theme === 'dark'
                        ? 'text-black/70'
                        : 'text-white/70'
                      : 'text-gray-500'
                  }`}>XP</p>
                </div>

                {index % 2 === 0 && (
                  <div className="flex flex-col items-center">
                    <ChevronUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-500 font-medium">+2</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Spacer for sticky bottom rank bar */}
      <div className="h-20" />

      {/* Sticky rank bar — fixed above bottom nav */}
      <div className="fixed bottom-[60px] left-0 right-0 z-40 px-4 pb-1">
        <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 border border-lime-300/10 shadow-lg shadow-lime-500/5'
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-lime-300/15' : 'bg-white/20'
            }`}>
              <Trophy className={`w-4 h-4 ${theme === 'dark' ? 'text-lime-300' : 'text-white'}`} />
            </div>
            <div>
              <p className={`text-[10px] ${theme === 'dark' ? 'text-lime-200/70' : 'text-white/70'}`}>Sizning o'rningiz</p>
              <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>#{currentUserRank ?? '-'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-[10px] ${theme === 'dark' ? 'text-lime-200/70' : 'text-white/70'}`}>Jami XP</p>
            <p className={`text-base font-bold ${theme === 'dark' ? 'text-lime-300' : 'text-white'}`}>{user?.xp.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
