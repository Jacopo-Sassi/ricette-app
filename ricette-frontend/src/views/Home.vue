<template>
  <div class="container">

    <h1 class="page-title">Ricette</h1>

    <div class="actions">
      <router-link to="/add" class="btn-add">
        <span class="btn-icon">+</span>
        Nuova Ricetta
      </router-link>

      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          @input="searchRecipes"
          placeholder="Cerca ricette, ingredienti..."
          class="input search"
          type="search"
        />
        <div class="search-icon">🔍</div>
      </div>

      <div class="select-wrapper">
        <select v-model="selectedCategory" @change="filterByCategory" class="input select">
          <option value="">Tutte le categorie</option>
          <option>Primo</option>
          <option>Secondo</option>
          <option>Contorno</option>
          <option>Dolce</option>
          <option>Antipasto</option>
          <option>Bevanda</option>
        </select>
        <div class="select-arrow">▼</div>
      </div>
    </div>

    <!-- Contatore risultati -->
    <div v-if="!loading && recipes.length > 0" class="results-info">
      <div class="results-count">
        <span class="count">{{ recipes.length }}</span>
        <span class="text">ricette trovate</span>
      </div>
      <button
        v-if="searchQuery || selectedCategory"
        @click="clearFilters"
        class="btn-clear"
      >
        ⨯ Cancella filtri
      </button>
    </div>

    <!-- Stati caricamento/errore -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Caricamento ricette...</p>
    </div>

    <div v-if="error" class="state-container error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-text">{{ error }}</p>
      <button @click="retryLoading" class="btn-retry">Riprova</button>
    </div>

    <!-- Griglia ricette -->
    <div v-if="!loading && recipes.length" class="grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
      />
    </div>

    <!-- Stato vuoto -->
    <div v-if="!loading && recipes.length === 0" class="state-container empty-state">
      <div class="empty-icon">🍽️</div>
      <p class="empty-text">Nessuna ricetta trovata</p>
      <p v-if="searchQuery || selectedCategory" class="empty-subtext">
        Prova a modificare i filtri di ricerca
      </p>
      <router-link to="/add" class="btn-empty-add">
        + Crea la tua prima ricetta
      </router-link>
    </div>

  </div>
</template>

<script>
import { api } from "../api";
import RecipeCard from "../components/RecipeCard.vue";

export default {
  name: "Home",
  components: { RecipeCard },

  data() {
    return {
      allRecipes: [],
      recipes: [],
      loading: true,
      error: null,
      searchQuery: "",
      selectedCategory: "",
      searchTimeout: null
    };
  },

  async mounted() {
    await this.fetchRecipes();
  },

  methods: {
    async fetchRecipes() {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.get("/recipes");
        const list = res.data.recipes || res.data;

        this.allRecipes = list.map(r => ({
          ...r,
          imageUrl: r.imageUrl || "/api/placeholder/300/200"
        }));

        this.recipes = [...this.allRecipes];
      } catch (err) {
        console.error("Errore caricamento:", err);
        this.error = "Impossibile caricare le ricette. Verifica la connessione.";
      } finally {
        this.loading = false;
      }
    },

    searchRecipes() {
      clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(() => {
        const q = this.searchQuery.toLowerCase().trim();

        let filtered = [...this.allRecipes];

        if (q) {
          filtered = filtered.filter(r =>
            r.title.toLowerCase().includes(q) ||
            (r.ingredients && r.ingredients.join(" ").toLowerCase().includes(q)) ||
            (r.description && r.description.toLowerCase().includes(q))
          );
        }

        if (this.selectedCategory) {
          filtered = filtered.filter(r => r.category === this.selectedCategory);
        }

        this.recipes = filtered;
      }, 300);
    },

    filterByCategory() {
      this.searchRecipes();
    },

    clearFilters() {
      this.searchQuery = "";
      this.selectedCategory = "";
      this.recipes = [...this.allRecipes];
    },

    retryLoading() {
      this.fetchRecipes();
    }
  }
};
</script>

<style scoped>
/* ======= VARIABILI ======= */
.container {
  --bg-primary: #0a0a0a;
  --bg-secondary: #151515;
  --bg-elevated: #1e1e1e;
  --bg-glass: rgba(30, 30, 30, 0.7);
  --accent-primary: #00ff88;
  --accent-secondary: #00ccff;
  --accent-glow: rgba(0, 255, 136, 0.15);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666;
  --border-dark: #2a2a2a;
  --border-light: #3a3a3a;
  --success: #00ff88;
  --warning: #ffaa00;
  --error: #ff5555;
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 10px 20px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ======= LAYOUT BASE ======= */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(0, 150, 255, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg-primary) 0%, #0f0f0f 100%);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
}

.container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg,
    rgba(0, 255, 136, 0.03) 0%,
    transparent 100%);
  pointer-events: none;
  z-index: 0;
}

/* ======= TITOLO ======= */
.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 2.5rem;
  text-align: center;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  line-height: 1.1;
  letter-spacing: -0.02em;
  z-index: 1;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg,
    transparent,
    var(--accent-primary),
    transparent);
  border-radius: 2px;
  opacity: 0.5;
}

/* ======= BARRA AZIONI ======= */
.actions {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 1;
}

/* ======= PULSANTE AGGIUNGI ======= */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg,
    var(--accent-primary) 0%,
    #00cc7a 100%);
  color: #000;
  padding: 1rem 1.75rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  box-shadow:
    0 4px 15px rgba(0, 255, 136, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-add::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.6s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(0, 255, 136, 0.4),
    0 0 0 1px rgba(0, 255, 136, 0.1);
}

.btn-add:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: 800;
}

/* ======= RICERCA ======= */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search {
  width: 100%;
  padding: 1rem 1.5rem 1rem 3rem;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid var(--border-dark);
  color: var(--text-primary);
  font-size: 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.search:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow:
    0 0 0 3px rgba(0, 255, 136, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
  background: rgba(25, 25, 25, 0.9);
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
  pointer-events: none;
  font-size: 1.1rem;
}

/* ======= SELECT ======= */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select {
  width: 100%;
  padding: 1rem 1.5rem 1rem 1rem;
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid var(--border-dark);
  color: var(--text-primary);
  font-size: 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  appearance: none;
  transition: var(--transition);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow:
    0 0 0 3px rgba(0, 255, 136, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  color: var(--text-secondary);
  pointer-events: none;
  font-size: 0.8rem;
  transition: var(--transition);
}

.select:focus + .select-arrow {
  transform: rotate(180deg);
  color: var(--accent-primary);
}

/* ======= INFO RISULTATI ======= */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 30, 30, 0.5);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dark);
}

.results-count {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.results-count .count {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-primary);
}

.results-count .text {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.btn-clear {
  background: rgba(255, 85, 85, 0.1);
  color: var(--error);
  border: 1px solid rgba(255, 85, 85, 0.3);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-clear:hover {
  background: rgba(255, 85, 85, 0.2);
  border-color: var(--error);
}

/* ======= STATI ======= */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 3rem;
  border-radius: var(--radius-lg);
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid var(--border-dark);
  margin: 2rem 0;
}

/* Loading */
.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
}

/* Error */
.error-state {
  border-color: rgba(255, 85, 85, 0.3);
  background: rgba(255, 85, 85, 0.05);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.error-text {
  color: var(--error);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.btn-retry {
  background: linear-gradient(135deg,
    var(--accent-primary) 0%,
    #00cc7a 100%);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 136, 0.3);
}

/* Empty */
.empty-state {
  border-color: rgba(0, 255, 136, 0.1);
  background: rgba(0, 255, 136, 0.03);
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-text {
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 2rem;
}

.btn-empty-add {
  background: rgba(0, 255, 136, 0.1);
  color: var(--accent-primary);
  border: 1px solid rgba(0, 255, 136, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.btn-empty-add:hover {
  background: rgba(0, 255, 136, 0.2);
  transform: translateY(-2px);
}

/* ======= GRIGLIA ======= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

/* ======= ANIMAZIONI ======= */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* ======= RESPONSIVE ======= */
@media (max-width: 1024px) {
  .actions {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .btn-add {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 2rem 1rem;
  }

  .page-title {
    margin-bottom: 2rem;
  }

  .actions {
    padding: 1.25rem;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .results-info {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .state-container {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 2.2rem;
  }
}

/* ======= UTILITIES ======= */
.input::placeholder {
  color: var(--text-tertiary);
}

* {
  box-sizing: border-box;
}

/* Ottimizzazioni performance */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
