import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { mockConfig } from "../data/config";
import { useNavigate } from "react-router";

const ViewConfig: React.FC = () => {
  const [configData, setConfigData] = useState(mockConfig);
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [jsonPath, setJsonPath] = useState("");
  const [jsonPathResult, setJsonPathResult] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handlePrettyPrintToggle = () => setPrettyPrint((prev) => !prev);

  const navigate = useNavigate();

  const handleJsonPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJsonPath(e.target.value);
  };

  const handleApplyJsonPath = () => {
    try {
      const result = getJsonPathResult(configData, jsonPath);
      setJsonPathResult(result);
    } catch (error) {
      setJsonPathResult("Invalid JSON Path");
    }
  };

  const getJsonPathResult = (data: any, path: string): any => {
    const keys = path.split(".");
    let result = data;
    for (let key of keys) {
      result = result[key];
      if (!result) return null;
    }
    return result;
  };

  const handleEditConfig = () => {
    navigate("/dashboard/push-config");
    setOpenDialog(true); // Show edit dialog
  };

  const handleDeleteConfig = () => {
    setOpenDialog(true); // Show delete confirmation dialog
  };

  // JSON pretty print view
  const configJsonString = JSON.stringify(configData, null, 2);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
        View Config
      </Typography>

      {/* Pretty Print Toggle */}
      <FormControlLabel
        control={<Switch checked={prettyPrint} onChange={handlePrettyPrintToggle} />}
        label="Pretty Print"
        sx={{ mb: 3 }}
      />

      {/* Config Display */}
      <Paper sx={{ width: "100%", p: 4, mb: 3, backgroundColor: "#ffffff", boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>Config Data:</Typography>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", backgroundColor: "#f4f4f4", padding: "16px", borderRadius: "8px", fontSize: "1rem" }}>
              {prettyPrint ? configJsonString : JSON.stringify(configData)}
            </pre>
          </Grid>
        </Grid>
      </Paper>

      {/* JSON Path Field */}
      <TextField
        label="JSON Path"
        variant="outlined"
        value={jsonPath}
        onChange={handleJsonPathChange}
        fullWidth
        sx={{
          mb: 3,
          backgroundColor: "#ffffff",
          "& .MuiInputBase-root": { borderRadius: "8px" },
        }}
        placeholder="Enter JSON path (e.g., nested.key3)"
      />

      {/* Button to apply JSON Path */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyJsonPath}
        sx={{ mb: 3, borderRadius: 3, height: 50, width: "auto" }}
      >
        Apply JSON Path
      </Button>

      {/* Display JSON Path result */}
      {jsonPathResult && (
        <Paper sx={{ width: "100%", p: 3, mb: 3, backgroundColor: "#ffffff", boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>JSON Path Result:</Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", backgroundColor: "#f4f4f4", padding: "16px", borderRadius: "8px", fontSize: "1rem" }}>
            {JSON.stringify(jsonPathResult, null, 2)}
          </pre>
        </Paper>
      )}

      {/* Buttons for Edit and Delete */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEditConfig}
            fullWidth
            sx={{
              height: 50,
              borderRadius: 3,
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Edit Config
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteConfig}
            fullWidth
            sx={{
              height: 50,
              borderRadius: 3,
              fontWeight: "bold",
              borderColor: "#d32f2f",
              "&:hover": { borderColor: "#b71c1c", backgroundColor: "#ffebee" },
            }}
          >
            Delete Config
          </Button>
        </Grid>
      </Grid>

      {/* Edit/Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Are you sure you want to proceed with this action?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log("Action confirmed");
              setOpenDialog(false);
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewConfig;
