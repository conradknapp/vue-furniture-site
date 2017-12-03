<template>
  <div class="container">
  <div class="heart">
    <svg width="40" height="40" viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg">
      <path d="m263.42 235.15c-66.24 0-120 53.76-120 120 0 134.76 135.93 170.09 228.56 303.31 87.574-132.4 228.56-172.86 228.56-303.31 0-66.24-53.76-120-120-120-48.048 0-89.402 28.37-108.56 69.188-19.161-40.817-60.514-69.188-108.56-69.188z" />
    </svg>
  </div>
  <div class="heart">
    <svg width="30" height="30" viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg">
      <path d="m263.42 235.15c-66.24 0-120 53.76-120 120 0 134.76 135.93 170.09 228.56 303.31 87.574-132.4 228.56-172.86 228.56-303.31 0-66.24-53.76-120-120-120-48.048 0-89.402 28.37-108.56 69.188-19.161-40.817-60.514-69.188-108.56-69.188z" />
    </svg>
  </div>
  <div class="heart">
    <svg width="28" height="28" viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg">
      <path d="m263.42 235.15c-66.24 0-120 53.76-120 120 0 134.76 135.93 170.09 228.56 303.31 87.574-132.4 228.56-172.86 228.56-303.31 0-66.24-53.76-120-120-120-48.048 0-89.402 28.37-108.56 69.188-19.161-40.817-60.514-69.188-108.56-69.188z" />
    </svg>
  </div>
</div>
</template>

<style scoped>
.container {
  position: absolute;
  z-index: 4;
}

.heart:nth-child(1) svg {
    opacity: 0;
    animation: heartUp 1.4s forwards ease-in;
}

.heart:nth-child(2) svg {
    position: absolute;
    left: 1rem;
    opacity: 0;
    animation: heartUp 1.4s 0.2s forwards ease-in;
  }

.heart:nth-child(3) svg {
    position: absolute;
    left: 0.5rem;
    opacity: 0;
    animation: heartUp 1.4s 0.35s forwards ease-in;
  }

svg {
  fill: #f58d9c;
}

@keyframes heartUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(10deg);
  }

  50% {
    opacity: 1;
  }

  65% {
    opacity: 1;
  }

  90% {
    opacity: 0;
    transform: translate3d(0, -35vh, 0) scale(1.2) rotate(-10deg);
  }

  100% {
    opacity: 0;
  }
}
</style>