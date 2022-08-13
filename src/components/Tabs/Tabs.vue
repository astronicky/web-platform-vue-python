<template>
  <div>

    <ul
      class="tabs"
      :class="{'list': list}"
      role="tablist">
      <li
        v-for="(tab, index) in tabs"
        :class="{ 'active': tab.isActive }"
        :key="index"
        role="tab">
        <button
          :class="{'preventNav': !tabNav}"
          @click="tabNavigation(tab)"
          :disabled="!tabNav">
          {{ tab.name }}
          <span class="updates" v-if="tabUpdates(tab) > 0">
            {{ tabUpdates(tab) }}
          </span>
        </button>
      </li>
    </ul>

    <div class="pane">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
// https://laracasts.com/series/learn-vue-2-step-by-step/episodes/11
// https://codepen.io/tatimblin/pen/oWKdjR?editors=1010

import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class Tabs extends Vue {

  @Prop({ default: false })
  private list: boolean;

  @Prop({ default: 0 })
  private selected: number;

  @Prop({ default: true })
  private tabNav: boolean;


  private tabs: any[] = [];
  private tabIndex: number = this.selected;

  private created(): void {
    this.tabs = this.$children;
    this.$nextTick(() => {
      this.changeTab(this.tabs[this.tabIndex]);
    });
  }

  private tabNavigation(selectedTab: number): void {
    if (this.tabNav) { this.changeTab(selectedTab); }
  }

  private tabUpdates(selectedTab: any): number {
    let updates: number = 0;
    if (selectedTab.updates) {
      updates = Number(selectedTab.updates);
    }
    return updates;
  }

  private changeTab(selectedTab: any): void {
    if (this.tabIndex > this.tabs.length - 1) { throw new Error('Tab position too high'); }
    if (this.tabIndex < 0) { throw new Error('Tab position cannot be negative'); }

    this.tabs.forEach((tab) => {
      tab.isActive = (tab.name === selectedTab.name);
    });
  }

  @Watch('selected')
  private updateSelected(value: any, oldValue: any) {
    this.tabIndex = value;
    this.changeTab(this.tabs[this.tabIndex]);
  }

}
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: .1rem solid var(--c-gray-400);
}

.tabs button {
  display: flex;
  align-items: center;
  font-size: 2rem;
  background: none;
  border: none;
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
  padding: .5rem 1rem;
  margin-right: .5rem;
}

.tabs button:hover,
.tabs button:focus {
  background: var(--c-gray-200);
  box-shadow: 0 .2rem 0 var(--c-gray-500);
}

.tabs .active button,
.tabs .active button:active {
  color: var(--c-primary-700);
  border-bottom: none;
  box-shadow: 0 .2rem 0 var(--c-primary-500);
  background: var(--c-primary-200);
}

/* Nav disabled */
.tabs button.preventNav {
  pointer-events: none;
}


/* If list prop is true */
.tabs.list {
  counter-reset: list;
}

.tabs.list button:before {
  margin-right: .5rem;
  counter-increment: list;
  content: counter(list) ". ";
}

.tabs .updates {
  margin-left: .5rem;
  padding: 0 .5rem;
  background: var(--c-danger-500);
  color: var(--c-gray-100);
  font-size: 1.4rem;
  line-height: 2rem;
  min-width: 2rem;
  height: 2rem;
  border-radius: 2rem;
}


/* Dark Mode */

@media (prefers-color-scheme: dark) {
  .tabs {
    border-bottom: .1rem solid var(--c-gray-400);
  }

  .tabs button {
    color: var(--c-gray-200);
  }

  .tabs button:hover,
  .tabs button:focus {
    background: var(--c-gray-700);
    box-shadow: 0 .2rem 0 var(--c-gray-500);
  }

  .tabs .active button,
  .tabs .active button:active {
    color: var(--c-primary-200);
    box-shadow: 0 .2rem 0 var(--c-primary-500);
    background: var(--c-primary-700);
  }


  .tabs .updates {
    background: var(--c-danger-500);
    color: var(--c-gray-100);
  }
}

</style>
