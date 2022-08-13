<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Side Bar -->
      <div class="clg4 cmd5 csm6 cxs12 sidebar">
        <!-- Instruction -->
        <div>
          <transition :duration="750" name="fade" mode="out-in">
            <!-- Email -->
            <div v-if="step === 0" key="stepEmailText">
              <div v-if="!showEmail">
                <h1>Add Password</h1>
                Hey
                <span class="bold">{{ customer.email }}</span
                >! <br /><br />
                Just add a password to get started, or change your email
                <button
                  class="button default link showEmail"
                  @click="clearEmail()"
                >
                  here.
                </button>
              </div>

              <div v-else>
                <h1>New Account</h1>
                <p>
                  What email would you like to use to log into cascadeo.io?
                </p>
              </div>
            </div>

            <!-- Success -->
            <div v-else-if="step === 1" key="stepSuccessText">
              <h1>Success!</h1>
              <p>
                You've successfully created a user. You'll be automatically be
                redirected in
                <span class="underline bold">{{ secondsLeft }} seconds</span>
                or click the log in button below.
              </p>
            </div>
          </transition>
        </div>

        <!-- Forms -->
        <div>
          <transition :duration="1000" name="fade" mode="out-in">
            <!-- Email -->
            <div v-if="step === 0" key="stepEmail">
              <form @submit.prevent>
                <div v-if="showEmail">
                  <label>Email</label>
                  <input
                    v-model.lazy="customer.email"
                    v-validate="'required|email'"
                    name="email"
                    type="email"
                    autocomplete="username"
                    placeholder="jane@email.com"
                  />

                  <banner type="danger" v-if="errors.has('email')">
                    {{ errors.first('email') }}
                  </banner>

                  <br />
                </div>

                <label>Password</label>
                <input
                  v-model.lazy="customer.password"
                  v-validate="'required|min:8'"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  placeholder="*****************"
                />

                <p class="italics small">
                  Password must be at least 8 characters long, contain a number
                  (0-9), lowercase (a-z), uppercase (A-Z), and special character
                  (!@#$%^&*).
                </p>

                <banner type="danger" v-if="errors.has('password')">
                  {{ errors.first('password') }}
                </banner>

                <banner type="danger" v-if="error.length > 1">
                  {{ error }}
                </banner>

                <div v-if="errorLogin" class="text-center">
                  <a :href="loginURL" class="button">Log In Here</a>
                </div>

                <!-- Honeypot START (called machine) -->
                <div class="machine">
                  <label>machine</label>
                  <input
                    v-model.lazy="machine"
                    name="machine"
                    type="text"
                    autocomplete="false"
                    tabindex="-1"
                    placeholder="i-1234567890abcdef0"
                  />
                </div>
                <!-- Honeypot END  -->

                <div class="text-center white">
                  <br />
                  By signing up, you agree to our
                  <br />
                  <a :href="`${baseURL}/privacy`" target="_blank"
                    >Privacy Policy</a
                  >
                  and
                  <a :href="`${baseURL}/terms`" target="_blank"
                    >Terms of Service</a
                  >.
                </div>
                <br />
                <button
                  class="button default outline block"
                  type="submit"
                  @click="createUser()"
                >
                  Create
                </button>
              </form>
            </div>

            <div v-else-if="step === 1" key="stepSuccess">
              <br />
              <a
                :href="loginURL"
                class="button default outline block text-center"
              >
                Log In</a
              >
            </div>

            <!-- Error -->
            <div v-else key="error">Error</div>
          </transition>
        </div>

        <!-- Progress -->
        <!-- <div v-if="step < 3" class="progress">
          <span :class="{ active: step >= 0 }">&middot;</span>
          <span :class="{ active: step >= 1 }">&middot;</span>
          <span :class="{ active: step >= 2 }">&middot;</span>
        </div> -->
      </div>

      <!-- Graphics -->
      <div class="clg8 cmd7 csm6 cxs12 hidden-xs">
        <div class="additional">
          <transition :duration="1250" name="fade" mode="out-in">
            <!-- Email -->
            <div v-if="step == 0" key="stepEmailGraphic">
              <graphic text="Secure your account" icon="fas fa-id-badge" />
            </div>
            <!-- Success -->
            <div v-else-if="step == 1" key="stepSuccessGraphic">
              <graphic text="Log into cascadeo.io" icon="fas fa-sign-in-alt" />
            </div>
          </transition>
          <div class="logo">
            <img src="@/assets/logo.svg" alt="Cascadeo logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import http from '@/common/http';
import API from '@/API';
import router from '@/router/router';

import Graphic from './SignUpGraphic.vue';

@Component({
  components: {
    Graphic,
  },
})
export default class SignUp extends Vue {
  /* Variables */
  private code: string = '';
  private step: number = 0;
  private showEmail: boolean = true;

  private customer: NewUser = {
    email: '',
    password: '',
  };
  private machine: string = ''; // honeypot is machine

  private error: string = '';
  private errorLogin: boolean = false;
  private loginURL: string = '/login';
  private countdown: any = null;
  private secondsLeft: number = 10;

  private baseURL = process.env.VUE_APP_LANDING_URL;

  /* Lifecycle */
  private created(): void {
    if ('email' in this.$route.query) {
      let email = this.$route.query.email as string;
      email = email.replace(' ', '+');
      const valid = (): boolean => {
        if (email === '' || !email.includes(`@`)) {
          return false;
        }
        const parts = email.split(`@`);

        if (parts.length < 2 || !parts[parts.length - 1].includes(`.`)) {
          return false;
        }
        return true;
      };
      if (valid()) {
        this.customer.email = email;
        this.showEmail = false;
      }
    } else {
      this.showEmail = true;
    }
    router.replace('/signup');
  }

  private beforeDestroy(): void {
    clearInterval(this.countdown);
  }

  /* Methods */
  private nextStep(): void {
    this.$validator.validate().then((res) => {
      if (res) {
        this.step = this.step + 1;
      }
    });
  }

  private clearEmail(): void {
    this.showEmail = true;
  }

  private createUser(): void {
    /* Checking honey pot */
    if (this.machine) {
      this.setErrorCodes('machine_exists');
    } else {
      try {
        // Validate email and password
        this.$validator.validate().then((res) => {
          if (res) {
            // If a res(ponse), then valid
            // Try to post to
            API.User.createUser(this.customer)
              .then(() => {
                this.step = this.step + 1;
                this.countdown = setInterval(() => {
                  this.secondsLeft = this.secondsLeft - 1;
                  if (this.secondsLeft <= 0) {
                    clearInterval(this.countdown);
                    self.location.replace(this.loginURL);
                  }
                }, 1000);
              })
              .catch((error) => {
                this.setErrorCodes(error.response.data.error.code);
              });
          }
        });
      } catch (error) {
        throw error;
      }
    }
  }

  private setErrorCodes(code: string): void {
    switch (code) {
      case 'user_exists':
        this.error = 'Email already exists. Try logging in.';
        this.errorLogin = true;
        break;
      case 'username_exists':
        this.error = 'Email already exists. Try logging in.';
        this.errorLogin = true;
        break;
      case 'machine_exists':
        /* Honeypot case */
        this.error =
          'Please contact us at support@cascadeo.io as there was an issue signing you up.';
        break;
      case 'invalid_password':
        this.error = 'Invalid password.';
        break;
      case 'password_strength_error':
        this.error = 'Password not strong enough.';
        break;
      case 'password_no_user_info_error':
        this.error = 'Password incorporates user info.';
        break;
      case 'password_dictionary_error':
        this.error = 'Password contains a common word.';
        break;
      default:
        this.error = 'Error creating user.';
    }
  }
}
</script>

<style lang="scss" scoped>
.container-fluid {
  // padding: 0;
  max-width: 200rem;
}

.sidebar {
  display: flex;
  flex-direction: column;

  height: 100vh;
  overflow-y: auto;
  color: var(--c-gray-100);
  background-image: linear-gradient(
      20deg,
      var(--c-primary-800),
      var(--c-primary-500)
    ),
    url('~@/assets/building2_soft.jpg');
  background-size: cover;
  background-position: 50%;
  background-blend-mode: multiply;
  border-right: 0.1rem solid var(--c-primary-800);
  box-shadow: 0.1rem 0 1rem var(--c-gray-400);
  padding: 5rem 3rem;

  & > div:nth-child(1) {
    margin-bottom: auto;
  }

  h1,
  p {
    text-shadow: 0 0.1rem 0 var(--c-gray-900);
  }

  h1 {
    font-size: 4.2rem;
    text-transform: initial;

    &:after {
      display: none;
    }
  }

  a {
    color: var(--c-gray-100);

    &:hover,
    &:focus {
      color: var(--c-gray-900);
    }
  }

  .button.default.showEmail {
    color: var(--c-gray-100);
    padding: 0.5rem;

    &:hover,
    &:focus {
      color: var(--c-gray-900);
    }
  }

  label {
    text-align: initial;
    font-weight: 500;
  }

  .progress {
    height: 0;
    position: relative;
    top: 1.75rem;
    text-align: center;
    font-size: 5rem;
    line-height: 0;

    span {
      display: inline-block;
      width: 3rem;
    }

    .active {
      color: var(--c-primary-500);
      text-shadow: none;
    }
  }
}

.additional {
  height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 1rem 5rem;

  & > div:nth-child(1) {
    margin: auto 0;
  }

  .logo {
    flex: 0 0 6rem;
    text-align: center;
    margin: auto 0 0 0;
    border-top: 0.1rem solid var(--c-primary-500);

    img {
      margin-top: 2rem;
      max-width: 8rem;
      height: auto;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-long) ease;
}

// Honeypot styling
.machine {
  opacity: 0 !important;
  height: 0 !important;
  width: 0 !important;
}
</style>
