<template>
  <div class="pulse-stars-container">
    <canvas ref="pulseStarsCanvas" class="pulse-stars-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "VPulseStars",
  mounted() {
    const canvas = this.$refs.pulseStarsCanvas;
    const ctx = canvas.getContext("2d");
    const starCount = 12;
    const stars = [];
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.3, // Entre 1 e 2 px
        opacity: Math.random(),
        color: `rgb(${r}, ${g}, ${b})`,
      });
    }

    function pulseStar(star) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 0.7 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
      ctx.closePath();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        pulseStar(star);
        star.opacity = star.opacity > 0 ? star.opacity - 0.01 : 0.9;
      });

      requestAnimationFrame(loop);
    }

    loop();
  },
};
</script>

<style scoped>
.pulse-stars-container {
  position: relative;
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pulse-stars-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
