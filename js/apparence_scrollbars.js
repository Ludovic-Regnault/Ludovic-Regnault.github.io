function UpdateScrollBars() {
    UpdateRightScrollBar();
    UpdateBottomScrollBar();
}
function UpdateRightScrollBar() {
    const total = spacerHeight - vh;
    const ratio = Y / total;
    v_scrollbar.style.height = `${ratio * vh}px`;
}
function UpdateBottomScrollBar() {
    const ratio = X / scrollableWidth;
    h_scrollbar.style.width = `${ratio * vw}px`;
}