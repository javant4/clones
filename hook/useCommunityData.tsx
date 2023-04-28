import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { supabase } from "../utils/supabaseClient";
import { useSupaUser } from "../utils/useSupaUser";

const useCommunityData = () => {
  const { user } = useSupaUser();
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState<boolean>();
  const [hookError, setHookError] = useState<string>("");
  const router = useRouter();

  const onJoinOrLeaveCommunity = (communityData: Root, isJoined: boolean) => {
    // is user signed in
    // if not => open authmodal
    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("root")
        .select(
          `
        id, image_url, topic,
        root_members!inner (
          is_moderator
        )
      `
        )
        .eq("root_members.user_id", user?.id);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const snippets: RootSnippet[] = data.map((doc: any) => ({
          root_id: doc.id,
          is_moderator: Array.isArray(doc.root_members)
            ? doc.root_members[0].is_moderator
            : doc.root_members?.is_moderator || "",
          image_url: doc.image_url || "",
          topic: doc.topic,
        }));

        setCommunityStateValue((prev) => ({
          ...prev,
          mySnippets: snippets,
          initSnippetsFetched: true,
        }));
        // console.log("here are the snippets: ", snippets);
        // console.log("here is the user: ", user);
      }
    } catch (error) {
      console.log("getMySnippets Error", error);
      setHookError(error as string);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Root) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("root_members").insert({
        user_id: user?.id,
        root_id: communityData.id,
        is_moderator: user?.id === communityData.creator_id,
      }).select(`
        root_id, is_moderator,
        root!inner (
          image_url,
          topic
        )
      `);

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const newSnippet: RootSnippet = {
          root_id: data[0].root_id,
          is_moderator: data[0].is_moderator,
          image_url: Array.isArray(data[0].root)
            ? data[0].root[0].image_url
            : data[0].root?.image_url || "",
          topic: Array.isArray(data[0].root)
            ? data[0].root[0].topic
            : data[0].root?.topic || "",
        };

        setCommunityStateValue((prev) => ({
          ...prev,
          mySnippets: [...prev.mySnippets, newSnippet],
        }));
      }
    } catch (error) {
      console.log("joinCommunity error: ", error);
      setHookError(error as string);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityData: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("root_members")
        .delete()
        .eq("root_id", communityData);

      if (error) {
        throw new Error(error.message);
      }

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.root_id !== communityData
        ),
      }));
    } catch (error) {
      console.log("leaveCommunity error: ", error);
      setHookError(error as string);
    }
    setLoading(false);
  };

  const getCommunityData = async (community: string) => {
    try {
      const { data, error } = await supabase
        .from("root")
        .select(`*, root_members(count)`)
        .eq("topic", community);

      if (error) {
        throw new Error(error.message);
      }

      const root: Root[] = data.map((doc: any) => ({
        created_at: doc.created_at,
        id: doc.id,
        topic: doc.topic,
        creator_id: doc.creator_id,
        privacy_type: doc.privacy_type,
        image_url: doc.image_url,
        number_of_members: Array.isArray(doc.root_members)
          ? doc.root_members[0].count
          : doc.root_members?.count || 0,
      }));

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: root[0],
      }));
    } catch (error: any) {
      console.log("getCommunityData error: ", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        initSnippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { community } = router.query;
    if (community && !communityStateValue.currentCommunity) {
      getCommunityData(community as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    // data and functions
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};

export default useCommunityData;
