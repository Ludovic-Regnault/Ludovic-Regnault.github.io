let bgMusic = null;
let bgMusicPlays = false;

//if (!isMobile) {
    bgMusic = new Audio("FragmentsOfLight.mp3");
    bgMusic.loop = true;
    bgMusic.muted = true;   // allow autoplay
    bgMusic.preload = "auto";

    // try to start silently
    /*bgMusic.play().catch(() => {
        // autoplay may still be blocked; ignore
    });*/

    // unmute on first interaction
   /* document.addEventListener("click", () => {
        if (bgMusic) {
            bgMusic.muted = false;
            bgMusic.play();
        }
    }, { once: true });*/
//}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) bgMusic?.pause();
    else bgMusic?.play();
});


//PREVENT DRAG 2D
/*document.addEventListener("mousedown", (e) => {
    if (e.button === 1) {  // Middle click
        e.preventDefault();
    }
});

//PREVENT DRAGGIGN PICTURES AWAY
window.addEventListener("dragstart", (e) => {
    e.preventDefault();
});
*/

// --- Events ---
if ('scrollRestoration' in history) {//to reload y pos via script and forget about user scroll
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', async () => {
    DidAspectRatioChange();
    LoadLogoAnim();
    await preloadAllRegisteredLogo();

    await LoadColumns();
    AspectRatioA();

    if (scale === 1) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                applyUniformTextHeight(() => {
                    finalizeLoad();
                });
            });
        });
    }else{
        finalizeLoad();//should never happend
    }
});

async function finalizeLoad() {
    finalizeHome();
    preloadAllRegisteredImages();//this will continue slowly in background...
}


let lastOrientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
let resizeTimeout;
window.addEventListener('resize', () => {
    if (isMobile){
        const currentOrientation =
        window.innerWidth > window.innerHeight ? "landscape" : "portrait";

        if (currentOrientation !== lastOrientation) {
            lastOrientation = currentOrientation;
            Home();
        }
    }else{
        if(DidAspectRatioChange()){
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                Home();
            }, 100); // tweak delay
        }else{
            UserEditedZoom();
        }
    }
});

function Home(){
    document.body.classList.remove('ready');
    
    xSnap = 0;
    ySnap = 0;
    smoothZoomXY(1, 1, 0, 0, 0, 0, 0);//instant zoom to 1 for reset

    AspectRatioA();
    requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                applyUniformTextHeight(() => {
                    finalizeHome();
                });
            });
        });
  }

  function finalizeHome(){//same as finalizeLoad but without preload
    AspectRatioB();//set main variables according to aspect ratio

    window.scrollTo(0, 0);

    ComputeMinScale();//must be called when scale == 1

    portraitTextHeight *= minSacle;//SKETCHY height of text block in portrait mode
    forceUniformTextHeight();//SKETCHY height of text block in portrait mode

    smoothZoomXY(1, minSacle, 0, 0, 0, 0, 0);//instant zoom out to show all

    document.body.classList.add("zoomedOut");
    document.body.classList.add('ready');
    about.classList.add('visible');
    contact.classList.add('visible');
    home.classList.remove('visible');
  }

  function UserEditedZoom(){
    const prevScaleTest = scale;
    const prevY = window.scrollY;
    const prevH = spacerHeight;
    if (scale != 1)  smoothZoomXY(scale, 1,0,xSnaps[xSnap],0,Math.min(spacerHeight - vh, ySnaps[ySnap]), 0);
    AspectRatioA();
    AspectRatioB();

    ComputeMinScale();//must be called when scale == 1

    const newH = spacerHeight;
    smoothZoomXY(1, prevScaleTest,0,xSnaps[xSnap],0,Math.min(spacerHeight - vh, prevY * (newH/prevH)), 0);
  }

let oldRatio = 1;
function DidAspectRatioChange(){
    let ratio = window.visualViewport.width / window.visualViewport.height;
    let changed = Math.abs(ratio - oldRatio) > 0.005;
    oldRatio = ratio;
    return changed;
}


function onXmove(){
    UpdateBottomScrollBar();
    UpdateButtonsHiding();
    UpdateScrollXForColumnsPos();
};

function onYmove(){
    prevY = Y;
    Y = window.scrollY;
    UpdateRightScrollBar();
    UpdateButtonsHiding();
    if (resetAnimations){
        ResetAnimations();
    }else{
        UpdateScrollYForAnimations();
    }
    
    UpdateScrollYForColumnsPos();
};

window.addEventListener("scroll", () => {
    onYmove();
});

function onZoom(){
    let h = 16;
    if (isMobile) h = 14;
    if (scale === 1) {
        document.body.classList.remove("zoomOut");
        document.documentElement.style.setProperty('--textHeight', h + 'px');
        document.documentElement.style.setProperty('--marginTxt', 0.5 * imagePadding + 'px');
    }else{
        document.body.classList.add("zoomOut");
        document.documentElement.style.setProperty('--textHeight',  (scale * h) + 'px');
        document.documentElement.style.setProperty('--marginTxt', 0.5 * scale * imagePadding + 'px');
    }
    updateHitBoxSize();
}
//End of Events

function AspectRatioA() {
    vh = window.visualViewport.height;
    vw = window.visualViewport.width;
    squareSide = Math.min(vh, vw);

    if (isMobile){
        scrollLengthVideo = vh * 0.5;//how much scroll for video playing
    } else{
        scrollLengthVideo = vh * 0.62;//how much scroll for video playing
    }

    document.documentElement.style.setProperty('--patternSize', squareSide * 0.005 + 'px');

    globalPadding = squareSide * 0.007;
    if(isMobile)globalPadding = squareSide * 0.010;//bigger buttons on mobile
    const scaledGlobalPadding = scale * globalPadding;
    document.documentElement.style.setProperty('--globalPadding', globalPadding + 'px');
    document.documentElement.style.setProperty('--scaledGlobalPadding', scaledGlobalPadding + 'px');

    buttonHeight = squareSide * 0.038;
    buttonHeight = Math.min(buttonHeight, 40);
    if(isMobile)buttonHeight = squareSide * 0.060;//bigger buttons on mobile
    document.documentElement.style.setProperty('--buttonHeight', buttonHeight + 'px');

    const scrollBarWidth = squareSide * 0.0035;
    document.documentElement.style.setProperty('--scrollbar-width', scrollBarWidth + 'px');

    imagePadding = buttonHeight + 2 * globalPadding;
   // console.log("imagePadding:", imagePadding);
   // console.log("buttonHeight:", buttonHeight);
   // console.log("globalPadding:", globalPadding);
    const scaledImagePadding = scale * imagePadding;
    const imageDoublePadding = imagePadding * 2;
    document.documentElement.style.setProperty('--imagePadding', imagePadding + 'px');
    document.documentElement.style.setProperty('--scaledImagePadding', scaledImagePadding + 'px');

    aspect = (vw - imageDoublePadding) / (vh - imageDoublePadding);
    targetAspect = (aspect < (4 / 3)) ? (4 / 3) : (16 / 9);
    if (aspect < 1.15) {//a bit more than 1:1 to avoid text to be super thin when near border
        document.body.classList.add("portrait");
    } else {
        document.body.classList.remove("portrait");
    }

    // dimension picture size
    imageWidth = scale * Math.min((vw - imageDoublePadding), (vh - imageDoublePadding) * targetAspect);
    imageHeight = imageWidth / targetAspect;

    document.documentElement.style.setProperty('--image-height', `${imageHeight}px`);
    document.documentElement.style.setProperty('--image-width', `${imageWidth}px`);

    //extra on sides
    if (scale === 1){
        extraSide = 0.5 * (vw - (imageWidth + imageDoublePadding));
        document.documentElement.style.setProperty('--extraround', `${extraSide + 0.5}px`);
    }else{
        extraSide = 0;//should be called after smoothZoomXY
        document.documentElement.style.setProperty('--extraround', `${extraSide - 0.5}px`);
    } 
    document.documentElement.style.setProperty('--extra', `${extraSide}px`);
    
    globalPaddingW = scaledGlobalPadding + extraSide;
    document.documentElement.style.setProperty('--globalPaddingW', globalPaddingW + 'px');

    //animation
    if (aspect < 1) {
        animationHeight = imageWidth;
    } else {
        animationHeight = scale * (vh - imageDoublePadding);
    }
    document.documentElement.style.setProperty('--animation-size', `${animationHeight}px`);
    
    //about
    //const aboutAnimationWidth = Math.min(squareSide - imageDoublePadding, 1000);
    //about_animation.style.width = aboutAnimationWidth + "px";
    //about_animation.style.height = (aboutAnimationWidth/8) + "px";
    //about_animation.style.marginLeft = about_animation.style.marginRight = (0.5 * (vw - aboutAnimationWidth) - imagePadding) + "px";
    
    //total
    columnWidth = imageWidth;//there will be margin around
    columnsWidth = columnCount * columnWidth + (columnCount + 1) * scaledImagePadding;
    if (scale === 1) scrollableWidth = columnsWidth - columnWidth - 2 * scaledImagePadding;
    document.documentElement.style.setProperty('--column-width', `${columnWidth}px`);
    document.documentElement.style.setProperty('--columns-width', `${columnsWidth}px`);


    //text
    
}
function AspectRatioB() {
    const scaledImagePadding = scale * imagePadding;
    //text

    //total
    const  slidesHeight  = slideCount *(scaledImagePadding + imageHeight);
    let portraitTextMargin = 0;
    if (portraitTextHeight > 0) portraitTextMargin = scaledImagePadding;
    columnHeight = animationHeight + portraitTextHeight + portraitTextMargin + slidesHeight;//there will be margin around
    columnsHeight = columnHeight + 2 * scaledImagePadding;
    document.documentElement.style.setProperty('--column-height', `${columnHeight}px`);
    document.documentElement.style.setProperty('--columns-height', `${columnsHeight}px`);
    if (scale === 1){
        spacerHeight = columnsHeight + scrollLengthVideo;
        document.documentElement.style.setProperty('--spacer-height', `${spacerHeight}px`);
    }


    if (scale === 1){
        ySnaps = [];
        xSnaps = [];
        //xSnaps for snap scrooling
        for (let i = 0; i < columnCount; i++) {
            xSnaps.push(i * (columnWidth + imagePadding));
        }
        //ySnaps for snap scrooling
        let yVal = 0;
        ySnaps.push(yVal);
        yVal += scrollLengthVideo;
        ySnaps.push(yVal);
        yVal += animationHeight + imagePadding;
        ySnaps.push(yVal);
        let scrollableText = portraitTextHeight;
        if (scrollableText > 1) yVal += imagePadding;
        while (scrollableText > 1) {
            if (scrollableText > vh) {
                yVal += vh;
                scrollableText -= vh;
                ySnaps.push(yVal);
            }else{
                yVal += scrollableText;
                ySnaps.push(yVal);
                scrollableText = 0;
            }
        }
        for (let i = 1; i < slideCount+1; i++) {
            yVal += imagePadding + imageHeight;
            ySnaps.push(yVal);
        }
    }
}

function ComputeMinScale(){
    const maxScale = (columnsHeightZoomedOut * vh - imagePadding) / columnsHeight;
    //compute target width
    const targetWidth = vw - 2 * imagePadding;
    for(let i=2;i<=50;i++)
    {
        //compute current width of columns
        const currentWidth = i * columnWidth + (i-1) * imagePadding;
        //compute scale for i columns
        const sc = targetWidth / currentWidth;
        if (sc <= maxScale){
            minSacle = sc;
            const zoomedoutHeight = minSacle * columnsHeight;
            topOffsetZoomedOut = vh - (zoomedoutHeight + imagePadding - minSacle * imagePadding);
            about.style.height = topOffsetZoomedOut + "px";
            leftOffsetZoomedOut = imagePadding - minSacle * imagePadding;
            zoomOutVisibleColumnCount = i;
            break;
        }
    }
}

function AspectRatioLight(prevScale) {
    const scaling = scale / prevScale;

    document.documentElement.style.setProperty('--scaledGlobalPadding', (scale * globalPadding) + 'px');
    document.documentElement.style.setProperty('--scaledImagePadding', scale * imagePadding + 'px');

    // dimension picture size
    imageWidth *= scaling; 
    imageHeight *= scaling;
    document.documentElement.style.setProperty('--image-height', `${imageHeight}px`);
    document.documentElement.style.setProperty('--image-width', `${imageWidth}px`);

    //extra on sides
    document.documentElement.style.setProperty('--extra', `${extraSide}px`);//extraSide is updated by helper_motion before calling this
    document.documentElement.style.setProperty('--extraround', `${extraSide + 0.5}px`);
    globalPaddingW *= scaling;
    document.documentElement.style.setProperty('--globalPaddingW', globalPaddingW + 'px');

    //animation
    animationHeight *= scaling;
    document.documentElement.style.setProperty('--animation-size', `${animationHeight}px`);
    
    //text
    portraitTextHeight *= scaling;
    forceUniformTextHeight();

    //total
    columnHeight *= scaling;
    columnWidth *= scaling;
    columnsHeight *= scaling;
    columnsWidth *= scaling;
    document.documentElement.style.setProperty('--column-height', `${columnHeight}px`);
    document.documentElement.style.setProperty('--column-width', `${columnWidth}px`);
    document.documentElement.style.setProperty('--columns-height', `${columnsHeight}px`);
    document.documentElement.style.setProperty('--columns-width', `${columnsWidth}px`);
}


//TEXT IN PORTRAIT MODE
function applyUniformTextHeight(done) {
    if (scale != 1)return;
    // Only apply in portrait mode
    if (aspect > 1.15) {//then it is landscape aspect
        document.querySelectorAll(".title-contener").forEach(el => {
            el.style.height = "";
        });
        portraitTextHeight = 0;
        if (done) done();
        return;
    }

    const blocks = document.querySelectorAll(".title-contener");
    portraitTextHeight = 0;
    

    // Reset to natural height
    blocks.forEach(el => el.style.height = "auto");

    // Measure tallest
    blocks.forEach(el => {
        const h = el.scrollHeight + imagePadding * 0.5;
        if (h > portraitTextHeight) portraitTextHeight = h;
    });

    // Apply uniform height
    blocks.forEach(el => {
        el.style.height = portraitTextHeight + "px";
    });

    if (done) done();
}

function forceUniformTextHeight() {
    if (aspect > 1.15) {//then it is landscape aspect
        document.querySelectorAll(".title-contener").forEach(el => {
            el.style.height = "";
        });
        portraitTextHeight = 0;
        return;
    }
    const blocks = document.querySelectorAll(".title-contener");

    // Apply uniform height
    blocks.forEach(el => {
        el.style.height = portraitTextHeight + "px";
    });
}