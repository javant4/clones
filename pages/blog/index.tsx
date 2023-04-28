import React from "react";
import Banner from "../../components/Banner";
import BlogPostList from "../../components/BlogPostList";
import HeaderBlog from "../../components/HeaderBlog";
import { getAllBlogPosts } from "../../sprout_blog_backend/lib/sanity.client";

interface Props {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <HeaderBlog />
      <Banner />
      <BlogPostList posts={posts} />
    </div>
  );
}

export const getServerSideProps = async ({ res, req }: any) => {
  const posts = await getAllBlogPosts();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      posts,
    },
    // revalidate: 60,
  };
};
