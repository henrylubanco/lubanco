// Importando Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// === ATENÇÃO: COLOQUE AS SUAS CHAVES DO FIREBASE AQUI ===
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Seletores do DOM
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const userEmailDisplay = document.getElementById('user-email-display');

const path = window.location.pathname;
const isLoginPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');

// --- 1. PROTEÇÃO DE ROTA (O Segurança do Site) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (isLoginPage) window.location.replace('dashboard.html');
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    } else {
        if (!isLoginPage) window.location.replace('index.html');
    }
});

// --- 2. LÓGICA DE LOGIN ---
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

// --- 3. LÓGICA DE LOGOUT (Corrigida) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            // O logout foi feito com sucesso. O sistema te joga pro login.
            window.location.replace('index.html');
        }).catch((error) => {
            console.error("Erro ao sair:", error);
        });
    });
}

// --- 4. SISTEMA DE EXPIRAÇÃO POR INATIVIDADE (5 MINUTOS) ---
const TEMPO_LIMITE_SEGUNDOS = 5 * 60; // 300 segundos
let tempoRestante = TEMPO_LIMITE_SEGUNDOS;
let intervaloCronometro;
let elementoCronometro;

function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

function atualizarTelaCronometro() {
    if (!elementoCronometro) {
        elementoCronometro = document.createElement('div');
        elementoCronometro.id = 'inactivity-timer';
        elementoCronometro.style.position = 'fixed';
        elementoCronometro.style.bottom = '20px';
        elementoCronometro.style.right = '20px';
        elementoCronometro.style.backgroundColor = '#1e3a8a';
        elementoCronometro.style.color = 'white';
        elementoCronometro.style.padding = '10px 15px';
        elementoCronometro.style.borderRadius = '8px';
        elementoCronometro.style.fontWeight = 'bold';
        elementoCronometro.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        elementoCronometro.style.zIndex = '9999';
        elementoCronometro.style.transition = 'background-color 0.3s';
        
        document.body.appendChild(elementoCronometro);
    }

    elementoCronometro.textContent = `Sessão expira em: ${formatarTempo(tempoRestante)}`;

    if (tempoRestante <= 60) {
        elementoCronometro.style.backgroundColor = '#ef4444'; 
    } else {
        elementoCronometro.style.backgroundColor = '#1e3a8a';
    }
}

function deslogarPorInatividade() {
    clearInterval(intervaloCronometro);
    
    document.removeEventListener('mousemove', resetarTempo);
    document.removeEventListener('keypress', resetarTempo);
    document.removeEventListener('click', resetarTempo);
    document.removeEventListener('scroll', resetarTempo);
    document.removeEventListener('touchstart', resetarTempo);

    alert("Tempo limite de 5 minutos atingido! O sistema foi bloqueado por segurança.");
    
    signOut(auth).then(() => {
        window.location.replace('index.html');
    });
}

function rodarCronometro() {
    tempoRestante--;
    atualizarTelaCronometro();
    if (tempoRestante <= 0) deslogarPorInatividade();
}

function resetarTempo() {
    tempoRestante = TEMPO_LIMITE_SEGUNDOS;
    atualizarTelaCronometro();
    clearInterval(intervaloCronometro);
    if (!isLoginPage) intervaloCronometro = setInterval(rodarCronometro, 1000); 
}

if (!isLoginPage) {
    window.addEventListener('load', resetarTempo);
    document.addEventListener('mousemove', resetarTempo);
    document.addEventListener('keypress', resetarTempo);
    document.addEventListener('click', resetarTempo);
    document.addEventListener('scroll', resetarTempo);
    document.addEventListener('touchstart', resetarTempo);
}
