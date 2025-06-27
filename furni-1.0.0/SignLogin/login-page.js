// ฟังก์ชันดักหน้า login ให้มีพารามิเตอร์ redirect เป็น URL ปัจจุบัน (ส่วนนี้ควรอยู่ในหน้าที่เรียกไป login)
function redirectToLogin(event) {
  event.preventDefault(); // หยุดไม่ให้ลิงก์ทำงานตาม href

  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  
  const loginUrl = `SignLogin/login-page.html?redirect=${encodeURIComponent(currentPath)}`;

  
  console.log('Redirecting to login URL:', loginUrl);
  window.location.href = loginUrl;
}



// ฟังก์ชันอ่านค่า redirect จาก URL ของหน้า login-page.html
function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  console.log('Redirect from param:', redirect);
  
  // ถ้าไม่มี redirect เลย ให้ return null ไปเลย
  return redirect || null;
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
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    alert(data.message);
    if (data.message === 'Login successfully.') {
      // ✅ ใช้ token ที่ backend ส่งมา
      localStorage.setItem('authToken', data.token);  
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('email', data.user.email);

      const redirectUrl = getRedirectUrl();
      console.log('Redirecting to:', redirectUrl);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = "/index.html";
      }
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    alert('login ผิดพลาดโปรดตรวจสอบใหม่');
  });
}


window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const redirectUrl = getRedirectUrl();
  const isLoginPage = window.location.pathname.includes("login-page.html");

  // ✅ เงื่อนไขใหม่: redirect ได้เฉพาะถ้ามี redirect param
  if (token && !isLoginPage && redirectUrl) {
    console.log("✅ Already logged in, redirecting to:", redirectUrl);
    if (redirectUrl !== window.location.pathname) {
      window.location.href = redirectUrl;
    }
  }
});

window.addEventListener("pageshow", function (event) {
  const token = localStorage.getItem('authToken');

  if (!token && (event.persisted || window.performance?.navigation.type === 2)) {
    console.log('No token and back navigation: redirecting to login');
    window.location.href = "./login-page.html"; // หรือเปลี่ยน path ตามที่ถูกต้อง
  }
});

function performLogout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  window.location.replace("./SignLogin/login-page.html");
}

