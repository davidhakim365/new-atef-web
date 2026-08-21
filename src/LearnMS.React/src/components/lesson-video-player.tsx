import { api } from "@/api";

export function getLessonPlayerSrc(otp?: string | null) {
  if (!otp) return "";
  return `/api/video/play?t=${encodeURIComponent(otp)}`;
}

export function LessonVideoPlayer({
  otp,
  className = "w-full h-full",
}: {
  otp?: string | null;
  className?: string;
}) {
  if (!otp) return null;

  return (
    <iframe
      src={getLessonPlayerSrc(otp)}
      allowFullScreen
      allow="fullscreen; encrypted-media"
      referrerPolicy="no-referrer"
      className={className}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}
