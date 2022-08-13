<template>
  <div class="play">
    <!-- Mobile banner bar -->
    <mobile/>
    <h1>Play</h1>

    <h2>Status Icons</h2>
    <p>Pretty Lights</p>

    <span v-for="status in statuses" :key="status.status" class="block">
      <i class="fas" :class="status.icon"></i>
      {{ status.status }}
    </span>




    <!-- <h2>Grafana</h2> -->
      <!-- src="https://snapshot.raintank.io/dashboard/snapshot/XWoTr24kiD6PV6TPxNFn32Htb7RQhKx9?from=1493369923321&to=1493377123321&panelId=4" -->
    <!-- <iframe
      src="https://snapshot.raintank.io/dashboard/snapshot/HEQGc4LkajkYvHMkjjqHgp427ZtOUR8G?from=1493369923321&to=1493377123321&panelId=4"
      width="650"
      height="300"
      style="width: 100%; height: 100vh;"
      frameborder="0"></iframe> -->
    <!--
    <iframe src="https://snapshot.raintank.io/dashboard-solo/snapshot/y7zwi2bZ7FcoTlB93WN7yWO4aMiz3pZb?from=1493369923321&to=1493377123321&panelId=4" width="650" height="300" frameborder="0"></iframe>
    <iframe src="https://snapshot.raintank.io/dashboard-solo/snapshot/fZFhIe5Fq4DSYoHHq0HA2AwBTH2RTKOq?from=1565275893484&to=1565283093484&panelId=5" width="650" height="300" frameborder="0"></iframe> -->

    <!-- <h2>SVG Stacking</h2>
    <p>It's like a dice tower of images.</p>

    <img src="@/assets/sprites.svg#atlassian_trello" alt="">
    <img src="@/assets/sprites.svg#atlassian_jira" alt="">
    <img src="@/assets/sprites.svg#aws_cloudtrail" alt="">

    <img src="@/assets/sprites.svg#circle" alt="">
    <img src="@/assets/sprites.svg#square" alt="">
    <img src="@/assets/sprites.svg#triangle" alt=""> -->

    <!-- Gradient -->
    <h2>Next Gen Gradient</h2>
    <p>I call it... Project Blue</p>

    <div class="gradient1 box"></div>
    <br>
    <div class="gradient2 box"></div>
    <div class="gradient3 box"></div>

    <!-- Focus test -->
    <h2>Focus Test</h2>
    <p>Stare deeply into my.. form fields!</p>

    <input
      type="text"
      :placeholder="`FOCUS ${index}`"
      v-for="(focus, index) in focusList"
      :key="`focus-${index}`"
      :id="`focus-${index}`"
      v-model="focus[index]">

    <button class="button default outline" @click="setFocus(2)">Focus 2</button>
    &nbsp;
    <button class="button default outline" @click="addFocus()">
      <i class="fas fa-plus"></i>
      Add + Focus
    </button>

    <!-- Countdown -->
    <h2>Countdown</h2>
    <p>This is definitely not the final countdown.</p>

    <div>{{ secondsLeft }}</div>
    <button class="button default outline" @click="poll()">
      <i class="fas fa-hourglass-start"></i>
      Start Timer
    </button>

    <!-- Email -->
    <h2>Email</h2>
    <p>it's not old, it's "seasoned".</p>

    <router-link
      class="service button default outline"
      :to="{ path: `/integrations/add/${email.definition_id}`}"
      :disabled="!email.enabled"
    >
      <service-image :id="email.image" class="image" />
      <div>
        <div class="title bold ellipsis" :title="`${email.name}`">{{ email.name }}</div>
        <div class="ellipsis" :title="`${email.description}`">{{ email.description }}</div>
        <div class="text-right" v-if="email.enabled">
          <span class="tag primary outline capitalize">{{ email.tags[0] }}</span>
          <span
            v-if="email.definition_type === 'input'"
            title="Input"
            class="tag default outline"
          >
            <i class="fas fa-arrow-alt-to-right"></i>
            &nbsp;
            Input
          </span>
          <span
            v-if="email.definition_type === 'output'"
            title="Output"
            class="tag default outline"
          >
            <i class="fas fa-external-link-square"></i>
            &nbsp;
            Output
          </span>
        </div>
        <div class="text-right" v-else>
          <span class="tag default">Coming Soon</span>
        </div>
      </div>
    </router-link>


    <!-- Endpoint -->
    <h2>Endpoint</h2>
    <p>It really is just the beginning.</p>

    <router-link
      class="service button default outline"
      :to="{ path: `/integrations/add/${endpoint.definition_id}`}"
      :disabled="!endpoint.enabled"
    >
      <service-image :id="endpoint.image" class="image" />
      <div>
        <div class="title bold ellipsis" :title="`${endpoint.name}`">{{ endpoint.name }}</div>
        <div class="ellipsis" :title="`${endpoint.description}`">{{ endpoint.description }}</div>
        <div class="text-right" v-if="endpoint.enabled">
          <span class="tag primary outline capitalize">{{ endpoint.tags[0] }}</span>
          <span
            v-if="endpoint.definition_type === 'input'"
            title="Input"
            class="tag default outline"
          >
            <i class="fas fa-arrow-alt-to-right"></i>
            &nbsp;
            Input
          </span>
          <span
            v-if="endpoint.definition_type === 'output'"
            title="Output"
            class="tag default outline"
          >
            <i class="fas fa-external-link-square"></i>
            &nbsp;
            Output
          </span>
        </div>
        <div class="text-right" v-else>
          <span class="tag default">Coming Soon</span>
        </div>
      </div>
    </router-link>


    <!-- Upsells -->

    <h2>Upsells</h2>
    <p>The feature you really want</p>

    <h3>Select endpoints to monitor</h3>

    <div class="upsell">
      <div>
        <input id="radio-1" name="radio-upsell" type="radio" value="basic" v-model="upsell" checked>
        <label for="radio-1" class="button default outline">
          <span class="bold">Basic</span>
          &nbsp;&nbsp;
          <span class="italics right">3 Endpoints</span>
        </label>
      </div>
      <div v-if="upsell === 'basic'">
        <div v-for="i in 3" :key="`upsell-${i}`" class="row" >
          <div class="csm3 cxs12">
            <label for="">URL {{ i }}</label>
          </div>
          <div class="csm6 cxs12">
            <input type="text" :id="`upsell-${i}`" placeholder="Endpoint">
          </div>
        </div>
      </div>

      <div>
        <input id="radio-2" name="radio-upsell" type="radio" value="preferred" v-model="upsell">
        <label for="radio-2" class="button primary outline">
          <span class="bold">Preferred</span>
          &nbsp;&nbsp;
          <span class="italics right">10 Endpoints</span>
        </label>
      </div>

      <banner type="primary" icon="fas fa-magic" large v-if="upsell === 'preferred'">
        <p class="big bold">Preferred Updgrade</p>
        <p>
          Upgrading to <span class="bold">Preferred</span> will grant the ability to monitor
          <span class="underline">10 endpoints</span>, as well as the following features:
        </p>
        <ul class="bullet">
          <li>5 minute alerting time</li>
          <li>More alerting piplines</li>
          <li>5 Custom Runbooks</li>
          <li><a href="#">And much more!</a></li>
        </ul>
        <button class="button primary">Upgrade for $2,500 / month</button>
      </banner>


      <div>
        <input id="radio-3" name="radio-upsell" type="radio" value="premium" v-model="upsell">
        <label for="radio-3" class="button primary outline pulse">
          <span class="bold">Premium</span>
          &nbsp;&nbsp;
          <span class="italics right">20 Endpoints</span>
        </label>
      </div>
      <banner type="primary" icon="fas fa-magic" large v-if="upsell === 'premium'">
        <p class="big bold">Premium Updgrade</p>
        <p>
          Upgrading to <span class="bold">Premium</span> will grant the ability to monitor
          <span class="underline">20 endpoints</span>, as well as the following features:
        </p>
        <ul class="bullet">
          <li>1 minute alerting time</li>
          <li>More alerting piplines</li>
          <li>Unlimited Custom Runbooks</li>
          <li><a href="#">And much more!</a></li>
        </ul>
        <button class="button primary">Upgrade for $10,000 / month</button>
      </banner>


    </div>




    <!-- Checklist -->
    <h2>Checklist</h2>
    <p>3-2-1-GO!</p>

    <!-- {{item}} -->
    <div v-for="(item, index) in checklist" :key="`checklist-${index}`" class="checklist flex" :style="checklistStyle(item.status)">
      <div class="status">
        <div v-if="item.status ===  'DONE'" class="strikethrough">
          <i class="fas fa-check-circle"></i>
          Done
        </div>
        <div v-if="item.status ===  'PENDING'" class="c-gray-700">
          <i class="fas fa-genderless"></i>
          Pending
        </div>
        <div v-if="item.status ===  'BLOCKED'" class="c-danger-500">
          <i class="fas fa-exclamation-triangle"></i>
          Blocked
        </div>
        <div v-if="item.status ===  'SKIPPED'" class="c-gray-400">
          <i class="fas fa-level-down"></i>
          Skipped
        </div>
      </div>

      <div class="name">
        {{ item.name }}
      </div>
      <div class="person">
        {{ item.person }}
      </div>
      <div class="notes">
        {{ item.notes }}
      </div>
      <div class="updated italics">
        {{ formatDate(item.updated) }}
      </div>

    </div>


    <!-- Hashids -->
    <h2>Hashids</h2>
    <p>I like mine with eggs and toast</p>

    <pre v-for="id in 10" :key="id">{{ genId(10) }}</pre>


    <!-- Input sizing -->
    <h2>Input Sizing</h2>
    <p>Tiny Tiny</p>

    <div class="">
      <input type="text" value="Button" style="width: 10rem; display: inline">
      <button class="button default outline">Button</button>
    </div>

    <div class="">
      <input type="text" value="Button" class="small"  style="width: 10rem; display: inline">
      <button class="button default outline small">Button</button>
    </div>


    <!-- Modal -->
    <h2>Modal v2</h2>
    <p>This is not an admission of defeat</p>

    <button class="button default outline" @click="showModal = !showModal">
      Toggle Modal
    </button>

    <modal v-model="showModal">
      <h3>Title</h3>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
      <p>Testing this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this outTesting this out</p>
    </modal>


    <!-- Timeline -->
    <h2>Timeline</h2>
    <p>Which timeline are we in?</p>


    <div class="flex">
      <div class="service">
        <div class="timeline">
          <div class="element">
            <div class="image">
              <service-image :id="`aws`" :alt="`aws logo`" title="aws"/>
            </div>
            <div class="info">
              <h3>abattenb</h3>
              <label for="1-2-4" class="italics">Show More</label>
              <input type="checkbox" id="1-2-4">
              <div class="more">
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Location</div>
                  <p class="csm6 cxs12">us-west-2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="arrow">
        <arrow />
      </div>
      <div class="service">
        <div class="timeline">
          <div class="element">
            <div class="image">
              <service-image :id="`thresholds`" :alt="`thresholds logo`" title="thresholds"/>
            </div>
            <div class="info">
              <h3>Settings</h3>
              <label for="1-2-3" class="italics">Show More</label>
              <input type="checkbox" id="1-2-3">
              <div class="more">
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Channel_id</div>
                  <p class="csm6 cxs12">CFA5Z68JC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="arrow">
        <arrow />
      </div>
      <div class="service">
        <div class="timeline">
          <div class="element">
            <div class="image">
              <service-image :id="`slack`" :alt="`slack logo`" title="aws"/>
            </div>
            <div class="info">
              <h3>#general</h3>
              <label for="1-2-5" class="italics">Show More</label>
              <input type="checkbox" id="1-2-5">
              <div class="more">
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">channel</div>
                  <p class="csm6 cxs12">#general</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Channel_id</div>
                  <p class="csm6 cxs12">CFA5Z68JC</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Scope</div>
                  <p class="csm6 cxs12">identify,bot,incoming-webhook,chat:write:bot</p>
                </div>
              </div>
            </div>
          </div>
          <div class="element">
            <div class="image">
              <service-image :id="`slack`" :alt="`slack logo`" title="aws"/>
            </div>
            <div class="info">
              <h3>#general</h3>
              <label for="1-2-6" class="italics">Show More</label>
              <input type="checkbox" id="1-2-6">
              <div class="more">
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">channel</div>
                  <p class="csm6 cxs12">#general</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Channel_id</div>
                  <p class="csm6 cxs12">CFA5Z68JC</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Scope</div>
                  <p class="csm6 cxs12">identify,bot,incoming-webhook,chat:write:bot</p>
                </div>
              </div>
            </div>
          </div>
          <div class="element">
            <div class="image">
              <service-image :id="`slack`" :alt="`slack logo`" title="aws"/>
            </div>
            <div class="info">
              <h3>#general</h3>
              <label for="1-2-7" class="italics">Show More</label>
              <input type="checkbox" id="1-2-7">
              <div class="more">
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">channel</div>
                  <p class="csm6 cxs12">#general</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Channel_id</div>
                  <p class="csm6 cxs12">CFA5Z68JC</p>
                </div>
                <div class="row">
                  <div class="csm6 cxs12 bold capitalize">Scope</div>
                  <p class="csm6 cxs12">identify,bot,incoming-webhook,chat:write:bot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Sine -->
    <h2>Sine</h2>
    <p>Wave</p>

    <button class="button default outline"  @click="reroll()">
      <i class="fas fa-dice"></i>
      Reroll
    </button>
    <button class="button default outline"  @click="rerollSine()">
      <i class="fas fa-dice"></i>
      Reroll Sine
    </button>
    <br>
    <br>

    <div class="bars">
      <div class="bar" v-for="(i, index) in sineBars" :key="`${index}`" :style="`height: ${i}rem;`">&nbsp;</div>
    </div>


    <h2>Card 2</h2>
    <p>Take a card, any card.</p>

    <!-- Card2 -->

    <button class="card2">
      <div class="big bold">Cascadeo</div>
      <div>andrew@cascadeo.com</div>
    </button>


    <!-- Matrix -->
    <h2>Matrix</h2>
    <p>I cannot confirm nor deny that I am hungry...</p>

    <input type="text" v-model="searchQuery" placeholder="Filter">
    <matrix :search="searchQuery" v-if="results" :data="results"></matrix>



    <!-- List animate -->
    <h2>List Animate</h2>
    <p>CSS animation is the spice of life</p>
    <!-- <list-animate /> -->


    <!-- Spin5 -->
    <h2>Spin5</h2>
    <p>Revenge of the Spinner</p>

    <div class="spinButton">
      <button class="button default outline">
        <span class="spin5"></span>
        Loading
      </button>
    </div>

    <div class="smallSpin">
      <div class="spin5"></div>
    </div>

    <br>

    <button class="button default outline" @click="spin(5)">
      <i class="fas fa-bomb"></i>
      Trigger Spin (5s)
    </button>


    <!-- Key Test -->
    <h2>Key Test</h2>
    <p>Wait.. this isn't my house...</p>

    <input type="text" name="hashInput" id="hashInput" v-model="hashInput">
    <pre>{{ hashedExample }}</pre>
    <button class="button default outline" @click="hashKey">
      <i class="fas fa-random"></i> Mix it Up
    </button>




    <!-- Web Frame -->
    <h2>Web frame</h2>
    <p>It's browsers all the way down.</p>
    <web-frame uri="app.cascadeo.io">
      <div slot="webContent">
        <img src="~@/assets/example.png" alt="site screenshot">
      </div>
    </web-frame>

    <!-- Validation -->
    <h2>Validation</h2>
    <p>Never trust the browser's lies!</p>

    <label class="label" for="numeric">Number</label>
    <input v-validate="'required|numeric'" name="numeric" type="text" placeholder="Number" >
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('numeric')">
      {{ errors.first('numeric') }}
    </banner>



  </div>
</template>

<script lang="ts">
/* tslint:disable:no-console */

import { Component, Watch, Vue } from 'vue-property-decorator';

import Mobile from './Mobile.vue';
import WebFrame from './WebFrame.vue';
import ListAnimate from './ListAnimate.vue';
import Matrix from './Matrix.vue';

import API from '@/API';
import Utils from '@/router/utils';
import { setTimeout } from 'timers';
import { format } from 'date-fns';


@Component({
  components: {
    Mobile,
    WebFrame,
    ListAnimate,
    Matrix,
  },
})
export default class Play extends Vue {

  /* Status icons */
  private statuses: Array<{[key: string]: string}> = [
      { status: 'LOADING...',     icon: 'spinner c-gray-500' },
      { status: 'NO_ACCESS',      icon: 'fa-do-not-enter c-gray-500' },
      { status: 'CMI_READY',      icon: 'fa-check c-success-500' },
      { status: 'CMI_UP',         icon: 'fa-circle c-success-500' },
      { status: 'CMI_STARTING',   icon: 'fa-arrow-up c-success-500' },
      { status: 'CMI_STOPPING',   icon: 'fa-arrow-to-bottom c-danger-500' },
      { status: 'CMI_DOWN',       icon: 'fa-do-not-enter c-danger-500' },
      { status: 'SERVICE_UP',     icon: 'fa-circle c-success-500' },
      { status: 'SERVICE_DOWN',   icon: 'fa-do-not-enter c-danger-500' },
      { status: 'UNKNOWN',        icon: 'fa-question-circle c-gray-400' },
    ];


  /* Focus List */
  private focusList: string[] = ['', '', '', ''];


  /* Countdown */
  private countdown: any = null;
  private secondsLeft: number = 5;
  private pollSeconds: number = 5;

  /* Endpoint */
  private email: IntegrationDefinition = {
    definition_id: 'email',
    name: 'Email',
    image: 'email',
    enabled: true,
    editable: false,
    definition_type: 'output',
    tags: ['environment'],
    link: '',
    description: 'Good old email.',
    threshold_supported: 'false',
  };

  /* Endpoint */
  private endpoint: IntegrationDefinition = {
    definition_id: 'endpoint',
    name: 'Cascadeo Endpoints',
    image: 'endpoint',
    enabled: true,
    editable: false,
    definition_type: 'input',
    tags: ['environment'],
    link: '',
    description: 'Simple endpoint monitoring service.',
    threshold_supported: 'false',
  };

  /* Upsell */

  private upsell: string = 'basic';

  /* Checklist */

  /**
   * SOW
   * Kick Off Meeting
   * Credentials Transfer
   * Provision Tier1/2/3
   * Platform Onboarding
   * Billing
   */

  /**
   * PENDING
   * DONE
   * BLOCKED
   * SKIPPED
   */

  private checklist: object[] = [
    {
      name: 'SOW',
      status: 'DONE',
      updated: 1553309361115,
      person: 'Jared Reimer',
      notes: '',
    },
    {
      name: 'Kick Off Meeting',
      status: 'DONE',
      updated: 1553419461115,
      person: 'Garrett Baserman',
      notes: 'Attended: Andrew, Scott, Windsor',
    },
    {
      name: 'Credentials Transfer',
      status: 'SKIPPED',
      updated: 1553619461115,
      person: 'RJ Miguel',
      notes: 'Did not need Tier 3 support',
    },
    {
      name: 'Provision Tier1/2/3',
      status: 'BLOCKED',
      updated: 1553719461115,
      person: 'Chris Ellis',
      notes: 'All Tier 1/2 tied up, need to hire more!',
    },
    { name: 'Platform Onboarding', status: 'PENDING', updated: 0, person: '', notes: '' },
    { name: 'Billing', status: 'PENDING', updated: 0, person: '', notes: '' },
  ];


  /* Modal */
  private showModal: boolean = false;

  /* Matrix */
  private searchQuery: string = '';
  private results: object[] = [
    { breakfast: 'Fresh Fruit', lunch: 'Kale Salad', dinner: 'Raw Salmon' },
    { breakfast: 'Coffee', lunch: 'Sandwich', dinner: 'Steak' },
    { breakfast: 'Bacon & Eggs', lunch: 'Chicken Fried Steak', dinner: 'Ribeye' },
    { breakfast: 'Coffee', lunch: 'Fruit Smoothie', dinner: 'Beer' },
    { breakfast: 'Croissant', lunch: 'Pasta Carbonara', dinner: 'Wine and Cheese' },
  ];

  /* Hash Example */
  private hashInput: string = '';
  private hashedExample: string = '';

  /* Sine waves */
  private sineBars: number[] = [];

  /* Lifecycle */

  private beforeDestroy(): void {
    console.log('LEAVING PLAY!');
    clearInterval(this.countdown);
  }

  /* Methods */

  private setFocus(index: number): void {
    console.log(index);
    console.log(document.getElementById(`focus-${index}`));
    document.getElementById(`focus-${index}`)!.focus();
  }

  private addFocus(): void {
    this.focusList.push('');
    const index = this.focusList.length - 1;
    console.log(this.focusList);
    console.log(index);
    this.$nextTick(function() {
      this.setFocus(index);
    });
  }


  /* Checklist */
  private checklistStyle(status: string): object {
    if (status === 'DONE') {
      return {
        color: `var(--c-primary-400)`,
        textDecoration: 'line-through',
      };
    } else if (status === 'BLOCKED') {
      return {
        background: `var(--c-danger-200)`,
        color: `var(--c-danger-900)`,
        fontWeight: `700`,
      };
    } else if (status === 'SKIPPED') {
      return {
        textDecoration: 'line-through',
        color: `var(--c-gray-400)`,
      };
    }
    return {};
  }

  private formatDate(ts: number): string {
    if (ts === 0) {
      return '';
    }
    return new Date(ts).toLocaleString();
  }

  /* Hashids */
  private genId(size: number): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < size; i++) {
      text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    return text;
  }

  /* New spinner */
  private spin(t: number): void {
    API.UI.showSpin();
    setTimeout(() => {
      API.UI.hideSpin();
    }, t * 1000);
  }

  private hashKey(): void {
    this.hashedExample = (btoa(String(this.hashInput)).replace(/[^a-z0-9]/gi, ''));
  }


    /* Sine waves */
  private ranHeight(): string {
    const maxHeight = 10;
    const height = Math.random() * maxHeight;
    return `height: ${height}rem;`;
  }

  private reroll(): void {
    this.sineBars = [];
    const numBars: number = 40;
    const maxHeight: number = 10;
    const minHeight: number = 1;

    for (let index = 0; index < numBars; index++) {
      this.sineBars.push((Math.random() * maxHeight) + minHeight);
    }
  }

  private rerollSine(): void {
    this.sineBars = [];
    let counter = 0;
    const maxHeight = 5;
    const numBars = 150;
    const increase = Math.PI * 2 / 20;

    for (let i = 0; i < numBars; i += 1 ) {
      const jitter = (Math.random() * 4) - 2;
      const x = i;
      const y = ((Math.sin( counter ) / 2 + .75) * maxHeight) + jitter;
      counter += increase;

      this.sineBars.push(y);

    }
  }

}

</script>

<style lang="scss" scoped>

.play h1 {
  margin-bottom: -2rem;
}

.play h2 {
  margin: 4rem 0 0rem 0;
  border-bottom: 0.1rem solid var(--c-primary-500);
}

.play h2 + p {
  font-size: 1.2rem;
  font-style: italic;
}

// Gradient

.gradient1 {
  background:
    linear-gradient(red, transparent),
    linear-gradient(to top left, lime, transparent),
    linear-gradient(to top right, blue, transparent);
  background-blend-mode: screen;
}

.gradient2 {
  background-image: linear-gradient(
      20deg,
      var(--c-primary-800),
      var(--c-primary-500)
    );
}


.gradient3 {
  background:
    linear-gradient(var(--c-primary-500), transparent),
    linear-gradient(to top left, var(--c-primary-400), transparent),
    linear-gradient(to bottom, var(--c-primary-300), transparent),
    linear-gradient(20deg, var(--c-primary-800), transparent);
  background-blend-mode: overlay;
}

.box {
  display: inline-block;
  height: 30rem;
  width: 30rem;
}



// Upsell

.upsell {
  label.button {
    padding: 2rem 1.5rem;
    margin: 1rem 0;

  }
}

// Checklist

.checklist {
  border-top: .1rem solid var(--c-gray-500);
  border-bottom: .1rem solid var(--c-gray-500);
  margin-bottom: -.1rem;

  .status {
    flex: 0 0 12rem;

    .fas {
      width: 2.5rem;
      text-align: center;
    }
  }

}


// Timeline
.flex .arrow {
  flex: 1;
  padding: 2.75rem 0.25rem;
}

.flex .service {
  flex: 3;
}


.timeline {
  .element {
    display: flex;

    .image {
      flex: 0 0 6rem;
      border: .1rem solid var(--c-gray-500);
      height: 6rem;
      width: 6rem;
      padding: .5rem;
      border-radius: 999rem;
    }

    .info {
      flex: 1;
      position: relative;

      &:before {
        content: '';
        border-left: .1rem solid var(--c-gray-500);
        position: absolute;
        height: calc(100% - 7rem);
        left: -4.4rem;
        top: 7.2rem;
      }

      h3 {
        font-weight: 900;
        font-size: 2rem;
        margin: .5rem 0 .5rem .5rem;
        // border-bottom: .1rem solid var(--c-gray-500);
      }

      input[type=checkbox] {
        position: relative;
        top: -3.5rem;
        left: 1rem;
        opacity: 1;
        z-index: 1;
        margin-bottom: -2rem;
      }
      input[type=checkbox]:checked ~ .more {
        opacity: 1;
        height: auto;
        transition: all .2s;
      }

      .more {
        opacity: 0;
        height: 0;
        transition: all .2s;
      }

      label {
        text-align: left;
        margin-left: 2rem;
      }
    }
  }

  & > div:last-child {
    .info {
      &:before {
        content: '';
        display: none;
      }
    }

  }
}

// Sine

.bars {
  display: flex;
  height: 12rem;
  .bar {
    flex: 1;
    background: black;
    margin-top: auto;
  }
}


/* Card2 */
.card2 {
  position: relative;
  top: 0rem;
  background: var(--c-gray-100);
  border: .1rem solid var(--c-gray-200);
  box-shadow: 0 0.4rem 1.2rem 0rem var(--c-gray-400), 0 0.2rem 0.2rem 0rem var(--c-gray-400);
  transition: var(--transition-short) all;
}

.card2:hover {
  top: -.25rem;
  border: .1rem solid var(--c-primary-500);
  box-shadow: 0 0.6rem 1.5rem 0rem var(--c-primary-400), 0 0.2rem 0.2rem 0rem var(--c-primary-200);
  transition: var(--transition-short) all;
}

.card2:active {
  background: var(--c-gray-200);
  top: 0.1rem;
  box-shadow: 0 0.1rem .25rem 0rem var(--c-gray-400), 0 0.2rem 0.2rem 0rem var(--c-gray-400);
  transition: var(--transition-short) all;
}


/* Spin5 */
.spin5:before {
  content: '!';
  font-family: Monaco, monospace;
  font-weight: bold;
  display: inline;
  margin: 0 .75rem;
  animation: spin4 750ms infinite;
}

.smallSpin {
  display: flex;
  border: .1rem solid var(--c-gray-700);
  height: 20rem;
  resize: both;
  overflow: auto;
}

.smallSpin .spin5 {
  /* color: var(--c-gray-100); */
  color: var(--c-primary-500);
  line-height: 10rem;
  text-align: center;
  margin: auto;
  font-size: 6rem;
  z-index: 1;
  align-items: center;
}

.smallSpin .spin5:before {
  content: '!';
  font-family: Monaco, monospace;
  font-weight: bold;
  display: block;
  width: 10rem;
  height: 10rem;
  margin: 0 auto;

  /* background-color: var(--c-primary-500); */
  animation: spin4 750ms infinite;
}

@keyframes spin4 {
  0%, 100% {
    content: '–';
  }
  25% {
    content: '\\';
  }
  50% {
    content: '|';
  }
  75% {
    content: '/';
  }
}


/* Grids 2 */

.grid2 .wrapper {
  display: grid;
  grid-template-columns: 10rem 3rem 10rem 3rem 10rem;
  grid-template-rows: 10rem 3rem 10rem 3rem 10rem;
}

/* .grid2 * > * {
  outline: 1px solid rgba(255,0,0,.4);
  background: rgba(255,0,0,.2);
} */

.grid2 .box {
  margin: auto;
}

.grid2 .box button {
  width: 10rem;
  height: 10rem;
  font-size: 3rem;
  transition: var(--transition-medium) all;
}

.grid2 .box button img {
  width: 8rem;
  height: 8rem;
  transition: var(--transition-medium) all;
}



</style>
