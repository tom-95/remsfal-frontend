<script lang="ts">
import axios from 'axios'

export default {
  
  data() {
    return {
      amountField: '',
      receiverField: '',
      balances: []
    }
  },

  created() {
    console.info("payments")
    this.getAllBalances()
  },

  methods: {

      executePayment() {

          const data = {"sender": "Tom", "receiver": this.receiverField, "amount": this.amountField}
          axios.post('http://localhost:8080/api/hyperledger/transaction', data)
          .then((response) => {
          this.receiverField = ''
          this.amountField = ''
          this.getAllBalances()
        }, (error) => {
          console.log('Could not send transaction!')
        })
      },

      getAllBalances() {

          axios.get('http://localhost:8080/api/hyperledger/history')
          .then((response) => {
            this.balances=response.data
          }, 
          (error) => {
          console.log('Could not receive balances!')
        })
      },

      getDate(timestamp) {
        const seconds = timestamp.seconds;
        const nanoseconds = timestamp.nanos;

        const milliseconds = seconds * 1000 + nanoseconds / 1000000;

        const date = new Date(milliseconds);

        const formattedDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        
        return formattedDate
      }

  }
}
</script>

<template>
  <main style="text-align:center">
    <br>
    <br>
    <div>
      <h1>Du kannst eine neue Zahlung durchführen und den Verlauf des Kontostandes ansehen.</h1>
      <p><input v-model="receiverField" placeholder="Empfänger">
      <input v-model="amountField" placeholder="Betrag in €"></p>
      <Button @click="executePayment" label="Zahlung durchführen" icon="pi pi-plus" iconPos="left"/>
    </div>
    <div>
      <table>
          <tbody>
          <tr v-for="balance in balances" :key="balance.TxId">
            <td>{{getDate(balance.Timestamp)}}</td>
            <td>{{balance.Value.Balance}}</td>
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
