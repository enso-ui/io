import Vue from 'vue';
import App from '@enso-ui/ui/src/core/app';
import IO from './components/navbar/IO.vue';

Vue.component('navbar-io', IO);
App.registerNavbarItem('navbar-io', 200);
