<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NavBar />
    <main>
      <slot />
    </main>
    <footer class="border-t border-border/50 py-8 mt-20">
      <div class="container text-center text-muted-foreground text-sm font-mono">
        <span class="text-primary">></span> connor@xconnor.tv ~ <span class="animate-blink text-primary">_</span>
      </div>
    </footer>
  </div>
</template>
