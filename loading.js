// Show loading animation before page content
function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-bg">
      <div class="loader-spinner">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('page-loader');
  if (loader) loader.remove();
}

// Show loader on DOMContentLoaded, hide after short delay
showLoading();
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoading, 900); // 900ms for smooth effect
});
