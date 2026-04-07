import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, LogOut, Trophy, Award, Clock, Target, 
  Zap, TrendingUp, Edit2, Save, X, Loader2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserProfilePage() {
  const { user, logout, updateUserProfile, isLoading } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
      });
      toast({ title: "Success", description: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "See you next time!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{user?.username}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  {user?.bio && <p className="text-sm mt-2">{user.bio}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">XP</p>
                    <p className="font-semibold">{user?.xp || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-semibold">{user?.level || 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Badges</p>
                    <p className="font-semibold">{user?.badges?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="font-semibold">{user?.leaderboard_rank || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Your username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself"
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.bio.length}/160
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Tabs */}
          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Badges Earned
                    </CardTitle>
                    <CardDescription>
                      {user?.badges?.length || 0} badges collected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user?.badges && user.badges.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.badges.map((badge, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="text-3xl">{badge.icon}</div>
                            <div>
                              <p className="font-semibold">{badge.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {badge.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(badge.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 mx-auto text-muted mb-2" />
                        <p className="text-muted-foreground">
                          No badges earned yet. Complete challenges to earn badges!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Level Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Level Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Level {user?.level || 1}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {user?.xp || 0} / {((user?.level || 1) * 1000)} XP
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((user?.xp || 0) % 1000) / 10,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {1000 - ((user?.xp || 0) % 1000)} XP until next level
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Learning Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Courses
                            </p>
                            <p className="text-2xl font-bold">
                              {user?.courses_completed || 0}
                            </p>
                          </div>
                          <Target className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Learning Streak
                            </p>
                            <p className="text-2xl font-bold">
                              {user?.streak_days || 0} days
                            </p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Lessons Completed
                            </p>
                            <p className="text-2xl font-bold">
                              {user?.lessons_completed || 0}
                            </p>
                          </div>
                          <Award className="h-8 w-8 text-purple-500" />
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Quiz Average
                            </p>
                            <p className="text-2xl font-bold">
                              {user?.quiz_average || 0}%
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="py-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Daily learning reminders
                          </p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="py-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Newsletter</p>
                          <p className="text-sm text-muted-foreground">
                            Weekly learning tips
                          </p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Use dark theme
                          </p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="pt-4 border-t mt-6">
                      <Button variant="destructive">Delete Account</Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        This action cannot be undone
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
