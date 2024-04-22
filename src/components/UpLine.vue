<script>
export default {};
</script>

<template>
  <div class="upline_wrapper">
    <h2 class="upline_text">TESTNET ONLY!!!</h2>
    <h2 class="upline_text">TESTNET ONLY!!!</h2>
    <h2 class="upline_text">TESTNET ONLY!!!</h2>
    <h2 class="upline_text">TESTNET ONLY!!!</h2>
  </div>
</template>

<style scoped>
.upline_wrapper {
  width: 100%;
  background: red;

  display: flex;
  justify-content: flex-start;
  overflow: hidden;

  height: auto;
}

.upline_text {
  font-size: 32px;
  text-transform: uppercase;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: white;
  white-space: nowrap;
  padding: 0 6rem;
  letter-spacing: 1px;
  animation: move-rtl 30000ms linear infinite;
  
  height: 55px;
}

@keyframes move-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
