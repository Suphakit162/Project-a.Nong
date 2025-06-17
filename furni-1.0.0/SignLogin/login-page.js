function redirectToLogin() {
    const currentPath = window.location.pathname;
    window.location.href = `/SignLogin/login-page.html?redirect=${currentPath}`;
  }

function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  console.log('Redirect from param:', redirect);
  return redirect || '/index.html'; // ถ้าไม่มี redirect, กลับไปหน้า index.html
}


function loginSubmit() {
  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('password-login').value.trim();

  if (!email || !password) {
    alert('กรุณากรอก Email และ Password');
    return;
  }

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: email, password: password })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    if (data.message === 'Login successfully.') {
      const redirectUrl = getRedirectUrl();
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  });
}
