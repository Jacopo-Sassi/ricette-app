<template>
  <div class="card" @click="goToDetails">
    <div class="card-image-wrapper">
      <img :src="recipe.imageUrl" :alt="recipe.title" class="card-img" />
      <div class="image-overlay"></div>
      <div class="card-badge">
        <span class="badge-icon">🍳</span>
        <span class="badge-text">{{ recipe.time || 'N/A' }} min</span>
      </div>
      <div class="card-favorite" @click.stop="toggleFavorite">
        <span class="fav-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
      </div>
    </div>

    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ recipe.title }}</h3>
        <div class="card-rating">
          <span class="rating-star">★</span>
          <span class="rating-value">{{ recipe.rating || '4.5' }}</span>
        </div>
      </div>

      <div class="card-category">
        <span class="category-icon">{{ getCategoryIcon(recipe.category) }}</span>
        <span class="category-text">{{ recipe.category || 'Varie' }}</span>
      </div>

      <p v-if="recipe.description" class="card-description">
        {{ truncateDescription(recipe.description) }}
      </p>

      <div v-if="recipe.ingredients && recipe.ingredients.length" class="card-ingredients">
        <span class="ingredients-icon">🥘</span>
        <span class="ingredients-count">{{ recipe.ingredients.length }} ingredienti</span>
      </div>

      <div class="card-footer">
        <router-link :to="`/recipe/${recipe._id}`" class="btn-details">
          <span class="btn-text">Vedi ricetta</span>
          <span class="btn-arrow">→</span>
        </router-link>
        <button class="btn-quick" @click.stop="showQuickView">
          <span class="quick-icon">👁️</span>
        </button>
      </div>
    </div>

    <div class="card-hover-effect"></div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: Object
  },
  data() {
    return {
      isFavorite: false
    };
  },
  methods: {
    truncateDescription(desc) {
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    },
    getCategoryIcon(category) {
      const icons = {
        'Primo': '🍝',
        'Secondo': '🍖',
        'Contorno': '🥗',
        'Dolce': '🍰',
        'Antipasto': '🥙',
        'Bevanda': '🍹',
        'Varie': '🍳'
      };
      return icons[category] || '🍳';
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      // Qui potresti aggiungere una chiamata API per salvare nei preferiti
      this.$emit('favorite-toggled', { id: this.recipe._id, favorite: this.isFavorite });
    },
    goToDetails() {
      this.$router.push(`/recipe/${this.recipe._id}`);
    },
    showQuickView() {
      this.$emit('quick-view', this.recipe);
    }
  }
};
</script>

<style scoped>
/* ======= VARIABILI CARD ======= */
.card {
  --card-bg: rgba(30, 30, 30, 0.7);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  --card-shadow-hover: 0 20px 50px rgba(0, 255, 136, 0.15);
  --accent-primary: #00ff88;
  --accent-glow: rgba(0, 255, 136, 0.2);
  --text-primary: #f0f0f0;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666;
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ======= CARD CONTAINER ======= */
.card {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--card-shadow);
  transform: translateY(0);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-8px);
  border-color: var(--accent-primary);
  box-shadow:
    var(--card-shadow-hover),
    0 0 0 1px rgba(0, 255, 136, 0.1);
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(0, 255, 136, 0.03) 50%,
    transparent 70%
  );
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.card:hover .card-hover-effect {
  opacity: 1;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ======= IMMAGINE ======= */
.card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition);
  filter: brightness(0.9);
}

.card:hover .card-img {
  transform: scale(1.05);
  filter: brightness(1);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top,
    rgba(10, 10, 10, 0.9) 0%,
    transparent 100%);
  pointer-events: none;
}

/* ======= BADGE TEMPO ======= */
.card-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 255, 136, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.badge-icon {
  font-size: 0.9rem;
}

.badge-text {
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ======= PREFERITI ======= */
.card-favorite {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
}

.card-favorite:hover {
  background: rgba(255, 50, 100, 0.2);
  border-color: rgba(255, 50, 100, 0.4);
  transform: scale(1.1);
}

.fav-icon {
  font-size: 1.1rem;
  transition: var(--transition);
}

/* ======= CORPO CARD ======= */
.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1rem;
}

/* HEADER */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
  flex: 1;
  background: linear-gradient(135deg, var(--text-primary), #ddd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 215, 0, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.rating-star {
  color: #ffd700;
  font-size: 0.9rem;
}

.rating-value {
  color: #ffd700;
  font-size: 0.85rem;
  font-weight: 600;
}

/* CATEGORIA */
.card-category {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 1rem;
}

.category-text {
  color: var(--accent-primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* DESCRIZIONE */
.card-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
}

/* INGREDIENTI */
.card-ingredients {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 255, 136, 0.05);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 255, 136, 0.1);
}

.ingredients-icon {
  font-size: 0.9rem;
}

.ingredients-count {
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 500;
}

/* FOOTER */
.card-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.btn-details {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg,
    rgba(0, 255, 136, 0.9) 0%,
    rgba(0, 200, 120, 0.9) 100%);
  color: #000;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  border: none;
  cursor: pointer;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 20px rgba(0, 255, 136, 0.3),
    0 0 0 1px rgba(0, 255, 136, 0.2);
}

.btn-text {
  letter-spacing: 0.3px;
}

.btn-arrow {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.btn-details:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-quick {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.btn-quick:hover {
  background: rgba(0, 150, 255, 0.1);
  border-color: rgba(0, 150, 255, 0.3);
  color: #00ccff;
  transform: translateY(-2px);
}

.quick-icon {
  font-size: 1.1rem;
}

/* ======= RESPONSIVE ======= */
@media (max-width: 768px) {
  .card-image-wrapper {
    height: 200px;
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-footer {
    flex-direction: column;
  }

  .btn-details {
    width: 100%;
  }

  .btn-quick {
    width: 100%;
  }
}

/* ======= EFFETTI ACCESSIBILITÀ ======= */
.card:focus-within {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* ======= ANIMAZIONE ENTRATA ======= */
.card {
  animation: cardEntrance 0.6s ease-out backwards;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ======= DARK MODE SUPPORTO ======= */
@media (prefers-color-scheme: dark) {
  .card {
    --card-bg: rgba(25, 25, 25, 0.8);
  }
}

/* ======= REDUCED MOTION ======= */
@media (prefers-reduced-motion: reduce) {
  .card,
  .card * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .card:hover {
    transform: none;
  }
}
</style>
