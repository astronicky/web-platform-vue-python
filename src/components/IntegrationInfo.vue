<template>
  <div v-if="showCard">
    <div class="card block clear">
      <service-image :id="id" :alt="`${id} logo`" :title="id"/>
      <h2>{{ integration.name }}</h2>
      <p>{{ integration.description }}</p>

      <div class="text-right">
        <a v-if="integration.link" :href="integration.link" target="_blank" class="tag primary link">
          <i class="fas fa-link"></i>
          Login
        </a>
        <span class="tag primary outline capitalize">{{ integration.tags[0] }}</span>
        <span v-if="integration.definition_type === 'input'" title="Input" class="tag default outline">
          <i class="fas fa-arrow-alt-to-right"></i>
          &nbsp;
          Input
        </span>
        <span
          v-if="integration.definition_type === 'output'"
          title="Output"
          class="tag default outline"
        >
          <i class="fas fa-external-link-square"></i>
          &nbsp;
          Output
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';

@Component
export default class IntegrationInfo extends Vue {
  /* Variables */
  @Prop()
  private id: string;

  private showCard: boolean = false;
  private integration: IntegrationDefinition = API.Integration.blankDefinition();

  /* Lifecycle */

  private created(): void {
    this.update();
  }

  /* Methods */


  @Watch('id')
  private getDefinitions(): void {
    this.update();
  }

  private update(): void {
    API.Integration.getDefinitions().then((response) => {
      response.forEach((i) => {
        if (i.definition_id === this.id) {
          this.integration = i;
          this.showCard = true;
        }
      });
    });
  }

}
</script>

<style lang="scss" scoped>

h2 {
  margin-bottom: 0.5rem;
}

p {
  margin: 0 0 1.5rem 0;
}

.card img {
  width: 12rem;
  padding: 1.25rem;
  height: auto;
  margin: 0 1rem 0 0;
  float: left;
}
</style>
