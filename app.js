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
// --- SISTEMA DE EXPIRAÇÃO POR INATIVIDADE (1 MINUTO) ---
let tempoInativo;
const TEMPO_LIMITE = 60 * 1000; // 60 segundos * 1000 milissegundos = 1 minuto

function deslogarPorInatividade() {
    // Se o tempo esgotar, fazemos o logout no Firebase
    signOut(auth).then(() => {
        alert("Sua sessão expirou por inatividade de 1 minuto. Por segurança, faça login novamente.");
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Erro ao encerrar sessão por inatividade:", error);
    });
}

function resetarTempo() {
    // Cancela o cronômetro anterior e começa um novo do zero
    clearTimeout(tempoInativo);
    
    // Só ativa o cronômetro se o usuário NÃO estiver na tela de login
    if (!isLoginPage) {
        tempoInativo = setTimeout(deslogarPorInatividade, TEMPO_LIMITE);
    }
}

// Se não estiver na tela de login, monitora qualquer ação do usuário
if (!isLoginPage) {
    window.onload = resetarTempo;       // Quando a página carrega
    document.onmousemove = resetarTempo; // Quando mexe o mouse
    document.onkeypress = resetarTempo;  // Quando digita algo
    document.onclick = resetarTempo;     // Quando clica
    document.onscroll = resetarTempo;    // Quando rola a página
    document.ontouchstart = resetarTempo;// Quando toca na tela (celular)
}

// Lógica de Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => signOut(auth));
}
