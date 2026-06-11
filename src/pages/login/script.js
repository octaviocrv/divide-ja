/* ══════════════════════════════════════
   sistema de notificação
   ══════════════════════════════════════ */

(function () {
  const style = document.createElement('style');
  style.textContent = `
    #toast-container {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 14px;
      background: #13161e;
      border: 1px solid rgba(255,255,255,0.07);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      min-width: 280px;
      max-width: 360px;
      pointer-events: all;
      animation: toastIn 0.35s cubic-bezier(0.4,0,0.2,1) both;
      position: relative;
      overflow: hidden;
    }

    .toast.hide {
      animation: toastOut 0.3s cubic-bezier(0.4,0,0.2,1) forwards;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1); }
    }

    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0)    scale(1); }
      to   { opacity: 0; transform: translateY(8px)  scale(0.95); }
    }

    /* Barra de progresso */
    .toast::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      height: 2px; width: 100%;
      border-radius: 0 0 14px 14px;
      animation: toastProgress linear forwards;
    }

    .toast.success { border-color: rgba(200,241,53,0.2); }
    .toast.success::after { background: #c8f135; animation-duration: 3s; }

    .toast.error { border-color: rgba(255,78,78,0.2); }
    .toast.error::after { background: #ff4e4e; animation-duration: 4s; }

    .toast.info { border-color: rgba(99,179,237,0.2); }
    .toast.info::after { background: #63b3ed; animation-duration: 3.5s; }

    @keyframes toastProgress {
      from { width: 100%; }
      to   { width: 0%; }
    }

    .toast-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .toast.success .toast-icon { background: rgba(200,241,53,0.12); color: #c8f135; }
    .toast.error   .toast-icon { background: rgba(255,78,78,0.12);  color: #ff4e4e; }
    .toast.info    .toast-icon { background: rgba(99,179,237,0.12); color: #63b3ed; }

    .toast-body { flex: 1; min-width: 0; }

    .toast-title {
      font-family: 'Syne', sans-serif;
      font-size: 13px; font-weight: 700;
      color: #f0f2f5;
      display: block;
      margin-bottom: 2px;
    }

    .toast-msg {
      font-size: 12px;
      color: #8b929f;
      line-height: 1.45;
    }

    .toast-close {
      background: none; border: none;
      color: #5a6070; font-size: 13px;
      cursor: pointer; padding: 2px;
      flex-shrink: 0; margin-top: 1px;
      transition: color 0.18s;
    }
    .toast-close:hover { color: #f0f2f5; }
  `;
  document.head.appendChild(style);

  const ensureContainer = () => {
    if (document.getElementById('toast-container')) return;
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  };

  if (document.body) {
    ensureContainer();
  } else {
    document.addEventListener('DOMContentLoaded', ensureContainer, { once: true });
  }
})();

/**
 * @param {'success'|'error'|'info'} tipo
 * @param {string} titulo
 * @param {string} mensagem
 * @param {number} duracao 
 */

function showToast(tipo, titulo, mensagem, duracao = 3500) {
  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-exclamation',
    info:    'fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[tipo] || icons.info}"></i></div>
    <div class="toast-body">
      <span class="toast-title">${titulo}</span>
      <span class="toast-msg">${mensagem}</span>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      <i class="fas fa-xmark"></i>
    </button>
  `;

  const container = document.getElementById('toast-container');
  if (!container) {
    alert(mensagem);
    return;
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duracao);
}


const usuarios = {
  admin:   'admin',
  Thiago:  'Thiago',
  Sidney:  'Sidney',
  Octavio: 'Octavio',
  Deborah: 'Deborah',
  Andre:   'Andre',
};

function Login() {
  const login = document.getElementById('login').value.trim();
  const senha = document.getElementById('senha').value;

  if (!login || !senha) {
    showToast('error', 'Campos obrigatórios', 'Preencha o usuário e a senha para continuar.');
    return;
  }

  if (usuarios[login] && usuarios[login] === senha) {
    showToast('success', 'Bem-vindo!', `Olá, ${login}. Redirecionando...`);
    setTimeout(() => location.href = '../home/index.html', 1400);
  } else {
    showToast('error', 'Acesso negado', 'Usuário ou senha incorretos. Tente novamente.');
  }
}

// Garante disponibilidade global mesmo com scripts inline na página.
window._originalLogin = Login;
window.Login = Login;