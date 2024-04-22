<script setup>
import { getStaticData, getDynamicData } from "./hooks/useRaffleContract";
import { ref, onMounted, onUnmounted, reactive, toRaw } from "vue";
import {
  useTonConnect,
  subscribeTonConnectChanges,
} from "./hooks/useTonConnect";

function setData(reference, data) {
  reference.value = data;
}

// Global variables

// Static data
const ton_connect = ref(null);
const unsubscribe = ref(null);
const owner_address = ref(null);
const contract_address = ref(null);
let intervalId = null;
const isLoading = ref(false);

// Dynamic data
const connectionStatus = ref(false);
const recent_winner = ref(null);
const contract_balance = ref(null);
const current_participants = ref(null);
const sendDeposit = ref(null);
const sendWithdraw = ref(null);
const sendStartRaffleProcess = ref(null);
const userWallet = ref(null);
const isOwner = ref(false);

onMounted(async () => {
  // Get and set owner address
  const staticData = await getStaticData();
  setData(owner_address, staticData.owner_address);
  setData(contract_address, staticData.contract_address);

  // Get and set TonConnectUI
  const { tonConnectUI } = useTonConnect();
  setData(ton_connect, reactive(tonConnectUI));

  // Subscribe to TonConnect changes
  const { unsubscribe: unsubscribeValue } = subscribeTonConnectChanges(
    ton_connect.value,
    connectionStatus,
    isOwner,
    userWallet,
    owner_address
  );
  setData(unsubscribe, unsubscribeValue);

  // Get and set dynamic data
  const updateData = async () => {
    setData(isLoading, true);
    const dynamic_data = await getDynamicData(ton_connect.value);

    setData(recent_winner, dynamic_data.recent_winner);
    setData(contract_balance, dynamic_data.contract_balance);
    setData(current_participants, dynamic_data.current_participants);
    setData(sendDeposit, dynamic_data.sendDeposit);
    setData(sendWithdraw, dynamic_data.sendWithdraw);
    setData(sendStartRaffleProcess, dynamic_data.sendStartRaffleProcess);
    setData(isLoading, false);
  };
  await updateData();

  // Start updating dynamic data every 5 seconds
  intervalId = setInterval(updateData, 5000);
});

onUnmounted(() => {
  // Stop updating when the component is unmounted
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <Upline />
  <Header />
  <div class="main_wrapper">
    <p>Contract Address: {{ contract_address }}</p>
    <p>Contract owner: {{ owner_address }}</p>
    <p>
      Contract balance: {{ contract_balance }} TON
      <span v-if="isLoading">| Loading...</span>
    </p>
    <p>
      Current participants: {{ current_participants }}
      <span v-if="isLoading">| Loading...</span>
    </p>
    <p>
      Recent winner: {{ recent_winner }}
      <span v-if="isLoading">| Loading...</span>
    </p>

    <div class="action_options">
      <a v-if="connectionStatus" @click="sendDeposit">Participate in raffle</a>
      <a v-if="connectionStatus && isOwner" @click="sendWithdraw">Withdraw</a>
      <a v-if="connectionStatus && isOwner" @click="sendStartRaffleProcess"
        >Start raffle</a
      >
    </div>
  </div>
</template>

<style scoped>
.action_options {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
