<template>
  <div class="empty" v-if="!isSpin">
    <div class="image">
      <i :class="icon"></i>
    </div>
    <h2 class="title">
      <slot name="title"/>
    </h2>
    <div>
      <slot name="description"/>
    </div>
  </div>
</template>

<style scoped>

.empty {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 1rem;
  max-width: 40rem;
  text-align: center;
  animation: fadein var(--transition-medium) ease-in;
}

.empty .title {
  margin-bottom: 1.5rem;
}

.empty .image {
  position: relative;
  margin: 0 auto;
  height: 15rem;
  width: 15rem;
  font-size: 10rem;
  color: var(--c-primary-500);
}

.empty .image:after {
  content: '';
  position: relative;
  display: block;
  bottom: 1rem;
  height: .75rem;
  width: 4rem;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--c-gray-200);
}

@keyframes fadein {
  from { opacity: 0;}
  to { opacity: 1;}
}

@media (prefers-color-scheme: dark) {
  .empty .image {
    color: var(--c-primary-400);
  }

  .empty .image:after {
    background: var(--c-gray-700);
  }
}

</style>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class Empty extends Vue {
  @Prop({ default: 'fas fa-exclamation-circle' })
  private icon: string;

  get isSpin() { return API.UI.isSpin(); }
}
</script>
