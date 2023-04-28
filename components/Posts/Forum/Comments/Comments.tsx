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
import { selector, useSetRecoilState } from "recoil";
import { forumPostState } from "../../../../atoms/forumPostAtom";
import { supabase } from "../../../../utils/supabaseClient";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: RootPost | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  communityId,
  selectedPost,
  user,
}) => {
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<RootComment[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string>("");
  const setPostForum = useSetRecoilState(forumPostState);

  const onCreateComment = async () => {
    if (!commentText.length) {
      toast.error("Whoops enter a comment first!");
      return;
    }
    setCreateLoading(true);
    // create comment doc
    try {
      const comment = {
        creator_id: user.id,
        post_id: selectedPost?.id!,
        root_id: communityId,
        creator_display_name: user.email!.split("@")[0],
        post_title: selectedPost?.title!,
        body: commentText,
      };

      const { data: newComment, error: insertError } = await supabase
        .from("root_comment")
        .insert(comment)
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }
      // increment root_comment.number_of_comments field +1
      // const { error: rpcError } = await supabase.rpc("update_comment_count", {
      //   inc: 1,
      //   post_id: selectedPost?.id!,
      // });

      // if (rpcError) {
      //   throw new Error(rpcError.message);
      // }

      // update client recoil state
      console.log("add from db: ", newComment);
      setCommentText("");
      setComments((prev) => [newComment[0] as RootComment, ...prev]);

      console.log("Add comments: ", comments);
      setPostForum((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          number_of_comments: [
            { count: prev.selectedPost?.number_of_comments[0].count! + 1 },
          ],
        } as RootPost,
      }));
    } catch (error: any) {
      console.log("onCreateComment error: ", error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: RootComment) => {
    setLoadingDeleteId(comment.id);
    try {
      // delete comment doc
      const { error: deleteError } = await supabase
        .from("root_comment")
        .delete()
        .eq("id", comment?.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // decrement root_comment.number_of_comments field -1
      // const { error: rpcError } = await supabase.rpc("update_comment_count", {
      //   inc: -1,
      //   post_id: comment.post_id!,
      // });

      // if (rpcError) {
      //   throw new Error(rpcError.message);
      // }
      // update client recoil state
      setPostForum((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          number_of_comments: [
            { count: prev.selectedPost?.number_of_comments[0].count! - 1 },
          ],
        } as RootPost,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("onDeleteComment error: ", error.message);
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
    try {
      // const { data: comments, error } = await supabase
      //   .from("root_comment")
      //   .select("*")
      //   .eq("post_id", selectedPost?.id)
      //   .order("created_at", { ascending: false });

      // if (error) {
      //   throw new Error(error.message);
      // }

      setComments(selectedPost?.comments as RootComment[]);
    } catch (error: any) {
      console.log("getPostComments error: ", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    if (!comments.length) getPostComments();
    console.log("init comments: ", comments);
  }, [selectedPost]);
  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!comments.length ? (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={onDeleteComment}
                    userId={user.id}
                    loadingDelete={loadingDeleteId === comment.id}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
