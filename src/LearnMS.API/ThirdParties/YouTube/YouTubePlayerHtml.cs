using System.Security.Cryptography;
using System.Text;

namespace LearnMS.API.ThirdParties.YouTube;

public static class YouTubePlayerHtml
{
    public static string Build(string videoId)
    {
        var key = RandomNumberGenerator.GetBytes(7);
        var data = Encoding.UTF8.GetBytes(videoId);
        var packed = new byte[1 + key.Length + data.Length];
        packed[0] = (byte)key.Length;
        Buffer.BlockCopy(key, 0, packed, 1, key.Length);
        for (var i = 0; i < data.Length; i++)
            packed[1 + key.Length + i] = (byte)(data[i] ^ key[i % key.Length]);
        var payload = Convert.ToBase64String(packed);
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
    .wrap { position: relative; width: 100%; height: 100%; background: #000; user-select: none; overflow: hidden; }
    .stage {
      position: absolute; inset: 0 0 56px 0; overflow: hidden; background: #000;
    }
    #yt, .stage iframe {
      position: absolute !important;
      top: -96px !important;
      left: 0 !important;
      width: 100% !important;
      height: calc(100% + 184px) !important;
    }
    .hit {
      position: absolute; inset: 0 0 56px 0; z-index: 3;
      display: flex; align-items: center; justify-content: center;
      background: #07080c; cursor: pointer;
    }
    .wrap.has-started .hit { background: transparent; }
    .play {
      width: 84px; height: 84px; border-radius: 50%; border: 0; cursor: pointer; pointer-events: none;
      background: #2563eb; color: white; display: grid; place-items: center;
      opacity: 1; transition: opacity .2s ease;
      box-shadow: 0 0 0 90px #07080c, 0 10px 30px rgba(37, 99, 235, 0.45);
    }
    .wrap.has-started .play {
      box-shadow: 0 0 0 56px rgba(7, 8, 12, .94), 0 10px 30px rgba(37, 99, 235, 0.45);
    }
    .wrap.has-started.is-idle .play { opacity: 0; }
    .play svg { width: 34px; height: 34px; }
    .bottom-cap {
      position: absolute; left: 0; right: 0; bottom: 56px; height: 48px; z-index: 5;
      pointer-events: none; background: #080a10; opacity: 0;
    }
    .wrap:not(.is-playing) .bottom-cap { opacity: 1; }
    .logo-cap {
      position: absolute; right: 0; bottom: 56px; width: 96px; height: 32px; z-index: 5;
      pointer-events: none; background: #080a10;
    }
    .wrap:not(.is-playing) .logo-cap { bottom: 104px; }
    .bar {
      position: absolute; left: 0; right: 0; bottom: 0; height: 56px; z-index: 6;
      display: flex; align-items: center; gap: 8px; padding: 0 12px;
      background: #080a10; color: #e5e7eb;
    }
    .bar button, .bar input { accent-color: #3b82f6; }
    .bar button {
      background: transparent; border: 0; color: inherit; cursor: pointer;
      min-width: 36px; height: 36px; display: grid; place-items: center;
      font: 600 12px/1 Inter, system-ui, sans-serif;
    }
    .text-btn { padding: 0 8px; border-radius: 6px; }
    .text-btn:hover, .picker.open .text-btn { background: rgba(255,255,255,.08); }
    .seek { flex: 1; }
    .time { font-size: 12px; min-width: 86px; opacity: 0.8; }
    .picker { position: relative; }
    .menu {
      position: absolute; right: 0; bottom: 44px; min-width: 112px;
      background: #111827; border: 1px solid #1f2937; border-radius: 10px;
      padding: 6px; display: none; max-height: 240px; overflow: auto;
    }
    .picker.open .menu { display: block; }
    .menu button {
      width: 100%; height: auto; padding: 8px 10px; justify-content: start;
      border-radius: 6px; font-weight: 500; color: #e5e7eb;
    }
    .menu button.active, .menu button:hover { background: #2563eb; }
    .err { color: #e5e7eb; text-align: center; padding: 24px; max-width: 360px; line-height: 1.45; pointer-events: none; }
    .err small { display: block; margin-top: 8px; color: #9ca3af; }
  </style>
</head>
<body oncontextmenu="return false">
  <div class="wrap" id="wrap" tabindex="0">
    <div class="stage" id="stage"><div id="yt"></div></div>
    <div class="hit" id="hit">
      <button class="play" id="centerBtn" type="button" aria-label="Play">
        <svg id="centerIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
    <div class="bottom-cap"></div>
    <div class="logo-cap"></div>
    <div class="bar">
      <button id="play" type="button" aria-label="Play">▶</button>
      <input id="seek" class="seek" type="range" min="0" max="1000" value="0" />
      <span class="time" id="time">00:00 / 00:00</span>
      <div class="picker" id="speedPicker">
        <button class="text-btn" id="speedBtn" type="button">1x</button>
        <div class="menu" id="speedMenu"></div>
      </div>
      <div class="picker" id="qualityPicker">
        <button class="text-btn" id="qualityBtn" type="button">Auto</button>
        <div class="menu" id="qualityMenu"></div>
      </div>
      <button id="mute" type="button" aria-label="Mute">🔊</button>
      <button id="fs" type="button" aria-label="Fullscreen">⛶</button>
    </div>
  </div>
  <script>
    (function () {
      function block(e) {
        var k = (e.key || "").toUpperCase();
        if (e.key === "F12" || e.keyCode === 123) { e.preventDefault(); e.stopPropagation(); return false; }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C", "K"].indexOf(k) >= 0) { e.preventDefault(); e.stopPropagation(); return false; }
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && ["U", "S"].indexOf(k) >= 0) { e.preventDefault(); e.stopPropagation(); return false; }
        if (e.metaKey && e.altKey && ["I", "J", "C"].indexOf(k) >= 0) { e.preventDefault(); e.stopPropagation(); return false; }
      }
      window.addEventListener("keydown", block, true);
      document.addEventListener("contextmenu", function (e) { e.preventDefault(); }, true);
      document.addEventListener("dragstart", function (e) { e.preventDefault(); }, true);
    })();
    function _d(s) {
      var b = Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); });
      var n = b[0];
      var k = b.subarray(1, 1 + n);
      var d = b.subarray(1 + n);
      var o = "";
      for (var i = 0; i < d.length; i++) o += String.fromCharCode(d[i] ^ k[i % k.length]);
      return o;
    }
    const vid = _d("{{payload}}");
    const playSvg = '<path d="M8 5v14l11-7z"/>';
    const pauseSvg = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';
    const qualityNames = {
      highres: "4K", hd1440: "1440p", hd1080: "1080p", hd720: "720p",
      large: "480p", medium: "360p", small: "240p", tiny: "144p",
      default: "Auto", auto: "Auto"
    };
    let player, ready = false, timer, retries = 0, chosenQuality = "default", idleTimer;
    const wrap = document.getElementById("wrap");
    const hit = document.getElementById("hit");
    const playBtn = document.getElementById("play");
    const seek = document.getElementById("seek");
    const timeEl = document.getElementById("time");
    const muteBtn = document.getElementById("mute");
    const centerIcon = document.getElementById("centerIcon");
    const speedBtn = document.getElementById("speedBtn");
    const qualityBtn = document.getElementById("qualityBtn");
    const speedMenu = document.getElementById("speedMenu");
    const qualityMenu = document.getElementById("qualityMenu");
    const speedPicker = document.getElementById("speedPicker");
    const qualityPicker = document.getElementById("qualityPicker");

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
    function isPlaying() {
      return !!(player && player.getPlayerState && player.getPlayerState() === 1);
    }
    function setPlaying(playing) {
      playBtn.textContent = playing ? "❚❚" : "▶";
      hit.classList.toggle("playing", playing);
      wrap.classList.toggle("is-playing", playing);
      if (playing) wrap.classList.add("has-started");
      centerIcon.innerHTML = playing ? pauseSvg : playSvg;
      centerIcon.style.marginLeft = playing ? "0" : "4px";
      bumpIdle();
    }
    function bumpIdle() {
      wrap.classList.remove("is-idle");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        if (wrap.classList.contains("has-started")) wrap.classList.add("is-idle");
      }, 2000);
    }
    function showMessage(title, detail) {
      hit.classList.remove("playing");
      wrap.classList.remove("is-playing");
      hit.innerHTML = '<p class="err">' + title + (detail ? "<small>" + detail + "</small>" : "") + "</p>";
    }
    function closeMenus() {
      speedPicker.classList.remove("open");
      qualityPicker.classList.remove("open");
    }
    function toggle() {
      if (!ready || !player) return;
      closeMenus();
      if (isPlaying()) player.pauseVideo();
      else player.playVideo();
    }
    function seekBy(seconds) {
      if (!ready || !player || !player.getCurrentTime) return;
      player.seekTo(Math.max(0, (player.getCurrentTime() || 0) + seconds), true);
    }
    function loadVideo() {
      if (player && player.cueVideoById) player.cueVideoById(vid);
    }
    function resizePlayer() {
      const stage = document.getElementById("stage");
      if (!player || !player.setSize || !stage) return;
      player.setSize(stage.clientWidth, stage.clientHeight + 184);
    }
    function syncFullscreen() {
      wrap.classList.toggle("is-fs", !!document.fullscreenElement);
      resizePlayer();
    }
    function qualityLabel(level) {
      return qualityNames[level] || level;
    }
    function fillSpeedMenu() {
      const rates = (player.getAvailablePlaybackRates && player.getAvailablePlaybackRates()) || [0.5, 0.75, 1, 1.25, 1.5, 2];
      const current = player.getPlaybackRate ? player.getPlaybackRate() : 1;
      speedMenu.innerHTML = rates.map(function (rate) {
        const label = rate + "x";
        const active = rate === current ? " active" : "";
        return '<button type="button" data-rate="' + rate + '" class="' + active + '">' + label + "</button>";
      }).join("");
      speedBtn.textContent = current + "x";
    }
    function fillQualityMenu() {
      let levels = [];
      try { levels = (player.getAvailableQualityLevels && player.getAvailableQualityLevels()) || []; } catch (e) {}
      const unique = [];
      levels.forEach(function (level) {
        if (level && unique.indexOf(level) === -1 && level !== "auto") unique.push(level);
      });
      unique.push("default");
      qualityMenu.innerHTML = unique.map(function (level) {
        const active = level === chosenQuality ? " active" : "";
        return '<button type="button" data-quality="' + level + '" class="' + active + '">' + qualityLabel(level) + "</button>";
      }).join("");
      qualityBtn.textContent = qualityLabel(chosenQuality);
    }
    function setSpeed(rate) {
      if (!player || !player.setPlaybackRate) return;
      player.setPlaybackRate(Number(rate));
      speedBtn.textContent = Number(rate) + "x";
      closeMenus();
    }
    function setQuality(level) {
      chosenQuality = level;
      try {
        if (player.setPlaybackQuality) player.setPlaybackQuality(level);
        if (player.setPlaybackQualityRange) {
          if (level === "default") player.setPlaybackQualityRange("tiny", "highres");
          else player.setPlaybackQualityRange(level, level);
        }
      } catch (e) {}
      qualityBtn.textContent = qualityLabel(level);
      closeMenus();
    }
    function onKey(e) {
      bumpIdle();
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        seekBy(5);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        seekBy(-5);
      } else if (e.key === "Escape") {
        closeMenus();
      }
    }
    window.addEventListener("keydown", onKey);
    ["mousemove", "mousedown", "touchstart"].forEach(function (ev) {
      wrap.addEventListener(ev, bumpIdle, { passive: true });
    });
    window.addEventListener("message", (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data === "toggle") toggle();
      if (e.data === "seek-forward") seekBy(5);
      if (e.data === "seek-back") seekBy(-5);
    });
    document.addEventListener("fullscreenchange", syncFullscreen);
    window.addEventListener("resize", resizePlayer);
    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("yt", {
        width: Math.max(document.getElementById("stage").clientWidth, 320),
        height: Math.max(document.getElementById("stage").clientHeight + 184, 180),
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
            wrap.focus();
            setPlaying(false);
            fillSpeedMenu();
            fillQualityMenu();
          },
          onStateChange: function (e) {
            if (e.data === 1 || e.data === 3) retries = 0;
            setPlaying(e.data === 1);
            if (e.data === 1) fillQualityMenu();
          },
          onPlaybackQualityChange: function () { fillQualityMenu(); },
          onPlaybackRateChange: function () { fillSpeedMenu(); },
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
    hit.addEventListener("click", toggle);
    playBtn.onclick = toggle;
    speedBtn.onclick = (e) => {
      e.stopPropagation();
      qualityPicker.classList.remove("open");
      speedPicker.classList.toggle("open");
      if (ready) fillSpeedMenu();
    };
    qualityBtn.onclick = (e) => {
      e.stopPropagation();
      speedPicker.classList.remove("open");
      qualityPicker.classList.toggle("open");
      if (ready) fillQualityMenu();
    };
    speedMenu.onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      e.stopPropagation();
      setSpeed(btn.getAttribute("data-rate"));
    };
    qualityMenu.onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      e.stopPropagation();
      setQuality(btn.getAttribute("data-quality"));
    };
    seek.addEventListener("mousedown", () => seek._drag = true);
    seek.addEventListener("touchstart", () => seek._drag = true);
    seek.addEventListener("input", () => {
      if (!ready) return;
      const d = player.getDuration() || 0;
      player.seekTo((Number(seek.value) / 1000) * d, true);
    });
    seek.addEventListener("change", () => { seek._drag = false; });
    muteBtn.onclick = (e) => {
      e.stopPropagation();
      if (!ready) return;
      if (player.isMuted()) { player.unMute(); muteBtn.textContent = "🔊"; }
      else { player.mute(); muteBtn.textContent = "🔇"; }
    };
    document.getElementById("fs").onclick = (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) wrap.requestFullscreen?.();
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
