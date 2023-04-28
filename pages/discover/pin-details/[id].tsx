import { GetStaticProps } from "next";
import PinDetail from "../../../components/PinDetail";
import DiscoverHeaderLayout, {
  useDiscoverUser,
} from "../../../layout/DiscoverHeader";
import { DiscoverNavBarLayout } from "../../../layout/DiscoverNavBar";
import {
  getAllDiscoverPinsIds,
  getDiscoverPinById,
} from "../../../sprout_discover_backend/lib/sanity.client";

interface Props {
  pin: DiscoverPin;
}
export default function DiscoverPinDetailPage({ pin }: Props) {
  const user = useDiscoverUser();

  return (
    <div>
      <PinDetail user={user} pin={pin} />
    </div>
  );
}

export const getStaticPaths = async () => {
  const pinRoutes = await getAllDiscoverPinsIds();

  return {
    paths: pinRoutes.map((id) => {
      return {
        params: {
          id,
        },
      };
    }),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pin = await getDiscoverPinById(params?.id as string);

  if (!pin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pin,
    },
    revalidate: 60, // after 18000s (5hrs) old cache will update
  };
};

DiscoverPinDetailPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};
