"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const iota_js_1 = require("@iota/iota.js");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Base");
        // Generate a random mnenomic.
        const randomMnemonic = iota_js_1.Bip39.randomMnemonic();
        console.log("\tMnenomic:", randomMnemonic);
        // Generate the seed from the mnenomic
        const baseSeed = iota_js_1.Ed25519Seed.fromMnemonic(randomMnemonic);
        console.log("\tSeed", iota_js_1.Converter.bytesToHex(baseSeed.toBytes()));
        // Seed has public and private key
        const baseSeedKeyPair = baseSeed.keyPair();
        console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(baseSeedKeyPair.privateKey));
        console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(baseSeedKeyPair.publicKey));
        // Get the address for the seed which is actually the Blake2b.sum256 of the public key
        // display it in both Ed25519 and Bech 32 format
        const baseEd25519Address = new iota_js_1.Ed25519Address(baseSeedKeyPair.publicKey);
        const basePublicKeyAddress = baseEd25519Address.toAddress();
        console.log("\tPublic Key Address Ed25519", iota_js_1.Converter.bytesToHex(basePublicKeyAddress));
        console.log("\tPublic Key Address Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, basePublicKeyAddress));
        console.log();
        // Now generate some additional addresses using Bip32 and the default wallet path
        const basePath = new iota_js_1.Bip32Path(iota_js_1.DEFAULT_BIP32_ACCOUNT_PATH);
        const accountIndex = 0;
        const isInternal = true;
        for (let addressIndex = 0; addressIndex < 10; addressIndex++) {
            basePath.pushHardened(accountIndex);
            basePath.pushHardened(isInternal ? 1 : 0);
            basePath.pushHardened(addressIndex);
            console.log(`Wallet Index ${basePath.toString()}`);
            // Create a new seed from the base seed using the path
            const indexSeed = baseSeed.generateSeedFromPath(basePath);
            console.log("\tSeed", iota_js_1.Converter.bytesToHex(indexSeed.toBytes()));
            // Get the public and private keys for the path seed
            const indexSeedKeyPair = indexSeed.keyPair();
            console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(indexSeedKeyPair.privateKey));
            console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(indexSeedKeyPair.publicKey));
            // Get the address for the path seed which is actually the Blake2b.sum256 of the public key
            // display it in both Ed25519 and Bech 32 format
            const indexEd25519Address = new iota_js_1.Ed25519Address(indexSeedKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            console.log("\tAddress Ed25519", iota_js_1.Converter.bytesToHex(indexPublicKeyAddress));
            console.log("\tAddress Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress));
            console.log();
            basePath.pop();
            basePath.pop();
            basePath.pop();
        }
        // This can also be achieved using the address builders, this will include
        // both internal and external addresses.
        console.log();
        console.log("Generated Addresses using Account Format");
        const addressGeneratorAccountState = {
            seed: baseSeed,
            accountIndex,
            addressIndex: 0,
            isInternal
        };
        for (let i = 0; i < 20; i++) {
            const path = iota_js_1.generateAccountAddress(addressGeneratorAccountState, i === 0);
            console.log(`Wallet Index ${path}`);
            const addressSeed = baseSeed.generateSeedFromPath(new iota_js_1.Bip32Path(path));
            const addressKeyPair = addressSeed.keyPair();
            console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(addressKeyPair.privateKey));
            console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(addressKeyPair.publicKey));
            const indexEd25519Address = new iota_js_1.Ed25519Address(addressKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            console.log("\tAddress Ed25519", iota_js_1.Converter.bytesToHex(indexPublicKeyAddress));
            console.log("\tAddress Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress));
            console.log();
        }
        console.log();
        console.log("Generated Addresses using Bip32 Format");
        const addressGeneratorBip32State = {
            seed: baseSeed,
            addressIndex: 0,
            basePath: new iota_js_1.Bip32Path("m/123'/456'")
        };
        for (let i = 0; i < 10; i++) {
            const path = iota_js_1.generateBip32Address(addressGeneratorBip32State, i === 0);
            console.log(`Wallet Index ${path}`);
            const addressSeed = baseSeed.generateSeedFromPath(new iota_js_1.Bip32Path(path));
            const addressKeyPair = addressSeed.keyPair();
            console.log("\tPrivate Key", iota_js_1.Converter.bytesToHex(addressKeyPair.privateKey));
            console.log("\tPublic Key", iota_js_1.Converter.bytesToHex(addressKeyPair.publicKey));
            const indexEd25519Address = new iota_js_1.Ed25519Address(addressKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            console.log("\tAddress Ed25519", iota_js_1.Converter.bytesToHex(indexPublicKeyAddress));
            console.log("\tAddress Bech32", iota_js_1.Bech32Helper.toBech32(iota_js_1.ED25519_ADDRESS_TYPE, indexPublicKeyAddress));
            console.log();
        }
    });
}
run()
    .then(() => console.log("Done"))
    .catch((err) => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBdU07QUFFdk0sU0FBZSxHQUFHOztRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsOEJBQThCO1FBQzlCLE1BQU0sY0FBYyxHQUFHLGVBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUUxQyxzQ0FBc0M7UUFDdEMsTUFBTSxRQUFRLEdBQUcscUJBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsbUJBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoRSxrQ0FBa0M7UUFDbEMsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLG1CQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLG1CQUFTLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRTdFLHNGQUFzRjtRQUN0RixnREFBZ0Q7UUFDaEQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHdCQUFjLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sb0JBQW9CLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDNUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxtQkFBUyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFD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