import { Alert, AlertIcon, Text, Flex, Icon } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { supabase } from "../../../../utils/supabaseClient";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import useSelectFile from "../../../../hook/useSelectFile";

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostFormProps = {
  user: User;
  communityData?: Root;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityData }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const { onSelectFile, selectedFile, setSelectedFile, selectedUploadFile } =
    useSelectFile();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const handleCreatePost = async () => {
    if (!textInputs.title) {
      toast.error("Whoops Title is required!");
      return;
    }
    setLoading(true);
    // const { community } = router.query;
    // get root data used in post object
    // const { data: root, error } = await supabase
    //   .from("root")
    //   .select("id")
    //   .eq("topic", community as string);

    // if (error) {
    //   console.log("post error: ", error.message);
    //   return;
    // }
    // console.log("comm data: ", communityData);
    if (communityData) {
      // create new post object => type Post
      const newPost = {
        root_id: communityData.id,
        creator_id: user?.id,
        creator_display_name: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        image_url: "",
      };

      try {
        // store the post in db
        const { data: post, error: errorInsert } = await supabase
          .from("root_post")
          .insert(newPost)
          .select();

        if (errorInsert) {
          throw new Error(errorInsert.message);
          return;
        }

        // check for selected file
        if (selectedUploadFile) {
          // store in storage => getPublicUrL (return URL)
          const imagePath = `${user.id}/forum/${uuidv4()}`;
          const { error: errorStorage } = await supabase.storage
            .from("post_images")
            .upload(imagePath, selectedUploadFile);

          if (errorStorage) {
            throw new Error(errorStorage.message);
            return;
          }
          // update post doc by adding the imageURL
          const { data: publicURL } = supabase.storage
            .from("post_images")
            .getPublicUrl(imagePath);

          const { error: errorUpdate } = await supabase
            .from("root_post")
            .update({ image_url: publicURL.publicUrl })
            .eq("id", post?.[0].id);
        }
        // redirect back to community page using the router
        router.back();
      } catch (error: any) {
        console.log("handleCreateForumPost error: ", error.message);
        setError(true);
      }
      setLoading(false);
    }
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
