import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBlogById } from "../api/blog";
import { Box, Skeleton, Snackbar } from "@mui/material";
import { useAuth } from "../context/authContext/useAuth";
import Grid from "@mui/material/Grid2";
import BlogDetails from "../components/blogs/BlogDetails";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id!),
  });

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Grid>
      </Grid>
    );
  }

  if (!blog) return <div>Blog not found</div>;

  return (
    <Box sx={{ maxWidth: "100%", p: 2 }}>
      <BlogDetails
        blog={blog}
        user={user}
        isSuperAdmin={isSuperAdmin}
        id={id}
        queryClient={queryClient}
        setErrorMessage={setErrorMessage}
      />
      <Snackbar
        open={errorMessage ? true : false}
        autoHideDuration={6000}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </Box>
  );
};

export default BlogDetailPage;
