---
sidebar_position: 2
---

# Session Signatures

## Obtaining the SessionSig

A prerequesite is that you must have a connected LitNodeClient and pass that into the getSessionSigs function.

```javascript
let resourceId = {
  baseUrl: "my-dynamic-content-server.com",
  path: "/this-is-a-path",
  orgId: "",
  role: "",
  extraData: "",
};

let hashedResourceId = await LitJsSdk.hashResourceIdForSigning(
  resourceId
);

var sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litSigningCondition://${hashedResourceId}`],
});
```

Once obtained, you can replace where you provide `authSig` with the new `sessionSigs` object. Below are some examples.

### Making Signing Requests

```javascript
var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// Saving signing condition
await litNodeClient.saveSigningCondition({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
  chain: "litSessionSign",
});

// Retrieving a signature
let jwt = await litNodeClient.getSignedToken({
  unifiedAccessControlConditions,
  sessionSigs,
  resourceId,
});
```

### Making Encryption Requests

```javascript
// storing the key
var sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litEncryptionCondition://*`],
});

var unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain: "ethereum",
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

// encrypt
const { encryptedZip, symmetricKey } =
  await LitJsSdk.zipAndEncryptString("this is a secret message");

// store the decryption conditions
const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
  unifiedAccessControlConditions,
  symmetricKey,
  sessionSigs,
});

// retrieving the key:
const hashOfKey = await LitJsSdk.hashEncryptionKey({
  encryptedSymmetricKey,
});

sessionSigs = await LitJsSdk.getSessionSigs({
  chain: "ethereum",
  litNodeClient,
  resources: [`litEncryptionCondition://${hashOfKey}`],
});

 const retrievedSymmKey = await litNodeClient.getEncryptionKey({
  unifiedAccessControlConditions,
  toDecrypt: LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  ),
  sessionSigs,
});

const decryptedFiles = await LitJsSdk.decryptZip(
  encryptedZip,
  retrievedSymmKey
);
const decryptedString = await decryptedFiles["string.txt"].async(
  "text"
);
console.log("decrypted string", decryptedString);
```

## Obtaining the SessionSig in NodeJS

You can use any wallet or signing method with session signatures because the `getSessionSigs()` function supports passing a callback called `authNeededCallback` that will be fired when a wallet signature is needed. You can see an example of this here: https://github.com/LIT-Protocol/js-serverless-function-test/blob/main/js-sdkTests/sessionKeys.js#L31

The `getSessionSigs()` function will generate a session key for you automatically and attempt to store it in LocalStorage. In case you have not polyfilled LocalStorage, you may instead generate the session key yourself using `generateSessionKeyPair()` and store it however you like. You can then pass it to `getSessionSigs()` as the `sessionKey` param.

## Obtaining the SessionSig when user doesn't have a wallet

You can use Oauth login with services including Discord and Google when the user doesn't have a wallet. You can see an example of how to do this using Google Oauth here: https://github.com/LIT-Protocol/oauth-pkp-signup-example/blob/main/src/App.tsx#L50

## Clearing the stored session key and signature

If you want to clear the session key stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## Resources you can request

You can pass an array of resources to the `getSessionSigs()` function, which will be presented to the user in the SIWE message. Resources are things the signature is permitted to be used for. These can be specific items, such as the ID of an encryption condition, or they can be wildcards. The default is all resources with wildcards. The resources are strings that follow the format `lit<conditionType>://<resourceId>`. The conditionType can be either `SigningCondition` or `EncryptionCondition`. The resourceId is a string that uniquely identifies the resource you are requesting access to. For signing conditions, the resourceId is a hash of the resourceId JSON you are requesting access to. For encryption conditions, the resourceId is a hash of the encrypted symmetric key that you are requesting access to.

Since Session keys need the capability to sign on behalf of you and your wallet, you grant them condition types, but with the addition `Capability` at the end. For example, `litSigningConditionCapability://*` will give the session key the capability to sign on your behalf for any signing condition. `litEncryptionConditionCapability://*` will give the session key the capability to sign on your behalf for any encryption condition.

The protocol prefixes of the resources are:

| Resource                        | Protocol Prefix                     | Identifier              | Type                | Usage                                                                                                                                                                                                      |
| ------------------------------- | ----------------------------------- | ----------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encryption Condition            | litEncryptionCondition://           | Encryption condition ID | Restrictive         | Specify which encryption conditions can be processed                                                                                                                                                       |
| Signing Conditions              | litSigningCondition://              | Signing condition ID    | Restrictive         | Specify which signing conditions can be processed                                                                                                                                                          |
| A PKP                           | litPKP://                           | PKP Token ID            | Restrictive         | Specify which PKPs can be used                                                                                                                                                                             |
| A RLI NFT                       | litRLI://                           | RLI Token ID            | Restrictive         | Specify which RLIs can be used                                                                                                                                                                             |
| A Lit Action                    | litAction://                        | Lit Action IFPS ID      | Restrictive         | Specify which Lit Actions can be called                                                                                                                                                                    |
| Encryption Condition Delegation | litEncryptionConditionCapability:// | Encryption condition ID | Granting Capability | Specify which encryption conditions can be processed on behalf of this user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key. |
| Signing Conditions Delegation   | litSigningConditionCapability://    | Signing condition ID    | Granting Capability | Specify which signing conditions can be processed on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.     |
| PKP Delegation                  | litPKPCapability://                 | PKP Token ID            | Granting Capability | Specify which PLPs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| RLI Delegation                  | litRLICapability://                 | RLI TokenID             | Granting Capability | Specify which RLIs can be used on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.                        |
| Lit Action Delegation           | litActionCapability://              | Lit Action IPFS ID      | Granting Capability | Specify which Lit Actions can be called on behalf of the user. Only the key in the URI field of this signature is authorized to actually use this resource. This is typically a session key.               |
|                                 |                                     |                         |                     |                                                                                                                                                                                                            |

