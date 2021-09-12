import Vue from "vue";
import Vuex from "vuex";
import jwtDecode from "jwt-decode";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        token: null,
        token_expire_at: null
    },
    mutations: {
        setToken: (state, token) => {
            state.token = token;
            const decoded = jwtDecode<any>(token);
            state.token_expire_at = decoded.exp;
            state.user = decoded;
            localStorage.setItem('token', token);
        }
    },
    getters: {
        isLogged: (state: any) => {
            return state.token != null && (state.token_expire_at == null || (state.token_expire_at * 1000) > new Date().getTime());
        },
        getToken: (state) => {
            return state.token;
        }
    }
});