import { Box, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useRecoilState } from "recoil";
import {
  DirectoryMenuItem,
  directoryMenuState,
} from "../../atoms/directoryMenuAtom";
import { navBarState } from "../../atoms/navBarAtom";
import MiniProfile from "../../components/Explore/MiniProfile";
import Recommendations from "../../components/Explore/Recommendations";
import Stories from "../../components/Explore/Stories";
import PageContentLayout from "../../components/Layout/PageContent";
import PostItem from "../../components/Posts/Explore/PostItem/PostItem";
import Posts from "../../components/Posts/Explore/Posts";
import Loader from "../../components/Posts/Loader";
import useDirectory from "../../hook/useDirectory";
import useExplorePost from "../../hook/useExplorePost";
import useNetworkData from "../../hook/useNetworkData";
import { supabase } from "../../utils/supabaseClient";
import { useSupaUser } from "../../utils/useSupaUser";

type ExplorePageProps = {};

const ExplorePage: React.FC<ExplorePageProps> = () => {
  const [navBarStateValue, setNavBarStateValue] = useRecoilState(navBarState);
  const [directoryStateValue, setDirectoryStateValue] =
    useRecoilState(directoryMenuState);
  const [loading, setLoading] = useState<boolean>(false);
  const { postNetworkStateValue, setPostNetworkStateValue } = useExplorePost();
  const { networkStateValue } = useNetworkData();
  const { user } = useSupaUser();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      // get posts from user's network
      if (networkStateValue.myNetwork.length) {
        // get posts from users network
        const myNetworkIds = networkStateValue.myNetwork
          .map((network) => network.following_id)
          .concat([user?.id] as Array<string>);

        const myCategoryIds = networkStateValue.myCategories.map(
          (category) => category.following_id
        );

        let query = supabase.from("explore_post").select(
          `
            *,
            comments:explore_comment(*)
            `
        );
        // query conditonal chaining
        if (myNetworkIds.length) {
          query = query.in("creator_id", myNetworkIds);
        }
        if (myCategoryIds.length) {
          query = query.in("explore_category_id", myCategoryIds);
        }
        if (true) {
          query = query.order("created_at", { ascending: false }).limit(10);
        }
        const { data: posts, error } = await query;

        console.log("explore posts home: ", posts);

        if (error) {
          throw new Error(error.message);
        }

        const postVotes: ExplorePostVote[] = posts.map((item: any) => ({
          id: item?.id,
          user_id: item?.user_id,
          post_id: item?.post_id,
          vote_status: item?.vote_status,
          explore_category_id: item?.explore_category_id,
          created_at: item?.created_at,
        }));

        setPostNetworkStateValue((prev) => ({
          ...prev,
          posts: posts as ExplorePost[],
          postVotes: postVotes,
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.log("buildUserHomeFeed error: ", error.message);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const { data: posts, error } = await supabase
        .from("explore_post")
        .select(
          `
            *,
            comments:explore_comment(*)
            `
        )
        .order("vote_status", { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      setPostNetworkStateValue((prev) => ({
        ...prev,
        posts: posts as ExplorePost[],
      }));
    } catch (error: any) {
      console.log("buildNoUserHomeFeed error: ", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (networkStateValue.initNetworksFetched) buildUserHomeFeed();
  }, [networkStateValue.initNetworksFetched]);

  useEffect(() => {
    if (!user) buildNoUserHomeFeed();
  }, [user]);

  useEffect(() => {
    if (navBarStateValue.view === "explore") return;
    setNavBarStateValue((prev) => ({
      ...prev,
      view: "explore",
    }));
  }, [navBarStateValue]);

  useEffect(() => {
    if (directoryStateValue.selectedMenuItem.displayText === "explore") return;
    setDirectoryStateValue((prev) => ({
      ...prev,
      selectedMenuItem: {
        displayText: "explore",
        link: "/explore/",
        icon: AiOutlineSearch,
        iconColor: "green.400",
      } as DirectoryMenuItem,
    }));
  }, [directoryStateValue.selectedMenuItem]);

  return (
    <Box bg="gray.100">
      <PageContentLayout maxWidth="950px">
        {/* feed */}
        <>
          <Stories />

          {loading ? (
            <Loader />
          ) : (
            <Stack>
              {postNetworkStateValue.posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  // onSelect={onSelectForumPost}
                  // onDelete={onDeletePost}
                  // onVote={onVote}
                  // userVoteValue={
                  //   postForumStateValue.postVotes.find(
                  //     (item) => item.post_id === post.id
                  //   )?.vote_status
                  // }
                  user={user}
                  userIsCreator={user?.id === post.creator_id}
                  homePage
                />
              ))}
            </Stack>
          )}
        </>
        {/* modal */}
        <>
          <Box position="fixed" top="58px">
            <MiniProfile />
            <Recommendations />
          </Box>
        </>
      </PageContentLayout>
    </Box>
  );
};

export default ExplorePage;
