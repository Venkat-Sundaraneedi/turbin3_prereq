import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(Uint8Array.from(wallet));

const to = new PublicKey("C1o87uFxxeGCHnguUHc6pg81MRQDWZ88yU6bREKxMjsF");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      }),
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from.publicKey;

    const fee = (await connection.getFeeForMessage(
      transaction.compileMessage(),
      "confirmed",
    )).value || 0;

    transaction.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      }),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [from],
    );
    console.log(
      `Checkout your transaction on https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    );
  } catch (e) {
    console.log(`Opps! something went wrong: ${e}`);
  }
})();
