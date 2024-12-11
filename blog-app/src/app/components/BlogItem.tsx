import { Blog } from "../api/blog";
import {
  BlogCategory,
  BlogContent,
  BlogDate,
  BlogDescription,
  BlogFooter,
  BlogHeader,
  BlogImage,
  BlogItemContentContainer,
  BlogTitle,
  StyledBlogLink,
} from "../styles/customComponents";
import { capitalize } from "../utils/utils";

export const BlogItem = ({ blog }: { blog: Blog }) => {
  return (
    <StyledBlogLink href={`/blog/${blog._id}`} passHref>
      <BlogItemContentContainer>
        {!!blog.image && <BlogImage src={blog.image} alt={blog.title} />}
        <BlogContent>
          <BlogHeader>
            <BlogTitle>{capitalize(blog.title)}</BlogTitle>
            <BlogCategory>{capitalize(blog.category)}</BlogCategory>
          </BlogHeader>
          <BlogDescription>
            {blog.content.slice(0, 120)}
            {blog.content.length > 120 ? "..." : ""}
          </BlogDescription>
        </BlogContent>
        <BlogFooter>
          <BlogDate>Author: {capitalize(blog.author.name || "")}</BlogDate>
          <BlogDate>{new Date(blog.updated_at).toLocaleDateString()}</BlogDate>
        </BlogFooter>
      </BlogItemContentContainer>
    </StyledBlogLink>
  );
};
