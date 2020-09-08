import axios from "axios";


export default function(API_URL){
    return {
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
    }
}

