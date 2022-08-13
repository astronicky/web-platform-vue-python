<template>
  <img
    :src="getImageUrl"
    :alt="imageAlt"
    :title="imageTitle" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// tslint:disable-next-line
const image = require('@/assets/sprites.svg');

@Component
export default class ServiceImage extends Vue {
  @Prop() private id: string;
  @Prop() private alt?: string;
  @Prop() private title?: string;

  get getImageUrl(): string {
    return `${image}#${this.id}`;
  }
  get imageAlt(): string {
    if (this.alt) { return this.alt; }
    return `${this.id.replace('_', ' ')} logo`;
  }
  get imageTitle(): string {
    if (this.title) { return this.title; }
    return `${this.id.replace('_', ' ')} logo`;
  }
}
</script>
