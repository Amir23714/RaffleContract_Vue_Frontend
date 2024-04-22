<script>
export default {};
</script>

<template>
  <div class="header_wrapper">
    <div class="developed_by">
      <h2>
        Raffle Contract on TON blockchain
        <span class="fancy">by Amir23714</span>
      </h2>
    </div>

    <button class="ton_connect" id="tonconnect_but"></button>
  </div>
</template>

<style scoped>
.header_wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 3%;
}

.ton_connect {
  background: none;
  border: none;
  margin-right: 3%;
  /* margin-left: auto; */
}

.developed_by {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  font-family: "Work Sans", sans-serif;
  font-weight: 900;
  color: white;
}

h2 {
  font-size: 2vw;
  text-transform: uppercase;
  text-align: center;
  line-height: 1;
}

.fancy {
  position: relative;
  white-space: nowrap;
  &:after {
    --deco-height: 0.3125em;
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--deco-height) * -0.625);
    height: var(--deco-height);
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23a)'%3E%3Cpath d='M-17 30.5C-1 22 72-4 54 13 37.9 28.2-2.5 57.5 16 55.5s72-29 104-40' stroke='%2300FDCF' stroke-width='10'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h100v64H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    background-size: auto 100%;
    background-repeat: round;
    background-position: 0em;
  }
}
</style>
