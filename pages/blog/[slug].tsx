import { GetStaticProps } from "next";
import HeaderBlog from "../../components/HeaderBlog";
import {
  getAllBlogPostsSlugs,
  getBlogPostBySlug,
} from "../../sprout_blog_backend/lib/sanity.client";
import { urlFor } from "../../sprout_blog_backend/lib/sanity.image";
// import PortableText from "react-portable-text";
import { PortableText } from "@portabletext/react";
import { config } from "../../sprout_blog_backend/lib/sanity.client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import BlogPostCommentList from "../../components/BlogPostCommentList";
import Image from "next/image";
import { RichTextComponents } from "../../components/RichTextComponents";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: BlogPost;
}

export default function BlogPost({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createBlogComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
        setValue("_id", "");
        setValue("name", "");
        setValue("email", "");
        setValue("comment", "");
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  return (
    <main>
      <HeaderBlog />

      <article className="max-w-7xl px-5 pb-28 mx-auto">
        <section className="space-y-2 border border-[#F7AB0A] text-white">
          <div className="relative min-h-56 flex flex-col md:flex-row justify-between">
            <div className="absolute top-0 w-full h-full opacity-10 blur-sm p-10">
              <Image
                className="object-cover object-center mx-auto"
                src={urlFor(post.mainImage).url()!}
                alt={post.author.name}
                fill
              />
            </div>
            <section className="p-5 bg-green-600 w-full">
              <div className="flex flex-col md:flex-row justify-between gap-y-5">
                <div>
                  <h1 className=" text-4xl font-extrabold">{post.title}</h1>
                  <p>
                    {new Date(post._createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Image
                    className="rounded-full m-1"
                    src={urlFor(post.author.image).url()!}
                    alt={post.author.name}
                    height={40}
                    width={40}
                  />
                  <div className="w-64">
                    <h3 className="text-lg font-bold">{post.author.name}</h3>
                    <PortableText
                      value={post.author.bio}
                      components={RichTextComponents}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="italic pt-10">{post.description}</h2>

                {post.categories && (
                  <div className="flex items-center justify-end mt-auto space-x-2">
                    {post.categories.map((category) => (
                      <p
                        key={category._id}
                        className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold mt-4"
                      >
                        {category.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
        <div className="max-w-4xl mx-auto pt-2">
          <PortableText value={post.body} components={RichTextComponents} />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="commentBlogForm">
            <span className="commentBlogSpanForm">Name</span>
            <input
              {...register("name", { required: true })}
              className="commentBlogInput form-input"
              placeholder="Geralt of Rivia"
              type="text"
            />
          </label>
          <label className="commentBlogForm">
            <span className="commentBlogSpanForm">Email</span>
            <input
              {...register("email", { required: true })}
              className="commentBlogInput form-input"
              placeholder="email@email.com"
              type="email"
            />
          </label>
          <label className="commentBlogForm">
            <span className="commentBlogSpanForm">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="commentBlogInput form-textarea"
              placeholder="Tell us about Geralt of Rivia"
              rows={8}
            />
          </label>
          {/* errors returned when validation fails */}
          {Object.keys(errors).length > 0 && (
            <div className="flex flex-col p-5 text-red-500">
              {errors.name?.type == "required" && (
                <span>❗ The Name field is required</span>
              )}

              {errors.comment?.type == "required" && (
                <span>❗ A Comment is required</span>
              )}
              {errors.email?.type == "required" && (
                <span>❗ An Email is required</span>
              )}
            </div>
          )}

          {!!watch("name") && (
            <input
              type="submit"
              className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            />
          )}
        </form>
      )}

      <BlogPostCommentList comments={post.comments} />
    </main>
  );
}

export const getStaticPaths = async () => {
  const slugRoutes = await getAllBlogPostsSlugs();

  return {
    paths: slugRoutes.map((slug) => {
      return {
        params: {
          slug,
        },
      };
    }), // slugRoutes?.map(({ slug }) => `/blog/${slug}`)
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getBlogPostBySlug(params?.slug as string);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 18000s (5hrs) old cache will update
  };
};
