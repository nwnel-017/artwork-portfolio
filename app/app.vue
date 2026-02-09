<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* padding: 1rem; */
}

.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
}

.textBlock {
  padding: 0;
}

.textBlock h1 {
  margin: 0;
  padding: 0;
}

.centerContent h1 {
  margin: 0.75rem 0;
}

.centerContainer {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 50vw;
  /* border: 1px solid var(--text-color); */
  border-radius: 0.5rem;
}

.verticalContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spaced {
  gap: 0.5rem;
}

.horizontalContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fullWidth {
  width: 100%;
  /* width: 100vw; */
}

.fillPage {
  width: 100vw;
}

.submissionForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.banner {
  height: 1.5rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.margin {
  margin: 3rem auto;
}

.contentCard {
  padding: 0.5rem;
  box-shadow: 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  /* gap: 1rem; */
  justify-content: space-between;
  width: 100%;
}

.header {
  font-weight: bold;
}

.padded {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.cutoffText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  -webkit-box-orient: vertical;
}

.closeHorContent {
  display: flex;
  gap: 1rem;
}

.headShot {
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 8px;
}

.clickable {
  cursor: pointer;
}

.imgContainer {
  max-width: 400px;
  max-height: 400px;
}

.artworkFull {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.overlay {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  z-index: 1;
}

.modal {
  max-width: 90%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  opacity: 1;
}

/* .btn--sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
}
.btn--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.btn--lg {
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
} */

@media (min-width: 768px) {
  .banner {
    width: 90%;
  }

  .page {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .banner {
    width: 60%;
  }

  .page {
    /* padding: 3rem; */
    padding: 0;
  }
}
</style>
