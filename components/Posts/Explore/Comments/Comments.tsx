import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { explorePostState } from "../../../../atoms/explorePostAtom";
import useExplorePost from "../../../../hook/useExplorePost";
import { supabase } from "../../../../utils/supabaseClient";
import CommentItem from "./CommentItem";
import CommentsInput from "./CommentsInput";

// const comments = [
//   {
//     id: "1234",
//     username: "sssssprout",
//     caption:
//       "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
//   },
//   {
//     id: "12345",
//     username: "sssssprout",
//     caption:
//       "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
//   },
//   {
//     id: "12346",
//     username: "sssssprout",
//     caption:
//       "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
//   },
//   {
//     id: "123467",
//     username: "sssssprout",
//     caption:
//       "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
//   },
//   {
//     id: "1234678",
//     username: "sssssprout",
//     caption:
//       "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
//   },
// ];

type CommentsProps = {
  user: User;
  post: ExplorePost;
};

const Comments: React.FC<CommentsProps> = ({ user, post }) => {
  const [commentText, setCommentText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<ExploreComment[]>([]);
  const [postExploreStateValue, setPostExploreStateValue] =
    useRecoilState(explorePostState);

  const onCreateComment = async (commentText: string) => {
    if (!commentText.length) {
      toast.error("Whoops enter a comment first!");
      return;
    }
    setLoading(true);
    // create comment doc
    try {
      const comment = {
        creator_id: user.id,
        post_id: post.id,
        explore_category_id: post.explore_category_id,
        creator_display_name: user.user_metadata.username,
        post_title: post.caption,
        body: commentText,
      };

      const { data: newComment, error: insertError } = await supabase
        .from("explore_comment")
        .insert(comment)
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // update client recoil state
      console.log("add from db: ", newComment);
      setCommentText("");
      setComments((prev) => [newComment[0] as ExploreComment, ...prev]);
    } catch (error: any) {
      console.log("onCreateComment error: ", error.message);
    }
    setLoading(false);
    console.log("Add comments: ", comments);
  };

  const getPostComments = async () => {
    try {
      //   const sortedComments = post.comments.sort((a: any, b: any) => b - a);
      setComments(post?.comments as ExploreComment[]);
    } catch (error: any) {
      console.log("getPostComments error: ", error.message);
    }
  };

  useEffect(() => {
    getPostComments();
  }, []);

  return (
    <Box px={4} alignContent="center">
      {comments && (
        <>
          {comments.length > 3 && (
            <Flex cursor="pointer" mb={1}>
              <Text fontSize="sm" color="gray.400">
                View all {comments.length} comments
              </Text>
            </Flex>
          )}
          {comments.slice(0, 3).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              username={comment.creator_display_name}
            />
          ))}
        </>
      )}
      <CommentsInput
        user={user}
        commentText={commentText}
        setCommentText={setCommentText}
        loading={loading}
        onCreateComment={onCreateComment}
      />
    </Box>
  );
};

export default Comments;
