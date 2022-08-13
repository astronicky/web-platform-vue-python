# Cascadeo web-platform

> Written in Vue.js, TypeScript, secured with Auth0, deployed via GitLab.

## Quickstart

```bash
git clone git@gitlab.com:cascadeo/web-platform.git
npm i
npm run serve
```


## Table of Contents

- [Cascadeo web-platform](#Cascadeo-web-platform)
  - [Quickstart](#Quickstart)
  - [Table of Contents](#Table-of-Contents)
  - [Setup](#Setup)
    - [Download](#Download)
    - [Install](#Install)
    - [Local Development](#Local-Development)
  - [Building and Hosting](#Building-and-Hosting)
  - [Environments](#Environments)
    - [Using Environment Variables](#Using-Environment-Variables)
    - [Adding a New Environment - Pipeline](#Adding-a-New-Environment---Pipeline)
  - [Auth0 and Security](#Auth0-and-Security)
  - [How to link GitLab and AWS CI/CD](#How-to-link-GitLab-and-AWS-CICD)
  - [App API and Vue Store](#App-API-and-Vue-Store)
  - [Vue Components](#Vue-Components)
  - [Routes](#Routes)
  - [UI Kit](#UI-Kit)
    - [Modes](#Modes)
    - [Colors](#Colors)
  - [Form Validation](#Form-Validation)
    - [Custom Validators](#Custom-Validators)
    - [Single and Multi Step Forms](#Single-and-Multi-Step-Forms)
  - [Integrations](#Integrations)
    - [Adding a new Integration](#Adding-a-new-Integration)
      - [Show in the https://cascadeo.io/integrations list:](#Show-in-the-httpscascadeoiointegrations-list)
      - [Create Service Image](#Create-Service-Image)
      - [Add Vue Component](#Add-Vue-Component)
      - [Add Endpoints](#Add-Endpoints)
      - [Add TypeScript type](#Add-TypeScript-type)
    - [AWS](#AWS)
    - [Slack](#Slack)
    - [GCP](#GCP)
    - [The Cascadeo Monitoring Instance (CMI)](#The-Cascadeo-Monitoring-Instance-CMI)
  - [Helpful Links](#Helpful-Links)
    - [Vue.js](#Vuejs)
    - [Jest](#Jest)
    - [VSCode](#VSCode)
    - [Windows](#Windows)
  - [Tips n' Gotchas](#Tips-n-Gotchas)
  - [If All Else Fails...](#If-All-Else-Fails)


## Setup

A serverless front-end for Cascadeo's web platform. Designed to be hosted statically on something like AWS S3.
Before you start, you will need `git` and Node.js (which comes with `npm`). Use the more recent version you can (*v10.1.0 as of 2018-05-22*).

### Download

```bash
# clone repository
git clone git@gitlab.com:cascadeo/web-platform.git
```

You will need authorization via GitLab as this project is private.

### Install

CD into root folder, which defaults to `/web-platform`.

```bash
# install node modules
npm install
```

### Local Development

Start your local development server, which comes with Hot-Module Reload by default.

```bash
# serve with hot reload at localhost:9000
npm run serve
```


## Building and Hosting

**web-platform** should be hosted serverlessly on something like a S3 hosted bucket. GitLab is currently handling the CI/CD pipeline through a root-level `.gitlab-ci.yml` config.

> https://gitlab.com/cascadeo/web-platform/environments

If you need to manually create a build:

```bash
# build for production with minification
npm run build
```

Production files will be located in:

```bash
/dist
```

After merging branches to `master`, you can watch the status of the deployment on _GitLab > {project} > CI/CD > Pipelines_. For `prod` and `demo`, you will need to manually approve the deployment of code in the _Stages_ column, and then clicking **deploy_master_demo** for updating `demo` or **deploy_prod** for updating `prod`.

**IF GITLAB CI/CD GOES DOWN**, you will need to locally run the build command (`npm run build` for `prod`) and manually copy over build artifacts from the `/dist` folder to the S3 bucket. You can create a _Cache Invalidation_ in AWS to speed up the process of cache busting.



## Environments

There are 3 main webpack build environments, and 4 application environments. The corresponding configs are in files called `.env.${app_env}` and the application environment name.

Branch structure follows, where `${feature}` is the name of your choosing:

> {feature} > staging > master

| App. Env.   | Webpack Env. | Branch      | Run Command             | Url                        |
| ----------- | -----------  | ----------- | ----------------------- | -------------------------- |
| local       | development  | ${feature}  | `npm run serve`         | localhost:9000             |
| †test       | test         | -           | `npm run test`          | -                          |
| staging     | production   | staging     | `npm run build-staging` | client.staging.cascadeo.io |
| demo        | production   | master      | `npm run build-demo`    | client.demo.cascadeo.io    |
| production  | production   | master      | `npm run build`         | client.prod.cascadeo.io    |

†Note: `test` has (ironically) not yet been tested for these values.

Under rare circumstances, you may need to test a `production` build locally (usually concerning webpack settings). You can quickly run a local instance of the production build by using one of the following simple http servers:

```bash
npm run build
cd /dist

# python2
python -m SimpleHTTPServer 9000

# python3
python -m http.server 9000

# serve (npm)
serve -p 9000
```

Note: You will likely not be able to log in to the application locally due to `production` flags security endpoints being set on build and lacking the necessary URL whitelisting on _Auth0/Applications/web-uba_ and _Auth0/Settings/Advanced_.

---

Think about our environments in terms of *"What shares resources and features"*. The web client has a set of tools in the development build that are unique to `local` (such as Hot Module Reload and live debugging), while `staging` / `production` / `demo` share a common set of Front End features (like bundling and minification).

Likewise, `local` and `staging` share the same *Data* and *Auth* layer to aid in the development of the Platform, while `production` and `demo` each have their own separate datasets and security.

```
     Client  |  =====    ================================
Environment  |  local    staging     demo      production
  Data/Auth  |  ================     ====      ==========
```

Note: The Platform calls it's development environment on a laptop or VM `local` but webpack/Vue can still refer to that environment as `development`.

### Using Environment Variables

The client uses a different `.env` file for each environment, located in project root:

* .env.local
* .env.staging
* .env.demo
* .env.production

Each file contains the exact same _keys_, but different values used around the client. **npm** will run a specific command related to the build environment and will use correct .env file via the `--mode` flag. You can see this in `package.json`:

```json
"serve": "vue-cli-service serve --mode local",
"build-staging": "vue-cli-service build --mode staging --target app",
"build-demo": "vue-cli-service build --mode demo --target app",
"build": "vue-cli-service build",
```

Webpack will actually do a simple "find-and-replace" on the string `process.env.${key}` in the entire project very early in the build process. Non-webpack variables _**must**_ be prefixed with `VUE_APP_`. An example of a variable and its use:

```
// .env.local
VUE_APP_API_BASE_V1=https://platform.staging.cascadeo.io
```

```ts
const apiURL: string = process.env.VUE_APP_API_BASE_V1;
```


### Adding a New Environment - Pipeline
1. Follow the steps inside of the [svc-platform README](https://gitlab.com/cascadeo/svc-platform).
2. In the `package.json` add the following to the scripts section where `${app_env}` is the application environment:

```json
"scripts": {
  "build-${app_env}": "vue-cli-service build --mode {$app_env} --target app",
}
```
3. Update the `.gitlab-ci.yml` with the build and deploy process for the new pipeline by copying from *Staging* and update the different fields that are stage specific. ***Please do not forget the 'only' param and the s3 bucket that it is pointed to.*** The s3 bucket is referenced by a parameter at the top of the file.
4. Copy the `.env.staging` file and update with the values that you got from Auth0 in Step 1.
5. Log into gitlab and update.
6. Create the s3 bucket before pushing code to the new branch.

## Auth0 and Security

There are three entry points into the Platform:

* `/login`
* `/auth`
* `/`

All points will check the validity of the client session by calling `Auth.validSession()`. If the session is not valid (which means the bearer token is "stale"), user will be routed to Auth0 hosted login page to log in. On successful validation, Auth0 will redirect to the callback URL `/auth`, which will parse and save token data in _localStorage_.

If a user requests a path but is not yet logged in, their route request is saved in _localStorage_ before being redirected to Auth0. On the callback, their previous route request is checked and routed (if it exists and is not stale). This happens on a `Auth.validSession()` failure and on `/auth` callback, respectively.

Any **https** call will also check to see if the _Bearer Token_ is expired before making an API call. If it is expired, a `checkSession()` call is made to Auth0 to fetch a fresh token, then the API call is finally made. Each API call bundles the latest token in its _Header_ just before the call is made. You can find this in `https.ts`.

Calls to the root (`/`) also check session validity before setting up the app and routing. A bad or expired `accessToken` will fail API calls on return with a status code `401`.

Each environment has a unique set of auth build variables that need to match what is in Auth0.com. See: [#Environments](#environments) for more information about builds and [svc-platform README](https://gitlab.com/cascadeo/svc-platform) for more details on setting up a Auth0 tenant.

You may need to create a user in Auth0.com manually to be able to log into a specific environment, though errors are likely because no data will be linked to the Platform yet.


## How to link GitLab and AWS CI/CD

**NOTE: This may be out of date!**

- Log into GitLab and navigate to the project
- Click **Settings** > **CI / CD** > **Environment variables**
- You'll need a set of keys to:
  - Deploy to S3 in specific AWS environment
  - Create a CloudFront cache invalidation in root Platform AWS

`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` will match whats in `.gitlab-ci.yml` and will come from a **user** in AWS IAM with the following policy attached (called `gitlab-access-policy`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:ListBucket",
        "s3:DeleteObject",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

In `.gitlab-ci.yml` you will also need to add which `${CLOUDFRONT_ID}` you want to create a cache invalidation for.

```yml
- aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths '/*'
```

After committing and pushing code, if you want to see updates live in production, you will need to manually click the skipped job and press the "play" button in the **CI / CD** > **Pipelines** portion of GitLab. This is a feature to prevent accidental code releases.



## App API and Vue Store

The internal app is organized in two parts: a central API and a Vue Store.

**API** is found at the project root. It is a central place to make internal or external http calls,
handle errors, and manage logic. Import into any `.ts` or `.vue` file using:

```ts
import API from '@/API';
```

Autocompletion should work out of the box. If you have VS Code snippets working as well, you can also type `vapi` and get a single import. The **API** is namespaced and tries to map closely to the back end API. Here is a simple **async** call to `API.Pipeline.get()`:

```ts
async get(): Promise<Pipeline[]> {
  const organizationId = API.Organization.getCurrentId();
  try {
    const response = await http.get(`pipelines`, {
      params: {
        organization_id: organizationId,
      },
    });
    return response.data;
  } catch (error) {
    API.UI.addNotification({
      type: 'danger',
      text: 'Error retrieving pipelines.',
    });
  }
  return [];
}
```

All API calls are UI-blocking after a few seconds using a loading spinner, by default. You can find this in `https.ts` file where all calls are intercepted. If you want to suppress the loading spinner, like when polling for statuses, you can do so by passing the `params: { async: true}` in the _config_ of an **http** call (the `param.async` key:value will be stripped in the interceptor before the outbound call is made).

```ts
async status(integration: Integration): Promise<string> {
  const organizationId = API.Organization.getCurrentId();
  try {
    const response =  await http.post('checker/aws', {
      OrgID: organizationId,
      IntegrationID: integration.id,
      AccountNum: integration.metadata.service_id,
      Region: integration.metadata.region,
    }, {
      params: {
        async: true,
      },
    });
    return response.data.Instance.status;
  } catch (error) {
    throw error;
  }
}
```

The Vue Store we are using is Vuex. It handles managing local app state for things like the currently selected organization or UI notifications. This is not for data that needs to persist across sessions (use the back end) or refreshes (localStorage is a better idea). You will need to import the `store` before being able to use it and pass it as a required parameter when in a `.ts` file.

```ts
import store from '@/store/store';
import * as STORE_UI from '@/store/modules/STORE_UI';

STORE_UI.showSpin(store);
```


Things to keep in mind:

* `getters` are cached and Vue will attempt to access them on app initialization (for pre-caching). If you are wondering why a certain `getter` is being called (and failing) even when app code is not using it, this is why. Generally initializing with an empty value fixes the issue.
* Vue computed properties cannot use `async` or returned Promises. Return directly from the store.
* Vuex + our implementation of TypeScript cannot use nested namespaces out of the box.


Lastly, our Store takes advantage of TypeScript by way of https://github.com/istrib/vuex-typescript. Each `action/getter/mutation` needs to wrap handlers into accessors, which changes how we call each function from within the app (common online Vuex examples will look different).


## Vue Components

Our Vue Components are much more robust than the defaults and are set up a bit different. We support `scss`, `typescript`, and Class Decorators in Single-File Components. To make creating new `.vue` files as easy as possible, we recommend installing a few custom snippets in your code editor which are located in the project root:

> vue_settings.code-snippets

By typing `vclass` and hitting return, you'll has a full Vue Component already scaffolded for you.

```html
<template>
  <div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  /* Variables */

  /* Lifecycle */
  private created(): void {}

  /* Methods */
}
</script>

<style lang="scss" scoped>
</style>
```

Here are all snippets that you can use:

|               |                                                                         |
| ------------- | ----------------------------------------------------------------------- |
| `vapi`        | A quick import to access all internal app **API**.                      |
| `vclass`      | A simple, most commonly used Vue component.                             |
| `vclassfull`  | All currently supported options in a Vue component. Great for learning. |
| `vstore`      | All Store imports for use in the **API**.                               |


More information on installing and using snippets is at https://code.visualstudio.com/docs/editor/userdefinedsnippets



## Routes

Adding a new page and route happens in three places (using **Page** as a placeholder name):

* `views/main/{Page_Name}.vue`
* `router/router.ts`
* `views/Sidebar.vue`

If there are many, nested pages in a route, then you will need to add a directory in `views/main/{Page_Name}/`, along with at least two Vue files; an `PageIndex.vue` and `Page.vue` file. The **Page** file holds the visual transitions. Additional `.vue` files can be added in the directory, such as `PageAdd.vue` and `PageEdit.vue`.

If it is just a single view route, then you can add just a single line to the `router.js`, where **path** is the URL path you want and **component** is the Vue component (without `.vue` extension):

```json
{ path: 'page', component: Page },
```

If you do not want the route to be accessible on production, then be sure to add the route guard:

```
beforeEnter: Utils.EnvProd
```

If the route is nested, then you will need to import the `RouteConfig` fragment, which will be in the form (for example):

```ts
import { RouteConfig } from 'vue-router';

import Pages from '@/views/main/Pages/Pages.vue';
import PagesIndex from '@/views/main/Pages/PagesIndex.vue';
import PageEdit from '@/views/main/Pages/PageEdit.vue';

const Pages: RouteConfig = {
  path: 'pages',
  component: Pages,
  children: [
    { path: '/', component: PagesIndex },
    { path: 'edit/:id', component: PageEdit, props: true },
  ],
};

export default Pages;
```

Finally you need to add the link to the `Sidebar.vue`:

```json
{ title: 'Pages',   link: '/pages',   icon: 'fas fa-bomb',   prod: true },
```

`prod: true` toggles if the link is visible in the **Sidebar**, where `beforeEnter: Utils.EnvProd` protects against accidentally navigating directly to the route.


## UI Kit

On **local**, you can go to `/kit` and look at all the UI components there are to use. Copying from `Kit.vue` and then modifying for your needs is highly recommended. For creating and loading new, global UI components, you can import and register them in `components/index.ts`, which is loaded in `main.ts`.

If you just want to experiment, use the `Play.vue` component. 🌈

### Modes

There are two UI modes used by the Platform:

* Dark Mode
* Compact UI _( experimental )_

Specific components and each global stylesheet will contain their own overrides.

### Colors

The Platform uses native CSS variables for colors. Each color has nine different weights, ranging from **100** (lightest) to **900** (darkest). To use a color in SCSS, you can address it by a variable:

```scss
a {
  color: var(--c-primary-600);
}
```

Or you can use the CSS helper classes:

```html
<div class="bg-danger-100">
  <span class="c-danger-800">Send SOS!</span>
</div>
```

**Note:** Color contrast must meet at least AA Guidelines (4.5). You have all the color tools you need to make this happen.

## Form Validation

### Custom Validators

**Vee Validate** is used for form validation. You can read more here: https://baianat.github.io/vee-validate/

You can add a custom validation either in a SFC (if it only used once), or in `validate.ts` (if it is used globally).

Extend the validator in the `created()` lifecycle hook to register it properly.

```ts
@Component
export default class HelloWorld extends Vue {

  /* Lifecycle */
  private created(): void {
    this.$validator.extend('id', {
      getMessage(value: any, field: any) {
        return 'Not a valid organization id.';
      },
      validate(value: any, field: any) {
        /* Rules: A-Za-z, 0-9, single dash, length between 2 and 30 */
        const regex: RegExp = /^[-a-zA-Z0-9]+$/;
        return (regex.test(value) && value.length <= 30 && value.length >= 2);
      },
    });
  }
}
```

In `validate.ts`, it's very similar.


```ts
import VeeValidate from 'vee-validate';

VeeValidate.Validator.extend('hyphen', {
  getMessage(value: any, field: any) {
    return 'ID cannot start or end with hyphens.';
  },
  validate(value: any, field: any) {
    const regex = new RegExp('^\-+|\-+$', 'g');
    return !regex.test(value);
  },
});
```

You attach the custom validator by the identifier (passed to the `extend()` method) like any other validator now, in this case `id` and `hyphen`.

```html
<input
  type="text"
  placeholder="Organization Id"
  name="id"
  maxlength="30"
  v-model="id"
  v-validate="'required|id|hyphen'"
  data-vv-as="'Organization ID'">

<p class="italics">
  Valid organization names include lowercase letters, numbers,
  single hyphens (-), and a character length between 2 and 30 characters.
</p>

<banner
  type="danger"
  icon="fas fa-exclamation-triangle"
  <div>{{ errors.first('id') }}</div>
  v-if="errors.has('id')">
</banner>
```

### Single and Multi Step Forms

For a single form, you will need to override the default submit action and let `vee-validate` take over, but you still use `type="submit"` on the primary button. _Note: All other buttons will need `type="button"` to not accidentally trigger form submission._

```html
<form @submit.prevent>
  <!-- ... inputs ... -->

  <button
    class="button danger"
    type="button"
    @click="clearForm">
    <i class="fas fa-trash-alt"></i>
    Clear Form
  </button>

  <button
    class="button primary outline"
    type="submit"
    @click="save()"
    :disabled="errors.any()">
    <i class="fas fa-save"></i>
    Save
  </button>
</form>
```

Multi step forms in a SFC are a bit more complicated. Commonly with the `<tabs>` component, you might have 2 or more `<form>` elements in a single template. You will need to add a form validation function and assign a **scope** to each form.

```html
<template>

  <tabs :selected="tabIndex">
    <tab>
      <form @submit.prevent="step1('step-1')" data-vv-scope="step-1">
          <!-- ... inputs ... -->
          <button class="button default outline" type="submit">Next</button>
      </form>
    </tab>

    <tab>
      <form @submit.prevent="step2('step-2')" data-vv-scope="step-2">
          <!-- ... inputs ... -->
          <button class="button default outline" type="submit">Next</button>
      </form>
    </tab>
  </tabs>
</template>

```

```ts
@Component
export default class HelloWorld extends Vue {
  /* Variables */
  private tabIndex: number = 0;

  /* Methods */
  private gotoTab(tabNumber: number): void { this.tabIndex = tabNumber; }

  private step1(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }

  private step2(scope: string): void {
    this.$validator.validateAll(scope).then((result) => {
      if (result) {
        this.gotoTab(this.tabIndex + 1);
      }
    });
  }
}
```

Each form validation function can have its own set of custom logic. The example above just checks that each of the form inputs are valid and advances the tab number.

Showing errors on a specific input value uses banners and checking the "error bag" of vee-validate.

```html
<input
  type="text"
  placeholder="Given Name"
  name="givenName"
  v-model="user.given_name"
  v-validate="'required'"
  data-vv-as="'Given Name'">

<banner
  type="danger"
  icon="fas fa-exclamation-triangle"
  v-if="errors.has('step-1.givenName')">
  {{ errors.first('step-1.givenName') }}
</banner>
```

Be aware that you need to add scope to your errors if you are using multi-form validation.


## Integrations

### Adding a new Integration

#### Show in the https://cascadeo.io/integrations list:
- Update DynamoDB table `platform-integrations-definitions-staging` with new definition in all environments.

#### Create Service Image
To reduce resource calls and get the best possible quality images, we use a technique called "Sprite Stacking". This is when all SVGs are compressed into a single `.svg` file and are called using fragments.

- Find the company logo online, often found on the main website.
- Use a program like Illustrator or Inkscape to clean up a logo.
- If there is any text, be sure to "Convert Outlines".
- Save the image on a 100px square canvas.
- Run `svgo` on the image to further clean up and inline styles.
- Cut whats _between_ `<svg>` tags (should contain tags like `<g>`, `path`).
- Open `@/assets/sprites.svg` are create a new entry (please keep it alpha sorted)
- Name a new group like so: `<g class="sprite" id="${definition_id}"></g>` and paste the paths

It should look something like this:
```
  <g class="sprite" id="nimbus">
    <path fill="#FF5000" d="..."/>
    <path fill="#C0FFEE" d="..."/>
  </g>
```

The important point is that the `id` corresponds to the `definition_id` and is used to look up the correct image in the `ServiceImage.vue` component.

Additional Resources:
* https://github.com/svg/svgo
* https://www.sitepoint.com/so-do-we-have-a-winner-for-code-challenge-1/
* http://blogs.sitepointstatic.com/examples/tech/svg-sprites/sprite.html

#### Add Vue Component
- Create a new `@\integrations\${service}.vue` file (for example, copy from `slack.vue` for oauth)
- **NOTE:** Make sure the Vue filename is lowercase and matches the `definition_id` in the definition.
- Rename appropriate variables in Vue file.
- **NOTE:** The Vue component name cannot be the same as the type.

#### Add Endpoints
- Create a new `@\API\Integration\${service}.ts` if you need anything beyond a simple **update**. This is where _all_ API handling goes.
- Import and add new integration to `@\API\Integration\index.ts` (you will also gain Intellisense support).

#### Add TypeScript type
- In `types.js` create a new interface.
- **NOTE:** Add the new type to the `type All`.
- **NOTE:** TypeScript errors _will fail the build_.

### AWS

* Deploying the **CMI** to AWS on `local` or `staging`, you need to have a pem called `telegraf-terraform-test` created in region you are trying to deploy to. It doesn't need to be the exact pem, just there in name.

### Slack

* If there are any oauth scope changes on the Slack App, the url in `slack.vue` must be updated as well.

### GCP

* The statuses are different than AWS, as well as the regions. Watch for this.


### The Cascadeo Monitoring Instance (CMI)

To monitoring cloud environments, like AWS and GCP, we deploy a VM with our set of monitoring tools. This VM is called the **CMI** and the intergration that deploys it is often very different. An integration using a **CMI** to collect data has various states that direct the UI flow for the user:


```
CMI states
---
NO_ACCESS -> CMI_READY -> CMI_STARTING -> CMI_UP -> CMI_STOPPING -> CMI_DOWN -> SERVICE_DOWN -> UNKNOWN
```

Depending on each state, the UI will present certain actions (such as _Tear Down_ or _Redeploy_). Other services have a much simpler model as we are not managing a VM:


```
Service states
---
NO_ACCESS -> SERVICE_UP -> SERVICE_DOWN -> UNKNOWN

```


## Helpful Links

### Vue.js

* https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en
* https://github.com/vuejs/vue-cli/blob/dev/docs/README.md
* https://github.com/vuejs/vue-class-component
* https://github.com/kaorun343/vue-property-decorator
* https://github.com/istrib/vuex-typescript/
* https://alligator.io/vuejs/using-new-vue-cli-3/
* https://gist.github.com/indus/0c1ff6b4f4102a6286a8
* https://johnpapa.net/vue-typescript/

### Jest

* https://facebook.github.io/jest/
* https://alexjoverm.github.io/series/Unit-Testing-Vue-js-Components-with-the-Official-Vue-Testing-Tools-and-Jest/

### VSCode

Practically required for development

* https://code.visualstudio.com
* https://marketplace.visualstudio.com/items?itemName=eg2.tslint
* https://marketplace.visualstudio.com/items?itemName=octref.vetur
* https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
* https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig

Nice-to-haves for VSCode

* https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync
* https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight
* https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer
* https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight
* https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow
* https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one
* https://marketplace.visualstudio.com/items?itemName=RoscoP.ActiveFileInStatusBar

### Windows

* http://cmder.net
* https://github.com/dahlbyk/posh-git
* https://docs.microsoft.com/en-us/windows/wsl/install-win10


## Tips n' Gotchas

Local port has been changed from `8080` to `9000`.

---

`.gitignore` does not ignore .env.local unlike other environments. That is because we currently do not have any "secrets" that cannot be published.

---


`@` is aliased as root for imports. Please use over relative pathing (i.e. `../`). That said, _do_ use `./` for files in the same directory. Also (S)CSS likes to use `~` to tell Webpack "import as a module".

Naturally, there are exceptions to this.

---

All imports and exports now use ES modules syntax:

```js
import Router, { Route, RouterOptions, RouteConfig } from 'vue-router';
```

`.ts` and `.js` files do not need a file extension on imports, but Vue files will need a `.vue` extension.

---

The linter sometimes hangs and often conflict with each other.
* Change a letter in the file for it to trigger hot reload
* Close your editor and reopen
* Rerun `npm run serve`

This is especially true when working with imports/exports and is very annoying. Let's get a beer later and complain about the state of web development in `$CURRENT_YEAR`.

---

Ctrl-Click to link you straight to type definitions. Doh!

---

If you are bored, feeling charitable, or want to impress: _Search in project_ > `TODO:`

Tip: Make sure "Use Exclude Settings and Ignore Files" is toggled on.

---

If you are using **GitLens** and want to compare a working file with a previous commit, here's how:

* Ctrl+Shift+P (Show All Commands)
* GitLens: Show File History
* Select the previous commit
* Open Changes With Working Tree

There is also a handy button that looks like a circle with a left arrow called `Compare File with Previous Revision`.

---

JSDoc is your friend. Document your `.js` and `.ts` liberally.

    /**
     * Ordering a beer.
     *
     * @param tap - The tap number of the beer
     * @return - The name of the beer
     */

    public orderBeer(tap: number): string {
      ...
    }


---

Did you forget `@Component` decorator? Check again. Ya you did.

---

"I see both an `access_id` and `token_id` from Auth0. Which do I use?"

| token | description |
| - | - |
|*id_token* | Holds User info like name, token expiration time, gravitar photo, etc. Basically (important) identity information. |
|*access_token* | Is the token that needs to be passed as a `Bearer Token` with the API. Is actually what is giving authorization. |

You can confirm this by using https://jwt.io/

---

Need to generate a UUID?

```js
import { v4 as uuid } from 'uuid';

console.log(uuid());
```

---

Lazy-load of Vue files:

```js
component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
```

As the project grows, loading Vue components only when routing to them saves on initial page load. Import from `Utils`.
Read more: https://alligator.io/vuejs/lazy-loading-vue-cli-3-webpack/

---

`<status />` is an undocumented component for right now as it's hard to do without real data. You can find examples of it in **Pipelines** and **Integrations**, but how you use it is:

```html
<status :integration="integration" icon text actions />
```

| Attribute       | Required | Function                                                     |
| --------------- | -------- | ------------------------------------------------------------ |
| `:integration`  | _yes_    | Pass a whole integration object that you want the status of. |
| `v-model`       |          | Readonly access to status text.                              |
| `icon`          |          | Toggles showing a reactive icon.                             |
| `text`          |          | Toggles text version of status.                              |
| `actions`       |          | Toggles showing remediation actions on integration.          |
| `poll`          |          | Toggles auto polling the status after some seconds.          |

---

Want to throw an alert on unsaved changes? Register the `beforeRouteLeave` hook before any imports, and create a function that throws an alert. Be sure to still call `next()`, even if the page isn't "dirty" with updates. Below is an example.

```ts
import { Component, Watch, Vue } from 'vue-property-decorator';

Component.registerHooks(['beforeRouteLeave']);

import router from '@/router/router';
import API from '@/API';

@Component
export default class ThresholdsIndex extends Vue {

  // ...

  private beforeRouteLeave(to: any, from: any, next: any) {
    if (this.unsavedChanges) {
      const answer = window.confirm(
        'You have unsaved changes. \n\n Do you still want to leave this page?'
      );
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  }

}

```

---

## If All Else Fails...

* Restart VSCode
* Properly end `serve` process and re- `npm run serve`
* Hard refresh browser and delete cache
* Restart computer
* Ask peer for help (will start working 92.333333% of time)
* Blow away `node_modules` and re- `npm install`
* Check for modules updates (but ask before upgrading)

