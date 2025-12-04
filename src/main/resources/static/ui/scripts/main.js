import * as api from './api.js';
import * as effect from './effects.js';
import * as utils from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM 加载完成后执行，确保HTML元素可用才去寻找按钮、输入框并绑定事件。

    const btnStatus = document.getElementById('btn-status');    // 状态检查,按钮
    const btnMemberList = document.getElementById('btn-members');  // 获取成员列表,按钮
    const btnMember = document.getElementById('btn-member');    // 获取指定成员,按钮
    const memberIdInput = document.getElementById('memberId');  // 成员ID输入框


    btnStatus.addEventListener('click', (event) => {
        effect.playRippleEffect(btnStatus, event);
        api.fetchStatus();
    });

    btnMemberList.addEventListener('click', (event) => {
        effect.playRippleEffect(btnMemberList, event);
        api.fetchMemberList();
    });

    btnMember.addEventListener('click', async (event) => {
        effect.playRippleEffect(btnMember, event);
        await utils.sleep(100); //等待水波纹效果播放完毕
        const id = memberIdInput.value.trim();
        if (!id) {
            alert('请输入 ID');
            return;
        }
        api.fetchMember(id);
    });
    
});