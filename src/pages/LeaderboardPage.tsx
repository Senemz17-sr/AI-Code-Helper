import { motion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useGamification";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Zap, Award, TrendingUp, Loader2 } from "lucide-react";

export default function LeaderboardPage() {
  const { leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Compete with learners worldwide and earn your place at the top
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="col-start-1 md:col-start-1">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <PodiumCard entry={topThree[1]} position={2} height="h-48" />
                  </motion.div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="col-start-1 md:col-start-2 -mt-6 md:mt-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0 }}
                  >
                    <PodiumCard entry={topThree[0]} position={1} height="h-64" />
                  </motion.div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="col-start-1 md:col-start-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <PodiumCard entry={topThree[2]} position={3} height="h-40" />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="xp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="xp">
              <Zap className="h-4 w-4 mr-2" />
              Total XP
            </TabsTrigger>
            <TabsTrigger value="level">
              <Trophy className="h-4 w-4 mr-2" />
              Level
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="h-4 w-4 mr-2" />
              Badges
            </TabsTrigger>
          </TabsList>

          {/* XP Leaderboard */}
          <TabsContent value="xp">
            <Card>
              <CardHeader>
                <CardTitle>Ranking by XP</CardTitle>
                <CardDescription>
                  Top earners this season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rest.map((entry, idx) => (
                    <motion.div
                      key={entry.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="w-8 text-center font-bold text-lg">
                        {entry.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>
                          {entry.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{entry.username}</p>
                        <p className="text-sm text-muted-foreground">
                          Level {entry.level}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-bold">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          {entry.xp.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level Leaderboard */}
          <TabsContent value="level">
            <Card>
              <CardHeader>
                <CardTitle>Ranking by Level</CardTitle>
                <CardDescription>
                  Highest level achievers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard
                    .sort((a, b) => b.level - a.level)
                    .map((entry, idx) => (
                      <motion.div
                        key={entry.user_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="w-8 text-center font-bold text-lg">
                          {idx + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>
                            {entry.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.xp.toLocaleString()} XP
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            <Trophy className="h-4 w-4 mr-1" />
                            Level {entry.level}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Leaderboard */}
          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Ranking by Badges</CardTitle>
                <CardDescription>
                  Most achievements collected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard
                    .sort((a, b) => b.badge_count - a.badge_count)
                    .map((entry, idx) => (
                      <motion.div
                        key={entry.user_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="w-8 text-center font-bold text-lg">
                          {idx + 1}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>
                            {entry.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {entry.level}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            <Award className="h-4 w-4 mr-1" />
                            {entry.badge_count}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface PodiumCardProps {
  entry: any;
  position: 1 | 2 | 3;
  height: string;
}

function PodiumCard({ entry, position, height }: PodiumCardProps) {
  const medals = {
    1: { icon: "🥇", text: "1st Place", color: "from-yellow-500 to-yellow-600" },
    2: { icon: "🥈", text: "2nd Place", color: "from-slate-400 to-slate-500" },
    3: { icon: "🥉", text: "3rd Place", color: "from-orange-600 to-orange-700" },
  };

  const medal = medals[position];

  return (
    <Card className={`${height} flex flex-col justify-between bg-gradient-to-b ${medal.color} text-white overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-10">
        <Trophy className="h-32 w-32 absolute -right-8 -top-8" />
      </div>
      <div className="relative">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">{medal.icon}</div>
          <p className="text-sm font-semibold opacity-90">{medal.text}</p>
        </div>
      </div>
      <div className="relative">
        <Avatar className="h-16 w-16 mx-auto mb-3 border-4 border-white">
          <AvatarImage src={entry.avatar} />
          <AvatarFallback>
            {entry.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center px-4 pb-4">
          <p className="font-bold text-lg truncate">{entry.username}</p>
          <p className="text-sm opacity-90">Level {entry.level}</p>
          <div className="flex items-center justify-center gap-1 mt-2 bg-black/20 rounded px-2 py-1 w-fit mx-auto">
            <Zap className="h-4 w-4" />
            <span className="font-semibold">{entry.xp.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
