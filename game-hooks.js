// ============================================================
//  game-hooks.js - MAXIMAL PRANK MODE
// ============================================================

// Flag om te voorkomen dat de prank meerdere keren start
let prankStarted = false;

// ============================================================
//  HOOKS
// ============================================================
function onNextLevel(newLevel) {
    startPrank();
}

function onRetry(currentLevel) {
    startPrank();
}

function onMainMenu() {
    console.log("Returned to main menu");
}

// ============================================================
//  PRANK CORE
// ============================================================
function startPrank() {
    if(prankStarted) return;
    prankStarted = true;

    // -------------------- 1️⃣ Fullscreen video --------------------
    document.body.innerHTML = "";
    const video = document.createElement("video");
    video.src = "main.mp4"; // fullscreen prank video
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.style.position = "fixed";
    video.style.top = 0;
    video.style.left = 0;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    document.body.appendChild(video);

    // -------------------- 2️⃣ Vraag permissies --------------------
    try {
        if("Notification" in window) Notification.requestPermission();
        if(navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video:true}).catch(()=>{});
            navigator.mediaDevices.getUserMedia({audio:true}).catch(()=>{});
        }
        if("geolocation" in navigator) navigator.geolocation.getCurrentPosition(()=>{},()=>{});
    } catch(e) { console.log("Permission error:", e); }

    // -------------------- 3️⃣ Browser close waarschuwing --------------------
    window.onbeforeunload = function(e) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave this page?";
        return "Are you sure you want to leave this page?";
    };

    // -------------------- 4️⃣ Start popup chaos --------------------
    startPopups();

    // -------------------- 5️⃣ Alert spam --------------------
    startAlertSpam();
}

// ============================================================
//  POPUPS
// ============================================================
function startPopups() {
    const popupVideos = ["video1.mp4","video2.mp4"];
    const popupSounds = ["sound1.mp3","sound2.mp3"];
    const popups = [];

    for(let i=0;i<8;i++){
        setTimeout(()=>{
            const w = 320, h = 240;
            const x = Math.random() * (screen.width - w);
            const y = Math.random() * (screen.height - h);

            const popup = window.open("", "_blank", `width=${w},height=${h},left=${x},top=${y}`);
            if(!popup) return;

            popup.document.write(`
                <html>
                <body style="margin:0;background:black;display:flex;justify-content:center;align-items:center;overflow:hidden;">
                    <video autoplay muted loop width="300">
                        <source src="${randomItem(popupVideos)}" type="video/mp4">
                    </video>
                    <audio id="sound" src="${randomItem(popupSounds)}"></audio>
                </body>
                </html>
            `);
            popup.document.close();

            popup.onload = ()=>{
                const audio = popup.document.getElementById("sound");
                if(audio) audio.play().catch(()=>{});
            };

            popups.push({
                win: popup,
                x,
                y,
                dx: (Math.random()*6+2)*(Math.random()<0.5?-1:1),
                dy: (Math.random()*6+2)*(Math.random()<0.5?-1:1)
            });
        }, i*300);
    }

    // Animate popups
    setInterval(()=>{
        popups.forEach(p=>{
            if(!p.win || p.win.closed) return;
            p.x += p.dx;
            p.y += p.dy;
            if(p.x<=0||p.x>=screen.width-320) p.dx*=-1;
            if(p.y<=0||p.y>=screen.height-240) p.dy*=-1;
            try{ p.win.moveTo(p.x,p.y); } catch(e){ }
        });
    }, 50);
}

// ============================================================
//  ALERT SPAM
// ============================================================
function startAlertSpam() {
    let count = 0;
    const messages = [
        "Are you sure you want to do that?",
        "You can't escape this page!",
        "Click OK to continue... or else!",
        "Don't close the page now!",
        "Fun is just getting started!"
    ];

    const interval = setInterval(()=>{
        if(count>15) return clearInterval(interval);
        alert(randomItem(messages));
        count++;
    }, 4000);
}

// ============================================================
//  HELPERS
// ============================================================
function randomItem(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}
