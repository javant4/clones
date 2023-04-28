import { Stack } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../../atoms/communitiesAtom";
import { navBarState } from "../../atoms/navBarAtom";
import CreatePostLink from "../../components/Community/CreatePostLink";
import PersonalHome from "../../components/Community/PersonalHome";
import Premium from "../../components/Community/Premium";
import PageContentLayout from "../../components/Layout/PageContent";
import Loader from "../../components/Posts/Loader";
import PostItem from "../../components/Posts/Forum/PostItem/PostItem";
import useCommunityData from "../../hook/useCommunityData";
import useForumPosts from "../../hook/useForumPosts";
import { supabase } from "../../utils/supabaseClient";
import { useSupaUser } from "../../utils/useSupaUser";
import Recommendations from "../../components/Community/Recommendations";

const ForumHomePage: React.FC = () => {
  const { user, loadingUser } = useSupaUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [navBarStateValue, setNavBarStateValue] = useRecoilState(navBarState);

  const {
    postForumStateValue,
    setPostForumStateValue,
    onSelectForumPost,
    onDeletePost,
    onVote,
  } = useForumPosts();
  const { communityStateValue } = useCommunityData();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      // get posts from user's communities
      if (communityStateValue.mySnippets.length) {
        // get posts from users communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.root_id
        );

        const { data: posts, error } = await supabase
          .from("root_post")
          .select(
            `
          *,
          number_of_comments:root_comment(count),
          comments:root_comment(*),
          votes:root_post_vote(*),
          root:root!root_id(*)
          `
          )
          .in("root_id", myCommunityIds)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          throw new Error(error.message);
        }

        const postVotes: RootPostVote[] = posts.map((item: any) => ({
          id: item.votes[0]?.id,
          user_id: item.votes[0]?.user_id,
          root_id: item.votes[0]?.root_id,
          post_id: item.votes[0]?.post_id,
          vote_status: item.votes[0]?.vote_status,
          created_at: item.votes[0]?.created_at,
        }));

        setPostForumStateValue((prev) => ({
          ...prev,
          posts: posts as RootPost[],
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
        .from("root_post")
        .select(
          `
        *,
        number_of_comments:root_comment(count),
        comments:root_comment(*),
        root:root!root_id(*)
        `
        )
        .order("vote_status", { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      setPostForumStateValue((prev) => ({
        ...prev,
        posts: posts as RootPost[],
      }));
    } catch (error: any) {
      console.log("buildNoUserHomeFeed error: ", error.message);
    }
    setLoading(false);
  };
  const getUserPostVotes = () => {};

  useEffect(() => {
    if (communityStateValue.initSnippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (!user) buildNoUserHomeFeed();
  }, [user]);

  useEffect(() => {
    if (navBarStateValue.view === "forum") return;
    setNavBarStateValue((prev) => ({
      ...prev,
      view: "forum",
    }));
  }, [navBarStateValue]);
  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <Loader />
        ) : (
          <Stack>
            {postForumStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelect={onSelectForumPost}
                onDelete={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postForumStateValue.postVotes.find(
                    (item) => item.post_id === post.id
                  )?.vote_status
                }
                user={user}
                userIsCreator={user?.id === post.creator_id}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack position="sticky" top="58px" spacing={5}>
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContentLayout>
  );
};

// ForumHomePage.getLayout = function getLayout(page: React.ReactElement) {
//   return <ForumHeaderLayout>{page}</ForumHeaderLayout>;
// };

export default ForumHomePage;
