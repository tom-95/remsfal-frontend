<script lang="ts">
import axios from 'axios'
import BlockchainService  from "@/services/BlockchainService";
//import AuthenticationService  from "@/services/AuthenticationService";

export default {
  data() {
    return {
      amountField: '',
      senderField: '',
      receiverField: '',
      payments: []
    }
  },
  blockchainService: null,
  created() {
    console.log("payments")
    //this.blockchainService = new BlockchainService();
    //this.senderField = AuthenticationService.getInstance().getUserEmail();
    this.getAllPayments();
    //console.log(this.payments);
  },
  methods: {
      executePayment() {
          //this.blockchainService.createAsset(this.amountField, this.purposeField);
          //this.getAllPayments();
          const data = {"sender": "Tom", "receiver": this.receiverField, "amount": this.amountField}
          axios.post('http://localhost:8080/api/transaction', data)
          .then((response) => {
          this.receiverField = ''
          this.amountField = ''
          this.getAllPayments()
          // eslint-disable-next-line node/handle-callback-err
        }, (error) => {
          console.log('Could not send transaction!')
        })
      },
      getAllPayments() {
          //const blockchain = this.blockchainservice.getPayments();
          //var blockchain = null
          axios.get('http://localhost:8080/api/blockchain')
          .then(response => (this.payments=response.data), 
          (error) => {
          console.log('Could not receive transactions!')
        })
          //blockchain.forEach(function(block) {
          //    this.payments.push(block)
          //});
      }

  }
}
</script>

<template>
  <main style="text-align:center">
    <br>
    <br>
    <div>
      <h1>You can create a new payment and view existing payments.</h1>
      <p><input v-model="receiverField" placeholder="Enter receiver">
      <input v-model="amountField" placeholder="Enter amount in €"></p>
      <Button @click="executePayment" label="Zahlung durchführen" icon="pi pi-plus" iconPos="left"/>
    </div>
    <div>
      <table>
          <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{payment.transactions[0].receiver}}</td>
            <td>{{payment.transactions[0].amount}}</td>
          </tr>
          </tbody>
        </table>
    </div>
  </main>
</template>

<style>
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>
