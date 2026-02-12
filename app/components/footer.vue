<template>
  <div class="footer">
    <div>
      <div>LOCATION</div>
      <div>San Juan, Puerto Rico</div>
    </div>
    <div>
      <div>WEB DESIGN</div>
      <div>Nathan Nelson</div>
    </div>
    <div>
      <div>CONTACT</div>
      <div>jamiestambolie@gmail.com</div>
      <div>IG LINK HERE</div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  /* position: absolute; */
  /* bottom: 0; */
  font-size: 0.5rem;
  height: 10vh;
  width: 100%;
  /* border: 1px solid black; */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

@media (min-width: 768px) {
  .footer {
    font-size: 0.8rem;
  }
}

@media (min-width: 1024px) {
  .footer {
    font-size: 0.9rem;
  }
}
</style>
