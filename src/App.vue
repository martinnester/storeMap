<script setup lang="ts">
import StopWatch from './StopWatch.vue'
</script>

<template>
  <StopWatch v-for="(k, i) in Array.from({ length: 5 })" :key="i" />
</template>

<style scoped></style>
