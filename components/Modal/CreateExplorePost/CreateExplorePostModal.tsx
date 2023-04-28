import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import error from "next/error";
import React, { useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { exploreModalState } from "../../../atoms/exploreModalAtom";
import { explorePostState } from "../../../atoms/explorePostAtom";
import useSelectFile from "../../../hook/useSelectFile";
import { supabase } from "../../../utils/supabaseClient";
import { useSupaUser } from "../../../utils/useSupaUser";

const CreateExplorePostModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(exploreModalState);
  const [postExploreStateValue, setPostExploreStateValue] =
    useRecoilState(explorePostState);
  const { onSelectFile, selectedFile, setSelectedFile, selectedUploadFile } =
    useSelectFile();
  const [captionText, setCaptionText] = useState<string>("");
  const [categoryText, setCategoryText] = useState<string>("");
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const { user } = useSupaUser();

  const handleCreatePost = async () => {
    setLoading(true);
    setError(false);

    // create new post object => type Post
    const newPost = {
      creator_id: user?.id,
      explore_category_id: "362d1580-9c7d-4343-a115-257ffab76f0b",
      creator_display_name: user?.email!.split("@")[0],
      caption: captionText,
      image_url: "",
    };

    try {
      // store the post in db
      const { data: post, error: errorInsert } = await supabase
        .from("explore_post")
        .insert(newPost)
        .select();

      if (errorInsert) {
        throw new Error(errorInsert.message);
        return;
      }

      // check for selected file
      if (selectedUploadFile) {
        // store in storage => getPublicUrL (return URL)
        const imagePath = `${user?.id}/explore/${uuidv4()}`;
        const { error: errorStorage } = await supabase.storage
          .from("post_images")
          .upload(imagePath, selectedUploadFile);

        if (errorStorage) {
          throw new Error(errorStorage.message);
          return;
        }
        // update post by adding the imageURL
        const { data: publicURL } = supabase.storage
          .from("post_images")
          .getPublicUrl(imagePath);

        const { error: errorUpdate } = await supabase
          .from("explore_post")
          .update({ image_url: publicURL.publicUrl })
          .eq("id", post?.[0].id);

        if (errorUpdate) {
          throw new Error(errorUpdate.message);
          return;
        }
        // add post to state if query equals the current category

        // setPostExploreStateValue(prev => ({
        //   ...prev,
        //   posts: [...prev.posts, updatedPost[0] as ExplorePost]
        // }))
      }

      handleClose();
      window.location.reload();
    } catch (error: any) {
      console.log("handleCreateForumPost error: ", error.message);
      setError(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setSelectedFile("");
    setCaptionText("");
    setCategoryText("");
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
            pt={10}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="100%"
            >
              {selectedFile ? (
                <>
                  <Image
                    src={selectedFile as string}
                    maxWidth="400px"
                    maxHeight="400px"
                  />
                  <Input
                    flexGrow={1}
                    value={captionText}
                    onChange={(event) => setCaptionText(event.target.value)}
                    placeholder="Add a caption..."
                    _placeholder={{
                      color: "gray.500",
                      textAlign: "center",
                    }}
                    textAlign="center"
                    variant="unstyled"
                    size="sm"
                    p="5px 0px 0px 0px"
                  />
                  <Input
                    flexGrow={1}
                    value={categoryText}
                    onChange={(event) => setCategoryText(event.target.value)}
                    placeholder="Pick a catagory"
                    _placeholder={{
                      color: "gray.500",
                      textAlign: "center",
                    }}
                    textAlign="center"
                    variant="unstyled"
                    size="sm"
                    p="5px 0px 0px 0px"
                  />
                  <Stack direction="row" mt={4}>
                    <Button
                      height="28px"
                      onClick={handleCreatePost}
                      isLoading={loading}
                    >
                      Post
                    </Button>
                    <Button
                      variant="outline"
                      height="28px"
                      onClick={() => {
                        setSelectedFile("");
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </>
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  p={20}
                  border="1px dashed"
                  borderColor="gray.200"
                  borderRadius={4}
                  width="100%"
                  direction="column"
                >
                  <Icon
                    as={BsCamera}
                    fontSize={50}
                    onClick={() => selectFileRef.current?.click()}
                    _hover={{ color: "green.300" }}
                  />
                  <Text fontSize="10pt">Upload a photo</Text>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    hidden
                    ref={selectFileRef}
                    onChange={onSelectFile}
                  />
                </Flex>
              )}
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <Text>Error creating post</Text>
                </Alert>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateExplorePostModal;
