<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Windows">
        <h3>Windows Integration</h3>
        <br>
          <div class="row">
            <div class="csm6 cxs12">
              <label for="windowsAgentName">Windows Agent Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Windows Agent Name"
                name="windowsAgentName"
                v-model="integration.metadata.friendly_name"
                v-validate="'required|alpha_num'"
                data-vv-as="'Windows Agent Name'"
                data-vv-scope="step-1">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.windowsAgentName')">
                {{ errors.first('step-1.windowsAgentName') }}
              </banner>
              <p class="italics">
                Please provide a friendly name for your Windows Integration
              </p>

            </div>
          </div>
          <div class="text-right">
            <!-- <button class="button default outline" type="submit">Next</button> -->
            <button class="button default outline" @click="validateStep1('step-1')">Next to Plugin</button>
          </div>
        </tab>
      <tab name="Plugin">
        <h3>Add Plugin for Windows</h3>
        <br>
        <banner type="primary" icon="fas fa-exclamation-triangle">
            Note: Clicking "Next" will create your Windows Agent Integration. <br> If you would 
            like to delete it, please proceed to the Integrations page and delete it there.
        </banner>
        <br>
        <div class="row">
        <simple-accordion style="margin-left: 120px; padding-left: 20px">
              <!-- Here you can use v-for to loop through items  -->
              <vsa-item>
                <vsa-heading>
                  <h5>Microsoft SQL Server</h5>
                  <br>
                </vsa-heading>

                <vsa-content>
                  <div class="row">
                    <div>
                    <p class="bold">
                      NOTE: Current SQL Server Integration implementation requires SQL Server authentication to work. 
                    </p>
                    </div>
                    <div>
                      <label>Database Port Number</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="0 to 65535"
                        name="dbServerPort"
                        v-model="integration.metadata.sqlserver.server_port"
                        v-validate="{ regex: '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$' }"
                        data-vv-as="'Server Port'"
                        data-vv-scope="step-2">
                      <p class="italics">
                        Please provide the port number for your database
                      </p>
                    </div>
                  </div>
                </vsa-content>
              </vsa-item>
              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-2.dbServerPort')">
                {{ errors.first('step-2.dbServerPort') }}
              </banner>
          </simple-accordion>
        </div>
        <br>
        <div class="text-right">
          <button v-if="editing" class="button primary outline" type="submit" @click="validateStep2('step-2')">Next</button>
          <button v-else class="button primary outline" type="submit" @click="validateStep2('step-2')">Next</button>
        </div>
      </tab>
      <tab name="Access">
        <h3>SQL Server Setup</h3>
        <p>
          1. Enable the "TCP/IP" protocol from SQL Server Configuration Manager.
        </p>
        <p>
          2. The SQL server authentication must be set to <span class="bold">"SQL Server and Windows Authentication Mode"</span> in the Microsoft SQL Management Studio.
        </p>
        <p>
          3. To change/set the SQL server authentication mode, right click on the SQL server and select <span class="bold">"Properties"</span>
            <br><br>
            <img src="@/assets/sqlserver/sql_mode_auth1.png" alt="SQL Server" style="width:1100px;height:500px;">
            <br><br>
        </p>
        <p>
          4. This will open the <span class="bold">"Properties"</span> dialog. Select <span class="bold">"Security"</span> and change the Server authentication to <span class="bold">"SQL Server and Windows Authentication Mode"</span>. Click OK afterwards
            <br><br>
            <img src="@/assets/sqlserver/sql_mode_auth2.png" alt="SQL Server Properties" style="width:1100px;height:700px;">
            <br><br>
        </p>
        <p>
          5. The SQL server must be restarted after changing the authentication mode. Right click on the SQL server and select "Restart"
        </p>
        <p>
          6. Run the following T-SQL to create telegraf user on your SQL servers.  The account needs VIEW SERVER STATE and VIEW ANY DEFINITION permissions.
        </p>
        <p v-if="editing">
          <copy class="tag primary highlight" :key="agentCred.client_id" >
              USE master;
              GO
              CREATE LOGIN [telegraf] WITH PASSWORD = N'{{ agentCred.client_secret }}!';
              GO
              GRANT VIEW SERVER STATE TO [telegraf];
              GO
              GRANT VIEW ANY DEFINITION TO [telegraf];
              GO
          </copy>
        </p>
        <p v-else>
          <copy class="tag primary highlight" :key="agentCred.client_id" >
              USE master;
              GO
              CREATE LOGIN [telegraf] WITH PASSWORD = N'{{ agentCred.client_secret }}!';
              GO
              GRANT VIEW SERVER STATE TO [telegraf];
              GO
              GRANT VIEW ANY DEFINITION TO [telegraf];
              GO
          </copy>
        </p>
        <p v-if="editing">
          If telegraf already exist
          <copy class="tag primary highlight" :key="agentCred.client_id">
              ALTER LOGIN [telegraf] WITH PASSWORD=N'{{ agentCred.client_secret }}!';
          </copy>
        </p>
        <p v-else>
          If telegraf already exist
          <copy class="tag primary highlight" :key="agentCred.client_id">
              ALTER LOGIN [telegraf] WITH PASSWORD=N'{{ agentCred.client_secret }}!';
          </copy>
        </p>
        <div class="text-right">
          <button v-if="editing" class="button default outline" @click="gotoTab(3)">Next</button>
          <button v-else class="button default outline" @click="gotoTab(3)">Next</button>
        </div>
      </tab>
      <tab name="Deploy">
        <h3>Deploy agent</h3>
        <p>
          Download and install <a href="https://s3-us-west-2.amazonaws.com/artifacts.cascadeo.io/telegraf/windows-v0.0.2/SetupWindowsAgent.msi">Windows Agent</a>
        </p>
        <div class="text-left">

        </div>
        <p v-if ="editing">
          <pre>
            # Input the following details:
            Hostname: {{ urls.platform[environment] }}
            Client ID: {{ agentCred.client_id }}
            Client Secret: {{ agentCred.client_secret }}
            Config Type: {{ integration.config_type }}
          </pre>
        </p>
        <p v-else>
          <pre>
            # Input the following details:
            Hostname: {{ urls.platform[environment] }}
            Client ID: {{ agentCred.client_id }}
            Client Secret: {{ agentCred.client_secret }}
            Config Type: {{ integration.config_type }}
          </pre>
        </p>
        <hr>
        <p>
          <i>There are instances that your system will require for Microsoft .Net Dependency</i> <br>
          Download and install <a href="https://download.visualstudio.microsoft.com/download/pr/a45c8c1c-6466-4afc-a266-bd540069a4a6/97293f1080615bba5572ad1ef3be254c/dotnet-sdk-3.1.407-win-x64.exe
">dotnet-sdk-3.1.407-win-x64.exe</a>
        </p>

        <form @submit.prevent="exitIntegration()">
          <div class="text-right">
            <button class="button primary outline" type="submit">Done</button>
          </div>
        </form>
      </tab>

    </tabs>

  </div>

</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

import {
  VsaList,
  VsaItem,
  VsaHeading,
  VsaContent,
  VsaIcon
} from 'vue-simple-accordion';
import 'vue-simple-accordion/dist/vue-simple-accordion.css';
import { exit } from 'process';
import windows from '@/API/Integration/windows';
import { String } from 'node_modules/@types/lodash';

@Component({
  components: {
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon,
  },
})
export default class WindowsIntegration extends Vue {
  /* Variables */
  @Prop()
  private integrations: Array<Integration<All>>;
  @Prop()
  private editing: boolean;


  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }

  private tabIndex: number = 0;

  private errorMsg: string;


  private integration: IntegrationData<Windows> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'windows',
    config_type: '',
    metadata: {
      friendly_name: '',
      sqlserver: {
        integration_id: '',
        friendly_name: '',
        app_name: '',
        server_ip: '',
        server_port: '',
      },
    },
  };

  private integration_sqlserver: IntegrationData<Sqlserver> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'sqlserver',
    metadata: {
      friendly_name: '',
      port: '',
      integration_dependency: '',
      host_provider: 'Windows Agent',
    },
  };

  private agentCred: IntegrationCredentials = {
    client_secret: '',
    client_id: '',
  };

  private agentConfigs: AgentConfig[] = [];

  private environment: string | undefined = process.env.VUE_APP_ENV;

  private urls: object = {
    platform: {
      demo: 'https://platform.demo.cascadeo.io',
      production: 'https://platform.cascadeo.io',
      staging: 'https://platform.staging.cascadeo.io',
      local: 'https://platform.staging.cascadeo.io',
    },
  };

  /* Lifecycle */
  private created(): void {
    if (this.editing) {
      let sqlserverIntegrationId = '';
      for (const integration of this.integrations) {
        if (integration.id === this.$route.params.id && integration.definition_id === 'windows') {
          this.integration = integration;
          sqlserverIntegrationId = this.integration.metadata.sqlserver.integration_id;
        }
      }

      if (sqlserverIntegrationId !== '') {
        for (const integration of this.integrations) {
          if (integration.id === sqlserverIntegrationId && integration.definition_id === 'sqlserver') {
            this.integration_sqlserver = integration;
          }
        }
      }
    }
  }

  /* Methods */
  private validateStep1(scope: string): void {
    this.$validator.validateAll('step-1').then((result) => {
      if (result) {
        this.gotoTab(1);
      }
    });
  }

  private validateStep2(scope: string): void {
    this.$validator.validateAll('step-2').then((result) => {
      if (result) {
        this.submit();
      }
    });
  }

  private async submit() {
    if (this.editing)  {
      // if the server port field have value
      if (this.integration.metadata.sqlserver.server_port) {
        // if their is existing sqlserver plugin update sqlserver
        if (this.integration_sqlserver.metadata.port) {
          this.integration_sqlserver.metadata.port = this.integration.metadata.sqlserver.server_port;
          this.integration_sqlserver.metadata.integration_dependency = this.integration.metadata.friendly_name;
          this.integration_sqlserver.metadata.friendly_name = this.integration.metadata.friendly_name + ' (SQL Server Plugin)';
          await API.Integration.update(this.integration_sqlserver);
          await this.updateWindowsIntegration();
          this.exitIntegration();
        } else { // create sql server integration
          await this.addSqlServerIntegration();
          this.getWindowsIntegration();
          this.integration.config_type = 'plugin';
          this.gotoTab(2);
        }
      } else if (this.integration_sqlserver.metadata.port) {
        await this.updateWindowsIntegration();
        await this.updateSqlIntegration();
        this.exitIntegration();
      } else {
        await this.updateWindowsIntegration();
        this.exitIntegration();
      }
      await this.updateWindowsIntegration();

    } else if (this.integration.metadata.sqlserver.server_port !== '') {
      this.integration.config_type = 'plugin';
      this.createIntegration();
      this.gotoTab(this.tabIndex + 1);

    } else {
      this.integration.config_type = '';
      this.createIntegration();
      this.gotoTab(3);
    }

  }

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private async addWindowsIntegration() {
    this.integration.metadata.sqlserver.integration_id = this.integration_sqlserver.id;
    this.integration.metadata.sqlserver.friendly_name = this.integration.metadata.friendly_name + ' (SQL Server Plugin)';
    this.integration.metadata.sqlserver.app_name = 'telegraf';
    this.integration.metadata.sqlserver.server_ip = '127.0.0.1';

    await API.Integration.add(this.integration)
      .then((response) => {
        this.integration.id = response.id;
        return API.Integration.addClient(this.integration.id, 'windows');
      })
      .then((response) => {
        this.agentCred.client_secret = response.client_secret;
        this.agentCred.client_id = response.client_id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async updateWindowsIntegration() {
    this.integration.metadata.sqlserver.integration_id = this.integration_sqlserver.id;
    this.integration.metadata.sqlserver.friendly_name = this.integration_sqlserver.metadata.friendly_name;
    await API.Integration.update(this.integration)
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async updateSqlIntegration() {
    this.integration_sqlserver.metadata.port = 'None';
    this.integration_sqlserver.metadata.integration_dependency = 'None';
    await API.Integration.update(this.integration_sqlserver)
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async getWindowsIntegration(): Promise<void> {
    await API.Integration.getOne(this.integration.organization_id)
      .then((response) => {
        return API.Integration.getClient(this.integration.id, 'windows');
      })
      .then((response) => {
        this.agentCred.client_secret = response.client_secret;
        this.agentCred.client_id = response.client_id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async addSqlServerIntegration() {
    this.integration_sqlserver.metadata.friendly_name = this.integration.metadata.friendly_name + ' (SQL Server Plugin)';
    this.integration_sqlserver.metadata.port = this.integration.metadata.sqlserver.server_port;
    this.integration_sqlserver.metadata.integration_dependency = this.integration.metadata.friendly_name;
    await API.Integration.add(this.integration_sqlserver)
      .then((response) => {
        this.integration_sqlserver.id = response.id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async createIntegration() {
    if (this.integration.metadata.sqlserver.server_port) {
      await this.addSqlServerIntegration();
    }
    await this.addWindowsIntegration();
  }

  private exitIntegration(): void {
    router.replace('/integrations');
  }
}

</script>

<style lang="scss" scoped>
</style>