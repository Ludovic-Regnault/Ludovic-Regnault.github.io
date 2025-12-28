// HOOVER HOME BUTTON
connectHoverHome();

function connectHoverHome() {
    if (!isMobile) {
        home_hitBox.addEventListener("mouseenter", () => requestHover(true));
        home_hitBox.addEventListener("mouseleave", () => requestHover(false));
    } else {
        home_hitBox.addEventListener("touchstart", () => requestHover(true));
        home_hitBox.addEventListener("touchend", () => requestHover(false));
        home_hitBox.addEventListener("touchcancel", () => requestHover(false));
    }
}

// --------------------
// Animation State
// --------------------
let currentFrameIndex = 0;
let isAnimating = false;
let activeState = null;   // true = entered, false = left
let pendingState = null;  // one-slot queue

function requestHover(on) {
    // Ignore if already in that final state
    if (on === activeState && !isAnimating) return;

    if (isAnimating) {
        // Only keep ONE pending state, overwrite safely
        pendingState = on;
        return;
    }

    startHoverAnimation(on);
}

function startHoverAnimation(on) {
    isAnimating = true;
    activeState = on;

    const startIndex = currentFrameIndex;
    const endIndex = on ? framesHome.length - 1 : 0;
    const duration = 300;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);

        currentFrameIndex = Math.max(
            Math.min(
                Math.floor(Remap(t, 0, 1, startIndex, endIndex)),
                framesHome.length - 1
            ),
            0
        );

        framesHome.forEach((frame, i) => {
            frame.classList.toggle('active', i === currentFrameIndex);
        });

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            isAnimating = false;

            // Play deferred animation if needed
            if (pendingState !== null && pendingState !== activeState) {
                const next = pendingState;
                pendingState = null;
                startHoverAnimation(next);
            } else {
                pendingState = null;
            }
        }
    }

    requestAnimationFrame(step);
}


