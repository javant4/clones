import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { networkState } from "../atoms/exploreNetworkAtom";
import { supabase } from "../utils/supabaseClient";
import { useSupaUser } from "../utils/useSupaUser";

const useNetworkData = () => {
  const [loading, setLoading] = useState<boolean>();
  const [networkStateValue, setNetworkStateValue] =
    useRecoilState(networkState);
  const { user } = useSupaUser();

  const getMyNetworks = async () => {
    try {
      setLoading(true);

      // get network data
      const { data: categoryNet, error: categoryErr } = await supabase
        .from("explore_category_network")
        .select("user_id,following_id")
        .eq("user_id", user?.id);

      if (categoryErr) {
        throw new Error(categoryErr.message);
      }

      const { data: peopleNet, error: peopleErr } = await supabase
        .from("explore_people_network")
        .select("user_id,following_id")
        .eq("user_id", user?.id);

      if (peopleErr) {
        throw new Error(peopleErr.message);
      }

      if (categoryNet || peopleNet) {
        setNetworkStateValue((prev) => ({
          ...prev,
          myNetwork: [
            ...(peopleNet as NetworkSnippet[]),
            ...(categoryNet as NetworkSnippet[]),
          ],
          myCategories: categoryNet as NetworkSnippet[],
          initNetworksFetched: true,
        }));
      }
    } catch (error: any) {
      console.log("getMyNetworkData error: ", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setNetworkStateValue((prev) => ({
        ...prev,
        myNetworks: [],
        myCategories: [],
        initNetworksFetched: false,
      }));
      return;
    }
    getMyNetworks();
  }, [user]);

  return {
    // data and functions
    networkStateValue,
  };
};

export default useNetworkData;
