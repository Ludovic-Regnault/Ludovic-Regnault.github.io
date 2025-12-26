//MOVE COLUMNS
function UpdateScrollYForColumnsPos() {
    const tScale = Remap(scale,minSacle, 1, 1, 0);
    if (Y < scrollLengthVideo) {
        columns.style.top = (tScale * topOffsetZoomedOut) + 'px';
    } else {
        columns.style.top = (-Math.max(0, (Y - scrollLengthVideo)) * scale + tScale * topOffsetZoomedOut) + "px";
    }
}
function UpdateScrollXForColumnsPos() {
    const tScale = Remap(scale,minSacle, 1, 1, 0);
    columns.style.left = (-X * scale + extraSide + tScale * leftOffsetZoomedOut) + "px";//extraSide is updated by smoothZoomXY
}

//MOVE HITBOXES
function updateHitBoxSize(){
    const tScale = Remap(scale,minSacle, 1, 1, 0);
    const top = (tScale * topOffsetZoomedOut) + 'px';
    const height = (vh - tScale * topOffsetZoomedOut) + 'px';
    
    right_hitbox.style.top = top;
    right_hitbox.style.height = height;
    left_hitbox.style.top = top;
    left_hitbox.style.height = height;
    for (let b of btn_mainContainer) {
        b.style.top = top;
        b.style.height = height;
    }
}

//BUTTONS CLICKS: SNAP TO NEXT COLUMN/SLIDE
up_hitbox.addEventListener("click", () => {
    snapVertical(-1);
});

down_hitbox.addEventListener("click", () => {
    snapVertical(1);
});

right_hitbox.addEventListener("click", () => {
    snapHorizontal(1);
});

left_hitbox.addEventListener("click", () => {
    snapHorizontal(-1);
});


up_icon_cont.addEventListener("click", () => {
    snapVertical(-1);
});

down_icon_cont.addEventListener("click", () => {
    snapVertical(1);
});

right_icon_cont.addEventListener("click", () => {
    snapHorizontal(1);
});

left_icon_cont.addEventListener("click", () => {
    snapHorizontal(-1);
});

