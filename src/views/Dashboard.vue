<template>
  <div class="dashboard">
    <div class="container">

      <h1>
        Dashboard
      </h1>

      <div>
        {{ email }}
        <br>
        {{ currentOrg }}
      </div>

    </div>

    <br><br><br>

  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { format } from 'date-fns';

@Component
export default class Dashboard extends Vue {
  /* Variables */
  private platforms: object[] = [
    {
      id: 2,
      name: 'Nimbus Platform - PROD',
      environments: [
        {
          service: 'Amazon Web Services',
          image: 'aws.png',
          accountName: 'Nimbus',
          accountNumber: '2273-8868-4394',
          login: 'uma@nimbus.io',
          link: 'https://console.aws.amazon.com/',
        },
        {
          service: 'Amazon Web Services',
          image: 'aws.png',
          accountName: 'Nimbus Dev',
          accountNumber: '9343-1122-8801',
          login: 'dev@nimbus.io',
          link: 'https://console.aws.amazon.com/',
        },
      ],
      monitoring: [
        {
          service: 'Cascadeo - Monitoring',
          image: 'cascadeo.png',
          accountName: 'Nimbus',
          accountNumber: '',
          login: 'uma@nimbus.io',
          link: '',
        },
      ],
      tickets: [
        {
          service: 'Cascadeo - Ticketing',
          image: 'cascadeo.png',
          accountName: 'Nimbus',
          accountNumber: '',
          login: 'uma@nimbus.io',
          link: '',
          added: 'Tue Jan 01 2018 14:41:15 GMT-0800 (Pacific Standard Time)',
        },
      ],
      notifications: [],
    },
  ];
  private ticketsActive: string = '';
  private monitoringActive: string = '';

  /* Lifecycle */
  private created(): void {
    this.ticketsActive = localStorage.tickets;
    this.monitoringActive = localStorage.metrics;
  }

  /* Methods */
  private uniqueResource(index: number, salt: string): string {
    return `${salt}_${index}`;
  }
  private dateFormat(updated: Date): string {
    return format(updated, 'MMM D, YYYY');
  }
}
</script>

<style lang="scss" scoped>
// .dashboard {}

.fourStep .title {
  font-size: 2rem;
  font-weight: 700;
  border-bottom: 0.1rem solid var(--c-gray-500);
  margin-bottom: 1rem;
}

.fourStep .serviceCard {
  margin-bottom: 2rem;
}

.fourStep .serviceCard img {
  width: 75%;
  max-width: 15rem;
  margin: 0 auto;
}

.fourSteps .service {
  width: 100%;
}
</style>

