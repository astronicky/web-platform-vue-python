<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Linux">
        <h3>Linux Integration</h3>
        <br>
          <div class="row">
            <div class="csm6 cxs12">
              <label for="linuxAgentName">Linux Agent Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Linux Agent Name"
                name="linuxAgentName"
                v-model="integration.metadata.friendly_name"
                v-validate="'required|alpha_num'"
                data-vv-as="'Linux Agent Name'"
                data-vv-scope="step-1">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.linuxAgentName')">
                {{ errors.first('step-1.linuxAgentName') }}
              </banner>
              <p class="italics">
                Please provide a friendly name for your Linux Integration
              </p>

            </div>
          </div>

          <div class="text-right">
            <!-- <button class="button default outline" type="submit">Next</button> -->
            <button class="button default outline" @click="validateStep1('step-1')">Next to Plugin</button>
          </div>
        </tab>
      <tab name="Plugin">
        <h3>Linux Plugins</h3>
        <p>
          By default CPU, load, memory/swap usage and filesystem space usage are collected/monitored by the Linux agent.
          Below are additional plugins that can be enabled to collect additional metrics.
        <p>
        <br>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="diskio">DiskIO Plugin</label>
          </div>
          <div class="csm6 cxs12">
            <input type="checkbox" v-model="diskio_enable" input id="diskio">
            <label for="diskio">Enabled</label>
          </div>
        </div>

        <div class="row">
          <div class="csm6 cxs12">
            <label for="diskio_devices" :disabled="!diskio_enable">Devices</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='"sda","sdb", "vd*"'
              name="diskio_devicesparam"
              :disabled="!diskio_enable"
              v-model="diskio_devices"
              data-vv-as="step-2">

            <p class="italics">
              Comma delimited list of devices will restrict the stats to the specified devices
            </p>
          </div>
        </div>

        <div class="row">
          <div class="csm6 cxs12">
            <label for="diskio_devicetags" :disabled="!diskio_enable">Devices Tags</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='"ID_FS_TYPE", "ID_FS_USAGE"'
              name="diskio_devicetagsparam"
              :disabled="!diskio_enable"
              v-model="diskio_devicetags"
              data-vv-as="step-2">

            <p class="italics">
              Comma delimited list of devices tags for systems that supports it. Field ignored if Devices field is not empty
            </p>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="ping">Ping Plugin</label>
          </div>
          <div class="csm6 cxs12">
            <input type="checkbox" v-model="ping_enable" input id="ping">
            <label for="ping">Enabled</label>
          </div>
        </div>

        <div class="row">
          <div class="csm6 cxs12">
            <label for="ping_urls" :disabled="!ping_enable">URLs</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='"test.local", "localhost", "127.0.0.1"'
              name="ping_urlsparam"
              :disabled="!ping_enable"
              v-model="ping_urls"
              data-vv-as="step-2">

            <p class="italics">
              Comma delimited list of URLs or IP address to Ping
            </p>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="procstat">Procstat Plugin</label>
          </div>
          <div class="csm6 cxs12">
            <input type="checkbox" v-model="procstat_enable" input id="procstat">
            <label for="procstat">Enabled</label>
          </div>
        </div>

        <div class="row">
          <div class="csm6 cxs12">
            <label for="procstat_pattern" :disabled="!procstat_enable">Pattern</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder="nginx|http|mysql"
              name="procstat_patternparam"
              :disabled="!procstat_enable"
              v-model="procstat_pattern"
              data-vv-as="step-2">

            <p class="italics">
              Regex pattern string of processes to monitor
            </p>
          </div>
        </div>
        <br>
        <div class="text-right">
          <button v-if="editing" class="button primary outline" type="submit" @click="validateStep2('step-2')">Next</button>
          <button v-else class="button primary outline" type="submit" @click="validateStep2('step-2')">Next</button>
        </div>
        <!-- <div class="text-right">
          <button v-if="editing" class="button default outline" @click="gotoTab(3)">Next</button>
          <button v-else class="button default outline" @click="gotoTab(3)">Next</button>
        </div> -->
      </tab>
      <tab name="LogCollection">
        <h3>Linux Log Collection</h3>
        <p>
          Collect and forward logs to Platform's central log location or extract metrics from the logs
        <p>
        <br>
        <div class="row">
          <div class="csm6 cxs12"> 
            <label for="taillog">Log Collection</label>
          </div>
          <div class="csm6 cxs12">
            <input type="checkbox" v-model="taillog_enable" input id="taillog">
            <label for="taillog">Enabled</label>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="taillog_files" :disabled="!taillog_enable">Log File Paths</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='/var/log/auth.log'
              name="taillog_filesparam"
              :disabled="!taillog_enable"
              v-model="taillog_files"
              data-vv-as="step-3">

            <p class="italics">
              Comma delimited list of log file paths to collect. No space between the comma and succeeding file path
            </p>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="taillog_patterns" :disabled="!taillog_enable">Log Grok Pattern</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='%{GREEDYDATA:log_line:string}'
              name="taillog_patternsparam"
              :disabled="!taillog_enable"
              v-model="taillog_patterns"
              data-vv-as="step-3">

            <p class="italics">
              Comma delimited list of log Grok pattern
            </p>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="tailmetric">Extract Log Metrics</label>
          </div>
          <div class="csm6 cxs12">
            <input type="checkbox" v-model="tailmetric_enable" input id="tailmetric">
            <label for="tailmetric">Enabled</label>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="tailmetric_files" :disabled="!tailmetric_enable">Log File Paths</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='/var/log/httpd/access_log'
              name="tailmetric_filesparam"
              :disabled="!tailmetric_enable"
              v-model="tailmetric_files"
              data-vv-as="step-3">

            <p class="italics">
              Comma delimited list of log file paths to extract metrics from. No space between the comma and succeeding file path
            </p>
          </div>
        </div>
        <div class="row">
          <div class="csm6 cxs12">
            <label for="tailmetric_patterns" :disabled="!tailmetric_enable">Log Grok Pattern</label>
          </div>
          <div class="csm6 cxs12">
            <input
              type="text"
              placeholder='%{COMMON_LOG_FORMAT}'
              name="tailmetric_patternsparam"
              :disabled="!tailmetric_enable"
              v-model="tailmetric_patterns"
              data-vv-as="step-3">

            <p class="italics">
              Comma delimited list of log Grok pattern
            </p>
          </div>
        </div>
        <br>
        <div class="text-right">
          <button v-if="editing" class="button primary outline" type="submit" @click="validateStep3('step-3')">Next</button>
          <button v-else class="button primary outline" type="submit" @click="validateStep3('step-3')">Next</button>
        </div>
      </tab>
      <tab name="Deploy">
        <h3>Deploy agent</h3>
        <p>
          Take note/copy the values of the following variables as this will be asked when running the deploy script:
          <pre>
            PLATFORM_URL={{ urls.platform[environment] }}
            AUTH_CLIENT_ID={{ agentCred.client_id }}
            AUTH_CLIENT_SECRET={{ agentCred.client_secret }}
          </pre>
        <p>
          Download and run the Linux agent script. NOTE: The script needs to run with root privileges so use 'sudo'
          <pre>
            wget "https://s3.us-west-2.amazonaws.com/artifacts.cascadeo.io/linux-agent/cascadeo-v0.0.1/start_platform.sh"
            chmod +x start_platform.sh
            sudo ./start_platform.sh
          </pre>
        <hr>
        <p>
          If the deployment script is successful, it should also automatically run the 'telegraf' service. But still check 
          the status of the service and start/restart it if necessary:
          <pre>
            IF DEBIAN/UBUNTU BASED:

            sudo systemctl status telegraf  --> to check telegraf status
            sudo systemctl restart telegraf --> to restart the service
          </pre>
          <pre>
            IF RHEL/CENTOS/AMAZON BASED:

            sudo service telegraf status  --> to check telegraf status
            sudo service telegraf restart --> to restart the service
          </pre>
        <hr>
        <h3 v-if="taillog_enable || tailmetric_enable">NOTES: Log Collection status is "NO_DATA"</h3>
        <p v-if="taillog_enable || tailmetric_enable">
          Check the following if the Log Collection integration status is <b>"NO_DATA"</b>:
        <p>
        <ol v-if="taillog_enable || tailmetric_enable">
          <li>
            Check and make sure that the <b>Log File Paths</b> field has the correct path of the log files. 
            If you changed or customized the Grok pattern fields, make sure that it's a valid expression and 
            that it works for the log files
          </li>
          <li>
            Check the permission of the log file. The <b>telegraf</b> daemon/service runs using 
            the <b>telegraf</b> account, so this account must have permission to read the log files to be collected. 
            Easiest way is to add the <b>telegraf</b> account to the group that has permssion to read the log files:
            <b-button v-b-toggle.register-1 variant="primary">Click to view example steps to modify permission</b-button>
              <b-collapse id="register-1" class="mt-2">
                <b-card>
                  <pre class="tag primary highlight code">

                    # Check the permission of the log file (e.g. /var/log/auth.log). run ls -la /var/log/auth.log

                    bitnami@ip-172-31-72-136:~$ ls -la /var/log/auth.log
                    -rw-r----- 1 root adm 131497 Jul  6 01:51 /var/log/auth.log

                    # The command will show the permission and ownership. In the example above, it’s own by the user "root" and 
                    owned by the group "adm" (read only). What we need is to know the group which is "adm".

                    # Add the "telegraf" user account to the "adm" group. You can user the following commands:

                    sudo usermod -aG adm telegraf

                    if the above command says that it is not available or not found, look for the full path of the command 
                    like the one below:

                    sudo /sbin/usermod -aG adm telegraf

                    # Verify that the "telegraf" account now have access to /var/log/auth.log. The command below should show 
                    the contents of the log file:

                    sudo -u telegraf head /var/log/auth.log

                    # Restart the telegraf service with this command:

                    sudo systemctl restart telegraf
                  </pre>
                </b-card>
              </b-collapse>
          </li>
        </ol>
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
import linux from '@/API/Integration/linux';
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
export default class LinuxIntegration extends Vue {
  /* Variables */
  @Prop()
  private integrations: Array<Integration<All>>;
  @Prop()
  private editing: boolean;


  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }

  private tabIndex: number = 0;

  private errorMsg: string;

  private ping_enable: boolean = false;
  private ping_urls: string = '';

  private diskio_enable: boolean = false;
  private diskio_devices: string = '';
  private diskio_devicetags: string = '';

  private procstat_enable: boolean = false;
  private procstat_pattern: string = '';

  private taillog_enable: boolean = false;
  private taillog_files: string = '';
  private taillog_patterns: string = '%{GREEDYDATA:log_line:string}';
  private taillog_custompatterns: string = '';

  private tailmetric_enable: boolean = false;
  private tailmetric_files: string = '';
  private tailmetric_patterns: string = '%{COMMON_LOG_FORMAT}';
  private tailmetric_custompatterns: string = '';
  private tailmetric_nginx_enable: boolean = false;
  private tailmetric_nginx_files: string = '';

  private integration: IntegrationData<Linux> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'linux',
    config_type: '',
    metadata: {
      friendly_name: '',
      diskio: {
        devices: [],
        devicetags: [],
      },
      procstat: {
        pattern: '',
      },
      ping: {
        urls: [],
      },
      tail: {
        log: {
          files: [],
          grok_patterns: [],
          grok_custom_patterns: [],
        },
        metric: {
          files: [],
          grok_patterns: [],
          grok_custom_patterns: [],
          default: {},
        },
        integration_id: '',
        friendly_name: '',
      },
    },
  };

  private integration_log: IntegrationData<Logmanagement> = {
      id: '',
      organization_id: API.Organization_v2.getCurrentId(),
      definition_id: 'logmanagement',
      metadata: {
        friendly_name: '',
        log: {},
        metric: {},
        integration_dependency: '',
        host_provider: 'Linux Agent',
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
      for (const integration of this.integrations) {
        if (integration.id === this.$route.params.id && integration.definition_id === 'linux') {
          this.integration = integration;
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
        this.gotoTab(2);
      }
    });
  }


  private validateStep3(scope: string): void {
    this.$validator.validateAll('step-3').then((result) => {
      if (result) {
        this.submit();
      }
    });

    // this.submit();
  }

  private async submit() {
    if (this.editing)  {

      await this.updateLinuxIntegration();
      this.exitIntegration();
    }

    if (this.diskio_enable) {
      if (this.diskio_devices !== '') {
          this.integration.metadata.diskio.devices = this.diskio_devices.split(',');
      } else if (this.diskio_devicetags !== '') {
          this.integration.metadata.diskio.devicetags = this.diskio_devicetags.split(',');
      }
    }

    if (this.ping_enable) {
      this.integration.metadata.ping.urls = this.ping_urls.split(',');
    }

    if (this.procstat_enable) {
      this.integration.metadata.procstat.pattern = this.procstat_pattern;
    }

    if (this.taillog_enable) {

      this.integration.metadata.tail.log.files = this.taillog_files.split(',');
      this.integration.metadata.tail.log.grok_patterns = this.taillog_patterns.split(',');
      this.integration.metadata.tail.log.grok_custom_patterns = this.taillog_custompatterns.split(',');
    }

    if (this.tailmetric_enable) {

      this.integration.metadata.tail.metric.files = this.tailmetric_files.split(',');
      this.integration.metadata.tail.metric.grok_patterns = this.tailmetric_patterns.split(',');
    }


    this.createIntegration();
    this.gotoTab(3);
  }

  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private async addLinuxIntegration() {

    this.integration.metadata.tail.integration_id = this.integration_log.id;
    this.integration.metadata.tail.friendly_name = this.integration.metadata.friendly_name + ' (Log Management Plugin)';

    await API.Integration.add(this.integration)
      .then((response) => {
        this.integration.id = response.id;
        return API.Integration.addClient(this.integration.id, 'linux');
      })
      .then((response) => {
        this.agentCred.client_secret = response.client_secret;
        this.agentCred.client_id = response.client_id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async updateLinuxIntegration() {
    await API.Integration.update(this.integration)
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async updateLogIntegration() {
    await API.Integration.update(this.integration_log)
      .catch((error) => {
        throw new Error(error);
      });
  }


  private async getLinuxIntegration(): Promise<void> {
    await API.Integration.getOne(this.integration.organization_id)
      .then((response) => {
        return API.Integration.getClient(this.integration.id, 'linux');
      })
      .then((response) => {
        this.agentCred.client_secret = response.client_secret;
        this.agentCred.client_id = response.client_id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async addLogManagementIntegration() {
    this.integration_log.metadata.friendly_name = this.integration.metadata.friendly_name + ' (Log Management Plugin)';
    this.integration_log.metadata.log = this.integration.metadata.tail.log;
    this.integration_log.metadata.metric = this.integration.metadata.tail.metric;
    await API.Integration.add(this.integration_log)
      .then((response) => {
        this.integration_log.id = response.id;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private async createIntegration() {
    if (this.taillog_enable || this.tailmetric_enable) {
      await this.addLogManagementIntegration();
    }
    await this.addLinuxIntegration();

    if (this.taillog_enable || this.tailmetric_enable) {
      if (this.integration.id !== '') {
        this.integration_log.metadata.integration_dependency = this.integration.id;
        await this.updateLogIntegration();
      }
    }
  }

  private exitIntegration(): void {
    router.replace('/integrations');
  }
}

</script>

<style lang="scss" scoped>
</style>