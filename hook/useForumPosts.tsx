import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { forumPostState } from "../atoms/forumPostAtom";
import { supabase } from "../utils/supabaseClient";
import { useSupaUser } from "../utils/useSupaUser";

const useForumPosts = () => {
  const { user } = useSupaUser();
  const router = useRouter();
  const [postForumStateValue, setPostForumStateValue] =
    useRecoilState(forumPostState);
  const currentCommunuty = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState<boolean>();

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: RootPost,
    vote: number,
    communityId: string,
    user: User
  ) => {
    event.stopPropagation();
    // is user signed in
    // if not => open authmodal
    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { vote_status } = post;
      const existingVote = postForumStateValue.postVotes.find(
        (vote) => vote.post_id === post.id
      );
      const updatedPost = { ...post };
      const updatedPosts = [...postForumStateValue.posts];
      let updatedPostVotes = [...postForumStateValue.postVotes];
      let voteChange = vote;
      // new vote
      if (!existingVote) {
        // insert new record into vote root_post_vote
        const newVote = {
          user_id: user.id,
          post_id: post.id,
          root_id: communityId,
          vote_status: vote,
        };
        const { data, error } = await supabase
          .from("root_post_vote")
          .insert(newVote)
          .select();
        if (error) {
          throw new Error(error.message);
        }

        // add or subtract 1 to/from post vote
        updatedPost.vote_status = vote_status + vote;
        updatedPostVotes = [...updatedPostVotes, data[0] as RootPostVote];
      }
      // existing vote
      else {
        // removing their vote
        if (existingVote.vote_status === vote) {
          // add/sub 1 to/from root_post.vote_status column
          updatedPost.vote_status = vote_status - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          //remove existing record from root_post_vote
          const { error } = await supabase
            .from("root_post_vote")
            .delete()
            .eq("id", existingVote.id);
          if (error) {
            throw new Error(error.message);
          }

          voteChange *= -1;
        }
        // flipping their vote (up => down or down => up)
        else {
          // add/sub 2 to/from root_post.vote_status column
          updatedPost.vote_status = vote_status + 2 * vote;
          const voteIdx = postForumStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          updatedPostVotes[voteIdx] = {
            ...existingVote,
            vote_status: vote,
          };
          // update value in table
          const { error } = await supabase
            .from("root_post_vote")
            .update({ vote_status: vote })
            .eq("id", existingVote.id);
          if (error) {
            throw new Error(error.message);
          }

          voteChange = 2 * vote;
        }
      }
      // update state with updates values
      const postIdx = postForumStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostForumStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postForumStateValue.selectedPost) {
        setPostForumStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
      console.log(voteChange, post.id);

      // update root_posts.vote_status with updated vote value
      const { error } = await supabase.rpc("update_vote_status", {
        vote: voteChange,
        post_id: post.id,
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.log("onVote error: ", error.message);
    }
  };
  const onSelectForumPost = (post: RootPost) => {
    setPostForumStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    console.log("selected post: ", post);

    router.push(`/forum/s/${currentCommunuty?.topic}/comments/${post.id}`);
  };
  const onDeletePost = async (post: RootPost, user: User): Promise<boolean> => {
    try {
      //check if post has an image
      if (post.image_url) {
        // delete the post image
        const imageName = post.image_url.split("/").pop();
        const { error } = await supabase.storage
          .from("post_images")
          .remove([`${user.id}/${imageName}`]);

        if (error) {
          throw new Error(error.message);
        }
      }
      // delete post for db
      const { error } = await supabase
        .from("root_post")
        .delete()
        .eq("id", post.id);

      console.log("del: ", post);

      if (error) {
        throw new Error(error.message);
      }
      // update recoil state
      setPostForumStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };
  const getCommunityPostVotes = async (communityId: string) => {
    const { data: postVotes, error } = await supabase
      .from("root_post_vote")
      .select("*")
      .eq("root_id", communityId)
      .eq("user_id", user?.id);

    if (postVotes) {
      setPostForumStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as RootPostVote[],
      }));
    }
  };

  // useEffect(() => {
  //   if (!user || !currentCommunuty?.id) return;
  //   // get community post votes
  //   getCommunityPostVotes(currentCommunuty?.id);
  // }, [user, currentCommunuty]);

  useEffect(() => {
    if (!user) {
      // clear user post votes
      setPostForumStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return {
    loading,
    postForumStateValue,
    setPostForumStateValue,
    onVote,
    onSelectForumPost,
    onDeletePost,
  };
};

export default useForumPosts;
