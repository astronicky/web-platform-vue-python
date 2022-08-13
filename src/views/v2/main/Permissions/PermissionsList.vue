<template>
  <div>
    <div class="cxs12">
      <div class="row cxs12 table-header">
          <div class="cxs4">
            <b>Scope</b>
          </div>
          <div class="cxs2">
            <b>Read</b>
          </div>
          <div class="cxs2">
            <b>Write</b>
          </div>
          <div class="cxs2">
            <b>Delete</b>
          </div>
          <div class="cxs2">
            <b>List</b>
          </div>
      </div>

      <div class="row cxs12 item"
        v-for="(permission, i) in this.formattedData" :key="permission.id"
      > 
          <div class="cxs4">
            {{ permission.name}}
          </div>
          <div class="cxs2">
            <input 
              type="checkbox" 
              :id="`read-permission-${i}`"
              class="checkbox"
              v-model="permission.read"
              @click="onCheckBoxChange($event.target.checked, 'read', permission.name)"
            />
            <label :for="`read-permission-${i}`" class="checkbox"></label>
          </div>
          <div class="cxs2">
            <input 
              type="checkbox" 
              :id="`write-permission-${i}`"
              class="checkbox"
              v-model="permission.write"
              @click="onCheckBoxChange($event.target.checked, 'write', permission.name)"
            />
            <label :for="`write-permission-${i}`" class="checkbox"></label>
          </div>
          <div class="cxs2">
            <input 
              type="checkbox" 
              :id="`delete-permission-${i}`"
              class="checkbox"
              v-model="permission.delete"
              @click="onCheckBoxChange($event.target.checked, 'delete', permission.name)"
            />
            <label :for="`delete-permission-${i}`" class="checkbox"></label>
          </div>
          <div class="cxs2">
            <input 
              type="checkbox" 
              :id="`list-permission-${i}`"
              class="checkbox"
              v-model="permission.list"
              @click="onCheckBoxChange($event.target.checked, 'list', permission.name)"
            />
            <label :for="`list-permission-${i}`" class="checkbox"></label>
          </div>
      </div>

        <div class="right">
          <!-- Disable until custom roles is released -->
          <button
          @click="cancelEdit()"
          class="button primary outline medium">
            Cancel
          </button>
          <button
          id="show-modal" 
          @click="showSavePermissionsModal = true"
          :disabled="!(this.permissionsToInsert.length > 0 || this.permissionsToDelete.length > 0)"
          class="button primary outline medium save-button">
            Save Permissions
          </button>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <modal v-model="showDeleteModal">
      <h2>
        Confirmation
      </h2>

      <p>
        Are you sure you want to delete this permission?
      </p>
      <button class="button success outline left" @click="deletePermission(deleteIdx)" style="margin-right:10px">
        <i class="fas fa-check"></i>
        Yes
      </button>
      <button class="button default outline left" @click="showDeleteModal = false">
        <i class="fas fa-times"></i>
        No
      </button>
    </modal>

    <modal v-model="showSavePermissionsModal">
      <h2>
        Confirmation
      </h2>

      <p>
        Are you sure you want to save this permissions?
      </p>
      <button class="button success outline left" @click="savePermissions()" :disabled="disableSave" style="margin-right:10px">
        <i class="fas fa-check"></i>
        Yes
      </button>
      <button class="button default outline left" @click="showSavePermissionsModal = false">
        <i class="fas fa-times"></i>
        No
      </button>
    </modal>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import router from '@/router/router';

@Component
export default class PermisionsList extends Vue {
  @Prop()
  private permissions: Permission[];

  @Prop()
  private roleID: string;

  private showDeleteModal = false;
  private deleteIdx = -1;
  private hasErrors: any[] = [];
  private formattedData: any[] = [];
  private availableScopes: Scope[] = [];
  private showSavePermissionsModal = false;
  private permissionsToInsert: any[] = [];
  private permissionsToDelete: any[] = [];
  private disableSave = false;
  private created(): void {
    this.getScopes();
    this.formatPermissionsData();
  }

  private save(): void {
    this.getScopes();
    this.formatPermissionsData();
  }

  @Watch('availableScopes')
  @Watch('permissions')
  private getDefinitions(): void {
    this.formatPermissionsData();
  }

  private formatScopesData(): void {
    for (const scopes of this.availableScopes) {
      if (this.formattedData.find((data) => data.name === scopes.resource)) {
        continue;
      }
      this.formattedData.push({
        name: scopes.resource,
        read: false,
        write: false,
        delete: false,
        list: false,
      });
    }
  }

  private formatPermissionsData(): void {
    this.formatScopesData();
    if (this.formattedData) {
      if (this.permissions) {
        for (const perm of this.permissions ) {
          const scope = perm.scope.split(':');
          const existing_data = this.formattedData.find((data) => data.name === scope[0]);
          existing_data.read = ((scope[1] === 'read') && (perm.action === 'allow')) ? true : existing_data.read;
          existing_data.write = ((scope[1] === 'write') && (perm.action === 'allow')) ? true : existing_data.write;
          existing_data.delete = ((scope[1] === 'delete') && (perm.action === 'allow')) ? true : existing_data.delete;
          existing_data.list = ((scope[1] === 'list') && (perm.action === 'allow')) ? true : existing_data.list;
        }
      }
    }
  }

  private cancelEdit() {
    router.go(-1);
  }

  private async savePermissions() {
    this.disableSave = true;
    if (this.permissionsToInsert.length > 0) {
      for (const pi of this.permissionsToInsert) {
        await this.addPermission(pi);
      }
    }
    if (this.permissionsToDelete.length > 0) {
      for (const pd of this.permissionsToDelete) {
        await this.deletePermission(pd);
      }
    }

    if (this.hasErrors.length > 0) {
      API.UI.addNotification({
        type: 'danger',
        text: 'Permission saved unsuccessfully.',
      });
    } else {
      API.UI.addNotification({
        type: 'primary',
        text: 'Permission saved successfully.',
      });
      this.$emit('savePermissionSucceeded');
    }

    this.permissionsToDelete = [];
    this.permissionsToInsert = [];
    this.showSavePermissionsModal = false;
    this.disableSave = false;
  }

  private async addPermission(perm: any) {
    let response;
    try {
      response = await API.Permission.add(perm);
    } catch (error) {
      this.hasErrors.push(error);
      return;
    }
  }

  private async getScopes() {
    this.availableScopes = await API.Scope.getScopes();
  }

  private onCheckBoxChange(value: boolean, permission: any, name: string) {
    const scope_name = `${name}:${permission}`;
    if (value) {
      this.checkExistingRecords(this.permissionsToInsert, this.permissionsToDelete, value, scope_name);
    } else {
      this.checkExistingRecords(this.permissionsToDelete, this.permissionsToInsert, value, scope_name);
    }
  }

  private checkExistingRecords(permission_list: any, check_list: any, value: boolean, scope_name: string) {
    const insertCheckList = () => {
      if (value) {
        permission_list.push({
          scope: scope_name,
          action: 'allow',
          role_id: this.roleID,
        });
      } else {
        const get_existing_permission = this.permissions.filter((per) => per.scope === scope_name);
        if (get_existing_permission.length > 0) {
          permission_list.push(get_existing_permission[0]);
        }
      }
    };

    if (check_list) {
      const checked_existing = check_list.filter((d) => d.scope === scope_name);
      if (checked_existing.length > 0) {
        check_list.splice(check_list.indexOf(checked_existing[0]), 1);
      } else {
        insertCheckList();
      }
    } else {
      insertCheckList();
    }
  }

  private async confirmDelete(i: number) {
      this.showDeleteModal = true;
      this.deleteIdx = i;
  }

  private async deletePermission(perm: any) {
    let response;
    try {
      response = await API.Permission.delete(perm);
    } catch (error) {
      this.hasErrors.push(error);
      return;
    }
  }
}

</script>

<style lang="scss" scoped>
.item:hover {
  background: none;
  box-shadow: inset .4rem 0 0 var(--c-primary-500);
  cursor: pointer;
  transition: var(--transition-short) all;
}
.save-button {
  margin-top: 10px;
  margin-left: 10px;
}

</style>