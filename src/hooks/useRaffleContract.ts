import { RaffleContract } from "@/contracts/RaffleContract";
import {
  useTonConnect,
  subscribeTonConnectChanges,
} from "../hooks/useTonConnect";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import { Address, TonClient, fromNano, type OpenedContract } from "@ton/ton";
import { onMounted, onUnmounted, ref } from "vue";

const CONTRACT_ADDRESS: string =
  "EQD5IbH-GtcFVN9m8EsG_bFZzXwAfSKZnQUSwLSSReizCYFb";

export async function getStaticData() {
  const { tonConnectUI } = await useTonConnect();
  const unsubscribeModal = await subscribeTonConnectChanges(tonConnectUI);

  const endpoint = await getHttpEndpoint({ network: "testnet" }); // get the decentralized RPC endpoint
  const client = new TonClient({ endpoint });

  const contract_instance = new RaffleContract(Address.parse(CONTRACT_ADDRESS));
  const raffle_contract: OpenedContract<RaffleContract> =
    client.open(contract_instance);

  const owner_address = await raffle_contract.getOwner();

  const data = {
    ton_connect: tonConnectUI,
    owner_address: owner_address.owner_address.toString(),
    unsubscribeModal: unsubscribeModal, 
  };

  return data;
}

export async function getDynamicData() {
  const endpoint = await getHttpEndpoint({ network: "testnet" }); // get the decentralized RPC endpoint
  const client = new TonClient({ endpoint });

  const contract_instance = new RaffleContract(Address.parse(CONTRACT_ADDRESS));
  const raffle_contract: OpenedContract<RaffleContract> =
    client.open(contract_instance);

  const recent_winner = await raffle_contract.getRecentWinner();
  const num_participants = await raffle_contract.getNumParticipants();
  const balance = await raffle_contract.getContractBalance();

  const data = {
    recent_winner: recent_winner.recent_winner.toString(),
    current_participants: num_participants.num_participants,
    contract_balance: Number(fromNano(balance.contract_balance)),
    // sendDeposit: async () => {
    //   return raffle_contract.sendDeposit(sender, toNano(1));
    // },
    // sendWithdraw: async () => {
    //   return raffle_contract.sendWithdraw(sender, toNano(0.01));
    // },
    // sendStartRaffleProcess: async () => {
    //   return raffle_contract.sendStartRaffleProcess(sender, toNano(0.01));
    // },
  };

  return data;
}
