<template>
  <div >
    <div :class="`csm12 cmd6 clg4 n-body`">
      <div :class="`row ${isFromDashboard ? 'f-dashboard' : 'n-dashboard'}`">
        <div v-if="!isFromDashboard" class="rcorners1" align="center"> <p class="p-text">Asset Inventory</p>
          <p class="cm-num">{{ inventoryData.length  }}</p>
        </div>
        &nbsp; &nbsp;
        <div v-if="!isFromDashboard" class="rcorners1" align="center"> <p class="p-text">Unique Asset Types</p>
          <p class="cm-num">{{ checkList.length }}</p>
        </div>

        &nbsp; &nbsp;
        <div v-if="!isFromDashboard" class="rcorners1" align="center"> <p class="p-text">New Asset Types within 30 days</p>   
          <p class="cm-num">{{lastseenData.length}}</p>
        </div>      

        &nbsp; &nbsp;
        <div class="rcorners1" align="center"> <p class="p-text">Serverless</p>   
          <p class="cm-num">{{serverlessInventories.length}}</p>
        </div>

        &nbsp; &nbsp;
        <div class="rcorners1" align="center"> <p class="p-text">Containers</p>   
          <p class="cm-num">{{containersInventories.length}}</p>
        </div>
        &nbsp; &nbsp;
        <div class="rcorners1" align="center"> <p class="p-text">DevOps Tools</p>
          <p class="cm-num">{{devOpsToolsInventories.length}}</p>
        </div>
        <div v-if="isFromDashboard" class="link">
          <a href="/v2/asset-manager/reports" target="_blank"> View Inventory Assessment Report</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';
import API from '@/API';
import _ from 'lodash';

@Component
export default class InventoryTable extends Vue {
  @Prop()
  private isFromDashboard: boolean = false;

  private checkList: any = [];
  private inventoryData: any = [];
  private lastseenData: any = [];
  private integrations: Array<Integration<All>> = [];
  private allDefinitions: any = [];
  private serverlessDefinitions: any = [];
  private containersDefinitions: any = [];
  private devOpsToolsDefinitions: any = [];
  private serverlessInventories: any = [];
  private containersInventories: any = [];
  private devOpsToolsInventories: any = [];


  get currentOrg(): string {
    return API.Organization_v2.getCurrentId();
  }
  private created(): void {
    this.getInventoryDetails();
    this.getCheckBoxList();
    if (this.currentOrg) {
      this.getDefinitionsByCategories();
      this.getIntegrations();
    }
  }
  private getDefinitionsByCategories(): void {
    API.Definition.getDefinitionsByCategory('Serverless').then((res) => {
      this.serverlessDefinitions = res;
    });
    API.Definition.getDefinitionsByCategory('Containers').then((res) => {
      this.containersDefinitions = res;
    });
    API.Definition.getDefinitionsByCategory('DevOps').then((res) => {
      this.devOpsToolsDefinitions = res;
    });
  }
  private getIntegrations(): any {
    API.Integration.get().then((res) => {
      this.integrations = res;
      console.log('Integrations =>', this.integrations);
    });
  }

  @Watch('serverlessDefinitions')
  @Watch('integrations')
  private getServerlessInventories(): void {
    if (this.serverlessDefinitions.length > 0) {
      for (const definition of this.serverlessDefinitions) {
        if (this.integrations.length > 0) {
          for (const integration of this.integrations) {
            API.Inventory.getInventoryByServiceTypeAndIntegration(definition.ServiceType, integration.id).then((response) => {
              this.serverlessInventories = this.serverlessInventories.concat(response ? response : []);
            });
          }
        }
      }
    }
  }
  @Watch('containersDefinitions')
  @Watch('integrations')
  private getContainersInventories(): void {
    if (this.containersDefinitions.length > 0) {
      for (const definition of this.containersDefinitions) {
        if (this.integrations.length > 0) {
          for (const integration of this.integrations) {
            API.Inventory.getInventoryByServiceTypeAndIntegration(definition.ServiceType, integration.id).then((response) => {
              this.containersInventories = this.containersInventories.concat(response ? response : []);
            });
          }
        }
      }
    }
  }
  @Watch('devOpsToolsDefinitions')
  @Watch('integrations')
  private getDevOpsToolsInventories(): void {
    if (this.devOpsToolsDefinitions.length > 0) {
      for (const definition of this.devOpsToolsDefinitions) {
        if (this.integrations.length > 0) {
          for (const integration of this.integrations) {
            API.Inventory.getInventoryByServiceTypeAndIntegration(definition.ServiceType, integration.id).then((response) => {
              this.serverlessInventories = this.serverlessInventories.concat(response ? response : []);
            });
          }
        }
      }
    }
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

  @Watch('integrations')
  private getInventoryDetails(): void {
    console.log('getting Inventory Details ...');
    if (this.integrations.length > 0) {
      for (const integration of this.integrations) {
        API.Inventory.getInventory(integration.id).then((response) => {
          this.inventoryData = this.inventoryData.concat(this.parseDictionaryData(response));
        });
      }
    }
  }

  @Watch('inventoryData')
  private last_search() {
    for (const inventorylastData of this.inventoryData) {
         const todayDate = new Date();
         const lastseenDate = new Date(inventorylastData.last_seen);
         const oneDay = 1000 * 60 * 60 * 24;
         const diffInTime = todayDate.getTime() - lastseenDate.getTime();
         const diffInDays = Math.round(diffInTime / oneDay);
         if (diffInDays <= 30) {
           this.lastseenData.push(inventorylastData);
         }
    }
  }

  @Watch('inventoryData')
  private getCheckBoxList(): void {
    for (const integration of this.integrations) {
      API.Inventory.getServiceType(integration.id).then((response) => {
        for (const key in response) {
          if (this.checkList.length > 0) {
            for (let i = 0; i < this.checkList.length; i ++) {
              if (key.split('_')[0] === this.checkList[i]) {
                break;
              }
              if (i === this.checkList.length - 1) {
                this.checkList.push(key.split('_')[0]);
              }
            }
          } else {
            this.checkList.push(key.split('_')[0]);
          }
        }
      });
    }
  }
}
</script>


<style lang="scss" scoped>

.n-body {
  padding-bottom: 1.5rem;
  display: inline;
}

.n-dashboard > div {
  color: black;
  border-radius: 25px;
  background: #e8e9e5;
  padding: 20px;
  width: 200px;
  height: 150px;
  border: 1.6px solid rgb(45, 44, 44);
  align-items: center;
  align-self: center;
}

.n-dashboard > div p:nth-child(1){
  color: black;
  font-size: 1.7rem;
}

.n-dashboard > div p:nth-child(2){
  color: black;
  font-size: 3.5rem;
  font-weight: bold;
}

.f-dashboard {
  // width: 35%; 
  background: #fff;
  border-radius: 10px;
  padding: 20px 0;
}

.f-dashboard > div {
  border-bottom: 1px solid var(--c-gray-100);
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.f-dashboard > div:first-child {
  border-top: none;
}

.f-dashboard > div:nth-last-child(1){
  border-bottom: none;
}

.f-dashboard > div:nth-last-child(2){
  border-bottom: none;
}

.f-dashboard > div p:nth-child(1){
  order: 2;
  font-size: 12px;
}

.f-dashboard > div p:nth-child(2){
  font-size: 40px;
}

.link {
  font-size: 10px;
  text-align: center;
  font-weight: bold;
}
</style>