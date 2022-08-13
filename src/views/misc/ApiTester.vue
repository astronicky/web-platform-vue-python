<template>
  <div>
    <!--
    Quick endpoint checker with correct token
    accessToken is correct, NOT token_id
    -->
    <h1>API Tester</h1>

    <banner
      type="primary"
      icon="fas fa-exclamation-triangle">
      All calls hit external API, data and requets are real on this environment.
    </banner>


    <div class="bold">URL Fragment</div>

    <div class="url">
      <select name="selection" v-model="method">
        <option value="GET" selected>GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      &nbsp;
      <input
        type="text"
        ref="url"
        @keyup.enter="apiSimple"
        v-model="endpointUrl">
    </div>


    <banner
      type="default"
      icon="fas fa-id-badge">
      Current Organization:
      <span class="bold">
        {{ currentOrg }}
      </span>
    </banner>

    <hr>

    <p>
      <button
        @click="apiSimple()"
        class="button default outline">
        <i class="fas fa-arrows-h"/>
        API Simple
      </button>
      <span class="italics">
        (Default)
      </span>
      Uses the initialized settings of <span class="tag primary outline">api</span>
      as real Platform call.
    </p>

    <p>
      <button
        @click="apiDefault()"
        class="button default outline">
        <i class="fas fa-exchange-alt"/>
        API Default
      </button>
      Creates a new <span class="tag primary outline">api</span>
      instance while using the Base URL and Bearer Token.
    </p>

    <p>
      <button
        @click="xhr()"
        class="button default outline">
        <i class="fas fa-external-link-alt"/>
        XHR
      </button>
      Good ol' XHR in case <span class="tag primary outline">api</span>
      is acting up.
    </p>

    <hr>

    <div class="right">
      <button class="button danger outline small" @click="invalidateToken()">
        <i class="fas fa-bone-break"></i>
        Invalidate
      </button>
      &nbsp;
      <button class="button primary outline small" @click="revalidateToken()">
        <i class="fas fa-shield-check"></i>
        Revalidate
      </button>
      |
      <button
        @click="copy"
        class="button default outline small">
        <i class="fas fa-copy"/>
        Copy
      </button>
    </div>

    <div class="bold">Bearer Token</div>

    <textarea id="accessToken" v-model="accessToken" class="small" readonly></textarea>

    <div>
      Validate Bearer Token with:
      <a
        href="https://jwt.io/"
        target="_blank">
        https://jwt.io/
      </a>
    </div>
    <hr>
    <div>
      <button
        @click="endpointResponse = ''"
        class="button danger outline small right">
        <i class="fas fa-eraser"/>
        Clear
      </button>
      <div class="bold">Response</div>

    </div>
    <!-- Keep pre tags all inline  -->
    <div class="code block"><pre>{{ endpointResponse }}</pre></div>
    <hr>

    <div>
      <span class="bold">Common Endpoints</span>
      &nbsp;
      <span class="italics">Click to swap.</span>
    </div>

    <div
      v-for="(endpoint, index) in common_endpoints"
      :key="`${endpoint}-${index}`">
      <button
        v-if="endpoint.url"
        class="button default link"
        @click="switchEndpoint(endpoint)">
        <span class="method">
          <span class="tag default outline">{{ endpoint.method }}</span>
        </span>
        {{ endpoint.url }}
        <i
          v-if="endpoint.warning"
          class="fas fa-unlink c-danger-500 small"
          title="Possibly deprecated"></i>
      </button>
      <br v-else>
    </div>

    <hr>
    <h2>Environment Variables</h2>

    <table>
      <tr
        v-for="(value, key) in env"
        :key="key">
        <td><span class="bold">{{ key }}</span></td>
        <td>{{ value }}</td>
      </tr>
    </table>

  </div>
</template>

<script lang="ts">
/* tslint:disable:no-console */

import { Component, Watch, Vue } from 'vue-property-decorator';
import http from '@/common/http';
import Auth from '@/common/auth';
// import * as USER from '@/store/modules/USER';

import API from '@/API';


interface Endpoint {
  url: string;
  method: string;
  warning?: boolean;
}

@Component
export default class ApiTester extends Vue {
  private env: { [key: string]: string | undefined } = process.env;
  private accessToken: string | undefined = Auth.getSession().accessToken;
  private endpointResponse: any = '';
  private endpointUrl: string = this.common_endpoints[0].url;
  private method: string = this.common_endpoints[0].method;

  get currentOrg(): string { return API.Organization_v2.getCurrentId(); }

  get common_endpoints(): Endpoint[] {
    return [
      { method: 'GET', url: '/organizations', warning: false },
      { method: 'GET', url: `/pipelines?organization_id=${this.currentOrg}`, warning: false },
      { method: 'GET', url: `/alertdb`, warning: false },
      { method: 'GET', url: `/alertdb/${this.currentOrg}?listname=false`, warning: false },
      { method: 'GET', url: `/alertdb/default?listname=false`, warning: false },
      { method: '', url: '' },
      { method: 'GET', url: 'https://http.dev.cascadeo.io/resources', warning: true },
      { method: 'GET', url: 'https://http.dev.cascadeo.io/resources/6/metrics', warning: true },
      { method: 'GET', url: 'https://http.dev.cascadeo.io/auth', warning: true },
      { method: '', url: '' },
      { method: 'GET', url: 'https://httpstat.us/200', warning: false },
      { method: 'GET', url: 'https://httpstat.us/404', warning: false },
      { method: 'GET', url: 'https://randomuser.me/api/?results=5', warning: false },
      { method: 'GET', url: 'http://www.mocky.io/v2/5a37f974320000fa22eb6b78?mocky-delay=4000ms', warning: false },
    ];
  }

  /**
   * Lifecycle
   */

  private mounted(): void { this.focusUrl(); }

  /**
   * Methods
   */

  private focusUrl(): void { (this.$refs.url as HTMLElement).focus(); }

  private switchEndpoint(endpoint: Endpoint): void {
    this.endpointUrl = endpoint.url;
    this.method = endpoint.method;
    this.focusUrl();
  }

  private copy(): void {
    (document.querySelector('#accessToken') as HTMLInputElement).select();
    document.execCommand('Copy');
    API.UI.addNotification({ type: 'primary', text: 'Copied!' });
  }

  /* Invalidates Bearer Token and triggers a '401' */
  private invalidateToken(): void {
    http.defaults.headers.common.Authorization = `Bearer BROKEN_TOKEN`;
    console.warn('Bearer Token now invalid!');
  }

  /* Revalidates Bearer Token */
  private revalidateToken(): void {
    http.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`;
    console.debug('Bearer Token revalidated.');
  }


  private apiSimple(): void {
    this.endpointResponse = '';
    switch (String(this.method)) {
      case 'GET':
        http.get(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'POST':
        http.post(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'PUT':
        http.put(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'PATCH':
        http.patch(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'DELETE':
        http.delete(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
    }
  }

  private apiDefault(): void {
    this.endpointResponse = '';
    const method = http.create({
      baseURL: this.env.VUE_APP_API_BASE_V1,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    switch (String(this.method)) {
      case 'GET':
        method.get(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'POST':
        method.post(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'PUT':
        method.put(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'PATCH':
        method.patch(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
      case 'DELETE':
        method.delete(this.endpointUrl)
          .then((response) => { this.log(response); })
          .catch((error) => { this.log(error); });
        break;
    }
  }

  private xhr(): void {
    this.endpointResponse = '';
    const method = new XMLHttpRequest();
    method.onreadystatechange = () => {
      if (method.readyState === 4) {
        console.log(method.responseText);
        this.endpointResponse = method.responseText;
      }
    };

    method.open(this.method, `${this.endpointUrl}`, true);
    method.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
    method.send();
  }

  private log(resposne: any): void {
    console.log(resposne);
    this.endpointResponse = resposne;
  }

}

</script>

<style lang="scss" scoped>
.url {
  display: flex;

  select {
    flex: 0 1 15rem;
  }
}

.method {
  min-width: 6rem;
  display: inline-block;
}
</style>
