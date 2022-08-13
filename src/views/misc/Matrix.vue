<template lang="html">
  <div class="matrix">
    <table>
      <thead>
          <tr>
              <th v-for="column in columns">
                <button @click="sortBy(column)" class="button default link small">
                  {{column}}
                </button>
              </th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="row in filteredData">
              <td v-for="column in row">{{column}}</td>
          </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Matrix extends Vue {
  /* Variables */

  @Prop()
  private search: string;

  @Prop()
  private data: object[];

  private order: number = 1;
  private sortKey: string = '';
  private columns: string[] = [];

  /* Lifecycle */
  private created(): void {
    this.columns = Object.keys(this.data[0]);
  }

  /* Methods */

  private sortBy(key: any): void {
    this.order = -this.order;
    this.sortKey = key;
  }

  get filteredData(): object {
    const sortKey = this.sortKey;
    const search = this.search.toLowerCase();
    let data = this.data;
    if (search) {
      data = data.filter((row: any) => {
        return Object.keys(row).some((key) => {
          return String(row[key]).toLowerCase().indexOf(search) > -1;
        });
      });
    }
    if (sortKey) {
      data = data.slice().sort((a: any, b: any) => {
        const A: any = a[sortKey];
        const B: any = b[sortKey];
        return (this.order * (((B > A) as any) - ((A > B) as any)));
      });
    }
    return data;
  }

}

</script>

<style lang="scss" scoped>
.matrix {
  overflow-x: scroll;
}

table {
  border: .1rem solid var(--c-primary-900);
  padding: 0;
  margin: 0;
  border-spacing: 0;
  width: 100%;
}

table thead {
  padding: 0;
  margin: 0;
}


table th {
  padding: 0;
  margin: 0;
  text-align: left;
  border-bottom: .1rem solid var(--c-primary-900);
}

table th .button {
  font-weight: bold;
  text-transform: capitalize;
  text-align: left;
  padding: auto 0;
  width: 100%;
}

table tr td {
  padding: 0 .25rem;
  border-bottom: .1rem solid var(--c-primary-400);
}
table tr:last-of-type td {
  border-bottom: none;
}

table tbody tr:hover {
  outline: .2rem solid var(--c-primary-900);
}

table tbody tr:nth-of-type(2n-1) {
  background-color: var(--c-primary-200);
}

</style>
