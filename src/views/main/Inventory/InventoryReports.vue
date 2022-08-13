<template>
    <div>
        <h1 style="position: relative;">
          Inventory Assessment Report
        <button class="button primary outline medium" style="position: absolute;right: 0;" onClick="history.back();">&laquo; Back</button>
        <br>
        </h1>
  <div>
    <div>
        <inventory-viewreports>
        </inventory-viewreports>
    </div>
  </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import InventoryViewReports from './InventoryViewReports.vue';
import router from '@/router/router';

@Component({
  components: {
    'inventory-viewreports': InventoryViewReports,
  },
})

export default class InventoryReports extends Vue {
/* Lifecycle
  private created(): void {
  }*/
}

</script>