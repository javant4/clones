interface AuthModalState {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

interface ExploreModalState {
  open: boolean;
  // view: "login" | "signup" | "resetPassword";
}

interface NavBarState {
  view: "forum" | "explore";
}

interface UserWithRoot {
  user: RootMember;
  root: Root[];
}

interface RootState {
  mySnippets: RootSnippet[];
  currentCommunity?: Root;
  initSnippetsFetched: boolean;
}

interface RootSnippet {
  root_id: string;
  topic: string;
  is_moderator?: boolean;
  image_url?: string;
}

interface RootPostState {
  selectedPost: RootPost | null;
  posts: RootPost[];
  postVotes: RootPostVote[];
}

interface NetworkState {
  myNetwork: NetworkSnippet[];
  myCategories: NetworkSnippet[];
  currentNetwork?: any;
  initNetworksFetched: boolean;
}

interface NetworkSnippet {
  user_id: string;
  following_id: string;
}

interface NetworkPostState {
  selectedPost: ExplorePost | null;
  posts: ExplorePost[];
  postVotes: ExplorePostVote[];
}

interface ExploreCategory {
  id: string;
  category: string;
  created_at: string;
  description: string;
  image_url: string;
}

interface ExplorePost {
  id: string;
  creator_id: string;
  explore_category_id: string;
  creator_display_name: string;
  caption: string;
  image_url: string;
  vote_status: number;
  created_at: string;
  comments: ExploreComment[];
}

interface ExploreComment {
  id: string;
  creator_id: string;
  post_id: string;
  explore_category_id: string;
  creator_display_name: string;
  post_title: string;
  body: string;
  created_at: string;
}

interface ExplorePostVote {
  id: string;
  user_id: string;
  post_id: string;
  explore_category_id: string;
  vote_status: number;
  created_at: string;
}

interface RootPostVote {
  id: string;
  user_id: string;
  post_id: string;
  root_id: string;
  vote_status: number;
  created_at: string;
}

interface Root {
  created_at: string;
  id: string;
  topic: string;
  creator_id: string;
  privacy_type: "public" | "restricted" | "private";
  image_url: string;
  number_of_members: [{ count: number }];
}

interface RootMember {
  user_id: string;
  root_id: string;
  created_at: string;
  is_moderator: boolean;
}
interface RootPostTemp {
  id: string;
  root_id: string;
  creator_id: string;
  creator_diaplay_name: string;
  title: string;
  body: string;
  number_of_comments: number;
  vote_status: Vote[];
  image_url?: string;
  community_image_url?: string;
  created_at: string;
}

interface RootPost {
  id: string;
  root_id: string;
  creator_id: string;
  creator_display_name: string;
  title: string;
  body: string;
  image_url: string;
  created_at: string;
  vote_status: number;
  number_of_comments: [{ count: number }];
  comments: RootComment[];
  votes?: RootPostVote[];
  root: Root;
}

interface RootComment {
  id: string;
  creator_id: string;
  post_id: string;
  root_id: string;
  creator_display_name: string;
  post_title: string;
  body: string;
  created_at: string;
}

// Sanity Types

type Base = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

interface DiscoverUser extends Base {
  userName: string;
  image: string;
}

interface DiscoverPin extends Base {
  title: string;
  about: string;
  destination: string;
  category: string;
  image: Image;
  postedBy: DiscoverUser;
  save: Save[];
  comments: DiscoverComment[];
}

interface DiscoverComment extends Base {
  postedBy: DiscoverUser;
  comment: string;
}

interface Save {
  postedBy: DiscoverPin;
}

interface BlogPost extends Base {
  author: Author;
  body: Block[];
  categories: Category[];
  mainImage: Image;
  slug: Slug;
  title: string;
  description: string;
  comments: BlogPostComment[];
}

interface BlogPostComment extends Base {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
}

interface Author extends Base {
  bio: Block[];
  image: Image;
  name: string;
  slug: Slug;
}

interface Image {
  _type: "image";
  asset: Reference;
}

interface Reference {
  _ref: string;
  type: "reference";
  url: string;
}

interface Slug {
  _type: "slug";
  current: string;
}

interface Block {
  _key: string;
  _type: "block";
  children: Span[];
  markDefs: any[];
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blackQuote";
}

interface Span {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
}

interface Category extends Base {
  description: string;
  title: string;
}

interface MainImage {
  _type: "image";
  asset: Reference;
}

interface Title {
  _type: "string";
  current: string;
}
