<template>
  <div id="app">
    <!-- Navbar futuristic -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo/Title -->
        <router-link to="/" class="nav-brand">
          <span class="brand-icon">🍳</span>
          <span class="brand-text">Ricette<span class="brand-accent">AI</span></span>
        </router-link>

        <!-- Navigation Links -->
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            <span class="link-icon">🏠</span>
            <span class="link-text">Home</span>
          </router-link>
          <router-link to="/add" class="nav-link add-link">
            <span class="link-icon">+</span>
            <span class="link-text">Nuova Ricetta</span>
          </router-link>
          <router-link to="/favorites" class="nav-link">
            <span class="link-icon">❤️</span>
            <span class="link-text">Preferiti</span>
          </router-link>
          <router-link to="/categories" class="nav-link">
            <span class="link-icon">📂</span>
            <span class="link-text">Categorie</span>
          </router-link>
        </div>

        <!-- User/Action Area -->
        <div class="nav-actions">
          <button class="action-btn search-btn" @click="toggleSearch">
            <span class="action-icon">🔍</span>
          </button>
          <button class="action-btn theme-btn" @click="toggleTheme">
            <span class="action-icon">{{ themeIcon }}</span>
          </button>
          <div class="user-avatar" @click="toggleUserMenu">
            <span class="avatar-icon">👨‍🍳</span>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="menu-icon"></span>
        </button>
      </div>

      <!-- Search Bar -->
      <transition name="slide-down">
        <div v-if="showSearch" class="search-bar">
          <div class="search-container">
            <input
              type="text"
              placeholder="Cerca ricette, ingredienti..."
              class="nav-search"
              ref="searchInput"
            />
            <button class="search-close" @click="closeSearch">
              <span>×</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- User Menu Dropdown -->
      <transition name="fade">
        <div v-if="showUserMenu" class="user-menu">
          <div class="menu-header">
            <div class="menu-avatar">
              <span class="avatar-icon-large">👨‍🍳</span>
            </div>
            <div class="menu-user-info">
              <h4>Chef Utente</h4>
              <p>Premium Member</p>
            </div>
          </div>
          <div class="menu-items">
            <a href="#" class="menu-item">

              <span>Profilo</span>
            </a>
            <a href="#" class="menu-item">

              <span>Impostazioni</span>
            </a>
            <a href="#" class="menu-item">

              <span>Statistiche</span>
            </a>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item logout">
              
              <span>Esci</span>
            </a>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Mobile Menu Overlay -->
    <transition name="slide">
      <div v-if="showMobileMenu" class="mobile-menu-overlay">
        <div class="mobile-menu">
          <div class="mobile-menu-header">
            <h3>Menu</h3>
            <button class="close-menu" @click="closeMobileMenu">
              <span>×</span>
            </button>
          </div>
          <div class="mobile-links">
            <router-link to="/" class="mobile-link" @click.native="closeMobileMenu">
              <span class="mobile-icon">🏠</span>
              <span>Home</span>
            </router-link>
            <router-link to="/add" class="mobile-link" @click.native="closeMobileMenu">
              <span class="mobile-icon">+</span>
              <span>Nuova Ricetta</span>
            </router-link>
            <router-link to="/favorites" class="mobile-link" @click.native="closeMobileMenu">
              <span class="mobile-icon">❤️</span>
              <span>Preferiti</span>
            </router-link>
            <router-link to="/categories" class="mobile-link" @click.native="closeMobileMenu">
              <span class="mobile-icon">📂</span>
              <span>Categorie</span>
            </router-link>
            <div class="mobile-divider"></div>
            <a href="#" class="mobile-link">
              <span class="mobile-icon">👤</span>
              <span>Profilo</span>
            </a>
            <a href="#" class="mobile-link">
              <span class="mobile-icon">⚙️</span>
              <span>Impostazioni</span>
            </a>
            <a href="#" class="mobile-link">
              <span class="mobile-icon">🚪</span>
              <span>Esci</span>
            </a>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main :class="['main-content', { 'blur': showMobileMenu }]">
      <router-view />
    </main>

    <!-- Floating Action Button -->
    <router-link to="/add" class="fab">
      <span class="fab-icon">+</span>
    </router-link>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>🍳 RicetteAI</h4>
          <p>La tua collezione digitale di ricette</p>
          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">🐦</a>
            <a href="#" class="social-link">📷</a>
            <a href="#" class="social-link">🎥</a>
          </div>
        </div>
        <div class="footer-section">
          <h5>Esplora</h5>
          <a href="#">Ricette del giorno</a>
          <a href="#">Tendenze</a>
          <a href="#">Chef in evidenza</a>
          <a href="#">Ricette stagionali</a>
        </div>
        <div class="footer-section">
          <h5>Supporto</h5>
          <a href="#">Contattaci</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Termini d'uso</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 RicetteAI. Tutti i diritti riservati.</p>
        <div class="footer-tech">
          <span>Vue 3</span>
          <span>•</span>
          <span>Node.js</span>
          <span>•</span>
          <span>MongoDB</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showSearch: false,
      showUserMenu: false,
      showMobileMenu: false,
      isDarkTheme: true
    };
  },
  computed: {
    themeIcon() {
      return this.isDarkTheme ? '🌙' : '☀️';
    }
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      }
    },
    closeSearch() {
      this.showSearch = false;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    closeMobileMenu() {
      this.showMobileMenu = false;
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    },
    handleClickOutside(event) {
      if (!event.target.closest('.user-avatar') && !event.target.closest('.user-menu')) {
        this.showUserMenu = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    // Imposta tema iniziale
    document.documentElement.setAttribute('data-theme', 'dark');
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style>
/* ======= VARIABILI GLOBALI ======= */
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #151515;
  --bg-elevated: #1e1e1e;
  --bg-glass: rgba(30, 30, 30, 0.8);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666;
  --accent-primary: #00ff88;
  --accent-secondary: #00ccff;
  --accent-glow: rgba(0, 255, 136, 0.15);
  --border-dark: #2a2a2a;
  --border-light: #3a3a3a;
  --success: #00ff88;
  --warning: #ffaa00;
  --error: #ff5555;
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="light"] {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-elevated: #ffffff;
  --bg-glass: rgba(255, 255, 255, 0.8);
  --text-primary: #1a1a1a;
  --text-secondary: #666;
  --text-tertiary: #888;
  --border-dark: #e0e0e0;
  --border-light: #d0d0d0;
}

/* ======= RESET & BASE ======= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ======= NAVBAR ======= */
.navbar {
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-dark);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  transition: var(--transition);
}

.brand-icon {
  font-size: 1.8rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.brand-text {
  background: linear-gradient(135deg, var(--text-primary), var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-accent {
  color: var(--accent-primary);
  margin-left: 2px;
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-exact-active {
  color: var(--accent-primary);
  background: rgba(0, 255, 136, 0.1);
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background: var(--accent-primary);
  border-radius: 1px;
}

.add-link {
  background: rgba(0, 255, 136, 0.1);
  color: var(--accent-primary);
  font-weight: 600;
}

.add-link:hover {
  background: rgba(0, 255, 136, 0.2);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-size: 1.1rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-light);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  font-size: 1.2rem;
}

.user-avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}



/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: relative;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: var(--transition);
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  bottom: -8px;
}

/* Search Bar */
.search-bar {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-dark);
  z-index: 999;
}

.search-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
}

.nav-search {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition);
}

.nav-search:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
}

.search-close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: var(--radius-md);
  color: var(--error);
  cursor: pointer;
  font-size: 1.5rem;
  transition: var(--transition);
}

.search-close:hover {
  background: rgba(255, 85, 85, 0.2);
  transform: rotate(90deg);
}

/* User Menu */
.user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 2rem;
  width: 280px;
  background: var(--bg-glass);
  backdrop-filter: blur(30px);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1001;
  overflow: hidden;
}

.menu-header {
  padding: 1.5rem;
  background: rgba(0, 255, 136, 0.05);
  border-bottom: 1px solid var(--border-dark);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  font-size: 1.5rem;
}

.menu-user-info h4 {
  margin: 0;
  color: var(--text-primary);
}

.menu-user-info p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.menu-items {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.logout {
  color: var(--error);
}

.menu-divider {
  height: 1px;
  background: var(--border-dark);
  margin: 0.5rem 1rem;
}

/* ======= MAIN CONTENT ======= */
.main-content {
  flex: 1;
  transition: var(--transition);
}

.main-content.blur {
  filter: blur(4px);
  pointer-events: none;
}

/* ======= MOBILE MENU ======= */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.mobile-menu {
  width: 320px;
  background: var(--bg-elevated);
  height: 100%;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.mobile-menu-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-menu {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 2rem;
  cursor: pointer;
}

.mobile-links {
  padding: 1rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  transition: var(--transition);
}

.mobile-link:hover,
.mobile-link.router-link-exact-active {
  background: rgba(0, 255, 136, 0.1);
  color: var(--accent-primary);
}

.mobile-divider {
  height: 1px;
  background: var(--border-dark);
  margin: 1rem 0;
}

/* ======= FLOATING ACTION BUTTON ======= */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: 800;
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
  z-index: 100;
  transition: var(--transition);
}

.fab:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4);
}

/* ======= FOOTER ======= */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-dark);
  margin-top: 4rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section h4,
.footer-section h5 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.footer-section p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.footer-section a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: var(--transition);
}

.footer-section a:hover {
  color: var(--accent-primary);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 1.2rem;
  transition: var(--transition);
}

.social-link:hover {
  background: var(--accent-primary);
  color: #000;
  transform: translateY(-3px);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-tech {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.footer-tech span {
  color: var(--text-tertiary);
}

/* ======= ANIMAZIONI ======= */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* ======= RESPONSIVE ======= */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .nav-actions {
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .fab {
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .user-menu {
    right: 1rem;
    width: calc(100vw - 2rem);
  }

  .mobile-menu {
    width: 100%;
  }
}
</style>
