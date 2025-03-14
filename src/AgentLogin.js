import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";

import HomeIcon from "@mui/icons-material/Home";

const validationSchema = Yup.object({
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  password: Yup.string().required("Password is required"),
});

const AgentLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/agent-login/",
        values
      );
      if (response.status === 200) {
        localStorage.setItem("agentId", response.data.agent_id); // Store Agent ID
        navigate("/agent-dashboard"); // Redirect to dashboard
      } else {
        alert("Invalid mobile number or password ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "90%",
          maxWidth: 400,
          textAlign: "center",
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
          Agent Login
        </Typography>
        <Formik
          initialValues={{ mobile: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="mobile"
                label="Mobile Number"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.mobile && Boolean(errors.mobile)}
                helperText={touched.mobile && errors.mobile}
              />
              <Field
                as={TextField}
                type="password"
                name="password"
                label="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              {/* Forgot Password Link */}
              <Box sx={{ mt: 2 }}>
                <Link
                  component="button"
                  variant="body2"
                  to="/forgot-password"
                  //   onClick={() => navigate("/forgot-password")}
                  sx={{
                    textDecoration: "none",
                    cursor: "pointer",
                    color: "blue",
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AgentLogin;
