<script>
import { getStaticData, getDynamicData } from "./hooks/useRaffleContract";
import { ref, onMounted, onUnmounted, reactive } from "vue";

export default {
  name: "MainApp",
  setup() {
    const data = ref({
      ton_connect: null,
      owner_address: null,
      contract_balance: null,
      current_participants: null,
      recent_winner: null,
      unsubscribeModal: null,
      WalletConnected: null,
    });

    let intervalId = null;
    let walletInterval = null;

    onMounted(async () => {
      const static_data_response = await getStaticData();

      data.value.ton_connect = reactive(static_data_response.ton_connect);
      data.value.owner_address = static_data_response.owner_address;
      data.value.unsubscribeModal = static_data_response.unsubscribeModal;

      const updateWalletConnection = async () => {
        data.value.WalletConnected = data.value.ton_connect.connected;
      };
      await updateWalletConnection();

      const updateData = async () => {
        const dynamic_data_response = await getDynamicData();

        data.value.contract_balance = dynamic_data_response.contract_balance;
        data.value.current_participants =
          dynamic_data_response.current_participants;
        data.value.recent_winner = dynamic_data_response.recent_winner;
      };

      await updateData();
      intervalId = setInterval(updateData, 5000);
      walletInterval = setInterval(updateWalletConnection, 500);
    });

    onUnmounted(() => {
      // Clear the interval when the component is unmounted
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return data.value;
  },
};
</script>

<template>
  <Upline />
  <Header />
  <div class="main_wrapper">
    <p>Contract owner: {{ owner_address }}</p>
    <p>Contract balance: {{ contract_balance }} TON</p>
    <p>Current participants: {{ current_participants }}</p>
    <p>Recent winner: {{ recent_winner }}</p>

    <p v-if="WalletConnected">Wallet is connected</p>
  </div>
</template>

<style scoped></style>
