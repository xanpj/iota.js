// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { ISigLockedDustAllowanceOutput, SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE } from "../models/ISigLockedDustAllowanceOutput";
import { ISigLockedSingleOutput, SIG_LOCKED_SINGLE_OUTPUT_TYPE } from "../models/ISigLockedSingleOutput";
import { ITypeBase } from "../models/ITypeBase";
import { ReadStream } from "../utils/readStream";
import { WriteStream } from "../utils/writeStream";
import { deserializeAddress, MIN_ADDRESS_LENGTH, MIN_ED25519_ADDRESS_LENGTH, serializeAddress } from "./address";
import { SMALL_TYPE_LENGTH } from "./common";

/**
 * The minimum length of an output binary representation.
 */
export const MIN_OUTPUT_LENGTH: number = SMALL_TYPE_LENGTH;

/**
 * The minimum length of a sig locked single output binary representation.
 */
export const MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH: number =
    MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;

/**
 * The minimum length of a sig locked dust allowance output binary representation.
 */
export const MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH: number =
MIN_OUTPUT_LENGTH + MIN_ADDRESS_LENGTH + MIN_ED25519_ADDRESS_LENGTH;

/**
 * The maximum number of outputs.
 */
export const MAX_OUTPUT_COUNT: number = 127;

/**
 * Deserialize the outputs from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeOutputs(readStream: ReadStream): (ISigLockedSingleOutput | ISigLockedDustAllowanceOutput)[] {
    const numOutputs = readStream.readUInt16("outputs.numOutputs");

    const inputs: (ISigLockedSingleOutput | ISigLockedDustAllowanceOutput)[] = [];
    for (let i = 0; i < numOutputs; i++) {
        inputs.push(deserializeOutput(readStream));
    }

    return inputs;
}

/**
 * Serialize the outputs to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
export function serializeOutputs(writeStream: WriteStream,
    objects: (ISigLockedSingleOutput | ISigLockedDustAllowanceOutput)[]): void {
    if (objects.length > MAX_OUTPUT_COUNT) {
        throw new Error(`The maximum number of outputs is ${MAX_OUTPUT_COUNT}, you have provided ${objects.length}`);
    }

    writeStream.writeUInt16("outputs.numOutputs", objects.length);

    for (let i = 0; i < objects.length; i++) {
        serializeOutput(writeStream, objects[i]);
    }
}

/**
 * Deserialize the output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeOutput(readStream: ReadStream): (ISigLockedSingleOutput | ISigLockedDustAllowanceOutput) {
    if (!readStream.hasRemaining(MIN_OUTPUT_LENGTH)) {
        throw new Error(`Output data is ${readStream.length()
            } in length which is less than the minimimum size required of ${MIN_OUTPUT_LENGTH}`);
    }

    const type = readStream.readByte("output.type", false);
    let input;

    if (type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        input = deserializeSigLockedSingleOutput(readStream);
    } else if (type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        input = deserializeSigLockedDustAllowanceOutput(readStream);
    } else {
        throw new Error(`Unrecognized output type ${type}`);
    }

    return input;
}

/**
 * Serialize the output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeOutput(writeStream: WriteStream,
    object: ISigLockedSingleOutput | ISigLockedDustAllowanceOutput): void {
    if (object.type === SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        serializeSigLockedSingleOutput(writeStream, object);
    } else if (object.type === SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        serializeSigLockedDustAllowanceOutput(writeStream, object);
    } else {
        throw new Error(`Unrecognized output type ${(object as ITypeBase<unknown>).type}`);
    }
}

/**
 * Deserialize the signature locked single output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSigLockedSingleOutput(readStream: ReadStream): ISigLockedSingleOutput {
    if (!readStream.hasRemaining(MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH)) {
        throw new Error(`Signature Locked Single Output data is ${readStream.length()
            } in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_SINGLE_OUTPUT_LENGTH}`);
    }

    const type = readStream.readByte("sigLockedSingleOutput.type");
    if (type !== SIG_LOCKED_SINGLE_OUTPUT_TYPE) {
        throw new Error(`Type mismatch in sigLockedSingleOutput ${type}`);
    }

    const address = deserializeAddress(readStream);
    const amount = readStream.readUInt64("sigLockedSingleOutput.amount");

    return {
        type: SIG_LOCKED_SINGLE_OUTPUT_TYPE,
        address,
        amount: Number(amount)
    };
}

/**
 * Serialize the signature locked single output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSigLockedSingleOutput(writeStream: WriteStream,
    object: ISigLockedSingleOutput): void {
    writeStream.writeByte("sigLockedSingleOutput.type", object.type);
    serializeAddress(writeStream, object.address);
    writeStream.writeUInt64("sigLockedSingleOutput.amount", BigInt(object.amount));
}

/**
 * Deserialize the signature locked dust allowance output from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeSigLockedDustAllowanceOutput(readStream: ReadStream): ISigLockedDustAllowanceOutput {
    if (!readStream.hasRemaining(MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH)) {
        throw new Error(`Signature Locked Dust Allowance Output data is ${readStream.length()
            } in length which is less than the minimimum size required of ${MIN_SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_LENGTH
            }`);
    }

    const type = readStream.readByte("sigLockedDustAllowanceOutput.type");
    if (type !== SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE) {
        throw new Error(`Type mismatch in sigLockedDustAllowanceOutput ${type}`);
    }

    const address = deserializeAddress(readStream);
    const amount = readStream.readUInt64("sigLockedDustAllowanceOutput.amount");

    return {
        type: SIG_LOCKED_DUST_ALLOWANCE_OUTPUT_TYPE,
        address,
        amount: Number(amount)
    };
}

/**
 * Serialize the signature locked dust allowance output to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeSigLockedDustAllowanceOutput(writeStream: WriteStream,
    object: ISigLockedDustAllowanceOutput): void {
    writeStream.writeByte("sigLockedDustAllowanceOutput.type", object.type);
    serializeAddress(writeStream, object.address);
    writeStream.writeUInt64("sigLockedDustAllowanceOutput.amount", BigInt(object.amount));
}