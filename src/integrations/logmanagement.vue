<template>
  <div>
    <h3>Log Management and Collection</h3>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Environment">
          <p class="bold">Linux Environment</p>
          <form @submit.prevent="createLinux()" data-vv-scope="step-1">
            <div>

            <div class="env-select">
                <input
                  type="radio"
                  :id="integration-linux"
                  :value="linux"
                  name="linux"
                  v-model="cloudId"
                  v-validate="'required'">

                <label :for="integration-linux" class="button default outline normal">
                  <service-image :id="cloudIntegrationID" class="image" />
                  <div class="grid">
                    <div class="bold ellipsis" style="margin-bottom: 10px" :title="linux" >
                      Linux  Server Integration
                    </div>
                  </div>
                </label>
            </div>
            </div>
            <div class="text-right">
              <button type="submit" class="button default outline">
                Go: Linux Integration
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
export default class LogManagementView extends Vue {
  /* Variables */
  private tabIndex: number = 0;
  private cloudIntegrationID: string = 'linux';

  private createLinux() {
    router.replace('/integrations/add/linux');
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
