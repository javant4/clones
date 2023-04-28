import { Box, Image } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

type AvatarProps = {
  src: string;
  border?: string;
  borderColor?: string;
};
const Avatar: React.FC<AvatarProps> = ({ src, border, borderColor }) => {
  return (
    <Box>
      <Image
        height="45px"
        width="45px"
        borderRadius="full"
        border={border ? border : "none"}
        borderColor={borderColor ? borderColor : "none"}
        p={1}
        mr={3}
        src={src}
        alt="profile pic"
      />
    </Box>
  );
};

export default Avatar;
