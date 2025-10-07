// CAT Mock Test Performance Tracker - Multi-User System JavaScript

// Application state
let currentUser = null;
let mockTests = {};
let users = {};
let nextId = 1;
let sortColumn = '';
let sortDirection = 'asc';
let deleteTarget = null;

// Default users and sample data from application_data_json
const defaultUsers = {
    "admin": {
        "password": "admin123",
        "role": "admin",
        "name": "System Administrator",
        "createdDate": "2025-08-29"
    },
    "student1": {
        "password": "pass123",
        "role": "student", 
        "name": "Rahul Sharma",
        "createdDate": "2025-08-29"
    },
    "student2": {
        "password": "pass456",
        "role": "student",
        "name": "Priya Patel", 
        "createdDate": "2025-08-29"
    },
    "student3": {
        "password": "pass789",
        "role": "student",
        "name": "Amit Kumar",
        "createdDate": "2025-08-29"
    }
};

const sampleMockTestData = {
    "student1": [
        {
            "id": 1,
            "mockName": "TIME Mock Test 1",
            "totalScore": 89,
            "overallPercentile": 96.5,
            "negativeMarks": 8,
            "accuracy": 78.2,
            "varcMarks": 32,
            "varcPercentile": 94.2,
            "lrdiMarks": 28,
            "lrdiPercentile": 97.8,
            "qaMarks": 29,
            "qaPercentile": 95.1,
            "testDate": "2025-08-15"
        },
        {
            "id": 2,
            "mockName": "IMS Mock Test 2", 
            "totalScore": 76,
            "overallPercentile": 92.3,
            "negativeMarks": 12,
            "accuracy": 71.5,
            "varcMarks": 28,
            "varcPercentile": 91.2,
            "lrdiMarks": 22,
            "lrdiPercentile": 89.4,
            "qaMarks": 26,
            "qaPercentile": 94.7,
            "testDate": "2025-08-20"
        }
    ],
    "student2": [
        {
            "id": 1,
            "mockName": "Career Launcher Mock 1",
            "totalScore": 68,
            "overallPercentile": 87.2,
            "negativeMarks": 15,
            "accuracy": 65.4,
            "varcMarks": 24,
            "varcPercentile": 85.6,
            "lrdiMarks": 20,
            "lrdiPercentile": 82.1,
            "qaMarks": 24,
            "qaPercentile": 89.8,
            "testDate": "2025-08-18"
        }
    ],
    "student3": [
        {
            "id": 1,
            "mockName": "Unacademy Mock 1",
            "totalScore": 54,
            "overallPercentile": 78.9,
            "negativeMarks": 18,
            "accuracy": 58.7,
            "varcMarks": 18,
            "varcPercentile": 76.4,
            "lrdiMarks": 16,
            "lrdiPercentile": 74.2,
            "qaMarks": 20,
            "qaPercentile": 82.1,
            "testDate": "2025-08-22"
        }
    ]
};

// Performance benchmarks
const performanceBenchmarks = {
    excellent: { percentile: 99, score: 140 },
    good: { percentile: 95, score: 100 },
    average: { percentile: 85, score: 70 },
    needsImprovement: { percentile: 70, score: 50 }
};

// Chart instances
let trendsChart = null;
let sectionsChart = null;
let adminClassChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    console.log('Initializing multi-user system...');
    
    // Initialize data from localStorage or defaults
    loadData();
    
    // Check if user is already logged in
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (users[parsedUser.userId]) {
                currentUser = parsedUser;
                console.log('Restored user session:', currentUser);
                showMainApp();
                return;
            }
        }
    } catch (e) {
        console.log('No valid saved session');
        localStorage.removeItem('currentUser');
    }
    
    // Show login screen
    showLoginScreen();
    
    console.log('App initialized with', Object.keys(users).length, 'users');
}

function loadData() {
    try {
        // Load users
        const storedUsers = localStorage.getItem('catTracker_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            console.log('Loaded users from storage:', Object.keys(users));
        } else {
            users = { ...defaultUsers };
            console.log('Using default users');
        }
        
        // Load mock tests
        const storedMockTests = localStorage.getItem('catTracker_mockTests');
        if (storedMockTests) {
            mockTests = JSON.parse(storedMockTests);
            console.log('Loaded mock tests from storage');
        } else {
            mockTests = { ...sampleMockTestData };
            console.log('Using sample mock test data');
        }
        
        // Calculate next ID
        let maxId = 0;
        Object.values(mockTests).forEach(userTests => {
            if (Array.isArray(userTests)) {
                userTests.forEach(test => {
                    if (test.id > maxId) maxId = test.id;
                });
            }
        });
        nextId = maxId + 1;
        
        // Save initial data if not already stored
        saveData();
        
    } catch (error) {
        console.error('Error loading data:', error);
        users = { ...defaultUsers };
        mockTests = { ...sampleMockTestData };
        nextId = 3;
    }
}

function saveData() {
    try {
        localStorage.setItem('catTracker_users', JSON.stringify(users));
        localStorage.setItem('catTracker_mockTests', JSON.stringify(mockTests));
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener attached');
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Mock test form
    const mockForm = document.getElementById('mock-form');
    if (mockForm) {
        mockForm.addEventListener('submit', handleMockTestSubmit);
    }
    
    // Add user form
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetMockForm);
    }
    
    // Search inputs
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    const adminSearchInput = document.getElementById('admin-search-input');
    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', handleAdminSearch);
    }
    
    // Student filter
    const studentFilter = document.getElementById('student-filter');
    if (studentFilter) {
        studentFilter.addEventListener('change', handleStudentFilter);
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-csv');
    const adminExportAllBtn = document.getElementById('admin-export-all');
    const adminExportFilteredBtn = document.getElementById('admin-export-filtered');
    
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => exportStudentData());
    }
    
    if (adminExportAllBtn) {
        adminExportAllBtn.addEventListener('click', () => exportAllData());
    }
    
    if (adminExportFilteredBtn) {
        adminExportFilteredBtn.addEventListener('click', () => exportFilteredData());
    }
    
    // Modal handlers
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideDeleteModal);
    }
    
    console.log('Event listeners set up complete');
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value.trim();
    
    console.log('Login attempt for userId:', userId);
    
    const loginError = document.getElementById('login-error');
    
    // Clear previous errors
    loginError.classList.add('hidden');
    loginError.textContent = '';
    
    // Basic validation
    if (!userId || !password) {
        showLoginError('Please enter both User ID and Password');
        return;
    }
    
    // Check if user exists
    if (!users[userId]) {
        console.log('User not found:', userId);
        console.log('Available users:', Object.keys(users));
        showLoginError('User ID not found');
        return;
    }
    
    // Check password
    if (users[userId].password !== password) {
        console.log('Password mismatch for user:', userId);
        showLoginError('Invalid password');
        return;
    }
    
    // Set current user
    currentUser = {
        userId: userId,
        name: users[userId].name,
        role: users[userId].role
    };
    
    console.log('Login successful:', currentUser);
    
    // Save session and show main app
    saveData();
    showMainApp();
}

function showLoginError(message) {
    const loginError = document.getElementById('login-error');
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove('hidden');
        console.log('Login error shown:', message);
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    console.log('Logging out user:', currentUser?.userId);
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    showLoginScreen();
}

function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
    
    // Clear login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
    
    console.log('Login screen displayed');
}

function showMainApp() {
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    
    if (loginScreen) loginScreen.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');
    
    // Update header
    const userNameEl = document.getElementById('user-name');
    const userRoleBadgeEl = document.getElementById('user-role-badge');
    
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userRoleBadgeEl) userRoleBadgeEl.textContent = currentUser.role.toUpperCase();
    
    // Show appropriate navigation
    const adminNav = document.getElementById('admin-nav');
    const studentNav = document.getElementById('student-nav');
    
    if (currentUser.role === 'admin') {
        if (adminNav) adminNav.classList.remove('hidden');
        if (studentNav) studentNav.classList.add('hidden');
        switchTab('admin-dashboard');
    } else {
        if (studentNav) studentNav.classList.remove('hidden');
        if (adminNav) adminNav.classList.add('hidden');
        switchTab('student-dashboard');
    }
    
    // Set default test date
    const testDateInput = document.getElementById('testDate');
    if (testDateInput) {
        const today = new Date().toISOString().split('T')[0];
        testDateInput.value = today;
    }
    
    updateAllDisplays();
    console.log('Main app displayed for:', currentUser.name);
}

// Navigation Functions
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update displays for specific tabs
        setTimeout(() => {
            if (tabName === 'student-dashboard') {
                updateStudentDashboard();
            } else if (tabName === 'admin-dashboard') {
                updateAdminDashboard();
            } else if (tabName === 'records') {
                updateRecordsDisplay();
            } else if (tabName === 'analytics') {
                updateAnalytics();
            } else if (tabName === 'admin-analytics') {
                updateAdminAnalytics();
            } else if (tabName === 'all-students') {
                updateAllStudentsDisplay();
            } else if (tabName === 'user-management') {
                updateUserManagement();
            } else if (tabName === 'profile') {
                updateProfile();
            }
        }, 50);
    } else {
        console.error('Section not found:', `${tabName}-section`);
    }
}

function updateAllDisplays() {
    setTimeout(() => {
        if (currentUser.role === 'student') {
            updateStudentDashboard();
            updateRecordsDisplay();
            updateAnalytics();
            updateProfile();
        } else {
            updateAdminDashboard();
            updateUserManagement();
            updateAllStudentsDisplay();
            updateAdminAnalytics();
        }
    }, 100);
}

// Student Functions
function updateStudentDashboard() {
    if (currentUser.role !== 'student') return;
    
    const userTests = mockTests[currentUser.userId] || [];
    
    // Update stats
    const totalTests = userTests.length;
    const avgScore = totalTests > 0 ? 
        (userTests.reduce((sum, test) => sum + test.totalScore, 0) / totalTests).toFixed(1) : '--';
    const bestPercentile = totalTests > 0 ? 
        Math.max(...userTests.map(test => test.overallPercentile)).toFixed(1) + '%' : '--';
    
    let improvement = '--';
    if (totalTests >= 2) {
        const recent = userTests[userTests.length - 1];
        const previous = userTests[userTests.length - 2];
        const change = recent.overallPercentile - previous.overallPercentile;
        improvement = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    }
    
    const totalTestsEl = document.getElementById('student-total-tests');
    const avgScoreEl = document.getElementById('student-avg-score');
    const bestPercentileEl = document.getElementById('student-best-percentile');
    const improvementEl = document.getElementById('student-improvement');
    
    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (bestPercentileEl) bestPercentileEl.textContent = bestPercentile;
    if (improvementEl) improvementEl.textContent = improvement;
    
    // Update recent tests
    updateRecentTests();
}

function updateRecentTests() {
    const userTests = mockTests[currentUser.userId] || [];
    const recentTestsList = document.getElementById('recent-tests-list');
    
    if (!recentTestsList) return;
    
    if (userTests.length === 0) {
        recentTestsList.innerHTML = '<p class="text-secondary">No tests recorded yet. Add your first test to get started!</p>';
        return;
    }
    
    const recentTests = userTests.slice(-3).reverse();
    
    recentTestsList.innerHTML = recentTests.map(test => `
        <div class="recent-test-item">
            <div class="recent-test-name">${test.mockName}</div>
            <div class="recent-test-score">Score: ${test.totalScore} | Percentile: ${test.overallPercentile}% | ${formatDate(test.testDate)}</div>
        </div>
    `).join('');
}

function updateProfile() {
    if (currentUser.role !== 'student') return;
    
    const userTests = mockTests[currentUser.userId] || [];
    
    const profileNameEl = document.getElementById('profile-name');
    const profileUserIdEl = document.getElementById('profile-user-id');
    const profileCreatedDateEl = document.getElementById('profile-created-date');
    const profileTotalTestsEl = document.getElementById('profile-total-tests');
    
    if (profileNameEl) profileNameEl.textContent = currentUser.name;
    if (profileUserIdEl) profileUserIdEl.textContent = currentUser.userId;
    if (profileCreatedDateEl) profileCreatedDateEl.textContent = formatDate(users[currentUser.userId].createdDate);
    if (profileTotalTestsEl) profileTotalTestsEl.textContent = userTests.length;
}

// Admin Functions
function updateAdminDashboard() {
    if (currentUser.role !== 'admin') return;
    
    const students = Object.entries(users).filter(([_, user]) => user.role === 'student');
    const allTests = Object.values(mockTests).flat();
    
    const avgClassScore = allTests.length > 0 ? 
        (allTests.reduce((sum, test) => sum + test.totalScore, 0) / allTests.length).toFixed(1) : '--';
    
    let topPerformer = '--';
    if (allTests.length > 0) {
        const bestTest = allTests.reduce((best, test) => 
            test.overallPercentile > best.overallPercentile ? test : best
        );
        const studentId = Object.keys(mockTests).find(userId => 
            mockTests[userId] && mockTests[userId].some(test => test.id === bestTest.id)
        );
        if (studentId && users[studentId]) {
            topPerformer = users[studentId].name;
        }
    }
    
    const totalStudentsEl = document.getElementById('total-students');
    const totalAllTestsEl = document.getElementById('total-all-tests');
    const avgClassScoreEl = document.getElementById('avg-class-score');
    const topPerformerEl = document.getElementById('top-performer');
    
    if (totalStudentsEl) totalStudentsEl.textContent = students.length;
    if (totalAllTestsEl) totalAllTestsEl.textContent = allTests.length;
    if (avgClassScoreEl) avgClassScoreEl.textContent = avgClassScore;
    if (topPerformerEl) topPerformerEl.textContent = topPerformer;
}

function updateUserManagement() {
    if (currentUser.role !== 'admin') return;
    
    const students = Object.entries(users).filter(([_, user]) => user.role === 'student');
    const tbody = document.getElementById('users-table-body');
    
    if (!tbody) return;
    
    tbody.innerHTML = students.map(([userId, user]) => {
        const userTests = mockTests[userId] || [];
        return `
            <tr>
                <td>${userId}</td>
                <td>${user.name}</td>
                <td>${formatDate(user.createdDate)}</td>
                <td>${userTests.length}</td>
                <td>
                    <button class="edit-btn" onclick="editUser('${userId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteUser('${userId}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateAllStudentsDisplay() {
    if (currentUser.role !== 'admin') return;
    
    // Update student filter
    const studentFilter = document.getElementById('student-filter');
    if (studentFilter) {
        const students = Object.entries(users).filter(([_, user]) => user.role === 'student');
        
        studentFilter.innerHTML = '<option value="">All Students</option>' +
            students.map(([userId, user]) => `<option value="${userId}">${user.name}</option>`).join('');
    }
    
    // Display all tests
    displayAdminRecords();
}

function displayAdminRecords(filteredTests = null, studentFilter = '') {
    let allTests = [];
    
    if (studentFilter) {
        const userTests = mockTests[studentFilter] || [];
        allTests = userTests.map(test => ({ ...test, studentId: studentFilter }));
    } else {
        allTests = Object.entries(mockTests).flatMap(([userId, userTests]) => {
            if (Array.isArray(userTests)) {
                return userTests.map(test => ({ ...test, studentId: userId }));
            }
            return [];
        });
    }
    
    if (filteredTests !== null) {
        allTests = filteredTests;
    }
    
    const emptyState = document.getElementById('admin-empty-state');
    const tableContainer = document.getElementById('admin-records-table-container');
    const tbody = document.getElementById('admin-records-tbody');
    
    if (!emptyState || !tableContainer || !tbody) return;
    
    if (allTests.length === 0) {
        emptyState.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    
    tbody.innerHTML = allTests.map(test => `
        <tr>
            <td><strong>${users[test.studentId] ? users[test.studentId].name : 'Unknown'}</strong></td>
            <td>
                ${test.mockName}
                ${getPerformanceBadge(test.overallPercentile)}
            </td>
            <td>${formatDate(test.testDate)}</td>
            <td><strong>${test.totalScore}</strong></td>
            <td><strong>${test.overallPercentile}%</strong></td>
            <td>${test.accuracy}%</td>
            <td>
                <small>
                    V: ${test.varcMarks} (${test.varcPercentile}%)<br>
                    L: ${test.lrdiMarks} (${test.lrdiPercentile}%)<br>
                    Q: ${test.qaMarks} (${test.qaPercentile}%)
                </small>
            </td>
        </tr>
    `).join('');
}

function updateAdminAnalytics() {
    if (currentUser.role !== 'admin') return;
    
    updateAdminClassChart();
    updateTopPerformers();
}

function updateAdminClassChart() {
    const ctx = document.getElementById('admin-class-chart');
    if (!ctx) return;
    
    if (adminClassChart) {
        adminClassChart.destroy();
        adminClassChart = null;
    }
    
    const students = Object.entries(users).filter(([_, user]) => user.role === 'student');
    const studentData = students.map(([userId, user]) => {
        const userTests = mockTests[userId] || [];
        const avgScore = userTests.length > 0 ? 
            userTests.reduce((sum, test) => sum + test.totalScore, 0) / userTests.length : 0;
        return { name: user.name, avgScore: avgScore };
    });
    
    if (studentData.length === 0) return;
    
    adminClassChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: studentData.map(student => student.name),
            datasets: [{
                label: 'Average Score',
                data: studentData.map(student => student.avgScore),
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 204,
                    title: {
                        display: true,
                        text: 'Average Score'
                    }
                }
            }
        }
    });
}

function updateTopPerformers() {
    const allTests = Object.entries(mockTests).flatMap(([userId, userTests]) => {
        if (Array.isArray(userTests)) {
            return userTests.map(test => ({ ...test, studentId: userId }));
        }
        return [];
    });
    
    const topPerformersList = document.getElementById('top-performers-list');
    if (!topPerformersList) return;
    
    if (allTests.length === 0) {
        topPerformersList.innerHTML = '<p class="text-secondary">No test records available</p>';
        return;
    }
    
    const studentPerformance = {};
    allTests.forEach(test => {
        if (users[test.studentId]) {
            if (!studentPerformance[test.studentId]) {
                studentPerformance[test.studentId] = {
                    name: users[test.studentId].name,
                    bestPercentile: test.overallPercentile,
                    bestScore: test.totalScore
                };
            } else {
                if (test.overallPercentile > studentPerformance[test.studentId].bestPercentile) {
                    studentPerformance[test.studentId].bestPercentile = test.overallPercentile;
                    studentPerformance[test.studentId].bestScore = test.totalScore;
                }
            }
        }
    });
    
    const topPerformers = Object.values(studentPerformance)
        .sort((a, b) => b.bestPercentile - a.bestPercentile)
        .slice(0, 5);
    
    topPerformersList.innerHTML = topPerformers.map((performer, index) => `
        <div class="top-performer-item">
            <div class="performer-info">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-name">${performer.name}</div>
            </div>
            <div class="performer-score">${performer.bestPercentile}%</div>
        </div>
    `).join('');
}

// Mock Test Functions
function handleMockTestSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (submitBtn) submitBtn.classList.add('loading');
    if (btnText) btnText.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    
    const formData = new FormData(e.target);
    const mockTest = {
        id: nextId++,
        mockName: formData.get('mockName'),
        testDate: formData.get('testDate'),
        totalScore: parseFloat(formData.get('totalScore')),
        overallPercentile: parseFloat(formData.get('overallPercentile')),
        negativeMarks: parseFloat(formData.get('negativeMarks')),
        accuracy: parseFloat(formData.get('accuracy')),
        varcMarks: parseFloat(formData.get('varcMarks')),
        varcPercentile: parseFloat(formData.get('varcPercentile')),
        lrdiMarks: parseFloat(formData.get('lrdiMarks')),
        lrdiPercentile: parseFloat(formData.get('lrdiPercentile')),
        qaMarks: parseFloat(formData.get('qaMarks')),
        qaPercentile: parseFloat(formData.get('qaPercentile'))
    };
    
    setTimeout(() => {
        if (!mockTests[currentUser.userId]) {
            mockTests[currentUser.userId] = [];
        }
        mockTests[currentUser.userId].push(mockTest);
        
        saveData();
        updateAllDisplays();
        resetMockForm();
        showToast('Mock test added successfully!');
        
        if (submitBtn) submitBtn.classList.remove('loading');
        if (btnText) btnText.classList.remove('hidden');
        if (btnSpinner) btnSpinner.classList.add('hidden');
    }, 500);
}

function handleAddUser(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newUserId = formData.get('newUserId');
    const newPassword = formData.get('newPassword');
    const newName = formData.get('newName');
    
    if (users[newUserId]) {
        showToast('User ID already exists!', 'error');
        return;
    }
    
    users[newUserId] = {
        password: newPassword,
        role: 'student',
        name: newName,
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    mockTests[newUserId] = [];
    
    saveData();
    updateUserManagement();
    e.target.reset();
    showToast('Student added successfully!');
}

// Search and Filter Functions
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const userTests = mockTests[currentUser.userId] || [];
    
    if (!query) {
        updateRecordsDisplay();
        return;
    }
    
    const filteredTests = userTests.filter(test => 
        test.mockName.toLowerCase().includes(query) ||
        test.testDate.includes(query) ||
        test.totalScore.toString().includes(query)
    );
    
    updateRecordsDisplay(filteredTests);
}

function handleAdminSearch() {
    const searchInput = document.getElementById('admin-search-input');
    const studentFilter = document.getElementById('student-filter');
    if (!searchInput || !studentFilter) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const selectedStudent = studentFilter.value;
    
    let allTests = [];
    
    if (selectedStudent) {
        const userTests = mockTests[selectedStudent] || [];
        allTests = userTests.map(test => ({ ...test, studentId: selectedStudent }));
    } else {
        allTests = Object.entries(mockTests).flatMap(([userId, userTests]) => {
            if (Array.isArray(userTests)) {
                return userTests.map(test => ({ ...test, studentId: userId }));
            }
            return [];
        });
    }
    
    if (query) {
        allTests = allTests.filter(test => 
            test.mockName.toLowerCase().includes(query) ||
            (users[test.studentId] && users[test.studentId].name.toLowerCase().includes(query)) ||
            test.testDate.includes(query)
        );
    }
    
    displayAdminRecords(allTests);
}

function handleStudentFilter() {
    const studentFilter = document.getElementById('student-filter');
    if (!studentFilter) return;
    
    const selectedStudent = studentFilter.value;
    
    // Clear admin search
    const adminSearchInput = document.getElementById('admin-search-input');
    if (adminSearchInput) adminSearchInput.value = '';
    
    displayAdminRecords(null, selectedStudent);
}

// Display Functions
function updateRecordsDisplay(filteredTests = null) {
    if (currentUser.role !== 'student') return;
    
    const tests = filteredTests || mockTests[currentUser.userId] || [];
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.getElementById('records-table-container');
    const tbody = document.getElementById('records-tbody');
    
    if (!emptyState || !tableContainer || !tbody) return;
    
    if (tests.length === 0) {
        emptyState.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    
    tbody.innerHTML = tests.map(test => `
        <tr>
            <td>
                <strong>${test.mockName}</strong>
                ${getPerformanceBadge(test.overallPercentile)}
            </td>
            <td>${formatDate(test.testDate)}</td>
            <td><strong>${test.totalScore}</strong></td>
            <td><strong>${test.overallPercentile}%</strong></td>
            <td>${test.accuracy}%</td>
            <td>${test.varcMarks} (${test.varcPercentile}%)</td>
            <td>${test.lrdiMarks} (${test.lrdiPercentile}%)</td>
            <td>${test.qaMarks} (${test.qaPercentile}%)</td>
            <td>
                <button class="delete-btn" onclick="showDeleteModal(${test.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function updateAnalytics() {
    if (currentUser.role !== 'student') return;
    
    updateStatistics();
    updateTrendsChart();
    updateSectionsChart();
    updateInsights();
}

function updateStatistics() {
    const userTests = mockTests[currentUser.userId] || [];
    const totalTests = userTests.length;
    const avgScore = totalTests > 0 ? 
        (userTests.reduce((sum, test) => sum + test.totalScore, 0) / totalTests).toFixed(1) : '--';
    const bestPercentile = totalTests > 0 ? 
        Math.max(...userTests.map(test => test.overallPercentile)).toFixed(1) + '%' : '--';
    const avgAccuracy = totalTests > 0 ? 
        (userTests.reduce((sum, test) => sum + test.accuracy, 0) / totalTests).toFixed(1) + '%' : '--';
    
    const totalTestsEl = document.getElementById('total-tests');
    const avgScoreEl = document.getElementById('avg-score');
    const bestPercentileEl = document.getElementById('best-percentile');
    const avgAccuracyEl = document.getElementById('avg-accuracy');
    
    if (totalTestsEl) totalTestsEl.textContent = totalTests;
    if (avgScoreEl) avgScoreEl.textContent = avgScore;
    if (bestPercentileEl) bestPercentileEl.textContent = bestPercentile;
    if (avgAccuracyEl) avgAccuracyEl.textContent = avgAccuracy;
}

function updateTrendsChart() {
    const ctx = document.getElementById('trends-chart');
    if (!ctx) return;
    
    if (trendsChart) {
        trendsChart.destroy();
        trendsChart = null;
    }
    
    const userTests = mockTests[currentUser.userId] || [];
    
    if (userTests.length === 0) return;
    
    const sortedTests = [...userTests].sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    
    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedTests.map(test => formatDate(test.testDate)),
            datasets: [
                {
                    label: 'Overall Percentile',
                    data: sortedTests.map(test => test.overallPercentile),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Score',
                    data: sortedTests.map(test => test.totalScore),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentile'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    max: 204,
                    title: {
                        display: true,
                        text: 'Score'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function updateSectionsChart() {
    const ctx = document.getElementById('sections-chart');
    if (!ctx) return;
    
    if (sectionsChart) {
        sectionsChart.destroy();
        sectionsChart = null;
    }
    
    const userTests = mockTests[currentUser.userId] || [];
    
    if (userTests.length === 0) return;
    
    const avgVarcMarks = (userTests.reduce((sum, test) => sum + test.varcMarks, 0) / userTests.length).toFixed(1);
    const avgLrdiMarks = (userTests.reduce((sum, test) => sum + test.lrdiMarks, 0) / userTests.length).toFixed(1);
    const avgQaMarks = (userTests.reduce((sum, test) => sum + test.qaMarks, 0) / userTests.length).toFixed(1);
    
    const avgVarcPercentile = (userTests.reduce((sum, test) => sum + test.varcPercentile, 0) / userTests.length).toFixed(1);
    const avgLrdiPercentile = (userTests.reduce((sum, test) => sum + test.lrdiPercentile, 0) / userTests.length).toFixed(1);
    const avgQaPercentile = (userTests.reduce((sum, test) => sum + test.qaPercentile, 0) / userTests.length).toFixed(1);
    
    sectionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['VARC', 'LRDI', 'QA'],
            datasets: [
                {
                    label: 'Average Marks',
                    data: [avgVarcMarks, avgLrdiMarks, avgQaMarks],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Average Percentile',
                    data: [avgVarcPercentile, avgLrdiPercentile, avgQaPercentile],
                    backgroundColor: ['rgba(31, 184, 205, 0.3)', 'rgba(255, 193, 133, 0.3)', 'rgba(180, 65, 60, 0.3)'],
                    borderColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2,
                    yAxisID: 'y1',
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 72,
                    title: {
                        display: true,
                        text: 'Marks'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentile'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function updateInsights() {
    const container = document.getElementById('insights-container');
    if (!container) return;
    
    const userTests = mockTests[currentUser.userId] || [];
    
    if (userTests.length === 0) {
        container.innerHTML = `
            <div class="insight-item">
                <div class="insight-icon">💡</div>
                <div class="insight-text">Take more mock tests to see personalized insights</div>
            </div>
        `;
        return;
    }
    
    const insights = generateInsights(userTests);
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
}

function generateInsights(userTests) {
    const insights = [];
    const latest = userTests[userTests.length - 1];
    
    // Performance trend
    if (userTests.length >= 2) {
        const previous = userTests[userTests.length - 2];
        const scoreChange = latest.totalScore - previous.totalScore;
        
        if (scoreChange > 5) {
            insights.push({
                icon: '📈',
                text: `Great progress! Your score improved by ${scoreChange.toFixed(1)} points in your latest test.`
            });
        } else if (scoreChange < -5) {
            insights.push({
                icon: '📉',
                text: `Your score dropped by ${Math.abs(scoreChange).toFixed(1)} points. Focus on identifying weak areas.`
            });
        }
    }
    
    // Section analysis
    const sections = [
        { name: 'VARC', marks: 'varcMarks', percentile: 'varcPercentile' },
        { name: 'LRDI', marks: 'lrdiMarks', percentile: 'lrdiPercentile' },
        { name: 'QA', marks: 'qaMarks', percentile: 'qaPercentile' }
    ];
    
    const sectionAvgs = sections.map(section => ({
        name: section.name,
        avgPercentile: userTests.reduce((sum, test) => sum + test[section.percentile], 0) / userTests.length
    }));
    
    const strongest = sectionAvgs.reduce((max, section) => 
        section.avgPercentile > max.avgPercentile ? section : max
    );
    
    const weakest = sectionAvgs.reduce((min, section) => 
        section.avgPercentile < min.avgPercentile ? section : min
    );
    
    insights.push({
        icon: '💪',
        text: `<span class="insight-strong">${strongest.name}</span> is your strongest section with ${strongest.avgPercentile.toFixed(1)}% average percentile.`
    });
    
    if (weakest.avgPercentile < 80) {
        insights.push({
            icon: '⚠️',
            text: `Focus more on <span class="insight-weak">${weakest.name}</span> section. Your average percentile is ${weakest.avgPercentile.toFixed(1)}%.`
        });
    }
    
    // Accuracy insight
    const avgAccuracy = userTests.reduce((sum, test) => sum + test.accuracy, 0) / userTests.length;
    if (avgAccuracy < 75) {
        insights.push({
            icon: '🎯',
            text: `Your average accuracy is ${avgAccuracy.toFixed(1)}%. Focus on solving fewer questions with higher accuracy.`
        });
    } else if (avgAccuracy > 85) {
        insights.push({
            icon: '🎯',
            text: `Excellent accuracy of ${avgAccuracy.toFixed(1)}%! You can try attempting more questions.`
        });
    }
    
    return insights.length > 0 ? insights : [{
        icon: '📊',
        text: 'Keep taking more mock tests to get detailed performance insights.'
    }];
}

// Utility Functions
function getPerformanceBadge(percentile) {
    let badgeClass, badgeText;
    
    if (percentile >= performanceBenchmarks.excellent.percentile) {
        badgeClass = 'excellent';
        badgeText = 'Excellent';
    } else if (percentile >= performanceBenchmarks.good.percentile) {
        badgeClass = 'good';
        badgeText = 'Good';
    } else if (percentile >= performanceBenchmarks.average.percentile) {
        badgeClass = 'average';
        badgeText = 'Average';
    } else {
        badgeClass = 'needs-improvement';
        badgeText = 'Needs Work';
    }
    
    return `<span class="performance-badge ${badgeClass}">${badgeText}</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function validateForm() {
    const form = document.getElementById('mock-form');
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }
        
        if (input.type === 'number') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                showFieldError(input, 'Please enter a valid number');
                isValid = false;
                return;
            }
            
            if (!isNaN(min) && numValue < min) {
                showFieldError(input, `Value must be at least ${min}`);
                isValid = false;
                return;
            }
            
            if (!isNaN(max) && numValue > max) {
                showFieldError(input, `Value must not exceed ${max}`);
                isValid = false;
                return;
            }
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function resetMockForm() {
    const form = document.getElementById('mock-form');
    if (form) {
        form.reset();
        
        const today = new Date().toISOString().split('T')[0];
        const testDateInput = document.getElementById('testDate');
        if (testDateInput) {
            testDateInput.value = today;
        }
        
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.error-message').forEach(el => el.remove());
    }
}

function showDeleteModal(testId) {
    deleteTarget = testId;
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('show');
    }
}

function hideDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.classList.remove('show');
        setTimeout(() => {
            deleteModal.classList.add('hidden');
            deleteTarget = null;
        }, 250);
    }
}

function confirmDelete() {
    if (deleteTarget !== null) {
        const userTests = mockTests[currentUser.userId] || [];
        mockTests[currentUser.userId] = userTests.filter(test => test.id !== deleteTarget);
        
        saveData();
        updateAllDisplays();
        showToast('Mock test deleted successfully!');
        hideDeleteModal();
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 250);
        }, 3000);
    }
}

// Export Functions
function exportStudentData() {
    const userTests = mockTests[currentUser.userId] || [];
    if (userTests.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    const csvContent = createCSVContent(userTests, currentUser.name);
    downloadFile(csvContent, `${currentUser.userId}-mock-tests.csv`, 'text/csv');
    showToast('Data exported successfully!');
}

function exportAllData() {
    const allTests = Object.entries(mockTests).flatMap(([userId, userTests]) => {
        if (Array.isArray(userTests)) {
            return userTests.map(test => ({ ...test, studentName: users[userId].name, studentId: userId }));
        }
        return [];
    });
    
    if (allTests.length === 0) {
        showToast('No data to export', 'error');
        return;
    }
    
    const csvContent = createAdminCSVContent(allTests);
    downloadFile(csvContent, 'all-students-mock-tests.csv', 'text/csv');
    showToast('All data exported successfully!');
}

function exportFilteredData() {
    showToast('Filtered data export feature coming soon!');
}

function createCSVContent(tests, studentName) {
    const headers = [
        'Mock Test Name', 'Test Date', 'Total Score', 'Overall Percentile',
        'Negative Marks', 'Accuracy %', 'VARC Marks', 'VARC Percentile',
        'LRDI Marks', 'LRDI Percentile', 'QA Marks', 'QA Percentile'
    ];
    
    return [
        `CAT Mock Test Performance Data - ${studentName}`,
        `Generated on: ${new Date().toLocaleDateString()}`,
        '',
        headers.join(','),
        ...tests.map(test => [
            `"${test.mockName}"`,
            test.testDate,
            test.totalScore,
            test.overallPercentile,
            test.negativeMarks,
            test.accuracy,
            test.varcMarks,
            test.varcPercentile,
            test.lrdiMarks,
            test.lrdiPercentile,
            test.qaMarks,
            test.qaPercentile
        ].join(','))
    ].join('\n');
}

function createAdminCSVContent(allTests) {
    const headers = [
        'Student Name', 'Student ID', 'Mock Test Name', 'Test Date', 'Total Score', 'Overall Percentile',
        'Negative Marks', 'Accuracy %', 'VARC Marks', 'VARC Percentile',
        'LRDI Marks', 'LRDI Percentile', 'QA Marks', 'QA Percentile'
    ];
    
    return [
        'CAT Mock Test Performance Data - All Students',
        `Generated on: ${new Date().toLocaleDateString()}`,
        '',
        headers.join(','),
        ...allTests.map(test => [
            `"${test.studentName}"`,
            test.studentId,
            `"${test.mockName}"`,
            test.testDate,
            test.totalScore,
            test.overallPercentile,
            test.negativeMarks,
            test.accuracy,
            test.varcMarks,
            test.varcPercentile,
            test.lrdiMarks,
            test.lrdiPercentile,
            test.qaMarks,
            test.qaPercentile
        ].join(','))
    ].join('\n');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Admin User Management Functions
function editUser(userId) {
    const user = users[userId];
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }
    
    const newName = prompt('Enter new name for user:', user.name);
    if (newName && newName.trim()) {
        users[userId].name = newName.trim();
        saveData();
        updateUserManagement();
        updateAllStudentsDisplay();
        showToast('User updated successfully!');
    }
}

function deleteUser(userId) {
    const user = users[userId];
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete user ${user.name}? This will also delete all their test records.`)) {
        delete users[userId];
        delete mockTests[userId];
        saveData();
        updateUserManagement();
        updateAllStudentsDisplay();
        showToast('User deleted successfully!');
    }
}

// Global functions for HTML onclick handlers
window.switchTab = switchTab;
window.showDeleteModal = showDeleteModal;
window.editUser = editUser;
window.deleteUser = deleteUser;