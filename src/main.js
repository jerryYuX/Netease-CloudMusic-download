import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Aplayer from 'vue-aplayer'

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    components: {
        Aplayer
    },
    render: function (h) {
        return h(App)
    }
}).$mount('#app')
