import React from "react";
import { AppBar, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        textAlign: "center",
        p: 2,
        mt: "auto",
      }}
    >
      <Typography variant="body2">© 2024 Admin Panel</Typography>
    </AppBar>
  );
};

export default Footer;
