<template>
  <transition name="custom-modal">
    <div class="custom-modal" v-show="isShow" @click="close()">
      <div class="frame" @click.stop>
        <button class="button default link right close" @click="close()">
          <i class="fas fa-times"></i>
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CustomModal extends Vue {

  /* Variables */
  @Model('update', { type: Boolean})
  private show!: boolean;

  get isShow(): boolean {
    if (this.show) {
      document.onkeydown = (evt) => {
        evt = evt || window.event;
        let isEscape = false;
        if ('key' in evt) {
          isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
        } else {
          isEscape = (evt!.keyCode === 27);
        }
        if (isEscape) {
          this.close();
        }
      };
    } else {
      document.onkeydown = null;
    }
    return this.show;
  }

  /* Lifecycle */
  // private created(): void {}

  /* Methods */
  private close(): void {
    this.$emit('update', false);
  }

}

</script>

<style lang="scss" scoped>
.custom-modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 10;
}

.custom-modal:before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  opacity: 0.95;
  background: var(--c-gray-300);
  z-index: -1;
}

.frame {
  margin: auto;
  max-height: 95vh;
  min-width: 40rem;
  max-width: 100rem;
  overflow-x: hidden;
  width: 100%;
    background-image: linear-gradient(
        20deg,
        var(--c-primary-800),
        var(--c-primary-600)
      ),
      url('~@/assets/cloud1_soft.jpg');
  opacity: 1;
  border-radius: 0.5em;
}

.close {
  position: relative;
  top: -.5rem;
  right: -.5rem;
}

.body {
  display: flex;
  flex-direction: column;

  & > * {
    flex: 1;
  }
}

.frame::-webkit-scrollbar {
  width: 0.05rem;
  height: 0.1rem;
}

@media (max-width: 611px) {
  .frame {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    min-width: 100%;
    padding: 1rem;
  }

  .close {
    position: relative;
    right: -.5rem;
  }
}

/* Animations */
.modal-enter-active, .modal-leave-active {
  transition: all var(--transition-medium);
}
.modal-enter, .modal-leave-to {
  opacity: 0;
  transition: all var(--transition-medium);
}



/* Dark Mode */

@media (prefers-color-scheme: dark) {
  .custom-modal:before {
    background: var(--c-gray-900);
  }

  .frame {
  margin: auto;
  // min-height: 32rem;
  max-height: 95vh;
  min-width: 40rem;
  max-width: 100rem;
  overflow-x: hidden;
  background: var(--c-gray-100);
  width: 100%;
    background-image: linear-gradient(
        20deg,
        var(--c-primary-800),
        var(--c-primary-600)
      ),
      url('~@/assets/cloud1_soft.jpg');
  // border: .1rem solid var(--c-gray-500);
  // box-shadow: 0rem 0rem 1rem var(--c-gray-400);
  opacity: 1;
  border-radius: 0.5em;
  }
}

</style>
