import * as effect from "./effects.js";

document.addEventListener('DOMContentLoaded', () => {
    const welcomeEl = document.querySelector('.welcome');
    const infoEl = document.querySelector('.info');
    const startEl = document.querySelector('.start');

    // 添加按钮点击水波纹效果
    startEl.addEventListener('click', (event) => {
        effect.playFullscreenRippleEffect(startEl, event);
        setTimeout(() => {
            window.location.href = '/ui/index.html';
        }, 300); // 延迟导航以显示水波纹效果
    });
});