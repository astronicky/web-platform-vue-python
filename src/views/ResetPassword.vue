<template>
  <div class="reset">
    <div class="form">
      <img src="@/assets/logo.svg" alt="Cascadeo logo" />
      <form v-on:submit.prevent="onSubmit">
        <div>
          <input
            id="resetEmail"
            name="resetEmail"
            type="text"
            placeholder="Email"
            v-model="resetEmail"
            v-validate="'email'"
            data-vv-as="reset_email"
            style="color: var(--c-gray-900); background-color: #fff"
          />

          <banner
            type="primary"
            icon="fas fa-exclamation-triangle"
            v-if="resetSent"
          >
            Reset password email sent. <br />
          </banner>
          <banner
            type="danger"
            icon="fas fa-exclamation-triangle"
            v-if="errors.items.length > 0"
          >
            Invalid email. Please input a valid email. <br />
          </banner>
        </div>
      </form>

      <div class="right">
        <br />
        <button
          class="button primary block"
          @click="resetPassword()"
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Auth from '@/common/auth';
import router from '@/router/router';
import API from '@/API';

@Component
export default class Login extends Vue {
  private resetEmail: string = '';
  private valid: boolean = false;
  private resetSent: boolean = false;

  /* Lifecycle */
  private created(): void {
    Auth.validSession()
      .then(() => {
        router.replace('/');
      })
      .catch(() => {
        /* No real error */
      });
  }

  /* Methods */

  private resetPassword(): void {
    this.$validator.validateAll().then(async (result) => {
      if (result) {
        await API.User.resetPassword(this.resetEmail);
        this.resetSent = true;
        setTimeout(() => router.replace('/'), 3000);
      }
    });
  }
}
</script>


<style lang="scss" scoped>
// Matches whats on Auth0 Hosted Login

.reset {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  background-image: linear-gradient(
    15deg,
    var(--c-primary-800),
    var(--c-primary-500)
  );
}

.reset .form {
  width: 100%;
  max-width: 32rem;
  padding: 3rem;
  background-color: var(--c-gray-100);
  box-shadow: 0 0.3rem 0.3rem var(--c-primary-700);
}

.reset .button {
  text-transform: uppercase;
  text-align: center;
}

.reset img,
.reset svg {
  display: block;
  width: 20rem;
  height: auto;
  margin: 0 auto 4rem auto;
}

.reset input {
  display: block;
  width: 100%;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  padding: 0.3rem 0.5rem;
}
</style>
