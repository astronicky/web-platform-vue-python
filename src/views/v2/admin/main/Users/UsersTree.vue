<template>
  <div>
    <div class="cxs12 tree">
      <div class="row cxs12">
          <div class="item cxs12" :class="{bold: isFolder()}">
            <div class="name cxs5">
              <span>
                {{ item.name }}
              </span>
            </div>
            <div class="email cxs5">
              <span>
              {{ item.email }}
              </span>
            </div>
            <!-- Actions -->
            <div class="actions cxs2">
              <button disabled="action"
                @click="confirm(`${item.id}`)" class="button primary outline small">
                Edit
              </button>
              &nbsp;
              <button disabled="action"
                @click="confirm(`${item.id}`)" class="button primary outline small danger">
                Delete
              </button>
            </div>
          </div>
      </div>
      
      <!-- Confirmation Modal -->
      <!-- <modal v-model="showModal">
        <h2>
          Confirmation
        </h2>

        <p>
          Are you sure you want to delete this user?
        </p>
        <button class="button success outline left" @click="deleteOrg()" style="margin-right:10px">
          <i class="fas fa-check"></i>
          Yes
        </button>
        <button class="button default outline left" @click="showModal = false">
          <i class="fas fa-times"></i>
          No
        </button>
      </modal> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import Sidebar from '@/views/v2/Sidebar.vue';
import router from '@/router/router';


@Component({name: 'users-tree'})
export default class UsersTree extends Vue {
  @Prop()
  private item: any;

  private isOpen: boolean = false;

  private showModal: boolean = false;

  private selectedOrgId: string;

  private router_path = router.currentRoute.path;

  private isFolder(): boolean {
    return true;
  }

  private toggle() {
    this.$emit('toggle', this.item);
    if (this.isFolder()) {
      this.isOpen = !this.isOpen;
    }
  }

  private makeFolder() {
    if (!this.isFolder()) {
      this.$emit('make-folder', this.item);
      this.isOpen = true;
    }
  }


  // private confirm(orgId) {
  //   // add prompt
  //   this.showModal = true;
  //   this.selectedOrgId = orgId;
  // }

  // private async deleteOrg(): Promise<void> {
  //   // close modal
  //   this.showModal = false;
  //   try {
  //     const response = await API.Organization_v2.deleteOrg(this.selectedOrgId);
  //     const organization = response.data;
  //     API.UI.addNotification({
  //       type: 'primary',
  //       text: `Organization "${organization.name}" deleted successfully.`,
  //     });

  //     await this.sleep(3000);
  //     router.go(0);
  //   } catch (err) {
  //     //
  //   }
  // }

  private sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private envIsMainPortal(): boolean {
    if (this.router_path.includes('admin')) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="scss" scoped>

.item {
  display: flex;
  padding: 1rem 0.75rem;
  border-top: .1rem solid var(--c-gray-300);
  border-bottom: .1rem solid var(--c-gray-300);
  border-left: none;
  border-right: none;
  margin-bottom: -0.1rem;
  text-decoration: none;
  transition: var(--transition-short) all;
}

.item:hover {
  background: none;
  box-shadow: inset .4rem 0 0 var(--c-primary-500);
  cursor: pointer;
  transition: var(--transition-short) all;
}

.disabled > .name, .disabled > .description{
  opacity: 0.5;
}

.cxs12.tree .cxs12 {
   padding-left: 0 !important;
   padding-right: 0 !important;
}

</style>