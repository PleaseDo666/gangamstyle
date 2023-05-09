---
sidebar_position: 1
---

# Wallet Signatures

## AuthSigs

To use Lit Protocol, you must present a wallet signature obtained from the user. This is refered to an as `AuthSig` in the documentation. You can use any EIP 4361 compliant signature (Sign in with Ethereum) for the authSig, but you must put the signature into the AuthSig data structure format (documented [here](https://js-sdk.litprotocol.com/interfaces/types_src.AuthSig.html)). You do not need to use the Lit JS SDK V2 to obtain the signature as long as it's EIP 4361 compliant and in the AuthSig data structure format.

## Format of AuthSig

The AuthSig should match [this format](https://js-sdk.litprotocol.com/interfaces/types_src.AuthSig.html).

An example AuthSig:

```js
{
	"sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
	"derivedVia": "web3.eth.personal.sign",
	"signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
	"address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
}
```

## Obtaining the AuthSig

You can use the built in `checkAndSignAuthMessage()` function to obtain the authSig. For example:

```js
var authSig = await LitJsSdk.checkAndSignAuthMessage({
  chain: "ethereum",
});
```

This will trigger a wallet selection popup on the user's browser. The user will be asked to sign a message proving they own their crypto address. The message will be signed with their crypto address. The signature will be returned to you as the `authSig` variable. You will need to pass this to the Lit Protocol API.

This function will save the AuthSig to local storage so that the user does not need to sign the message again. However, the user may be asked to sign it again if the signature has expired or is too old.

This function will also check the currently selected chain in the user's wallet, and if their wallet supports it, sends a request to their wallet to change to the chain passed into the `checkAndSignAuthMessage()` function. This is to ensure that the user is using the correct chain.

## Account Abstraction EIP1271 signatures

:::note

Currently works only on the `serrano` litNetwork. Coming soon on the `jalapeno` litNetwork.

:::


Currently, Externally-owned accounts (EOA) can interface with Lit via an [**authSig**](/SDK/Explanation/WalletSigs/authSig). With this paradigm, a private key is needed to sign an authSig. Smart contracts generally can not produce an authSig since they don't have a private key. However, this tutorial will show you how to generate an authSig for smart contracts using [EIP1271](https://eips.ethereum.org/EIPS/eip-1271). EIP-1271 is a standard to verify a signature when the account is a smart contract.


### How to structure the AuthSig

The format of the authSig remains the same as noted in the [API docs](https://js-sdk.litprotocol.com/interfaces/types_src.AuthSig.html). 

* **sig** is the actual hex-encoded signature.
* **derivedVia** should be "EIP1271" to tell the nodes that the authSig is for smart contracts
* **signedMessage** is any string that you want to pass to the `isValidSignature(bytes32 _hash, bytes memory _signature)` as its 1st arguement. It will be converted to bytes32 before calling the smart contract function
* **address** of the smart contract you want to present the authSig for. Note that it should implement the `isValidSignature(bytes32 _hash, bytes memory _signature)` function.

For example:

```js
{
	"sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
	"derivedVia": "EIP1271",
	"signedMessage": "_hash message",
	"address": "0x6FdF5aD7f256D9677eC1d6B7e633Ff1E7FA5Ac14"
}
```

Now you can use the above authSig object in the Lit functions just as an any other authSig.

```js
const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
  accessControlConditions,
  symmetricKey,
  authSig,
  chain
})
```

### How it works

The Lit nodes call the `isValidSignature(bytes32 _hash, bytes memory _signature)` function for the contract at the `authSig.address`. Where `bytes32 _hash` is the bytes32 representation of the `authSig.signedMessage` and `authSig.sig` is passed as the `bytes _signature` argument. The authSig is validated based on the returned result of the contract's `isValidSignature` function.

Please read the [EIP1271](https://eips.ethereum.org/EIPS/eip-1271) docs to understand the `isValidSignature` function.

### See it in action!

Below is the complete [**React** project](https://replit.com/@lit/Smart-Contract-Authsig-EIP1271#smart-contract-authsig/src/App.js).

<iframe frameborder="0" width="100%" height="500px" className="repls" style={{display: "none"}} src="https://replit.com/@lit/Smart-Contract-Authsig-EIP1271#smart-contract-authsig/src/App.js"></iframe>

## Clearing the stored AuthSig

If you want to clear the authSig stored in the browser local storage, you can call the [`disconnectWeb3` method](https://js-sdk.litprotocol.com/functions/auth_browser_src.ethConnect.disconnectWeb3.html).

## What happens to the Authsig submitted to the Lit nodes?

When you submit the `authSig` for retrieving the `symmetricKey` using the function `getEncryptionKey` the nodes verify the `authSig` based on the `accessControlConditions` passed along with it:

### accessControlConditions

1. We extract the Ethereum authSig from the passed `authSig` argument since it may contain multiple authSigs.
2. If its a non EIP-1271 authSig:
	1. We verify whether the signature for the `authSig.signedMessage` was produced by `authSig.address`.
	2. If the `authSig.signedMessage` starts with "I am creating an account to use" then check that it contains a timestamp.
	3. Otherwise, we parse it as a SIWE message. We convert the `authSig.sig` into a fixed length of bytes & validate its time constraints. This returns a compressed pubkey. Finally, the authSig is valid if the `authSig.address` equals the keccak256 hash of the pubkey.
3. If its an EIP-1271 authSig:
	1. We get the corresponding web3 provider RPC for the passed chain argument.
	2. Make an EIP-1559 transaction to the `authSig.address` along with the encoded `authSig.signedMessage` & `authSig.sig` as the data.
	3. And return the result of `isValidSignature` function as explained in the above section.
4. Finally, we check whether the result of 2/3 satisfies the given `accessControlConditions` argument. We do this by recursively making RPC chain calls for each condition and comparing their return value against the `returnValueTest.value`.
	1. Eg: Querying the `accessControlConditions.chain` for the ERC721 owner & comparing the result against the `returnValueTest.value` which may `:userAddress` or a specific wallet address.
5. We then return the combined results of all these comparision as per the accessControlConditions' boolean logic.

### evmContractConditions

1. We extract & validate the Ethereum authSig from the passed `authSig` argument just as above (1 - 3).
2. Match the number of parameters of the function's abi with the input parameters.
3. Substitute specials parameters with their actual values. Eg: `:userAddress` with the actual user's address.
4. Tokenize the input parameters & query the given `address` on the provided `chain`.
5. Parse the returned value against the `returnValueTest` object & return if its matched.

### solRpcConditions

1. We extract the Solana authSig from the passed `authSig` argument since it may contain multiple authSigs.
2. Get the ED-25519 public key from the `authSig.address` & use it to verify `authSig.sig` on `authSig.message`.
3. For each condition, first substitute the special params with their actual values & check if PDA is needed.
4. If so, we extract the program address from the `pdaParams` & use it to find a valid PDA and the corresponding bump seed.
5. We then make a Solana RPC call to `getAccountInfo` & parse its response using the `offset` & `fields` values provided in `pdaInterface`. We also ensure that the `pdaInterface.fields` contain the provided `pdaKey`.
6. Finally, we make another Solana RPC call for the given `method` & compare its result with the `returnValueTest.value`.

### unifiedAccessControlCondition

1. We start by extracting all the authSig items from the provided `authSig`. At least one of the following should be present:
	1. Ethereum
	2. Solana
	3. Cosmos
	4. Juno
	5. Kyve
	6. Cheqd
2. If algo is specified then it should only be be ED-25518.
3. Based on the provided `chain` we verify the above authSig items.
	1. Solana: As described in points [1 - 2](#solRpcConditions)
	2. Ethereum: As described in points [1 - 3](#accessControlConditions)
	3. Else for the chains- "cosmos", "kyve", "cheqd" & "juno" we validate the Cosmos authSig as follows:
		1. We start by extracting the `sig` & `signedMessage` from the given `authSig`.
		2. And check for all 4 recovery ids for Cosmos since it chops off the last byte of the V param in `sig`.
		3. Recover the `pubKey` from the above extracted `sig`, `signedMessage` & `recoveryId` (one from the above).
		4. We derive the Cosmos address by first taking the SHA256 hash of the `pubKey` & then taking the ripemd160 hash of it. Prefixing "cosmos" & followed by its bech32 encoding.
		5. Finally, return true if the `authSig.address` matches the above derived address.
4. Then for each control conditions we check whether the `authSig` satisfies the provided condition.
	1. For example, if the `authSig` corresponds to Ethereum then we validate the condition as explained in the [evmContractConditions](#evmContractConditions) section. Similarly for Solana as well.
	2. For Cosmos, we start by substituting the special params by their actual values, eg: `:userAddress`. Then call the Cosmos RPC endpoint & compare it result with the `returnValueTest.value`.
