---
sidebar_position: 1
---

# Externally-Owned Account

An externally-owned account (EOA) is essentially a blockchain wallet that is controlled by anyone in possession of the private key. The Lit JS SDK V2 `checkAndSignAuthMessage()` function provides a convenient way to obtain an `AuthSig` from an EOA.

## `checkAndSignAuthMessage`

```js
import { checkAndSignAuthMessage } from '@lit-protocol/lit-node-client';

const authSig = await checkAndSignAuthMessage({
  chain: "ethereum",
});
```

When called, `checkAndSignAuthMessage` triggers a wallet selection popup in the user's browser. The user is then asked to sign a message, confirming ownership of their crypto address. The signature of the signed message is returned as the `authSig` variable.

The function also stores the `AuthSig` in local storage, removing the need for the user to sign the message again. However, if the signature expires or becomes too old, the user may be prompted to sign the message again.

`checkAndSignAuthMessage` checks the currently selected chain in the user's wallet. If user's wallet supports it, the function sends a request to the user's wallet to change to the chain specified in the `checkAndSignAuthMessage()` function call. This ensures that the user is interacting with the correct blockchain network.

## `signAndSaveAuthMessage`

## Clearing the stored `AuthSig`

If you want to clear the `AuthSig` stored in local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).