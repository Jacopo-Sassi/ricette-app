<template>
  <div class="card">
    <img :src="recipe.imageUrl" alt="" class="card-img" />
    <div class="card-body">
      <h3>{{ recipe.title }}</h3>
      <p class="category">{{ recipe.category }}</p>
      <router-link :to="`/recipe/${recipe._id}`" class="btn-details">Dettagli</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: Object
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 280px;
  background: #fff;
}
.card-img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}
.card-body {
  padding: 1rem;
}
.category {
  color: #888;
  font-size: 0.9rem;
}
.btn-details {
  margin-top: 0.5rem;
  display: inline-block;
  color: #fff;
  background: #007bff;
  padding: 6px 10px;
  border-radius: 5px;
  text-decoration: none;
}
</style>
