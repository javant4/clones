import { Flex, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { networkState } from "../../../../atoms/exploreNetworkAtom";
import AccountPhotos from "../../../../components/Explore/AccountPhotos";
import NotFound from "../../../../components/Explore/NotFound";
import Header from "../../../../components/Profile/Explore/Header";
import { supabase } from "../../../../utils/supabaseClient";

type AccountPageProps = {
  accountData: any;
};

const AccountPage: React.FC<AccountPageProps> = ({ accountData }) => {
  const setNetworkStateValue = useSetRecoilState(networkState);
  if (!accountData) {
    return <NotFound />;
  }

  useEffect(() => {
    if (!accountData) return;
    setNetworkStateValue((prev) => ({
      ...prev,
      currentNetwork: accountData,
    }));
  }, [accountData]);

  return (
    <>
      <Flex justify="center" p="16px 0px">
        <Flex
          bg="blue.100"
          width="95%"
          justify="center"
          maxWidth="860px"
          direction="column"
        >
          <Header accountData={accountData} />
          <AccountPhotos />
        </Flex>
      </Flex>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // check for valid user account
    const { data: account, error: accountError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", context.query.username);

    if (accountError) {
      throw new Error(accountError.message);
    }

    if (account.length) {
      // querry all user data
      console.log("user account: ", account);
      return {
        props: {
          accountData: account[0],
        },
      };
    } else {
      return {
        props: {
          accountData: null,
        },
      };
    }
    //   // check if its a catgory account
    //   const { data: categoryAccount, error: categoryAccountError } =
    //   await supabase
    //     .from("explore_category")
    //     .select("*")
    //     .eq("username", context.query.username);

    // if (categoryAccountError) {
    //   throw new Error(categoryAccountError.message);
    // }
  } catch (error) {
    // could add error page
    console.log("getServerSideProps error: ", error);
  }
}

export default AccountPage;
