import Vue from 'vue';

/*
https://vuejs.org/v2/guide/components-registration.html#Automatic-Global-Registration-of-Base-Components
*/

// Import components
import Spin from './Spin.vue';
import Banner from './Banner.vue';
import Empty from './Empty.vue';
import ServiceImage from './ServiceImage.vue';
import ProgressBar from './ProgressBar.vue';
import Copy from './Copy.vue';
import Arrow from './Arrow.vue';
import Modal from './Modal.vue';
import {Tab, Tabs} from './Tabs';
import IntegrationInfo from './IntegrationInfo.vue';
import Status from './Status.vue';
import InputStatus from './InputStatus.vue';
import SimpleAccordion from './SimpleAccordion.vue';
import CustomModal from './custom-modal.vue';

// Register components globally
Vue.component('spin', Spin);
Vue.component('banner', Banner);
Vue.component('empty', Empty);
Vue.component('service-image', ServiceImage);
Vue.component('progressbar', ProgressBar);
Vue.component('copy', Copy);
Vue.component('arrow', Arrow);
Vue.component('modal', Modal);

Vue.component('tab', Tab);
Vue.component('tabs', Tabs);

Vue.component('integration-info', IntegrationInfo);
Vue.component('status', Status);
Vue.component('input-status', InputStatus);

Vue.component('simple-accordion', SimpleAccordion);
Vue.component('custom-modal', CustomModal);
