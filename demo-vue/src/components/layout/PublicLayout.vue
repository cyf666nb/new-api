<template>
  <div class="public-shell">
    <nav class="nav public-nav">
      <RouterLink class="nav-logo" to="/index.html">幻 MIRAX API</RouterLink>
      <div class="nav-links">
        <RouterLink class="nav-link" to="/docs">文档</RouterLink>
        <RouterLink class="nav-link" to="/skills">Skills</RouterLink>
        <RouterLink class="nav-link" to="/pricing.html">定价</RouterLink>
        <RouterLink class="nav-link" to="/rankings.html">排行</RouterLink>
        <RouterLink class="nav-link" to="/dashboard.html">控制台</RouterLink>
        <RouterLink class="nav-btn" to="/sign-in.html">登录</RouterLink>
      </div>
    </nav>
    <slot />
  </div>
</template>

<style scoped>
.public-shell {
  min-height: 100vh;
  background: #fafaf9;
}

.public-nav {
  background: rgba(250, 250, 249, 0.86);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(18px);
}

.nav-logo {
  text-decoration: none;
}

.router-link-active.nav-link {
  color: #1a1815;
}
</style>
