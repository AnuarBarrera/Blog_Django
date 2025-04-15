document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('cookiesAceptadas')) {
    document.getElementById('cookie-banner').style.display = 'block';
  }
});

function aceptarCookies() {
  localStorage.setItem('cookiesAceptadas', 'true');
  document.getElementById('cookie-banner').style.display = 'none';
}