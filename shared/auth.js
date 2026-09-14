/**
 * K-IMPACT Auth System v1.0
 * Frontend-only authentication using localStorage
 * Admin + User roles
 */

(function() {
  'use strict';

  // ── Default admin credentials (change before production) ──
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'kimpact2026!',
    role: 'admin',
    name: 'K-IMPACT Admin'
  };

  const STORAGE_KEYS = {
    users: 'kimpact_users',
    session: 'kimpact_session',
    favorites: 'kimpact_favorites'
  };

  // ── Auth Utilities ──
  const Auth = {
    // Hash password (simple base64 for demo; use bcrypt in production)
    hashPassword(pw) {
      return btoa(unescape(encodeURIComponent(pw + '_kimpact_salt')));
    },

    getUsers() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
      } catch { return []; }
    },

    saveUsers(users) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    },

    getSession() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
      } catch { return null; }
    },

    setSession(user) {
      const session = {
        ...user,
        loginAt: new Date().toISOString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
      return session;
    },

    clearSession() {
      localStorage.removeItem(STORAGE_KEYS.session);
    },

    isLoggedIn() {
      const session = this.getSession();
      if (!session) return false;
      if (new Date(session.expires) < new Date()) {
        this.clearSession();
        return false;
      }
      return true;
    },

    isAdmin() {
      const session = this.getSession();
      return session && session.role === 'admin';
    },

    getCurrentUser() {
      return this.getSession();
    },

    // Register new user
    register(username, email, password) {
      if (!username || !email || !password) {
        return { success: false, message: '모든 필드를 입력해주세요.' };
      }
      if (password.length < 6) {
        return { success: false, message: '비밀번호는 6자 이상이어야 합니다.' };
      }
      const users = this.getUsers();
      if (users.find(u => u.email === email)) {
        return { success: false, message: '이미 사용 중인 이메일입니다.' };
      }
      if (users.find(u => u.username === username)) {
        return { success: false, message: '이미 사용 중인 사용자명입니다.' };
      }
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: this.hashPassword(password),
        role: 'user',
        createdAt: new Date().toISOString(),
        favorites: []
      };
      users.push(newUser);
      this.saveUsers(users);
      return { success: true, message: '회원가입이 완료되었습니다.' };
    },

    // Login
    login(usernameOrEmail, password) {
      // Check admin
      if (
        (usernameOrEmail === ADMIN_CREDENTIALS.username || usernameOrEmail === 'yejungi@naver.com') &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const session = this.setSession({
          id: 'admin',
          username: ADMIN_CREDENTIALS.username,
          name: ADMIN_CREDENTIALS.name,
          role: 'admin',
          email: 'yejungi@naver.com'
        });
        return { success: true, user: session };
      }

      // Check regular users
      const users = this.getUsers();
      const user = users.find(u =>
        (u.email === usernameOrEmail || u.username === usernameOrEmail) &&
        u.password === this.hashPassword(password)
      );

      if (!user) {
        return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
      }

      const { password: _, ...safeUser } = user;
      const session = this.setSession(safeUser);
      return { success: true, user: session };
    },

    logout() {
      this.clearSession();
      window.location.reload();
    },

    // Favorites management
    getFavorites() {
      const user = this.getCurrentUser();
      if (!user) return [];
      try {
        const favData = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{}');
        return favData[user.id] || [];
      } catch { return []; }
    },

    toggleFavorite(brandId, brandName) {
      const user = this.getCurrentUser();
      if (!user) return { success: false, message: '로그인이 필요합니다.' };
      try {
        const favData = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{}');
        const userFavs = favData[user.id] || [];
        const idx = userFavs.findIndex(f => f.id === brandId);
        if (idx >= 0) {
          userFavs.splice(idx, 1);
          favData[user.id] = userFavs;
          localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favData));
          return { success: true, added: false };
        } else {
          userFavs.push({ id: brandId, name: brandName, savedAt: new Date().toISOString() });
          favData[user.id] = userFavs;
          localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favData));
          return { success: true, added: true };
        }
      } catch { return { success: false, message: '오류가 발생했습니다.' }; }
    }
  };

  // ── Modal HTML ──
  function createAuthModal() {
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-overlay" id="auth-overlay"></div>
      <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button class="auth-close" id="auth-close" aria-label="닫기">&times;</button>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login" id="tab-login">로그인</button>
          <button class="auth-tab" data-tab="register" id="tab-register">회원가입</button>
        </div>

        <!-- Login Form -->
        <div class="auth-panel active" id="panel-login">
          <div class="auth-logo">
            <span class="auth-logo-text">K-IMPACT</span>
            <span class="auth-logo-sub">Media Group</span>
          </div>
          <h2 id="auth-modal-title" class="auth-title">로그인</h2>
          <form id="login-form" novalidate>
            <div class="auth-field">
              <label for="login-id">이메일 또는 사용자명</label>
              <input type="text" id="login-id" placeholder="이메일 또는 사용자명" autocomplete="username" required />
            </div>
            <div class="auth-field">
              <label for="login-pw">비밀번호</label>
              <input type="password" id="login-pw" placeholder="비밀번호" autocomplete="current-password" required />
            </div>
            <div class="auth-error" id="login-error" role="alert" aria-live="polite"></div>
            <button type="submit" class="auth-submit">로그인</button>
          </form>
          <p class="auth-switch">계정이 없으신가요? <button class="auth-link" data-tab="register">회원가입</button></p>
        </div>

        <!-- Register Form -->
        <div class="auth-panel" id="panel-register">
          <div class="auth-logo">
            <span class="auth-logo-text">K-IMPACT</span>
            <span class="auth-logo-sub">Media Group</span>
          </div>
          <h2 class="auth-title">회원가입</h2>
          <form id="register-form" novalidate>
            <div class="auth-field">
              <label for="reg-username">사용자명</label>
              <input type="text" id="reg-username" placeholder="사용자명" autocomplete="username" required />
            </div>
            <div class="auth-field">
              <label for="reg-email">이메일</label>
              <input type="email" id="reg-email" placeholder="이메일 주소" autocomplete="email" required />
            </div>
            <div class="auth-field">
              <label for="reg-pw">비밀번호</label>
              <input type="password" id="reg-pw" placeholder="비밀번호 (6자 이상)" autocomplete="new-password" required />
            </div>
            <div class="auth-error" id="register-error" role="alert" aria-live="polite"></div>
            <button type="submit" class="auth-submit">회원가입</button>
          </form>
          <p class="auth-switch">이미 계정이 있으신가요? <button class="auth-link" data-tab="login">로그인</button></p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Tab switching
    modal.querySelectorAll('.auth-tab, .auth-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        modal.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        modal.querySelectorAll('.auth-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
      });
    });

    // Close
    modal.querySelector('#auth-close').addEventListener('click', closeAuthModal);
    modal.querySelector('#auth-overlay').addEventListener('click', closeAuthModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuthModal(); });

    // Login form submit
    modal.querySelector('#login-form').addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('login-id').value.trim();
      const pw = document.getElementById('login-pw').value;
      const errEl = document.getElementById('login-error');
      const result = Auth.login(id, pw);
      if (result.success) {
        closeAuthModal();
        updateAuthUI();
        showToast('로그인되었습니다. 환영합니다!');
        if (result.user.role === 'admin') {
          setTimeout(() => {
            if (confirm('관리자 대시보드로 이동하시겠습니까?')) {
              openAdminPanel();
            }
          }, 500);
        }
      } else {
        errEl.textContent = result.message;
      }
    });

    // Register form submit
    modal.querySelector('#register-form').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pw = document.getElementById('reg-pw').value;
      const errEl = document.getElementById('register-error');
      const result = Auth.register(username, email, pw);
      if (result.success) {
        errEl.style.color = '#34d399';
        errEl.textContent = result.message + ' 로그인해주세요.';
        setTimeout(() => {
          modal.querySelector('[data-tab="login"]').click();
          errEl.style.color = '';
          errEl.textContent = '';
        }, 1500);
      } else {
        errEl.textContent = result.message;
      }
    });
  }

  function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('login-id')?.focus();
    }
  }

  function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── Admin Panel ──
  function openAdminPanel() {
    if (!Auth.isAdmin()) {
      showToast('관리자 권한이 필요합니다.', 'error');
      return;
    }

    let panel = document.getElementById('admin-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'admin-panel';
      panel.innerHTML = `
        <div class="admin-overlay" id="admin-overlay"></div>
        <div class="admin-dialog">
          <div class="admin-header">
            <div class="admin-header-left">
              <span class="admin-badge">ADMIN</span>
              <h2>K-IMPACT 관리자 대시보드</h2>
            </div>
            <button class="admin-close" id="admin-close">&times;</button>
          </div>
          <div class="admin-body">
            <nav class="admin-nav">
              <button class="admin-nav-item active" data-section="overview">개요</button>
              <button class="admin-nav-item" data-section="content">콘텐츠 관리</button>
              <button class="admin-nav-item" data-section="users">사용자 관리</button>
              <button class="admin-nav-item" data-section="settings">설정</button>
            </nav>
            <div class="admin-content">
              <!-- Overview -->
              <div class="admin-section active" id="admin-overview">
                <h3>플랫폼 현황</h3>
                <div class="admin-stats-grid">
                  <div class="admin-stat-card">
                    <span class="asc-label">등록 사용자</span>
                    <span class="asc-value" id="stat-users">0</span>
                  </div>
                  <div class="admin-stat-card">
                    <span class="asc-label">저장된 관심 브랜드</span>
                    <span class="asc-value" id="stat-favs">0</span>
                  </div>
                  <div class="admin-stat-card">
                    <span class="asc-label">플랫폼 상태</span>
                    <span class="asc-value" style="color:#34d399;">운영 중</span>
                  </div>
                  <div class="admin-stat-card">
                    <span class="asc-label">마지막 업데이트</span>
                    <span class="asc-value" id="stat-updated">-</span>
                  </div>
                </div>
                <div class="admin-notice">
                  <strong>관리자 안내</strong>
                  <p>이 대시보드는 K-IMPACT 플랫폼의 최소 기능 버전입니다. 콘텐츠 관리, 사용자 관리, 설정 기능이 포함되어 있습니다. 실제 운영 환경에서는 서버 기반 CMS로 교체가 필요합니다.</p>
                </div>
              </div>

              <!-- Content Management -->
              <div class="admin-section" id="admin-content">
                <h3>콘텐츠 관리</h3>
                <div class="admin-content-tabs">
                  <button class="act-btn active" data-ct="newsroom">Newsroom</button>
                  <button class="act-btn" data-ct="brands">브랜드 랭킹</button>
                  <button class="act-btn" data-ct="deals">핫딜</button>
                </div>
                <div class="admin-content-area">
                  <div class="admin-ct-panel active" id="ct-newsroom">
                    <div class="admin-toolbar">
                      <button class="admin-btn-primary" onclick="KImpactAdmin.addNewsItem()">+ 새 뉴스 추가</button>
                    </div>
                    <div class="admin-news-list" id="admin-news-list">
                      <p class="admin-empty">등록된 뉴스가 없습니다. 새 뉴스를 추가해주세요.</p>
                    </div>
                  </div>
                  <div class="admin-ct-panel" id="ct-brands">
                    <p class="admin-empty">브랜드 랭킹 관리 기능은 플랫폼 정식 출시 시 활성화됩니다.</p>
                  </div>
                  <div class="admin-ct-panel" id="ct-deals">
                    <p class="admin-empty">핫딜 관리 기능은 플랫폼 정식 출시 시 활성화됩니다.</p>
                  </div>
                </div>
              </div>

              <!-- User Management -->
              <div class="admin-section" id="admin-users">
                <h3>사용자 관리</h3>
                <div class="admin-user-list" id="admin-user-list">
                  <p class="admin-empty">로딩 중...</p>
                </div>
              </div>

              <!-- Settings -->
              <div class="admin-section" id="admin-settings">
                <h3>설정</h3>
                <div class="admin-settings-form">
                  <div class="admin-setting-item">
                    <label>플랫폼 이름</label>
                    <input type="text" value="K-IMPACT Media Group" readonly />
                  </div>
                  <div class="admin-setting-item">
                    <label>K-Beauty 플랫폼 상태</label>
                    <select>
                      <option value="active">운영 중 (Active)</option>
                      <option value="maintenance">점검 중 (Maintenance)</option>
                      <option value="coming">출시 예정 (Coming Soon)</option>
                    </select>
                  </div>
                  <div class="admin-setting-item">
                    <label>관리자 비밀번호 변경</label>
                    <input type="password" placeholder="새 비밀번호 (미구현 - 서버 필요)" disabled />
                    <small>비밀번호 변경은 서버 기반 환경에서 지원됩니다.</small>
                  </div>
                  <button class="admin-btn-primary" onclick="showToast('설정이 저장되었습니다.')">설정 저장</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);

      // Nav switching
      panel.querySelectorAll('.admin-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const sec = btn.dataset.section;
          panel.querySelectorAll('.admin-nav-item').forEach(b => b.classList.toggle('active', b === btn));
          panel.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('active', s.id === `admin-${sec}`));
          if (sec === 'users') loadAdminUsers();
          if (sec === 'overview') loadAdminOverview();
        });
      });

      // Content tabs
      panel.querySelectorAll('.act-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const ct = btn.dataset.ct;
          panel.querySelectorAll('.act-btn').forEach(b => b.classList.toggle('active', b === btn));
          panel.querySelectorAll('.admin-ct-panel').forEach(p => p.classList.toggle('active', p.id === `ct-${ct}`));
        });
      });

      panel.querySelector('#admin-close').addEventListener('click', () => {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
      panel.querySelector('#admin-overlay').addEventListener('click', () => {
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    loadAdminOverview();
  }

  function loadAdminOverview() {
    const users = Auth.getUsers();
    const favData = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{}');
    const totalFavs = Object.values(favData).reduce((sum, arr) => sum + arr.length, 0);
    const statUsers = document.getElementById('stat-users');
    const statFavs = document.getElementById('stat-favs');
    const statUpdated = document.getElementById('stat-updated');
    if (statUsers) statUsers.textContent = users.length;
    if (statFavs) statFavs.textContent = totalFavs;
    if (statUpdated) statUpdated.textContent = new Date().toLocaleDateString('ko-KR');
  }

  function loadAdminUsers() {
    const users = Auth.getUsers();
    const listEl = document.getElementById('admin-user-list');
    if (!listEl) return;
    if (users.length === 0) {
      listEl.innerHTML = '<p class="admin-empty">등록된 사용자가 없습니다.</p>';
      return;
    }
    listEl.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>사용자명</th><th>이메일</th><th>가입일</th><th>관심 브랜드</th><th>관리</th></tr></thead>
        <tbody>
          ${users.map(u => {
            const favData = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '{}');
            const favCount = (favData[u.id] || []).length;
            return `<tr>
              <td>${u.username}</td>
              <td>${u.email}</td>
              <td>${new Date(u.createdAt).toLocaleDateString('ko-KR')}</td>
              <td>${favCount}개</td>
              <td><button class="admin-btn-danger" onclick="KImpactAdmin.deleteUser('${u.id}')">삭제</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  // ── Admin API (global) ──
  window.KImpactAdmin = {
    addNewsItem() {
      const title = prompt('뉴스 제목을 입력하세요:');
      if (!title) return;
      const desc = prompt('뉴스 내용을 입력하세요:');
      const newsKey = 'kimpact_news';
      const news = JSON.parse(localStorage.getItem(newsKey) || '[]');
      news.unshift({ id: Date.now(), title, desc: desc || '', date: new Date().toISOString() });
      localStorage.setItem(newsKey, JSON.stringify(news));
      showToast('뉴스가 추가되었습니다.');
      const listEl = document.getElementById('admin-news-list');
      if (listEl) {
        listEl.innerHTML = news.map(n => `
          <div class="admin-news-item">
            <div class="ani-title">${n.title}</div>
            <div class="ani-desc">${n.desc}</div>
            <div class="ani-meta">${new Date(n.date).toLocaleDateString('ko-KR')}</div>
            <button class="admin-btn-danger" onclick="KImpactAdmin.deleteNews(${n.id})">삭제</button>
          </div>
        `).join('');
      }
    },

    deleteNews(id) {
      if (!confirm('이 뉴스를 삭제하시겠습니까?')) return;
      const newsKey = 'kimpact_news';
      const news = JSON.parse(localStorage.getItem(newsKey) || '[]').filter(n => n.id !== id);
      localStorage.setItem(newsKey, JSON.stringify(news));
      showToast('삭제되었습니다.');
      loadAdminUsers();
    },

    deleteUser(userId) {
      if (!confirm('이 사용자를 삭제하시겠습니까?')) return;
      const users = Auth.getUsers().filter(u => u.id !== userId);
      Auth.saveUsers(users);
      showToast('사용자가 삭제되었습니다.');
      loadAdminUsers();
    }
  };

  // ── Toast notification ──
  function showToast(message, type = 'success') {
    let toast = document.getElementById('kimpact-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'kimpact-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `kimpact-toast ${type} show`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── Update header UI based on auth state ──
  function updateAuthUI() {
    const loginBtns = document.querySelectorAll('[data-auth-trigger]');
    const userMenus = document.querySelectorAll('[data-auth-user]');
    const adminBtns = document.querySelectorAll('[data-auth-admin]');

    if (Auth.isLoggedIn()) {
      const user = Auth.getCurrentUser();
      loginBtns.forEach(btn => {
        btn.textContent = user.name || user.username;
        btn.classList.add('logged-in');
        btn.removeEventListener('click', openAuthModal);
        btn.addEventListener('click', showUserMenu);
      });
      userMenus.forEach(el => el.style.display = 'flex');
      if (Auth.isAdmin()) {
        adminBtns.forEach(btn => btn.style.display = 'inline-flex');
      }
    } else {
      loginBtns.forEach(btn => {
        btn.textContent = '로그인';
        btn.classList.remove('logged-in');
        btn.removeEventListener('click', showUserMenu);
        btn.addEventListener('click', openAuthModal);
      });
      userMenus.forEach(el => el.style.display = 'none');
      adminBtns.forEach(btn => btn.style.display = 'none');
    }
  }

  function showUserMenu(e) {
    e.stopPropagation();
    let menu = document.getElementById('user-dropdown');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'user-dropdown';
      const user = Auth.getCurrentUser();
      menu.innerHTML = `
        <div class="udm-header">
          <span class="udm-name">${user.name || user.username}</span>
          <span class="udm-role">${user.role === 'admin' ? '관리자' : '일반 회원'}</span>
        </div>
        ${user.role === 'admin' ? '<button class="udm-item" id="udm-admin">관리자 대시보드</button>' : ''}
        <button class="udm-item" id="udm-favorites">관심 브랜드 (${Auth.getFavorites().length})</button>
        <button class="udm-item udm-logout" id="udm-logout">로그아웃</button>
      `;
      document.body.appendChild(menu);
      menu.querySelector('#udm-logout')?.addEventListener('click', () => Auth.logout());
      menu.querySelector('#udm-admin')?.addEventListener('click', () => { menu.remove(); openAdminPanel(); });
      menu.querySelector('#udm-favorites')?.addEventListener('click', () => { menu.remove(); showFavorites(); });
      setTimeout(() => document.addEventListener('click', () => menu?.remove(), { once: true }), 0);
    } else {
      menu.remove();
    }

    const rect = e.target.getBoundingClientRect();
    menu.style.top = (rect.bottom + 8) + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
  }

  function showFavorites() {
    const favs = Auth.getFavorites();
    const msg = favs.length === 0
      ? '저장된 관심 브랜드가 없습니다.'
      : `관심 브랜드 (${favs.length}개):\n${favs.map(f => `• ${f.name}`).join('\n')}`;
    alert(msg);
  }

  // ── Expose global API ──
  window.KImpactAuth = {
    openModal: openAuthModal,
    closeModal: closeAuthModal,
    openAdmin: openAdminPanel,
    logout: () => Auth.logout(),
    isLoggedIn: () => Auth.isLoggedIn(),
    isAdmin: () => Auth.isAdmin(),
    getUser: () => Auth.getCurrentUser(),
    toggleFavorite: (id, name) => {
      if (!Auth.isLoggedIn()) {
        openAuthModal();
        showToast('관심 브랜드를 저장하려면 로그인이 필요합니다.', 'info');
        return;
      }
      const result = Auth.toggleFavorite(id, name);
      if (result.success) {
        showToast(result.added ? `${name}을(를) 관심 브랜드에 추가했습니다.` : `${name}을(를) 관심 브랜드에서 제거했습니다.`);
      }
    },
    showToast
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    createAuthModal();
    updateAuthUI();

    // Wire up any login trigger buttons
    document.querySelectorAll('[data-auth-trigger]').forEach(btn => {
      if (!Auth.isLoggedIn()) {
        btn.addEventListener('click', openAuthModal);
      }
    });

    // Wire up favorite buttons
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      const brandId = btn.dataset.favorite;
      const brandName = btn.dataset.brandName || brandId;
      btn.addEventListener('click', () => window.KImpactAuth.toggleFavorite(brandId, brandName));
    });
  });

})();
