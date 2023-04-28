import { Stack } from "@chakra-ui/react";
import React from "react";
import PostItem from "./PostItem/PostItem";

type PostsProps = {};

const posts = [
  {
    id: "1234",
    username: "sssssprout",
    userImage:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    image:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    caption:
      "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
  },
  {
    id: "12345",
    username: "sssssprout",
    userImage:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    image:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    caption:
      "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
  },
  {
    id: "12346",
    username: "sssssprout",
    userImage:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    image:
      "https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg",
    caption:
      "DUMMY CAPTION TO SHOW THE POST CONTENT LETS KEEP THIS GOING SO WE CAN WATCH IT CUT OFF",
  },
];

const Posts: React.FC<PostsProps> = () => {
  return (
    <Stack spacing={5}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          username={post.username}
          userImg={post.userImage}
          avatar={post.image}
          caption={post.caption}
        />
      ))}
    </Stack>
  );
};

export default Posts;
