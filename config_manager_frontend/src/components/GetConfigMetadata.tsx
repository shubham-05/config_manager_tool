import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

// Mock data generator
const generateMockData = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    config_id: 29915 + i,
    updated_at: "2024-11-08T07:01:22.000Z",
    config_version: 110 + i,
    created_at: "2024-02-06T07:35:09.000Z",
    created_by: `test_user_${i}`,
    comment: `Comment ${i}`,
    scope: {
      name: "customer_id",
      value: `192880913${i + 1}`,
    },
  }));
};

const GetConfigMetadata: React.FC = () => {
  const [configName, setConfigName] = useState("");
  const [fields, setFields] = useState<string>("");
  const [data, setData] = useState<any[]>(generateMockData());
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleFetchMetadata = () => {
    // Mock filter logic for the data
    const selectedFields = fields.split(",").map((field) => field.trim());
    const formattedData = data.map((item) =>
      selectedFields.reduce((acc, field) => {
        const keys = field.split(".");
        let value = item;
        keys.forEach((key) => {
          value = value ? value[key] : undefined;
        });
        acc[field] = value || "N/A";
        return acc;
      }, {} as any)
    );
    setFilteredData(formattedData);
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
        Get Config Metadata
      </Typography>

      {/* Input Section */}
      <Grid container spacing={2} sx={{ width: "100%", mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Config Name"
            variant="outlined"
            fullWidth
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fields (comma-separated)"
            variant="outlined"
            fullWidth
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            sx={{
              backgroundColor: "#ffffff",
              "& .MuiInputBase-root": { borderRadius: "8px" },
            }}
            placeholder="e.g., config_id, updated_at, scope.value"
          />
        </Grid>
      </Grid>

      {/* Fetch Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleFetchMetadata}
        sx={{
          mb: 3,
          borderRadius: 3,
          height: 50,
          width: "auto",
          textTransform: "none",
        }}
      >
        Fetch Metadata
      </Button>

      {/* Table Section */}
      {filteredData.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#ffffff", boxShadow: 3, borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {fields.split(",").map((field, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#1976d2",
                      color: "#ffffff",
                    }}
                  >
                    {field.trim()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.values(row).map((value, cellIdx) => (
                    <TableCell key={cellIdx}>
                      {typeof value === "object" ? JSON.stringify(value) : (value as string || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Placeholder if no data */}
      {filteredData.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 3 }}>
          No data to display. Enter a config name and fields to fetch metadata.
        </Typography>
      )}
    </Box>
  );
};

export default GetConfigMetadata;
