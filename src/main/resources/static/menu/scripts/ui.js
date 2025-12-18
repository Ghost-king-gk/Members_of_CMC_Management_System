/**
 * UI Rendering and DOM Manipulation Module
 * Responsible for:
 * 1. Generating HTML from templates
 * 2. Updating the DOM
 * 3. Managing visual states (loading, errors)
 * 4. Handling animations
 */

import { fillTemplate } from './utils.js';

// --- Templates ---
let memberDetailTemplate = null;
let addMemberFormTemplate = null;
const EMPTY_TEMPLATE_CONTENT = '<section class="content__card"><h2>No data</h2></section>';

// --- Template Loading ---
export async function loadTemplates() {
    try {
        const [detailRes, formRes] = await Promise.all([
            fetch('./templates/member_detail.html'),
            fetch('./templates/add_member_form.html')
        ]);

        if (detailRes.ok) memberDetailTemplate = await detailRes.text();
        if (formRes.ok) addMemberFormTemplate = await formRes.text();
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

// --- Member List Rendering ---
export function renderMemberButton(member, container) {
    const listItem = document.createElement('li');
    listItem.className = 'member-item';

    const button = document.createElement('button');
    button.textContent = member.name;
    button.dataset.id = member.id;

    listItem.style.opacity = '0';
    listItem.style.animationFillMode = 'forwards';

    listItem.appendChild(button);
    container.appendChild(listItem);
}

export function renderMembersSequentially(members, containerId = 'memberList') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // Clear list
    
    if (!members || members.length === 0) {
        container.innerHTML = '<li style="color:#aaa; padding:12px; text-align:center;">No members found</li>';
        return;
    }

    let i = 0;
    function step() {
        if (i >= members.length) return;
        renderMemberButton(members[i], container);
        i += 1;
        setTimeout(step, 120);
    }
    step();
}

export function showLoading(containerId = 'memberList') {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<li style="color:#aaa; padding:10px;">Loading...</li>';
}

export function showError(message, containerId = 'memberList') {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = `<li style="color:#ef4444; padding:10px;">Error: ${message}</li>`;
}

// --- Content Area Rendering ---
export function renderMemberDetails(member, containerId = 'memberContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!memberDetailTemplate) {
        container.innerHTML = EMPTY_TEMPLATE_CONTENT;
        return;
    }

    // Prepare ViewModel
    const probation = Boolean(
        (member && typeof member.isProbation === 'boolean') ? member.isProbation :
        (member && typeof member.probation === 'boolean') ? member.probation :
        false
    );
    
    const interviewScore = member.interviewScore || 0;
    const internshipScore = member.internshipScore || 0;
    const salaryScore = member.salaryScore || 0;

    const viewModel = {
        name: member.name || '',
        id: member.id || '',
        studentID: member.studentID || '',
        statusText: probation ? 'Intern' : 'Official',
        statusClass: probation ? 'status-intern' : 'status-official',
        position: member.memberType || '',
        phoneNumber: member.phoneNumber || 'N/A',
        email: member.email || 'N/A',
        joinDate: member.joinDate || '',
        interviewScore: interviewScore,
        interviewMax: 15,
        interviewPercent: Math.min((interviewScore / 15) * 100, 100),
        internshipScore: internshipScore,
        internshipMax: 20,
        internshipPercent: Math.min((internshipScore / 20) * 100, 100),
        salaryScore: salaryScore,
        salaryMax: 5500,
        salaryPercent: Math.min((salaryScore / 5500) * 100, 100)
    };

    container.innerHTML = fillTemplate(memberDetailTemplate, viewModel);
}

export function renderAddMemberForm(containerId = 'memberContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!addMemberFormTemplate) {
        container.innerHTML = '<div class="error">Form template not loaded</div>';
        return;
    }
    container.innerHTML = addMemberFormTemplate;
}

export function renderEmptyState(containerId = 'memberContent') {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<section class="content__card"><h2>Select a member</h2></section>';
}

export function renderDeletedState(containerId = 'memberContent') {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<section class="content__card"><h2>Member deleted</h2><p>Please select a member from the left.</p></section>';
}

// --- UI Helpers ---
export function toggleElement(element, show) {
    if (!element) return;
    if (show) {
        element.classList.remove('sidebar__filter-selector-hide');
        element.hidden = false;
    } else {
        element.classList.add('sidebar__filter-selector-hide');
        element.hidden = true;
    }
}

export function toggleClass(element, className, add) {
    if (!element) return;
    if (add) element.classList.add(className);
    else element.classList.remove(className);
}
