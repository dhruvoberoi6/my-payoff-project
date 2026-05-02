import { encryptData, decryptData, createSignature } from 'offlinepay-core';

export const encryptToken = (data, pin) => {
    return encryptData(data, pin);
};

export const decryptToken = (token, pin) => {
    return decryptData(token, pin);
};

export const generateSignature = (data) => {
    return createSignature(data);
};
