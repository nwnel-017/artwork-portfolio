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
  height: 100vh;
}

.centerContent {
  display: flex;
  justify-content: center;
  align-items: center;
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
}

.contentCard {
  padding: 0.5rem;
  box-shadow: 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  /* gap: 1rem; */
  justify-content: space-between;
  width: 100%;
}

.padded {
  padding: 1rem;
}

.cutoffText {
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
</style>
