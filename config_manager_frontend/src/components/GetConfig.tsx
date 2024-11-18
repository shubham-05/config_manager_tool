import React, { useState } from "react";
import { Box, Button, TextField, Typography, Tab, Tabs, Grid, Paper, CircularProgress, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { useNavigate } from "react-router";

const GetConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Config ID, 1: Config History
  const [configId, setConfigId] = useState("");
  const [configName, setConfigName] = useState("");
  const [numVersions, setNumVersions] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // For Config ID popup
  const [selectedConfigId, setSelectedConfigId] = useState(""); // For selected config ID in popup

  const navigate = useNavigate();

  // Sample Config IDs for the dialog
  const sampleConfigIds = [
    { id: "config-001", name: "Config A" },
    { id: "config-002", name: "Config B" },
    { id: "config-003", name: "Config C" },
    { id: "config-004", name: "Config D" },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFetchConfig = () => {
    setIsLoading(true);
    // Simulate an API call (replace with actual logic)
    setTimeout(() => {
      console.log(`Fetching config with ID: ${configId}`);
      setIsLoading(false);
    }, 2000);

    navigate("/dashboard/view-config")
  };

  const handleFetchConfigHistory = () => {
    setIsLoading(true);
    // Simulate an API call for fetching history
    setTimeout(() => {
      console.log(`Fetching history for ${configName}, ${numVersions} versions`);
      setIsLoading(false);
    }, 2000);
  };

  // Open the Config ID popup
  const handleOpenDialog = () => setOpenDialog(true);

  // Close the Config ID popup
  const handleCloseDialog = () => setOpenDialog(false);

  // Select a Config ID from the list
  const handleSelectConfigId = (configId: string) => {
    setSelectedConfigId(configId);
    setConfigId(configId); // Set the selected config ID
    setOpenDialog(false); // Close the popup
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Get a Config
      </Typography>

      {/* Tabs to switch between fetching by Config ID and Config History */}
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ mb: 3 }}>
        <Tab label="By Config ID" />
        <Tab label="By Config History" />
      </Tabs>

      {/* Content for Config ID fetch */}
      {activeTab === 0 && (
        <Paper sx={{ width: "100%", p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Config ID"
                variant="outlined"
                value={configId}
                onChange={(e) => setConfigId(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter Config ID"
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Enter the unique ID for the config">
                      <HelpOutline color="action" />
                    </Tooltip>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFetchConfig}
                fullWidth
                disabled={isLoading || !configId}
                sx={{ height: 50 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Fetch Config"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Content for Config History fetch */}
      {activeTab === 1 && (
        <Paper sx={{ width: "100%", p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Config Name"
                variant="outlined"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter Config Name"
                InputProps={{
                  endAdornment: (
                    <Tooltip title="Enter the name of the config to fetch history">
                      <HelpOutline color="action" />
                    </Tooltip>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Versions"
                variant="outlined"
                value={numVersions}
                onChange={(e) => setNumVersions(Number(e.target.value))}
                fullWidth
                sx={{ mb: 2 }}
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDialog} // Open Config ID selection dialog
                fullWidth
                sx={{ height: 50 }}
              >
                Select Config ID
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFetchConfigHistory}
                fullWidth
                disabled={isLoading || !configName || numVersions < 1 || !configId}
                sx={{ height: 50 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Fetch Config History"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Config ID Selection Dialog (Popup) */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Config ID</DialogTitle>
        <DialogContent>
          <List>
            {sampleConfigIds.map((config) => (
              <ListItem key={config.id} onClick={() => handleSelectConfigId(config.id)}>
                <ListItemText primary={config.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GetConfig;
