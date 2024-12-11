import { fetchBlogById, fetchBlogs } from "@/app/api/blog";
import BlogDetails from "@/app/components/BlogDetails";

export async function generateStaticParams() {
  if (process.env.NODE_ENV === "production") {
    return [];
  }
  const res = await fetchBlogs();
  const blogs = res.blogs;

  return blogs.map((blog) => ({
    id: blog._id.toString(),
  }));
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const blog = await fetchBlogById(params.id);

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <div>
      <BlogDetails blog={blog} />
    </div>
  );
}
