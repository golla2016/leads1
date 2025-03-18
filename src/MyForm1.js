import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Tooltip,
  Autocomplete,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  first_name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/\d{10}/, "Phone must be 10 digits")
    .required("Phone number is required"),
  contact_method: Yup.string().required("Please select a contact method"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
  total_members: Yup.number()
    .required("Please select total members")
    .min(1)
    .max(6),
  cover_type: Yup.string().required("Please select a cover type"),
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
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    contact_method: "",
    pincode: "",
    total_members: "",
    cover_type: "",
    adults: "",
    children: "",
    agentId: "",
    additionalComments: "",
    unique_id: "",
  };
  const [tooltipText, setTooltipText] = useState(
    "Select Individual for single coverage, Floater for family coverage"
  );

  const [total_membersOptions, settotal_membersOptions] = useState([2, 3, 4]);
  const [adultsOptions, setadultsOptions] = useState([1, 2]);
  const contactOptions = ["WhatsApp Only", "Telegram Only", "Both"];
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]); // For search feature

  // Generate Unique ID (First 4 letters of name + date)
  const generateunique_id = (name) => {
    if (!name) return "";
    const shortName = name.slice(0, 4).toUpperCase();
    const date = new Date().toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    return `${shortName}${date}`;
  };

  useEffect(() => {
    axios
      .get("https://insurance-biz.onrender.com/api/agents/")
      .then((response) => {
        console.log("Agents Data:", response.data);
        setAgents(response.data); // ✅ Store agents correctly
        setFilteredAgents(response.data); // ✅ Initialize filtered agents list
      })
      .catch((error) => console.error("Error fetching agents:", error));
  }, []);

  // Handle search filter in dropdown
  const handleAgentSearch = (event, setFieldValue) => {
    const searchValue = event.target.value.toLowerCase();
    setFieldValue("agentId", searchValue);
    setFilteredAgents(
      agents.filter((id) => id.toLowerCase().includes(searchValue))
    );
  };

  const handleFieldChange = (event, setFieldValue, values) => {
    const { name, value } = event.target;
    setFieldValue(name, value);

    if (name === "cover_type") {
      setTooltipText(
        value === "Individual"
          ? "Individual covers only one person."
          : "Floater covers the entire family."
      );
      settotal_membersOptions(
        value === "Individual" ? [1, 2, 3, 4, 5, 6] : [2, 3, 4]
      );
      setadultsOptions(value === "Individual" ? [1, 2, 3, 4, 5, 6] : [1, 2]);
      setFieldValue("total_members", "");
      setFieldValue("adults", "");
    }

    if (name === "total_members") {
      if (values.cover_type === "Individual") {
        setFieldValue("adults", Number(value));
        setFieldValue("children", 0);
        console.log("adults", Number(value));
      } else {
        setFieldValue("adults", 1);
        setFieldValue("children", Number(value) - 1);
      }
    }

    if (name === "adults") {
      if (values.total_members === 2) {
        if (value === 1) {
          setFieldValue("children", 1);
        } else {
          setFieldValue("children", 0);
        }
      }
      if (values.total_members === 3) {
        if (value === 1) {
          setFieldValue("children", 2);
        } else {
          setFieldValue("children", 1);
        }
      }
      if (values.total_members === 4) {
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

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldValue }
  ) => {
    try {
      const unique_id = generateunique_id(values.name);
      await setFieldValue("unique_id", unique_id);

      // ✅ Find the selected agent by ID

      const selectedAgent = agents.find((agent) => agent.id === values.agentId);
      const agentName = selectedAgent
        ? `${selectedAgent.first_name} ${selectedAgent.surname}`
        : "Unknown";

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
        unique_id,
        adultAges,
        childAges,
        agent: values.agentId, // ✅ Assigning the agent ID as foreign key
        agent_name: agentName,
      };

      console.log("Sending Data:", payload);

      /** ✅ 1️⃣ Send Data to Telegram */
      const telegramResponse = await fetch("/api/sendToTelegram/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const telegramResult = await telegramResponse.json();
      console.log("Telegram Response:", telegramResult);

      if (!telegramResult.success) {
        console.error("Telegram API Error:", telegramResult);
        alert("Error sending message to Telegram ❌");
        return;
      }

      /** ✅ 2️⃣ Post Data to Django Backend */
      const backendResponse = await axios.post(
        "https://insurance-biz.onrender.com/api/customer-forms/",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Backend Response:", backendResponse.data);

      if (backendResponse.status === 201) {
        console.log(backendResponse);

        alert(
          "Congratulations !! Your form is submitted. Our team will revert with Best Plan soon. Woo Hoo !! ✅"
        );
        console.log(
          "Congratulations !! Your form is submitted. Our team will revert with Best Plan soon. Woo Hoo !! ✅"
        );
        resetForm(); // ✅ Reset form after success
      } else {
        throw new Error("Failed to post data to the backend ❌");
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
        Way to Go! Bravo!!
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values, handleChange }) => {
          const isChildrenDisabled =
            values.cover_type === "Floater" ||
            values.cover_type === "Individual";
          return (
            <Form>
              <Field
                as={TextField}
                fullWidth
                name="first_name"
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
                name="contact_method"
                label="The Contact number is active on"
                margin="normal"
                variant="outlined"
                error={touched.contact_method && Boolean(errors.contact_method)}
                helperText={touched.contact_method && errors.contact_method}
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                value={values.contact_method}
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
                  name="cover_type"
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
                name="total_members"
                label="Total Members"
                margin="normal"
                variant="outlined"
                onChange={(e) => handleFieldChange(e, setFieldValue, values)}
                disabled={!values.cover_type} // ✅ Disabled until cover_type is selected
              >
                {total_membersOptions.map((num) => (
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
                disabled={values.cover_type === "Individual"} // Disable condition
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

              <Autocomplete
                options={filteredAgents} // ✅ Use filtered list for search
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.surname}`
                } // ✅ Show agent name
                value={
                  agents.find((agent) => agent.id === values.agentId) || null
                } // ✅ Match selected agent by ID
                onChange={(event, newValue) => {
                  setFieldValue("agentId", newValue ? newValue.id : ""); // ✅ Store only the ID
                }}
                onInputChange={(event, inputValue) => {
                  // ✅ Search Functionality: Filter agent names dynamically
                  setFilteredAgents(
                    agents.filter((agent) =>
                      `${agent.first_name} ${agent.surname}`
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Agent ID"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
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
