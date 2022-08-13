<template>
  <div class="login">
    <div class="row" style="align-items: center">
      <div class="clg5 logoContainer">
        <img class="logo" src="@/assets/cascadeo_logo_white-1.png" alt="Cascadeo logo" />
        <h4>Next Gen Hybrid-Cloud Management Platform with data-analytics at its core</h4>
        <p>Get comprehensive,  AI/ML-powered analytics and timely, actionable insights delivered via targeted notifications</p>
        <button data-testid="login" class="button primary block" @click="login">
          Log In
        </button>
        <br />
        <button data-testid="login" class="button outline block" @click="signup">
          Sign Up
        </button>
        <!-- <br />
        <p align="center"><i>Having trouble signing in? <br> <a href="mailto:support@cascadeo.com">Contact Us</a></i></p> -->
      </div>
      <div class="clg7 bannerContainer">
        <img class="banner img-fluid" src="@/assets/LandingPage-cascadeoio.png" alt="Cascadeo Landing Image">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Auth from '@/common/auth';
import router from '@/router/router';
import Iam from '@/common/iam';

@Component
export default class Login extends Vue {
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

  private login(): void {
    try {
      const user = Iam.currentUser();
      window.location.href = '/integrations';
    } catch {
      window.location.href = '/v2';
    }
  }

  private signup(): void {
    const url = 'VUE_APP_HOSTED_UI_DOMAIN';
    const client_id = 'VUE_APP_USER_POOL_CLIENT_ID';
    const redirect_uri = 'VUE_APP_COGNITO_REDIRECT_URI';
    window.location.href = 'https://' + process.env[url] + '/signup?response_type=code&client_id=' + process.env[client_id] + '&redirect_uri=' + process.env[redirect_uri];
  }
}
</script>


<style lang="scss" scoped>
// Matches whats on Auth0 Hosted Login

.login {
  display: flex;
  align-items: center;
  height: 100vh;
  color: #FFFFFF;
  padding-left:20rem;
  padding-right:20rem;

  background-image: linear-gradient(
    15deg,
    var(--c-primary-800),
    var(--c-primary-500)
  );
}

.login .button {
  text-transform: uppercase;
  text-align: center;
  border: solid 1px rgb(43, 42, 42) !important;
}

// .forgot {
//   padding-left: 50px;
//   text-decoration: none;
//   color: var(--c-primary-900);
// }

a:hover,
a:focus {
  color: none;
  background: none;
}

.logoContainer {
  // padding: 15rem 5rem 15rem 10rem !important;
  padding: 0 40px 0 0;
}
.logo {
  display: block;
  width: 20rem;
  height: auto;
  margin: 0 auto 4rem auto;
}

.bannerContainer {
  display: flex;
  align-items: left !important;
  padding: 10rem 0rem 10rem 0rem !important;
} 
.banner {
  display: block;
  width: 70rem;
  height: auto;
  margin: auto;
  max-width: 100%;
}

/* Extra small devices (phones, less than 768px) */
/* No media query since this is the default in Bootstrap */
@media (max-height: 420px) {
  .login {
    height: auto !important;
  }
  .bannerContainer {
    display: none;
  }
  .banner {
    display: none;
  }
  .logoContainer {
    padding: 0px !important;
  }
}

@media (max-width: 450px) {
  .login {
    padding: 2rem !important;
  }
  .bannerContainer {
    display: none;
  }
  .banner {
    display: none;
  }
  .logoContainer {
    padding: 0px !important;
  }
}

@media (max-width: 680px) {
  .login {
    padding-left:10rem;
    padding-right:10rem;
  }
  .bannerContainer {
    display: none;
  }
  .banner {
    display: none;
  }
  .logoContainer {
    padding: 0px !important;
  }
}

/* Small devices (tablets, 768px and up) */
@media (max-width: 768px) {
  .bannerContainer {
    padding: 0px !important;
  }
  .banner {
    display: none;
  }
  .logoContainer {
    padding: 0px !important;
  }
}

/* Medium devices (desktops, 992px and up) */
@media (max-width: 992px) {
  .bannerContainer {
    padding: 0px !important;
  }
  .banner {
    display: none;
  }
  .logoContainer {
    padding: 5rem !important;
  }
}

/* Large devices (large desktops, 1200px and up) */
@media (min-width: 1700px) {
  .bannerContainer {
    padding: 20rem 0rem 20rem 0rem !important;
  }
  .logoContainer {
    padding: 0rem 5rem 0rem 20rem !important;
  }
}

</style>
