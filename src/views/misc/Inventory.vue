<template>
  <div>
    <h1>Inventory Filtering</h1>
    <p>
      Heuristics for rules and moves:
    </p>

    <ul>
      <li>Name</li>
    </ul>

    <button class="button default outline" @click="genInventory()">
      <i class="fas fa-dice"></i>
      Generate Inventory
    </button>
    <hr>

    <div class="row">
      <div class="cxs4">
        <h3>List</h3>
        <draggable
          class="list-group"
          tag="ul"
          v-model="inventory1"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false">
          <li
            class="list-group-item button default outline block"
            v-for="(element, i1) in inventory1"
            :key="`list1-${i1}`">

            <service-image
              :id="element.type"
              :alt="`${element.type} logo`"
              :title="element.type"
              class="image" />

            <span v-if="element.friendly">
              {{ element.friendly }}
            </span>
            <span v-else>
              {{ element.id }}
            </span>
            <br>
            <span v-if="element.resource_type">
              [{{ element.resource_type }}]
            </span>

            <span v-if="element.resource_friendly">
              {{ element.resource_friendly }}
            </span>
            <span v-else>
              {{ element.resource_id }}
            </span>

          </li>
        </draggable>
      </div>

      <div class="cxs4 ">
        <h3>Analyze</h3>
        <draggable
          class="list-group analyze"
          tag="ul"
          v-model="inventory2"
          v-bind="dragOptions"
          @change="log"
          @start="drag = true"
          @end="drag = false">
          <li
            class="list-group-item button success outline block"
            v-for="(element, i2) in inventory2"
            :key="`list2-${i2}`">

            <service-image
              :id="element.type"
              :alt="`${element.type} logo`"
              :title="element.type"
              class="image" />

            <span v-if="element.friendly">
              {{ element.friendly }}
            </span>
            <span v-else>
              {{ element.id }}
            </span>
            <br>
            <span v-if="element.resource_type">
              [{{ element.resource_type }}]
            </span>

            <span v-if="element.resource_friendly">
              {{ element.resource_friendly }}
            </span>
            <span v-else>
              {{ element.resource_id }}
            </span>

          </li>
        </draggable>
      </div>

      <div class="cxs4 ">
        <h3>Ignore</h3>
        <draggable
          class="list-group ignore"
          tag="ul"
          v-model="inventory3"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false">
          <li
            class="list-group-item button danger outline block"
            v-for="(element, i3) in inventory3"
            :key="`list3-${i3}`">

            <service-image
              :id="element.type"
              :alt="`${element.type} logo`"
              :title="element.type"
              class="image" />

            <span v-if="element.friendly">
              {{ element.friendly }}
            </span>
            <span v-else>
              {{ element.id }}
            </span>
            <br>
            <span v-if="element.resource_type">
              [{{ element.resource_type }}]
            </span>

            <span v-if="element.resource_friendly">
              {{ element.resource_friendly }}
            </span>
            <span v-else>
              {{ element.resource_id }}
            </span>

          </li>
        </draggable>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { v4 as uuid } from 'uuid';

@Component({
  components: {
    draggable,
  },
})
export default class Inventory extends Vue {

  /* Variables */
  private inventory1: any = [];
  private inventory2: any = [];
  private inventory3: any = [];

  private drag: boolean = false;

  get dragOptions() {
    return {
      animation: 0,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
    };
  }

  /* Lifecycle */
  // private created(): void {}

  /* Methods */
  private log(evt: any): void {
    window.console.log(evt);
  }

  private genInventory(): void {
    const max = 10;
    const inventory: any = [];
    const iTypes = ['aws', 'gcp'];
    const aws = [
      { id: '8562-5313-7231', friendly: 'nimbus' },
      { id: '9476-5767-3334', friendly: 'nimbus-prod' },
      { id: '8067-4913-6314', friendly: 'nimbusdev' },
      { id: '3837-2734-1027', friendly: '' },
    ];

    const typeGen = () => iTypes[(Math.floor(Math.random() * iTypes.length))];

    for (let i = 0; i < max; i++) {
      const iType = typeGen();
      let iId = '';
      let iFriendly = '';
      let rFriendly = '';
      let rType = '';
      let rId = '';

      if (iType === 'aws') {
        // gen AWS id and friendly
        const randomAWS = aws[(Math.floor(Math.random() * aws.length))];

        iId = randomAWS.id;
        iFriendly = randomAWS.friendly;
        rType = 'ec2';
        rId = `i-${this.genHex(17)}`;
        rFriendly = '';

      } else {
        iId = '19XX';
      }


      inventory.push({
        type: iType,
        id: iId,
        friendly: iFriendly,
        resource_type: rType,
        resource_id: rId,
        resource_friendly: rFriendly,
      });
    }

    inventory.sort((a: any, b: any) => {
      if (a.type < b.type) { return -1; }
      if (a.type > b.type) { return 1; }
      return 0;
    });



    // Add a few endpoint intergations
    inventory.push({
      type: 'endpoint',
      id: uuid(),
      friendly: 'Website-dev',
      resource_type: '',
      resource_id: ``,
      resource_friendly: `${(Math.floor(Math.random() * 30 + 1))} endpoints`,
    });
    inventory.push({
      type: 'endpoint',
      id: uuid(),
      friendly: 'Payment [Production]',
      resource_type: '',
      resource_id: ``,
      resource_friendly: `${(Math.floor(Math.random() * 30 + 1))} endpoints`,
    });


    this.inventory1 = inventory;

  }

  private genHex(size: number): string {
    const alphabet = 'abcdef0123456789';
    let text = '';
    for (let i = 0; i < size; i++) {
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return text;
  }


}

</script>

<style lang="scss" scoped>

.ghost {
  opacity: 0.5;
}

.list-group {
  border: 1px dashed var(--c-gray-400);
  min-height: 20rem;
  height: 100%;

}

.list-group-item.button {
  cursor: move;
  border-bottom: none;
  border-radius: 0;

  .image {
    position: relative;
    top: .5rem;
    margin-left: .25rem;
    width: 2rem;
  }

  &:before {
    content: '';
    float: left;
    border-left: 1px solid var(--c-gray-400);
    border-right: 1px solid var(--c-gray-400);
    width: 0.7rem;
    height: 4rem;
    margin-right: 1rem;
  }

}

.analyze {
  background: var(--c-success-200);
}
.ignore {
  background: var(--c-danger-200);
}
</style>
