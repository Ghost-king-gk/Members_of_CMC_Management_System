import * as render from './render.js';
import * as api from './api.js'; // 引入我们封装好的 API 模块

document.addEventListener('DOMContentLoaded', async () => {
    const memberList = document.getElementById('memberList');
    
    memberList.innerHTML = ''; // 清空现有列表

    try {
        // 1. 从后端获取真实的成员列表数据
        // 这里对应你要求的“从序列内读取到 name 和 id”
        const members = await api.fetchMemberList();
        
        // 2. 渲染左侧按钮列表
        render.renderMembersSequentially(members);
    } catch (error) {
        console.error("Failed to fetch member list:", error);
        memberList.innerHTML = '<li style="color:red; padding:10px;">Error loading members</li>';
    }

    // 使用事件委托处理点击事件
    memberList.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            const button = event.target;
            const memberId = button.dataset.id;

            try {
                // 3. 点击后，通过 ID 获取该成员的完整详情数据
                // 这里对应你要求的“点击之后，也通过对应的 id 来 fetch 到成员的数据”
                const detailData = await api.fetchMemberById(memberId);

                // 4. 渲染右侧详情视图
                render.renderMemberDetails(detailData);
            } catch (error) {
                console.error(`Failed to fetch details for member ${memberId}:`, error);
                alert("Failed to load member details. Please try again.");
            }
        }
    });

    
    // 处理“添加成员”按钮点击事件
    const addMemberBtn = document.getElementById('addMemberBtn');
    addMemberBtn.addEventListener('click', () => {
        render.renderAddMemberForm();
    });

});