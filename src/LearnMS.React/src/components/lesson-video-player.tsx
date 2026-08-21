import { useEffect, useRef } from "react";

export function getLessonPlayerSrc(otp?: string | null) {
  if (!otp) return "";
  return `/api/video/play?t=${encodeURIComponent(otp)}`;
}

function isInspectShortcut(event: KeyboardEvent) {
  const key = event.key.toUpperCase();
  if (event.key === "F12") return true;
  if (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    ["I", "J", "C", "K"].includes(key)
  ) {
    return true;
  }
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && ["U"].includes(key)) {
    return true;
  }
  if (event.metaKey && event.altKey && ["I", "J", "C"].includes(key)) {
    return true;
  }
  return false;
}

export function LessonVideoPlayer({
  otp,
  className = "w-full h-full",
  protect = false,
}: {
  otp?: string | null;
  className?: string;
  protect?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!protect) return;

    const grab = /idm|internet.?download.?manager|idmcompanion/i;
    const hide = (node: Element) => {
      const hay = `${node.id} ${node.className} ${node.getAttribute("src") || ""}`;
      if (grab.test(hay)) {
        node.remove();
      }
    };
    const scan = () => {
      document
        .querySelectorAll('[id*="IDM"], [id*="idm"], [class*="IDM"], [class*="idm"], [src*="idm"]')
        .forEach(hide);
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [protect]);

  useEffect(() => {
    if (!otp) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (protect && isInspectShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

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

    window.addEventListener("keydown", onKeyDown, protect);
    return () => window.removeEventListener("keydown", onKeyDown, protect);
  }, [otp, protect]);

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
