import React, { useState, createContext, useContext, useEffect } from "react";
import { useFetchDiscoverUser } from "../hook/useFetchDiscoverData";
import DiscoverSideBar from "../components/DiscoverSideBar";
import { getDiscoverUser } from "../sprout_discover_backend/lib/sanity.client";
import { useSession } from "next-auth/react";

const DiscoverUserContext = createContext<DiscoverUser | undefined>(undefined);

export function useDiscoverUser() {
  const user = useContext(DiscoverUserContext);
  if (user === null) {
    throw new Error(
      "useDiscoverUser must be called in a child of DiscoverHeaderLayout"
    );
  }

  return user;
}

export default function DiscoverHeaderLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const { data: session } = useSession();
  const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);

  // const { user } = useFetchDiscoverUser();

  const [user, setUser] = useState<DiscoverUser>();

  useEffect(() => {
    const userInfo =
      localStorage.getItem("user") !== "undefined"
        ? JSON.parse(localStorage.getItem("user")!)
        : localStorage.clear();
    if (userInfo) {
      getDiscoverUser(userInfo.id).then((data) => setUser(data));
      console.log("Ran get user query again");
    }
  }, [session]);

  return (
    <DiscoverUserContext.Provider value={user}>
      <header className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
        <div className="hidden md:flex h-screen flex-initial">
          <DiscoverSideBar user={user && user} />
        </div>
        {/* <div className="flex md:hidden flex-row">
          <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
            <Bars3Icon
              className="icon"
              onClick={() => setToggleSideBar(true)}
            />
            <Link href="/discover">
              <img
                style={{ objectFit: "contain" }}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pinterest_Logo.svg/1200px-Pinterest_Logo.svg.png"
                alt={"logo"}
                className="w-28"
              />
            </Link>
            <Link href={`/discover/user-profile/${user?._id}`}>
              <Avatar seed={user?.userName} />
            </Link>
          </div>
          {toggleSideBar && (
            <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
              <div className="absolute w-full flex justify-end items-center p-2">
                <XCircleIcon
                  className="icon"
                  onClick={() => setToggleSideBar(false)}
                />
              </div>
              <DiscoverSideBar
                user={user && user}
                closeToggle={setToggleSideBar}
              />
            </div>
          )}
        </div> */}
        <div className="pb-2 flex-1">{children}</div>
      </header>
    </DiscoverUserContext.Provider>
  );
}
