//HOOVER HOME BUTTON
connectHoverHome();
function connectHoverHome() {
    if (!isMobile) {
        home_hitBox.addEventListener("mouseenter", () => {
            hoverHome(true);
        });
        home_hitBox.addEventListener("mouseleave", () => {
            hoverHome(false);
        });
    } else {
        icon.src = "cursors/" + id + "/u.png";
        home_hitBox.addEventListener("touchstart", () => {
            hoverHome(true);
        });

        home_hitBox.addEventListener("touchend", () => {
            hoverHome(false);
        });

        home_hitBox.addEventListener("touchcancel", () => {
            hoverHome(false);
        });
    }
}

let currentFrameIndex = 0;
function hoverHome(on) {
    const startIndex = currentFrameIndex;
    let endIndex = framesHome.length - 1;
    if (!on) {
        endIndex = 0;
    }

    const startTime = performance.now();

    function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / 300);//duration

            currentFrameIndex = Math.max(Math.min(Math.floor(Remap(t, 0, 1, startIndex, endIndex)), frames.length - 1),0);
            framesHome.forEach((frame, i) => {
                frame.classList.toggle('active', i === currentFrameIndex);
            });

            if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

