# Email / SMS

When authenticating with email or sms provided otp codes, it is a two step process. First initating a code be sent to a email / phone number, then asserting on the user provided code which will generated a signed Json Web Token if successful. This token will be validated when signing Session Signatures as the `accessToken` within the returned `Auth Method`.

:::note
Codes sent to users via email will be recieved from `noreply@litprotocol.com`. Codes sent to users via sms will include `lit-verification` within the sms message.
:::
### Register user with sms / email auth

```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: 'your-api-key',
    }
});

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: '+1' + transport
});

let status = await session.sendOtpCode();
let authMethod = await session.authenticate({
    code: "user entered otp code"
});
const txHash = await session.mintPKPThroughRelayer(authMethod);
```
:::note

The Lit Relay Server enables you to mint PKPs without worrying about gas fees. You can also use your own relay server or mint PKPs directly using Lit's contracts.

If you are using Lit Relay Server, you will need to request an API key [here](https://forms.gle/RNZYtGYTY9BcD9MEA).

:::

### Minting via Contract

An alternative to minting the PKP NFT via the Lit Relay Server is to send a transaction to the smart contract yourself. You can reference the following example data that is passed to the `mintNextAndAddAuthMethods` method of the `PKPHelper` smart contract:

- `keyType` is `2`
- `permittedAuthMethodTypes` is `[7]`
- `permittedAuthMethodIds` is an array with 1 element being the user's email or phone number.
- `permittedAuthMethodScopes` is an array with 1 zero-initialized element, e.g. `[[ethers.BigNumber.from("0")]]`
- `addPkpEthAddressAsPermittedAddress` is `true`
- `sendPkpToItself` is `true`

### Authetnicating to Fetch PKP information

```javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: 'your-api-key',
    }
});

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: 'user email or phone number'
});

let status = await session.sendOtpCode();
let authMethod = await session.authenticate({
    code: "user entered otp code"
});
const txHash = await session.fetchPKPThroughRelayer(authMethod);
```

:::note 
If the user is using a phone number, the country code must be provided.
:::


## Generating `SessionSigs`

After successfully authenticating with an `AuthMethod`, you can generate `Session Signatures` using the provider's `getSessionSigs` method. The `getSessionSigs` method takes in an `AuthMethod` object, a PKP public key, and other session-specific arguments such as `resourceAbilityRequests` and returns a `SessionSig` object.

```javascript
// Get session signatures for the given PKP public key and auth method
const sessionSigs = await provider.getSessionSigs({
  authMethod: '<AuthMethod object returned from authenticate()>',
  sessionSigsParams: {
    chain: 'ethereum',
    resourceAbilityRequests: [
      resource: litResource,
      ability: LitAbility.AccessControlConditionDecryption
    ],
  },
});
```