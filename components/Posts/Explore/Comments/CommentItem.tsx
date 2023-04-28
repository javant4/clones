import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";
import moment from "moment";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";
import Link from "next/link";

type CommentItemProps = {
  comment: ExploreComment;
  //   onDelete: (comment: RootComment) => void;
  //   loadingDelete: boolean;
  username?: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  //   onDelete,
  //   loadingDelete,
  username,
}) => {
  return (
    <Flex key={comment.id} align="center">
      <Link href={`/explore/profile/${username}`}>
        <Text fontSize="sm" mr={1} fontWeight={600}>
          {comment.creator_display_name}
        </Text>
      </Link>
      <Text
        fontSize="xs"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {comment?.body}
      </Text>
    </Flex>
  );
};

export default CommentItem;
