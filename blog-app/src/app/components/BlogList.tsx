"use client";
import { useState, useEffect } from "react";
import { Blog, fetchBlogs, BlogResponse } from "../api/blog";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import CategoryFilter from "./CategoryFilter";
import BlogGrid from "./BlogGrid";
import useIsMobile from "../hooks/useMobile";
import styled from "styled-components";

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
`;

export const BlogList = ({ initialData }: { initialData: BlogResponse }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
    queryKey: ["blogs", selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      fetchBlogs(pageParam, 6, selectedCategory?.toLowerCase()),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage + 1 <= lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialData: { pages: [initialData], pageParams: [1] },
    initialPageParam: 1,
  });

  const blogs =
    data?.pages.reduce<Blog[]>((acc, page) => [...acc, ...page.blogs], []) ||
    [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "All" ? null : category);
  };

  if (error) return <div>Something went wrong</div>;
  if (!isMounted) return null;

  return (
    <>
      <CategoryFilter
        isMobile={isMobile}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<LoadingMessage>Loading more blogs...</LoadingMessage>}
      >
        <BlogGrid blogs={blogs} />
      </InfiniteScroll>
    </>
  );
};
