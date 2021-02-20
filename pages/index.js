import Link from "next/link";

import Head from "next/head";
export default function HomePage() {
  return (
    <div>
      <p>Welcome to Storytool, please log in.</p>
      <Head>
        <meta charset="utf-8" />
      </Head>
      <div>
        <div>
          <Link href="/login">
            <a className="btn">Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
