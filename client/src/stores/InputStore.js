import { defineStore } from "pinia";
export const useInputStore = defineStore("InputStore", {
    state : () => {
        return {
            inputContext : "default",
            inputTarget: null,
            inputData: null,
        }
    },

    actions:{
        setContext(context){
            this.inputContext = context;
        },
        setTarget(target){
            this.inputTarget = target;
        },
        setInputData(data){
            this.inputData = data;
        },
        get(){
            return { context : this.inputContext, target: this.inputTarget, data: this.inputData };
        }
    }

    //getters
})
