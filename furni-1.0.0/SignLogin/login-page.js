// ฟังก์ชันดักหน้า login ให้มีพารามิเตอร์ redirect เป็น URL ปัจจุบัน (ส่วนนี้ควรอยู่ในหน้าที่เรียกไป login)
function redirectToLogin(event) {
  event.preventDefault(); // หยุดไม่ให้ลิงก์ทำงานตาม href

  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  const loginUrl = `/SignLogin/login-page.html?redirect=${encodeURIComponent(currentPath)}`;
  
  console.log('Redirecting to login URL:', loginUrl);
  window.location.href = loginUrl;
}



// ฟังก์ชันอ่านค่า redirect จาก URL ของหน้า login-page.html
function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  console.log('Redirect from param:', redirect); // ดูว่าค่าถูกดึงมาไหม
  return redirect || '/index.html';
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
      // อ่านค่า redirect จาก URL เพื่อไปหน้าเดิมที่มาก่อนล็อกอิน
      const redirectUrl = getRedirectUrl();
      console.log('Redirecting to:', redirectUrl);
      // Redirect กลับไปหน้าเดิม
      window.location.href = redirectUrl;  // <-- แก้ไขตรงนี้
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  });
}
