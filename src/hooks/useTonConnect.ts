import { THEME, TonConnectUI, type WalletsModalState } from "@tonconnect/ui";
import { Address, type Sender, type SenderArguments } from "@ton/core";

export function useTonConnect() {
  const tonConnectUI = new TonConnectUI({
    manifestUrl:
      "https://raw.githubusercontent.com/Amir23714/ProjectConfigurations/main/RaffleContract_v1.0.0/manifest.json",
    buttonRootId: "tonconnect_but",
  });

  tonConnectUI.uiOptions = {
    language: "en",
    uiPreferences: {
      theme: THEME.DARK,
    },
  };

  return {
    tonConnectUI,
  };
}

export function subscribeTonConnectChanges(
  tonConnectUI: TonConnectUI,
  connectionStatus: any,
  isOwner: any,
  userWallet: any,
  owner_address: any
) {
  const unsubscribe = tonConnectUI.onStatusChange((walletAndwalletInfo) => {
    // update state/reactive variables to show updates in the ui
    connectionStatus.value = tonConnectUI.connected;
    userWallet.value = walletAndwalletInfo;

    if (walletAndwalletInfo != null) {
      const userAddress: string = Address.parse(
        walletAndwalletInfo.account.address
      ).toString();
      const ownerAddress: string = Address.parse(
        owner_address.value
      ).toString();

      if (userAddress === ownerAddress) {
        isOwner.value = true;
      } else {
        isOwner.value = false;
      }
    } else {
      isOwner.value = false;
    }

    console.log("Wallet and wallet info ", walletAndwalletInfo);
    console.log("State changed ", connectionStatus.value);
  });

  return { unsubscribe };
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
