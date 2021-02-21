import Link from "next/link";
import Head from "next/head";

export default function HomePage() {
  return (
    <div
      id="index-page"
      className="w-full m-4 flex flex-col items-center justify-center"
    >
      <Head>
        <title>StoryTool Next</title>
      </Head>
      <section id="greetings" className="text-center">
        <p className="text-xl mb-4">Welcome to Storytool, please log in.</p>
        <Link href="/login">
          <a className="btn">Login or Register</a>
        </Link>
      </section>
    </div>
  );
}
