import { onMounted, ref } from "vue";
import { TonConnectUI, type WalletsModalState } from "@tonconnect/ui";
import { toNano, type Address } from "@ton/core";

export async function useTonConnect() {
  const tonConnectUI = new TonConnectUI({
    manifestUrl:
      "https://raw.githubusercontent.com/Amir23714/ProjectConfigurations/main/RaffleContract_v1.0.0/manifest.json",
    buttonRootId: "tonconnect_but",
  });

  return {
    tonConnectUI,
  };
}

export async function subscribeTonConnectChanges(tonConnectUI: TonConnectUI) {
  const unsubscribeModal = tonConnectUI.onModalStateChange(
    (state: WalletsModalState) => {
      // update state/reactive variables to show updates in the ui
      // state.status will be 'opened' or 'closed'
      // if state.status is 'closed', you can check state.closeReason to find out the reason
    }
  );

  return unsubscribeModal;
}

export async function sendTransaction(
  tonConnectUI: TonConnectUI,
  to_: string,
  toncoins_amount: number
) {
  const transaction = {
    validUntil: 60 * 60, // valid for 1 hour
    messages: [
      {
        address: to_, // destination address
        amount: toNano(toncoins_amount).toString(), //Toncoin in nanotons
      },
    ],
  };

  const result = await tonConnectUI.sendTransaction(transaction);
}
