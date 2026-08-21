using System.Text;

namespace LearnMS.API.ThirdParties.YouTube;

public static class YouTubePlayerHtml
{
    public static string Build(string videoId)
    {
        var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes(videoId));
        return $$"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="referrer" content="no-referrer" />
  <title>Lesson</title>
  <style>
    html, body { margin: 0; height: 100%; background: #0b0d12; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
    .wrap { position: relative; width: 100%; height: 100%; background: #000; user-select: none; }
    #yt { position: absolute; inset: 0; }
    .shield, .cover { position: absolute; inset: 0 0 56px 0; z-index: 3; }
    .shield { cursor: default; }
    .cover {
      display: flex; align-items: center; justify-content: center;
      background: radial-gradient(circle at center, #151821 0%, #07080c 70%);
    }
    .play {
      width: 84px; height: 84px; border-radius: 50%; border: 0; cursor: pointer;
      background: #2563eb; color: white; display: grid; place-items: center;
      box-shadow: 0 10px 30px rgba(37, 99, 235, 0.45);
    }
    .play svg { width: 34px; height: 34px; margin-left: 4px; }
    .bar {
      position: absolute; left: 0; right: 0; bottom: 0; height: 56px; z-index: 4;
      display: flex; align-items: center; gap: 10px; padding: 0 14px;
      background: linear-gradient(180deg, rgba(8,10,16,0.2), #080a10 55%);
      color: #e5e7eb;
    }
    .bar button, .bar input { accent-color: #3b82f6; }
    .bar button {
      background: transparent; border: 0; color: inherit; cursor: pointer;
      width: 36px; height: 36px; display: grid; place-items: center;
    }
    .seek { flex: 1; }
    .time { font-size: 12px; min-width: 86px; opacity: 0.8; }
    .hidden { display: none; }
    .err { color: #fca5a5; text-align: center; padding: 24px; }
  </style>
</head>
<body oncontextmenu="return false">
  <div class="wrap" id="wrap">
    <div id="yt"></div>
    <div class="shield" id="shield"></div>
    <div class="cover" id="cover">
      <button class="play" id="playBig" type="button" aria-label="Play">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
    <div class="bar">
      <button id="play" type="button" aria-label="Play">▶</button>
      <input id="seek" class="seek" type="range" min="0" max="1000" value="0" />
      <span class="time" id="time">00:00 / 00:00</span>
      <button id="mute" type="button" aria-label="Mute">🔊</button>
      <button id="fs" type="button" aria-label="Fullscreen">⛶</button>
    </div>
  </div>
  <script>
    const vid = atob("{{encoded}}");
    let player, ready = false, timer;
    const cover = document.getElementById("cover");
    const playBtn = document.getElementById("play");
    const seek = document.getElementById("seek");
    const timeEl = document.getElementById("time");
    const muteBtn = document.getElementById("mute");

    document.addEventListener("keydown", (e) => e.preventDefault());
    document.addEventListener("selectstart", (e) => e.preventDefault());

    function fmt(s) {
      s = Math.max(0, Math.floor(s || 0));
      const m = String(Math.floor(s / 60)).padStart(2, "0");
      const r = String(s % 60).padStart(2, "0");
      return m + ":" + r;
    }
    function sync() {
      if (!player || !player.getDuration) return;
      const d = player.getDuration() || 0;
      const c = player.getCurrentTime() || 0;
      if (!seek._drag) seek.value = d ? Math.round((c / d) * 1000) : 0;
      timeEl.textContent = fmt(c) + " / " + fmt(d);
    }
    function setPlaying(isPlaying) {
      playBtn.textContent = isPlaying ? "❚❚" : "▶";
      cover.classList.toggle("hidden", isPlaying);
    }
    function toggle() {
      if (!ready) return;
      const state = player.getPlayerState();
      if (state === 1) player.pauseVideo();
      else player.playVideo();
    }
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("yt", {
        host: "https://www.youtube-nocookie.com",
        videoId: vid,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
          origin: window.location.origin,
          widget_referrer: window.location.origin
        },
        events: {
          onReady: function () {
            ready = true;
            timer = setInterval(sync, 250);
          },
          onStateChange: function (e) {
            setPlaying(e.data === 1);
            if (e.data === 0) setPlaying(false);
          },
          onError: function () {
            cover.innerHTML = '<p class="err">Video is still processing. Try again in a few minutes.</p>';
            cover.classList.remove("hidden");
          }
        }
      });
    };
    document.getElementById("playBig").onclick = toggle;
    playBtn.onclick = toggle;
    seek.addEventListener("mousedown", () => seek._drag = true);
    seek.addEventListener("touchstart", () => seek._drag = true);
    seek.addEventListener("change", () => {
      if (!ready) return;
      const d = player.getDuration() || 0;
      player.seekTo((Number(seek.value) / 1000) * d, true);
      seek._drag = false;
    });
    muteBtn.onclick = () => {
      if (!ready) return;
      if (player.isMuted()) { player.unMute(); muteBtn.textContent = "🔊"; }
      else { player.mute(); muteBtn.textContent = "🔇"; }
    };
    document.getElementById("fs").onclick = () => {
      const el = document.getElementById("wrap");
      if (!document.fullscreenElement) el.requestFullscreen?.();
      else document.exitFullscreen?.();
    };
  </script>
  <script src="https://www.youtube.com/iframe_api"></script>
</body>
</html>
""";
    }

    public static string Unavailable() =>
        """
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Lesson</title>
<style>html,body{margin:0;height:100%;background:#0b0d12;color:#9ca3af;display:grid;place-items:center;font-family:system-ui,sans-serif}</style>
</head><body><p>Video is unavailable.</p></body></html>
""";
}
