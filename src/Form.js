import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

const MyForm = () => {
  const initialValues = { name: "", phone: "", message: "" };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Sending Data:", values);

      const response = await fetch("/api/sendToTelegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
        {({ isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              fullWidth
              name="name"
              label="Name"
              margin="normal"
              variant="outlined"
              error={!!ErrorMessage.name}
              helperText={<ErrorMessage name="name" />}
            />
            <Field
              as={TextField}
              fullWidth
              name="phone"
              label="Phone Number"
              margin="normal"
              variant="outlined"
              error={!!ErrorMessage.phone}
              helperText={<ErrorMessage name="phone" />}
            />
            <Field
              as={TextField}
              fullWidth
              name="message"
              label="Message"
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              error={!!ErrorMessage.message}
              helperText={<ErrorMessage name="message" />}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MyForm;
