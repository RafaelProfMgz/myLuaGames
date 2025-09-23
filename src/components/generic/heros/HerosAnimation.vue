<template>
  <div class="heros-animation-wrapper">
    <VShootingStars
      :count="30"
      :max-delay="2"
      :max-duration="60"
      color="var(--shooting-star-color)"
    />
    <VPulseStars />
  </div>
</template>

<script setup>
import VPulseStars from "@/components/animation/VPulseStars.vue";
import VShootingStars from "@/components/animation/VShootingStars.vue";
</script>

<style scoped>
/*
  Usando variáveis de CSS para fácil customização.
  Você pode definir essas variáveis em um arquivo de estilos global,
  como `settings.scss` ou diretamente aqui.
*/
:root {
  --background-top-color: #000033;
  --background-bottom-color: #000000;
  --shooting-star-color: #ffd700; /* Dourado */
  --glow-color: rgba(255, 255, 255, 0.2);
}

.heros-animation-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* Aplica o gradiente usando variáveis */
  background: linear-gradient(
    to bottom,
    var(--background-top-color),
    var(--background-bottom-color)
  );

  /* Melhora o efeito de brilho interno com um box-shadow mais sutil */
  box-shadow: inset 0 0 50px var(--glow-color);
}
</style>
