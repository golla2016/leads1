import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Box,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import HomeIcon from "@mui/icons-material/Home";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  surname: Yup.string().required("Surname is required"),
  mobile: Yup.string()
    .matches(/^\d{10}$/, "Mobile must be 10 digits")
    .required("Mobile number is required"),
  contactMethod: Yup.string().required("Select where the mobile is active"),
  //   receiptMethod: Yup.string().required("Choose a preferred receipt method"),
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
  //   upiId: Yup.string().when("receiptMethod", {
  //     is: "UPI",
  //     then: () =>
  //       Yup.string()
  //         .matches(/^[\w.-]+@[\w.-]+$/, "Enter a valid UPI ID")
  //         .required("UPI ID is required"),
  //   }),
  //   bankAccount: Yup.string().when("receiptMethod", {
  //     is: "Bank",
  //     then: () =>
  //       Yup.string()
  //         .matches(/^\d{9,18}$/, "Enter a valid Bank Account number")
  //         .required("Bank account number is required"),
  //   }),
  profilePicture: Yup.mixed().required("Profile picture is required"),
  secretQuestion: Yup.string().required("Please select a secret question"),
  secretAnswer: Yup.string().required("Secret answer is required"),
});

const contactOptions = ["WhatsApp Only", "Telegram Only", "Both"];
const secretQuestions = [
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was your first car?",
  "What is the name of your favorite teacher?",
];
const AgentRegistration = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Preview the image
      setFieldValue("profilePicture", file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("surname", values.surname);
      formData.append("mobile", values.mobile);
      formData.append("contact_method", values.contactMethod);
      //   formData.append("receipt_method", values.receiptMethod);
      formData.append("password", values.password);
      formData.append("secretQuestion", values.secretQuestion);
      formData.append("secretAnswer", values.secretAnswer);

      //   if (values.receiptMethod === "UPI") {
      //     formData.append("upi_id", values.upiId);
      //   }
      //   if (values.receiptMethod === "Bank") {
      //     formData.append("bank_account", values.bankAccount);
      //     formData.append("ifsc_code", values.ifsccode);
      //   }

      if (values.agentId) {
        formData.append("agent", values.agentId); // Attach agent_id
      }

      if (values.profilePicture) {
        formData.append("profile_picture", values.profilePicture);
      }

      const response = await axios.post(
        "https://insurance-biz.onrender.com/api/agents/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 201) {
        alert("User Registered Successfully! ✅");
        resetForm();
      } else {
        alert("Failed to register user ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form ❌");
    } finally {
      console.log("Submitted Data:", values);
      alert("Form Submitted Successfully!");
      setSubmitting(false);
      resetForm();
      setProfileImage(null);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        position: "relative",
      }}
    >
      {/* Home Icon Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
        onClick={() => navigate("/")} // Navigate to Home Page
      >
        <HomeIcon fontSize="large" />
      </IconButton>
      <Typography variant="h5" gutterBottom>
        Registration Form
      </Typography>
      <Formik
        initialValues={{
          first_name: "",
          surname: "",
          mobile: "",
          contactMethod: "",
          //   receiptMethod: "",
          //   upiId: "",
          //   bankAccount: "",
          profilePicture: null,
          //   ifsccode: "",
          password: "",
          confirmPassword: "",
          secretQuestion: "",
          secretAnswer: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}

        // {(values, { setSubmitting, resetForm }) => {
        //   console.log("Submitted Data:", values);
        //   alert("Form Submitted Successfully!");
        //   setSubmitting(false);
        //   resetForm();
        //   setProfileImage(null);
        // }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form>
            {/* First Name */}
            <Field
              as={TextField}
              fullWidth
              name="first_name"
              label="First Name"
              margin="normal"
              variant="outlined"
              error={touched.first_name && Boolean(errors.first_name)}
              helperText={touched.first_name && errors.first_name}
            />

            {/* Surname */}
            <Field
              as={TextField}
              fullWidth
              name="surname"
              label="Surname"
              margin="normal"
              variant="outlined"
              error={touched.surname && Boolean(errors.surname)}
              helperText={touched.surname && errors.surname}
            />

            {/* Mobile Number */}
            <Field
              as={TextField}
              fullWidth
              name="mobile"
              label="Mobile Number"
              margin="normal"
              variant="outlined"
              error={touched.mobile && Boolean(errors.mobile)}
              helperText={touched.mobile && errors.mobile}
            />

            {/* Contact Method Dropdown */}
            <Field
              as={TextField}
              fullWidth
              select
              name="contactMethod"
              label="Mobile is active on"
              margin="normal"
              variant="outlined"
              error={touched.contactMethod && Boolean(errors.contactMethod)}
              helperText={touched.contactMethod && errors.contactMethod}
            >
              {contactOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field>

            {/* Receipt Method (Radio Buttons) */}
            {/* <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Preferred Receipt Method</FormLabel>
              <RadioGroup
                row
                name="receiptMethod"
                value={values.receiptMethod}
                onChange={handleChange}
              >
                <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                <FormControlLabel
                  value="Bank"
                  control={<Radio />}
                  label="Bank Transfer"
                />
              </RadioGroup>
            </FormControl> */}

            {/* Conditional Fields Based on Selection */}
            {values.receiptMethod === "UPI" && (
              <Field
                as={TextField}
                fullWidth
                name="upiId"
                label="UPI ID"
                margin="normal"
                variant="outlined"
                error={touched.upiId && Boolean(errors.upiId)}
                helperText={touched.upiId && errors.upiId}
              />
            )}

            {values.receiptMethod === "Bank" && (
              <>
                <Field
                  as={TextField}
                  fullWidth
                  name="bankAccount"
                  label="Bank Account Number"
                  margin="normal"
                  variant="outlined"
                  error={touched.bankAccount && Boolean(errors.bankAccount)}
                  helperText={touched.bankAccount && errors.bankAccount}
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="ifsccode"
                  label="IFSC Code"
                  margin="normal"
                  variant="outlined"
                  error={touched.ifsccode && Boolean(errors.ifsccode)}
                  helperText={touched.ifsccode && errors.ifsccode}
                />
              </>
            )}
            {/* Password Field (Always Hidden) */}
            <Field
              as={TextField}
              fullWidth
              name="password"
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VisibilityOff />
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password Field (Always Visible) */}
            <Field
              as={TextField}
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="text"
              margin="normal"
              variant="outlined"
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
            {/* Secret Question Dropdown */}
            <Field
              as={TextField}
              fullWidth
              select
              name="secretQuestion"
              label="Secret Question"
              margin="normal"
              variant="outlined"
              error={touched.secretQuestion && Boolean(errors.secretQuestion)}
              helperText={touched.secretQuestion && errors.secretQuestion}
            >
              {secretQuestions.map((question) => (
                <MenuItem key={question} value={question}>
                  {question}
                </MenuItem>
              ))}
            </Field>

            {/* Secret Answer Field */}
            <Field
              as={TextField}
              fullWidth
              name="secretAnswer"
              label="Secret Answer"
              margin="normal"
              variant="outlined"
              error={touched.secretAnswer && Boolean(errors.secretAnswer)}
              helperText={touched.secretAnswer && errors.secretAnswer}
            />

            {/* Profile Picture Upload */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body1">Upload Profile Picture</Typography>
              <input
                accept="image/*"
                type="file"
                onChange={(event) => handleImageChange(event, setFieldValue)}
                style={{ display: "none" }}
                id="profile-pic"
              />
              <label htmlFor="profile-pic">
                <Button variant="contained" component="span" sx={{ mt: 1 }}>
                  Upload Image
                </Button>
              </label>
              {profileImage && (
                <Avatar
                  src={profileImage}
                  sx={{ width: 100, height: 100, mt: 2, mx: "auto" }}
                />
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AgentRegistration;
