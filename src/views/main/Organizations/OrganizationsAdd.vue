<template>
  <div class="container">
    <h1>New Organization</h1>

    <div class="row">
      <div class="clg6 cmd8 csm10 cxs12">
        <p>
          Create an organization to group all your integrations and pipelines.
          A company or project name are great to use.
          <span class="italics">You will not be able to change your organization ID</span>,
          but you can create and swap between as many IDs as you like.
        </p>
        <br>

        <form @submit.prevent>
          <div class="row">
            <div class="csm4 cxs12">
              <label for="id">Organization ID</label>
            </div>
            <div class="csm8 cxs12">
              <input
                type="text"
                placeholder="Organization Id"
                name="id"
                maxlength="30"
                v-model="id"
                v-validate="'required|id|hyphen'"
                data-vv-as="'Organization ID'">
              <p class="italics">
                Valid organization names include lowercased letters, numbers,
                single hyphens (-), and a character length between 2 and 30 characters.
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('id')">
                {{ errors.first('id') }}
              </banner>


              <!-- <div class="row">
                <div class="csm4 cxs12">
                  <label for="label">Label</label>
                </div>
                <div class="csm8 cxs12">
                  <input type="text" placeholder="Organization Label" name="label" v-model="label" v-validate="'required'">
                  <banner
                    type="danger"
                    icon="fas fa-exclamation-triangle"
                    v-if="errors.has('label')">
                    {{ errors.first('label') }}
                  </banner>
                </div>
              </div> -->

              <div class="text-right">
                <button class="button default outline" @click="addOrg()" type="submit" :disabled="errors.any()">
                  <i class="fas fa-plus"></i>
                  Add Organization
                </button>
              </div>
            </div>


          </div>
        </form>
      </div>
    </div>




  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import API from '@/API';

@Component
export default class OrganizationsAdd extends Vue {
  /* Variables */
  private id: string = '';
  private valid: boolean = false;
  // private label: string = '';

  /* Lifecycle */
  private created(): void {
    this.$validator.extend('id', {
      getMessage(value: any, field: any) {
        return 'Not a valid organization id.';
      },
      validate(value: any, field: any) {
        /* Rules: A-Za-z, 0-9, single dash, length between 2 and 30 */
        const regex: RegExp = /^[-a-zA-Z0-9]+$/;
        return (regex.test(value) && value.length <= 30 && value.length >= 2);
      },
    });
  }


  /* Methods */

  @Watch('id')
  private onFooChange(foo: string, newFoo: string) {
    this.id = this.id.toLowerCase().replace('.', '').replace(' ', '').replace('_', '');
  }

  private addOrg(): void {
    this.$validator.validateAll().then((result) => {
      if (result) {
        API.Organization.add(this.id);
      }
    });
  }

}

</script>

<style lang="scss" scoped>
</style>
