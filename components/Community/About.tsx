import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  Image,
  Spinner,
} from "@chakra-ui/react";
import moment from "moment";
import React, { ButtonHTMLAttributes, useRef, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import useSelectFile from "../../hook/useSelectFile";
import { useSupaUser } from "../../utils/useSupaUser";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../utils/supabaseClient";
import { useSetRecoilState } from "recoil";
import { communityState } from "../../atoms/communitiesAtom";
import { User } from "@supabase/supabase-js";
import { authModalState } from "../../atoms/authModalAtom";

type AboutProps = {
  communityData: Root;
  user?: User;
};

const About: React.FC<AboutProps> = ({ communityData, user }) => {
  const selectFileRef = useRef<HTMLInputElement>(null);
  const { onSelectFile, selectedFile, setSelectedFile, selectedUploadFile } =
    useSelectFile();
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onUpdateImage = async () => {
    if (!selectedUploadFile) return;
    // check for selected file
    try {
      setImageLoading(true);
      // store in storage => getPublicUrL (return URL)
      const imagePath = `${communityData.id}/${uuidv4()}`;
      const { error: errorStorage } = await supabase.storage
        .from("root_images")
        .upload(imagePath, selectedUploadFile);

      if (errorStorage) {
        throw new Error(errorStorage.message);
        return;
      }
      // update post doc by adding the imageURL
      const { data: publicURL } = supabase.storage
        .from("root_images")
        .getPublicUrl(imagePath);

      const { error: errorUpdate } = await supabase
        .from("root")
        .update({ image_url: publicURL.publicUrl })
        .eq("id", communityData.id);

      if (errorUpdate) {
        throw new Error(errorUpdate.message);
        return;
      }

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          image_url: publicURL.publicUrl,
        } as Root,
      }));
    } catch (error: any) {
      console.log("onUpdateImage error: ", error.message);
    }
    setImageLoading(false);
  };

  const onCreatePost = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!user) {
      event.preventDefault();
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  };
  return (
    <Box position="sticky" top="58px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="blue.400"
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Root
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt">
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.number_of_members?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              {/* Hard coded */}
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={10} mr={2} />
            {communityData?.created_at && (
              <Text>
                Created{" "}
                {moment(new Date(communityData.created_at)).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            )}
          </Flex>
          <Link
            href={`/forum/s/${communityData.topic}/submit`}
            onClick={(event) => onCreatePost(event)}
          >
            <Button mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.id === communityData?.creator_id && (
            <>
              <Divider />
              <Stack fontSize="10pt" spacing={1}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => selectFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData?.image_url || selectedFile ? (
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={selectedFile || communityData?.image_url}
                      alt="Dan Abramov"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (imageLoading ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={selectFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
