<script lang="ts">
import axios from 'axios'
import LineChart from '@/components/LineChart.vue'

export default {
  components: { LineChart },
  data() {
    return {
      amountField: '',
      receiverField: '',
      balances: [],
      chartData: {
        labels: [],
        datasets: [ { data: [] } ]
      },
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

          axios.get('http://localhost:8080/api/hyperledger/history/tom')
          .then((response) => {
            //this.balances=response.data
            for (const entry of response.data) {
              this.chartData.labels.unshift(this.formatDate(entry.Timestamp))
              this.chartData.datasets[0].data.unshift(entry.Value.Balance)
            }
          }, 
          (error) => {
          console.log('Could not receive balances!')
        })
      },

      formatDate(timestamp) {
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
      <p>Aktueller Kontostand: {{ chartData.datasets[0].data.at(-1) }}€</p>
      <LineChart v-if="chartData.datasets[0].data.length > 0" :chartData="chartData" />
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
