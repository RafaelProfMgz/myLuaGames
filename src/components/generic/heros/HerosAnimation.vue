<template>
  <div class="heros-animation-wrapper">
    <VShootingStars
      :count="30"
      :maxDelay="2"
      :maxDuration="60"
      color="#FFDDAA"
    />
    <VPulseStars />
  </div>
</template>

<script setup>
import VPulseStars from "@/components/animation/VPulseStars.vue";
import VShootingStars from "@/components/animation/VShootingStars.vue";
</script>

<style scoped>
.heros-animation-wrapper {
  position: relative;
  width: 100%;
  height: 100vh; /* Exemplo: altura total da tela */
  overflow: hidden; /* Evita barras de rolagem */
  background: linear-gradient(to bottom, #000033, #000000);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
