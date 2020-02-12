<template>
  <div id="app" class="min-h-screen bg-gray-200">
    <router-view />
  </div>
</template>

<style lang="postcss">
/* purgecss start ignore */
@tailwind base;
@tailwind components;
/* purgecss end ignore */

@tailwind utilities;

#app {
  display: flex;
  justify-content: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
