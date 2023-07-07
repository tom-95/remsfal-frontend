<script lang="ts">
import axios from 'axios'

export default {
  
  data() {
    return {
      amountField: '',
      receiverField: '',
      purposeField: '',
      payments: []
    }
  },

  created() {
    console.info("payments")
    this.getAllPayments()
  },

  methods: {

      executePayment() {

          const data = {"sender": "Tom", "receiver": this.receiverField, "purpose": this.purposeField, "amount": this.amountField}
          axios.post('http://localhost:8080/api/transaction', data)
          .then((response) => {
          this.receiverField = ''
          this.amountField = ''
          this.purposeField = ''
          this.getAllPayments()
        }, (error) => {
          console.log('Could not send transaction!')
        })
      },

      getAllPayments() {

          axios.get('http://localhost:8080/api/blockchain')
          .then((response) => {
            this.payments=response.data
          }, 
          (error) => {
          console.log('Could not receive payments!')
        })
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
      <input v-model="purposeField" placeholder="Enter purpose of use">
      <input v-model="amountField" placeholder="Enter amount in €"></p>
      <Button @click="executePayment" label="Zahlung durchführen" icon="pi pi-plus" iconPos="left"/>
    </div>
    <div>
      <table>
          <tbody>
          <tr v-for="payment in payments" :key="payment.ID">
            <td>{{payment.Sender}}</td>
            <td>{{payment.Receiver}}</td>
            <td>{{payment.Purpose}}</td>
            <td>{{payment.Amount}}</td>
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
