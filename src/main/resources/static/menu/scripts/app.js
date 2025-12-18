/**
 * Main Application Controller
 * Responsible for:
 * 1. Initializing the application
 * 2. Binding event listeners
 * 3. Coordinating API calls and UI updates
 * 4. Managing application state
 */

import * as api from './api.js';
import * as ui from './ui.js';
import { debounce } from './utils.js';

// State
let currentFilteredMembers = [];
let activePopoverCloser = null;

// --- Initialization ---
export async function init() {
    await ui.loadTemplates();
    await refreshMemberList();
    bindGlobalEvents();
    initFilterSelector();
}

// --- Event Binding ---
function bindGlobalEvents() {
    // Add Member Button
    const addBtn = document.getElementById('addMemberBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            ui.renderAddMemberForm();
            bindAddMemberFormEvents();
        });
    }

    // Member List Click Delegation
    const memberList = document.getElementById('memberList');
    if (memberList) {
        memberList.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (btn && btn.dataset.id) {
                await handleMemberClick(btn.dataset.id);
            }
        });
    }
}

// --- Logic Handlers ---

async function refreshMemberList() {
    try {
        const members = await api.fetchMemberList();
        currentFilteredMembers = members; // Default state
        ui.renderMembersSequentially(members);
    } catch (error) {
        console.error(error);
        ui.showError('Failed to load members');
    }
}

async function handleMemberClick(id) {
    try {
        const member = await api.fetchMemberById(id);
        ui.renderMemberDetails(member);
        bindMemberDetailEvents(member);
    } catch (error) {
        console.error(error);
        alert('Failed to load member details');
    }
}

// --- Filter Logic ---
function initFilterSelector() {
    const selector = document.getElementById('filterSelector');
    const selectedDisplay = selector.querySelector('.sidebar__filter-selector-selected');
    const itemsContainer = selector.querySelector('.sidebar__filter-selector-options');
    const options = itemsContainer.querySelectorAll('div');
    const label = document.getElementById('filterConditionLabel');
    const input = document.getElementById('filterInput');
    
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    const regularizeContainer = document.getElementById('regularizeContainer');
    const regularizeBtn = document.getElementById('regularizeBtn');
    const regularizePopover = document.getElementById('regularizePopover');
    const cancelRegularizeBtn = document.getElementById('cancelRegularizeBtn');
    const confirmRegularizeBtn = document.getElementById('confirmRegularizeBtn');
    const regularizeResult = document.getElementById('regularize-result');

    // Toggle Dropdown
    selectedDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        itemsContainer.classList.toggle('sidebar__filter-selector-hide');
        selectedDisplay.classList.toggle('open');
    });

    // Close Dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!selector.contains(e.target)) {
            itemsContainer.classList.add('sidebar__filter-selector-hide');
            selectedDisplay.classList.remove('open');
        }
    });

    // Option Click
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;

            label.textContent = text;

            // Reset UI State
            selector.classList.remove('compact');
            input.classList.remove('show');
            input.value = '';
            searchContainer.classList.remove('show');
            searchInput.value = '';
            regularizeContainer.classList.remove('show');
            regularizePopover.hidden = true;

            // Handle Special Cases
            if (value === 'InternScore>') {
                selector.classList.add('compact');
                input.classList.add('show');
                input.focus();
                regularizeContainer.classList.add('show');
            } else if (value.startsWith('SearchBy')) {
                searchContainer.classList.add('show');
                searchInput.focus();
                if (value === 'SearchByName') searchInput.placeholder = 'Enter Name...';
                else if (value === 'SearchByID') searchInput.placeholder = 'Enter ID...';
                else if (value === 'SearchByStudentID') searchInput.placeholder = 'Enter Student ID...';
            }

            // Close Dropdown
            itemsContainer.classList.add('sidebar__filter-selector-hide');
            selectedDisplay.classList.remove('open');

            // Trigger Filter (if not waiting for input)
            if (!value.startsWith('SearchBy')) {
                applyFilter(value, input.value);
            }
        });
    });

    // Input Listeners
    const debouncedFilter = debounce(() => {
        if (label.textContent === 'InternScore >') {
            applyFilter('InternScore>', input.value);
        }
    }, 500);

    input.addEventListener('input', debouncedFilter);

    // Search Listeners
    const triggerSearch = () => {
        const currentFilter = options[Array.from(options).findIndex(opt => opt.textContent === label.textContent)]?.dataset.value;
        if (currentFilter && searchInput.value.trim()) {
            applyFilter(currentFilter, searchInput.value);
        }
    };

    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') triggerSearch();
    });

    // Regularize Listeners
    regularizeBtn.addEventListener('click', () => {
        regularizePopover.hidden = false;
        regularizeResult.textContent = '';
    });

    cancelRegularizeBtn.addEventListener('click', () => {
        regularizePopover.hidden = true;
    });

    confirmRegularizeBtn.addEventListener('click', async () => {
        if (!currentFilteredMembers || currentFilteredMembers.length === 0) {
            regularizeResult.textContent = 'No members to regularize.';
            regularizeResult.style.color = '#ef4444';
            return;
        }

        regularizeResult.textContent = 'Processing...';
        regularizeResult.style.color = '#fbbf24';
        confirmRegularizeBtn.disabled = true;

        try {
            for (const member of currentFilteredMembers) {
                await api.regularizeMember(member.id);
            }
            regularizeResult.textContent = 'Done!';
            regularizeResult.style.color = '#4ade80';
            
            setTimeout(() => {
                regularizePopover.hidden = true;
                confirmRegularizeBtn.disabled = false;
                applyFilter('InternScore>', input.value); 
            }, 1000);
        } catch (e) {
            console.error(e);
            regularizeResult.textContent = 'Error: ' + e.message;
            regularizeResult.style.color = '#ef4444';
            confirmRegularizeBtn.disabled = false;
        }
    });
}

async function applyFilter(filterType, filterValue) {
    // ui.showLoading(); // Optional
    try {
        let members = [];
        switch (filterType) {
            case 'All': members = await api.fetchMemberList(); break;
            case 'Official': members = await api.fetchMemberByIsProbation(false); break;
            case 'Intern': members = await api.fetchMemberByIsProbation(true); break;
            case 'InternScore>':
                if (!filterValue || isNaN(filterValue)) return;
                members = await api.fetchMemberByInternshipScoreGreaterThan(filterValue);
                break;
            case 'President':
            case 'SectionHead':
            case 'RegularMember':
                members = await api.fetchMembersByPosition(filterType);
                break;
            case 'SearchByName':
                if (!filterValue?.trim()) return;
                members = await api.fetchMemberByName(filterValue.trim());
                break;
            case 'SearchByID':
                if (!filterValue?.trim()) return;
                try {
                    const m = await api.fetchMemberById(filterValue.trim());
                    members = m ? [m] : [];
                } catch { members = []; }
                break;
            case 'SearchByStudentID':
                if (!filterValue?.trim()) return;
                try {
                    const m = await api.fetchMemberByStudentID(filterValue.trim());
                    members = m ? [m] : [];
                } catch { members = []; }
                break;
            default:
                console.warn('Unknown filter:', filterType);
                return;
        }
        
        currentFilteredMembers = members;
        ui.renderMembersSequentially(members);
    } catch (error) {
        console.error(error);
        ui.showError(error.message);
    }
}

// --- Form & Detail Events ---

function bindAddMemberFormEvents() {
    const form = document.getElementById('addMemberForm');
    if (!form) return;

    // Custom Select Logic
    const customSelect = document.getElementById('customPositionSelect');
    const hiddenInput = document.getElementById('position');
    if (customSelect && hiddenInput) {
        const display = customSelect.querySelector('.select-selected');
        const items = customSelect.querySelector('.select-items');
        
        display.addEventListener('click', (e) => {
            e.stopPropagation();
            items.classList.toggle('select-hide');
            display.classList.toggle('select-arrow-active');
        });

        items.querySelectorAll('div').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                display.textContent = opt.textContent;
                hiddenInput.value = opt.dataset.value;
                items.classList.add('select-hide');
                display.classList.remove('select-arrow-active');
            });
        });

        document.addEventListener('click', () => {
            items.classList.add('select-hide');
            display.classList.remove('select-arrow-active');
        });
    }

    // Submit Logic
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // Manual construction because of custom logic (checkboxes, numbers)
        const data = {
            name: formData.get('name'),
            studentID: formData.get('studentID'),
            memberType: formData.get('position'),
            email: formData.get('email'),
            phoneNumber: formData.get('phoneNumber'),
            isProbation: document.querySelector('input[name="isProbation"]:checked')?.value === 'true',
            interviewScore: formData.get('interviewScore') || null,
            internshipScore: formData.get('internshipScore') || null,
            salaryScore: formData.get('salaryScore') || null
        };

        const resultEl = document.getElementById('SubmissionResult');
        try {
            await api.createMember(data);
            await api.exportMembers();
            if (resultEl) resultEl.textContent = 'Member created.';
            await refreshMemberList();
        } catch (error) {
            const errorMessage = error && error.message ? error.message : String(error);
            if (resultEl) resultEl.textContent = 'Failed: ' + errorMessage;
            
            // Helper to highlight input
            const highlightInput = (id) => {
                const input = document.getElementById(id);
                if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.classList.add('input-error');
                    setTimeout(() => input.classList.remove('input-error'), 1000);
                }
            };

            // Check for specific errors
            if (errorMessage.includes("Name cannot be null or empty")) {
                highlightInput('name');
            }
            if (errorMessage.includes("StudentID") || errorMessage.includes("studentID")) {
                highlightInput('studentID');
            }
            if (errorMessage.includes("Interview Score") || errorMessage.includes("Interview score")) {
                highlightInput('interviewScore');
            }
            if (errorMessage.includes("Internship Score") || errorMessage.includes("Internship score")) {
                highlightInput('internshipScore');
            }
            if (errorMessage.includes("Salary Score") || errorMessage.includes("Salary score")) {
                highlightInput('salaryScore');
            }
        }
    });
}

function bindMemberDetailEvents(member) {
    const container = document.getElementById('memberContent');
    
    // Edit Button
    const editBtn = container.querySelector('[data-action="toggle-edit"]');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = `/edit/index.html?id=${encodeURIComponent(member.id)}`;
        });
    }

    // Helper for Popovers
    const bindPopover = (type, apiFunc, successMsg) => {
        const toggle = container.querySelector(`[data-action="toggle-${type}"]`);
        const popover = container.querySelector(`[data-role="${type}-popover"]`);
        const cancel = container.querySelector(`[data-action="cancel-${type}"]`);
        const confirm = container.querySelector(`[data-action="confirm-${type}"]`);
        const result = document.getElementById(`${type}-result`);

        if (!toggle || !popover) return;

        const close = () => {
            popover.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            if (activePopoverCloser === close) activePopoverCloser = null;
        };

        const open = () => {
            if (activePopoverCloser) activePopoverCloser();
            popover.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            activePopoverCloser = close;
        };

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            popover.hidden ? open() : close();
        });

        if (cancel) cancel.addEventListener('click', (e) => { e.stopPropagation(); close(); });

        if (confirm) {
            confirm.addEventListener('click', async (e) => {
                e.stopPropagation();
                confirm.disabled = true;
                try {
                    await apiFunc(member.id);
                    await api.exportMembers();
                    await refreshMemberList();
                    
                    if (result) {
                        result.textContent = successMsg;
                        result.style.color = '#4ade80';
                    }
                    
                    if (type === 'delete') {
                        close();
                        ui.renderDeletedState();
                    } else {
                        await new Promise(r => setTimeout(r, 800));
                        close();
                        // Refresh details
                        const updated = await api.fetchMemberById(member.id);
                        ui.renderMemberDetails(updated);
                        bindMemberDetailEvents(updated); // Rebind events for new DOM
                    }
                } catch (err) {
                    if (result) {
                        result.textContent = 'Failed: ' + err.message;
                        result.style.color = '#ef4444';
                    }
                    confirm.disabled = false;
                }
            });
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !popover.hidden) close();
        });
    };

    bindPopover('promote', api.promoteMember, 'Promoted successfully.');
    bindPopover('demote', api.demoteMember, 'Demoted successfully.');
    bindPopover('delete', api.deleteMember, 'Deleted.');
}
