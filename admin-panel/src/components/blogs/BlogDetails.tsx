import {
  Box,
  TextField,
  Typography,
  Input,
  FormControl,
  Select,
  MenuItem,
  capitalize,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Blog } from "../../types/blog.types";
import { useRef, useState } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { editBlog } from "../../api/blog";
import { MeResponse } from "../../types/auth.types";

export default function BlogDetails({
  blog,
  queryClient,
  setErrorMessage,
  id,
  user,
  isSuperAdmin,
}: {
  blog: Blog;
  queryClient: QueryClient;
  setErrorMessage: (message: string) => void;
  id: string | undefined;
  user: MeResponse | null;
  isSuperAdmin: boolean;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState({
    title: "",
    content: "",
    status: "active",
    image: "" as string | File,
    category: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: mutateBlog, isPending } = useMutation({
    mutationFn: ({
      blogId,
      formData,
    }: {
      blogId: string;
      formData: FormData;
    }) => editBlog(blogId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
      setIsEditing(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log("error", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    },
  });
  const isEdited = () => {
    return (
      editedBlog.title !== blog?.title ||
      editedBlog.content !== blog?.content ||
      editedBlog.status !== blog?.status ||
      editedBlog.image !== blog?.image ||
      editedBlog.category !== blog?.category
    );
  };
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleSave = async () => {
    const edited = isEdited();
    if (id && editedBlog && edited) {
      console.log("editedBlog", editedBlog);
      const formdata = new FormData();
      formdata.append("title", editedBlog.title);
      formdata.append("content", editedBlog.content);
      formdata.append("category", editedBlog.category);
      formdata.append("status", editedBlog.status);
      formdata.append("image", editedBlog.image);

      mutateBlog({ blogId: id, formData: formdata });
    } else {
      setIsEditing(false);
    }
  };
  const handleEditToggle = () => {
    if (user?.name !== blog?.author.name && !isSuperAdmin) {
      setErrorMessage("You do not have permission to edit this blog.");
      console.log(user?.name, blog?.author.name);
      setIsEditing(false);
      return;
    }
    if (blog) {
      setEditedBlog({
        title: blog.title,
        content: blog.content,
        status: blog.status,
        image: blog.image,
        category: blog.category,
      });
    }
    setIsEditing(!isEditing);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setEditedBlog({
        ...editedBlog,
        image: file,
      });
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: { xs: "center", md: "normal" } }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isEditing ? (
              <TextField
                label="Blog Title"
                value={editedBlog.title}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, title: e.target.value })
                }
              />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  textWrap: "wrap",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                {blog.title}
              </Typography>
            )}

            {isEditing ? (
              <TextField
                label="Blog Content"
                value={editedBlog.content}
                onChange={(e) =>
                  setEditedBlog({ ...editedBlog, content: e.target.value })
                }
                multiline
                rows={6}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  textWrap: "wrap",
                  overflowWrap: "break-word",
                }}
              >
                {blog.content}
              </Typography>
            )}

            {isEditing && (blog.image || imagePreview) ? (
              <Box
                component="img"
                src={imagePreview || blog.image}
                alt={blog.title}
                sx={{
                  height: "auto",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: "primary.main",
                  maxWidth: "100%",
                  maxHeight: 800,
                  objectFit: "contain",
                }}
                onClick={handleImageClick}
              />
            ) : blog.image ? (
              <Box
                component="img"
                src={blog.image}
                alt={blog.title}
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: 800,
                  objectFit: "contain",
                }}
              />
            ) : null}

            {/* Hidden file input */}
            {isEditing && (
              <Input
                sx={{ display: "none" }}
                type="file"
                inputRef={fileInputRef}
                onChange={handleImageChange}
                inputProps={{ accept: "image/*" }}
              />
            )}
            {isEditing && !blog.image && !imagePreview && (
              <Input
                type="file"
                inputRef={fileInputRef}
                onChange={handleImageChange}
                inputProps={{ accept: "image/*" }}
              />
            )}
          </Box>
        </Grid>

        {/* Blog sidebar */}
        <Box
          component={"div"}
          sx={{
            position: "relative",
            width: { sx: "100%" },
            mt: "-50px",
          }}
        >
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              position: { xs: "static", md: "fixed" },
              right: { xs: "auto", md: 0 },
              width: { xs: "100%", md: "30%" },
              padding: { xs: 2, md: 4 },
              borderLeft: { xs: "none", md: "1px solid" },
              borderColor: { xs: "none", md: "divider" },
              height: { xs: "auto", md: "100%" },
              overflow: { xs: "visible", md: "auto" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="subtitle1">
                Author: {blog.author.name}
              </Typography>
              <Typography variant="subtitle2">
                Last updated: {new Date(blog.updated_at).toLocaleString()}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                component={"div"}
              >
                <Typography component={"span"} sx={{ mr: 2 }}>
                  Category
                </Typography>
                {isEditing ? (
                  <FormControl
                    sx={{
                      minWidth: 120,
                      ":focus": { borderColor: "green" },
                      height: 40,
                      ml: 1,
                      alignItems: "center",
                    }}
                    variant="outlined"
                  >
                    <Select
                      value={blog.category}
                      onChange={(e) =>
                        setEditedBlog({
                          ...editedBlog,
                          category: e.target.value,
                        })
                      }
                      size="small"
                      variant="outlined"
                    >
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="engineering">Engineering</MenuItem>
                      <MenuItem value="design">Design</MenuItem>
                      <MenuItem value="product">Product</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  capitalize(blog.category)
                )}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                component={"div"}
              >
                <Typography component={"span"} sx={{ mr: 2 }}>
                  Status
                </Typography>
                {isEditing ? (
                  <FormControl
                    sx={{
                      minWidth: 120,
                      ":focus": { borderColor: "green" },
                      height: 40,
                      ml: 1,
                      alignItems: "center",
                    }}
                    variant="outlined"
                  >
                    <Select
                      value={editedBlog.status}
                      onChange={(e) =>
                        setEditedBlog({ ...editedBlog, status: e.target.value })
                      }
                      size="small"
                      variant="outlined"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  capitalize(blog.status)
                )}
              </Typography>

              <Button
                variant="contained"
                onClick={isEditing ? handleSave : handleEditToggle}
                color={isEditing ? "primary" : "secondary"}
                disabled={isPending}
              >
                {isPending ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Edit Blog"
                )}
              </Button>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
