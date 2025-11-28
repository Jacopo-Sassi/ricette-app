<template>
  <div class="container">

    <h1>Ricette</h1>

    <div class="actions">
      <router-link to="/add" class="btn-add">
        ➕ Aggiungi Ricetta
      </router-link>

      <input
        v-model="searchQuery"
        @input="searchRecipes"
        placeholder="Cerca ricette..."
        class="search"
      />

      <select v-model="selectedCategory" @change="filterByCategory" class="select">
        <option value="">Tutte le categorie</option>
        <option>Primo</option>
        <option>Secondo</option>
        <option>Contorno</option>
        <option>Dolce</option>
        <option>Altro</option>
      </select>
    </div>

    <p v-if="loading">Caricamento...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div class="grid" v-if="!loading && recipes.length">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
      />
    </div>

    <p v-if="!loading && recipes.length === 0">Nessuna ricetta trovata.</p>

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
      allRecipes: [],       // tutte le ricette originali
      recipes: [],          // lista filtrata
      loading: true,
      error: null,
      searchQuery: "",
      selectedCategory: "",
    };
  },

  async mounted() {
    try {
      const res = await api.get("/recipes");
      const list = res.data.recipes || res.data;

      // fallback immagine + copia allRecipes
      this.allRecipes = list.map(r => ({
        ...r,
        imageUrl: r.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
      }));

      this.recipes = [...this.allRecipes];

    } catch (err) {
      this.error = "Errore nel caricamento delle ricette.";
    } finally {
      this.loading = false;
    }
  },

  methods: {
    searchRecipes() {
      const query = this.searchQuery.toLowerCase();

      this.recipes = this.allRecipes.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.ingredients.join(" ").toLowerCase().includes(query)
      );

      if (this.selectedCategory) {
        this.recipes = this.recipes.filter(
          r => r.category === this.selectedCategory
        );
      }
    },

    filterByCategory() {
      this.recipes = [...this.allRecipes];

      if (this.selectedCategory) {
        this.recipes = this.recipes.filter(
          r => r.category === this.selectedCategory
        );
      }

      if (this.searchQuery) {
        this.searchRecipes();
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 2rem;
}
.btn-add {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  margin-bottom: 1rem;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.error {
  color: red;
}
.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.search {
  padding: 6px 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.select {
  padding: 6px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
