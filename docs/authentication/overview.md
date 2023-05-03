# Overview

To use Lit Protocol, you must generate and present signatures to the Lit nodes in order to authenticate successfully. Authentication can be done in two ways:

## Obtain an `AuthSig`

An auth signature, also referred to as `AuthSig`, is a signature that proves you own a particular public key. An `AuthSig` can be created using any of the currently supported authentication methods:

- Externally-Owned Account
- Smart Contract
- Google OAuth
- Discord OAuth
- WebAuthn Authentication

<br/>

## Generate `SessionSigs`

Once you have obtained an `AuthSig`, you can use it to generate session signatures (`SessionSigs`), which are signatures that are scoped to specific capabilities and resources. For example, you can set up `SessionSigs` to permit only the encryption and decryption of data during a particular time frame.

`SessionSigs` are designed to be ephemeral and limited in scope, allowing for fine-grained control and enabling secure, seamless interactions with any platform integrating Lit.

:::note

`SessionSigs` are heavily in development, and things may change. Be sure to use the latest version of the Lit SDK and connect to the `serrano` testnet.

:::