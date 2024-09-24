import Head from "next/head";
import Wallet from "../app/wallet/wallet";

export default function Home() {
  return (
    <div>
      <Head>
        <title>MetaMask Clone</title>
        <meta name="description" content="A MetaMask clone built with Next.js and ethers.js" />
      </Head>
      <main>
        <Wallet />
      </main>
    </div>
  );
}
