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



// 缓存成员详情模板内容
let memberDetailTemplate = null;

// 异步加载成员详情模板函数（与添加成员表单的写法保持一致）
async function loadMemberDetailTemplate() {
    if (memberDetailTemplate) return memberDetailTemplate;
    try {
        const response = await fetch('./templates/member_detail.html');
        if (!response.ok) throw new Error('Failed to load member detail template');
        memberDetailTemplate = await response.text();
        return memberDetailTemplate;
    } catch (error) {
        console.error('Error loading template:', error);
        return '<div class="error">Error loading template</div>';
    }
}

const EMPTY_TEMPLATE_CONTENT = '<section class="content__card"><h2>No data</h2></section>';

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function fillMemberDetailTemplate(template, model) {
    if (!template) return EMPTY_TEMPLATE_CONTENT;
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(model, key) && model[key] !== undefined && model[key] !== null) {
            return escapeHtml(model[key]);
        }
        return '';
    });
}

async function renderMemberDetails(member) {
    /* 渲染成员详情 */
    const contentContainer = document.getElementById('memberContent');
    
    // 1) 确保模板已加载（与 add member form 一样：直接 innerHTML 注入）
    const template = await loadMemberDetailTemplate();

    const probation = Boolean(
        (member && typeof member.isProbation === 'boolean') ? member.isProbation :
        (member && typeof member.probation === 'boolean') ? member.probation :
        (member && typeof member.Probation === 'boolean') ? member.Probation :
        false
    );
    const statusText = probation ? 'Intern' : 'Official';
    const statusClass = probation ? 'status-intern' : 'status-official';

    const interviewScore = (member && typeof member.interviewScore === 'number') ? member.interviewScore : 0;
    const interviewMax = 15;
    const interviewPercent = Math.min((interviewScore / interviewMax) * 100, 100);

    const internshipScore = (member && typeof member.internshipScore === 'number') ? member.internshipScore : 0;
    const internshipMax = 20;
    const internshipPercent = Math.min((internshipScore / internshipMax) * 100, 100);

    const salaryScore = (member && typeof member.salaryScore === 'number') ? member.salaryScore : 0;
    const salaryMax = 5500;
    const salaryPercent = Math.min((salaryScore / salaryMax) * 100, 100);

    const id = (member && member.id !== undefined && member.id !== null) ? String(member.id) : '';
    const name = (member && member.name) ? member.name : '';

    const viewModel = {
        name,
        id,
        studentID: (member && member.studentID) ? member.studentID : '',
        statusText,
        statusClass,
        position: (member && member.memberType) ? member.memberType : '',
        phoneNumber: (member && member.phoneNumber) ? member.phoneNumber : 'N/A',
        email: (member && member.email) ? member.email : 'N/A',
        joinDate: (member && member.joinDate) ? member.joinDate : '',
        interviewScore: interviewScore.toString(),
        interviewMax: interviewMax.toString(),
        interviewPercent: interviewPercent.toString(),
        internshipScore: internshipScore.toString(),
        internshipMax: internshipMax.toString(),
        internshipPercent: internshipPercent.toString(),
        salaryScore: salaryScore.toString(),
        salaryMax: salaryMax.toString(),
        salaryPercent: salaryPercent.toString(),
        nameWithId: id ? `${name} (ID: ${id})` : name
    };

    contentContainer.innerHTML = fillMemberDetailTemplate(template, viewModel);

    const editBtn = contentContainer.querySelector('[data-action="edit-member"]');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (!id) return;
            window.location.href = `/edit/index.html?id=${encodeURIComponent(id)}`;
        });
    }

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
                    await api.deleteMember(member.id);
                    console.log('Member has been deleted:', member.id);
                    await api.exportMembers();

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
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phoneNumber');
    const interviewScoreInput = document.getElementById('interviewScore');
    const internshipScoreInput = document.getElementById('internshipScore');
    const salaryScoreInput = document.getElementById('salaryScore');
    const submissionResult = document.getElementById('SubmissionResult');
    

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
                const memberData = {
                    name: nameInput.value.trim(),
                    studentID: studentIDInput && studentIDInput.value.trim() ? studentIDInput.value.trim() : null,
                    memberType: positionInput && positionInput.value ? positionInput.value : 'RegularMember',
                    email: emailInput && emailInput.value.trim() ? emailInput.value.trim() : null,
                    phoneNumber: phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : null,
                    isProbation: (() => {
                        const checked = contentContainer.querySelector('input[name="isProbation"]:checked');
                        if (!checked) return null;
                        return checked.value === 'true';
                    })(),
                    interviewScore: interviewScoreInput && interviewScoreInput.value !== '' ? Number(interviewScoreInput.value) : null,
                    internshipScore: internshipScoreInput && internshipScoreInput.value !== '' ? Number(internshipScoreInput.value) : null,
                    salaryScore: salaryScoreInput && salaryScoreInput.value !== '' ? Number(salaryScoreInput.value) : null
                };

                try {
                    await api.createMember(memberData);
                    await api.exportMembers();
                    if (submissionResult) submissionResult.textContent = 'Member created.';
                    await refreshMemberList();
                } catch (error) {
                    if (submissionResult) {
                        submissionResult.textContent = 'Failed to add member: ' + (error && error.message ? error.message : error);
                    }
                    console.error('Add member failed:', error);
                }
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