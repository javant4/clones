import type { NextPage } from "next";
import Head from "next/head";
import Feed from "../components/Feed";
import PostBox from "../components/PostBox";
import { GET_ROOT_WITH_LIMIT } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import RootRow from "../components/RootRow";

const Home: NextPage = () => {
  const { data } = useQuery(GET_ROOT_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  });

  const roots: Root[] = data?.getRootListLimit;
  return (
    <div className="my-7 max-w-5xl mx-auto">
      <Head>
        <title>Sprout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Post box */}
      <PostBox />
      <div className="flex">
        <Feed />

        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>

          <div>
            {roots?.map((root, i) => (
              <RootRow key={root.id} topic={root.topic} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
