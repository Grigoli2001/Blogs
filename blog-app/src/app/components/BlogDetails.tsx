"use client";
import React from "react";
import { Blog } from "../api/blog";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlogContent = styled.div`
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 768px) {
    width: 60%;
  }
`;

const BlogDetailsContent = styled.div`
  padding: 15px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 768px) {
    width: 60%;
  }
`;

const BlogTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  border-bottom: 2px solid #8c8c8c;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const BlogDescription = styled.p`
  font-size: 1.4rem;
  color: #666;
  overflow-wrap: break-word;

  padding-bottom: 10px;
  margin-bottom: 10px;
`;

// const BlogFooter = styled.div`
//   padding: 15px;
//   display: flex;
//   justify-content: space-between;
//   @media (max-width: 768px) {
//     width: 100%;
//   }
//   @media (min-width: 768px) {
//     width: 60%;
//   }
// `;

const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #8c8c8c;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const BlogCategory = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #454444;
`;

const BlogDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;
const BackButton = styled.button`
  color: #828282;
  border: none;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  font-size: 1.6rem;
  font-weight: bolder;
  background: none;
  transition: background 0.3s;
  &:hover {
    background: #666666;
    color: #ffffff;
  }

  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface BlogDetailsProps {
  blog: Blog;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ blog }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <BlogContainer>
      <BlogContent>
        <BackButton onClick={handleBack}>←</BackButton>
        <BlogTitle>{blog.title}</BlogTitle>
        <BlogHeader>
          <BlogDate>Author: {blog.author.name}</BlogDate>
          <BlogDate>
            Published: {new Date(blog.created_at).toLocaleString()}
          </BlogDate>
        </BlogHeader>
        <BlogDescription>{blog.content}</BlogDescription>
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={700}
            height={475}
            // priority={true}
            // layout="responsive"
            loading="lazy"
          />
        )}
      </BlogContent>
      <BlogDetailsContent>
        <BlogCategory>Category: {blog.category}</BlogCategory>
        <BlogDate>
          Last modified: {new Date(blog.created_at).toLocaleString()}
        </BlogDate>
      </BlogDetailsContent>
    </BlogContainer>
  );
};

export default BlogDetails;
