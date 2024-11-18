import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import ReactJson from "react-json-view";

const PushConfig: React.FC = () => {
  const [configId, setConfigId] = useState<string>("");
  const [configData, setConfigData] = useState<any>({
    key1: "value1",
    key2: "value2",
    nested: {
      subKey: "subValue",
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleFetchConfig = () => {
    // Mock fetching config data by ID
    setConfigData({
      config_id: configId,
      scope: { name: "customer_id", value: "1960181845" },
      schema_version: "CONVIVA_DEFAULT_SCHEMA_VERSION",
      config_version: 1,
      config: {
        bypass_ip_list: ["172.20.10.2"],
        bypass_client_id_list: [],
        bypass_user_id_list: [],
        customer_id: 1960181845,
        white_list:
          '{"bypass_ip_list": ["10.30.240.2", "10.10.11.185", "10.30.240.13"], "bypass_client_id_list": [], "bypass_user_id_list": [], "customer_id": "1928809131"}',
      },
      comment: "chyang@conviva.com update white list",
      updated_by: "chyang@conviva.com",
      updated_at: "2024-06-17T07:23:50.000Z",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("Updated Config:", configData);
    alert("Config saved successfully!");
    setIsEditing(false);
  };

  const handleJsonChange = (edit: any) => {
    setConfigData(edit.updated_src);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
      >
        Push a Config
      </Typography>

      {/* Config ID Input */}
      <Grid container spacing={2} sx={{ mb: 3, width: "100%" }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Config ID"
            variant="outlined"
            fullWidth
            value={configId}
            onChange={(e) => setConfigId(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchConfig}
            disabled={!configId}
            sx={{
              borderRadius: 3,
              height: "100%",
              textTransform: "none",
            }}
          >
            Fetch Config
          </Button>
        </Grid>
      </Grid>

      {/* Code Editor */}
      {isEditing && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 2,
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Edit Config
          </Typography>

          <ReactJson
            src={configData}
            onEdit={handleJsonChange}
            onAdd={handleJsonChange}
            onDelete={handleJsonChange}
            theme="monokai"
            name={null}
            style={{
              borderRadius: "5px",
              padding: "10px",
            }}
            enableClipboard={false}
            displayDataTypes={false}
          />

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 3, textTransform: "none", borderRadius: 3 }}
            onClick={handleSave}
          >
            Save Config
          </Button>
        </Paper>
      )}

      {/* Placeholder if no editing */}
      {!isEditing && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          Enter a Config ID to fetch and edit the configuration.
        </Typography>
      )}
    </Box>
  );
};

export default PushConfig;
