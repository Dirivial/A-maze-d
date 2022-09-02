import type { NextPage } from "next";
import Head from "next/head";

import Maze from "../components/Maze";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>A-maze-d</title>
        <meta name="description" content="Generates and solves mazes" />
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/Dirivial/A-maze-d/main/public/pfp.png"
        />
      </Head>
      <div className="p-4" />
      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <Maze />
        <div className="p-3" />
        <a href="https://github.com/Dirivial/A-maze-d">
          <img
            className=" rounded-full hover:shadow-lg shadow-neutral-500 hover:bg-slate-800 hover:bg-opacity-40 transition-colors"
            src="https://raw.githubusercontent.com/Dirivial/A-maze-d/main/public/GitHub-Mark-64px.png"
          />
        </a>
      </main>
    </>
  );
};

export default Home;
