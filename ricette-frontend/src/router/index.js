import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import RecipeDetail from "../views/RecipeDetail.vue";
import AddRecipe from "../views/AddRecipe.vue";
import EditRecipe from "../views/EditRecipe.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/recipe/:id",
    name: "RecipeDetail",
    component: RecipeDetail,
    props: true,
  },
  { path: "/add", name: "AddRecipe", component: AddRecipe },
  { path: "/edit/:id", name: "EditRecipe", component: EditRecipe, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
