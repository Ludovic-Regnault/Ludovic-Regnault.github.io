//SCROLL Y
function UpdateScrollYForAnimations()
{
    if (Y <= scrollLengthVideo || prevY <= scrollLengthVideo) {// video Play
        const progress = Remap(Y, 0, scrollLengthVideo, 0, 1);

        framesPerColumn.forEach((frames, i) => {
            const frameIndex = Math.min(Math.floor(progress * frames.length), frames.length - 1);
            frames.forEach((frame, i) => {
               frame.classList.toggle('active', i === frameIndex);
            });
        });
    }
}

function animate(frames, direction, duration) {
    if (duration === 0) {
        let frameIndex;
        if (direction === 'forward') {
            frameIndex = frames.length - 1;
        }else {
            frameIndex = 0;
        }
        frames.forEach((frame, i) => {
            frame.classList.toggle('active', i === frameIndex);
        });
    } else {
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);

            const frameIndex = Math.min(Math.floor(t * frames.length), frames.length - 1);
            frames.forEach((frame, i) => {
               frame.classList.toggle('active', i === frameIndex);
            });

            if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
}