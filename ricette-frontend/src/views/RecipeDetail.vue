<template>
  <div v-if="!loaded" class="loading-container">
    <div class="loading-spinner"></div>
    <p class="loading-text">Caricamento ricetta...</p>
  </div>

  <div v-else-if="error" class="error-container">
    <div class="error-icon">⚠️</div>
    <h2 class="error-title">Ricetta non trovata</h2>
    <p class="error-message">{{ error }}</p>
    <router-link to="/" class="btn-back">← Torna alla Home</router-link>
  </div>

  <div v-else class="recipe-container">
    <!-- Recipe Hero Section -->
    <div class="recipe-hero">
      <div class="hero-gradient"></div>
      <img
        :src="recipe.imageUrl || placeholder"
        :alt="recipe.title"
        class="hero-image"
        @error="imageError = true"
      />

      <div class="hero-overlay">
        <div class="hero-content">
          <!-- Breadcrumb -->
          <div class="breadcrumb">
            <router-link to="/" class="breadcrumb-link">🏠 Home</router-link>
            <span class="breadcrumb-divider">›</span>
            <span class="breadcrumb-current">{{ recipe.category }}</span>
          </div>

          <!-- Title and Actions -->
          <div class="hero-header">
            <div class="title-wrapper">
              <h1 class="recipe-title">{{ recipe.title }}</h1>
              <div class="title-meta">
                <span class="recipe-rating">
                  <span class="rating-star">★</span>
                  <span class="rating-value">{{ recipe.rating || '4.5' }}</span>
                </span>
                <span class="recipe-difficulty" :class="recipe.difficulty || 'medium'">
                  {{ getDifficultyText(recipe.difficulty) }}
                </span>
              </div>
            </div>

            <div class="hero-actions">

              <div class="action-dropdown">
                <button class="action-btn more-btn">
                  <span class="action-text">Altre</span>
                </button>
                <div class="dropdown-menu">
                  <router-link :to="`/edit/${recipe._id}`" class="dropdown-item">
                    <span class="dropdown-icon">✏️</span>
                    <span>Modifica</span>
                  </router-link>
                  <button @click="confirmDelete" class="dropdown-item delete">
                    <span class="dropdown-icon">🗑️</span>
                    <span>Elimina</span>
                  </button>
                  <button @click="printRecipe" class="dropdown-item">
                    <span class="dropdown-icon">🖨️</span>
                    <span>Stampa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recipe Meta -->
          <div class="recipe-meta">
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <div class="meta-content">
                <span class="meta-label">Preparazione</span>
                <span class="meta-value">{{ recipe.prepTime || '30' }} min</span>
              </div>
            </div>

            <div class="meta-item">
              <span class="meta-icon">🍽️</span>
              <div class="meta-content">
                <span class="meta-label">Porzioni</span>
                <span class="meta-value">{{ recipe.servings || '4' }} persone</span>
              </div>
            </div>

            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <div class="meta-content">
                <span class="meta-label">Creata il</span>
                <span class="meta-value">{{ formatDate(recipe.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="recipe-content">
      <div class="content-grid">
        <!-- Left Column: Ingredients -->
        <div class="ingredients-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">🥕</span>
              <span>Ingredienti</span>
            </h2>
            <button @click="toggleShoppingList" class="btn-shopping-list">
              <span class="btn-icon">🛒</span>
              <span>Lista della spesa</span>
            </button>
          </div>

          <div class="ingredients-list">
            <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item">
              <label class="ingredient-checkbox">
                <input type="checkbox" @change="toggleIngredient(index)" />
                <span class="checkmark"></span>
              </label>
              <span class="ingredient-text">{{ ingredient }}</span>
              <button @click="editIngredient(index)" class="ingredient-edit" title="Modifica">
                ✎
              </button>
            </div>
          </div>

          <!-- Shopping List -->
          <transition name="slide">
            <div v-if="showShoppingList" class="shopping-list">
              <div class="shopping-header">
                <h3>🛒 Lista della Spesa</h3>
                <button @click="clearShoppingList" class="btn-clear-list">Pulisci</button>
              </div>
              <div class="shopping-items">
                <div v-for="(ing, index) in shoppingList" :key="index" class="shopping-item">
                  <span>{{ ing }}</span>
                  <button @click="removeFromShoppingList(index)" class="remove-item">×</button>
                </div>
              </div>
              <button @click="printShoppingList" class="btn-print-list">
                🖨️ Stampa Lista
              </button>
            </div>
          </transition>
        </div>

        <!-- Right Column: Steps and Description -->
        <div class="steps-section">
          <!-- Description -->
          <div class="description-card">
            <div class="description-header">
              <h3 class="description-title">
                <span class="title-icon">📖</span>
                <span>Descrizione</span>
              </h3>
              <button @click="toggleDescription" class="btn-toggle">
                {{ showFullDescription ? 'Riduci' : 'Espandi' }}
              </button>
            </div>
            <p class="description-text" :class="{ expanded: showFullDescription }">
              {{ recipe.description }}
            </p>
            <button
              v-if="recipe.description.length > 200 && !showFullDescription"
              @click="showFullDescription = true"
              class="btn-read-more"
            >
              Leggi tutto ↓
            </button>
          </div>

          <!-- Steps -->
          <div class="steps-card">
            <div class="section-header">
              <h2 class="section-title">
                <span class="title-icon">👨‍🍳</span>
                <span>Procedimento</span>
              </h2>
              <div class="steps-meta">
                <span class="steps-count">{{ recipe.steps.length }} passaggi</span>
                <button @click="startCookingMode" class="btn-cooking-mode">
                  🍳 Modalità Cottura
                </button>
              </div>
            </div>

            <div class="steps-list">
              <div v-for="(step, index) in recipe.steps" :key="index" class="step-item">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <p class="step-text">{{ step }}</p>
                  <div class="step-actions">
                    <button @click="editStep(index)" class="step-action" title="Modifica">
                      ✎
                    </button>
                    <button @click="addTimer(index)" class="step-action" title="Aggiungi timer">
                      ⏱️
                    </button>
                    <button @click="toggleStep(index)" class="step-action" :class="{ completed: completedSteps[index] }" title="Segna come completato">
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cooking Mode Modal -->
          <transition name="modal">
            <div v-if="cookingMode" class="cooking-modal">
              <div class="cooking-header">
                <h3>🍳 Modalità Cottura</h3>
                <button @click="cookingMode = false" class="btn-close-cooking">×</button>
              </div>
              <div class="cooking-content">
                <div class="cooking-step">
                  <div class="cooking-step-number">Passaggio {{ currentStep + 1 }}</div>
                  <p class="cooking-step-text">{{ recipe.steps[currentStep] }}</p>
                </div>
                <div class="cooking-navigation">
                  <button @click="prevStep" :disabled="currentStep === 0" class="btn-cooking-nav">
                    ← Precedente
                  </button>
                  <button @click="nextStep" :disabled="currentStep === recipe.steps.length - 1" class="btn-cooking-nav">
                    Successivo →
                  </button>
                  <button @click="completeCooking" class="btn-cooking-complete">
                    🎉 Ho finito!
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="additional-info">
        <div class="info-card">
          <h3 class="info-title">
            <span class="title-icon">📊</span>
            <span>Informazioni Nutrizionali</span>
          </h3>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <span class="nutrition-label">Calorie</span>
              <span class="nutrition-value">~350 kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">Carboidrati</span>
              <span class="nutrition-value">45g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">Proteine</span>
              <span class="nutrition-value">20g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-label">Grassi</span>
              <span class="nutrition-value">12g</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="info-title">
            <span class="title-icon">💡</span>
            <span>Suggerimenti</span>
          </h3>
          <ul class="tips-list">
            <li>Lasciar riposare l'impasto per 30 minuti</li>
            <li>Servire caldo per un sapore migliore</li>
            <li>Conservare in frigorifero fino a 3 giorni</li>
          </ul>
        </div>

        <div class="info-card">
          <h3 class="info-title">
            <span class="title-icon">🏷️</span>
            <span>Tag</span>
          </h3>
          <div class="tags">
            <span class="tag">{{ recipe.category }}</span>
            <span class="tag">Fatto in casa</span>
            <span class="tag">Facile</span>
            <span class="tag">Vegetariano</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-icon">🗑️</div>
          <h3 class="modal-title">Eliminare questa ricetta?</h3>
          <p class="modal-text">Questa azione è irreversibile. La ricetta verrà eliminata permanentemente.</p>

          <div class="modal-actions">
            <button @click="deleteRecipe" class="btn-modal btn-danger">
              Elimina Permanentemente
            </button>
            <button @click="showDeleteConfirm = false" class="btn-modal btn-cancel">
              Annulla
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Share Modal -->
    <transition name="modal">
      <div v-if="showShareModal" class="modal-overlay">
        <div class="modal-content share-modal">
          <div class="modal-icon">📤</div>
          <h3 class="modal-title">Condividi Ricetta</h3>

          <div class="share-options">
            <button @click="copyLink" class="share-option">
              <span class="share-icon">🔗</span>
              <span>Copia link</span>
            </button>
            <button @click="shareWhatsApp" class="share-option">
              <span class="share-icon">💬</span>
              <span>WhatsApp</span>
            </button>
            <button @click="shareFacebook" class="share-option">
              <span class="share-icon">📘</span>
              <span>Facebook</span>
            </button>
            <button @click="shareTwitter" class="share-option">
              <span class="share-icon">🐦</span>
              <span>Twitter</span>
            </button>
          </div>

          <div class="modal-actions">
            <button @click="showShareModal = false" class="btn-modal btn-cancel">
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Timer (optional) -->
    <div v-if="activeTimer" class="floating-timer">
      <div class="timer-display">
        <span class="timer-time">{{ formatTimer(activeTimer.time) }}</span>
        <span class="timer-label">{{ activeTimer.label }}</span>
      </div>
      <button @click="stopTimer" class="timer-stop">×</button>
    </div>
  </div>
</template>

<script>
import { api } from "../api";

export default {
  name: "RecipeDetail",
  data() {
    return {
      recipe: null,
      loaded: false,
      error: null,
      imageError: false,
      isFavorite: false,
      showFullDescription: false,
      showShoppingList: false,
      cookingMode: false,
      currentStep: 0,
      completedSteps: [],
      showDeleteConfirm: false,
      showShareModal: false,
      shoppingList: [],
      activeTimer: null,
      placeholder: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80"
    };
  },
  async mounted() {
    await this.fetchRecipe();
    this.checkFavorite();
    this.loadShoppingList();
  },
  methods: {
    async fetchRecipe() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/recipes/${id}`);
        this.recipe = res.data;
        this.completedSteps = new Array(this.recipe.steps.length).fill(false);
        this.loaded = true;
      } catch (err) {
        this.error = "Ricetta non trovata o errore nel caricamento.";
        this.loaded = true;
      }
    },
    checkFavorite() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      this.isFavorite = favorites.includes(this.recipe._id);
    },
    toggleFavorite() {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

      if (this.isFavorite) {
        const index = favorites.indexOf(this.recipe._id);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      } else {
        favorites.push(this.recipe._id);
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.isFavorite = !this.isFavorite;
    },
    toggleShoppingList() {
      this.showShoppingList = !this.showShoppingList;
      if (!this.showShoppingList) {
        this.saveShoppingList();
      }
    },
    loadShoppingList() {
      const saved = localStorage.getItem(`shopping_${this.recipe._id}`);
      if (saved) {
        this.shoppingList = JSON.parse(saved);
      }
    },
    saveShoppingList() {
      localStorage.setItem(`shopping_${this.recipe._id}`, JSON.stringify(this.shoppingList));
    },
    toggleIngredient(index) {
      const ingredient = this.recipe.ingredients[index];
      const shoppingIndex = this.shoppingList.indexOf(ingredient);

      if (shoppingIndex === -1) {
        this.shoppingList.push(ingredient);
      } else {
        this.shoppingList.splice(shoppingIndex, 1);
      }
      this.saveShoppingList();
    },
    clearShoppingList() {
      this.shoppingList = [];
      this.saveShoppingList();
    },
    removeFromShoppingList(index) {
      this.shoppingList.splice(index, 1);
      this.saveShoppingList();
    },
    printShoppingList() {
      const printContent = this.shoppingList.join('\n');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Lista della Spesa - ${this.recipe.title}</title></head>
          <body>
            <h1>Lista della Spesa: ${this.recipe.title}</h1>
            <pre>${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.print();
    },
    startCookingMode() {
      this.cookingMode = true;
      this.currentStep = 0;
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    nextStep() {
      if (this.currentStep < this.recipe.steps.length - 1) {
        this.currentStep++;
      }
    },
    completeCooking() {
      this.cookingMode = false;
      alert('🎉 Complimenti! Hai completato la ricetta!');
    },
    toggleStep(index) {
      this.$set(this.completedSteps, index, !this.completedSteps[index]);
    },
    addTimer(index) {
      const time = prompt('Imposta timer (minuti):', '5');
      if (time) {
        this.activeTimer = {
          time: parseInt(time) * 60,
          label: `Passaggio ${index + 1}`,
          interval: null
        };

        this.activeTimer.interval = setInterval(() => {
          if (this.activeTimer.time > 0) {
            this.activeTimer.time--;
          } else {
            this.stopTimer();
            alert('⏰ Timer scaduto!');
          }
        }, 1000);
      }
    },
    stopTimer() {
      if (this.activeTimer && this.activeTimer.interval) {
        clearInterval(this.activeTimer.interval);
      }
      this.activeTimer = null;
    },
    formatTimer(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    editIngredient(index) {
      const newValue = prompt('Modifica ingrediente:', this.recipe.ingredients[index]);
      if (newValue !== null) {
        this.$set(this.recipe.ingredients, index, newValue);
      }
    },
    editStep(index) {
      const newValue = prompt('Modifica passaggio:', this.recipe.steps[index]);
      if (newValue !== null) {
        this.$set(this.recipe.steps, index, newValue);
      }
    },
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
    },
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    async deleteRecipe() {
      try {
        await api.delete(`/recipes/${this.recipe._id}`);
        this.$router.push('/');
      } catch (err) {
        alert('Errore durante l\'eliminazione della ricetta');
      } finally {
        this.showDeleteConfirm = false;
      }
    },
    shareRecipe() {
      this.showShareModal = true;
    },
    copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copiato negli appunti!');
        this.showShareModal = false;
      });
    },
    shareWhatsApp() {
      const text = `Guarda questa ricetta: ${this.recipe.title} - ${window.location.href}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    },
    shareFacebook() {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    },
    shareTwitter() {
      const text = `Guarda questa ricetta: ${this.recipe.title}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
    },
    printRecipe() {
      window.print();
    },
    getDifficultyText(difficulty) {
      const difficulties = {
        'easy': 'Facile',
        'medium': 'Media',
        'hard': 'Difficile',
        'expert': 'Esperto'
      };
      return difficulties[difficulty] || 'Media';
    },
    formatDate(dateString) {
      if (!dateString) return 'Data sconosciuta';
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
/* ======= VARIABILI ======= */
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #151515;
  --bg-elevated: #1e1e1e;
  --bg-glass: rgba(30, 30, 30, 0.8);
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
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 8px;
  --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.3);
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ======= LOADING & ERROR STATES ======= */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.error-title {
  color: var(--error);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.error-message {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 500px;
}

.btn-back {
  padding: 1rem 2rem;
  background: var(--accent-primary);
  color: #000;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: var(--transition);
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
}

/* ======= RECIPE HERO ======= */
.recipe-hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  max-height: 700px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
  margin-bottom: 3rem;
}

.hero-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top,
    var(--bg-primary) 0%,
    transparent 100%);
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
  transition: var(--transition);
}

.recipe-hero:hover .hero-image {
  transform: scale(1.02);
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem;
  z-index: 2;
  background: linear-gradient(to top,
    rgba(0, 0, 0, 0.9) 0%,
    transparent 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.breadcrumb-link:hover {
  color: var(--accent-primary);
}

.breadcrumb-divider {
  color: var(--text-tertiary);
}

.breadcrumb-current {
  color: var(--accent-primary);
  font-weight: 600;
}

/* Hero Header */
.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-wrapper {
  flex: 1;
}

.recipe-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1.1;
}

.title-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.recipe-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 215, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.rating-star {
  color: #ffd700;
  font-size: 0.9rem;
}

.rating-value {
  color: #ffd700;
  font-weight: 600;
}

.recipe-difficulty {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.recipe-difficulty.easy {
  background: rgba(0, 255, 136, 0.2);
  color: var(--accent-primary);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.recipe-difficulty.medium {
  background: rgba(255, 170, 0, 0.2);
  color: var(--warning);
  border: 1px solid rgba(255, 170, 0, 0.3);
}

.recipe-difficulty.hard,
.recipe-difficulty.expert {
  background: rgba(255, 85, 85, 0.2);
  color: var(--error);
  border: 1px solid rgba(255, 85, 85, 0.3);
}

/* Hero Actions */
.hero-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.favorite-btn.active {
  background: rgba(255, 50, 100, 0.3);
  border-color: rgba(255, 50, 100, 0.5);
}

.favorite-btn.active .action-icon {
  animation: heartBeat 0.6s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.action-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: var(--transition);
  z-index: 100;
}

.action-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-item.delete {
  color: var(--error);
}

/* Recipe Meta */
.recipe-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.meta-value {
  font-weight: 600;
  color: white;
}

/* ======= RECIPE CONTENT ======= */
.recipe-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* ======= INGREDIENTS SECTION ======= */
.ingredients-section {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-md);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.title-icon {
  font-size: 1.8rem;
}

.btn-shopping-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-shopping-list:hover {
  background: rgba(0, 255, 136, 0.2);
  transform: translateY(-2px);
}

/* Ingredients List */
.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dark);
  transition: var(--transition);
}

.ingredient-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-light);
}

.ingredient-checkbox {
  position: relative;
  cursor: pointer;
}

.ingredient-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-light);
  border-radius: 4px;
  position: relative;
  transition: var(--transition);
}

.ingredient-checkbox input:checked ~ .checkmark {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.ingredient-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.ingredient-text {
  flex: 1;
  color: var(--text-primary);
}

.ingredient-edit {
  opacity: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  padding: 0.25rem;
  border-radius: 4px;
}

.ingredient-item:hover .ingredient-edit {
  opacity: 1;
}

.ingredient-edit:hover {
  color: var(--accent-primary);
  background: rgba(0, 255, 136, 0.1);
}

/* Shopping List */
.shopping-list {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(0, 150, 255, 0.05);
  border: 1px solid rgba(0, 150, 255, 0.2);
  border-radius: var(--radius-md);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shopping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shopping-header h3 {
  margin: 0;
  color: var(--accent-secondary);
}

.btn-clear-list {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: var(--radius-sm);
  color: var(--error);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-clear-list:hover {
  background: rgba(255, 85, 85, 0.2);
}

.shopping-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.shopping-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-sm);
}

.remove-item {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
  padding: 0 0.25rem;
}

.remove-item:hover {
  color: var(--error);
}

.btn-print-list {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-print-list:hover {
  background: rgba(0, 150, 255, 0.2);
}

/* ======= STEPS SECTION ======= */
.steps-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.description-card,
.steps-card {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-md);
}

.description-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.description-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.description-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  transition: var(--transition);
  max-height: 4.8em;
  overflow: hidden;
  position: relative;
}

.description-text.expanded {
  max-height: none;
}

.description-text:not(.expanded)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2em;
  background: linear-gradient(transparent, var(--bg-elevated));
}

.btn-read-more {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-read-more:hover {
  background: rgba(0, 255, 136, 0.2);
}

/* Steps Meta */
.steps-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.steps-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-cooking-mode {
  padding: 0.6rem 1rem;
  background: rgba(255, 170, 0, 0.1);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-radius: var(--radius-md);
  color: var(--warning);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cooking-mode:hover {
  background: rgba(255, 170, 0, 0.2);
  transform: translateY(-2px);
}

/* Steps List */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dark);
  transition: var(--transition);
}

.step-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-light);
}

.step-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  border-radius: 50%;
  font-weight: 800;
  color: #000;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-text {
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.step-actions {
  display: flex;
  gap: 0.5rem;
}

.step-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
}

.step-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

.step-action.completed {
  background: rgba(0, 255, 136, 0.2);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Cooking Modal */
.cooking-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-dark);
  box-shadow: var(--shadow-lg);
  z-index: 2000;
  overflow: hidden;
}

.cooking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 170, 0, 0.1);
  border-bottom: 1px solid var(--border-dark);
}

.cooking-header h3 {
  margin: 0;
  color: var(--warning);
}

.btn-close-cooking {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  padding: 0.25rem 0.5rem;
}

.btn-close-cooking:hover {
  color: var(--text-primary);
}

.cooking-content {
  padding: 2rem;
}

.cooking-step {
  text-align: center;
  margin-bottom: 2rem;
}

.cooking-step-number {
  font-size: 1.2rem;
  color: var(--accent-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.cooking-step-text {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.cooking-navigation {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-cooking-nav {
  flex: 1;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cooking-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-cooking-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-cooking-complete {
  flex: 2;
  padding: 1rem;
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cooking-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
}

/* ======= ADDITIONAL INFO ======= */
.additional-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
}

.info-card {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-dark);
}

.info-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
}

.nutrition-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.nutrition-value {
  font-weight: 600;
  color: var(--text-primary);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-dark);
}

.tips-list li:last-child {
  border-bottom: none;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 0.8rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 20px;
  color: var(--accent-primary);
  font-size: 0.9rem;
}

/* ======= MODALS ======= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  animation: modalEnter 0.4s ease;
  border: 1px solid var(--border-dark);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.modal-title {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.modal-text {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-modal {
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
}

.btn-danger {
  background: rgba(255, 85, 85, 0.9);
  color: white;
}

.btn-danger:hover {
  background: #ff5555;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 85, 85, 0.3);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: var(--border-dark);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Share Modal */
.share-modal {
  max-width: 400px;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
}

.share-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.share-icon {
  font-size: 2rem;
}

/* ======= FLOATING TIMER ======= */
.floating-timer {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 1px solid var(--border-dark);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: slideInRight 0.3s ease;
  z-index: 1000;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-time {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.timer-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.timer-stop {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 85, 85, 0.2);
  border: 1px solid rgba(255, 85, 85, 0.4);
  border-radius: 50%;
  color: var(--error);
  cursor: pointer;
  transition: var(--transition);
}

.timer-stop:hover {
  background: rgba(255, 85, 85, 0.3);
  transform: rotate(90deg);
}

/* ======= RESPONSIVE ======= */
@media (max-width: 768px) {
  .recipe-hero {
    height: 50vh;
    min-height: 400px;
  }

  .hero-overlay {
    padding: 2rem 1.5rem;
  }

  .hero-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }

  .hero-actions {
    justify-content: center;
  }

  .recipe-meta {
    justify-content: center;
  }

  .content-grid {
    padding: 0 1rem;
  }

  .ingredients-section {
    position: static;
  }

  .modal-content {
    padding: 2rem 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .floating-timer {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .recipe-title {
    font-size: 2rem;
  }

  .action-btn .action-text {
    display: none;
  }

  .action-btn {
    padding: 0.75rem;
  }

  .meta-item {
    flex: 1;
    min-width: 140px;
  }

  .additional-info {
    grid-template-columns: 1fr;
  }
}

/* ======= ANIMATION CLASSES ======= */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
