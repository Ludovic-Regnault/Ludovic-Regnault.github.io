const slidesText = `
Title: Murmurations
Technique: Carbon fiber pipes and polypropylene cables
Size: 8 x 8 x 5.2 meters
Year: 2024
---
Title: Lattice of Light
Technique: Stainless steel pipes and cables
Size: 2 x 2 x 7.2 meters
Year: 2025
---
Title: Lattice of Light
Technique: Stainless steel pipes and cables
Size: 2 x 2 x 7.2 meters
Year: 2025
---
Title: Murmurations
Technique: Carbon fiber pipes and polypropylene cables
Size: 8 x 8 x 5.2 meters
Year: 2024
---
Title: The hanging Theorem
Technique: Aluminium pipes and stainless steel cables
Size: 2 x 2 x 5 meters
Year: 2024
---
Title: Airframe of a Sphere
Technique: Aluminium pipes and stainless steel cables
Size: 4.2 x 4.2 x 4.2 meters
Year: 2024
---
Title: Chrysalide
Technique: Aluminium pipes and stainless steel cables
Size: 2.5 x 2.5 x 5 meters
Year: 2023
---
Title: Constellations
Technique: Carbon fiber pipes and polypropylene cables
Size: 3.3 x 3 x 3.3 meters
Year: 2023
`;


// --- Elements ---
const slidesFixed = document.getElementById('slidesFixed');
const spacer = document.getElementById('spacer');
const banner = document.getElementById('banner');
const about = document.getElementById('about');
const debugBox = document.getElementById('debug');
const bannerContent = document.getElementById('banner-content');
const aboutContent = document.getElementById('about-content');
const fullscreenIcon = document.getElementById('fullscreenIcon');
const fullscreen = document.getElementById('fullscreen');

// --- Varaibles ---
const gapBetweenSlides = 5; // px minimum gap between slide surfaces
let aboutHeight = 50.0;
const bannerHeight = 50;
let lastScroll = 0.0;
let bannerPosition = 0.0;
let slidesPosition = 0.0;
let minSlidesPosition = 0.0;

let pictureWidth = 0.0;
let pictureHeight = 0.0;
let visiblePictureCount = 1;

let psi = -1;

// --- Colors ---
function color(opacity = 1) {
    let color = '33, 37, 38';
    if (opacity == 1) return 'rgb(' + color + ')';
    return 'rgba(' + color + ', ' + opacity + ')';
}

document.body.style.background = color();
banner.style.background = color();
about.style.background = color(0.8);
debugBox.style.background = color(0.6);
document.documentElement.style.setProperty('--slide-activeColor', color(0));
document.documentElement.style.setProperty('--slide-inactiveColor', color(0.5));

const slides = getSlides();
function getSlides() {
    return Array.from(document.querySelectorAll('#slidesFixed .slide'));
}

let slideData = [];
loadSlideDescriptions().then(data => {
    slideData = data;
});

// --- Captions ---
async function loadSlideDescriptions() {
    const entries = slidesText.split('---').map(entry => entry.trim()).filter(Boolean);
    return entries;
}
function showSlideInfo(index) {
    const slide = slideData[index];
    if (slide) {
        debug(slide);
    } else {
        debug('');
    }
}
function debug(text) {
    debugBox.textContent = text;
}

// --- Pre-load images ---
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

// --- Events ---

window.addEventListener('load', () => {

    updateAbout();
    updateSpacer();
    window.scrollTo(0, 0);
    lastScroll = 0;
    bannerPosition = 0.0;
    slidesPosition = 0.0;
    updateScroll();
    preloadFirstN(visiblePictureCount);
    SetActiveSlide();

    // Only once everything is ready, fade in the page
    document.body.classList.add('ready');
});

window.addEventListener('resize', () => {
    updateAbout();
    updateSpacer();
    
    updateScroll();
});

window.addEventListener('scroll', () => {
    updateScroll();
});

// --- Updates ---
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
function updateAbout() {
    const bannerWidth = bannerContent.offsetWidth;
    aboutContent.style.width = bannerWidth + 'px';

    about.style.height = 'auto';
    aboutHeight = about.scrollHeight;
    about.style.height = aboutHeight + 'px';
}
function updateSpacer() {
    const aspect = window.innerWidth / window.innerHeight;
    
    // Select target aspect ratio depending on screen width/height ratio
    const targetAspect = (aspect < 1.4) ? (4 / 3) : (16 / 9);

    //debug(`Mode: ${aspect < 1.4 ? '4:3 cropped' : '16:9 contained'}`);
    
    // Toggle CSS class for cropping mode
    if (aspect < 1.4) {
        document.body.classList.add('aspect-4-3');
        document.body.classList.remove('aspect-16-9');
    } else {
        document.body.classList.add('aspect-16-9');
        document.body.classList.remove('aspect-4-3');
    }

    
    // --- compute "fit area" ---
    // This gives you the actual display area for the picture (cropped or contained)
    if (aspect > targetAspect) {
        // screen is wider than target -> limit by height, add horizontal margin
        pictureHeight = window.innerHeight;
        pictureWidth = pictureHeight * targetAspect;
    } else {
        // screen is narrower than target -> limit by width, add vertical margin
        pictureWidth = window.innerWidth;
        pictureHeight = pictureWidth / targetAspect;
    }

    // Update CSS custom props for slides
    document.documentElement.style.setProperty('--slide-height', `${pictureHeight}px`);
    document.documentElement.style.setProperty('--slide-gapBetweenSlides', `${gapBetweenSlides}px`);

    // Compute total visible slides (enough to cover viewport + scroll gap)
    visiblePictureCount = 1 + Math.ceil(window.innerHeight / (pictureHeight + gapBetweenSlides));
    
    // Resize the fixed slides container height
    // Compute total scrollable area (adds footer + about + banner space)
    const totalSlideSurface = slides.length * (pictureHeight + gapBetweenSlides);
    const extra = Math.max(80, 2 + window.innerHeight - 1.5 * (pictureHeight + gapBetweenSlides));

    slidesFixed.style.height = `${(totalSlideSurface + extra)}px`;
    
    const total = aboutHeight + bannerHeight + totalSlideSurface + extra;
    spacer.style.height = `${total}px`;
    minSlidesPosition = - (total - window.innerHeight);

    
    // Adjust debug box and fullscreen button positions horizontally
    const horizontalMargin = ((window.innerWidth - pictureWidth) * 0.5 + 10) + 'px';
    debugBox.style.left = horizontalMargin;
    fullscreen.style.right = horizontalMargin;




    /*
    let ratio = 4.0 / 3.0;
    if (window.innerWidth / window.innerHeight <= 4.1 / 3.0) ratio = 16.0 / 9.0;
    pictureWidth = Math.min(window.innerHeight * ratio, window.innerWidth);
    pictureHeight = pictureWidth / ratio;
    visiblePictureCount = 1 + Math.ceil(window.innerHeight / (pictureHeight + gapBetweenSlides));
    document.documentElement.style.setProperty('--slide-height', `${pictureHeight}px`);
    document.documentElement.style.setProperty('--slide-gapBetweenSlides', `${gapBetweenSlides}px`);
    const totalSlideSurface = slides.length * (pictureHeight + gapBetweenSlides); // each surface occupies vh + gap
    slidesFixed.style.height = totalSlideSurface;
    const extra = Math.max(80, 2 + window.innerHeight - 1.5 * (pictureHeight + gapBetweenSlides));// Add extra small footer space so you can scroll past last slide
    const total = aboutHeight + bannerHeight + totalSlideSurface + extra;
    spacer.style.height = total + 'px';
    minSlidesPosition = - (total - window.innerHeight);

    debugBox.style.left = ((window.innerWidth - pictureWidth) * 0.5 + 10) + 'px';
    fullscreen.style.right = ((window.innerWidth - pictureWidth) * 0.5 + 10) + 'px';
    */
}
function updateScroll() {
    const Y = window.scrollY;
    if (Y < aboutHeight) {// Case 1: Scrolling up or down at the top, reveal about
        about.style.transform = `translateY(${-aboutHeight + bannerHeight + (aboutHeight - Y)}px)`; // follows Y directly
        banner.style.transform = `translateY(0px)`; // stays fixed
        slidesFixed.style.transform = `translateY(0px)`;// stays fixed
        bannerPosition = 0.0;// reset
        slidesPosition = 0.0;// reset
        lastScroll = aboutHeight;// Math.Max(aboutHeight, Y);
    }
    else {
        about.style.transform = `translateY(-${aboutHeight}px)`;//to be sure about is hidden
        var delta = Y - lastScroll;
        if (delta > 0) {//increasing, this means scroll down

            let newDelta = delta;

            if (bannerPosition != -bannerHeight) {//banner visible
                newDelta = Math.max(delta - (bannerHeight + bannerPosition),0);
                bannerPosition = Math.max(bannerPosition - delta, -bannerHeight);
                banner.style.transform = `translateY(${bannerPosition}px)`;
            }

            if (newDelta > 0) {//banner hidden
                slidesPosition = Math.max(slidesPosition - newDelta, minSlidesPosition);
                slidesFixed.style.transform = `translateY(${slidesPosition}px)`;

                SetActiveSlide();
            }

        } else {//scroll up

            let newDelta = delta;

            if (bannerPosition != 0) {//banner not totally visible
                newDelta = Math.min(delta - bannerPosition, 0);
                bannerPosition = Math.min(bannerPosition - delta, 0);
                banner.style.transform = `translateY(${bannerPosition}px)`;
            }

            if (newDelta < 0) {//banner fully visible
                slidesPosition = Math.min(slidesPosition - newDelta, 0);
                slidesFixed.style.transform = `translateY(${slidesPosition}px)`;

                SetActiveSlide();
            }

        }

        lastScroll = Y;
    }

}
function SetActiveSlide() {
    let si = Math.round(-slidesPosition / (pictureHeight + gapBetweenSlides));
    if (psi == si) return;
    //grey out other slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === si);
    });
    showSlideInfo(si);
    preloadImageDecoded(si + visiblePictureCount);//preload the next image

    psi = si;
}


// --- Email copy to clipboard ---
const emailEl = document.getElementById('email');
if (emailEl) {
    emailEl.addEventListener('click', () => {
        const email = emailEl.textContent.trim();
        navigator.clipboard.writeText(email).then(() => {
            emailEl.textContent = "Copied email to clipboard";
            setTimeout(() => (emailEl.textContent = email), 1500);
        }).catch(err => console.error('Clipboard failed', err));
    });
}

// --- Full screen ---
const fullscreenEnterSrc = 'icons/fs.png';
const fullscreenExitSrc = 'icons/efs.png';

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