import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/\d{10}/, "Phone must be 10 digits")
    .required("Phone number is required"),
  contactMethod: Yup.string().required("Please select a contact method"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  totalMembers: Yup.number()
    .required("Please select total members")
    .min(1)
    .max(6),
  coverType: Yup.string().required("Please select a cover type"),
  adults: Yup.number().required("Please enter number of adults").min(1).max(6),
  children: Yup.number()
    .min(0)
    .max(2)
    .required("Please enter number of children"),

  additionalComments: Yup.string().max(
    500,
    "Comments cannot exceed 500 characters"
  ),
});
const generateAgeOptions = (start, end) => {
  let options = [];
  for (let i = start; i <= end; i++) {
    options.push(
      <MenuItem key={i} value={i}>
        {i}
      </MenuItem>
    );
  }
  return options;
};
const MyForm1 = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    contactMethod: "",
    pincode: "",
    totalMembers: "",
    coverType: "",
    adults: "",
    children: "",

    additionalComments: "",
  };
  const [tooltipText, setTooltipText] = useState(
    "Select Individual for single coverage, Floater for family coverage"
  );

  const [totalMembersOptions, setTotalMembersOptions] = useState([2, 3, 4]);
  const [adultsOptions, setadultsOptions] = useState([1, 2]);
  const contactOptions = ["WhatsApp Only", "Telegram Only", "Both"];

  const handleFieldChange = (event, setFieldValue, values) => {
    const { name, value } = event.target;
    setFieldValue(name, value);

    if (name === "coverType") {
      setTooltipText(
        value === "Individual"
          ? "Individual covers only one person."
          : "Floater covers the entire family."
      );
      setTotalMembersOptions(
        value === "Individual" ? [1, 2, 3, 4, 5, 6] : [2, 3, 4]
      );
      setadultsOptions(value === "Individual" ? [1, 2, 3, 4, 5, 6] : [1, 2]);
      setFieldValue("totalMembers", "");
      setFieldValue("adults", "");
    }

    if (name === "totalMembers") {
      if (values.coverType === "Individual") {
        setFieldValue("adults", Number(value));
        setFieldValue("children", 0);
        console.log("adults", Number(value));
      } else {
        setFieldValue("adults", 1);
        setFieldValue("children", Number(value) - 1);
      }
    }

    if (name === "adults") {
      if (values.totalMembers === 2) {
        if (value === 1) {
          setFieldValue("children", 1);
        } else {
          setFieldValue("children", 0);
        }
      }
      if (values.totalMembers === 3) {
        if (value === 1) {
          setFieldValue("children", 2);
        } else {
          setFieldValue("children", 1);
        }
      }
      if (values.totalMembers === 4) {
        if (value === 1) {
          setFieldValue("children", 3);
        } else {
          setFieldValue("children", 2);
        }
      }
    }

    if (name === "children") {
      if (value === 0) {
        setFieldValue("adults", 2);
      }
      if (value === 1) {
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Extract adult ages
      const adultAges = [];
      for (let i = 0; i < Number(values.adults); i++) {
        adultAges.push(values[`adultAge-${i}`]);
      }

      // Extract child ages
      const childAges = [];
      for (let i = 0; i < Number(values.children); i++) {
        childAges.push(values[`childAge-${i}`]);
      }

      // Create a structured payload
      const payload = {
        ...values,
        adultAges,
        childAges,
      };

      console.log("Sending Data:", payload);

      const response = await fetch("/api/sendToTelegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (result.success) {
        alert("Details sent to Telegram successfully! ✅");
        resetForm(); // Reset form after success
      } else {
        alert("Failed to send message ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending details ❌");
    } finally {
      setSubmitting(false);
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
      }}
    >
      <Typography variant="h5" gutterBottom>
        Way to Go! Bravo!!
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => {
          const isChildrenDisabled =
            values.coverType === "Floater" || values.coverType === "Individual";
          return (
            <Form>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Name"
                margin="normal"
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                fullWidth
                name="phone"
                label="Phone Number"
                margin="normal"
                variant="outlined"
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              <Field
                as={TextField}
                select
                fullWidth
                name="contactMethod"
                label="The Contact number is active on"
                margin="normal"
                variant="outlined"
                error={touched.contactMethod && Boolean(errors.contactMethod)}
                helperText={touched.contactMethod && errors.contactMethod}
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                value={values.contactMethod}
              >
                {contactOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                fullWidth
                name="pincode"
                label="Pincode (as per Aadhaar)"
                margin="normal"
                variant="outlined"
                error={touched.pincode && Boolean(errors.pincode)}
                helperText={touched.pincode && errors.pincode}
              />

              <Box display="flex" alignItems="center">
                <Field
                  as={TextField}
                  fullWidth
                  select
                  name="coverType"
                  label="Cover Type"
                  margin="normal"
                  variant="outlined"
                  onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                >
                  {["Individual", "Floater"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Field>
                <Tooltip title={tooltipText}>
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Field
                as={TextField}
                fullWidth
                select
                name="totalMembers"
                label="Total Members"
                margin="normal"
                variant="outlined"
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
              >
                {totalMembersOptions.map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
                {/* {[2, 3, 4].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))} */}
              </Field>

              <Field
                as={TextField}
                fullWidth
                select
                name="adults"
                label="Number of Adults"
                margin="normal"
                variant="outlined"
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                disabled={values.coverType === "Individual"} // Disable condition
              >
                {adultsOptions.map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
                {/* {[1, 2].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))} */}
              </Field>
              <Field
                as={TextField}
                fullWidth
                select
                name="children"
                label="Number of Children"
                margin="normal"
                variant="outlined"
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                disabled={isChildrenDisabled} // Disable condition
              >
                {[0, 1, 2, 3].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Field>
              {[...Array(Number(values.adults))].map((_, index) => (
                <Field
                  key={`adult-${index}`}
                  as={TextField}
                  fullWidth
                  select
                  name={`adultAge-${index}`}
                  label={`Adult ${index + 1} Age`}
                  margin="normal"
                  variant="outlined"
                >
                  {generateAgeOptions(18, 99)}
                </Field>
              ))}
              {[...Array(Number(values.children))].map((_, index) => (
                <Field
                  key={`child-${index}`}
                  as={TextField}
                  fullWidth
                  select
                  name={`childAge-${index}`}
                  label={`Child ${index + 1} Age`}
                  margin="normal"
                  variant="outlined"
                >
                  {generateAgeOptions(1, 24)}
                </Field>
              ))}

              <Field
                as={TextField}
                fullWidth
                name="additionalComments"
                label="Additional Comments"
                margin="normal"
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default MyForm1;
