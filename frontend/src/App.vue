<template>
  <div class="app-shell">
    <header class="app-topbar">
      <div class="brand">
        <div class="brand-mark">SS</div>
        <div>
          <div class="brand-title">智习空间</div>
          <div class="brand-subtitle">用户端 / 商家端</div>
        </div>
      </div>
      <nav class="app-nav">
        <router-link to="/client/home">用户端</router-link>
        <router-link to="/merchant/home">商家端</router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>
