// BlogGrid.tsx
import styled from "styled-components";
import { Blog } from "../api/blog";
import { BlogItem } from "./BlogItem";

const BlogListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  padding: 20px;

  & > *:nth-child(1),
  & > *:nth-child(2) {
    grid-column: span 6;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    & > *:nth-child(1),
    & > *:nth-child(2) {
      grid-column: span 12;
    }
  }
`;

interface BlogGridProps {
  blogs: Blog[];
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs }) => (
  <BlogListContainer>
    {blogs.map((blog) => (
      <BlogItem key={blog._id} blog={blog} />
    ))}
  </BlogListContainer>
);

export default BlogGrid;
