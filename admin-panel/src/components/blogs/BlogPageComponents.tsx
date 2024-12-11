import {
  Box,
  AvatarGroup,
  Avatar,
  Typography,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Chip,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export function Author({
  name,
  updated_at,
}: {
  name: string;
  updated_at: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={3}>
          <Avatar
            alt={name}
            src="/static/images/avatar/1.jpg"
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption">{name}</Typography>
      </Box>
      <Typography variant="caption">
        {new Date(updated_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        })}
      </Typography>
    </Box>
  );
}

export function BlogSearchSmallScreen({
  handleOpenCreateDialog,
  setFilterTitle,
  filterTitle,
}: {
  handleOpenCreateDialog: () => void;
  setFilterTitle: (value: string) => void;
  filterTitle: string;
}) {
  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "row",
          gap: 1,
          width: { xs: "100%", md: "fit-content" },
          overflow: "auto",
        }}
      >
        <FormControl
          sx={{ width: { xs: "100%", md: "25ch" } }}
          variant="outlined"
        >
          <OutlinedInput
            size="small"
            id="search"
            placeholder="Search…"
            sx={{ flexGrow: 1 }}
            startAdornment={
              <InputAdornment position="start" sx={{ color: "text.primary" }}>
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              "aria-label": "search",
            }}
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </FormControl>
        <IconButton size="small" aria-label="RSS feed">
          <AddCircleOutlineIcon onClick={handleOpenCreateDialog} />
        </IconButton>
      </Box>
    </>
  );
}

export function BlogCategory({
  handleCategory,
  filterCategory,
  filterStatus,
  setFilterStatus,
  setFilterTitle,
  filterTitle,
  handleOpenCreateDialog,
}: {
  handleCategory: (category: string) => void;
  filterCategory: string;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  setFilterTitle: (value: string) => void;
  filterTitle: string;
  handleOpenCreateDialog: () => void;
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          width: "100%",
          justifyContent: "space-between",
          alignItems: { xs: "start", md: "center" },
          gap: 4,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            gap: 3,
            overflow: "auto",
          }}
        >
          <Chip
            onClick={() => handleCategory("all")}
            size="medium"
            label="All categories"
            sx={{
              backgroundColor:
                filterCategory === "" ? "primary.main" : "transparent",
              color: filterCategory === "" ? "white" : "text.primary",
              ":hover": { backgroundColor: "primary.main" },
            }}
          />
          <Chip
            onClick={() => handleCategory("company")}
            size="medium"
            label="Company"
            sx={{
              backgroundColor:
                filterCategory === "company" ? "primary.main" : "transparent",
              color: filterCategory === "company" ? "white" : "text.primary",
              ":hover": { backgroundColor: "primary.main" },
            }}
          />
          <Chip
            onClick={() => handleCategory("product")}
            size="medium"
            label="Product"
            sx={{
              backgroundColor:
                filterCategory === "product" ? "primary.main" : "transparent",
              color: filterCategory === "product" ? "white" : "text.primary",
              ":hover": { backgroundColor: "primary.main" },
            }}
          />
          <Chip
            onClick={() => handleCategory("design")}
            size="medium"
            label="Design"
            sx={{
              backgroundColor:
                filterCategory === "design" ? "primary.main" : "transparent",
              color: filterCategory === "design" ? "white" : "text.primary",
              ":hover": { backgroundColor: "primary.main" },
            }}
          />
          <Chip
            onClick={() => handleCategory("engineering")}
            size="medium"
            label="Engineering"
            sx={{
              backgroundColor:
                filterCategory === "engineering"
                  ? "primary.main"
                  : "transparent",
              color:
                filterCategory === "engineering" ? "white" : "text.primary",
              ":hover": { backgroundColor: "primary.main" },
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "row",
            gap: 1,
            width: { xs: "100%", md: "fit-content" },
            overflow: "auto",
          }}
        >
          <FormControl
            sx={{ minWidth: 120, ":focus": { borderColor: "green" } }}
            variant="standard"
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{ width: { xs: "100%", md: "25ch" } }}
            variant="outlined"
          >
            <OutlinedInput
              size="small"
              id="search"
              placeholder="Search…"
              sx={{ flexGrow: 1 }}
              startAdornment={
                <InputAdornment position="start" sx={{ color: "text.primary" }}>
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              }
              inputProps={{
                "aria-label": "search",
              }}
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
            />
          </FormControl>
          <IconButton size="small" aria-label="RSS feed">
            <AddCircleOutlineIcon onClick={handleOpenCreateDialog} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
