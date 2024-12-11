import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../context/themeContext/useThemeContext";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme as MUITheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/authContext/useAuth";

const Navbar: React.FC = () => {
  const { toggleTheme, mode } = useTheme();
  const { logout, isSuperAdmin } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = MUITheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            component={Link}
            variant="h6"
            to={"/"}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
              width: { xs: "100px", sm: "200px" },
            }}
          >
            Admin Panel
          </Typography>
        </Typography>

        {/* For Mobile */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Drawer for mobile     */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {isSuperAdmin && (
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/admins">
                        <ListItemText primary="Admins" />
                      </ListItemButton>
                    </ListItem>
                  )}
                  <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                      <ListItemText primary="Blogs" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={toggleTheme}>
                      <ListItemIcon>
                        {mode === "light" ? (
                          <Brightness4Icon style={{ color: "gray" }} />
                        ) : (
                          <Brightness7Icon style={{ color: "wheat" }} />
                        )}
                      </ListItemIcon>
                      <ListItemText primary="Toggle Theme" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={logout}>
                      <ListItemIcon>
                        <LogoutIcon color="error" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          // For Desktop
          <Box sx={{ display: "flex", gap: 2 }}>
            {isSuperAdmin && (
              <Button color="inherit" component={Link} to="/admins">
                Admins
              </Button>
            )}
            <Button color="inherit" component={Link} to="/">
              Blogs
            </Button>
            <Button color="inherit" onClick={toggleTheme}>
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </Button>
            <Button color="inherit" onClick={logout}>
              <LogoutIcon />
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
