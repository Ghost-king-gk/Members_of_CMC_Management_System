import { createHeroTimeline } from './effects.js';

export function start() {
  const heroEl = document.querySelector('#hero'); // 确保你的 index.html 里有这个元素
  const tl = createHeroTimeline(heroEl);

  // 创建可视化时间轴工具
  GSDevTools.create({
    animation: tl,
    minimal: false,      // 显示完整控制
    globalSync: true     // 同步全局时间轴（如有多个）
  });

  tl.play(); // 也可先暂停看时间轴：tl.pause();
}