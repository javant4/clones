import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { communityState } from "../../../../atoms/communitiesAtom";
import { navBarState } from "../../../../atoms/navBarAtom";
import About from "../../../../components/Community/About";
import CreatePostLink from "../../../../components/Community/CreatePostLink";
import Header from "../../../../components/Community/Header";
import NotFound from "../../../../components/Community/NotFound";
import PageContentLayout from "../../../../components/Layout/PageContent";
import Posts from "../../../../components/Posts/Forum/Posts";
import { supabase } from "../../../../utils/supabaseClient";
import { useSupaUser } from "../../../../utils/useSupaUser";

type CommunityPageProps = {
  communityData: Root | null;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState);
  const [navBarStateValue, setNavBarStateValue] = useRecoilState(navBarState);
  const { user } = useSupaUser();
  const router = useRouter();
  console.log("route: ", router);

  if (!communityData) {
    return <NotFound />;
  }

  useEffect(() => {
    if (!communityData) return;
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  useEffect(() => {
    if (navBarStateValue.view === "forum") return;
    setNavBarStateValue((prev) => ({
      ...prev,
      view: "forum",
    }));
  }, [navBarStateValue]);

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink user={user} />
          <Posts user={user} communityData={communityData} />
        </>
        <>
          <About user={user} communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { data, error } = await supabase
      .from("root")
      .select(`*, number_of_members:root_members(count)`)
      .eq("topic", context.query.community as string);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length) {
      const root: Root[] = data.map((doc: any) => ({
        created_at: doc.created_at,
        id: doc.id,
        topic: doc.topic,
        creator_id: doc.creator_id,
        privacy_type: doc.privacy_type,
        image_url: doc.image_url,
        number_of_members: doc.number_of_members[0].count,
      }));

      return {
        props: {
          communityData: root[0],
        },
      };
    } else {
      return {
        props: {
          communityData: null,
        },
      };
    }
  } catch (error) {
    // could add error page
    console.log("getServerSideProps error: ", error);
  }
}

export default CommunityPage;
