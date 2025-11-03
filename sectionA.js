//#region --- Elements, Variables ---
const signature = document.getElementById('signature');
const signatureImg = document.getElementById("signature-img");

const textIcon = document.getElementById("textIcon");


const video = document.getElementById('video');
const frames = Array.from(document.querySelectorAll('#video .frame'));

const pathButtons_a = document.getElementById("path-buttons-a");
const pathButtons_b = document.getElementById("path-buttons-b");


let videoHeight = 0;
//#endregion

//#region --- Methods ---
const signatureRatio = 1500 / 400;
const videoRatio = 1500 / 1125;

const textBox = document.getElementById('textBox');
const textBoxContact = document.getElementById('textBoxContact');
function ResizeSectionA() {
    textBox.style.left = globalPadding + globalPadding + buttonSize + 'px';
    textBox.style.width = Math.min(850, vw - (3 * globalPadding + buttonSize)) + 'px';

 
    textBoxContact.style.left = globalPadding + globalPadding + buttonSize + 'px';
    textBoxContact.style.width = Math.min(400, vw - (3 * globalPadding + buttonSize)) + 'px';

    const signatureWidth = 0.4 * squareSideButtons;
    signature.style.width = signatureWidth + 'px';
    const signatureLeft = 0.5 * vw - 0.5 * signatureWidth;
    signature.style.left = signatureLeft + 'px';
    const signatureHeight = signatureWidth / signatureRatio;
    signature.style.height = signatureHeight + 'px';
    signature.style.top = globalPadding + 'px';

    textIcon.style.top = Math.max(globalPadding + globalPadding + buttonSize, signatureHeight) + 'px';

    //video
    const ivh = vh - (signatureHeight + globalPadding) - globalPadding;
    videoHeight = Math.min(ivw / videoRatio, ivh) * 0.95;
    video.style.height = videoHeight + 'px';
    video.style.top = (ivh - videoHeight) / 2 + (signatureHeight + globalPadding) + 'px';

    //debug(vw + ', ' + ivw + ', ' + globalPadding);

    //path buttons
    /*if (ivw > ivh) {
        const offset = Math.max(150, (ivw - videoWidth) / 2);
        pathButtons_a.style.width = 2 * offset + 'px';
        pathButtons_a.style.height = ivh + 'px';
        pathButtons_a.style.top = vh - ivh + 'px';
    } else {

    }*/

    ySnaps.push(0);
    ySnaps.push(scrollLengthVideo);
}

async function PreloadSectionA() {
    const imgs = frames.map(f => f.querySelector('img')).filter(Boolean);
    const promises = imgs.map(img => preloadAndDecode(img.dataset.src));
    await Promise.all(promises);
    imgs.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
    console.log('✅ All frames preloaded');
}
function ScrollSectionA(Y, prevY) {
    if (Y <= scrollLengthVideo || prevY <= scrollLengthVideo) {// video Play
        const progress = Remap(Y, 0, scrollLengthVideo, 0, 1);
        const frameIndex = Math.min(Math.floor(progress * frames.length), frames.length - 1);
        frames.forEach((frame, i) => {
            frame.classList.toggle('active', i === frameIndex);
        });
    };
}

//#endregion









// --- Text Overlay Toggle ---
const textOverlay = document.getElementById('textOverlay');
const textIconSrc = 'icons/round/txt.png';
const textCloseSrc = 'icons/round/close.png'; // replace with your cross icon

let overlayOpen = false;

textIcon.addEventListener('click', toggleTextOverlay);

function toggleTextOverlay() {
    overlayOpen = !overlayOpen;

    if (overlayOpen) {
        textOverlay.style.display = 'block';
        textIcon.src = textCloseSrc;
        textIcon.style.background = 'gba(255, 255, 255, 1)';
    } else {
        textOverlay.style.display = 'none';
        textIcon.src = textIconSrc;
        textIcon.style.background = 'gba(255, 255, 255, 0.2)';
    }
}

// Close overlay with Escape (but not if in fullscreen)
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayOpen && !document.fullscreenElement) {
        toggleTextOverlay();
    }
});





const textContactIcon = document.getElementById("contactIcon");
// --- Text Overlay Toggle ---
const textOverlayContact = document.getElementById('textOverlayContact');
const textContactIconSrc = 'icons/round/contact.png';
const textContactCloseSrc = 'icons/round/close.png'; // replace with your cross icon

let overlayContactOpen = false;

textContactIcon.addEventListener('click', toggleTextContactOverlay);

function toggleTextContactOverlay() {
    overlayContactOpen = !overlayContactOpen;

    if (overlayContactOpen) {
        textOverlayContact.style.display = 'block';
        textContactIcon.src = textContactCloseSrc;
        textContactIcon.style.background = 'gba(255, 255, 255, 1)';
    } else {
        textOverlayContact.style.display = 'none';
        textContactIcon.src = textContactIconSrc;
        textContactIcon.style.background = 'gba(255, 255, 255, 0.2)';
    }
}

// Close overlay with Escape (but not if in fullscreen)
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayContactOpen && !document.fullscreenElement) {
        toggleTextContactOverlay();
    }
});
