# Changelog

## v1.5.0-alpha.2

* High level send, getBalance, getUnspentAddress and getUnspentAddresses functions are now passed accountIndex instead of Bip32 base path, the paths are calculated internally using the default path m/44'/4218'/{accountIndex}'/{isInternal}'/{addressIndex}'
* You can perform a send using a custom addressing processs using sendWithAddressGenerator
* Added generateAccountAddress, generateBip32Address which can be used with sendWithAddressGenerator
* Original Bip32 versions are maintained as getBalanceBip32, getUnspentAddressBip32, getUnspentAddressesBip32
* The addresses example has been expanded to demonstrate the changes to address generation
* Ed25519 Address now takes the public key as parameter to constructor and there are also method name changes publicKeyToAdddress => toAddress and verifyAddress => verify

## v1.5.0-alpha.1

* Initial Release