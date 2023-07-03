import axios from 'axios'

export default class BlockchainService {

    getPayments() {
        return axios
            .get('http://localhost:8080/api/blockchain')
            .then((response) => console.log(response))
    }
}