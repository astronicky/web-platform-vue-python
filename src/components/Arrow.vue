<template>
  <div>
    <div class="arrow" :class="[type, visual, speed]" :title="title"></div>
    <!-- <div class="arrow danger stopped" title="300 Gbps of 50 Tbps"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Arrow extends Vue {
  /* Variables */
  @Prop({ default: 'default' })
  private type: string;

  @Prop({ default: '' })
  private visual: string;

  @Prop({ default: 'stopped' })
  private speed: string;

  @Prop()
  private title: string;

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>

<style lang="scss" scoped>
.arrow {
  position: relative;
  width: calc(100% - 1rem);
  height: .25rem;
  top: 1.5rem;
  margin-bottom: 1.25rem;
  background-image:
    repeating-linear-gradient(
      90deg,
      var(--c-gray-500),
      var(--c-gray-500) 1rem,
      var(--c-gray-100) 1rem,
      var(--c-gray-100) 2rem /* determines size */
    );
  background-size: 3rem 3rem;

  &:after {
    content: '';
    position: absolute;
    right: -1rem;
    top: -0.4rem;
    width: 0;
    height: 0;
    border-top: .5rem solid transparent;
    border-bottom: .5rem solid transparent;
    border-left: 1.5rem solid var(--c-gray-500);
  }

  &.primary {
    background-image:
      repeating-linear-gradient(
        90deg,
        var(--c-primary-500),
        var(--c-primary-500) 3rem
      );

    &.dashed {
      background-image:
        repeating-linear-gradient(
          90deg,
          var(--c-primary-500),
          var(--c-primary-500) 2rem,
          var(--c-gray-100) 2rem,
          var(--c-gray-100) 3rem /* determines size */
        );
    }

    &:after {
      content: '';
      border-left-color: var(--c-primary-500);
    }
  }

  &.default {
    background-image:
      repeating-linear-gradient(
        90deg,
        var(--c-gray-500),
        var(--c-gray-500) 3rem
      );

    &.dashed {
      background-image:
        repeating-linear-gradient(
          90deg,
          var(--c-gray-500),
          var(--c-gray-500) 2rem,
          var(--c-gray-100) 2rem,
          var(--c-gray-100) 3rem /* determines size */
        );

    }

    &:after {
      content: '';
      border-left-color: var(--c-gray-500);
    }
  }

  &.success {
    background-image:
      repeating-linear-gradient(
        90deg,
        var(--c-success-500),
        var(--c-success-500) 3rem
      );

    &.dashed {
      background-image:
        repeating-linear-gradient(
          90deg,
          var(--c-success-500),
          var(--c-success-500) 2rem,
          var(--c-gray-100) 2rem,
          var(--c-gray-100) 3rem /* determines size */
        );

    }

    &:after {
      content: '';
      border-left-color: var(--c-success-500);
    }
  }

  &.danger {
    background-image:
      repeating-linear-gradient(
        90deg,
        var(--c-danger-500),
        var(--c-danger-500) 3rem
      );

    &.dashed {
      background-image:
        repeating-linear-gradient(
          90deg,
          var(--c-danger-500),
          var(--c-danger-500) 2rem,
          var(--c-gray-100) 2rem,
          var(--c-gray-100) 3rem /* determines size */
        );
    }

    &:after {
      content: '';
      border-left-color: var(--c-danger-500);
    }
  }

  &.fast {
    animation: move .5s linear infinite;
  }
  &.medium {
    animation: move 1.1s linear infinite;
  }
  &.slow {
    animation: move 4s linear infinite;
  }
  &.stopped {
    animation: move 0s linear infinite;
  }

}


@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 3rem 0;
  }
}

</style>
