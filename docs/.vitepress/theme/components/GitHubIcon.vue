<template>
  <div class="github-icon">
    <div>{{ counter }}</div>
    <div class="button" @click="counter++">CLICK</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const counter = ref<number>(0);
</script>

<style scoped lang="scss">
.github-icon {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 15px;
  padding: 0 10px;
  color: black;
  justify-content: space-between;
}

.button {
  user-select: none;
  cursor: pointer;

  &:hover {
    color: skyblue;
  }
}
</style>
