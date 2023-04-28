import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
// import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Toaster } from "react-hot-toast";
import { NextPage } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { RecoilRoot } from "recoil";
import { MyUserContextProvider } from "../utils/useSupaUser";
import ForumHeaderLayout from "../layout/ForumHeader";
import Layout from "../components/Layout/Layout";
import { SessionProvider } from "next-auth/react";

// type ComponentWithPageLayout = AppProps & {
//   Component: AppProps["Component"] & {
//     PageLayout?: React.ComponentType;
//   };
// };

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);
  return (
    <MyUserContextProvider>
      <RecoilRoot>
        {/* <ApolloProvider client={client}> */}
        <SessionProvider session={session}>
          <ChakraProvider theme={theme}>
            <Toaster />
            {/* <div className="h-screen overflow-y-scroll bg-slate-200"> */}
            {/* <Header /> */}
            <Layout>
              {/* <ForumHeaderLayout children={undefined} /> */}
              {/* {getLayout(<Component {...pageProps} />)} */}
              <Component {...pageProps} />
            </Layout>
            {/* </div> */}
          </ChakraProvider>
        </SessionProvider>
        {/* </ApolloProvider> */}
      </RecoilRoot>
    </MyUserContextProvider>
  );
}

// const Layout = ({ Component, pageProps }: any) => {
//   return Component.getLayout ? (
//     Component.getLayout(<Component {...pageProps} />)
//   ) : (
//     <Component {...pageProps} />
//   );
// };

// function MyApp({
//   Component,
//   pageProps: { session, ...pageProps },
// }: ComponentWithPageLayout) {
//   return (
//     <ApolloProvider client={client}>
//       <SessionProvider session={session}>
//         <Toaster />
//         <div className="h-screen overflow-y-scroll bg-slate-200">
//           <Header />
//           {Component.PageLayout ? (
//             <Component.PageLayout {...pageProps}>
//               <Component {...pageProps} />
//             </Component.PageLayout>
//           ) : (
//             <Component {...pageProps} />
//           )}
//         </div>
//       </SessionProvider>
//     </ApolloProvider>
//   );
// }
export default MyApp;
