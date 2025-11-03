const debugBox = document.getElementById('debug');
const spacer = document.getElementById('spacer');

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
function debug(text) {
    debugBox.textContent = text;
}

//#region --- Elements, Variables ---
let ySnaps = [];
 
let vh = window.innerHeight;
let vw = window.innerWidth;
let ivw = window.innerWidth;
let prevY = 0;
let globalPadding = 20;
const buttonSize = 30;
let squareSide = 0;
let squareSideButtons = 0;
document.documentElement.style.setProperty('--buttonSize', buttonSize + 'px');  


const scrollLengthVideo = 1200;
let scrollLengthSlides = 0;


let aspect = 4 / 3;
let targetAspect = 3 / 3;

const slides = getSlides();
function getSlides() {
    return Array.from(document.querySelectorAll('#slidesFixed .slide'));
}

//#endregion





//#region --- Events ---

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
    ySnaps = [];
    AspectRatio();
    ResizeSections();
    ResizeSpacer();
    window.scrollTo(0, 0);
    prevY = 0;
    UpdateScroll();

    PreloadSections();//now?

    // Only once everything is ready, fade in the page
    document.body.classList.add('ready');

    console.log({
        innerHeight: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
        diff: document.documentElement.scrollHeight - window.innerHeight
    });
});

window.addEventListener('resize', () => {
    ySnaps = [];
    AspectRatio();
    ResizeSections();
    ResizeSpacer();
    UpdateScroll();

});

window.addEventListener('scroll', () => {
    UpdateScroll();
});
//#endregion

//#region --- Methods ---
function AspectRatio() {
    vh = window.innerHeight;
    vw = window.innerWidth;

    globalPadding = Math.min(vw, vh) * 0.02;
    document.documentElement.style.setProperty('--globalPadding', globalPadding + 'px'); 

    squareSide = Math.min(vh, vw);
    ivw = vw - 2 * (globalPadding + buttonSize);
    squareSideButtons = Math.min(vh, ivw);

    aspect = vw / vh;

    // Select target aspect ratio depending on screen width/height ratio
    targetAspect = (aspect < (4 / 3)) ? (4 / 3) : (16 / 9);

    //debug(`Mode: ${aspect < 1.4 ? '4:3 cropped' : '16:9 contained'}`);

    // Toggle CSS class for cropping mode
    if (aspect < 1.4) {
        document.body.classList.add('aspect-4-3');
        document.body.classList.remove('aspect-16-9');
    } else {
        document.body.classList.add('aspect-16-9');
        document.body.classList.remove('aspect-4-3');
    }
}


function ResizeSections() {

    ResizeSectionA();
    //ResizeSectionB();
    ResizeSectionC();
}
function ResizeSpacer() {
    const total = vh + scrollLengthVideo + scrollLengthSlides;
    //debug(scrollLengthSectionB);
    //debug(`: ${scrollLengthSectionB}px`);
    spacer.style.height = `${total}px`;
}

function UpdateScroll() {
    const Y = window.scrollY;
    ScrollSectionA(Y, prevY);
    //ScrollSectionB(Y, prevY);
    ScrollSectionC(Y, prevY);
    prevY = Y;
}
function PreloadSections() {
    PreloadSectionA();
}

//#endregion


function Remap(value, sourceMin, sourceMax, targetMin, targetMax) {
    // Clamp if source range is degenerate
    if (sourceMax === sourceMin) return targetMin;

    const ratio = (value - sourceMin) / (sourceMax - sourceMin);
    return targetMin + ratio * (targetMax - targetMin);
}

// --- Pre Load Images ---

async function preloadAndDecode(src) {
    if (!src) return;
    try {
        const resp = await fetch(src, { cache: 'force-cache' });
        const blob = await resp.blob();
        if (window.createImageBitmap) {
            await createImageBitmap(blob); // force decode
        } else {
            const temp = new Image();
            temp.src = URL.createObjectURL(blob);
            await temp.decode();
            URL.revokeObjectURL(temp.src);
        }
    } catch (err) {
        console.warn('preloadAndDecode failed', src, err);
    }
}

/*
async function preloadAndDecode(src) {
    if (!src) return;
    const img = new Image();
    img.src = src;
    //await img.decode();
}
*/

async function preloadImageDecoded(index) {
    const slide = slides[index];
    if (!slide) return;

    const img = slide.querySelector('img');
    if (!img) return;

    const src = img.dataset.src;
    if (!src) return;

    // only preload if not yet set
    if (!img.src) {
        await preloadAndDecode(src);
        img.src = src;
        img.removeAttribute('data-src');
        console.log('decoded and attached', src);
    }
}
function preloadFirstN(n) {
    for (let i = 0; i < n && i < slides.length; i++) {
        preloadImageDecoded(i);
    }
}



// --- Full screen ---
const fullscreenEnterSrc = 'icons/round/fs.png';
const fullscreenExitSrc = 'icons/round/efs.png';

// Click handler
fullscreenIcon.addEventListener('click', toggleFullscreen);

// Change icon on ESC or programmatic exit
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenIcon.src = fullscreenExitSrc;
    } else {
        fullscreenIcon.src = fullscreenEnterSrc;
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen for the entire page
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Failed to enter fullscreen: ${err.message}`);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().catch(err => {
            console.error(`Failed to exit fullscreen: ${err.message}`);
        });
    }
}





const isFullscreenCapable = !!(
    document.fullscreenEnabled && !isMobile
);
if (!isFullscreenCapable) {
    fullscreenIcon.style.display = 'none';
}










// --- home ---
const homeIcon = document.getElementById("homeIcon");
// Click handler
homeIcon.addEventListener('click', home);

function home() {
    Scroll(0, 0);
}



// --- up ---
const upIcon = document.getElementById("upIcon");
// Click handler
upIcon.addEventListener('click', up);

function up() {
    closest(-1);
}

// --- dwn ---
const downIcon = document.getElementById("downIcon");
// Click handler
downIcon.addEventListener('click', down);

function down() {
    closest(1);
}






function closest(increment) {
    var minDiff = 5*vh;
    var minIndex = 0;
    for (let i = 0; i < ySnaps.length; i++) {
        let diff = Math.abs(window.scrollY - ySnaps[i]);
        if (diff < minDiff) {
            minDiff = diff;
            minIndex = i;
        }
    }
    Scroll(ySnaps[Math.max(0, Math.min(ySnaps.length - 1, minIndex + increment))], 50);
    UpdateScroll();
}

function Scroll(yTarget, time) {
    window.scrollTo({
        top: yTarget,
        behavior: "smooth"
    });
}