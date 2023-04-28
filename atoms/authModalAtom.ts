import { atom } from "recoil";

const defaultModalSate: AuthModalState = {
  open: false,
  view: "login",
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalSate,
});
