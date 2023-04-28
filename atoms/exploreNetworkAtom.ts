import { atom } from "recoil";

export const defaultNetworkState: NetworkState = {
  myNetwork: [],
  myCategories: [],
  initNetworksFetched: false,
  // visitedNetworks: {},
  // currentNetwork: {} as Root,
};

export const networkState = atom<NetworkState>({
  key: "networkState",
  default: defaultNetworkState,
});
