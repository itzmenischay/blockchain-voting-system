import CryptoJS from "crypto-js";

export const generateVoteHash = (candidate, walletAddress) => {
  const nonce = Date.now().toString();

  const data = `${candidate}-${walletAddress}-${nonce}`;
  const hash = CryptoJS.SHA256(data).toString();

  return { hash, nonce };
};
