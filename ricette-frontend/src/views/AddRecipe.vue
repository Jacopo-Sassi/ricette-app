<template>
  <div class="container">
    <!-- Header con icona -->
    <div class="page-header">
      <div class="header-icon">✨</div>
      <h1 class="page-title">Crea Nuova Ricetta</h1>
      <p class="page-subtitle">Condividi la tua ricetta con la community</p>
    </div>

    <!-- Card del form -->
    <div class="form-card">
      <!-- Progress indicator -->
      <div class="form-progress">
        <div class="progress-steps">
          <div v-for="step in 4" :key="step"
               :class="['progress-step', { active: currentStep >= step }]">
            <span class="step-number">{{ step }}</span>
            <span class="step-label">{{ getStepLabel(step) }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage }"></div>
        </div>
      </div>

      <form class="form" @submit.prevent="submitRecipe">
        <!-- STEP 1: Informazioni base -->
        <div v-show="currentStep === 1" class="form-step">
          <div class="step-header">
            <div class="step-icon">📝</div>
            <h2>Informazioni Base</h2>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏷️</span>
                <span class="label-text">Titolo Ricetta</span>
                <span class="label-required">*</span>
              </label>
              <input
                v-model="title"
                required
                class="input"
                placeholder="Es: Hamburger Gourmet con Salsa Speciale"
                @focus="highlightField('title')"
                @blur="unhighlightField"
              />
              <div class="input-hint">Sii creativo e descrittivo!</div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">📋</span>
                <span class="label-text">Categoria</span>
                <span class="label-required">*</span>
              </label>
              <div class="category-selector">
                <button
                  v-for="cat in categories"
                  :key="cat.value"
                  :class="['category-option', { active: category === cat.value }]"
                  @click.prevent="category = cat.value"
                  type="button"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-text">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <span class="label-icon">📖</span>
                <span class="label-text">Descrizione</span>
                <span class="label-required">*</span>
              </label>
              <textarea
                v-model="description"
                required
                class="input textarea"
                placeholder="Racconta la storia della tua ricetta, cosa la rende speciale..."
                rows="4"
                @focus="highlightField('description')"
                @blur="unhighlightField"
              ></textarea>
              <div class="char-count">{{ description.length }}/500</div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Immagine e Dettagli -->
        <div v-show="currentStep === 2" class="form-step">
          <div class="step-header">
            <div class="step-icon">🖼️</div>
            <h2>Immagine e Dettagli</h2>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label class="form-label">
                <span class="label-icon">📸</span>
                <span class="label-text">Immagine della Ricetta</span>
              </label>

              <div class="image-upload" :class="{ 'has-image': imagePreview }" @click="triggerFileUpload">
                <div v-if="imagePreview" class="image-preview">
                  <img :src="imagePreview" alt="Anteprima" class="preview-img" />
                  <button @click.stop="removeImage" class="remove-image-btn">×</button>
                </div>
                <div v-else class="upload-placeholder">
                  <div class="upload-icon">📤</div>
                  <p>Trascina un'immagine o clicca per selezionare</p>
                  <p class="upload-hint">Formati supportati: JPG, PNG, GIF</p>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="file-input"
                />
              </div>

              <div class="url-input-group" v-if="!imagePreview">
                <input
                  v-model="imageUrl"
                  class="input"
                  placeholder="Oppure inserisci URL immagine..."
                  @focus="highlightField('imageUrl')"
                  @blur="unhighlightField"
                />
                <button @click.prevent="testImageUrl" class="btn-test-url" type="button">
                  Test
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">⏱️</span>
                <span class="label-text">Tempo di Preparazione (min)</span>
              </label>
              <div class="time-input">
                <input
                  v-model.number="prepTime"
                  type="number"
                  min="1"
                  max="300"
                  class="input"
                  placeholder="30"
                />
                <div class="time-presets">
                  <button
                    v-for="time in [15, 30, 45, 60]"
                    :key="time"
                    @click.prevent="prepTime = time"
                    class="time-preset"
                    type="button"
                  >
                    {{ time }}min
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">👨‍🍳</span>
                <span class="label-text">Difficoltà</span>
              </label>
              <div class="difficulty-selector">
                <button
                  v-for="diff in difficultyLevels"
                  :key="diff.value"
                  :class="['diff-option', { active: difficulty === diff.value }]"
                  @click.prevent="difficulty = diff.value"
                  type="button"
                >
                  <span class="diff-icon">{{ diff.icon }}</span>
                  <span class="diff-text">{{ diff.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Ingredienti -->
        <div v-show="currentStep === 3" class="form-step">
          <div class="step-header">
            <div class="step-icon">🥕</div>
            <h2>Ingredienti</h2>
          </div>

          <div class="ingredients-container">
            <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-item">
              <div class="ingredient-number">{{ index + 1 }}</div>
              <div class="ingredient-inputs">
                <input
                  v-model="ingredients[index]"
                  class="input"
                  :placeholder="`Ingrediente ${index + 1} (es: 200g farina)`"
                  @focus="highlightField('ingredients')"
                  @blur="unhighlightField"
                />
                <div class="ingredient-hint">Quantità + ingrediente</div>
              </div>
              <button
                @click.prevent="removeIngredient(index)"
                class="btn-remove-ingredient"
                :disabled="ingredients.length <= 1"
              >
                <span class="remove-icon">×</span>
              </button>
            </div>

            <button @click.prevent="addIngredient" class="btn-add-ingredient">
              <span class="add-icon">+</span>
              <span>Aggiungi Ingrediente</span>
            </button>
          </div>

          <div class="ingredients-tip">
            <div class="tip-icon">💡</div>
            <p>Specifica le quantità precise per ottenere risultati migliori!</p>
          </div>
        </div>

        <!-- STEP 4: Passaggi -->
        <div v-show="currentStep === 4" class="form-step">
          <div class="step-header">
            <div class="step-icon">👨‍🍳</div>
            <h2>Passaggi di Preparazione</h2>
          </div>

          <div class="steps-container">
            <div v-for="(step, index) in steps" :key="index" class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <textarea
                  v-model="steps[index]"
                  class="input step-textarea"
                  :placeholder="`Passaggio ${index + 1} - Descrivi il procedimento...`"
                  rows="3"
                  @focus="highlightField('steps')"
                  @blur="unhighlightField"
                ></textarea>
                <div class="step-actions">
                  <button
                    @click.prevent="removeStep(index)"
                    class="btn-remove-step"
                    :disabled="steps.length <= 1"
                  >
                    Elimina
                  </button>
                  <button
                    @click.prevent="moveStepUp(index)"
                    class="btn-move-step"
                    :disabled="index === 0"
                  >
                    ↑
                  </button>
                  <button
                    @click.prevent="moveStepDown(index)"
                    class="btn-move-step"
                    :disabled="index === steps.length - 1"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>

            <button @click.prevent="addStep" class="btn-add-step">
              <span class="add-icon">+</span>
              <span>Aggiungi Passaggio</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
          <button
            v-if="currentStep > 1"
            @click.prevent="previousStep"
            class="btn-nav btn-prev"
            type="button"
          >
            <span class="nav-icon">←</span>
            <span>Indietro</span>
          </button>

          <div class="nav-spacer"></div>

          <button
            v-if="currentStep < 4"
            @click.prevent="nextStep"
            class="btn-nav btn-next"
            type="button"
          >
            <span>Continua</span>
            <span class="nav-icon">→</span>
          </button>

          <button
            v-if="currentStep === 4"
            type="submit"
            class="btn-submit"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">🎉 Pubblica Ricetta</span>
            <span v-else class="submitting">
              <span class="spinner"></span>
              Pubblicazione...
            </span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <div class="error-icon">⚠️</div>
          <p>{{ error }}</p>
          <button @click="error = null" class="btn-dismiss">×</button>
        </div>

        <!-- Success Modal -->
        <transition name="modal">
          <div v-if="showSuccess" class="success-modal">
            <div class="modal-content">
              <div class="modal-icon">🎉</div>
              <h3>Ricetta Pubblicata!</h3>
              <p>La tua ricetta è stata salvata con successo.</p>
              <div class="modal-actions">
                <button @click="goToRecipe" class="btn-modal btn-primary">
                  Vai alla Ricetta
                </button>
                <button @click="goToHome" class="btn-modal btn-secondary">
                  Torna alla Home
                </button>
                <button @click="createAnother" class="btn-modal btn-ghost">
                  Crea un'altra ricetta
                </button>
              </div>
            </div>
          </div>
        </transition>
      </form>
    </div>

    <!-- AI Assistant -->
    <div class="ai-assistant">
      <button @click="toggleAIAssistant" class="ai-toggle">
        <span class="ai-icon">🤖</span>
        <span class="ai-text">AI Assistant</span>
      </button>

      <transition name="slide">
        <div v-if="showAIAssistant" class="ai-panel">
          <div class="ai-header">
            <h4>AI Recipe Assistant</h4>
            <button @click="showAIAssistant = false" class="ai-close">×</button>
          </div>
          <div class="ai-content">
            <p>Vuoi che ti aiuti a completare la ricetta?</p>
            <button @click="suggestIngredients" class="ai-action">
              🥕 Suggerisci ingredienti
            </button>
            <button @click="improveDescription" class="ai-action">
              ✨ Migliora descrizione
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { api } from "../api";

export default {
  name: "AddRecipe",
  data() {
    return {
      currentStep: 1,
      isSubmitting: false,
      showSuccess: false,
      showAIAssistant: false,

      // Form fields
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      imagePreview: "",
      prepTime: 30,
      difficulty: "medium",
      ingredients: [""],
      steps: [""],

      // UI state
      error: null,
      highlightedField: null,

      // Constants
      categories: [
        { value: "Primo", icon: "🍝", label: "Primo" },
        { value: "Secondo", icon: "🍖", label: "Secondo" },
        { value: "Contorno", icon: "🥗", label: "Contorno" },
        { value: "Dolce", icon: "🍰", label: "Dolce" },
        { value: "Antipasto", icon: "🥙", label: "Antipasto" },
        { value: "Bevanda", icon: "🍹", label: "Bevanda" },
        { value: "Altro", icon: "🍳", label: "Altro" }
      ],
      difficultyLevels: [
        { value: "easy", icon: "😊", label: "Facile" },
        { value: "medium", icon: "😐", label: "Media" },
        { value: "hard", icon: "😅", label: "Difficile" },
        { value: "expert", icon: "🧑‍🍳", label: "Esperto" }
      ]
    };
  },
  computed: {
    progressPercentage() {
      return `${(this.currentStep / 4) * 100}%`;
    }
  },
  methods: {
    getStepLabel(step) {
      const labels = ["", "Base", "Media", "Dettagli", "Passi"];
      return labels[step];
    },

    highlightField(field) {
      this.highlightedField = field;
    },

    unhighlightField() {
      this.highlightedField = null;
    },

    nextStep() {
      if (this.currentStep < 4) {
        // Validate current step
        if (this.currentStep === 1 && !this.validateStep1()) {
          return;
        }
        this.currentStep++;
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    validateStep1() {
      if (!this.title.trim()) {
        this.error = "Il titolo è obbligatorio";
        return false;
      }
      if (!this.category) {
        this.error = "Seleziona una categoria";
        return false;
      }
      if (!this.description.trim() || this.description.length < 10) {
        this.error = "Inserisci una descrizione significativa (min. 10 caratteri)";
        return false;
      }
      this.error = null;
      return true;
    },

    addIngredient() {
      this.ingredients.push("");
    },

    removeIngredient(index) {
      if (this.ingredients.length > 1) {
        this.ingredients.splice(index, 1);
      }
    },

    addStep() {
      this.steps.push("");
    },

    removeStep(index) {
      if (this.steps.length > 1) {
        this.steps.splice(index, 1);
      }
    },

    moveStepUp(index) {
      if (index > 0) {
        const temp = this.steps[index - 1];
        this.steps[index - 1] = this.steps[index];
        this.steps[index] = temp;
      }
    },

    moveStepDown(index) {
      if (index < this.steps.length - 1) {
        const temp = this.steps[index + 1];
        this.steps[index + 1] = this.steps[index];
        this.steps[index] = temp;
      }
    },

    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          this.imageUrl = "";
        };
        reader.readAsDataURL(file);
      }
    },

    removeImage() {
      this.imagePreview = "";
      this.imageUrl = "";
      this.$refs.fileInput.value = "";
    },

    testImageUrl() {
      if (this.imageUrl) {
        // Simulate URL testing
        this.imagePreview = this.imageUrl;
      }
    },

    toggleAIAssistant() {
      this.showAIAssistant = !this.showAIAssistant;
    },

    suggestIngredients() {
      // AI suggestion logic would go here
      const suggestions = [
        "200g farina 00",
        "2 uova",
        "100ml latte",
        "1 pizzico di sale",
        "1 cucchiaio di olio extravergine"
      ];
      this.ingredients = suggestions;
    },

    improveDescription() {
      // AI improvement logic would go here
      if (this.description) {
        this.description = `${this.description} (migliorato dall'AI)`;
      }
    },

    async submitRecipe() {
      if (!this.validateStep1()) {
        this.currentStep = 1;
        return;
      }

      this.isSubmitting = true;
      this.error = null;

      try {
        const body = {
          title: this.title.trim(),
          description: this.description.trim(),
          category: this.category,
          imageUrl: this.imagePreview || this.imageUrl || "/api/placeholder/600/400",
          prepTime: this.prepTime,
          difficulty: this.difficulty,
          ingredients: this.ingredients.filter(i => i.trim() !== ""),
          steps: this.steps.filter(s => s.trim() !== ""),
          rating: 0,
          favorites: 0
        };

        const response = await api.post("/recipes", body);

        // Store the created recipe ID for success modal
        this.createdRecipeId = response.data._id;
        this.showSuccess = true;

      } catch (err) {
        console.error("Errore durante il salvataggio:", err);
        this.error = err.response?.data?.message || "Errore durante il salvataggio della ricetta. Riprova.";
      } finally {
        this.isSubmitting = false;
      }
    },

    goToRecipe() {
      this.$router.push(`/recipe/${this.createdRecipeId}`);
    },

    goToHome() {
      this.$router.push("/");
    },

    createAnother() {
      this.showSuccess = false;
      this.resetForm();
    },

    resetForm() {
      this.currentStep = 1;
      this.title = "";
      this.description = "";
      this.category = "";
      this.imageUrl = "";
      this.imagePreview = "";
      this.prepTime = 30;
      this.difficulty = "medium";
      this.ingredients = [""];
      this.steps = [""];
      this.error = null;
    }
  },

  watch: {
    description(newVal) {
      if (newVal.length > 500) {
        this.description = newVal.substring(0, 500);
      }
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

/* ======= LAYOUT BASE ======= */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(0, 255, 136, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(0, 150, 255, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg-primary) 0%, #0f0f0f 100%);
  position: relative;
}

/* ======= HEADER ======= */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* ======= FORM CARD ======= */
.form-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

/* ======= PROGRESS INDICATOR ======= */
.form-progress {
  margin-bottom: 3rem;
}

.progress-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: var(--transition);
}

.progress-step.active {
  opacity: 1;
}

.step-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--border-dark);
  border-radius: 50%;
  font-weight: 700;
  color: var(--text-secondary);
  transition: var(--transition);
}

.progress-step.active .step-number {
  background: var(--accent-primary);
  color: #000;
  border-color: var(--accent-primary);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.step-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* ======= FORM STEPS ======= */
.form-step {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.step-icon {
  font-size: 2.5rem;
}

.step-header h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin: 0;
}

/* ======= FORM GRID ======= */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* ======= FORM LABELS ======= */
.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.label-icon {
  font-size: 1.1rem;
}

.label-required {
  color: var(--error);
  margin-left: 2px;
}

/* ======= INPUTS ======= */
.input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(20, 20, 20, 0.8);
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: var(--transition);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow:
    0 0 0 4px rgba(0, 255, 136, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.2);
  background: rgba(25, 25, 25, 0.9);
}

.textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

.input-hint {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
  opacity: 0.8;
}

.char-count {
  position: absolute;
  bottom: 0.75rem;
  right: 1rem;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

/* ======= CATEGORY SELECTOR ======= */
.category-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.category-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-light);
  transform: translateY(-2px);
}

.category-option.active {
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.2);
}

.cat-icon {
  font-size: 1.8rem;
}

.cat-text {
  font-size: 0.9rem;
  font-weight: 600;
}

/* ======= IMAGE UPLOAD ======= */
.image-upload {
  background: rgba(20, 20, 20, 0.5);
  border: 2px dashed var(--border-dark);
  border-radius: var(--radius-md);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.image-upload:hover {
  border-color: var(--accent-primary);
  background: rgba(0, 255, 136, 0.05);
}

.image-upload.has-image {
  padding: 0;
  border-style: solid;
  height: 250px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.remove-image-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  color: var(--error);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.remove-image-btn:hover {
  background: rgba(255, 85, 85, 0.9);
  color: white;
}

.upload-placeholder .upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
}

.file-input {
  display: none;
}

.url-input-group {
  display: flex;
  gap: 0.75rem;
}

.btn-test-url {
  white-space: nowrap;
  padding: 0 1.5rem;
  background: rgba(0, 150, 255, 0.1);
  border: 2px solid rgba(0, 150, 255, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-test-url:hover {
  background: rgba(0, 150, 255, 0.2);
  transform: translateY(-1px);
}

/* ======= TIME INPUT ======= */
.time-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.time-preset {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.time-preset:hover {
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* ======= DIFFICULTY SELECTOR ======= */
.difficulty-selector {
  display: flex;
  gap: 0.5rem;
}

.diff-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.diff-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.diff-option.active {
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* ======= INGREDIENTS ======= */
.ingredients-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ingredient-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: start;
}

.ingredient-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  font-weight: 700;
  color: var(--accent-primary);
}

.ingredient-inputs {
  flex: 1;
}

.btn-remove-ingredient {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 50%;
  color: var(--error);
  cursor: pointer;
  transition: var(--transition);
}

.btn-remove-ingredient:hover:not(:disabled) {
  background: rgba(255, 85, 85, 0.2);
  transform: scale(1.1);
}

.btn-remove-ingredient:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-add-ingredient {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 255, 136, 0.1);
  border: 2px dashed rgba(0, 255, 136, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;
}

.btn-add-ingredient:hover {
  background: rgba(0, 255, 136, 0.2);
  border-style: solid;
  transform: translateY(-2px);
}

.add-icon {
  font-size: 1.2rem;
  font-weight: 800;
}

.ingredients-tip {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-md);
  margin-top: 2rem;
}

.tip-icon {
  font-size: 1.5rem;
}

/* ======= STEPS ======= */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
}

.step-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  border-radius: 50%;
  font-size: 1.3rem;
  font-weight: 800;
  color: #000;
}

.step-content {
  flex: 1;
}

.step-textarea {
  min-height: 100px;
}

.step-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btn-remove-step {
  padding: 0.5rem 1rem;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: var(--radius-sm);
  color: var(--error);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-remove-step:hover:not(:disabled) {
  background: rgba(255, 85, 85, 0.2);
}

.btn-remove-step:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-move-step {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.btn-move-step:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-light);
}

.btn-move-step:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-add-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: rgba(0, 150, 255, 0.1);
  border: 2px dashed rgba(0, 150, 255, 0.3);
  border-radius: var(--radius-md);
  color: var(--accent-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1rem;
}

.btn-add-step:hover {
  background: rgba(0, 150, 255, 0.2);
  border-style: solid;
  transform: translateY(-2px);
}

/* ======= FORM NAVIGATION ======= */
.form-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-dark);
}

.btn-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-nav:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-light);
  transform: translateY(-2px);
}

.nav-spacer {
  flex: 1;
}

.btn-submit {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 255, 136, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submitting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ======= ERROR MESSAGE ======= */
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: var(--radius-md);
  margin-top: 2rem;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error-icon {
  font-size: 1.5rem;
}

.error-message p {
  flex: 1;
  color: var(--error);
  font-weight: 600;
  margin: 0;
}

.btn-dismiss {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-dismiss:hover {
  color: var(--error);
}

/* ======= SUCCESS MODAL ======= */
.success-modal {
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
  z-index: 2000;
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
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.modal-content h3 {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.modal-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-modal {
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), #00cc7a);
  color: #000;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: var(--border-dark);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* ======= AI ASSISTANT ======= */
.ai-assistant {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.ai-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  transition: var(--transition);
}

.ai-toggle:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.6);
}

.ai-panel {
  position: absolute;
  bottom: calc(100% + 1rem);
  right: 0;
  width: 300px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border-dark);
}

.ai-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.ai-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.ai-close:hover {
  color: var(--text-primary);
}

.ai-content {
  padding: 1.5rem;
}

.ai-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.ai-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--border-light);
  transform: translateY(-2px);
}

/* ======= RESPONSIVE ======= */
@media (max-width: 768px) {
  .container {
    padding: 1.5rem 1rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .progress-steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .category-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  .difficulty-selector {
    flex-wrap: wrap;
  }

  .step-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    justify-self: start;
  }

  .form-navigation {
    flex-direction: column;
  }

  .btn-nav,
  .btn-submit {
    width: 100%;
  }

  .modal-content {
    padding: 2rem 1.5rem;
  }

  .modal-actions {
    gap: 0.75rem;
  }

  .ai-panel {
    width: calc(100vw - 3rem);
    right: -1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2.2rem;
  }

  .category-selector {
    grid-template-columns: 1fr;
  }

  .time-presets {
    justify-content: center;
  }

  .ai-toggle {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .ai-toggle .ai-text {
    display: none;
  }
}

/* ======= UTILITIES ======= */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* ======= ANIMATIONS ======= */
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
  transform: translateY(20px);
}
</style>
