// Auto-generated consts for DOM ids and classes from index.html
// Inserted by assistant: const <name> = document.getElementById("id");
// and const <name>Els = document.getElementsByClassName("class");

const spacer = document.getElementById("spacer");
const h_scrollbar = document.getElementById("h-scrollbar");
const v_scrollbar = document.getElementById("v-scrollbar");
const home = document.getElementById("home");
const home_hitBox = document.getElementById("home-hitBox");
const home_animation = document.getElementById("home-animation");
const up_hitbox = document.getElementById("up-hitbox");
const up_icon_cont = document.getElementById("up-icon-cont");
const up_icon = document.getElementById("up-icon");
const down_hitbox = document.getElementById("down-hitbox");
const down_icon_cont = document.getElementById("down-icon-cont");
const down_icon = document.getElementById("down-icon");
const left_hitbox = document.getElementById("left-hitbox");
const left_icon_cont = document.getElementById("left-icon-cont");
const left_icon = document.getElementById("left-icon");
const right_hitbox = document.getElementById("right-hitbox");
const right_icon_cont = document.getElementById("right-icon-cont");
const right_icon = document.getElementById("right-icon");
const extra_right_overlay = document.getElementById("extra-right-overlay");
const columns = document.getElementById("columns");
const column_template = document.getElementById("column-template");
const animation_template = document.getElementById("animation-template");
const frame_template = document.getElementById("frame-template");
const detail_line_template = document.getElementById("detail-line-template");
const slide_template = document.getElementById("slide-template");
const about = document.getElementById("about");
const about_animation = document.getElementById("about-animation");
const about_text = document.getElementById("about-text");
const insta_link = document.getElementById("insta-link");
const insta_icon = document.getElementById("insta-icon");
const linkedin_link = document.getElementById("linkedin-link");
const whatsapp_link = document.getElementById("whatsapp-link");
const contact = document.getElementById("contact");
const btn_mainContainerId = document.getElementById("btn-mainContainerId");

const scrollbarEls = document.getElementsByClassName("scrollbar");
const animationEls = document.getElementsByClassName("animation");
const frameEls = document.getElementsByClassName("frame");
const btn_mainContainer = document.getElementsByClassName("btn-mainContainer");
const btn_hitboxEls = document.getElementsByClassName("btn-hitbox");
const btn_icon_contEls = document.getElementsByClassName("btn-icon-cont");
const btn_iconEls = document.getElementsByClassName("btn-icon");
const extra_overlayEls = document.getElementsByClassName("extra-overlay");
const columnEls = document.getElementsByClassName("column");
const title_contenerEls = document.getElementsByClassName("title-contener");
const titleEls = document.getElementsByClassName("title");
const detailEls = document.getElementsByClassName("detail");
const descriptionEls = document.getElementsByClassName("description");
const detail_lineEls = document.getElementsByClassName("detail-line");
const slideEls = document.getElementsByClassName("slide");


document.documentElement.style.setProperty('--backColor', 'rgb(250,250,250)');
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
if (isMobile) document.body.classList.add("isMobile");

let vh = window.innerHeight;
let vw = window.innerWidth;
let ivw = vw;
let squareSide = 100;
let aspect = 1;
let targetAspect = 1;
let scale = 1;
let minSacle = 0.2;
const columnsHeightZoomedOut = 0.5;//how x*vh the columns use when zoomed out
let topOffsetZoomedOut = 0;
let leftOffsetZoomedOut = 0;

let X = 0;
let Y = 0;
let prevY = 0;
let ySnaps = [];
let xSnaps = [];
let xSnap = 0;
let ySnap = 0;
let isTop = true;
let left = true;
let right = true;
let bottom = true;

let imageWidth = 0;
let imageHeight = 0;
let animationHeight = 0;
let portraitTextHeight = 0;
let columnHeight = 0;
let columnWidth = 0;
let columnsHeight = 0;
let columnsWidth= 0;

let spacerHeight = 0;
let scrollableWidth = 0;

let globalPadding = 0;
let globalPaddingW = 0;
let extraSide = 0;
let buttonHeight = 0;
let imagePadding = 0;
let scrollLengthVideo = 1000;

let slideCount = 3;
let columnCount = 3;

let framesPerColumn;//to retrieve blue animation frames after loading
let allLogoToPreload = [];   // filled during loadLogo()
let allImagesToPreload = [];   // filled during loadColumns()
let allColumnEls = [];
let framesAbout = [];//frames of about animation
let framesHome = [];
let allColumnSelectButtons = [];// clickable buttons on zoomout

zoomOutVisibleColumnCount = 1;
let zooming = false;

let resetAnimations = false;


function Remap(value, sourceMin, sourceMax, targetMin, targetMax) {
    if (sourceMax === sourceMin) return targetMin;
    const ratio = (value - sourceMin) / (sourceMax - sourceMin);
    return targetMin + ratio * (targetMax - targetMin);
}