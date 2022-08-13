<template>
  <component :is="serviceName" :id="this.id" :thresholdEvaluator="this.thresholdEvaluator"/>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

@Component
export default class IntegrationThreshold extends Vue {
  /* Variables */
  @Prop()
  private id: string;

  @Prop()
  private thresholdEvaluator: string;

  private integrationFound: boolean = false;

  /* Methods */

  get serviceName(): void {
    try {
      this.integrationFound = true;
      return require(`@/thresholds/${this.thresholdEvaluator}.vue`).default;
    } catch {
      return require(`@/thresholds/alertsv2.vue`).default;
    }
  }

}

</script>

<style lang="scss" scoped>
</style>
