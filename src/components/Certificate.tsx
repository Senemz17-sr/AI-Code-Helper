import { useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export default function Certificate({
  userName,
  courseName,
  completionDate,
  certificateId,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = certificateRef.current;
    if (!element) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple canvas rendering (in production, use html2pdf or similar)
    canvas.width = 1200;
    canvas.height = 800;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 56px serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", canvas.width / 2, 120);

    // Body text
    ctx.fillStyle = "#4b5563";
    ctx.font = "24px serif";
    ctx.fillText(`This is to certify that`, canvas.width / 2, 220);

    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 40px serif";
    ctx.fillText(userName, canvas.width / 2, 300);

    ctx.fillStyle = "#4b5563";
    ctx.font = "24px serif";
    ctx.fillText(`has successfully completed the course`, canvas.width / 2, 380);

    ctx.fillStyle = "#3b82f6";
    ctx.font = "bold 32px serif";
    ctx.fillText(courseName, canvas.width / 2, 450);

    ctx.fillStyle = "#4b5563";
    ctx.font = "18px sans-serif";
    ctx.fillText(`Completed on ${new Date(completionDate).toLocaleDateString()}`, canvas.width / 2, 550);

    ctx.font = "14px monospace";
    ctx.fillText(`Certificate ID: ${certificateId}`, canvas.width / 2, 700);

    // Download
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `certificate_${certificateId}.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="relative bg-white dark:bg-slate-900 rounded-lg border-4 border-blue-500 p-12 text-center space-y-8 shadow-lg"
      >
        <div>
          <h2 className="text-4xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-2">
            Certificate of Completion
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            This is to certify that
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {userName}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            has successfully completed the course
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {courseName}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(completionDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
            ID: {certificateId}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.share({
              title: "Course Certificate",
              text: `I just completed ${courseName}!`,
              url: window.location.href,
            }).catch(() => {
              // Fallback: copy link
              navigator.clipboard.writeText(window.location.href);
            });
          }}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}
