import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import Maze from "./maze";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const [mazeWidth, setMazeWidth] = useState(10);
  const [mazeHeight, setMazeHeigth] = useState(10);
  return (
    <>
      <Head>
        <title>A-maze-d</title>
        <meta name="description" content="Generates and solves mazes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="p-16 flex flex-col items-center text-7xl text-blue-500">
        A-maze-d
      </h1>
      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <div className="flex gap-4 bg-slate-600 rounded-t border-t border-r border-l p-2">
          <label>Width:</label>
          <input
            className="bg-blue-400 rounded pl-1 w-10"
            type="number"
            id="maze-width"
            defaultValue={10}
            min="5"
            max="30"
            onChange={(e) => setMazeWidth(e.target.valueAsNumber)}
          />
          <label>Height:</label>
          <input
            className="bg-blue-400 rounded pl-1 w-10"
            type="number"
            id="maze-height"
            defaultValue={10}
            min="5"
            max="30"
            onChange={(e) => setMazeHeigth(e.target.valueAsNumber)}
          />
        </div>

        <Maze width={mazeWidth} height={mazeHeight} />
      </main>
    </>
  );
};

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={documentation}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </section>
  );
};

export default Home;
