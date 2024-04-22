import { RaffleContract } from "@/contracts/RaffleContract";
import { getSenderTonConnect } from "../hooks/useTonConnect";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import { Address, TonClient, fromNano, toNano } from "@ton/ton";
import type { OpenedContract } from "@ton/ton";
import type { TonConnectUI } from "@tonconnect/ui";

const CONTRACT_ADDRESS: string =
  "EQD5IbH-GtcFVN9m8EsG_bFZzXwAfSKZnQUSwLSSReizCYFb";

export async function getStaticData() {
  const endpoint = await getHttpEndpoint({ network: "testnet" }); // get the decentralized RPC endpoint
  const client = new TonClient({ endpoint });

  const contract_instance = new RaffleContract(Address.parse(CONTRACT_ADDRESS));
  const raffle_contract: OpenedContract<RaffleContract> =
    client.open(contract_instance);

  const owner_address = await raffle_contract.getOwner();

  const data = {
    owner_address: owner_address.owner_address.toString(),
    contract_address: raffle_contract.address.toString(),
  };

  return data;
}

export async function getDynamicData(tonConnectUI: TonConnectUI) {
  const endpoint = await getHttpEndpoint({ network: "testnet" }); // get the decentralized RPC endpoint
  const client = new TonClient({ endpoint });

  const contract_instance = new RaffleContract(Address.parse(CONTRACT_ADDRESS));
  const raffle_contract: OpenedContract<RaffleContract> =
    client.open(contract_instance);

  const recent_winner = await raffle_contract.getRecentWinner();
  const num_participants = await raffle_contract.getNumParticipants();
  const balance = await raffle_contract.getContractBalance();

  const { sender } = getSenderTonConnect(tonConnectUI);

  const data = {
    recent_winner: recent_winner.recent_winner.toString(), // Recent winner address (string)
    current_participants: num_participants.num_participants, // Number of participants (number)
    contract_balance: Number(fromNano(balance.contract_balance)), // Contract balance (number in TONs)
    sender: sender,
    sendDeposit: async () => {
      return raffle_contract?.sendDeposit(sender, toNano(1));
    },
    sendWithdraw: async () => {
      return raffle_contract?.sendWithdraw(sender, toNano(0.01));
    },
    sendStartRaffleProcess: async () => {
      return raffle_contract?.sendStartRaffleProcess(sender, toNano(0.01));
    },
  };

  return data;
}
