<template>
  <div>
    <h3>SQL Server</h3>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Environment">
          <p class="bold">Windows Environment</p>
          <form @submit.prevent="createWindows()" data-vv-scope="step-1">
            <div>

            <div class="env-select">
                <input
                  type="radio"
                  :id="integration-windows"
                  :value="windows"
                  name="windows"
                  v-model="cloudId"
                  v-validate="'required'">

                <label :for="integration-windows" class="button default outline normal">
                  <service-image :id="cloudIntegrationID" class="image" />
                  <div class="grid">
                    <div class="bold ellipsis" style="margin-bottom: 10px" :title="windows" >
                      Windows Server Integration
                    </div>
                  </div>
                </label>
            </div>
            </div>
            <div class="csm6 cxs12">
              <p class="bold">
              NOTE: Current SQL Server Integration implementation requires SQL Server authentication to work.            
              </p>
            </div>
            <div class="text-right">
              <button type="submit" class="button default outline">
                Go: Windows Integration
              </button>
            </div>
          </form>
      </tab>
    </tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import router from '@/router/router';
import IntegrationsList from '@/views/main/Integrations/IntegrationsList.vue';

@Component({
  components: {
    IntegrationsList,
  },
})
export default class SQLServerView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private cloudIntegrationID: string = 'windows';

  private createWindows() {
    router.replace('/integrations/add/windows');
  }

}

</script>

<style lang="scss" scoped>

.env-select {
  margin-bottom: 1rem;

  label {
    display: flex;
    align-items: center;
    padding: 1rem .5rem;
  }

  .image {
    width: 5rem;
    display: inline-block;
    margin: 0 1.5rem 0 .5rem;
  }
}
</style>
