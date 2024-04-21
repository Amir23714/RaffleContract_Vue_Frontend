import { TonConnectUI, type WalletsModalState } from "@tonconnect/ui";
import type { Sender, SenderArguments } from "@ton/core";

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

export function getSenderTonConnect(tonConnectUI: TonConnectUI): {
  sender: Sender;
} {
  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
  };
}
