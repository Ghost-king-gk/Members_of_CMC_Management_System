export { renderMemberButton, renderMembersSequentially, renderMemberDetails, renderAddMemberForm };
import * as api from './api.js';


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
        studentID: member.studentID || 'studentID',
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

    // 绑定“删除”弹出框逻辑（从垃圾桶右侧冒出，不是整页弹窗）
    const deleteWrap = contentContainer.querySelector('.member-detail__delete');
    if (deleteWrap) {
        const toggleBtn = deleteWrap.querySelector('[data-action="toggle-delete"]');
        const popover = deleteWrap.querySelector('[data-role="delete-popover"]');
        const cancelBtn = deleteWrap.querySelector('[data-action="cancel-delete"]');
        const confirmBtn = deleteWrap.querySelector('[data-action="confirm-delete"]');

        let isOpen = false;
        let removeDocListener = null;

        const open = () => {
            if (!popover || !toggleBtn) return;
            popover.hidden = false;
            toggleBtn.setAttribute('aria-expanded', 'true');
            isOpen = true;

            const onDocClick = (e) => {
                if (!deleteWrap.contains(e.target)) close();
            };
            document.addEventListener('click', onDocClick);
            removeDocListener = () => document.removeEventListener('click', onDocClick);
        };

        const close = () => {
            if (!popover || !toggleBtn) return;
            popover.hidden = true;
            toggleBtn.setAttribute('aria-expanded', 'false');
            isOpen = false;
            if (removeDocListener) {
                removeDocListener();
                removeDocListener = null;
            }
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isOpen) close();
                else open();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                close();
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                confirmBtn.disabled = true;
                try {
                    await api.fetchDeleteMember(member.id);
                    console.log('Member has been deleted:', member.id);
                    await fetch('/savetojson');

                    refreshMemberList();

                    contentContainer.innerHTML = '<section class="content__card"><h2>Member deleted</h2><p>Please select a member from the left.</p></section>';
                } catch (err) {
                    console.error(err);
                    close();
                    alert('Delete failed: ' + (err && err.message ? err.message : err));
                } finally {
                    confirmBtn.disabled = false;
                }
            });
        }
    }
}



//////--------------------------添加成员表单部分的逻辑--------------------------//////
// 缓存添加成员表单模板
let addMemberFormTemplate = null;
async function loadAddMemberFormTemplate() {
    if (addMemberFormTemplate) return addMemberFormTemplate;
    try {
        const response = await fetch('./templates/add_member_form.html');
        if (!response.ok) throw new Error('Failed to load template of add member form');
        addMemberFormTemplate = await response.text();
        return addMemberFormTemplate;
    } catch (error) {
        console.error('Error loading template:', error);
        return '<div class="error">Error loading form template</div>';
    }
}

async function refreshMemberList() {
    // 刷新左侧列表（降低“删除后列表还在”的割裂感）
    const memberList = document.getElementById('memberList');
    if (memberList) {
        memberList.innerHTML = '';
        const members = await api.fetchMemberList();
        renderMembersSequentially(members);
    }
}

async function renderAddMemberForm() {
    /* 渲染添加成员表单 */
    const contentContainer = document.getElementById('memberContent');
    
    // 1. 加载模板
    const template = await loadAddMemberFormTemplate();
    
    // 2. 渲染 HTML
    contentContainer.innerHTML = template;
    

    // 3. 表单验证和提交逻辑
    const form = document.getElementById('addMemberForm');
    const nameInput = document.getElementById('name');
    const positionInput = document.getElementById('position');
    // 修正：HTML中的ID是 'studentId' (小写d)，这里必须匹配
    const studentIDInput = document.getElementById('studentID');
    const modal = document.getElementById('validationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (form) {/////如果 form 存在，这是一种种保护措施，防止直接报错，确保下面的代码只在表单存在时执行
        // 禁用浏览器默认验证，接管控制权
        form.setAttribute('novalidate', true);

        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // 阻止默认提交

            // 检查名字是否为空
            if (!nameInput.value.trim()) {
                // 滚动到 Name 输入框，使其可见
                nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // 2. 添加错误样式类：这会触发 CSS 中的 border 变红和 shake 动画
                nameInput.classList.add('input-error');

                // 3. 关键点2：设置定时器移除样式类
                // 这里的 1000ms 必须与 CSS 中的 animation: 1s 保持一致
                // 只有移除了类，下次点击时再次添加类，动画才会重新播放
                setTimeout(() => nameInput.classList.remove('input-error'), 1000);
            } else {
                // 构造数据对象：键名必须与后端期望的参数名一致
                // 后端期望: ?name=...&studentID=...
                const memberData = {
                    name: nameInput.value.trim(),
                    // 注意：这里左边的 key 'studentID' 是发给后端的参数名
                    // 右边的 value 来自前端输入框 studentIDInput
                    studentID: studentIDInput && studentIDInput.value.trim() ? studentIDInput.value.trim() : null
                };

                // 定义成功后的回调：显示消息并触发保存
                const onSuccess = () => {
                    // 触发后端保存 JSON (GET请求)
                    fetch('/savetojson',{ method: 'GET' })
                        .then(() => console.log('Data has been saved to JSON'))
                        .catch(err => console.error('Save failed:', err));
                };

                // 定义失败后的回调
                const onError = (error) => {
                    SubmissionResult.textContent = 'Failed to add member: ' + (error && error.message ? error.message : error);
                    console.error('Add member failed:', error);
                };

                if(positionInput.value === 'RegularMember') {
                    // 注意：api.js 中导出的是 fetchAddMember
                    api.fetchAddRegularMember(memberData)
                        .then(() => {
                            onSuccess('Regular member added successfully!');
                            refreshMemberList();
                        })
                        .catch(onError);
                }
                if(positionInput.value === 'SectionHead') {
                    api.fetchAddSectionHead(memberData)
                        .then(() => {
                            onSuccess('Section head added successfully!');
                            refreshMemberList();
                        })
                        .catch(onError);
                }
                if(positionInput.value === 'President') {
                    api.fetchAddPresident(memberData)
                        .then(() => {
                            onSuccess('President added successfully!');
                            refreshMemberList();
                        })
                        .catch(onError);
                }
                // 验证通过，执行提交逻辑
            }
        });
    }



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