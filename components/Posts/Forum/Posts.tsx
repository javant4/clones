import { Stack } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import useCommunityData from "../../../hook/useCommunityData";
import useForumPosts from "../../../hook/useForumPosts";
import { supabase } from "../../../utils/supabaseClient";
import Loader from "../Loader";
import PostItem from "./PostItem/PostItem";

type PostsProps = {
  user: User | undefined;
  communityData: Root;
};

const Posts: React.FC<PostsProps> = ({ user, communityData }) => {
  const {
    postForumStateValue,
    setPostForumStateValue,
    onVote,
    onSelectForumPost,
    onDeletePost,
  } = useForumPosts();
  const [loading, setLoading] = useState<boolean>();

  const getPostsWithVotes = async (communityId: string) => {
    try {
      setLoading(true); //
      // get posts from the community

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
        .eq("root_id", communityId)
        .order("created_at", { ascending: false });

      console.log("posts: ", posts);

      if (error) {
        throw new Error(error.message);
      }

      if (posts) {
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
          posts: posts,
          postVotes: postVotes,
        }));
      }
    } catch (error: any) {
      console.log("getPosts error: ", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (communityData) {
      getPostsWithVotes(communityData.id);
    }
  }, [communityData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Stack>
          {postForumStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.id === item.creator_id}
              userVoteValue={
                postForumStateValue.postVotes.find(
                  (vote) => vote.post_id === item.id
                )?.vote_status
              }
              onVote={onVote}
              onSelect={onSelectForumPost}
              onDelete={onDeletePost}
              user={user}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
