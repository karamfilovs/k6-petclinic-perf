import { check, group } from 'k6'
import http from 'k6/http'


export let options = {
    thresholds: {
        'http_req_duration{type:slow}': ['p(95)<300'], // threshold on API requests only
        'http_req_duration{type:api}': ['p(95)<200'], // threshold on search api only
      },
};

const basicAuthToken = "Basic YWRtaW46YWRtaW4="
const baseUrl = "http://localhost:9966/petclinic/api"
const params = { headers: { 'Content-Type': 'application/json', "Authorization": basicAuthToken }, tags: {type: 'api'} };

export default function () {
    group('get all pets', function () {
        //Get all pets
        let res = http.get(baseUrl + "/pets", params)
        check(res, {
            'Get pet status code is 200': (r) => r.status == 200,
            'Body includes animal names': (r) => r.body.includes('Leo')
        });
    });

    group('create new owner and get it', function () {
        //Create owner
        let data = JSON.stringify({
            address: "Ivan Stranski",
            city: "Sofia",
            firstName: "Alex" + Math.random(),
            lastName: "Karamfilov",
            telephone: "0888823232"
        });
        let res = http.post(baseUrl + "/owners", data, params)
        check(res, {
            'Create owner status code is 201': (r) => r.status == 201,
            'Create owner body includes name of the owner': (r) => r.body.includes('Alex')
        });

        //Get owner
        let ownerId = JSON.parse(res.body).id
        let getRes = http.get(`${baseUrl}/owners/${ownerId}`, params)
        check(getRes, {
            'Get owner status code is 200': (r) => r.status == 200,
            'Get owner body includes name of the owner': (r) => r.body.includes('Alex')
        });
    });

    group('Create and delete vet', function () {
        //Create vet
        let data = JSON.stringify({
            firstName: "Alex" + Math.random(),
            lastName: "Stranski"

        });
        let createResponse = http.post(`${baseUrl}/vets`, data, params)
        check(createResponse, {
            'Create vet status code is 201': (r) => r.status == 201,
            'Create vet body includes name of the vet': (r) => r.body.includes('Alex')
        });

        //Delete vet
        let vetId = JSON.parse(createResponse.body).id;
        let deleteResponse = http.del(`${baseUrl}/vets/${vetId}`, params)
        check(deleteResponse, {
            'Delete vet status code is 204': (r) => r.status == 204,
        });

    })

    group('Get owner by name', function(){
        //Get owner by name
        let lastName = 'Davis';
        params.tags = {type: 'slow'}
        let getOwner = http.get(`${baseUrl}/owners/*/lastname/${lastName}`, params)
        check(getOwner, {
            'Get owner by last name status code is 200': (r) => r.status == 200,
            'Get owners by last name body includes name of the owner': (r) => r.body.includes(lastName)
        });

    })

}

