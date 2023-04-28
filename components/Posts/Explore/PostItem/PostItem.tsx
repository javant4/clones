import {
  Box,
  Flex,
  Icon,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineHeart } from "react-icons/ai";
import { BiBookmark, BiTrash } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import {
  HiOutlineDotsHorizontal,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import Avatar from "../../Avatar";
import Comments from "../Comments/Comments";
import CommentsInput from "../Comments/CommentsInput";

type PostItemProps = {
  post: ExplorePost;
  user?: User;
  userIsCreator: boolean;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  user,
  userIsCreator,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState<boolean>(true);

  return (
    <Box borderRadius="sm" bg="white">
      {/* header */}
      <Flex justify="space-between" align="center" p={5}>
        <Link href={`/explore/profile/${post?.creator_display_name}`}>
          <Flex align="center">
            <Avatar src={post?.image_url} />
            <Flex flexGrow={1}>
              <Text fontWeight={600}>{post?.creator_display_name}</Text>
            </Flex>
          </Flex>
        </Link>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>

      {/* img */}
      <Flex justify="center" align="center">
        {loadingImage && (
          <Skeleton height="200px" width="100%" borderRadius={4} />
        )}
        <Image
          src={post.image_url}
          maxHeight="460px"
          width="full"
          alt="Post Image"
          display={loadingImage ? "none" : "unset"}
          onLoad={() => setLoadingImage(false)}
        />
      </Flex>

      {/* buttons */}
      <Flex justify="space-between" px={4} pt={4} pb={1} align="center">
        <Stack direction="row" spacing={4}>
          <Flex>
            <Icon as={AiOutlineHeart} fontSize={22} />
          </Flex>
          <Flex
            cursor="pointer"
            _hover={{
              transform: "scale(1.25)",
              transition: ".15s ease-out",
            }}
          >
            <Icon as={BsChatDots} fontSize={22} />
          </Flex>
          <Flex
            cursor="pointer"
            transform="rotate(45deg)"
            _hover={{
              transform: "scale(1.25) rotate(45deg)",
              transition: ".15s ease-out",
            }}
          >
            <Icon as={HiOutlinePaperAirplane} fontSize={22} />
          </Flex>
          {userIsCreator && (
            <Flex
              cursor="pointer"
              _hover={{
                transform: "scale(1.25)",
                transition: ".15s ease-out",
              }}
            >
              <Icon as={BiTrash} fontSize={22} />
            </Flex>
          )}
        </Stack>
        <Flex
          cursor="pointer"
          _hover={{
            transform: "scale(1.25)",
            transition: ".15s ease-out",
          }}
        >
          <Icon as={BiBookmark} fontSize={22} />
        </Flex>
      </Flex>
      {/* post metadata */}
      <Flex px={4} align="center">
        <Text fontSize="9pt" fontWeight={600}>
          {post.vote_status} sprouts
        </Text>
      </Flex>

      {/* caption */}
      <Flex align="center" px={4} py={2}>
        <Link href={`/explore/profile/${post?.creator_display_name}`}>
          <Text mr={1} fontWeight={600}>
            {post?.creator_display_name}
          </Text>
        </Link>
        <Text
          fontSize="10pt"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {post?.caption}
        </Text>
      </Flex>
      {/* comments */}

      {/* comment input */}
      <Comments user={user as User} post={post} />
      <Text color="gray.500" pl={4} my={2} fontSize="xs">
        Posted {moment(new Date(post.created_at)).fromNow()}
      </Text>
    </Box>
  );
};

export default PostItem;
