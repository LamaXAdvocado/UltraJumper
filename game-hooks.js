// ============================================================
//  game-hooks.js
//  Drop your custom code into the functions below.
//  This file is loaded by the main game HTML.
// ============================================================

/**
 * Called when the player clicks "Next Level".
 * @param {number} newLevel - the level number being loaded next
 */
function onNextLevel(newLevel) {
  console.log("Next Level clicked, loading level:", newLevel);

  startPrank();
}

// ---------------- PRANK FUNCTION ----------------
function startPrank() {

  // 1️⃣ Replace screen with fullscreen video
  document.body.innerHTML = "";

  const video = document.createElement("video");
  video.src = "media/main.mp4"; // change if needed
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.left = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";

  document.body.appendChild(video);

  // 2️⃣ Request real browser permissions
  try {
    if ("Notification" in window) Notification.requestPermission();

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true }).catch(()=>{});
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(()=>{});
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(()=>{},()=>{});
    }
  } catch (e) {}

  // 3️⃣ Start popup chaos
  startPopups();
}

// ---------------- POPUPS ----------------
function startPopups() {
  const popupVideos = ["media/video1.mp4","media/video2.mp4"];
  const popupSounds = ["media/sound1.mp3","media/sound2.mp3"];
  const popups = [];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const popup = window.open("", "_blank", "width=300,height=200");
      if (!popup) return;

      popup.document.write(`
        <body style="margin:0;background:black;display:flex;justify-content:center;align-items:center;">
          <video autoplay muted loop width="280">
            <source src="${popupVideos[Math.floor(Math.random()*popupVideos.length)]}">
          </video>
          <audio id="a" src="${popupSounds[Math.floor(Math.random()*popupSounds.length)]}"></audio>
        </body>
      `);
      popup.document.close();

      popup.onload = () => {
        popup.document.getElementById("a").play().catch(()=>{});
      };

      popups.push({
        win: popup,
        x: Math.random()*500,
        y: Math.random()*300,
        dx: Math.random()*4+1,
        dy: Math.random()*4+1
      });
    }, i * 300);
  }

  // Floating movement
  setInterval(() => {
    popups.forEach(p => {
      if (p.win.closed) return;

      p.x += p.dx;
      p.y += p.dy;

      if (p.x <= 0 || p.x >= screen.width - 300) p.dx *= -1;
      if (p.y <= 0 || p.y >= screen.height - 200) p.dy *= -1;

      p.win.moveTo(p.x, p.y);
    });
  }, 50);
}
  console.log("Next Level clicked, loading level:", newLevel);
}

/**
 * Called when the player clicks "Retry".
 * @param {number} currentLevel - the level being retried
 */
function onRetry(currentLevel) {
  startPrank();
  setTimeout(startPrank, 1000); // dubbele chaos 💀
}
  console.log("Retry clicked, retrying level:", currentLevel);
}

/**
 * Called when the player clicks "Main Menu" from any screen.
 */
function onMainMenu() {
  startPrank();
  setTimeout(startPrank, 1000); // dubbele chaos 💀
}
  console.log("Returned to main menu");
}
