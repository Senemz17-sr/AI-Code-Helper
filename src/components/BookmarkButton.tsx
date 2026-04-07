import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toggleBookmark, isBookmarked } from "@/lib/storage";
import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  lessonId: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export default function BookmarkButton({
  lessonId,
  size = "default",
  showLabel = false,
}: BookmarkButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated) {
      setBookmarked(isBookmarked(user.id, lessonId));
    }
  }, [user, lessonId, isAuthenticated]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !isAuthenticated) return;

    const newState = toggleBookmark(user.id, lessonId);
    setBookmarked(newState);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const sizes = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Button
      variant={bookmarked ? "default" : "outline"}
      size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
      onClick={handleToggle}
      className={`gap-2 ${bookmarked ? "bg-blue-500 hover:bg-blue-600" : ""}`}
      title={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
    >
      <Bookmark
        className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
      />
      {showLabel && (bookmarked ? "Bookmarked" : "Bookmark")}
    </Button>
  );
}
