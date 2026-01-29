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
  padding: 1rem;
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

.horizontalContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fullWidth {
  width: 100%;
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
    padding: 3rem;
  }
}
</style>
