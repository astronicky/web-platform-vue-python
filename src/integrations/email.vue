<template>
  <div>
    <h2>Email</h2>
    <p>Give you email list a name, such as "Developers" or "Production Pipeline"</p>

    <div class="row">
      <div class="csm3 cxs12">
        <label :for="`email-list`" class="bold">List Name</label>
      </div>
      <div class="csm9 cxs12">
        <input
          type="text"
          id="list-name"
          name="list-name"
          placeholder="Name"
          data-vv-as="'List Name'"
          v-validate="'required'"
          v-model="integration.metadata.listname" />
        <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('list-name')">
          {{ errors.first('list-name') }}
        </banner>

      </div>
    </div>

    <div class="row">
      <div class="csm3 cxs12">
        <label :for="`email-list`" class="bold">Email List</label>
      </div>
      <div class="csm9 cxs12">
        <textarea
          name="emailRaw"
          id="emailRaw"
          rows="7"
          placeholder="jane.doe@email.com, "
          data-vv-as="'Email List'"
          v-model="emailRaw"
          v-validate="'required'"
          v-on:change="validateEmails()"></textarea>

        <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('emailRaw')">
          {{ errors.first('emailRaw') }}
        </banner>

        <p class="italics">
          Emails should be separated by commas in standard CSV format.
        </p>

        <div v-if="emailList.length > 0">
          <div class="bold underline">
            Emails ({{ emailList.length }})
          </div>
          <ul>
            <li v-for="(email, index) in emailList" :key="`email-${index}`" class="email">
              <span>
                {{ email.address }}
              </span>
              <span class="text-right bold">
                <span v-if="email.status === 'OK'" class="tag outline success">
                  <i class="fas fa-check-circle"></i>
                  OK
                </span>
                <span v-else class="tag outline danger">
                  <i class="fas fa-exclamation-triangle"></i>
                  INVALID
                </span>
              </span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <hr class="default">

    <div class="row">
      <div class="csm3 cxs12">
      </div>
      <div class="csm9 cxs12">
        <button class="button primary outline right" @click="save()">
          <i class="fas fa-save"></i>
          Save
        </button>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component
export default class EmailIntegration extends Vue {
  /* Variables */

  @Prop()
  private integrations: Array<Integration<All>>;
  @Prop()
  private editing: boolean;

  private integration: IntegrationData<Email> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'email',
    metadata: {
      listname: '',
      emails: [],
    },
  };

  private emailRaw: string = '';
  private emailList: Array<{address: string; status: string; }> = [];

  /* Lifecycle */
  private mounted(): void {
    // this.emailRaw = `${API.User.getUserEmail()}, `;
  }

  private created(): void {
    if (this.editing) {
      for (const integration of this.integrations) {
        if (integration.id === this.$route.params.id && integration.definition_id === 'email') {
          this.integration = integration;
          const list = integration.metadata.emails;
          list.forEach((email) => {
            this.emailRaw = this.emailRaw.concat(email + ', ');
          });
        }
      }
    }
  }

  /* Methods */

  private save(scope: string): void {

    if (JSON.stringify(this.emailList).includes('INVALID')) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Invalid email address.',
      });
      return;
    }

    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.integration.metadata.emails = this.emailList.map((x) => x.address);
        if (this.editing) {
          API.Integration.update(this.integration)
            .then(() => {
              router.replace('/integrations');
              API.UI.addNotification({
                type: 'primary',
                text: 'Updated email integration.',
              });
            })
            .catch((error: any) => {
              throw new Error(error);
            });
        } else {
          API.Integration.add(this.integration)
            .then(() => {
              router.replace('/integrations');
              API.UI.addNotification({
                type: 'primary',
                text: 'Added email integration.',
              });
            })
            .catch((error: any) => {
              throw new Error(error);
            });
        }
      }
    });
  }

  @Watch('emailRaw')
  private validateEmails(): void {
    this.emailList = [];
    const workingSet = JSON.parse(JSON.stringify(this.emailRaw).trim());
    const list: string[] = workingSet.split(',').map((x: string) => x.trim());
    if (list[list.length - 1] === '') { list.pop(); }
    list.forEach((email) => {

      /**
       * 1. Contains at least one `@`
       * 2. First part is non-empty
       * 3. Second part has at least one `.`
       */

      const status = () => {
        if (email === '' || !email.includes(`@`)) {
          return 'INVALID';
        }
        const parts = email.split(`@`);

        if (parts.length < 2 || !(parts[parts.length - 1].includes(`.`))) {
          return 'INVALID';
        }
        if (this.emailList.filter((x) => x.address === email).length > 0) {
          return 'INVALID';
        }

        return 'OK';
      };

      this.emailList.push( { address: email, status: status() });
    });

  }

}

</script>

<style lang="scss" scoped>

.email {
  display: grid;
  grid-template-columns: auto 10rem;
}

</style>
