<template>
  <div v-if="filteredIntegrations.length > 0 && shouldGoNextRequest === false">
    <div class="row cxs12">
      <div>
          <button
          class="button primary outline medium">
          AWS
          </button>
      </div>&emsp;
      <div>
          <button
          class="button primary outline medium" disabled>
          GCP
          </button>
      </div>&emsp;
      <div>
          <button
          class="button primary outline medium" disabled>
          Azure
          </button>
      </div>
    </div>
    <br>
    <div class="row cx12">
      <div>
        <label class="bold">Select Integration ID:</label>
      </div>
      <div class="clg5 cmd6 csm8 cxs12">
        <!-- <select required v-model="supportedId" @change="searchId()">
          <option selected disabled value="" hidden>Integration ID</option>
          <option v-for="id in managementId" :key=id>{{ id }}</option>
        </select> -->
        <select required v-model=selectedIntegration @change="integrationChange()">
          <!-- <option selected disabled value="" hidden>Integration ID</option> -->
          <option v-for="integration in filteredIntegrations" :key="integration.id" :value="integration">{{integration.id}} --- {{integration.metadata.friendly_name}}</option>
        </select>
        <div class="search search-style">
          <input type="text" name="searchText" placeholder="Search..." class="header-search" @keyup.enter="searchInv()" v-model="searchText" />
          <button class="search-button" @click="searchInv()"> 
          <i class="fas fa-search"></i></button>
        </div>
      </div>
    </div>
    <div v-if="inventoryData.length != 0">
    <br>
    <div>
      <div class="filter-div" @click="isFilter = !isFilter">
        <i class="fas fa-bars"/> Filter
      </div>
      <div class="row cxs12">
        <div class="row cxs12" style="position: relative">
          <div v-if="isFilter" class="cb-container">
            <div class="cb-table">
              <ul class="cb-ul" v-for="(check, index) in checkList" v-bind:key="check.integration">
                <li class="cb-header"> {{ check.integration}}</li>
                <li class="cb-data" v-for="(data, index2) in check.data" v-bind:key="data.service_type">
                  <input :id="`cb-${check.integration}-${data.service_type}_input`" :name="`cb-${check.integration}-${data.service_type}_input`" v-model="data.check" type="checkbox"/>
                  <label :id="`cb-${check.integration}-${data.service_type}_label`" :for="`cb-${check.integration}-${data.service_type}_input`" class="cb-texts" style="text-transform: capitalize">{{ data.service_type }} </label>
                </li>
              </ul>
            </div>
            <button
              class="button primary outline small submit-btn" @click="checkedType(); isFilter = !isFilter;">
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
    <br><br>
    <div class="search-query" v-if="searchText.length > 0"> Search Query: 
      {{ searchText }}
      <br><br>
      <div class="search-query" v-if="inventoryData.length < 1">No result found<br><br></div>
    </div>
    <div class="row cxs12">
      <div class="pagination-box pagination-box-top">
        <div style="margin-right: 1rem;">
          <span>{{inventoryData.length}} items</span>
        </div>
        <div>
          <pagination
            :dataSource="dataSource"
            :totalPages="totalPages"
            :perPage="perPage"
            :currentPage="currentPage"
            @pageChanged="onPageChange"
            :labels="customLabels"
            :styles="customStyles"
          />
        </div>
        
        <div style="display: flex; flex-direction: row;">
          <span style="white-space: nowrap; margin-left: 3rem;">Show Per Page:</span> 
          <select style="padding: 0; margin-bottom: 0;" v-model=perPage>
            <option v-for="perPageNum in availableNumbers" :key="perPageNum">{{perPageNum}}</option>
          </select>
        </div>
      </div>
    </div>
  <div>
    <div class="tree">
      <table border="1" class="styled-table" cellpadding="0">
        <thead style="background-color:hsl(192deg 71% 92%);">
          <tr class="header-table">
              <th class="default">IntegrationID</th>
              <th class="default">ResourceID</th>
              <th class="default">Region</th>
              <th class="default">ServiceType</th>
              <th class="default">Findings</th>
              <th class="width-metadata-tags">Metadata</th>
              <th class="width-metadata-tags">Tags</th>             
          </tr>
        </thead>
        <tbody>
          <!-- <tr v-for="(user) in assignData.length > 0 ? assignData : pageOfItems" v-bind:key="user.email">   -->
          <tr v-for="(user) in pageOfItems" v-bind:key="user.email">  
              <td class="default">
                <span v-if="user.integration_id">{{ user.integration_id }}</span><span v-else>-</span>
              </td>
              <td class="default"><span v-if="user.resource_id">{{ user.resource_id }}</span><span v-else>-</span></td>
              <td class="default"><span v-if="user.region">{{ user.region }}</span><span v-else>-</span></td>
              <td class="default"><span v-if="user.service_type">{{ user.service_type }}</span><span v-else>-</span></td>
              <td class="default"><span v-if="user.findings"> {{ user.findings }} </span><span v-else>-</span></td>
              <td>
                <div class="container container-style meta-right">
                  <pre id="json"><code>{{ user.metadata }}</code></pre>
                </div>
              </td>
              <td>
                <div class="container container-style meta-right">
                  <pre id="json"><code>{{ user.tags }}</code></pre>
                </div>
              </td>            
          </tr>
        </tbody>
      </table>
      <div class="row cxs12">
        <div class="pagination-box pagination-box-bottom">
          <div style="margin-right: 1rem;">
            <span>{{inventoryData.length}} items</span>
          </div>
          <div>
            <pagination
              :dataSource="dataSource"
              :totalPages="totalPages"
              :perPage="perPage"
              :currentPage="currentPage"
              @pageChanged="onPageChange"
              :labels="customLabels"
              :styles="customStyles"
            />
          </div>
          
          <div style="display: flex; flex-direction: row;">
            <span style="white-space: nowrap; margin-left: 3rem;">Show Per Page:</span> 
            <select style="padding: 0; margin-bottom: 0;" v-model=perPage>
              <option v-for="perPageNum in availableNumbers" :key="perPageNum">{{perPageNum}}</option>
            </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div v-else>
      <h3 align="center">No Asset Found on this Integration.</h3>
    </div>    
  </div>
  <div v-else>
    <h2 align="center">
    <br>No Assets Found</h2>
    <br>
    <p align="center" class="p-back"><a href="/v2/integrations/" class="p-back"> &laquo; Back to Integrations</a></p>
  </div>
</template>
<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator';
import Pagination from './Pagination.vue';
import API from '@/API';
import _, { isNull } from 'lodash';
// import './inventery.css';

const customLabels = {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>',
};

const customStyles = {
    ul: {
    },
    li: {
        display: 'inline-block',
        border: '2px green',
    },
    button: {
        // color: 'blue',
        width: '3rem',
        height: '3rem',
    },
};

@Component({
  components: {
    pagination: Pagination,
  },
})
export default class InventoryTable extends Vue {
  private checkList: any = [];
  private inventoryData: any = [];
  private dataSource: any = [];
  private pageOfItems: any = [];
  private customLabels: any = customLabels;
  private customStyles: any = customStyles;
  private orgData: any = [];
  private orgDictData: any = [];
  private assignData: any = [];
  private searchData: any = [];
  private supportedId: any = [];
  private searchText: string = '';
  private showModal: boolean = false;
  private beginBool: boolean = false;
  private default_checked: boolean = true;
  private metadata: any = JSON.stringify([], undefined, 2) ;
  private integrations: Array<Integration<All>> = [];
  private filteredIntegrations: Array<Integration<All>> = [];
  private selectedIntegration: any = null;
  private selectedIntegrationIndex: number = -1;
  private currentPage: number = 1;
  private perPage: number = 40;
  private availableNumbers = [40, 70, 100];
  private totalPages: number = 1;
  private shouldGoNextRequest: boolean = true;
  private isFilter: boolean = false;
  private mounted() {
    this.beginBool = false;
    this.currentPage = 1;
  }
  private str_limit(value, size) {
      if (!value) {
        return '';
      }
      value = value.toString();
      if (value.length <= size) {
        return value;
      }
      return value.substr(0, size) + '...';
  }
  private parseDictionaryData(dictionaryData) {
    let tempData: any = [];
    Object.keys(dictionaryData).forEach((keyName) => {
      const listData = dictionaryData[keyName];
      listData.forEach((item) => {
        item[`serviceType`] = keyName;
      });
      dictionaryData[keyName] = listData;
      tempData = [...tempData, ...listData];
    });
    return tempData;
  }

  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }

  // get managementId(): string[] {
  //   const inventoryId: any[] = [];
  //   if (this.integrations.length > 0) {
  //     this.integrations.forEach((x) => {
  //       if (x.definition_id === 'inventory_mgmt') {
  //         inventoryId.push(x.id);
  //       }
  //     });
  //   }
  //   return inventoryId;
  // }
  private created(): void {
    this.getInventoryDetails();
    this.getCheckBoxList();
    this.checkedType();
    if (this.beginBool === false) {
      this.filterData(this.checkList[0]);
      this.beginBool = true;
    }
    if (this.currentOrg) {
      this.getIntegrations();
    }
  }
  @Watch('currentOrg')
  private updateSelected() {
    this.getIntegrations();
  }
  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
      this.sort();
    });
  }

  @Watch('integrations')
  private sort(): void {
    this.integrations.forEach((x, i) => {
      // Hardcode threshold evaluator setting for now until we add new metadata to integrations
      if (x.definition_id === 'globe_billing') {
        this.integrations[i].metadata.threshold_evaluator = 'globe_billing';
      } else {
        this.integrations[i].metadata.threshold_evaluator = 'alertsv2';
      }
    });
    this.filteredIntegrations = this.integrations.filter((item) => item.definition_id === 'inventory_mgmt');
    if (this.filteredIntegrations.length > 0) {
      this.shouldGoNextRequest = true;
      this.selectedIntegrationIndex = 0;
      this.selectedIntegration = this.filteredIntegrations[0];
    }
  }
  @Watch('selectedIntegration')
  private getInventoryDetails(): void {
    if (!isNull(this.selectedIntegration)) {
      API.Inventory.getInventory(this.selectedIntegration.id).then((response) => {
        this.orgDictData = response;
        this.inventoryData = this.parseDictionaryData(response);
        this.orgData = this.inventoryData;
        console.log('InventoryData length =>', this.inventoryData.length);
        if (this.inventoryData.length === 0) {
          if (this.selectedIntegrationIndex < this.filteredIntegrations.length - 1 && this.shouldGoNextRequest === true) {
            this.selectedIntegrationIndex += 1;
            this.selectedIntegration = this.filteredIntegrations[this.selectedIntegrationIndex];
          } else if (this.selectedIntegrationIndex === this.filteredIntegrations.length - 1 && this.shouldGoNextRequest === true) {
            // No Assets Found for every integration_id
          } else {
            this.shouldGoNextRequest = false;
          }
        } else {
          this.shouldGoNextRequest = false;
        }
      });
    }
  }

  @Watch('orgDictData')
  private getCheckBoxList(): void {
    if (isNull(this.selectedIntegration)) {
      return;
    }
    this.checkList = [];
    Object.keys(this.orgDictData).forEach((key) => {
      const data = key.split('_');
      if (this.checkList.length > 0) {
        const existing_data = this.checkList.find((d) => d.integration === data[0].toLowerCase());
        if (existing_data) {
          const existing_service_type = existing_data.data.find((d) => d.service_type === data[1].toLowerCase());
          if (!existing_service_type) {
            existing_data.data.push({service_type: data[1].toLowerCase(), check: false});
          }
        } else {
          this.checkList.push({ integration: data[0].toLowerCase(), data: [{service_type: `${data[1].toLowerCase()}`, check: false}]});
        }
      } else {
        this.checkList.push({ integration: data[0].toLowerCase(), data: [{service_type: `${data[1].toLowerCase()}`, check: false}]});
      }
    });
  }
  @Watch('inventoryData')
  @Watch('perPage')
  private getTotalPages(): void {
    this.dataSource = this.inventoryData;
    this.totalPages = (this.inventoryData.length % this.perPage === 0) ? Math.floor(this.inventoryData.length / this.perPage) : Math.floor(this.inventoryData.length / this.perPage) + 1;
    this.currentPage = 1;
    this.pageOfItems = this.dataSource.slice((this.currentPage - 1) * this.perPage, (this.currentPage - 1) * this.perPage + this.perPage);
  }
  @Watch('checkList')
  private checkedType(): void {
    if (this.checkList.length < 1) { return; }
    this.assignData = [];
    for (const intData of this.checkList) {
      for (const serviceTypeData of intData.data) {
        const check = document.getElementById(`cb-${intData.integration}-${serviceTypeData.service_type}_input`) as HTMLInputElement;
        const checkName = document.getElementById(`cb-${intData.integration}-${serviceTypeData.service_type}_label`) as HTMLLabelElement;
        if (check?.checked) {
          this.filterData(`${intData.integration}_${checkName.innerText}`);
          this.default_checked = false;
        }
      }
    }

    if (this.default_checked) {
        this.filterData(`${this.checkList[0].integration}_${this.checkList[0].data[0].service_type}`);
        this.inventoryData = this.assignData;
        this.default_checked = false;
    }
    let allUnChecked = true;
    for (const intData of this.checkList) {
      let hasChecked = false;
      for (const serviceTypeData of intData.data) {
        const check = document.getElementById(`cb-${intData.integration}-${serviceTypeData.service_type}_input`) as HTMLInputElement;
        if (check?.checked) {
          hasChecked = true;
          break;
        }
      }
      if (hasChecked) {
        allUnChecked = false;
        break;
      }
    }
    if (allUnChecked) {
      if (this.searchText === '') {
        this.inventoryData = this.orgData;
      } else {
        this.inventoryData = this.searchData;
      }
    } else {
      this.inventoryData = this.assignData;
    }
  }
  @Watch('serviceType')
  private filterData(serviceType): void {
    if (this.searchText === '') {
      _.filter(this.orgData, (item) => {
        if (item.serviceType.toLowerCase() === serviceType.toLowerCase()) {
          this.assignData.push(item);
        }
      });
    } else {
      _.filter(this.searchData, (item) => {
        if (item.serviceType.toLowerCase() === serviceType.toLowerCase()) {
          this.assignData.push(item);
        }
      });
    }
  }
  private searchInv(): void {
    if (this.searchText !== '') {
      // console.log(this.inventoryData);
      // this.inventoryData.map((o) => console.log(JSON.stringify(o)));
      this.searchData = this.orgData.filter((o) =>  JSON.stringify(o).toLowerCase().includes(this.searchText.toLowerCase()) );
      this.inventoryData = this.searchData;
    } else {
      this.inventoryData = this.orgData;
    }
    this.checkedType();
  }

  private onPageChange(page, pageItems) {
    this.currentPage = page;
    this.pageOfItems = pageItems;
  }
  // private searchId(): void {
  //   if (this.supportedId !== '') {
  //     // console.log(this.inventoryData);
  //     this.supportedId = this.orgData.filter((o) =>  JSON.stringify(o).toLowerCase().includes(this.searchText.toLowerCase()) );
  //     this.inventoryData = this.supportedId;
  //   } else {
  //     this.inventoryData = this.orgData;
  //   }
  //   this.checkedType();
  // }
}
</script>

<style lang="scss" scoped>

.header-search {
  right: 0;
  // width: 300px;
  float: right;
  margin-bottom: 0px;
  @media (max-width: 767px) {
    width: 100%;
  }
}

.search {
  display: flex;
  @media (max-width: 767px) {
    width: 100%;
  }
}

.search-style {
  position: absolute;
  right: 3rem;
}

.cb {
  padding-right: 14px;
}

.cb-texts {
  margin: 0 0 0 0;
  line-height: 1.325;
  letter-spacing: .1rem;
  word-spacing: .1rem;
  /* padding: 2px; */
  padding-right: 25px;
  /* text-shadow: .2rem 0rem 0 var(--c-gray-100), -.2rem 0rem 0 var(--c-gray-100); */
}

.item-texts div {
  line-height: 1.325;
  letter-spacing: 0.1rem;
  font-size: 1rem;
  padding-left: 1rem;
  padding: 6px;
  width: 10.89rem;
  border: 0.1rem solid var(--c-gray-500);
  font-size: 0.89rem;
}
.asset-untagged div {
  background: var(--c-info-400);
}

thead {
  color: black;
}

.styled-table {
  // width: 25% !important;
  border-collapse: collapse;
}

.item-texts div {
  line-height: 1.325;
  letter-spacing: 0.1rem;
  font-size: 1rem;
  padding-left: 1rem;
  padding: 6px;
  width: 10.89rem;
  border: 0.1rem solid var(--c-gray-500);
  font-size: 0.89rem;
}

.class-lim {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-query {
  margin: 0 0 0 0;
  font-size: 2.0rem;
}

.default {
  padding: 6px 14px;
  // width: 130px;
}

.default-meta {
  padding: 6px 14px;
}

.meta-right {
    float: left;
    text-align: left;
    padding: 6px 14px;
    max-width: 400px;
    height: 200px;
}

.pagination-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px 4px 30px;
  background-color: #f4f1f1;
}
.pagination-box-top {
  margin-left: auto;
}
.pagination-box-bottom {
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
}

.container-style {
    margin-bottom: 0;
    border: 0 0 0 0;
    padding-bottom: 0;
    padding: 0 0 0 0;
    border-color: transparent;
    width: 100%
}

.width-metadata-tags {
    width: 20%;
}

code {
    white-space: pre-wrap;
    font-family: Lato, Helvetica, Verdana, sans-serif;
}

pre {
    font-family: Lato, Helvetica, Verdana, sans-serif;
    padding: 6px 14px;
    overflow-y: scroll;
    height: 100%;
}

@media (prefers-color-scheme: dark) {
  select:invalid,
  select option:disabled,
  ::placeholder {
    color: #808080;
  }
  select option {
    color: white;
  }
  .pagination-box {
    background-color: #111919;
 }
 .cb-container {
    background-color: var(--c-gray-900);;
 }
}

@media (prefers-color-scheme: light) {
  .cb-container {
    background-color:var(--c-gray-100);
  }
}

.cb-container {
  border: solid 1px;
  width: 100%;
  position: absolute;
  z-index: 2;
}
.cb-table {
  display: flex;
  flex-wrap: wrap;
}

.cb-ul label {
  font-weight: 400;
  font-size: 0.8em;
  letter-spacing: normal;
  line-height: 1.525;
}

.submit-btn {
  display: flex;
  float: right;
  margin: -10px 5px 5px 5px;
}

.cb-header {
  font-weight: bold;
  text-transform: uppercase;
}

.cb-ul {
  display: inline-block;
  padding-right: 15px;
  padding-left: 15px;
  width: 20%;
}

.filter-div {
  cursor: pointer;
  width: auto;
  display: inline-block;
}

</style>
