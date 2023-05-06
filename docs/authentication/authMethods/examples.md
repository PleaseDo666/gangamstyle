# Using Authentication methods in the Auth Client SDK

## Email / SMS examples

When authenticating with email or sms provided otp codes, it is a two step process. First initating a code be sent to a email / phone number, then asserting on the user provided code which will generated a signed Json Web Token if successful. This token will be validated getting a signed Session Signature as the `accessToken` within the returned `Auth Method`.

### Validating user provided codes

'''javascript
const authClient = new LitAuthClient({
    litRelayConfig: {
        relayApiKey: '<your-api-key>',
    }
});

// starting a validation session
let session = authClient.initProvider(ProviderType.Otp,{
            userId: '+1' + transport
});

let status = await session.sendOtpCode();
let authMethod = await session.checkOtpCode("<user entered otp code>");
'''

In the above example the returned `authMethod` may be used when calling 
- `fetchPKPsThroughRelayer`
- `mintPKPThroughRelayer`
