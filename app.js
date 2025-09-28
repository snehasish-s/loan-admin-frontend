// Officer Loan Management Dashboard JS

// Dummy Data
const officerCredentials = { username: 'officer', password: 'admin123', name: 'John Doe' };
let loanRequests = [
  { id: 1, name: 'Alice Smith', amount: 200000, status: 'Pending' },
  { id: 2, name: 'Bob Johnson', amount: 150000, status: 'Pending' },
  { id: 3, name: 'Charlie Lee', amount: 300000, status: 'Pending' },
  { id: 4, name: 'Diana King', amount: 100000, status: 'Pending' }
];
const loanSchemes = [
  {
    title: 'Home Loan',
    description: 'Affordable home loans for salaried professionals.',
    eligibility: 'Minimum salary ₹30,000/month, age 21-60.'
  },
  {
    title: 'Education Loan',
    description: 'Loans for higher education in India and abroad.',
    eligibility: 'Indian citizen, admission in recognized institution.'
  },
  {
    title: 'Personal Loan',
    description: 'Quick personal loans for emergencies.',
    eligibility: 'Minimum salary ₹25,000/month, age 21-58.'
  }
];

// Session Management
function setOfficerSession() {
  localStorage.setItem('officerSession', JSON.stringify(officerCredentials));
}
function getOfficerSession() {
  return JSON.parse(localStorage.getItem('officerSession'));
}
function clearOfficerSession() {
  localStorage.removeItem('officerSession');
}
function requireLogin() {
  if (!getOfficerSession()) window.location.href = 'login.html';
}

// Sidebar Render
function renderSidebar(activePage) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const nav = `
    <nav class="d-flex flex-column h-100">
      <div class="mb-4 text-center">
        <i class="bi bi-person-circle display-5"></i>
        <h4 class="mt-2">Officer</h4>
      </div>
      <a href="dashboard.html" class="nav-link${activePage==='dashboard'?' active':''}"><i class="bi bi-house-door"></i>Dashboard</a>
      <a href="loan-requests.html" class="nav-link${activePage==='loan-requests'?' active':''}"><i class="bi bi-list-check"></i>Loan Requests</a>
      <a href="approved-loans.html" class="nav-link${activePage==='approved-loans'?' active':''}"><i class="bi bi-check2-circle"></i>Approved Loans</a>
      <a href="wallet-utilization.html" class="nav-link${activePage==='wallet-utilization'?' active':''}"><i class="bi bi-wallet2"></i>Wallet Utilization</a>
      <a href="loan-schemes.html" class="nav-link${activePage==='loan-schemes'?' active':''}"><i class="bi bi-file-earmark-text"></i>Loan Schemes</a>
      <a href="#" onclick="logoutOfficer()" class="nav-link text-danger mt-auto"><i class="bi bi-box-arrow-right"></i>Logout</a>
    </nav>
  `;
  sidebar.innerHTML = nav;
}

// Login Logic
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (username === officerCredentials.username && password === officerCredentials.password) {
      setOfficerSession();
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('loginError').style.display = 'block';
      document.getElementById('loginError').textContent = 'Invalid credentials. Please try again.';
    }
  });
}

// Dashboard Page
if (window.location.pathname.endsWith('dashboard.html')) {
  requireLogin();
  renderSidebar('dashboard');
  document.getElementById('officerName').textContent = getOfficerSession().name;
  // Quick Stats
  const stats = `
    <ul class="list-group">
      <li class="list-group-item d-flex justify-content-between align-items-center">Total Requests <span class="badge bg-primary">${loanRequests.length}</span></li>
      <li class="list-group-item d-flex justify-content-between align-items-center">Approved <span class="badge bg-success">${loanRequests.filter(l=>l.status==='Approved').length}</span></li>
      <li class="list-group-item d-flex justify-content-between align-items-center">Rejected <span class="badge bg-danger">${loanRequests.filter(l=>l.status==='Rejected').length}</span></li>
      <li class="list-group-item d-flex justify-content-between align-items-center">Pending <span class="badge bg-warning text-dark">${loanRequests.filter(l=>l.status==='Pending').length}</span></li>
    </ul>
  `;
  document.getElementById('dashboardStats').innerHTML = stats;
}

// Loan Requests Page
if (window.location.pathname.endsWith('loan-requests.html')) {
  requireLogin();
  renderSidebar('loan-requests');
  function renderTable() {
    let html = `<table class="table table-bordered table-hover">
      <thead><tr><th>Applicant Name</th><th>Loan Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>`;
    loanRequests.forEach((req, idx) => {
      html += `<tr>
        <td>${req.name}</td>
        <td>₹${req.amount.toLocaleString()}</td>
        <td><span class="badge ${req.status==='Approved'?'bg-success':req.status==='Rejected'?'bg-danger':'bg-warning text-dark'}">${req.status}</span></td>
        <td>
          <button class="btn btn-success btn-sm me-2" onclick="approveLoan(${idx})" ${req.status!=='Pending'?'disabled':''}>Approve</button>
          <button class="btn btn-danger btn-sm" onclick="rejectLoan(${idx})" ${req.status!=='Pending'?'disabled':''}>Reject</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('loanRequestsTable').innerHTML = html;
  }
  window.approveLoan = function(idx) {
    loanRequests[idx].status = 'Approved';
    renderTable();
  };
  window.rejectLoan = function(idx) {
    loanRequests[idx].status = 'Rejected';
    renderTable();
  };
  renderTable();
}

// Approved Loans Page
if (window.location.pathname.endsWith('approved-loans.html')) {
  requireLogin();
  renderSidebar('approved-loans');
  const grid = document.getElementById('approvedLoansGrid');
  let html = '';
  loanRequests.filter(l=>l.status==='Approved').forEach(l => {
    html += `<div class="col-md-4">
      <div class="card shadow-sm animate__animated animate__fadeInUp">
        <div class="card-body">
          <h5 class="card-title">${l.name}</h5>
          <p class="card-text">Loan Amount: <strong>₹${l.amount.toLocaleString()}</strong></p>
          <span class="badge bg-success">Approved</span>
        </div>
      </div>
    </div>`;
  });
  grid.innerHTML = html || '<div class="col-12"><div class="alert alert-info">No approved loans yet.</div></div>';
}

// Wallet Utilization Page
if (window.location.pathname.endsWith('wallet-utilization.html')) {
  requireLogin();
  renderSidebar('wallet-utilization');
  const walletBalance = 500000;
  const totalDisbursed = loanRequests.filter(l=>l.status==='Approved').reduce((sum, l)=>sum+l.amount, 0);
  const percent = walletBalance ? Math.round((totalDisbursed/walletBalance)*100) : 0;
  document.getElementById('walletBalance').textContent = walletBalance.toLocaleString();
  const progressBar = document.getElementById('disbursalProgress');
  progressBar.style.width = percent + '%';
  progressBar.setAttribute('aria-valuenow', percent);
  progressBar.textContent = percent + '%';
}

// Loan Schemes Page
if (window.location.pathname.endsWith('loan-schemes.html')) {
  requireLogin();
  renderSidebar('loan-schemes');
  const cards = document.getElementById('loanSchemesCards');
  let html = '';
  loanSchemes.forEach(scheme => {
    html += `<div class="col-md-4">
      <div class="card shadow-sm animate__animated animate__fadeIn">
        <div class="card-body">
          <h5 class="card-title">${scheme.title}</h5>
          <p class="card-text">${scheme.description}</p>
          <p class="text-muted"><strong>Eligibility:</strong> ${scheme.eligibility}</p>
        </div>
      </div>
    </div>`;
  });
  cards.innerHTML = html;
}

// Logout
window.logoutOfficer = function() {
  clearOfficerSession();
  window.location.href = 'login.html';
};

// Session persistence
if (getOfficerSession() && window.location.pathname.endsWith('login.html')) {
  window.location.href = 'dashboard.html';
}
