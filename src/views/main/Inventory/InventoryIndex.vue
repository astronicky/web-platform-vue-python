<template>
    <div>
        <h1>Inventory Management
<!--    <button class="button primary outline medium" style="position: absolute;right: 0;">View Assessment Report </button>
        <br>
        <a href="asset-manager/reports" class="button primary outline medium" style="position: absolute;right: 0;">View Assessment Report</a>          
        -->
        <button class="button primary outline medium" style="position: absolute;right: 0;">
        <router-link
                :to="`asset-manager/reports`">
                View Assessment Report
        </router-link>
        </button>
        <br>
        </h1>

  <div>
    <div>
        <inventory-table>
        </inventory-table>
    </div>
  </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import API from '@/API';
import InventoryTable from './InventoryTable.vue';
import router from '@/router/router';

@Component({
  components: {
    'inventory-table': InventoryTable,
  },
})

export default class InventoryIndex extends Vue {
/* Lifecycle
  private created(): void {
  }*/
}

</script>
