import { useEffect, useRef } from "react";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!otp) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      const frame = iframeRef.current?.contentWindow;
      if (!frame) return;

      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();
        frame.postMessage("toggle", window.location.origin);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        frame.postMessage("seek-forward", window.location.origin);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        frame.postMessage("seek-back", window.location.origin);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [otp]);

  if (!otp) return null;

  return (
    <iframe
      ref={iframeRef}
      src={getLessonPlayerSrc(otp)}
      allowFullScreen
      allow="fullscreen; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      className={className}
      title="Lesson video"
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}
