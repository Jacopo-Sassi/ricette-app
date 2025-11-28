<template>
  <div>
    <nav style="padding: 1rem; background:#eee; display:flex; gap:1rem;">
      <router-link to="/">Home</router-link>
      <router-link to="/add">Aggiungi Ricetta</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {};
</script>
