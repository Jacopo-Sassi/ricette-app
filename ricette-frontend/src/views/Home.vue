<template>
  <div class="container">

    <h1>Ricette</h1>

    <router-link to="/add" class="btn-add">
      ➕ Aggiungi Ricetta
    </router-link>

    <p v-if="loading">Caricamento...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- LISTA RICETTE -->
    <div class="grid" v-if="!loading && recipes.length">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="{
          ...recipe,
          imageUrl: recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'
        }"
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
      recipes: [],
      loading: true,
      error: null
    };
  },

  async mounted() {
    try {
      const res = await api.get("/recipes");
      this.recipes = res.data.recipes || res.data;

      // Fallback immagini lato frontend
      this.recipes = this.recipes.map(r => ({
        ...r,
        imageUrl: r.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
      }));

    } catch (err) {
      this.error = "Errore nel caricamento delle ricette.";
    } finally {
      this.loading = false;
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
</style>
