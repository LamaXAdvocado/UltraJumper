// ============================================================
//  game-hooks.js (FULL WORKING VERSION)
// ============================================================

// Prevent multiple prank triggers
let prankStarted = false;

/**
 * Called when the player clicks "Next Level"
 */
function onNextLevel(newLevel) {
  console.log("Next Level clicked:", newLevel);
  startPrank();
}

/**
 * Called when the player clicks "Retry"
 */
function onRetry(currentLevel) {
  console.log("Retry clicked:", currentLevel);
  startPrank();
}

/**
 * Called when returning to menu
 */
function onMainMenu() {
  console.log("Returned to main menu");
}

// ================= PRANK SYSTEM =================

function startPrank() {
  if (prankStarted) return; // prevent spam
  prankStarted = true;

  // 1️⃣ Replace screen with fullscreen video
  document.body.innerHTML = "";

  const video = document.createElement("video");
  video.src = "main.mp4"; // change path if needed
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

  // 2️⃣ Request browser permissions (real popups)
  requestPermissions();

  // 3️⃣ Start popup chaos
  startPopups();
}

// ================= PERMISSIONS =================

function requestPermissions() {
  try {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: true }).catch(()=>{});
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(()=>{});
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(()=>{},()=>{});
    }
  } catch (e) {
    console.log("Permission error:", e);
  }
}

// ================= POPUPS =================

function startPopups() {
  const popupVideos = [
    "video1.mp4",
    "video2.mp4"
  ];

  const popupSounds = [
    "sound1.mp3",
    "sound2.mp3"
  ];

  const popups = [];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {

      const popup = window.open("", "_blank", "width=320,height=240");
      if (!popup) {
        console.log("Popup blocked");
        return;
      }

      // Inject content
      popup.document.write(`
        <html>
        <body style="margin:0;background:black;display:flex;justify-content:center;align-items:center;">
          <video autoplay muted loop width="300">
            <source src="${randomItem(popupVideos)}" type="video/mp4">
          </video>
          <audio id="sound" src="${randomItem(popupSounds)}"></audio>
        </body>
        </html>
      `);
      popup.document.close();

      // Play sound after load
      popup.onload = () => {
        const audio = popup.document.getElementById("sound");
        if (audio) {
          audio.play().catch(()=>{});
        }
      };

      // Movement data
      popups.push({
        win: popup,
        x: Math.random() * 500,
        y: Math.random() * 300,
        dx: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1),
        dy: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? 1 : -1)
      });

    }, i * 300);
  }

  // Animate floating popups
  setInterval(() => {
    popups.forEach(p => {
      if (!p.win || p.win.closed) return;

      p.x += p.dx;
      p.y += p.dy;

      if (p.x <= 0 || p.x >= screen.width - 320) p.dx *= -1;
      if (p.y <= 0 || p.y >= screen.height - 240) p.dy *= -1;

      p.win.moveTo(p.x, p.y);
    });
  }, 50);
}

// ================= HELPERS =================

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
