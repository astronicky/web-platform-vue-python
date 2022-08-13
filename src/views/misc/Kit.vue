<template>
  <div class="kit">
    <h1>UI Kit</h1>

    <h2>Table of Contents</h2>
    <ul class="toc">
      <li v-for="(chapter, index) in toc" :key="index">
        <a :href="'#' + chapter.link" class="button default outline">
          <i :class="chapter.icon"></i>
          <div>{{ chapter.label }}</div>
        </a>
      </li>
    </ul>

    <hr>

    <h2 id="empty">Empty State</h2>

    <empty icon="fas fa-alarm-clock">
      <div slot="title">What's Missing</div>
      <div slot="description">
        <p>
          Give a description of what should be here, it's value,
          and how to enable the feature.
          <span class="underline">Keep it brief!</span>
        </p>
        <br>
        <button class="button primary outline large">
          <i class="fas fa-chevron-right"></i>
          Action Button
        </button>
      </div>
    </empty>



    <h2 id="grid">Grid</h2>
    <p>
      <b>flexboxgrid3</b> is a fork of <a href="https://github.com/evgenyrodionov/flexboxgrid2">flexboxgrid2</a>
      using shortened class names for ease in highly responsive layouts.
    </p>
    <p>
      <span class="tag default outline">
        col-xs-offset-4
      </span>
      now becomes
      <span class="tag default outline">
        cxso4
      </span>.
    </p>
    <ul class="grid">
      <li>xs :    0px - 575px</li>
      <li>sm :  576px - 767px</li>
      <li>md :  768px - 991px</li>
      <li>lg :  992px - 1199px</li>
      <li>xl : 1200px - ∞</li>
    </ul>


    <div class="container">
      <div class="row">
        <div class="cxs">c*</div>
      </div>
      <div class="row">
        <div v-for="i in 12" :key="i" class="cxs1">c*1</div>
      </div>
      <div class="row">
        <div v-for="i in 6" :key="i" class="cxs2">c*2</div>
      </div>
      <div class="row">
        <div v-for="i in 4" :key="i" class="cxs3">c*3</div>
      </div>
      <div class="row">
        <div v-for="i in 3" :key="i" class="cxs4">c*4</div>
      </div>
      <div class="row">
        <div v-for="i in 2" :key="i" class="cxs6">c*6</div>
      </div>
      <div class="row">
        <div class="cxs12">c*12</div>
      </div>
    </div>

    <br>

    <div class="container">
      <div class="row">
        <div class="cxs4 cxso8">c*o8</div>
      </div>
      <div class="row">
        <div class="cxs4 cxso4">c*o4</div>
      </div>
      <div class="row">
        <div class="cxs4 cxso0">c*o0</div>
      </div>
    </div>

    <br>

    <div class="container">
      <div class="row">
        <div class="cxs12 csm4 last-sm">
          First
        </div>
        <div class="cxs12 csm4">
          Second
        </div>
        <div class="cxs12 csm4 first-sm">
          Third
        </div>
      </div>
    </div>



    <!-- Inputs -->
    <h2 id="inputs">Inputs</h2>

    <h3>Radio Buttons</h3>
    <div>
      <input id="radio-1" name="radio-group" type="radio" value="radio-1" checked>
      <label for="radio-1">Checked</label>
    </div>
    <div>
      <input id="radio-2" name="radio-group" type="radio" value="radio-2" >
      <label for="radio-2">Not Checked</label>
    </div>
    <div>
      <input id="radio-3" name="radio-group" type="radio" value="radio-3" disabled>
      <label for="radio-3">Disabled</label>
    </div>
    <div>
      <input id="radio-4" name="radio-group" type="radio" value="radio-4" disabled checked>
      <label for="radio-4">Disabled Checked</label>
    </div>

    <h3>Checkboxes</h3>
    <div>
      <input id="checkbox-1" name="checkbox-1" type="checkbox" checked>
      <label for="checkbox-1">Checked</label>
    </div>
    <div>
      <input id="checkbox-2" name="checkbox-2" type="checkbox">
      <label for="checkbox-2">Not Checked</label>
    </div>
    <div>
      <input id="checkbox-3" name="checkbox-3" type="checkbox" disabled>
      <label for="checkbox-3">Disabled</label>
    </div>
    <div>
      <input id="checkbox-4" name="checkbox-4" type="checkbox" disabled checked>
      <label for="checkbox-4">Disabled Checked</label>
    </div>

    <!-- Text Input -->
    <label for="first_name">First Name</label>
    <input type="text" placeholder="Legal" name="first_name">

    <br>

    <label for="first_name">First Name</label>
    <input type="text" placeholder="Legal" name="first_name" class="small">

    <br>

    <!-- Dropdown -->
    <label for="dropdown_option">Dropdown</label>
    <select name="dropdown_option">
      <option value="option1" disabled>Option 1</option>
      <option value="option2" selected>Option 2</option>
      <option value="option3">Option 3</option>
    </select>

    <br>

    <!-- Textarea -->
    <label for="description">Textarea</label>
    <textarea placeholder="Long description" name="description"></textarea>

    <br>

    <label for="slider">Slider</label>
    <input type="range" min="0" max="100" value="50" name="slider" step="1">




    <!-- Progress Bar -->
    <!--
      Accepts:
      type: primary, default
      size: small, medium, large
    -->
    <h2 id="progress_bar">Progress Bar</h2>
    <input type="number" v-model="proginput">
    {{proginput}}
    <br>
    <!-- TODO: Fix progress bar -->
    <progressbar :maximum="50" :current="progressValue" type="primary" size="large" />
    <br>
    <progressbar :maximum="100" :current="progressValue" type="default" size="medium" />
    <br>
    <progressbar :maximum="200" :current="progressValue" type="danger" size="small" />


    <!-- Banner -->
    <h2 id="banner">Banner</h2>

    <!--
      Accepts:
      type: primary, default, danger, success
      icon: fas fa-*
      dismiss
      large

      Note: You can also leave off 'type', 'size', 'icon', and 'dismiss'
    -->

    <banner type="primary" icon="fas fa-magic" large>
      <p class="big bold">Have You Heard the Word?</p>
      <p>
        Listen to Beyoncé and upgrade today! No seriously, it's going to be awesome!
      </p>
      <ul class="bullet">
        <li>Single Ladies</li>
        <li>Hold Up</li>
        <li>Halo</li>
      </ul>
      <button class="button primary">UPGRADE!!</button>
    </banner>
    <br>


    <banner>Document saved.</banner>
    <br>

    <banner type="danger" icon="fas fa-exclamation-triangle">
      You are going to delete a server!
      <p>You are going to delete a server!!</p>
      <div>You are going to delete a server!!!</div>
    </banner>
    <br>

    <banner type="success" icon="fas fa-thumbs-up" dismiss>
      <!-- <div>You did the thing! Hurray!</div> -->
      You did the thing! Hurray!
    </banner>
    <br>

    <!-- Notifications -->
    <h2 id="notifications">Notifications</h2>


    <button
      class="button default outline"
      @click="addNotification({
        type: 'success',
        text: 'Moon wins the sky.'})">
      <i class="fas fa-moon"></i>
      Success
    </button>

    &nbsp;

    <button
      class="button default outline"
      @click="addNotification({
        type: 'default',
        text: 'Moon set to full.'})">
      <i class="fas fa-moon"></i>
      Default
    </button>

    &nbsp;

    <button
      class="button primary outline"
      @click="addNotification({
        type: 'primary',
        text: 'A new moon created.'})">
      <i class="fas fa-moon"></i>
      Primary
    </button>

    &nbsp;

    <button
      class="button primary outline"
      @click="addNotification({
        type: 'save',
        text: 'Your moon was saved.'})">
      <i class="fas fa-moon"></i>
      Save
    </button>

    &nbsp;

    <button
      class="button danger outline"
      @click="addNotification({
        type: 'danger',
        text: 'The moon blew up!'})">
      <i class="fas fa-moon"></i>
      Danger
    </button>


    <br><br>

    <!-- Table -->
    <h2 id="matrix">Matrix</h2>

    <!-- TODO: Fix Matrix -->
    <!-- <input type="text" v-model="searchQuery" placeholder="Filter">
    <br>
    <matrix :search="searchQuery" v-if="results" :data="results"></matrix> -->


    <!--Type  -->
    <h2 id="type">Type</h2>

    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <p>Paragraph</p>

    <ul>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
    </ul>

    <ul class="bullet">
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
    </ul>

    <ol>
      <li>One</li>
      <li>Two</li>
      <li>Three</li>
    </ol>

    <!--Colors -->
    <h2 id="colors">Colors</h2>

    <div v-for="(color, cIndex) in colors" :key="`${color}-${cIndex}`">
      <div class="color-tray">
        <div class="title">{{ color }}</div>
        <button
          v-for="(range, index) in 9"
          :key="`${color}-${range}`"
          @click="copyColor(`${color}-${range}`)"
          class="color-chip"
          :style="{ background: `var(--c-${color}-${(index + 1) * 100})` }">
          <!-- Hidden input for copy function -->
          <input type="text" :id="`${color}-${range}`">
          <span :style="{ background: `var(--c-${color}-${(index + 1) * 100})` }">
            {{ (index + 1) * 100}}
          </span>
        </button>
      </div>
    </div>


    <h2 id="cards">Cards</h2>

    <div class="card">
      <div class="big bold">
        Ec2
      </div>
      <div>
        Amazon Elastic Compute Cloud (Amazon EC2) is a
        web service that provides secure, resizable compute capacity in the cloud.
        It is designed to make web-scale cloud computing easier for developers.
      </div>
    </div>



    <h2 id="buttons">Buttons</h2>

    <!--Tabbing catch  -->
    <!-- <input type="text"><br><br>  -->

    <button class="button default">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button default outline">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button default link">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button default disabled" disabled>
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <br><br>

    <!--Primary -->

    <button class="button primary">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button primary outline">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button primary link">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button primary disabled" disabled>
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <br><br>

    <!-- Danger -->

    <button class="button danger">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button danger outline">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button danger link">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <button class="button danger disabled" disabled>
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <!-- Sizing -->
    <br><br>

    <button class="button default large">
      <i class="fas fa-cloud"></i>
      Button
    </button>
    <button class="button default">
      <i class="fas fa-cloud"></i>
      Button
    </button>
    <button class="button default small">
      <i class="fas fa-cloud"></i>
      Button
    </button>

    <br><br>

    <button class="button default giant">
      <i class="fas fa-cloud"></i>
      Button
    </button>



    <!-- Tags -->
    <h2 id="tags">Tags</h2>

    <!-- Default -->
    <div class="tag default">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag default">
      Tag
      <button>
        <i class="fas fa-times-circle"></i>
      </button>
    </div>

    <div class="tag default">
      Tag
    </div>

    <div class="tag default outline">
      <i class="fas fa-tag"></i>
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag default outline">
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag default outline">
      Tag
    </div>

    <div class="tag default highlight">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag default link">
      <i class="fas fa-tag"></i>
      Tag
    </div>


    <br>

    <!-- Primary -->
    <div class="tag primary">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag primary">
      Tag
      <button>
        <i class="fas fa-times-circle"></i>
      </button>
    </div>

    <div class="tag primary">
      Tag
    </div>

    <div class="tag primary outline">
      <i class="fas fa-tag"></i>
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag primary outline">
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag primary outline">
      Tag
    </div>

    <div class="tag primary highlight">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag primary link">
      <i class="fas fa-tag"></i>
      Tag
    </div>


    <br>

    <!-- Danger -->
    <div class="tag danger">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag danger">
      Tag
      <button>
        <i class="fas fa-times-circle"></i>
      </button>
    </div>

    <div class="tag danger">
      Tag
    </div>

    <div class="tag danger outline">
      <i class="fas fa-tag"></i>
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag danger outline">
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag danger outline">
      Tag
    </div>

    <div class="tag danger highlight">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag danger link">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <br>

    <!-- Success -->
    <div class="tag success">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag success">
      Tag
      <button>
        <i class="fas fa-times-circle"></i>
      </button>
    </div>

    <div class="tag success">
      Tag
    </div>

    <div class="tag success outline">
      <i class="fas fa-tag"></i>
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag success outline">
      Tag
      <button>
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="tag success outline">
      Tag
    </div>

    <div class="tag success highlight">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <div class="tag success link">
      <i class="fas fa-tag"></i>
      Tag
    </div>

    <br>
    <br>

    <p>
      A special kind of tag with the ability to click-to-copy.
    </p>

    <copy class="tag default highlight">0123456789</copy>
    <copy class="tag primary highlight">0123456789</copy>
    <copy class="tag danger highlight">0123456789</copy>
    <copy class="tag success highlight">0123456789</copy>

    <br>
    <br>

    <!-- Tabs -->
    <!--
      Accepts:
        list: boolean (optional) - Adds numbers to tabs
        tabNav: boolean (optional) - Prevents navigation through tabs
        selected: number (optional-ish) - sets starting tab index, default is 0
    -->
    <h2 id="tabs">Tabs</h2>

    <tabs
      :list="true"
      :tabNav="true"
      :selected="tabIndex">
      <tab name="Services" updates="1">
        <p>What we do</p>
        <button class="button default outline" @click="gotoTab(1)">Go To #2</button>
      </tab>
      <tab name="Pricing">
        <p>How much we do it for</p>
        <button class="button default outline" @click="gotoTab(2)">Go To #3</button>
      </tab>
      <tab name="About Us">
        <p>Why we do it</p>
        <button class="button default outline" @click="gotoTab(0)">Go To #0</button>
      </tab>
    </tabs>


    <h2 id="images">Images</h2>

    <service-image id="cascadeo" alt="Cascadeo Color Logo" title="Cascadeo Corp." />

    <!-- Arrows -->
    <h2 id="arrows">Arrows</h2>

    <arrow />
    <br>

    <arrow type="danger" visual="dashed" speed="stopped" title="0 data / sec" />
    <arrow type="default" visual="dashed" speed="slow" title="1 CD / day" />
    <arrow type="primary" visual="dashed" speed="medium" title="22 floppies / hour" />
    <arrow type="success" visual="dashed" speed="fast" title="945 VHS / station wagon" />

    <br><br>

    <!-- Modal -->
    <h2 id="modal">Modal</h2>

    <button class="button default outline" @click="showModal = !showModal">
      Toggle Modal
    </button>

    <modal v-model="showModal">
      <h2>Modal Title</h2>
      <p>
        Modal Paragraph
      </p>
      <div class="right">
        <button class="button default link" @click="showModal = false">
          Close
        </button>
        <button class="button default outline">
          <i class="fas fa-save"></i>
          Save
        </button>
      </div>
    </modal>


  </div>
</template>

<style lang="scss" scoped>

.toc {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;


  li {
    flex: 0 1 calc(25% - 2rem);
    margin: 1rem;

    a {
      display: block;
      height: 14rem;
      font-size: 2rem;
      padding: 3rem 1rem 2rem 1rem;
      text-align: center;

    }
  }

  .fas {
    width: inherit;
    margin: 0 auto 1rem auto;
    font-size: 4rem;
  }
}

@media (max-width: 576px) {
  .toc {
    li {
      flex: 1 0 100%;
      display: flex;
      margin: .5rem;

      a {
        flex: 1 0 100%;
        display: flex;
        height: auto;
        padding: 1rem;
      }
    }
    .fas {
      position: relative;
      top: .25rem;
      font-size: 2rem;
      margin: 0 1rem;
      width: 3rem;
    }
  }
}



.grid li {
  font-size: 2rem;
  /* font-weight: 700; */
  font-family: monospace;
  white-space: pre-wrap;
}

.cxs,
.cxs1,
.cxs2,
.cxs3,
.cxs4,
.cxs5,
.cxs6,
.cxs7,
.cxs8,
.cxs9,
.cxs10,
.cxs11,
.cxs12 {
  text-align: center;
  border: .2rem solid var(--c-primary-500);
  background: var(--c-primary-200);
  color: var(--c-primary-700);
}

.color-tray {
  display: flex;
  position: relative;
  border: .1rem solid black;
  padding: 4rem;

  .title {
    position: absolute;
    top: 0;
    left: .5rem;
    font-weight: 700;
    text-transform: capitalize;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: white;
    z-index: -1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
    background: black;
    z-index: -1;
  }

  .color-chip {
    flex: 1 1 11.1%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 0rem;
    height: 15rem;
    font-weight: 900;
    font-size: 2.5rem;
    padding: .2rem;
    color: black;
    border: none;
    text-shadow: .1rem .1rem 0 white, .1rem -.1rem 0 white, -.1rem .1rem 0 white, -.1rem -.1rem 0 white;
    transition: var(--transition-short) all;

    &:hover {
      top: -1rem;
      transition: var(--transition-short) all;
    }

    input {
      position: absolute;
      pointer-events: none;
      top: 0;
      opacity: 0;
    }
  }
}




@media (prefers-color-scheme: dark) {}

</style>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import API from '@/API';
import { endOfHour } from 'date-fns';

@Component
export default class Kit extends Vue {
  // Table of Contents
  private toc: object[] = [
    { label: 'Empty State',   icon: 'fas fa-expand',            link: 'empty'},
    { label: 'Grid',          icon: 'fas fa-th',                link: 'grid'},
    { label: 'Inputs',        icon: 'fas fa-clipboard',         link: 'inputs'},
    { label: 'Progress Bar',  icon: 'fas fa-thermometer-half',  link: 'progress_bar'},
    { label: 'Banner',        icon: 'fas fa-newspaper',         link: 'banner'},
    { label: 'Notifications', icon: 'fas fa-minus',             link: 'notifications'},
    { label: 'Matrix',        icon: 'fas fa-columns',           link: 'matrix'},
    { label: 'Type',          icon: 'fas fa-text-height',       link: 'type'},
    { label: 'Colors',        icon: 'fas fa-tint',              link: 'colors'},
    { label: 'Cards',         icon: 'fas fa-address-card',      link: 'cards'},
    { label: 'Buttons',       icon: 'fas fa-hand-point-up',     link: 'buttons'},
    { label: 'Tags',          icon: 'fas fa-tags',              link: 'tags'},
    { label: 'Tabs',          icon: 'fas fa-window',            link: 'tabs'},
    { label: 'Images',        icon: 'fas fa-image',             link: 'images'},
    { label: 'Arrows',        icon: 'fas fa-arrow-alt-right',   link: 'arrows'},
    { label: 'Modal',         icon: 'fas fa-window-restore',    link: 'modal'},
  ];

  // Color
  private colors: string[] = ['gray', 'primary', 'danger', 'info', 'success'];


  // Tabs
  private tabIndex: number = 0;
  // Matrix
  private searchQuery: string = '';
  private proginput: number = 22;
  private results: object[] = [
    {
      gun: 'AWP',
      game: 'CounterStrike 1.6',
      hero: 'Counter Terrorists',
    },
    {
      gun: 'Portal Gun',
      game: 'Portal 2',
      hero: 'Chell',
    },
    {
      gun: 'BFG',
      game: 'DOOM',
      hero: 'Doom Guy',
    },
    {
      gun: 'Golden Gun',
      game: 'GoldenEye 64',
      hero: 'James Bond',
    },
  ];
  // Banner
  private bannerMsg: string = 'I love you!';
  private bannerIcon: string = 'fas fa-heart';

  // Modal
  private showModal: boolean = false;

  get progressValue(): number { return Number(this.proginput); }
  // Color

  private copyColor(id: string): void {
    const variable = (event!.target! as any).style.background;
    const cssVar = variable.substr(4).slice(0, -1);
    const hslValues = getComputedStyle((event!.target! as any)).getPropertyValue(cssVar);
    // console.log(hslValues);
    const hsl: string[] = hslValues.substr(5).slice(0, -1).split(', ');
    // console.log(hsl);
    const hex = this.hslToHex(Number(hsl[0]), Number(hsl[1].slice(0, -1)), Number(hsl[2].slice(0, -1)));
    // console.log(hex);

    (document.querySelector(`#${id}`) as HTMLInputElement).value = hex;
    (document.querySelector(`#${id}`) as HTMLInputElement).select();
    document.execCommand('Copy');
    API.UI.addNotification({ type: 'primary', text: `Copied ${hex}!` });
  }

  /**
   * Converts an HSL color value to Hex.
   * https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
   *
   * @param   {number}  h       The hue
   * @param   {number}  s       The saturation
   * @param   {number}  l       The lightness
   * @return  {string}          Hex color representation
   */
  /* tslint:disable */
  private hslToHex(h: number, s: number, l: number): string {

    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    const finalHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    return finalHex;
  }
  /* tslint:enable */

  // UI
  private gotoTab(tabNumber: number) { this.tabIndex = tabNumber; }

  private addNotification(payload: AppNotification) { API.UI.addNotification(payload); }

}
</script>
