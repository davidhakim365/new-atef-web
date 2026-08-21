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
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <title>Lesson</title>
  <style>
    html, body { margin: 0; height: 100%; background: #0b0d12; overflow: hidden; font-family: Inter, system-ui, sans-serif; }
    .wrap { position: relative; width: 100%; height: 100%; background: #000; user-select: none; }
    #yt, #yt iframe { position: absolute; inset: 0; width: 100% !important; height: 100% !important; }
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
    .err { color: #e5e7eb; text-align: center; padding: 24px; max-width: 360px; line-height: 1.45; }
    .err small { display: block; margin-top: 8px; color: #9ca3af; }
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
    let player, ready = false, timer, retries = 0;
    const cover = document.getElementById("cover");
    const playBtn = document.getElementById("play");
    const seek = document.getElementById("seek");
    const timeEl = document.getElementById("time");
    const muteBtn = document.getElementById("mute");
    const playBig = document.getElementById("playBig");

    document.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault();
    });
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
    function showPlay() {
      cover.innerHTML = "";
      cover.appendChild(playBig);
      cover.classList.remove("hidden");
    }
    function showMessage(title, detail) {
      cover.innerHTML = '<p class="err">' + title + (detail ? "<small>" + detail + "</small>" : "") + "</p>";
      cover.classList.remove("hidden");
    }
    function toggle() {
      if (!ready || !player) return;
      const state = player.getPlayerState();
      if (state === 1) player.pauseVideo();
      else player.playVideo();
    }
    function loadVideo() {
      if (player && player.cueVideoById) player.cueVideoById(vid);
    }
    window.onYouTubeIframeAPIReady = function () {
      const wrap = document.getElementById("wrap");
      player = new YT.Player("yt", {
        width: Math.max(wrap.clientWidth, 320),
        height: Math.max(wrap.clientHeight, 180),
        videoId: vid,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: function () {
            ready = true;
            retries = 0;
            timer = setInterval(sync, 250);
            showPlay();
          },
          onStateChange: function (e) {
            if (e.data === 1 || e.data === 3) retries = 0;
            setPlaying(e.data === 1);
            if (e.data === 0 || e.data === 2 || e.data === 5) setPlaying(false);
          },
          onError: function (e) {
            const code = e && e.data;
            if ((code === 100 || code === 101 || code === 150) && retries < 15) {
              retries += 1;
              showMessage("Preparing video…", "YouTube is still encoding this file. Retrying automatically.");
              setTimeout(loadVideo, 8000);
              return;
            }
            showMessage("This video cannot be played yet.", "Wait a few minutes, refresh the page, or upload the file again.");
          }
        }
      });
    };
    playBig.onclick = toggle;
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
