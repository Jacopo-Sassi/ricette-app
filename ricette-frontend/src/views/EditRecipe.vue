<template>
  <div class="container">

    <h1 class="page-title">Modifica Ricetta</h1>

    <form class="form" @submit.prevent="updateRecipe" v-if="loaded">

      <!-- TITOLO -->
      <div class="form-group">
        <label>Titolo</label>
        <input
          v-model="title"
          required
          class="input"
          placeholder="Titolo della ricetta"
        />
      </div>

      <!-- DESCRIZIONE -->
      <div class="form-group">
        <label>Descrizione</label>
        <textarea
          v-model="description"
          required
          class="input textarea"
          placeholder="Descrizione breve"
        ></textarea>
      </div>

      <!-- CATEGORIA -->
      <div class="form-group">
        <label>Categoria</label>
        <select v-model="category" required class="input">
          <option>Primo</option>
          <option>Secondo</option>
          <option>Contorno</option>
          <option>Dolce</option>
          <option>Altro</option>
        </select>
      </div>

      <!-- URL IMMAGINE + PREVIEW -->
      <div class="form-group">
        <label>URL Immagine</label>
        <input
          v-model="imageUrl"
          class="input"
          placeholder="https://example.com/image.jpg"
        />

        <div class="image-preview-wrapper" v-if="imageUrl">
          <img
            :src="imageUrl"
            @error="imageError = true"
            @load="imageError = false"
            class="image-preview"
          />
          <p v-if="imageError" class="img-error">
            Immagine non valida 💥
          </p>
        </div>
      </div>

      <!-- INGREDIENTI -->
      <div class="form-group">
        <label>Ingredienti</label>

        <div class="dynamic-list">
          <div
            v-for="(ing, index) in ingredients"
            :key="index"
            class="list-item"
          >
            <input
              v-model="ingredients[index]"
              class="input"
              placeholder="Ingrediente"
            />
            <button
              @click.prevent="removeIngredient(index)"
              class="btn-remove"
            >
              ✖
            </button>
          </div>

          <button
            @click.prevent="addIngredient"
            class="btn-add-small"
          >
            ➕ Aggiungi ingrediente
          </button>
        </div>
      </div>

      <!-- PASSAGGI -->
      <div class="form-group">
        <label>Passaggi</label>

        <div class="dynamic-list">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="list-item"
          >
            <input
              v-model="steps[index]"
              class="input"
              placeholder="Passaggio"
            />
            <button
              @click.prevent="removeStep(index)"
              class="btn-remove"
            >
              ✖
            </button>
          </div>

          <button
            @click.prevent="addStep"
            class="btn-add-small"
          >
            ➕ Aggiungi passaggio
          </button>
        </div>
      </div>

      <!-- SUBMIT -->
      <button type="submit" class="btn-submit">
        Salva Modifiche
      </button>

      <p v-if="error" class="error">{{ error }}</p>

    </form>

    <p v-else class="loading">Caricamento ricetta...</p>

  </div>
</template>

<script>
import { api } from "../api";

export default {
  name: "EditRecipe",

  data() {
    return {
      loaded: false,
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      ingredients: [],
      steps: [],
      imageError: false,
      error: null
    };
  },

  async mounted() {
    const id = this.$route.params.id;

    try {
      const res = await api.get(`/recipes/${id}`);
      const recipe = res.data;

      // Popola i campi
      this.title = recipe.title;
      this.description = recipe.description;
      this.category = recipe.category;
      this.imageUrl = recipe.imageUrl || "";
      this.ingredients = recipe.ingredients?.length ? recipe.ingredients : [""];
      this.steps = recipe.steps?.length ? recipe.steps : [""];
      this.loaded = true;

    } catch (err) {
      this.error = "Errore nel caricamento della ricetta.";
    }
  },

  methods: {
    addIngredient() {
      this.ingredients.push("");
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },

    addStep() {
      this.steps.push("");
    },
    removeStep(index) {
      this.steps.splice(index, 1);
    },

    async updateRecipe() {
      try {
        const id = this.$route.params.id;

        const body = {
          title: this.title,
          description: this.description,
          category: this.category,
          imageUrl: this.imageUrl.trim() !== "" ? this.imageUrl : null,
          ingredients: this.ingredients.filter(i => i.trim() !== ""),
          steps: this.steps.filter(s => s.trim() !== "")
        };

        await api.put(`/recipes/${id}`, body);

        this.$router.push("/");
      } catch (err) {
        this.error = "Errore durante il salvataggio delle modifiche.";
      }
    }
  }
};
</script>

<style scoped>
/* ======= DARK FORM ======= */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem;
  background: #111;
  min-height: 100vh;
  color: #eee;
  font-family: "Inter", sans-serif;
}

.page-title {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 2.2rem;
  text-align: center;
  text-shadow: 0 0 20px rgba(0, 255, 140, 0.15);
}

.form {
  background: #161616;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0,255,150,0.05);
  border: 1px solid #222;
}

.form-group {
  margin-bottom: 1.6rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #ccc;
}

/* INPUT */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1b1b1b;
  border: 1px solid #2b2b2b;
  border-radius: 10px;
  color: #eee;
  transition: 0.25s;
}

.input:focus {
  border-color: #00d26a;
  box-shadow: 0 0 8px rgba(0,255,180,0.3);
  background: #222;
}

.textarea {
  min-height: 100px;
}

/* IMAGE PREVIEW */
.image-preview-wrapper {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview {
  width: 260px;
  height: 170px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #333;
  box-shadow: 0 4px 18px rgba(0, 255, 150, 0.15);
  transition: 0.25s ease;
}

.image-preview:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 25px rgba(0, 255, 150, 0.25);
}

.img-error {
  color: #ff5b5b;
  margin-top: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* LISTE DINAMICHE */
.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.list-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-remove {
  background: #ff4d4d;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-remove:hover {
  background: #ff2a2a;
}

.btn-add-small {
  background: #00b85a;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

.btn-add-small:hover {
  background: #009f4f;
}

/* SUBMIT */
.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #00d26a, #00b85a);
  color: white;
  padding: 0.9rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: 0.3s;
  box-shadow: 0 4px 15px rgba(0,255,140,0.25);
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0,255,140,0.35);
}

.error {
  text-align: center;
  margin-top: 1rem;
  color: #ff5b5b;
  font-weight: 600;
}

.loading {
  text-align: center;
  font-size: 1.4rem;
  color: #aaa;
}
</style>
