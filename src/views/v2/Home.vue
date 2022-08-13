<template>
  <!-- <div class="home" :class="{'compact': isCompactUi}"> -->
  <div class="home" :compact-ui="isCompactUI">
    <sidebar />
    <spin v-if="isSpin" />
    <transition name="slide-fade" mode="out-in">
      <router-view class="app-container" />
    </transition>
    <notifications position="bottom right" class="app-notifications" width="300px" />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import Sidebar from '@/views/v2/Sidebar.vue';

import router from '@/router/router';
import API from '@/API';

@Component({
  components: {
    Sidebar,
  },
})
export default class Home extends Vue {
  get isSpin() { return API.UI.isSpin(); }
  get isCompactUI() { return API.UI.isCompactUI(); }

  private created() {
   router.afterEach((to, from) => {
      API.UI.hideSpin();
      const currentOrg = API.Organization_v2.getActive();
      if (currentOrg.id === undefined || currentOrg.id === '') {
        if (!router.currentRoute.path.includes('organizations')) {
          this.$router.replace('/welcome');
        }
      }
    });
  }

}
</script>

<style scoped>
.app-container {
  position: absolute;
  padding: 2rem 2rem 12rem 8rem;
  overflow-x: auto;
  width: 100%;
}

/* Compact UI */
[compact-ui] .app-container {
  padding: .75rem 1rem 4rem 7rem;
  overflow-x: auto;
}
</style>
