import * as render from './render.js';



document.addEventListener('DOMContentLoaded', () => {
    memberList.innerHTML = ''; // 清空现有列表
    const memberButtons = document.querySelectorAll('.member-item button');

    render.addMembersSequentially([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Diana' },
        { id: 5, name: 'Ethan' },
    ]);

    memberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const memberId = button.dataset.id;
            window.location.href = `/ui/member.html?id=${memberId}`;
        });
    });
});