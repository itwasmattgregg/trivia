<template>
  <div id="app">
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
  background: #000;
  color: #fff;

  min-height: 100vh;
}
</style>
