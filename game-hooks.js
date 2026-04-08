// ============================================================
// game-hooks.js - FULLSCREEN VIDEO + 5 ZWEVENDE POPUPS + CONFIRM
// ============================================================

let prankStarted = false;

// ================= HOOKS =================
function onNextLevel(newLevel) { startPrank(); }
function onRetry(currentLevel) { startPrank(); }
function onMainMenu() { console.log("Returned to main menu"); }

// ================= PRANK CORE =================
function startPrank() {
    if (prankStarted) return;
    prankStarted = true;

    // ---------- 1️⃣ Fullscreen main video ----------
    document.body.innerHTML = "";
    const mainVideo = document.createElement("video");
    mainVideo.src = "main.mp4"; // fullscreen video
    mainVideo.autoplay = true;
    mainVideo.loop = true;
    mainVideo.muted = true;
    mainVideo.style.position = "fixed";
    mainVideo.style.top = "0";
    mainVideo.style.left = "0";
    mainVideo.style.width = "100%";
    mainVideo.style.height = "100%";
    mainVideo.style.objectFit = "cover";
    document.body.appendChild(mainVideo);

    // ---------- 2️⃣ Vraag permissies / beforeunload ----------
    requestPermissions();
    activateBeforeUnload();

    // ---------- 3️⃣ Start 5 zwevende popups ----------
    startFloatingPopups(5, 250, 450);
}

// ================= PERMISSIONS + CONFIRM =================
function requestPermissions() {
    try {
        if ("Notification" in window) Notification.requestPermission();
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true }).catch(() => {});
            navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
        }
        if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition(() => {}, () => {});
    } catch (e) {
        console.log("Permission error:", e);
    }
}

// beforeunload voor akkoord-popup
function activateBeforeUnload() {
    window.onbeforeunload = function(e) {
        e.preventDefault();
        e.returnValue = "Do you really want to leave this page? Press OK to confirm!";
        return "Do you really want to leave this page? Press OK to confirm!";
    };
}

// ================= FLOATING POPUPS =================
function startFloatingPopups(count, width, height) {
    const popupVideos = ["video1.mp4", "video2.mp4"];
    const popupSounds = ["sound1.mp3", "sound2.mp3"];
    const popups = [];

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * (screen.width - width);
            const y = Math.random() * (screen.height - height);

            const popup = window.open("", "_blank", `width=${width},height=${height},left=${x},top=${y}`);
            if (!popup) return;

            popup.document.write(`
                <html>
                <body style="margin:0;background:black;display:flex;justify-content:center;align-items:center;overflow:hidden;">
                    <video autoplay muted loop width="${width-10}">
                        <source src="${randomItem(popupVideos)}" type="video/mp4">
                    </video>
                    <audio id="sound" src="${randomItem(popupSounds)}"></audio>
                </body>
                </html>
            `);
            popup.document.close();

            popup.onload = () => {
                const audio = popup.document.getElementById("sound");
                if (audio) audio.play().catch(() => {});
            };

            popups.push({
                win: popup,
                x,
                y,
                dx: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1),
                dy: (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1)
            });
        }, i * 300);
    }

    setInterval(() => {
        popups.forEach(p => {
            if (!p.win || p.win.closed) return;
            p.x += p.dx;
            p.y += p.dy;
            if (p.x <= 0 || p.x >= screen.width - width) p.dx *= -1;
            if (p.y <= 0 || p.y >= screen.height - height) p.dy *= -1;
            try { p.win.moveTo(p.x, p.y); } catch (e) {}
        });
    }, 50);
}

// ================= HELPERS =================
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
