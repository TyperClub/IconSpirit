import {install} from '@icon-park/vue-next/es/all';
import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'

const app = createApp(App) // 创建实例

app.use(router)
app.use(ElementPlus)

// Install
install(app); // use default prefix 'icon', eg: icon is People, name is icon-people.

app.mount('#app');