import axios from "axios";

const API_URL= "http://localhost:50717/api/";

export default Object.freeze({
    queries: {
        getAll: function(){
            return axios.get(API_URL + "requests/GetAllOpened")
                .then(res => res.data)
        },
        takeInWork: function (consultantId, requestId) {
            return axios.post(API_URL + "requests/TakeInWork/" + consultantId + "/" + requestId)
                .then(res => res.data)
        },
        completeWork: function (consultantId, requestId) {
            return axios.post(API_URL + "requests/ToComplete/" + consultantId + "/" + requestId)
                .then(res => res.data)
        }
    },
    login:{
        userLogin: function(name){
            return axios.post(API_URL + "consultant/login/" + name)
                .then(res => res.data)
        }
    }
})
