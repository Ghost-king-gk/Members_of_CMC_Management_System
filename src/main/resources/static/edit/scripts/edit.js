import * as api from '../../menu/scripts/api.js';

const params = new URLSearchParams(window.location.search);
const memberId = params.get('id');

const form = document.getElementById('editMemberForm');
const submissionResultEl = document.getElementById('editSubmissionResult');
const cancelBtn = document.getElementById('cancelBtn');
const memberIdLabel = document.getElementById('memberIdLabel');
const memberStatusLabel = document.getElementById('memberStatusLabel');
const customSelect = document.getElementById('customPositionSelect');
const hiddenPositionInput = document.getElementById('position');

const nameInput = document.getElementById('name');
const studentIDInput = document.getElementById('studentID');
const phoneInput = document.getElementById('phoneNumber');
const emailInput = document.getElementById('email');
const interviewScoreInput = document.getElementById('interviewScore');
const internshipScoreInput = document.getElementById('internshipScore');
const salaryScoreInput = document.getElementById('salaryScore');

const emailErrorEl = document.getElementById('emailError');

function showError(message) {
    if (submissionResultEl) {
        submissionResultEl.textContent = message;
        submissionResultEl.style.color = '#fca5a5';
    }
}

function showSuccess(message) {
    if (submissionResultEl) {
        submissionResultEl.textContent = message;
        submissionResultEl.style.color = '#93c5fd';
    }
}

function setFieldError(inputEl, errorEl, message) {
    if (!inputEl || !errorEl) return;

    if (!message) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        inputEl.classList.remove('is-invalid');
        return;
    }

    errorEl.textContent = message;
    errorEl.style.display = 'block';
    inputEl.classList.add('is-invalid');
}

function validateEmailField() {
    if (!emailInput) return true;

    const value = emailInput.value.trim();
    if (!value) {
        setFieldError(emailInput, emailErrorEl, '');
        return true;
    }

    // Use the browser's built-in email validity check, but show our own message.
    if (!emailInput.checkValidity()) {
        setFieldError(emailInput, emailErrorEl, 'Please enter a valid email address.');
        return false;
    }

    setFieldError(emailInput, emailErrorEl, '');
    return true;
}

function initCustomSelect() {
    if (!customSelect || !hiddenPositionInput) return;
    const selectedDisplay = customSelect.querySelector('.select-selected');
    const itemsContainer = customSelect.querySelector('.select-items');
    const options = itemsContainer.querySelectorAll('div');

    const closeMenu = () => {
        itemsContainer.classList.add('select-hide');
        selectedDisplay.classList.remove('select-arrow-active');
    };

    selectedDisplay.addEventListener('click', (event) => {
        event.stopPropagation();
        const isClosed = itemsContainer.classList.contains('select-hide');
        closeMenu();
        if (isClosed) {
            itemsContainer.classList.remove('select-hide');
            selectedDisplay.classList.add('select-arrow-active');
        }
    });

    options.forEach((option) => {
        option.addEventListener('click', (event) => {
            event.stopPropagation();
            const value = option.getAttribute('data-value');
            hiddenPositionInput.value = value;
            selectedDisplay.textContent = option.textContent;
            closeMenu();
        });
    });

    document.addEventListener('click', closeMenu);
}

function setCustomSelectValue(value) {
    if (!customSelect || !hiddenPositionInput) return;
    const selectedDisplay = customSelect.querySelector('.select-selected');
    const options = customSelect.querySelectorAll('.select-items div');
    let matched = false;
    options.forEach((option) => {
        if (option.getAttribute('data-value') === value) {
            matched = true;
            hiddenPositionInput.value = value;
            selectedDisplay.textContent = option.textContent;
        }
    });
    if (!matched && options.length > 0) {
        const fallback = options[0];
        hiddenPositionInput.value = fallback.getAttribute('data-value');
        selectedDisplay.textContent = fallback.textContent;
    }
}

async function loadMember() {
    if (!memberId) {
        showError('Missing member id.');
        form?.querySelectorAll('input, button').forEach((node) => node.setAttribute('disabled', 'disabled'));
        return;
    }

    try {
        const member = await api.fetchMemberById(memberId);
        memberIdLabel.textContent = memberId;

        const probationValue = (member && typeof member.isProbation === 'boolean') ? member.isProbation
            : (member && typeof member.probation === 'boolean') ? member.probation
            : (member && typeof member.Probation === 'boolean') ? member.Probation
            : false;
        memberStatusLabel.textContent = probationValue ? 'Intern' : 'Official';
        memberStatusLabel.classList.remove('status-intern', 'status-official');
        memberStatusLabel.classList.add(probationValue ? 'status-intern' : 'status-official');

        nameInput.value = member.name || '';
        studentIDInput.value = member.studentID || '';
        phoneInput.value = member.phoneNumber || '';
        emailInput.value = member.email || '';
        interviewScoreInput.value = (member.interviewScore !== undefined && member.interviewScore !== null) ? member.interviewScore : '';
        internshipScoreInput.value = (member.internshipScore !== undefined && member.internshipScore !== null) ? member.internshipScore : '';
        salaryScoreInput.value = (member.salaryScore !== undefined && member.salaryScore !== null) ? member.salaryScore : '';

        const memberType = member.memberType || 'RegularMember';
        setCustomSelectValue(memberType);

        const probationRadios = document.querySelectorAll('input[name="isProbation"]');
        probationRadios.forEach((radio) => {
            radio.checked = (radio.value === 'true' && probationValue) || (radio.value === 'false' && !probationValue);
        });
    } catch (error) {
        console.error(error);
        showError(error && error.message ? error.message : 'Failed to load member.');
        form?.querySelectorAll('input, button').forEach((node) => node.setAttribute('disabled', 'disabled'));
    }
}

function collectFormData() {
    const selectedStatus = document.querySelector('input[name="isProbation"]:checked');
    const probation = selectedStatus ? selectedStatus.value === 'true' : false;

    return {
        name: nameInput.value.trim(),
        memberType: hiddenPositionInput.value,
        phoneNumber: phoneInput.value.trim() || null,
        email: emailInput.value.trim() || null,
        probation,
        isProbation: probation,
        interviewScore: interviewScoreInput.value !== '' ? Number(interviewScoreInput.value) : null,
        internshipScore: internshipScoreInput.value !== '' ? Number(internshipScoreInput.value) : null,
        salaryScore: salaryScoreInput.value !== '' ? Number(salaryScoreInput.value) : null
    };
}

function validateForm() {
    if (!nameInput.value.trim()) {
        showError('Name is required.');
        nameInput.focus();
        return false;
    }

    if (!validateEmailField()) {
        showError('Please fix the highlighted fields.');
        emailInput.focus();
        return false;
    }
    return true;
}

async function handleSubmit(event) {
    event.preventDefault();
    if (!memberId) return;
    if (!validateForm()) return;

    const payload = collectFormData();

    try {
        await api.updateMember(memberId, payload);
        await api.exportMembers();
        showSuccess('Saved successfully. Redirecting...');
        setTimeout(() => {
            window.location.href = '/menu/index.html';
        }, 800);
    } catch (error) {
        console.error(error);
        showError(error && error.message ? error.message : 'Failed to save member.');
    }
}

function handleCancel() {
    window.location.href = '/menu/index.html';
}

function bootstrap() {
    initCustomSelect();
    loadMember();
    form?.addEventListener('submit', handleSubmit);
    cancelBtn?.addEventListener('click', handleCancel);

    // Live validate email so users see the styled message.
    emailInput?.addEventListener('input', validateEmailField);
    emailInput?.addEventListener('blur', validateEmailField);
}

bootstrap();
