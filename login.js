import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

function togglePassword() {
  var pwd = document.getElementById("password");
  pwd.type = pwd.type === "password" ? "text" : "password";
}

const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            errorMsg.textContent = error.message;
            errorMsg.style.display = 'block';
        });
});

// Add the togglePassword function to the window object so it can be called from the HTML
window.togglePassword = togglePassword;