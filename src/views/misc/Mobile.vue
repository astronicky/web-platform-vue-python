<template>
  <div class="mobile"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Mobile extends Vue {
  /* Variables */

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>

<style scoped>
.mobile:before {
  content: "XS";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 1rem;
  font-size: 1rem;
  line-height: 1;
  font-weight: 700;
  color: white;
  text-align: center;
  background: hsla(0, 60%, 50%, 1);
  z-index: 1;
}

@media (min-width: 576px) {
  .mobile:before {
    content: "SM";
    background: hsla(40, 80%, 50%, 1);
  }
}

@media (min-width: 768px) {
  .mobile:before {
    content: "MD";
    background: hsla(70, 80%, 50%, 1);
  }
}

@media (min-width: 992px) {
  .mobile:before {
    content: "LG";
    background: hsla(120, 70%, 40%, 1);
  }
}

@media (min-width: 1200px) {
  .mobile:before {
    content: "XL";
    background: hsla(220, 70%, 40%, 1);
  }
}
</style>
