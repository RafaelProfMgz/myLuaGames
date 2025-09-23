<template>
  <div class="animated-background" :style="backgroundStyles">
    <div
      v-for="(shape, index) in shapes"
      :key="index"
      class="shape"
      :style="shapeStyles(shape)"
    ></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const shapes = [
  { top: "10%", left: "15%", size: "150px", delay: "0s", color: "shape1" },
  { top: "50%", left: "80%", size: "200px", delay: "5s", color: "shape2" },
  { top: "80%", left: "30%", size: "100px", delay: "5s", color: "shape3" },
  { top: "25%", left: "60%", size: "250px", delay: "5s", color: "shape4" },
];

const backgroundStyles = computed(() => {
  const isDark = theme.global.name.value === "dark";
  return {
    background: isDark
      ? "linear-gradient(135deg, #1A237E, #0D0D1A)"
      : "linear-gradient(135deg, #8C9EFF, #E3F2FD)",
  };
});

const shapeStyles = computed(() => (shape) => {
  const isDark = theme.global.name.value === "dark";
  const colors = {
    dark: {
      shape1: "#5C6BC0",
      shape2: "#3F51B5",
      shape3: "#9FA8DA",
      shape4: "#7986CB",
    },
    light: {
      shape1: "#BBDEFB",
      shape2: "#90CAF9",
      shape3: "#E3F2FD",
      shape4: "#B3E5FC",
    },
  };
  return {
    width: shape.size,
    height: shape.size,
    top: shape.top,
    left: shape.left,
    "animation-delay": shape.delay,
    "background-color": isDark
      ? colors.dark[shape.color]
      : colors.light[shape.color],
  };
});
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
  animation: move-shapes 15s infinite ease-in-out;
  transition: transform 0.5s ease-out;
}

.shape-1 {
  width: 150px;
  height: 150px;
  opacity: 0.8;
  animation: move-shapes 15s infinite ease-in-out;
  transition: transform 0.5s ease-out;
}

.shape-2 {
  width: 200px;
  height: 200px;
  opacity: 0.8;
  animation: move-shapes 15s infinite ease-in-out;
  transition: transform 0.5s ease-out;
}

.shape-3 {
  width: 100px;
  height: 100px;
  opacity: 0.8;
  animation: move-shapes 15s infinite ease-in-out;
  transition: transform 0.5s ease-out;
}

.shape-4 {
  width: 250px;
  height: 250px;
  opacity: 0.8;
  animation: move-shapes 15s infinite ease-in-out;
  transition: transform 0.5s ease-out;
}

@keyframes move-shapes {
  0% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
  }
  50% {
    transform: translate(-30px, 30px) scale(0.9);
  }
  75% {
    transform: translate(10px, 10px) scale(1.05);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}
</style>
