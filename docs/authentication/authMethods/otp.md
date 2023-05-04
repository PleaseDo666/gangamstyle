# SMS / Email Verification

sms / otp verification is supported as an `Authentication Method` for obtaining either an `Auth Signature` or `Session Signature`.

# Technical Details

Through the `lit-auth-client` verification codes are able to be sent, and confirmed against the end users `OTP` code. Upon successful code confirmation, a `JWT` is generated which is verified when obtaining an `Auth Signature` or `Session Signature`. When registering OTP as an`Authentication Method` the `user id` will be either the email or phone number, provided by the user. This allows users to enter their information a minmal amount of times, and be looked up in later requests. When registering new `Authentication Methods` you may do so through
- `Smart Contracts` directly
- Using the `contract-sdk`
- Interface with our `Relay Server`

The Lit Relay server is able to verify generated tokens to either mint a new Key Pair, or query existing key pairs associated with a given `user id` handling gas fees, and contract interfacing for you, behind a consumable rest  API. for access to our Relayer, see here // add relayer link.

