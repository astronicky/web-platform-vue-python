<template>
    <div class="cxs12 tree">
      <div class="row cxs14">
          <div class="item cxs12" :class="{bold: isFolder(), disabled: actionsDisabled(item), enabled: !actionsDisabled(item)}">
            <div class="name cxs5" @click="emitSelectOrg">
              <div :style="`padding-left: ${level*20}px`">
                <div class="org">
                <button>
                <div class="orgImg" :style="stringtohash(item.id)">{{ orgshortname(item.name) }}</div>
                <span>{{item.name}}</span>
                </button>
                </div>
              </div>
            </div>
            <div class="description cxs5" @click="emitSelectOrg">
              <span>
              <p style="color:white; text-align:center;"> {{ item.description }} </p>
              </span>
            </div>
            <div class="toggle">
              <i style="color:white" v-if="isFolder() && !isOpen"  @click="toggle" class=" fas fa-chevron-right">
              </i>
              <i style="color:white" v-if="isFolder() && isOpen"  @click="toggle" class="fas fa-chevron-down">
              </i>
            </div>
        </div>
      </div>
      <transition name="slide-fade">
      <div class="row-child cxs12" v-show="isOpen" v-if="isFolder()">
          <sidebar-tree
            v-for="(child, index) in item.children"
            :key="index"
            :item="child"
            :level="level+1"
            :accessibleOrgs=accessibleOrgs
            @selectorg=selectorg($event)
          ></sidebar-tree>
      </div>
      </transition>
    </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import API from '@/API';
import Iam from '@/common/iam';
import Sidebar from '@/views/v2/Sidebar.vue';
import router from '@/router/router';
import { navItem } from '@aws-amplify/ui';


@Component({name: 'sidebar-tree'})
export default class SidebarTree extends Vue {
  @Prop()
  private item: any;

  @Prop()
  private level: number;

  @Prop()
  private accessibleOrgs: UserOrganization[];

  private currentUser: string = Iam.currentUser();

  private isOpen: boolean = false;

  private isFolder(): boolean {
    return this.item.children && this.item.children.length;
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

  private selectorg(item: Organization) {
    this.$emit('selectorg', item);
  }

  private async emitSelectOrg() {
    if (!this.actionsDisabled(this.item)) {
      this.$emit('selectorg', this.item);
    }
    // reset user org permission on newly selected org to prevent disabled integrations list
    await API.Organization_v2.setUserPermissions(this.item.id, this.currentUser);
  }

  private orgshortname() {
    return API.Organization_v2.orgShortName(this.item);
  }
  private stringtohash() {
    return API.Organization_v2.stringToHash(this.item.name);
  }

  private actionsDisabled(organization: Organization): boolean {
    const {id, root_id} = organization;
    if (this.accessibleOrgs[id!] === undefined) {
      return true;
    }
    return (!this.accessibleOrgs[id!] && !this.accessibleOrgs[root_id!]);
  }

  private getItemClass(organization: Organization): string {
    if (this.actionsDisabled(organization)) {
      return 'disabled';
    }
    return 'enabled';
  }
}


</script>

<style lang="scss" scoped>

.item {
  display: flex;
  padding: 1rem 1rem 1rem 1rem;
  border: none;
  margin-bottom: -0.1rem;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: var(--transition-short) all;
}

.item:hover {
  background: none;
  box-shadow: inset .4rem 0 0 var(--c-primary-500);
  cursor: pointer;
  transition: var(--transition-short) all;
}

p {
  overflow-wrap: anywhere;
}

.cxs12.tree .cxs12 {
   padding-left: 0 !important;
   padding-right: 0 !important;
}

.item.enabled {
     &:hover{
    color: var(--c-primary-500);
    background: var(--c-primary-900);
   }
}

.disabled > .name, .disabled > .description{
  opacity: 0.5;
}

.cxs5.description {
  margin-top: 1rem;
  text-overflow: ellipsis;
}
.toggle {
  margin-top: 1rem;
  margin-left: 5rem;
}

a,
button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 4.5rem;
  padding-left: 0.5rem;
  padding-right: 1.15rem;
  border: none;
  border-left: 0.5rem solid transparent;
  background: transparent;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--c-gray-100);
  font-size: 1.6rem;
  line-height: 1.45;
  text-align: center;
  transition: var(--transition-short) all;

  &:hover {
    padding-left: 1rem;
    // border-left: 0.5rem solid var(--c-primary-500);
    // color: var(--c-primary-500);
    // background: var(--c-primary-900);
    // transition: var(--transition-short) all;
  }

  &:focus,
  &:active,
  &.active {
    color: var(--c-primary-900);
    background: var(--c-gray-100);
    border-left: 0.5rem solid var(--c-primary-500);
    text-shadow: none;
    // transition: var(--transition-short) all;
  }

  .fas {
    font-size: 1.6rem;
    flex: 0 0 2rem;
    margin: 0 1.5rem 0 1rem;
    text-align: center;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 1;
    // transition: var(--transition-medium) opacity;
  }
}

/* Organizations */

.org {
  a.active,
  a:focus,
  button.active,
  button:focus {
    background: none;
  }

  span {
    font-size: 1.6rem;
    color: var(--c-gray-100);
    text-transform: initial;
  }

  .orgImg {
    flex: 0 0 3rem;
    height: 3rem;
    border-radius: 999rem;
    margin: 0 1rem 0 0.5rem;
    text-align: center;
    line-height: 1.8;
    font-weight: 700;
    background: white;
    color: var(--c-gray-900);
    text-transform: initial;

    .fas {
      position: relative;
      top: 0.05rem;
      margin: 0;
    }
  }
}
</style>