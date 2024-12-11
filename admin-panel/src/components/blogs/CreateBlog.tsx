import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "../../api/blog";

interface CreateBlogFormProps {
  open: boolean;
  handleClose: () => void;
}

const CreateBlogForm: React.FC<CreateBlogFormProps> = ({
  open,
  handleClose,
}) => {
  const queryClient = useQueryClient();
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    status: "inactive",
    category: "other",
    image: "" as string | File,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate: mutateNewBlog, isPending } = useMutation({
    mutationFn: (formData: FormData) => createBlog(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setNewBlog({
        title: "",
        content: "",
        status: "inactive",
        category: "other",
        image: "",
      });
      handleClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setError(error.response.data.error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setNewBlog({
        ...newBlog,
        image: file,
      });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setNewBlog({ ...newBlog, image: "" });
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("category", newBlog.category);
    formData.append("status", newBlog.status);
    if (newBlog.image instanceof File) {
      formData.append("image", newBlog.image);
    }
    mutateNewBlog(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Blog</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newBlog.content}
            onChange={(e) =>
              setNewBlog({ ...newBlog, content: e.target.value })
            }
          />

          {/* Image Preview and Upload */}
          {imagePreview ? (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Image Preview"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: 2,
                }}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleRemoveImage}
              >
                Remove Image
              </Button>
            </Box>
          ) : (
            <Input type="file" onChange={handleImageChange} />
          )}

          {/* Category Selection */}
          <Typography
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControl
              sx={{
                minWidth: 120,
                ":focus": { borderColor: "green" },
                height: 40,
                ml: 1,
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}
              variant="outlined"
            >
              <Typography component={"span"} sx={{ mr: 2 }}>
                Category
              </Typography>
              <Select
                value={newBlog.category}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, category: e.target.value })
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

            <FormControl
              sx={{
                minWidth: 120,
                ":focus": { borderColor: "green" },
                height: 40,
                ml: 1,
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}
              variant="outlined"
            >
              <Typography component={"span"} sx={{ m: 2 }}>
                Status
              </Typography>
              <Select
                value={newBlog.status}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, status: e.target.value })
                }
                size="small"
                variant="outlined"
              >
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="active">Active</MenuItem>
              </Select>
            </FormControl>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {isPending ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Save"
          )}
        </Button>
      </DialogActions>
      <Snackbar
        open={error ? true : false}
        autoHideDuration={6000}
        message={error}
        onClose={() => setError("")}
      />
    </Dialog>
  );
};

export default CreateBlogForm;
