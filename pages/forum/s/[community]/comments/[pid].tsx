import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { navBarState } from "../../../../../atoms/navBarAtom";
import About from "../../../../../components/Community/About";
import PageContentLayout from "../../../../../components/Layout/PageContent";
import Comments from "../../../../../components/Posts/Forum/Comments/Comments";
import PostItem from "../../../../../components/Posts/Forum/PostItem/PostItem";
import useCommunityData from "../../../../../hook/useCommunityData";
import useForumPosts from "../../../../../hook/useForumPosts";
import { supabase } from "../../../../../utils/supabaseClient";
import { useSupaUser } from "../../../../../utils/useSupaUser";

const PostPage: React.FC = () => {
  const { user } = useSupaUser();
  const { postForumStateValue, setPostForumStateValue, onDeletePost, onVote } =
    useForumPosts();
  const [navBarStateValue, setNavBarStateValue] = useRecoilState(navBarState);
  const router = useRouter();
  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const { data: post, error } = await supabase
        .from("root_post")
        .select(
          `
        *,
        number_of_comments:root_comment(count),
        comments:root_comment(*),
        votes:root_post_vote(*)
        `
        )
        .eq("id", postId);
      if (error) {
        throw new Error(error.message);
      }
      if (post) {
        const postVotes: RootPostVote[] = post.map((item: any) => ({
          id: item.votes[0]?.id,
          user_id: item.votes[0]?.user_id,
          root_id: item.votes[0]?.root_id,
          post_id: item.votes[0]?.post_id,
          vote_status: item.votes[0]?.vote_status,
          created_at: item.votes[0]?.created_at,
        }));
        setPostForumStateValue((prev) => ({
          ...prev,
          selectedPost: post[0] as RootPost,
          postVotes: postVotes,
        }));
      }
    } catch (error: any) {
      console.log("fetchPost error: ", error.message);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postForumStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postForumStateValue.selectedPost]);

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
        {postForumStateValue.selectedPost && (
          <PostItem
            post={postForumStateValue.selectedPost}
            onVote={onVote}
            onDelete={onDeletePost}
            userVoteValue={
              postForumStateValue.postVotes.find(
                (item) => item.post_id === postForumStateValue.selectedPost?.id
              )?.vote_status
            }
            userIsCreator={
              user?.id === postForumStateValue.selectedPost?.creator_id
            }
            user={user}
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postForumStateValue.selectedPost}
          communityId={postForumStateValue.selectedPost?.root_id as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About
            user={user}
            communityData={communityStateValue.currentCommunity}
          />
        )}
      </>
    </PageContentLayout>
  );
};

export default PostPage;
