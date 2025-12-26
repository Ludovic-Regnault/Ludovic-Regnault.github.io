//MOTION FUNCTIONS
function snapVertical(direction) {
    const current = window.scrollY;

    let currentMod = current - 2;
    if (direction > 0) {
        currentMod = current + 2;
    }

    let closestIndex = 0;

    for (let i = 0; i < ySnaps.length; i++) {
        if (currentMod < ySnaps[i]) break;
        closestIndex = i;
    }

    let targetIndex = closestIndex;
    if (direction > 0){
        targetIndex = closestIndex + 1;
    }
    targetIndex = Math.min(ySnaps.length - 1, targetIndex);

    ySnap = targetIndex;
    let duration = 800;
    if (current === 0) duration = 1200;//longer from top for animation
    smoothScrollToY(current, Math.min(spacerHeight - vh, ySnaps[targetIndex]), duration);
}

function snapHorizontal(direction) {
    const current = X;

    let currentMod = current - 2;
    if (direction > 0) {
        currentMod = current + 2;
    }

    let closestIndex = 0;
    
    for (let i = 0; i < xSnaps.length; i++) {
        if (currentMod < xSnaps[i]) break;
        closestIndex = i;
    }

    let targetIndex = closestIndex;
    if (direction > 0) {
        targetIndex = closestIndex + 1;
    }
    targetIndex = Math.min(xSnaps.length - 1, targetIndex);

    xSnap = targetIndex;
    smoothScrollToX(current, xSnaps[targetIndex], 1000);
}

function smoothScrollToY(startY, targetY, duration) {
    if (duration === 0) {
        window.scrollTo(0, targetY);
    } else {
        const diff = targetY - startY;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const eased = easeInOutSine(t);

            window.scrollTo(0, startY + diff * eased);

            if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
}

function smoothScrollToX(startX, targetX, duration) {
    if (duration === 0) {
        X = targetX;
        onXmove();
    } else {
        const diff = targetX - startX;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const eased = easeInOutSine(t);

            X = startX + diff * eased;
            onXmove();

            if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
}

function smoothZoomXY(startZoom, endZoom, startX, targetX, startY, targetY, duration, onComplete) {
    document.body.classList.remove("zoomedOut");
    if (duration === 0) {
        scale = endZoom;
        AspectRatioA();
        AspectRatioB();

        onZoom();
        
        X = targetX;
        onXmove();

        const currentPos = window.scrollY;
        const targetPos = targetY;
        window.scrollTo(0, targetPos);
        if (targetPos === currentPos)onYmove();//otherwise it is already updated by event listener
        if (scale === 1){
            document.documentElement.style.setProperty('--spacer-height', `${spacerHeight}px`);
        }else{
            document.documentElement.style.setProperty('--spacer-height', `${vh}px`);
            document.body.classList.add("zoomedOut");
        }
    } else {
        const diffY = targetY - startY;
        const diffX = targetX - startX;
        const diffZ = endZoom - startZoom;

        const startE = extraSide;
        let diffE = 0;
        if (startZoom == 1){
            diffE = 0 - startE;
        }else{
            diffE = 0.5 * (vw - (imageWidth / scale + 2 * imagePadding)) - startE; // but startE = 0
        }

        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            if (t >= 1){zooming = false;}
            const eased = easeInOutSine(t);

            const prevScale = scale;

            scale = startZoom + diffZ * eased;
            extraSide = startE + diffE * eased;
            onZoom();

            AspectRatioLight(prevScale);

            const move = (eased / scale) * endZoom;
            X = startX + diffX * move;
            onXmove(); 

            const currentPos = window.scrollY;
            const targetPos = startY + diffY * move;
            window.scrollTo(0, targetPos);
            if (targetPos === currentPos)onYmove();//otherwise it is already updated by event listener

            if (t < 1){
                requestAnimationFrame(step);
            }else{
                if (scale === 1){
                    document.documentElement.style.setProperty('--spacer-height', `${spacerHeight}px`);
                }else{
                    document.documentElement.style.setProperty('--spacer-height', `${vh}px`);
                    document.body.classList.add("zoomedOut");
                }
                if (onComplete) onComplete();   // call callback at the end
            }
        }

        AspectRatioA();
        AspectRatioB();//clean recompute just in case
        requestAnimationFrame(step);
    }
}

function aboutMove(target, duration, onComplete){
    const start = getTopNumeric(about);
    const diff = target - start;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeInOutSine(t);

        about.style.top = (start + diff * eased) + "px";

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            if (onComplete) onComplete();   // call callback at the end
        }
    }

    requestAnimationFrame(step);
}

function getTopNumeric(el) {
    return parseFloat(el.style.top || getComputedStyle(el).top);
}



function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}