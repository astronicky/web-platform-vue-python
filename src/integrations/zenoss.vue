<template>
  <div>

    <tabs
    :list="true"
    :tabNav="false"
    :selected="tabIndex">
      <tab name="Zenoss">

        <h3>Zenoss Integration</h3>
        <br>

        <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
          <div class="row">
            <div class="csm6 cxs12">
              <label for="zenossName">Friendly Name</label>
            </div>
            <div class="csm6 cxs12">
              <input
                type="text"
                placeholder="Zenoss instance name"
                name="cxs12"
                v-model="integration.metadata.friendly_name"
                v-validate="'required'"
                data-vv-as="'zenossName'">

              <banner
                type="danger"
                icon="fas fa-exclamation-triangle"
                v-if="errors.has('step-1.zenossName')">
                {{ errors.first('step-1.zenossName') }}
              </banner>
              <p class="italics">
                Friendly name for the Zenoss instance
              </p>

            </div>

          </div>

          <div class="text-right">
            <button class="button default outline" type="submit">Create</button>
          </div>
        </form>

      </tab>

      
      <tab name="Setup">
        <h3>Setup Instructions</h3>
        <p>
          Please store the client_secret and client_id pair shown below to a secure storage.
          You will not be able to retrieve or view client_secret again.
        </p>
          <pre>
            ClientID: {{ this.creds.client_id }}
            ClientSecret: {{ this.creds.client_secret }}
          </pre>

        <p>
          1. Download <a download :href=this.zenpackUrl>ZenPacks.Cascadeo.EventForwarder</a> and <a download :href=this.tsdbForwarderUrl>OpenTSDBCascadeoPublisher Plugin</a> into Zenoss Control Center host.
        </p>
        <p>2. Go to Control Center UI, select your Zenoss installation under Applications and add the lines below to global variables by clicking on the Edit Variables link. Do not restart anything yet until the ZenPack and OpenTSDB plugins are installed.
          <pre v-if="this.environment === 'production'">
              global.conf.cascadeo_client_id {{ this.creds.client_id }}
              global.conf.cascadeo_client_secret {{ this.creds.client_secret }}
          </pre>
          <pre v-if="this.environment !== 'production'">
              global.conf.cascadeo_client_id {{ this.creds.client_id }}
              global.conf.cascadeo_client_secret {{ this.creds.client_secret }}
              global.conf.cascadeo_domain {{ this.domain[environment] }}
          </pre>
        </p>
        <p>3. Go to Services section of your Zenoss installation. Under Infrastructure -> opentsdb -> Configuration Files, click Edit link for opentsdb.conf. Add the lines below to opentsdb.conf. Reminder, do not restart anything yet until the plugin and zenpack are installed. 
          <pre v-if="this.environment === 'production'">
              tsd.query.skip_unresolved_tagvs = True
              tsd.core.plugin_path = /plugins
              tsd.rtpublisher.enable = True
              tsd.rtpublisher.plugin = io.cascadeo.tsdb.CascadeoPublisher
              tsd.plugin.cascadeo.api_key = {{ this.creds.client_id }}
              tsd.plugin.cascadeo.api_secret = {{ this.creds.client_secret }}
          </pre>
          <pre v-if="this.environment !== 'production'">
              tsd.query.skip_unresolved_tagvs = True
              tsd.core.plugin_path = /plugins
              tsd.rtpublisher.enable = True
              tsd.rtpublisher.plugin = io.cascadeo.tsdb.CascadeoPublisher
              tsd.plugin.cascadeo.api_key = {{ this.creds.client_id }}
              tsd.plugin.cascadeo.api_secret = {{ this.creds.client_secret }}
              tsd.plugin.cascadeo.domain = {{ this.domain[environment] }}
          </pre>
        </p>
        <p>4. Install ZenPack</p>
        <p>4.1. Install zenpack dependency
          <pre>
            servicedhost # serviced service shell -i -s cascadeo-dependencies zope bash
            root@zopecontainer # su - zenoss
            zenoss@zopecontainer # pip install requests-oauthlib
            zenoss@zopecontainer # exit
            root@zopecontainer # exit
            servicedhost # serviced snapshot commit cascadeo-dependencies
          </pre>
        </p>
        <p>4.2. Install zenpack
          <pre>
            servicedhost # cd &lt;zenpacklocation&gt;
            servicedhost # serviced service run zope zenpack-manager install ZenPacks.Cascadeo.EventForwarder-{{ this.tsdbForwarderVersion }}-py2.7.egg
          </pre>
        </p>
        <p>5. Install OpenTsdb plugin
          <pre>
            servicedhost # serviced service shell -s opentsdb-install opentsdb bash -c 'mkdir -p /plugins/'
            servicedhost # docker cp TSDBCascadeoPublisher-{{this.tsdbForwarderVersion}}.jar opentsdb-install:/plugins/
            servicedhost # serviced snapshot commit opentsdb-install
          </pre>
        </p>
        <p>6. Delete snapshot if needed
          </pre>
            docker rm -f opentsdb-install
          </pre>
        </p>
        <p> 7. Create default event trigger and notification using the command below, or create manually via Zenoss Web UI.
          <pre>
            serviced service run zope zendmd /opt/zenoss/ZenPacks/ZenPacks.Cascadeo.EventForwarder-{{ this.tsdbForwarderVersion }}py2.7.egg/ZenPacks/Cascadeo/EventForwarder/loadActions.py
          </pre>

        </p>
        <p>8. Restart zenoss. Replace service name with the name of your Zenoss service.
          <pre>
            serviced service restart Zenoss.Core/Zenoss   
          </pre>
        </p>
        
        <form @submit.prevent="step2('step-2')" data-vv-scope="step-2">
          <div class="text-right">
            <button class="button primary outline" type="submit">Done</button>
          </div>
        </form>      
      </tab>

    </tabs>

  </div>

</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';

import router from '@/router/router';
import API from '@/API';

@Component
export default class ZenossIntegration extends Vue {
  /* Variables */

  get currentOrg(): string | undefined { return API.Organization_v2.getCurrentId(); }

  private tabIndex: number = 0;

  private downloadBaseUrl: string = 'http://artifacts.cascadeo.io.s3-website-us-west-2.amazonaws.com';
  private zenpackVersion: string = '1.0.0';
  private zenpackUrl: string = `${this.downloadBaseUrl}/`
    + `ZenPacks.Cascadeo.EventForwarder/${this.zenpackVersion}/`
    + `ZenPacks.Cascadeo.EventForwarder-${this.zenpackVersion}-py2.7.egg`;

  private tsdbForwarderVersion: string = '1.1.0';
  private tsdbForwarderUrl: string = `${this.downloadBaseUrl}/`
    + `TSDBCascadeoPublisher/${this.tsdbForwarderVersion}/`
    + `TSDBCascadeoPublisher-${this.tsdbForwarderVersion}.jar`;

  private integration: IntegrationData<Zenoss> = {
    id: '',
    organization_id: API.Organization_v2.getCurrentId(),
    definition_id: 'zenoss',
    metadata: {
      friendly_name: '',
    },
  };

  private creds: IntegrationCredentials = {
    client_secret: '',
    client_id: '',
  };

  private environment: string | undefined = process.env.VUE_APP_ENV;

  private domain: object = {
      demo: 'platform.demo.cascadeo.io',
      production: 'platform.cascadeo.io',
      staging: 'platform.staging.cascadeo.io',
      local: 'platform.staging.cascadeo.io',
  };


  /* Lifecycle */

  // private created(): void {}

  /* Methods */
  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private step1(scope: string): void {
    this.$validator.validateAll('step-1').then((result) => {
      if (result) {
        API.Integration.add(this.integration)
          .then((response) => {
            this.integration.id = response.id;
            return API.Integration.addClient(this.integration.id, 'zenoss');
          })
          .then((response) => {
            this.creds.client_secret = response.client_secret;
            this.creds.client_id = response.client_id;
            this.gotoTab(this.tabIndex + 1);
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    });
  }

  private step2(scope: string): void {
    // TODO: validate if integration and api keys have been generated properly
    router.replace('/integrations');
  }

}



</script>

<style lang="scss" scoped>
</style>
