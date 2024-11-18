// src/components/Dashboard.tsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("Production");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleEnvClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEnvClose = (env: string) => {
    setSelectedEnv(env);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      {/* Top Bar */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Environment Menu */}
            <IconButton color="inherit" onClick={handleEnvClick}>
              {selectedEnv}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              sx={{ marginTop: "35px" }}
            >
              <MenuItem onClick={() => handleEnvClose("Production")}>Production</MenuItem>
              <MenuItem onClick={() => handleEnvClose("Pre PROD")}>Pre PROD</MenuItem>
              <MenuItem onClick={() => handleEnvClose("QA")}>QA</MenuItem>
            </Menu>

            {/* User Icon */}
            <Avatar sx={{ bgcolor: "primary.main", cursor: "pointer" }}>U</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content and Sidebar Layout */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* Sidebar (Drawer) */}
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={toggleDrawer}
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
            },
          }}
        >
          <List>
            <ListItem component={Link} to="/dashboard/get-config" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Get a Config" />
            </ListItem>
            <ListItem component={Link} to="/dashboard/view-config" sx={{ cursor: "pointer" }}>
              <ListItemText primary="View Config" />
            </ListItem>
            <ListItem component={Link} to="/dashboard/push-config" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Push a Config" />
            </ListItem>
            <ListItem component={Link} to="/dashboard/get-config-metadata" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Get Config Metadata" />
            </ListItem>
            <ListItem component={Link} to="/dashboard/create-config-id" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Create a New Config ID" />
            </ListItem>
            <ListItem component={Link} to="/dashboard/create-config" sx={{ cursor: "pointer" }}>
              <ListItemText primary="Create a New Config" />
            </ListItem>
          </List>
        </Drawer>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f5f5f5", // Lighter background for the main content area
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Dynamic page content */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
