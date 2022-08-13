<template>
  <div class="container">
    <h1>New Organization</h1>

    <div class="row">
      <div>
        <p>
          Create an organization to group all your integrations and pipelines.
          A company or project name are great to use.
        </p>
        <br>

        <form @submit.prevent>
          <div class="row">
            <div class="csm4 cxs12">
              <label for="name">Organization Name</label>
            </div>
            <div class="csm8 cxs12">
              <input
                type="text"
                placeholder="Organization Name"
                name="name"
                maxlength="30"
                v-model="organization.name"
                v-validate="'required|hyphen'"
                data-vv-as="'Organization Name'">
              <p class="italics">
                Maximum length is 30 characters.
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('name')">
                {{ errors.first('name') }}
              </banner>
            </div>
          </div>

          <div class="row">
            <div class="csm4 cxs12">
              <label for="description">Description</label>
            </div>
            <div class="csm8 cxs12">
              <input
                type="text"
                placeholder="Organization Description"
                name="description"
                maxlength="30"
                v-model="organization.description"
                v-validate="''"
                data-vv-as="'Organization Description'">
              <p class="italics">
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('description')">
                {{ errors.first('description') }}
              </banner>
            </div>
          </div>

          <div v-if="parentID !== undefined" class="row">
            <div class="csm4 cxs12">
              <label for="parent_id">Parent ID</label>
            </div>
            <div class="csm8 cxs12">
              <select
                v-model="organization.parent_id"
              >
                <option disabled value="" hidden>Select Parent</option>
                <option v-for="opts in this.parentOpts" :disabled=!opts.enabled :key=opts.id :value=opts.id>{{ opts.label }}</option>
              </select>
              <p class="italics">
              </p>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('parent_id')">
                {{ errors.first('parent_id') }}
              </banner>

            </div>
          </div>

          <div class="row">
            <div class="csm4 cxs12">
              <label for="industry_id">Industry</label>
            </div>
            <div class="csm8 cxs12">
              <select
                v-model=industry
              >
                <option value="">-- Select  Industry --</option>
                <option v-for="opts in this.getIndustries()" :disabled=false :value=opts.name>{{ opts.name }}</option>
              </select>
              <p class="italics">
              </p>
            </div>
          </div>

          <div class="row">
            <div class="csm4 cxs12">
            </div>
            <div class="csm8 cxs12">
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
import { Component, Watch, Vue, Prop } from 'vue-property-decorator';
import Iam from '@/common/iam';
import API from '@/API';

@Component
export default class OrganizationsAdd extends Vue {
  /* Variables */
  private name: string = '';
  private description: string = '';
  private type: string = 'root';
  private valid: boolean = false;
  private organization: Organization = {name: '', description: '', is_active: true};
  private currentUser: string = Iam.currentUser();
  private parentOpts: Array<{label: string, id: string, enabled: boolean}> = [];
  private industry: string = '';

  @Prop()
  private parentID: string;

  @Prop()
  private modalEnabled: boolean;
  /* Lifecycle */
  private async created(): Promise<void> {
    await this.init();
  }


  /* Methods */
  @Watch('parentID')
  @Watch('modalEnabled')
  private reset(newID: string, oldID: string) {
    this.$validator.reset();
    this.init();
  }

  @Watch('name')
  private onFooChange(foo: string, newFoo: string) {
    this.name = this.name.toLowerCase().replace('.', '').replace(' ', '').replace('_', '');
  }

  private init() {
    this.organization = {name: '', description: ''};
    if (this.parentID) {
      this.organization.parent_id = this.parentID;
    }
    this.getParentOpts();
  }

  private getIndustries() {
    const industriesData = [
            {
                name: 'Accommodation',
            },
            {
                name: 'Accommodation and Food Service Activities',
            },
            {
                name: 'Administrative and Support Service Activities',
            },
            {
                name: 'Construction',
            },
            {
                name: 'Electricity, Gas, Steam and Air-Conditioning Supply',
            },
            {
                name: 'Financial and Insurance Activities',
            },
            {
                name: 'Human Health and Social Work Activities',
            },
            {
                name: 'Information and Communications Technology',
            },
            {
                name: 'Manufacturing',
            },
            {
                name: 'Mining and Quarrying',
            },
            {
                name: 'Personal Services and Other Service Activities',
            },
            {
                name: 'Pogo Service Providers',
            },
            {
                name: 'Professional, Scientific and Technical Services',
            },
            {
                name: 'Public Administrative and Defense; Compulsory Social Security',
            },
            {
                name: 'Real Estate Activities',
            },
            {
                name: 'Repair and Maintenance of Motor Vehicles and Motorcycles',
            },
            {
                name: 'Transportation and Storage',
            },
            {
                name: 'Wholesale and Retail Trade',
            },
        ];
    return industriesData;
  }

  private async addOrg(): Promise<void> {
    const result = await this.$validator.validateAll();
    if (result) {
      let response;
      try {
        if (this.industry !== '') {
          this.organization.metadata = [
            {
              key: 'industry',
              value: this.industry,
            },
          ];
        }
        response = await API.Organization_v2.addOrganization(this.organization);
      } catch (error) {
        if (error.response.status === 400) {
          API.UI.addNotification({
            type: 'danger',
            text: 'Organization name already exists, choose another name.',
          });
        } else {
          API.UI.addNotification({
            type: 'danger',
            text: 'Organization could not be added.',
          });
        }
        throw new Error('Organization could not be added.');
      }

      const organization = response.data;
      API.UI.addNotification({
        type: 'primary',
        text: `Organization "${organization.name}" added successfully.`,
      });

      this.organization = {name: '', description: ''};
      this.industry = '';
      this.$validator.reset();
      this.$emit('addOrgSucceeded');
      this.init();
    }
  }

  get fullPath() {
    return this.$route.path;
  }

  @Watch('fullPath')
  private async fullPathChanged(newPath: string, oldPath: string) {
    await this.init();
    this.$validator.reset();
  }

  private getParentOpts() {
    const organizations = API.Organization_v2.getAll();
    const accessibleOrgs = Object.keys(API.Organization_v2.getAccessible());
    this.parentOpts = API.Organization_v2.flatten(organizations, '', accessibleOrgs);
  }

}
</script>

<style lang="scss" scoped>
  option:first {
    color: #999;
}

</style>