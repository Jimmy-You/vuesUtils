export default {
    namespaced:true,
    state: {
        data:[]
    },
    getters: {
        getData(state){
            return state.data
        }
    },
    mutations: {
        GET_DATA(state,data){
            state.data=data
        }
    },
    actions: {
        updateData({commit}){
            
        }
    }
}