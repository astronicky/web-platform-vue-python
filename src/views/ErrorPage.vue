<template>
  <div class="error">
    <svg xmlns="http://www.w3.org/2000/svg" width="452" height="316" viewBox="126 201 452 316"><path d="M506 338c3-8 5-16 5-24 0-37-30-68-68-68 -14 0-27 4-38 11C385 224 349 201 307 201c-62 0-113 51-113 113 0 2 0 4 0 6C154 333 126 371 126 416c0 56 46 102 102 102H488c50 0 90-40 90-90C578 383 547 347 506 338zM348 478c-14 0-26-12-26-26 0-14 12-26 26-26 14 0 26 12 26 26C375 466 363 478 348 478zM371 403v2c0 5-4 9-9 9h-27c-5 0-9-4-9-9v-4c0-23 18-33 31-40 11-6 19-11 19-19 0-11-14-19-26-19 -15 0-22 7-31 19 -3 4-9 5-13 2l-16-12c-4-3-5-8-2-12 15-22 35-34 65-34 32 0 66 25 66 58C419 386 371 387 371 403z"/></svg>

    <div>
      <h1>
        Server Hiccup
      </h1>
      <p>
        We accidently cross the streams and ended up here.
        The error is already recorded and we'll be looking into it soon.
        <br><br>
        Let's try this again.
        <br><br>
        <a :href="url" class="button default outline">Go back home</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.error {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.error svg {
  fill: var(--c-gray-200);
  max-width: 30rem;
  margin-right: 5rem;
}

.error div {
  max-width: 45rem;
}

@media (max-width: 450px) {
  .error {
    flex-direction: column;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Error extends Vue {
  /* Variables */
  private url: string = process.env.VUE_APP_REDIRECT_URI || '';

  /* Lifecycle */
  // private created(): void {}

  /* Methods */

}

</script>
