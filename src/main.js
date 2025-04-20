import { createApp } from 'vue' //function that initializes a new Vue application instance
import App from './App.vue'  //  imports the root Vue component (App.vue) 
import PrimeVue from 'primevue/config' // Imports PrimeVue

import 'primevue/resources/themes/lara-light-indigo/theme.css' // Imports theme
import 'primevue/resources/primevue.min.css' // Imports  core CSS
import 'primeicons/primeicons.css' //Imports  icons
import 'primeflex/primeflex.css' //Imports  PrimeFlex for layout utilities
import ToastCompoenent from 'primevue/toast';
import ToastService from 'primevue/toastservice'



const app = createApp(App) //it creates the root application instance
app.use(PrimeVue) // registering PrimeVue
app.use(ToastService); // registering Toast
app.component('ToastCompoenent', ToastCompoenent);


app.mount('#app')  // Mounts the app to the DOM element with id "app"

