import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPosts } from "@/data/blogData";
import BlogPostClient from "./BlogPostClient";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found - Groca",
    };
  }

  return {
    title: `${post.title} - Groca Grocery Mart`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
