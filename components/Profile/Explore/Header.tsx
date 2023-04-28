import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { networkState } from "../../../atoms/exploreNetworkAtom";
import useNetworkData from "../../../hook/useNetworkData";
import { useSupaUser } from "../../../utils/useSupaUser";

type HeaderProps = {
  accountData: any;
};

const Header: React.FC<HeaderProps> = ({ accountData }) => {
  const { user } = useSupaUser();
  const { networkStateValue } = useNetworkData();
  const isFollowing = !!networkStateValue.myNetwork.find(
    (item) => item.following_id === accountData.id
  );
  const isUser = user?.id === accountData.id;

  return <div>{`is following ${isFollowing} or is user ${isUser}`}</div>;
};

export default Header;
