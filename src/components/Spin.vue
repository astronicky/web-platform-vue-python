<template>
  <div class="spin">
    <div class="message">
      {{ message }}
    </div>
    <div class="spin4"/>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Spin extends Vue {
  @Prop({ default: 'Loading…' })
  private message: string;
}

</script>

<style>
.spin {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  animation: 750ms bg 750ms forwards;
}

.spin:before {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  background: var(--c-gray-100);
  opacity: 0;
  animation: 750ms bg 1000ms forwards;
}

.message {
  font-size: 3rem;
  color: var(--c-primary-900);
  z-index: 1;
  margin: auto auto 2rem auto;
  padding-left: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  .spin:before {
    background: #000;
  }

  .message {
    color: var(--c-gray-200);
  }
}

.spin4 {
  /* color: var(--c-gray-100); */
  color: var(--c-primary-500);
  line-height: 5rem;
  text-align: center;
  margin: 0 auto auto auto;
  font-size: 4rem;
  z-index: 1;
  align-items: center;
}

.spin4:before {
  content: '!';
  font-family: Monaco, monospace;
  font-weight: bold;
  display: block;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;

  /* background-color: var(--c-primary-500); */
  animation: 750ms spin4 infinite;
}


@keyframes spin4 {
  0%, 100% {
    content: '–';
  }
  25% {
    content: '\\';
  }
  50% {
    content: '|';
  }
  75% {
    content: '/';
  }
}

@keyframes bg {
  0% {
    opacity: 0;
  }
  100% {
    opacity: .98;
  }
}

</style>

