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
    <div class="dev_line">
      <div id="contract_address">
        <p>Contract Address</p>
        <p>{{ contract_address }}</p>
      </div>

      <div id="owner_address">
        <p>Contract Owner</p>
        <p>{{ owner_address }}</p>
      </div>
    </div>

    <div class="status_line">
      <div id="recent_winner">
        <p>Recent winner <span v-if="isLoading" class="loader"></span></p>
        <p>
          {{ recent_winner }}
        </p>
      </div>

      <div id="current_partisipants">
        <p>
          Current participants <span v-if="isLoading" class="loader"></span>
        </p>
        <p>
          {{ current_participants }}
        </p>
      </div>
    </div>

    <!-- <p>
      Contract balance: {{ contract_balance }} TON
      <span v-if="isLoading">| Loading...</span>
    </p> -->

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
.main_wrapper {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-top: 5%;
  width: 100%;

  font-family: "Work Sans", sans-serif;
  font-weight: 900;
  color: white;
  font-size: 1vw;
  text-transform: uppercase;
  text-align: center;
  line-height: 1;

  gap: 50px;
}

.dev_line {
  display: flex;
  flex-direction: row; /* Add this line */
  justify-content: space-between;
  width: 100%;
}

.status_line {
  display: flex;
  flex-direction: row; /* Add this line */
  justify-content: space-between;
  width: 100%;
}

#owner_address {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-right: 10%;
}

#contract_address {
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-left: 10%;
}

#recent_winner {
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-left: 10%;
}

#current_partisipants {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin-right: 19%;
}

.action_options {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #fff;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
