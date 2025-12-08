// render.js
export{addMemberButton, addMembersSequentially};
    function addMemberButton(member) {
        const memberList = document.getElementById('memberList');
        

        
        const listItem = document.createElement('li');
        listItem.className = 'member-item';

        const button = document.createElement('button');
        button.textContent = member.name;
        button.dataset.id = member.id;

        button.style.opacity = '0';


        
        button.style.animationFillMode = 'forwards';
        button.classList.add('fade-in');

        listItem.appendChild(button);
        memberList.appendChild(listItem);
        
    }

    function addMembersSequentially(members) {
        let i = 0;
        function step() {
            if (i >= members.length) 
                return;
            addMemberButton(members[i]);
            i += 1;
            setTimeout(step, 120); // 每隔 120ms 添加一个，形成“一个一个出现”
        }
        step();
    }
