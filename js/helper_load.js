//LOAD COLUMNS
async function LoadColumns() {
    allColumnEls = [];
    allColumnSelectButtons = [];
    allImagesToPreload = [];
    framesPerColumn = [];
    columnCount = 0;
    slideCount = 0;

    
    const columnsRoot = `Columns`;
    const columnList = await fetch(`${columnsRoot}/columns.json`)
        .then(r => r.json());

    for (const colName of columnList) {
        imagesToPreload = [];
        const colFolder = `${columnsRoot}/${colName}`;
        const info = await fetch(`${colFolder}/info.json`).then(r => r.json());

        // Create column
        const colTemp = column_template.content.cloneNode(true);
        const column = colTemp.querySelector(".column");
        if (columnCount === 0)column.id = "columnOne";

        // Add animation
        frames = [];
        const animTemp = animation_template.content.cloneNode(true);
        const anim = animTemp.querySelector(".animation"); 
        for (const file of info.frames) {
            const frameTemp = frame_template.content.cloneNode(true);
            const frame = frameTemp.querySelector(".frame");
            const img = frame.querySelector("img");
            const src = `${colFolder}/Animation/${file}`;
            img.dataset.src = src;
            imagesToPreload.push(img);
            anim.appendChild(frameTemp);
            frames.push(frame);
        }
        framesPerColumn.push(frames);
        
        // Add text
        if (info.title) {
            const p = document.createElement("h2");
            p.textContent = info.title;
            animTemp.querySelector(".title").appendChild(p);
        }
        const detail = animTemp.querySelector(".detail");
        if (info.year) loadLineDesc(detail, detail_line_template, "Year: ", info.year);
        if (info.technique) loadLineDesc(detail, detail_line_template, "Technique: ", info.technique);
        if (info.dimensions) loadLineDesc(detail, detail_line_template, "Dimensions: ", info.dimensions);
        if (info.description) {
            const desc = animTemp.querySelector(".description");
            info.description.forEach(text => {
                const p = document.createElement("p");
                p.textContent = text;
                desc.appendChild(p);
            });
        }
        column.appendChild(animTemp);

        // Add slides
        let thisSlideCount = 0;
        for (const file of info.slides) {
            thisSlideCount++;
            const slideTemp = slide_template.content.cloneNode(true);
            const img = slideTemp.querySelector("img");
            const src = `${colFolder}/${file}`;
            img.dataset.src = src;
            imagesToPreload.push(img);
            column.appendChild(slideTemp);
        }
        if (thisSlideCount > slideCount) slideCount = thisSlideCount;

        // Add column to page
        columns.appendChild(column);
        allColumnSelectButtons.push(column.querySelector(".column-select-button"));
        allColumnEls.push(column);

        allImagesToPreload.push(imagesToPreload);
        columnCount++;
    }

    registerColumnSelectButtons();
}

function loadLineDesc(detail, detailLineTemplate, key, value) {
    const label = document.createElement("em");  // italic label
    label.textContent = key;
    const txt = document.createElement("span"); // inline value
    txt.textContent = value;
    const detailLine = detailLineTemplate.content.cloneNode(true);
    detailLine.appendChild(label);
    detailLine.appendChild(txt);
    detail.appendChild(detailLine);
}


function LoadLogoAnim(){
    /*framesAbout = [];
    about_animation.querySelectorAll(".frame").forEach((frame, index) => {
        const img = frame.querySelector("img");
        img.dataset.src = imagesRoot + img.dataset.src;
        allLogoToPreload.push(img);
        framesAbout.push(frame);
    });*/
    framesHome = [];
        home_animation.querySelectorAll(".frame").forEach((frame, index) => {
        const img = frame.querySelector("img");
        img.dataset.src = img.dataset.src;
        allLogoToPreload.push(img);
        framesHome.push(frame);
    });
}




//PRELOAD
async function preloadAllRegisteredLogo() {
    const promises = allLogoToPreload.map(async img => {
        const src = img.dataset.src;
        await preloadAndDecode(src);
        img.src = src;
        delete img.dataset.src;
    });
    await Promise.all(promises);
}

async function preloadAllRegisteredImages() {
    // Iterate columns manually, NOT with forEach
    for (let colIndex = 0; colIndex < allImagesToPreload.length; colIndex++) {
        const imagesToPreload = allImagesToPreload[colIndex];
        const promises = imagesToPreload.map(async (img, imgIndex) => {
            const src = img.dataset.src;
            await preloadAndDecode(src);
            img.src = src;
            delete img.dataset.src;
        });
        // Wait for the entire column to finish
        await Promise.all(promises);
        const colEl = allColumnEls[colIndex];
        requestAnimationFrame(() => colEl.classList.add("loaded"));
    }
}


async function preloadAndDecode(src) {
    try {
        const resp = await fetch(src, { cache: "force-cache" });
        const blob = await resp.blob();

        if (window.createImageBitmap) {
            await createImageBitmap(blob);
        } else {
            const tmp = new Image();
            tmp.src = URL.createObjectURL(blob);
            await tmp.decode();
            URL.revokeObjectURL(tmp.src);
        }
    } catch (err) {
        console.warn("Failed preload:", src, err);
    }
}

