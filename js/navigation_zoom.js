function registerColumnSelectButtons(){
    for (let colIndex = 0; colIndex < allColumnSelectButtons.length; colIndex++) {
        const columnSelectButton = allColumnSelectButtons[colIndex];
        columnSelectButton.addEventListener("click", () => {
            zoomInColumn(colIndex);
        });
    }
}

async function zoomInColumn(columnIndex){
    if (zooming) return;
    zooming = true;

    contact.classList.remove('visible');
    
    btn_mainContainerId.classList.remove('slow');
    //console.log('transition (btn):', getComputedStyle(btn_mainContainerId).transition);
    btn_mainContainerId.classList.add('hidden');

    framesHome.forEach((frame, i) => {
        frame.classList.toggle('active', i === 0);
    });
    
    about.classList.remove('visible');

    await sleep(600);

    xSnap = columnIndex;
    ySnap = 0;
    smoothZoomXY(scale, 1, X, columnIndex * (columnWidth/scale + imagePadding), 0, 0, 2000, () => {
        home.classList.add('visible');
        
        btn_mainContainerId.classList.add('slow');
        //console.log('transition (btn):', getComputedStyle(btn_mainContainerId).transition);
        btn_mainContainerId.classList.remove('hidden');

        Array.from(extra_overlayEls).forEach((extra_overlay) => {
            extra_overlay.classList.add('visible');
        });

    });
}
/*
async function zoomInColumn(columnIndex){
    if (zooming) return;
    zooming = true;

    aboutMove(-topOffsetZoomedOut, 200, async () => {
        await sleep(100);
        contact.style.display = "none";
        contact.style.pointerEvents = "none";
        home.style.display = "block";
        home.style.pointerEvents = "auto";
        framesHome.forEach((frame, i) => {
            frame.classList.toggle('active', i === 0);
        });
        smoothZoomXY(scale, 1, X, columnIndex * (columnWidth/scale + imagePadding), 0, 0, 1000);
    });
}
*/
//HOME CLICK: Zoom out
home_hitBox.addEventListener("click", () => {
    if (zooming) return;
    zooming = true;
    smoothZoomXY(scale, minSacle, X, 0, Y, 0, 1800, async () => {
        xSnap = 0;
        ySnap = 0;

        contact.classList.add('visible');
        home.classList.remove('visible');
        about.classList.add('visible');
        framesAbout.forEach((frame, i) => {
            frame.classList.toggle('active', i === 0);
        });
        await sleep(100);
        //animate(framesAbout, 'forward', 1500);

        //await sleep(2000);
        Array.from(extra_overlayEls).forEach((extra_overlay) => {
            extra_overlay.classList.remove('visible');
        });

    });
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

