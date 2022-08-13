<template>
  <div>
    <h1>Forms</h1>

    <mobile/>

    <!-- TODO: Componentize all forms 😂 -->
    <!--
        Big List of Challenges (BLoC, kinda catchy actually)
        [X] Fully Responsive
        [ ] All input types (email, text, checks, dropdowns, sliders, etc)
        [ ] Validation
        [ ] Non interactive inputs (just display)
        [ ] Button addons
        [ ] Consistent padding across all tags
    -->

    <h2>Experimental</h2>
    <div class="container">
      <form>
        <div class="row">
          <div class="clg3 cmd4 csm5">
            <label class="label" for="input">Input</label>
          </div>
          <div class="clg4 cmd6 csm6 col-xs-10">
            <input v-validate="'required'" name="input" type="text" placeholder="Input">
          </div>
          <div class="clg1 cmd2 csm1 col-xs-2">
            <button class="button default outline">
              <i class="fas fa-copy"></i>
            </button>
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('input')">
              {{ errors.first('input') }}
            </banner>
          </div>

          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <p class="italics">
              Note: This should be your primary email.
            </p>
          </div>
        </div>
      </form>
    </div>


    <div class="container">
      <form>
        <div class="row">
          <div class="clg3 cmd4 csm5">
            <label class="label" for="input">Input</label>
          </div>
          <div class="clg4 cmd6 csm6 col-xs-10">
            <input v-validate="'required'" name="input" type="text" placeholder="Input">
          </div>
          <div class="clg1 cmd2 csm1 col-xs-2">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('input')">
              errors.first('input') }}
            </banner>
          </div>

          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <p class="italics">
              Note: This should be your primary email.
            </p>
          </div>
        </div>
      </form>
    </div>


    <hr>


    <h2>Grail</h2>

    <div class="container">

      <form>

        <!-- Email -->
        <div class="row">
          <div class="clg3 cmd4 csm5">
            <label class="label" for="email">Email</label>
          </div>
          <div class="clg4 cmd6 csm7">
            <input v-validate="'required|email'" name="email" type="text" placeholder="jane@domain.com">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('email')">
              {{ errors.first('email') }}
            </banner>
          </div>

          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <p>
              Note: This should be your primary email.
            </p>
          </div>
        </div>


        <!-- Radio Group -->
        <div class="row">
          <div class="clg3 cmd4 csm5">
            <legend>Radio Group</legend>
          </div>

          <div class="clg4 cmd6 csm7">
            <div>
              <input id="radio-1" v-validate="'required'" name="radio-group" type="radio" :class="{ 'invalid': errors.has('radio-group') }">
              <label for="radio-1">SNES</label>
            </div>
            <div>
              <input id="radio-2" name="radio-group" type="radio" :class="{ 'invalid': errors.has('radio-group') }">
              <label for="radio-2">Genesis</label>
            </div>
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.has('radio-group')">
              {{ errors.first('radio-group') }}
            </banner>
          </div>

          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <p>
              Note: Choose only your favorite.
            </p>
          </div>
        </div>


        <!-- Address -->
        <div class="row">
          <div class="clg3 cmd4 csm5">
            <legend>Billing Address</legend>
          </div>
          <!-- Street Address -->
          <div class="clg4 cmd6 csm7">
            <input
              v-model="postalAddress.streetAddress"
              v-validate="'required'"
              name="postalAddress.streetAddress"
              type="text"
              placeholder="Address Line 1">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner
              type="danger"
              icon="fas fa-exclamation-triangle"
              v-if="errors.has('postalAddress.streetAddress')">
              {{ errors.first('postalAddress.streetAddress') }}
            </banner>
          </div>

          <!-- Post Office Box Number -->
          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <input
              v-model="postalAddress.postOfficeBoxNumber"
              name="postalAddress.postOfficeBoxNumber"
              type="text"
              placeholder="Suite, unit, building, etc">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">

          </div>

          <!-- City -->
          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <input
              v-model="postalAddress.addressLocality"
              v-validate="'required|alpha_num'"
              name="postalAddress.addressLocality"
              type="text"
              placeholder="City">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner
              type="danger"
              icon="fas fa-exclamation-triangle"
              v-if="errors.has('postalAddress.addressLocality')">
                {{ errors.first('postalAddress.addressLocality') }}
            </banner>
          </div>

          <!-- Country -->
          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <input
              v-model="postalAddress.addressCountry"
              v-validate="'required|alpha_num'"
              name="postalAddress.addressCountry"
              type="text"
              placeholder="Country">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner
              type="danger"
              icon="fas fa-exclamation-triangle"
              v-if="errors.has('postalAddress.addressCountry')">
              {{ errors.first('postalAddress.addressCountry') }}
            </banner>
          </div>

          <!-- State + Zip -->
          <div class="clg2 clgo3 cmd3 cmdo4 csm3 csmo5">
            <input
              v-model="postalAddress.addressRegion"
              v-validate="'required|alpha'"
              name="postalAddress.addressRegion"
              type="text"
              placeholder="State">
          </div>

          <div class="clg2 cmd3 csm4">
            <input
              v-model="postalAddress.postalCode"
              v-validate="'required|numeric'"
              name="postalAddress.postalCode"
              type="text"
              placeholder="Zip">
          </div>

          <div class="clg4 clgo0 cmd6 cmdo4 csm7 csmo5">
            <banner
              type="danger"
              icon="fas fa-exclamation-triangle"
              v-if="errors.has('postalAddress.addressRegion')">
                {{ errors.first('postalAddress.addressRegion') }}
            </banner>
            <banner
              type="danger"
              icon="fas fa-exclamation-triangle"
              v-if="errors.has('postalAddress.postalCode')">
              {{ errors.first('postalAddress.postalCode') }}
            </banner>
          </div>



          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <p>
              Note: This should be your billing address.
            </p>
          </div>
        </div>


        <!-- Submit -->
        <div class="row">
          <div class="clg4 clgo3 cmd6 cmdo4 csm7 csmo5">
            <button @click.prevent="validateForm()" class="button default outline">
              <i class="fas fa-chevron-right"></i>
              Submit
            </button>
          </div>
        </div>


      </form>


      <div>{{postalAddress}}</div>





      <!-- Address -->

      <!-- <div class="row">
        <div class="clg3 cmd4 csm5">
          <label class="label">Address</label>
        </div>
        <div class="clg4 cmd6 csm7">
          <input v-validate="'required|text'" name="postalAddress.addressCountry" type="text" placeholder="Address Line 1">

          <banner type="danger" icon="fas fa-exclamation-triangle" v-if="errors.first('postalAddress.addressCountry')">
            {{ errors.first('postalAddress.addressCountry') }}
          </banner>

          <p>
            Note: This can be your billing address.
          </p>
        </div>
      </div> -->



    </div>


    <hr>

    <!-- Number -->
    <label class="label" for="numeric">Number</label>
    <input v-validate="'required|numeric'" name="numeric" type="text" placeholder="Number">
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('numeric')">
      {{ errors.first('numeric') }}
    </banner>

    <!-- Alpha Number -->
    <label class="label" for="alpha_num">Alpha Number</label>
    <input v-validate="'required|alpha_num'" name="alpha_num" type="text" placeholder="Number">
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('alpha_num')">
      {{ errors.first('alpha_num') }}
    </banner>

    <!-- Max -->
    <label class="label" for="max">Max</label>
    <input v-validate="'required|max:4'" name="max" type="text" placeholder="Number">
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('max')">
      {{ errors.first('max') }}
    </banner>

    <!-- Radio -->

    <legend :class="{ 'error': errors.has('radio_group_1') }">Radio Group 1</legend>
    <label class="radio">
      <input name="radio_group_1" v-validate="'required'" value="1" type="radio"> Option 1
    </label>
    <label class="radio">
      <input name="radio_group_1" value="2" type="radio"> Option 2
    </label>
    <label class="radio">
      <input name="radio_group_1" value="3" type="radio"> Option 3
    </label>
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('radio_group_1')">
      {{ errors.first('radio_group_1') }}
    </banner>

    <!-- Checkbox -->
    <label class="checkbox">
      <input name="terms" v-validate="'required'" type="checkbox"> Check me out!
    </label>
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('terms')">
      {{ errors.first('terms') }}
    </banner>


    <select name="dropdown" v-validate="'required'">
      <option disabled selected value="">Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    <br>

    <banner type="default danger small" icon="fas fa-exclamation-triangle" v-if="errors.first('dropdown')">
      {{ errors.first('dropdown') }}
    </banner>

    <hr>
    <div>{{errors}}</div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Mobile from './Mobile.vue';

@Component({
  components: {
    Mobile,
  },
})
export default class Forms extends Vue {
  private postalAddress: object = {
    addressCountry: '',
    addressLocality: '',
    addressRegion: '',
    postOfficeBoxNumber: '',
    postalCode: '',
    streetAddress: '',
  };
}
</script>
