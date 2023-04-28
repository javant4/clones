import { GetStaticProps } from "next";
import DiscoverFeed from "../../../components/DiscoverFeed";
import DiscoverHeaderLayout, {
  useDiscoverUser,
} from "../../../layout/DiscoverHeader";
import { DiscoverNavBarLayout } from "../../../layout/DiscoverNavBar";
import {
  getAllDiscoverPinsCategories,
  getDiscoverPinsByCategory,
} from "../../../sprout_discover_backend/lib/sanity.client";

interface Props {
  pins: DiscoverPin[];
}

export default function CategoryPage({ pins }: Props) {
  const user = useDiscoverUser();
  console.log("pins: ", pins);

  return (
    <div>
      <DiscoverFeed pins={pins} />
    </div>
  );
}

export const getStaticPaths = async () => {
  const categoryRoutes = await getAllDiscoverPinsCategories();

  return {
    paths: categoryRoutes.map((category) => {
      return {
        params: {
          category,
        },
      };
    }),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pins = await getDiscoverPinsByCategory(params?.category as string);

  if (!pins) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pins,
    },
    revalidate: 60, // after 18000s (5hrs) old cache will update
  };
};

CategoryPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};
