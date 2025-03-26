import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(Uint8Array.from(wallet));

// Connect to devnet
const connection = new Connection("https://api.devnet.solana.com");

// Convert GitHub username to bytes
const github = Buffer.from("Venkat-Sundaraneedi", "utf8");

// Create provider
const provider = new AnchorProvider(
  connection,
  new Wallet(keypair),
  { commitment: "confirmed" },
);

// Initialize program - CORRECT PARAMETER ORDER
const program: Program<Turbin3Prereq> = new Program(IDL, provider); // Fixed parameter order

const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId,
);

// Enroll
(async () => {
  try {
    const txhash = await program.methods
      .submit(github)
      .accounts({
        signer: keypair.publicKey,
      })
      .signers([
        keypair,
      ])
      .rpc();
    console.log(
      "✅ Successfully enrolled",
      keypair.publicKey.toBase58(),
      "with txhash",
      txhash,
    );
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
