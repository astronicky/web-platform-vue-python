<template>
  <transition name="fade">
    <div class="banner" :class="[type, {'large': isLarge}]" v-if="visible">
      <i :class="icon"></i>
      <div>
        <slot />
      </div>
      <button @click="dismissBanner" v-if="canDismiss">
        <i class="fas fa-times-circle"></i>
      </button>
    </div>
  </transition>
</template>

<style lang="scss" scoped>

.banner {
  display: flex;
  align-items: center;
  background: none;
  min-height: 3rem;
  font-size: 1.6rem;
  line-height: 1.25;
  margin-bottom: .5rem;

  & > .fas {
    padding: 0 1rem 0 1.5rem;
    text-align: center;
    font-size: 1.6rem;
  }

  & > div {
    flex: 1;
    padding: .5rem;
    margin: 0;
  }

  & > button {
    text-decoration: none;
    background: none;
    border: none;
    padding: 0 2rem;
  }

  /* Large */
  &.large {
    & > div {
      padding: 1.5rem .5rem;
    }

    & > .fas {
      padding: 2rem 4rem;
      font-size: 10rem;
    }
  }


  /* Types */

  /* Primary */
  &.primary {
    border-left: .4rem solid var(--c-primary-500);
    color: var(--c-primary-900);
    background: var(--c-primary-200);

    .fas {
      color: var(--c-primary-600);
    }

    /* Dismiss */
    & > button {
      color: var(--c-primary-500);

      &:hover,
      &:focus {
        background: var(--c-primary-500);

        & .fas,
        & .fas {
          color: var(--c-primary-200);
        }
      }
    }


  }

  /* Default */
  &.default {
    border-left: .4rem solid var(--c-gray-500);
    color: var(--c-gray-900);
    background: var(--c-gray-200);

    .fas {
      color: var(--color-default-dark);
    }

    /* Dismiss */
    & > button {
      color: var(--c-gray-500);

      &:hover,
      &:focus {
        background: var(--c-gray-500);

        & .fas,
        & .fas {
          color: var(--c-gray-200);
        }
      }
    }
  }

  /* Danger */
  &.danger {
    border-left: .4rem solid var(--c-danger-500);
    color: var(--c-danger-900);
    background: var(--c-danger-200);

    .fas {
      color: var(--c-danger-600);
    }

    /* Dismiss */
    & > button {
      color: var(--c-danger-500);
      &:hover,
      &:focus {
        background: var(--c-danger-500);

        & .fas,
        & .fas {
          color: var(--c-danger-200);
        }
      }
    }
  }

  /* Success */
  &.success {
    border-left: .4rem solid var(--c-success-500);
    color: var(--c-success-900);
    background: var(--c-success-200);

    .fas {
      color: var(--c-success-600);
    }

    /* Dismiss */
    & > button {
      color: var(--c-success-500);

      &:hover,
      &:focus {
        background: var(--c-success-500);

        & .fas,
        & .fas {
          color: var(--c-success-200);
        }
      }
    }
  }

}

@media (max-width: 550px) {
  .banner.large {
    flex-direction: column;

    & > div {
      padding: 1rem;

      button {
        float: right;
      }
    }

    & > .fas {
      padding: 2rem 1rem 1rem 1rem;
      margin: 0 auto;
    }
  }
}


@media (prefers-color-scheme: dark) {
  .banner {

    /* Types */

    /* Primary */
    &.primary {
      border-left: .4rem solid var(--c-primary-400);
      color: var(--c-primary-200);
      background: var(--c-primary-800);

      .fas {
        color: var(--c-primary-400);
      }

      /* Dismiss */
      & > button {
        color: var(--c-primary-500);

        &:hover,
        &:focus {
          background: var(--c-primary-500);

          & .fas,
          & .fas {
            color: var(--c-primary-200);
          }
        }
      }

    }

    /* Default */
    &.default {
      border-left: .4rem solid var(--c-gray-400);
      color: var(--c-gray-200);
      background: var(--c-gray-800);

      .fas {
        color: var(--color-default-light);
      }

      /* Dismiss */
      & > button {
        color: var(--c-gray-400);

        &:hover,
        &:focus {
          background: var(--c-gray-500);

          & .fas,
          & .fas {
            color: var(--c-gray-200);
          }
        }
      }
    }

    /* Danger */
    &.danger {
      border-left: .4rem solid var(--c-danger-400);
      color: var(--c-danger-200);
      background: var(--c-danger-800);

      .fas {
        color: var(--c-danger-400);
      }

      /* Dismiss */
      & > button {
        color: var(--c-danger-500);
        &:hover,
        &:focus {
          background: var(--c-danger-600);

          & .fas,
          & .fas {
            color: var(--c-danger-200);
          }
        }
      }
    }

    /* Success */
    &.success {
      border-left: .4rem solid var(--c-success-400);
      color: var(--c-success-200);
      background: var(--c-success-800);

      .fas {
        color: var(--c-success-400);
      }

      /* Dismiss */
      & > button {
        color: var(--c-success-400);

        &:hover,
        &:focus {
          background: var(--c-success-500);

          & .fas,
          & .fas {
            color: var(--c-success-200);
          }
        }
      }
    }
  }
}

</style>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Banner extends Vue {
  @Prop({ default: 'default' })
  private type: string;

  @Prop({ default: 'fas fa-exclamation-circle' })
  private icon: string;

  @Prop({ default: 'false' })
  private large: string;

  @Prop({ default: 'false' })
  private dismiss: string;

  private visible: boolean = true;

  get canDismiss(): boolean {
    return (this.dismiss.toLowerCase().trim() !== 'false');
  }

  get isLarge(): boolean {
    return (this.large.toLowerCase().trim() !== 'false');
  }

  private dismissBanner() {
    this.visible = false;
  }
}
</script>
