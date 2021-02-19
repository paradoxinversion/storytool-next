import Link from "next/link";
import SceneEditor from "../componenents/SceneEditor";
import dynamic from "next/dynamic";
const NoSSREditor = dynamic(() => import("../componenents/SceneEditor"), {
  ssr: false,
});
import Head from "next/head";
export default function HomePage() {
  return (
    <div>
      <Head>
        <meta charset="utf-8" />
      </Head>
      <div className="m-4 text-center">
        <p className="text-lg font-bold">Lorem Ipsum</p>
        <div className="mt-4 text-lg flex flex-col mx-auto justify-between w-1/2">
          <NoSSREditor />

          <Link href="/login">
            <a className="btn">Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
