<template>
  <div>
    <h1>cascadeo.io Logs</h1>

    <div class="">
      <button
        type="button"
        class="item block"
        v-for="log in filteredLogs"
        :key="`${log.type}-${log.timestamp}`">
        <div
          class="grid">
          <div class="icon mono" :title="log.type">
            <i :class="icon(log.type)" class="fa-fw"></i>
            <!-- {{ log.type }} -->
          </div>
          <div class="errorcode bold mono">{{ log.code }}</div>
          <div class="mono ellipsis">{{ log.short_description }}</div>
          <div class="timestamp">{{ formatTime(log.timestamp) }}</div>
        </div>
      </button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { format } from 'date-fns';

// interface Incident {
//   data: Array<SysM<Alert>>;
//   event_state: 'new' | 'working' | 'closed';
// }

// type SysM<Alert> = Alert & {
//   timestamp: number;
//   type: string;
//   code: string;
//   short_description: string;
//   long_description: string;
//   cascadeo_description: string;
//   metadata: Alert;
// }

// type Alert = Log | Kapacitor | Endpoint;

// interface Log {}
// interface Kapacitor {}
// interface Endpoint {}

@Component
export default class Logs extends Vue {
  /* Variables */

  private incidents: any[] = [
    {
      data: [
        {
          timestamp: 1558576450039,
          type: 'error',
          code: 'CMI182',
          short_description: 'CMI failed to deploy',
          long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
          cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
          metadata: {},
        },
      ],
      event_state: 'new',
    },
  ];

  private logs: SysMessage[] = [
    {
      timestamp: 1558576450039,
      type: 'error',
      code: 'CMI182',
      short_description: 'CMI failed to deploy',
      long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
      cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
      metadata: {},
    },
    {
      timestamp: 1559556450039,
      type: 'log',
      code: 'L232-E',
      short_description: 'Nightly log dump failed to save to s3 in time.',
      long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
      cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
      metadata: {},
    },
    {
      timestamp: 1559586450039,
      type: 'status',
      code: '837221',
      short_description: 'CMI failed to deploy',
      long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
      cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
      metadata: {},
    },
    {
      timestamp: 1550576450039,
      type: 'kapacitor_alert',
      code: 'K98234',
      short_description: 'CMI failed to deploy',
      long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
      cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
      metadata: {},
    },
    {
      timestamp: 1552576450039,
      type: 'endpoint_alert',
      code: '987123',
      short_description: 'https://app.cb.com/create returned 404',
      long_description: 'CMI failed to deploy due to lack of sufficient rights in GCP.',
      cascadeo_description: 'Lack of sufficient rights in GCP is caused by customer not paying their bill.',
      metadata: {},
    },
  ];

  /* Lifecycle */
  // private created(): void {}

  /* Methods */
  private formatTime(ts: number): string {
    // Dec 13 2014 21:34UTC
    return `${format(ts, 'MMM DD YYYY HH:MM')} UTC`;
  }

  private icon(type: string) {
    switch (type) {
      case 'error':
        return 'fas fa-exclamation-triangle';
        break;
      case 'log':
        return 'fas fa-align-left';
        break;
      case 'status':
        return 'fas fa-exchange-alt fa-rotate-90';
        break;
      case 'kapacitor_alert':
        return 'fas fa-bell';
        break;
      case 'endpoint_alert':
        return 'fas fa-bullseye';
        break;
      default:
        return 'fas fa-exclamation';
    }
  }

  get filteredLogs(): SysMessage[] {
    const logs = this.logs;
    logs.sort((log1: SysMessage, log2: SysMessage) => {
      return log2.timestamp - log1.timestamp;
    });
    return logs;
  }
}

</script>

<style lang="scss" scoped>

button {
  background: none;
  text-align: initial;

  padding: .5rem;
}

.grid {
  grid-template-columns: 3rem 6rem auto 16rem;
  grid-template-rows: auto;

  .fas {
    font-size: 1rem;
  }

  .timestamp {
    text-align: right;
    font-family: monospace;
    font-style: italic;
  }
}

</style>
