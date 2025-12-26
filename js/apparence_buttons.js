//HIDING BUTTONS WHEN AT EDGES
function UpdateButtonsHiding() {
    if (zooming)return;
    isTop = scale != 1 || Y < 2;
    bottom = scale != 1 || Y > spacerHeight - vh - 2;
    left = X < 2;
    right = X > scrollableWidth - 2;
    if (scale != 1) {
        right = X > columnsWidth - (zoomOutVisibleColumnCount + 1) * (columnWidth - 2 * scale * imagePadding) - 2;
    }

    Hiding(up_icon_cont, up_hitbox, isTop);
    Hiding(down_icon_cont, down_hitbox, bottom);
    Hiding(right_icon_cont, right_hitbox, right);
    Hiding(left_icon_cont, left_hitbox, left);
}

function Hiding(el, hitbox, hide) {
    if (hide) {
        //console.log('transition (btn) :', getComputedStyle(el).transition);
        el.classList.add('hidden');
        hitbox.classList.add('hidden');
    } else {
        //console.log('transition (btn) :', getComputedStyle(el).transition);
        el.classList.remove('hidden');
        hitbox.classList.remove('hidden');
    }
}

//HOOVER BUTTONS
function connectHover(id) {
    const hitbox = document.getElementById(id + "-hitbox");
    const iconCont = document.getElementById(id + "-icon-cont");
    const icon = document.getElementById(id + "-icon");
    if (!isMobile) {

        iconCont.addEventListener("mouseenter", () => {
            hover(true, id, iconCont, icon);
        });
        iconCont.addEventListener("mouseleave", () => {
            hover(false, id, iconCont, icon);
        });

        hitbox.addEventListener("mouseenter", () => {
            hover(true, id, iconCont, icon);
        });
        hitbox.addEventListener("mouseleave", () => {
            hover(false, id, iconCont, icon);
        });
    } else {
        icon.src = "cursors/" + id + "/u.png";


        iconCont.addEventListener("touchstart", () => {
            hoverMobile(true,  iconCont);
        });

        iconCont.addEventListener("touchend", () => {
            hoverMobile(false,  iconCont);
        });

        iconCont.addEventListener("touchcancel", () => {
            hoverMobile(false,  iconCont);
        });



        hitbox.addEventListener("touchstart", () => {
            hoverMobile(true,  iconCont);
        });

        hitbox.addEventListener("touchend", () => {
            hoverMobile(false,  iconCont);
        });

        hitbox.addEventListener("touchcancel", () => {
            hoverMobile(false,  iconCont);
        });
    }
}

function hover(on, id, iconCont, icon) {
    if (on) {
        //iconCont.style.transform = "scale(1.2)";
        icon.src = "cursors/u.png";
    } else {
        //iconCont.style.transform = "scale(1)";
        icon.src = "cursors/c.png";
    }
}
function hoverMobile(on,  iconCont) {
    if (on) {
        iconCont.style.transform = "scale(1.2)";
    } else {
        iconCont.style.transform = "scale(1)";
    }
}

connectHover("up");
connectHover("down");
connectHover("left");
connectHover("right");