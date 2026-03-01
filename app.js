// Importando Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// SUBSTITUA ESTE OBJETO pelas chaves do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0lD7CAGlDVFwqjHgnR7fUjAUOOy0xEIM",
  authDomain: "ocnabul-95e31.firebaseapp.com",
  projectId: "ocnabul-95e31",
  storageBucket: "ocnabul-95e31.firebasestorage.app",
  messagingSenderId: "871051377346",
  appId: "1:871051377346:web:24286efac346fd6f4d195b",
  measurementId: "G-L4VDMCVRX0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const userEmailDisplay = document.getElementById('user-email-display');

const path = window.location.pathname;
const isLoginPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');

// Proteção de Rota Dinâmica
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se está logado e tenta acessar o login, manda para o dashboard
        if (isLoginPage) window.location.href = 'dashboard.html';
        
        // Se a página atual tiver o elemento para mostrar o email, ele atualiza
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    } else {
        // Se NÃO está logado e NÃO está na página de login, expulsa para o login
        if (!isLoginPage) window.location.href = 'index.html';
    }
});

// Lógica de Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');
        
        btn.disabled = true;
        btn.textContent = 'Carregando...';
        errorMessage.classList.add('hidden');

        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                errorMessage.textContent = 'Acesso negado. E-mail ou senha incorretos.';
                errorMessage.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Entrar';
            });
    });
}

// Lógica de Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => signOut(auth));
}
