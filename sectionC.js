const slidesFixed = document.getElementById('slidesFixed');
const footer = document.getElementById('footer');


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
let visiblePictureCount = 0;

//#region --- Elements, Variables ---
let slideData = [];
loadSlideDescriptions().then(data => {
    slideData = data;
});
//#endregion

//#region --- Methods ---
function ResizeSectionC() {
    // dimension picture size
    pictureWidth = Math.min(window.innerWidth, window.innerHeight * targetAspect) ;
    pictureHeight = pictureWidth / targetAspect;

    // Update CSS custom props for slides
    document.documentElement.style.setProperty('--slide-height', `${pictureHeight}px`);

    // preload
    visiblePictureCount = 1 + Math.ceil(window.innerHeight / pictureHeight);
    preloadFirstN(visiblePictureCount);
    //debug(visiblePictureCount);

    // Resize the fixed slides container height
    // Compute total scrollable area (adds footer + about + banner space)
    const totalSlideSurface = slides.length * pictureHeight;
    const extra = footer.scrollHeight;
    slidesFixed.style.height = `${(totalSlideSurface + extra)}px`;
    scrollLengthSectionC = totalSlideSurface + extra;//to be used by updateSpacer


    scrollLengthSlides = totalSlideSurface + extra;

    const plus = vh - pictureHeight + scrollLengthVideo;
    for (let i = 1; i < slides.length + 1; i++) {
        ySnaps.push( plus + i * pictureHeight);
    }
}


function ScrollSectionC(Y, prevY) {
    const scrollSlides0 = scrollLengthVideo;
    const scrollSlides1 = scrollSlides0 + scrollLengthSectionC;
    if (Y > scrollSlides0 || prevY > scrollSlides0) {
        if (Y > scrollSlides1) console.log('ERROR LENGTH OF SPACER IS WRONG');
        const offset = (Y - scrollSlides0) / pictureHeight;
        slidesFixed.style.transform = `translateY(${Remap(Y, scrollSlides0, scrollSlides1, vh, vh - scrollLengthSectionC)}px)`;       
/*
        var roundOffset = Math.round(offset);
        debug(`offset: ${offset}, roundOffset: ${roundOffset}, diff: ${Math.abs(offset - roundOffset) * pictureHeight}`);
        if (Math.abs(offset - roundOffset) * pictureHeight < globalPadding) {
            slidesFixed.style.transform = `translateY(${Remap(roundOffset * pictureHeight + scrollSlides0 , scrollSlides0, scrollSlides1, vh, vh - scrollLengthSectionC)}px)`;       
        } else {
            slidesFixed.style.transform = `translateY(${Remap(Y, scrollSlides0, scrollSlides1, vh, vh - scrollLengthSectionC)}px)`;       
        }
        */
        preloadFirstN(visiblePictureCount + Math.ceil(offset));
    } else {
        slidesFixed.style.transform = 'translateY(100vh)';
    }
}


// --- Captions ---
async function loadSlideDescriptions() {
    const entries = slidesText.split('---').map(entry => entry.trim()).filter(Boolean);
    return entries;
}

