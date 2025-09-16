<template>
  <div ref="shootingStarsContainer" class="v-shooting-stars-container">
    <canvas ref="shootingStarsCanvas" class="v-shooting-stars-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "VShootingStars",
  props: {
    count: {
      type: Number,
      default: 20,
    },
    maxDelay: {
      type: Number,
      default: 200, // seconds
    },
    maxDuration: {
      type: Number,
      default: 300, // seconds
    },
    color: {
      type: String,
      default: () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      },
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      stars: [],
      animationFrameId: null,
      containerWidth: 0,
      containerHeight: 0,
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.shootingStarsCanvas;
      this.ctx = this.canvas.getContext("2d");
      this.handleResize(); // Set initial size and create stars
      this.createStars();
      this.animate();
    },
    handleResize() {
      const container = this.$refs.shootingStarsContainer;
      if (container) {
        this.containerWidth = container.offsetWidth;
        this.containerHeight = container.offsetHeight;
        this.canvas.width = this.containerWidth;
        this.canvas.height = this.containerHeight;
        this.stars.forEach((star) => this.resetStarPosition(star)); // Reposition stars on resize
      }
    },
    createStars() {
      this.stars = [];
      for (let i = 0; i < this.count; i++) {
        this.stars.push(this.createStar());
      }
    },
    createStar() {
      return {
        x: 0,
        y: 0,
        length: this.random(50, 150), // Length of the shooting star
        speed: this.random(2, 8), // Pixels per frame
        delay: this.random(0, this.maxDelay * 1000), // milliseconds
        duration: this.random(1, this.maxDuration * 1000), // milliseconds
        startTime: 0, // When the star starts its animation
        active: false,
        angle: Math.PI / 4 + this.random(-0.1, 0.1), // Angle of descent, around 45 degrees
        opacity: 0,
        gradient: null,
        color: this.color,
      };
    },
    resetStarPosition(star) {
      star.x = this.random(
        -this.containerWidth * 0.5,
        this.containerWidth * 1.5
      ); // Start outside view
      star.y = this.random(
        -this.containerHeight * 0.5,
        this.containerHeight * 1.5
      ); // Start outside view
      star.startTime = Date.now() + star.delay;
      star.active = false;
      star.opacity = 0;
      this.updateStarGradient(star);
    },
    updateStarGradient(star) {
      const trailLength = star.length;
      const headX = star.x;
      const headY = star.y;
      const tailX = headX - trailLength * Math.cos(star.angle);
      const tailY = headY - trailLength * Math.sin(star.angle);

      const gradient = this.ctx.createLinearGradient(
        tailX,
        tailY,
        headX,
        headY
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, `${this.color}`);
      star.gradient = gradient;
    },
    update() {
      const now = Date.now();

      this.stars.forEach((star) => {
        if (!star.active && now > star.startTime) {
          star.active = true;
          star.opacity = 1;
        }

        if (star.active) {
          star.x += star.speed * Math.cos(star.angle);
          star.y += star.speed * Math.sin(star.angle);

          // Fade out as it moves
          const progress = (now - star.startTime) / star.duration;
          star.opacity = Math.max(0, 1 - progress);

          // If star is off screen or faded out, reset it
          const isOffScreen =
            star.x > this.containerWidth * 1.5 ||
            star.y > this.containerHeight * 1.5 ||
            star.opacity <= 0;
          if (isOffScreen) {
            this.resetStarPosition(star);
          } else {
            this.updateStarGradient(star); // Update gradient as position changes
          }
        }
      });
    },
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.stars.forEach((star) => {
        if (star.active && star.opacity > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(star.x, star.y);
          this.ctx.lineTo(
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
          );
          this.ctx.strokeStyle = star.gradient;
          this.ctx.lineWidth = 2; // Thickness of the star trail
          this.ctx.lineCap = "round";
          this.ctx.stroke();
        }
      });
    },
    animate() {
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
  },
};
</script>

<style scoped>
.v-shooting-stars-container {
  position: absolute;

  width: 100%;
  height: 100%;
  overflow: hidden; /* Ensures stars don't appear outside the container unexpectedly */
  pointer-events: none; /* Allows clicks to pass through to elements behind the canvas */
}

.v-shooting-stars-canvas {
  display: block; /* Remove extra space below canvas */
  width: 100%;
  height: 100%;
}
</style>
