import bs58 from "bs58";
import * as readline from "readline";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper to prompt user with async/await
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

export function walletToBase58(wallet: Uint8Array | number[]): string {
  const bytes = wallet instanceof Uint8Array ? wallet : new Uint8Array(wallet);
  return bs58.encode(bytes);
}

async function main() {
  try {
    console.log("[1] Convert Base58 (Phantom) → Solana Wallet");
    console.log("[2] Convert Solana Wallet → Base58 (Phantom)");
    const choice = await question("Choose an option (1/2): ");

    if (choice === "1") {
      const base58 = await question("Enter Base58 private key: ");
      const wallet = bs58.decode(base58);
      console.log("Byte array:", Array.from(wallet)); // Convert Uint8Array to number[]
    } else if (choice === "2") {
      const input = await question(
        "Paste wallet bytes (e.g., [170,172,...]): ",
      );
      const bytes = JSON.parse(input) as number[];
      console.log("Base58:", walletToBase58(bytes));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    rl.close();
  }
}

// Run only if executed directly
if (require.main === module) {
  main();
}
