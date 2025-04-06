let hits = 0;  
let misses = 0;  
let attempts = 0;  
  
const movingPhoto = document.getElementById("moving-photo");  
const shoe = document.getElementById("shoe");  
const blast = document.getElementById("blast");  
const gameContainer = document.getElementById("game-container");  
const message = document.getElementById("message");  
  
const throwSound = document.getElementById("throw-sound");  
const hitSound = document.getElementById("hit-sound");  
const missSound = document.getElementById("miss-sound");  
const successSound = new Audio("success.mp3");
const successSound2 = new Audio("hit_1.mp3");
  
const bgm = document.getElementById("bgm"); // Background music  
const muteBtn = document.getElementById("mute"); // Mute button  
  
bgm.loop = true; // Enable looping  
bgm.volume = 0.5; // Moderate volume  
  
let targetSpeed = 8;  
let targetDirectionX = 1;  
let targetDirectionY = 1;  
let gameRunning = true;  
let animationFrameId = null;  
  
// Start background music after user interaction (fix autoplay issue)  
document.addEventListener("click", () => {  
    if (bgm.paused) {  
        bgm.play().catch(err => console.log("BGM play blocked:", err));  
    }  
}, { once: true }); // Runs only once  
  
// Mute/Unmute functionality  
muteBtn.addEventListener("click", () => {  
    if (bgm.muted) {  
        bgm.muted = false;  
        muteBtn.innerText = "Mute";  
    } else {  
        bgm.muted = true;  
        muteBtn.innerText = "Unmute";  
    }  
});  
  
// Set initial position  
movingPhoto.style.left = "50px";  
movingPhoto.style.top = "50px";  
  
// Move target like a bouncing ball  
function moveTarget() {  
    if (!gameRunning) return;  
  
    let maxX = gameContainer.clientWidth - movingPhoto.clientWidth;  
    let maxY = gameContainer.clientHeight - movingPhoto.clientHeight;  
  
    function animate() {  
        if (!gameRunning) return;  
  
        let currentX = movingPhoto.offsetLeft;  
        let currentY = movingPhoto.offsetTop;  
  
        if (currentX >= maxX || currentX <= 0) targetDirectionX *= -1;  
        if (currentY >= maxY || currentY <= 0) targetDirectionY *= -1;  
  
        movingPhoto.style.left = `${currentX + targetSpeed * targetDirectionX}px`;  
        movingPhoto.style.top = `${currentY + targetSpeed * targetDirectionY}px`;  
  
        animationFrameId = requestAnimationFrame(animate);  
    }  
  
    cancelAnimationFrame(animationFrameId);  
    animationFrameId = requestAnimationFrame(animate);  
}  
  
moveTarget(); // Start movement  
  
function throwShoe() {  
    if (!gameRunning) return;  
  
    attempts++;  
    document.getElementById("attempts").innerText = attempts;  
  
    throwSound.play();  
  
    let shoeSpeed = 15;  
    let shoeMove = setInterval(() => {  
        shoe.style.top = `${shoe.offsetTop - shoeSpeed}px`;  
  
        let shoeRect = shoe.getBoundingClientRect();  
        let targetRect = movingPhoto.getBoundingClientRect();  
  
        let shoeCenterX = shoeRect.left + shoeRect.width / 2;  
        let shoeCenterY = shoeRect.top + shoeRect.height / 2;  
        let targetCenterX = targetRect.left + targetRect.width / 2;  
        let targetCenterY = targetRect.top + targetRect.height / 2;  
  
        let hitboxX = targetRect.width * 0.4;  
        let hitboxY = targetRect.height * 0.4;  
  
        let distanceX = Math.abs(shoeCenterX - targetCenterX);  
        let distanceY = Math.abs(shoeCenterY - targetCenterY);  
  
        if (distanceX < hitboxX && distanceY < hitboxY) {    
            clearInterval(shoeMove);  
            hits++;  
            document.getElementById("hits").innerText = hits;  
            showMessage("💥 BOMOCLAT Perfect 🎯!", 1000);  
  
            blast.style.display = "block";  
            blast.style.left = `${targetCenterX - blast.clientWidth / 2}px`;  
            blast.style.top = `${targetCenterY - blast.clientHeight / 2}px`;  
  
            hitSound.play();  
  
            setTimeout(() => {  
                blast.style.display = "none";  
                resetShoe();  
            }, 800);  
  
            if (hits === 6) {  
                gameWin();  
            }  
        } else if (shoe.offsetTop < 0) {  
            clearInterval(shoeMove);  
            misses++;  
            document.getElementById("misses").innerText = misses;  
            showMessage("bruh 😢 Missed! Try Again.", 1000);  
  
            missSound.play();  
  
            setTimeout(resetShoe, 200);  
        }  
    }, 30);  
}  
  
// Smooth shoe reset animation  
function resetShoe() {  
    shoe.style.transition = "top 0.3s ease";  
    shoe.style.top = "auto";  
    shoe.style.bottom = "10px";  
  
    setTimeout(() => {  
        shoe.style.transition = "none";  
    }, 300);  
}  
  
// Function to show a message for a limited time  
function showMessage(text, duration) {  
    message.innerText = text;  
    message.style.display = "block";  
  
    setTimeout(() => {  
        if (!message.innerHTML.includes("Start Again")) {  
            message.style.display = "none";  
        }  
    }, duration);  
}  
  
function gameWin() {  
    gameRunning = false;  
    cancelAnimationFrame(animationFrameId);  
  
    movingPhoto.style.display = "none";  
    shoe.style.display = "none";  
    blast.style.display = "none";  
  
   message.innerHTML = `
    <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        text-align: center; 
        width: 100%; 
        max-width: 400px;
        color: white; 
        border-radius: 10px;
    ">
        <img src="dead.png" alt="Winner" style="width: 200px; height: auto;">
        <h2 style="font-size: 28px; margin-top: -80px ">🎉 congress, You Won! Gen-z👥 hits: ${hits}</h2>
        <button onclick="restartGame()">Start Again</button>
    </div>`;
    message.style.display = "block";  
    message.style.fontSize = "22px";
    message.style.width = "80%";
  
    bgm.pause(); // Pause background music  
    successSound.play();
    successSound2.play();
} 

function restartGame() {  
    hits = 0;  
    misses = 0;  
    attempts = 0;  
    gameRunning = true;  

    // Reset score display
    document.getElementById("hits").innerText = hits;  
    document.getElementById("misses").innerText = misses;  
    document.getElementById("attempts").innerText = attempts;  

    // Reset game elements
    movingPhoto.style.display = "block";  
    shoe.style.display = "block";  

    // Reset message box properly
    message.style.display = "none"; // Hide it first
    message.innerText = ""; // Clear previous message content
    message.removeAttribute("style"); // Remove any inline styles
    message.classList.remove("win-message", "error-message"); // Remove dynamically added classes

    // Force reflow to reset styles properly
    void message.offsetHeight;  

    // Restart game mechanics
    resetShoe();  
    moveTarget(); // Restart target movement  

    // Reset sounds
    successSound.pause();
    successSound2.pause();
    successSound.currentTime = 0;
    successSound2.currentTime = 0;

    bgm.play(); // Restart background music  
}

// Handle orientation change to adjust shoe and target sizes
window.addEventListener("orientationchange", function () {
    if (window.innerWidth < 768) {
        shoe.style.width = "60px"; // Adjust shoe size for mobile
    } else {
        shoe.style.width = "80px"; // Reset shoe size for larger screens
    }
});
