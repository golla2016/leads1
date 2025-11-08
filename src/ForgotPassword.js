import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [agentData, setAgentData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Mocked backend response
  //   const agents = [
  //     {
  //       mobile: "1234567890",
  //       secretQuestion: "Your pet's name?",
  //       secretAnswer: "Fluffy",
  //       password: "Pass@123",
  //     },
  //     {
  //       mobile: "9876543210",
  //       secretQuestion: "Your birthplace?",
  //       secretAnswer: "NewYork",
  //       password: "Secure@456",
  //     },
  //   ];

  useEffect(() => {
    axios
      .get("https://insurance-biz.onrender.com/api/agents/")
      .then((response) => {
        console.log("Agents Data:", response.data);
        setAgentData(response.data); // ✅ Store agents correctly
        // setFilteredAgents(response.data); // ✅ Initialize filtered agents list
      })
      .catch((error) => console.error("Error fetching agents:", error));
  }, []);

  const validationSchema = Yup.object().shape({
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    secretAnswer: selectedAgent
      ? Yup.string()
          .required("Secret answer is required")
          .test(
            "match",
            "Incorrect answer",
            (value) => value === selectedAgent.secretAnswer
          )
      : Yup.string(),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain a number")
      .matches(/[!@#$%^&*]/, "Password must contain a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        "https://insurance-biz.onrender.com/api/update-password/",
        values
      );
      if (response.status === 200) {
        alert("Password updated successfully");
      }
      resetForm();
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed ❌");
    } finally {
      setSubmitting(false);
      setSelectedAgent("");
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
          display: "flex", // Ensures no overlap
          flexDirection: "column",
          minHeight: "auto", // Allows content to expand
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
          Forgot Password
        </Typography>
        <Formik
          initialValues={{
            mobile: "",
            secretAnswer: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              {/* Mobile Number Field */}
              <Field
                as={TextField}
                name="mobile"
                label="Mobile Number"
                fullWidth
                margin="normal"
                variant="outlined"
                onBlur={(e) => {
                  handleBlur(e);
                  const foundAgent = agentData.find(
                    (agent) => agent.mobile === e.target.value
                  );
                  if (foundAgent) {
                    setSelectedAgent(foundAgent);
                    setError("");
                  } else {
                    setSelectedAgent(null);
                    setError("Mobile number not found.");
                  }
                }}
                error={!!error}
                helperText={error}
              />
              <ErrorMessage
                name="mobile"
                component="div"
                style={{ color: "red", fontSize: "12px" }}
              />

              {/* Show secret question & answer only if mobile is found */}
              {selectedAgent && (
                <>
                  <TextField
                    label="Secret Question"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={selectedAgent.secretQuestion}
                    disabled
                  />

                  <Field
                    as={TextField}
                    name="secretAnswer"
                    label="Your Answer"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="secretAnswer"
                    component="div"
                    style={{ color: "red", fontSize: "12px" }}
                  />
                </>
              )}

              {/* Show password fields if secret answer is correct */}
              {selectedAgent &&
                values.secretAnswer === selectedAgent.secretAnswer && (
                  <>
                    <Field
                      as={TextField}
                      name="password"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      style={{ color: "red", fontSize: "12px" }}
                    />

                    <Field
                      as={TextField}
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      style={{ color: "red", fontSize: "12px" }}
                    />
                  </>
                )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "15px" }}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
