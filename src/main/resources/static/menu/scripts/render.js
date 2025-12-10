// render.js
export { renderMemberButton, renderMembersSequentially, renderMemberDetails, renderAddMemberForm };



function renderMemberButton(member) {
    const memberList = document.getElementById('memberList');// 获取成员列表容器
    
    const listItem = document.createElement('li');// 创建列表项
    listItem.className = 'member-item';// 设置类名以便应用样式

    const button = document.createElement('button');// 创建按钮元素
    button.textContent = member.name;// 设置按钮文本为成员名称（从member对象中抓取对应字段）
    button.dataset.id = member.id;// 使用 data-id 属性存储成员 ID 以便后续使用（从member对象中抓取对应字段）
    //在按钮被创建之后，会立刻执行style.css中的动画效果
    // 因为这与其中的已经写好的动画匹配上并播放

    listItem.style.opacity = '0'; // 初始透明度为0
    listItem.style.animationFillMode = 'forwards';// 保持动画结束状态

    // 触发重绘以确保动画生效，嵌套结构，因此成员列表容器里就多了一个这样的元素。
    listItem.appendChild(button);// 将按钮添加到列表项
    memberList.appendChild(listItem);// 将列表项添加到成员列表容器
}



function renderMembersSequentially(members) {
    let i = 0;
    function step() {
        if (i >= members.length) 
            return;
        renderMemberButton(members[i]);
        i += 1;
        setTimeout(step, 120); // 每隔 120ms 添加一个，形成“一个一个出现”
    }
    step();
}



// 缓存模板内容
let memberDetailTemplate = null;

// 异步加载模板函数
async function loadTemplate() {
    if (memberDetailTemplate) return memberDetailTemplate;
    try {
        const response = await fetch('./templates/member_detail.html');//从templates文件夹中获取模板
        if (!response.ok) throw new Error('Failed to load template');//错误检查，如果请求失败则抛出错误
        memberDetailTemplate = await response.text(); // 将模板内容存储到缓存变量中
        return memberDetailTemplate; // 返回模板内容
    } catch (error) {
        console.error('Error loading template:', error);
        return '<div class="error">Error loading template</div>';// 返回一个简单的错误模板
    }
}

async function renderMemberDetails(member) {
    /* 渲染成员详情 */
    const contentContainer = document.getElementById('memberContent');
    
    // 确保模板已加载
    const template = await loadTemplate();

    // 逻辑控制：判断是否为实习生
    const Probation = member.Probation === true;
    const statusText = Probation ? 'Intern' : 'Official';
    const statusClass = Probation ? 'status-intern' : 'status-official';

    // 1. 准备数据：计算面试分数的百分比
    const interviewScore = member.interviewScore || 4; // 默认值为0，可以暂时调整之查看效果
    const interviewMax = 15;
    const interviewPercent = Math.min((interviewScore / interviewMax) * 100, 100);

    const salaryScore = member.salaryScore || 2025; // 默认值为0，可以暂时调整之查看效果
    const salaryMax = 5500;
    const salaryPercent = Math.min((salaryScore / 5500) * 100, 100);

    const internshipScore = member.internshipScore || 13; // 默认值为0，可以暂时调整之查看效果
    const internshipMax = 20;
    const internshipPercent = Math.min((internshipScore / internshipMax) * 100, 100);

    // 准备视图数据对象 (ViewModel)
    // 这里我们将所有需要在模板中显示的数据都整理好
    const viewModel = {
        name: member.name,
        id: member.id,
        studentId: member.studentID || 'studentID',
        statusText: statusText, //状态文本
        statusClass: statusClass, //状态样式类
        position: member.memberType || 'Position',
        phoneNumber: member.phoneNumber || 'N/A',
        email: member.email || 'N/A',
        joinDate: member.joinDate || '2024-01-01',
        
        // 分数相关
        interviewScore: interviewScore,
        interviewMax: interviewMax,
        interviewPercent: interviewPercent,
        
        internshipScore: internshipScore,
        internshipMax: internshipMax,
        internshipPercent: internshipPercent,

        salaryScore: salaryScore,
        salaryMax: salaryMax,
        salaryPercent: salaryPercent
    };

    // 简单的模板替换引擎
    // 将模板中的 {{key}} 替换为 viewModel[key]
    const html = template.replace(/\{\{(\w+)\}\}/g, (match, key) => {// 正则匹配 {{key}} 形式的占位符
        return viewModel[key] !== undefined ? viewModel[key] : '';
    });

    contentContainer.innerHTML = html;
}



//////--------------------------添加成员表单部分的逻辑--------------------------//////
// 缓存添加成员表单模板
let addMemberFormTemplate = null;

async function loadAddMemberFormTemplate() {
    if (addMemberFormTemplate) return addMemberFormTemplate;
    try {
        const response = await fetch('./templates/add_member_form.html');
        if (!response.ok) throw new Error('Failed to load template');
        addMemberFormTemplate = await response.text();
        return addMemberFormTemplate;
    } catch (error) {
        console.error('Error loading template:', error);
        return '<div class="error">Error loading form template</div>';
    }
}

async function renderAddMemberForm() {
    /* 渲染添加成员表单 */
    const contentContainer = document.getElementById('memberContent');
    
    // 1. 加载模板
    const template = await loadAddMemberFormTemplate();
    
    // 2. 渲染 HTML
    contentContainer.innerHTML = template;

    

    // 4. 初始化自定义下拉菜单逻辑
    const customSelect = document.getElementById('customPositionSelect');
    const hiddenInput = document.getElementById('position');
    
    if (customSelect && hiddenInput) {
        const selectedDisplay = customSelect.querySelector('.select-selected');
        const itemsContainer = customSelect.querySelector('.select-items');
        const options = itemsContainer.querySelectorAll('div');

        // 点击显示框：切换状态
        selectedDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            const isClosed = itemsContainer.classList.contains('select-hide');
            
            // 先关闭（确保状态重置）
            closeCustomSelect();

            // 如果之前是关闭的，则打开
            if (isClosed) {
                itemsContainer.classList.remove('select-hide');
                selectedDisplay.classList.add('select-arrow-active');
            }
        });

        // 点击选项
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                // 更新显示文本
                selectedDisplay.textContent = this.textContent;
                // 更新隐藏输入框的值
                hiddenInput.value = this.getAttribute('data-value');
                // 关闭菜单
                closeCustomSelect();
            });
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function() {
            closeCustomSelect();
        });

        function closeCustomSelect() {
            itemsContainer.classList.add('select-hide');
            selectedDisplay.classList.remove('select-arrow-active');
        }
    }
}