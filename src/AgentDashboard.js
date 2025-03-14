import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const AgentDashboard = () => {
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const agentId = localStorage.getItem("agentId");
    if (!agentId) {
      alert("Please login first!");
      navigate("/agent-login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/agents-business/${agentId}/`)
      .then((response) => {
        setAgentDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching agent details:", error);
        alert("Failed to load agent data ❌");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );

  return (
    <Box sx={{ p: 3, width: "100%", overflowX: "hidden" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: "100%",
          width: "90%",
          mx: "auto",
          position: "relative",
        }}
      >
        {/* Home Icon Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            p: 0.5,
          }}
          onClick={() => navigate("/")} // Navigate to Home Page
        >
          <HomeIcon fontSize="large" />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          Welcome, {agentDetails.first_name} {agentDetails.surname}!
        </Typography>
        <Typography variant="subtitle1">
          Mobile: {agentDetails.mobile}
        </Typography>
        <Typography variant="subtitle1">
          Total Customers: {agentDetails.submissions.length}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Business Brought:
        </Typography>
        {agentDetails.submissions.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Phone</b>
                  </TableCell>
                  <TableCell>
                    <b>Cover Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Members</b>
                  </TableCell>
                  <TableCell>
                    <b>Created At</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agentDetails.submissions.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.cover_type}</TableCell>
                    <TableCell>{customer.total_members}</TableCell>
                    <TableCell>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No customers yet.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AgentDashboard;
