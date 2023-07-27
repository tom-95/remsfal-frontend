<script lang="ts">
import axios from 'axios'
import LineChart from '@/components/LineChart.vue'

export default {
  components: { LineChart },
  data() {
    return {
      amountField: '',
      receiverField: '',
      purposeField: '',
      payments: [],
      chartData: {
        labels: [],
        datasets: [ { label: 'Kontostand in €', data: [] } ]
      },
    }
  },

  created() {
    console.info("payments")
    this.getAllBalances()
  },

  methods: {

      executePayment() {

          const data = {"sender": "Tom", "receiver": this.receiverField, "purpose": this.purposeField, "amount": this.amountField}
          axios.post('http://localhost:8080/api/hyperledger/transaction', data)
          .then((response) => {
          this.receiverField = ''
          this.amountField = ''
          this.purposeField = ''
          this.getAllBalances()
        }, (error) => {
          console.log('Could not send transaction!')
        })
      },

      getAllBalances() {

          axios.get('http://localhost:8080/api/hyperledger/transactions')
          .then((response) => {
            this.payments=response.data
          }, 
          (error) => {
          console.log('Could not receive payments!')
        })
        axios.get('http://localhost:8080/api/hyperledger/history/tom')
          .then((response) => {
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
      },

      getDateFromId(id) {

        const milliseconds = parseInt(id.replace("transfer", ""));

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
      <br>
      <h1>Neue Zahlung</h1>
      <p><input v-model="receiverField" placeholder="Empfänger">
      <span class="tab"></span>
      <input v-model="amountField" placeholder="Betrag in €">
      <span class="tab"></span>
      <input v-model="purposeField" placeholder="Verwendungszweck">
      <span class="tab"></span>
      <Button @click="executePayment" label="Zahlung durchführen" icon="pi pi-plus" iconPos="left"/></p>
      <br>
      <h1>Frühere Zahlungen</h1>
    </div>
    <div class="tabelle">
      <table>
          <tbody>
          <tr v-for="payment in payments" :key="payment.ID">
            <td>{{this.getDateFromId(payment.ID)}}</td>
            <span class="tab"></span>
            <td>Sender: {{payment.Sender}}</td>
            <span class="tab"></span>
            <td>Empfänger: {{payment.Receiver}}</td>
            <span class="tab"></span>
            <td>Verwendungszweck: {{payment.Purpose}}</td>
            <span class="tab"></span>
            <td>Betrag: {{payment.Amount}}€</td>
          </tr>
          </tbody>
        </table>
        <br>
      </div>
    <div>
      <br>
      <h1>Kontostand</h1>
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
.tabelle {
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab {
    display: inline-block;
    margin-left: 5px;
}
</style>
