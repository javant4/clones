import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { explorePostState } from "../atoms/explorePostAtom";
import { supabase } from "../utils/supabaseClient";
import { useSupaUser } from "../utils/useSupaUser";

const useExplorePost = () => {
  const { user } = useSupaUser();
  const [postNetworkStateValue, setPostNetworkStateValue] =
    useRecoilState(explorePostState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      // clear user post votes
      setPostNetworkStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);
  return {
    postNetworkStateValue,
    setPostNetworkStateValue,
    loading,
    setLoading,
  };
};

export default useExplorePost;
