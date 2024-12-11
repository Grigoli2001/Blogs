import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../api/blog";
import { Blog } from "../types/blog.types";
import CreateBlogForm from "../components/blogs/CreateBlog";
import { Pagination } from "@mui/material";
import {
  BlogSearchSmallScreen,
  BlogCategory,
} from "../components/blogs/BlogPageComponents";

import BlogList from "../components/blogs/BlogList";
export default function BlogPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const PAGESIZE = 8;
  const navigate = useNavigate();

  const { data: blogs, isLoading } = useQuery({
    queryKey: [
      "blogs",
      page,
      PAGESIZE,
      filterStatus,
      filterCategory,
      filterTitle,
    ],
    queryFn: () =>
      getBlogs(page, PAGESIZE, filterStatus, filterCategory, filterTitle),
  });

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleCategory = (category: string) => {
    if (category === "all") {
      setFilterCategory("");
    } else {
      setPage(1);
      setFilterCategory(category);
    }
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <BlogSearchSmallScreen
        handleOpenCreateDialog={handleOpenCreateDialog}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
      />
      <BlogCategory
        handleCategory={handleCategory}
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setFilterTitle={setFilterTitle}
        filterTitle={filterTitle}
        handleOpenCreateDialog={handleOpenCreateDialog}
      />

      <BlogList
        blogs={blogs?.blogs as Blog[]}
        isLoading={isLoading}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        focusedCardIndex={focusedCardIndex}
        handleBlogClick={handleBlogClick}
      />

      <Pagination
        sx={{ display: "flex", justifyContent: "right", gap: 2 }}
        count={blogs?.totalPages ?? 0}
        page={page}
        onChange={(_event, value) => setPage(value)}
      />
      <CreateBlogForm
        open={createDialogOpen}
        handleClose={handleCloseCreateDialog}
      />
    </Box>
  );
}
