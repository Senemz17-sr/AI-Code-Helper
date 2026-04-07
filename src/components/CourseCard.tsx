import { Link } from "react-router-dom";
import { Lock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { formatPrice, calculateDiscount } from "@/lib/payment";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  canAccess?: boolean;
  onClick?: () => void;
}

export default function CourseCard({
  course,
  isEnrolled = false,
  canAccess = false,
  onClick,
}: CourseCardProps) {
  const isPremium = course.tier === "premium" || course.tier === "advanced";
  const discount = course.originalPrice && course.price 
    ? calculateDiscount(course.originalPrice, course.price) 
    : 0;

  return (
    <Link to={`/course/${course.id}`} onClick={onClick}>
      <div className="group relative rounded-lg border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:bg-card">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 rounded-lg bg-gradient-to-br ${
            course.color || "from-slate-200 to-slate-300"
          } opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
        />

        <div className="relative space-y-4 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
            </div>
            
            {/* Badges */}
            <div className="flex gap-1 flex-shrink-0">
              {isPremium && !isEnrolled && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                  💎 Premium
                </Badge>
              )}
              {course.level === "advanced" && (
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200">
                  Advanced
                </Badge>
              )}
              {isEnrolled && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200">
                  ✓ Enrolled
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            )}
            {course.enrolledCount && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{course.enrolledCount.toLocaleString()}</span>
              </div>
            )}
            <span>•</span>
            <span>{course.duration}</span>
          </div>

          {/* Pricing section */}
          {isPremium && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-baseline gap-2">
                {course.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
                {course.price && (
                  <span className="font-semibold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {discount}% off
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            className="w-full h-9 text-sm group-hover:scale-105 transition-transform"
            variant={isPremium && !canAccess && !isEnrolled ? "outline" : "default"}
          >
            {isEnrolled ? (
              <>Start Learning</>
            ) : isPremium && !canAccess ? (
              <>
                <Lock className="h-3.5 w-3.5 mr-2" />
                Unlock Premium
              </>
            ) : (
              <>Enroll Now</>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
