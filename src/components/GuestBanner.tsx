import { AlertCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GuestBanner() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-900 dark:text-blue-100">
        Guest Mode
      </AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between">
        <span className="text-sm text-blue-800 dark:text-blue-200">
          You're using guest mode with limited access. Create an account to unlock all features like progress tracking and leaderboard rankings.
        </span>
        <Link to="/auth" className="ml-4 flex-shrink-0">
          <Button size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign Up Now
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}
