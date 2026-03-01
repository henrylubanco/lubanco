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
// --- SISTEMA DE EXPIRAÇÃO POR INATIVIDADE (5 MINUTOS) COM CRONÔMETRO ---
const TEMPO_LIMITE_SEGUNDOS = 5 * 60; // 5 minutos = 300 segundos
let tempoRestante = TEMPO_LIMITE_SEGUNDOS;
let intervaloCronometro;
let elementoCronometro;

// Formata o tempo para o padrão MM:SS
function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
}

// Cria e atualiza a caixinha do cronômetro na tela
function atualizarTelaCronometro() {
    // Se o elemento não existir, cria ele e injeta no HTML
    if (!elementoCronometro) {
        elementoCronometro = document.createElement('div');
        elementoCronometro.id = 'inactivity-timer';
        
        // Estilo da caixinha flutuante no canto inferior direito
        elementoCronometro.style.position = 'fixed';
        elementoCronometro.style.bottom = '20px';
        elementoCronometro.style.right = '20px';
        elementoCronometro.style.backgroundColor = '#1e3a8a'; // Azul padrão
        elementoCronometro.style.color = 'white';
        elementoCronometro.style.padding = '10px 15px';
        elementoCronometro.style.borderRadius = '8px';
        elementoCronometro.style.fontWeight = 'bold';
        elementoCronometro.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
        elementoCronometro.style.zIndex = '9999';
        elementoCronometro.style.transition = 'background-color 0.3s';
        
        document.body.appendChild(elementoCronometro);
    }

    // Atualiza o texto com o tempo restante
    elementoCronometro.textContent = `Sessão expira em: ${formatarTempo(tempoRestante)}`;

    // Se faltar 1 minuto ou menos, muda a cor para vermelho (alerta)
    if (tempoRestante <= 60) {
        elementoCronometro.style.backgroundColor = '#ef4444'; 
    } else {
        elementoCronometro.style.backgroundColor = '#1e3a8a';
    }
}

// Função que executa o bloqueio quando o tempo zera
function deslogarPorInatividade() {
    clearInterval(intervaloCronometro);
    
    // Remove os escutadores para o mouse não interferir mais
    document.removeEventListener('mousemove', resetarTempo);
    document.removeEventListener('keypress', resetarTempo);
    document.removeEventListener('click', resetarTempo);
    document.removeEventListener('scroll', resetarTempo);
    document.removeEventListener('touchstart', resetarTempo);

    alert("Tempo limite de 5 minutos atingido! O sistema foi bloqueado por segurança.");
    
    signOut(auth).then(() => {
        window.location.replace('index.html');
    }).catch((error) => {
        console.error("Erro ao encerrar sessão:", error);
    });
}

// Função que roda a cada 1 segundo (Tick)
function rodarCronometro() {
    tempoRestante--;
    atualizarTelaCronometro();

    if (tempoRestante <= 0) {
        deslogarPorInatividade();
    }
}

// Função que zera o relógio para 5 minutos sempre que o usuário mexe no PC
function resetarTempo() {
    tempoRestante = TEMPO_LIMITE_SEGUNDOS;
    atualizarTelaCronometro();
    
    clearInterval(intervaloCronometro);
    if (!isLoginPage) {
        // Aciona o relógio para rodar a cada 1000 milissegundos (1 segundo)
        intervaloCronometro = setInterval(rodarCronometro, 1000); 
    }
}

// Inicia o monitoramento inteligente
if (!isLoginPage) {
    window.addEventListener('load', resetarTempo);
    document.addEventListener('mousemove', resetarTempo);
    document.addEventListener('keypress', resetarTempo);
    document.addEventListener('click', resetarTempo);
    document.addEventListener('scroll', resetarTempo);
    document.addEventListener('touchstart', resetarTempo);
}
