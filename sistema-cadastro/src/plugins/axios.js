import Vue from 'vue'
import axios from 'axios'

Vue.use({
    install(Vue) {
        Vue.prototype.$http = axios.create({
            baseURL: "https://cadastro-clientes-bdt-default-rtdb.firebaseio.com/",
        })
        Vue.prototype.$http.interceptors.request.use(config=>{
            return config
        })
        Vue.prototype.$http.interceptors.response.use(res=>{
            return res
        })
    }

})

