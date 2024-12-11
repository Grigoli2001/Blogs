import styled from "styled-components";
import Link from "next/link";

export const StyledBlogLink = styled(Link)`
  border: 2px solid #afafaf;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 10px;
  transition: transform 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &:hover {
    transform: translateY(-5px);
  }
  grid-column: span 4;
  height: auto;
  width: 100%;
  position: relative;
`;

export const BlogItemContentContainer = styled.div``;
export const BlogItemContainer = styled.div``;

export const BlogImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const BlogContent = styled.div`
  padding: 15px;
`;

export const BlogTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  overflow-wrap: break-word;
  max-width: 80%;
`;

export const BlogDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  overflow-wrap: break-word;
  max-width: 80%;
`;

export const BlogFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-left: 10px;
  padding-right: 18px;
  padding-bottom: 10px;
  border-top: 1px solid #eaeaea;
`;
export const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const BlogCategory = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: #454444;
`;

export const BlogDate = styled.span`
  font-size: 0.8rem;
  color: #666;
`;
