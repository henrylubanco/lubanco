 // Importando Firebase via CDN (Versão 10 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Seletores do DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const regErrorMessage = document.getElementById('reg-error-message');
const userEmailDisplay = document.getElementById('user-email-display');

// Descobrindo qual página estamos (para roteamento básico)
const path = window.location.pathname;
const isLoginPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
const isRegisterPage = path.endsWith('register.html');
const isDashboardPage = path.endsWith('dashboard.html');

// --- MONITOR DE ESTADO DE AUTENTICAÇÃO (PROTEÇÃO DE ROTA) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário logado
        if (isLoginPage || isRegisterPage) {
            window.location.href = 'dashboard.html'; // Redireciona para o painel se tentar acessar login logado
        }
        if (isDashboardPage && userEmailDisplay) {
            userEmailDisplay.textContent = user.email; // Mostra o e-mail no cabeçalho
        }
    } else {
        // Usuário não logado
        if (isDashboardPage) {
            window.location.href = 'index.html'; // Expulsa do dashboard
        }
    }
});

// --- LÓGICA DE LOGIN ---
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
            .then((userCredential) => {
                // Sucesso! O onAuthStateChanged fará o redirecionamento
            })
            .catch((error) => {
                errorMessage.textContent = 'Erro ao fazer login. Verifique suas credenciais.';
                errorMessage.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Entrar';
            });
    });
}

// --- LÓGICA DE REGISTRO ---
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const btn = document.getElementById('register-btn');

        btn.disabled = true;
        btn.textContent = 'Criando conta...';
        regErrorMessage.classList.add('hidden');

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Sucesso! O onAuthStateChanged fará o redirecionamento
            })
            .catch((error) => {
                if(error.code === 'auth/email-already-in-use') {
                    regErrorMessage.textContent = 'Este e-mail já está em uso.';
                } else {
                    regErrorMessage.textContent = 'Erro ao criar conta: ' + error.message;
                }
                regErrorMessage.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Cadastrar';
            });
    });
}

// --- LÓGICA DE LOGOUT ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).catch((error) => {
            console.error("Erro ao sair:", error);
        });
    });
}