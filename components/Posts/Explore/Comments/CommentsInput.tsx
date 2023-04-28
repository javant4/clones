import { Button, Flex, Icon, Input, Textarea } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React from "react";
import { RiEmotionHappyLine } from "react-icons/ri";

type CommentsInputProps = {
  user: User;
  commentText: string;
  setCommentText: (value: string) => void;
  loading: boolean;
  onCreateComment: (commentText: string) => void;
};

const CommentsInput: React.FC<CommentsInputProps> = ({
  user,
  commentText,
  setCommentText,
  loading,
  onCreateComment,
}) => {
  return (
    <Flex align="center" mt={1}>
      <Icon as={RiEmotionHappyLine} fontSize={22} mr={2} />
      <Input
        isDisabled={!user}
        flexGrow={1}
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onCreateComment(commentText);
          }
        }}
        placeholder={user ? "Add a comment..." : "Please sign in to comment"}
        _placeholder={{ color: "gray.500" }}
        variant="unstyled"
        size="sm"
      />
      <Button
        height="26px"
        isDisabled={!commentText?.length}
        textColor="blue.400"
        fontWeight={500}
        bg="transparent"
        _hover={{ textColor: "blue.700" }}
        onClick={() => onCreateComment(commentText)}
        isLoading={loading}
      >
        Post
      </Button>
    </Flex>
  );
};

export default CommentsInput;
