import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

import { getAllPosts, getPost } from "@/lib/blog";
import { PostHeader } from "@/components/blog/PostHeader";
import { Reader } from "@/components/blog/Reader";
import { mdxComponents } from "@/components/blog/mdx-components";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found · mason.os" };
  return {
    title: `${post.meta.title} · mason.os`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      tags: post.meta.tags,
    },
  };
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    dark: "github-dark-default",
    light: "github-light-default",
  },
  keepBackground: false,
  defaultLang: "tsx",
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <Reader slug={post.slug} readingMinutes={post.readingMinutes}>
      <PostHeader meta={post.meta} readingMinutes={post.readingMinutes} />
      <div className="prose prose-mason max-w-[70ch]">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
            },
          }}
        />
      </div>
    </Reader>
  );
}
