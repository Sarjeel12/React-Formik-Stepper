import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// List of all step names in the form
const steps = [
  "Personal Information",
  "Contact Information",
  "Address Information",
  "Account Security"
];

export const StepperForm = () => {
  // Track which step the user is currently on (0, 1, 2, or 3)
  const [activeStep, setActiveStep] = useState(0);

  // This object contains the starting values for all form fields
  // All fields start as empty strings or false for checkbox
  const initialValues = {
    // STEP 1 - Personal Information Fields
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: "",

    // STEP 2 - Contact Information Fields
    email: "",
    phoneNumber: "",
    alternatePhone: "",

    // STEP 3 - Address Information Fields
    country: "",
    state: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    apartment: "",

    // STEP 4 - Account Security Fields
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  // Create validation schemas for each step
  // Each step has its own validation rules
  const step1Validation = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
  });

  const step2Validation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
      .min(10, "Phone number must be at least 10 digits"),
    alternatePhone: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
  });

  const step3Validation = Yup.object({
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State/Province is required"),
    city: Yup.string().required("City is required"),
    postalCode: Yup.string().required("Postal code is required"),
    streetAddress: Yup.string().required("Street address is required"),
    apartment: Yup.string(),
  });

  const step4Validation = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    acceptTerms: Yup.boolean()
      .oneOf([true], "You must accept the Terms & Conditions"),
  });

  // Array of all validation schemas for each step
  const validationSchema = [
    step1Validation,
    step2Validation,
    step3Validation,
    step4Validation
  ];

  // This function returns which fields belong to each step
  const getStepFields = (stepNumber) => {
    // Create an object that maps step number to field names
    const fieldsByStep = {
      0: ["firstName", "lastName", "username", "dateOfBirth"],
      1: ["email", "phoneNumber", "alternatePhone"],
      2: ["country", "state", "city", "postalCode", "streetAddress", "apartment"],
      3: ["password", "confirmPassword", "acceptTerms"],
    };
    
    // Return the fields for the current step
    return fieldsByStep[stepNumber];
  };

  return (
    <Box sx={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      {/* TITLE OF THE FORM */}
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Multi-Step Registration Form
      </h2>

      {/* DISPLAY THE STEP INDICATORS AT THE TOP */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* FORMIK COMPONENT - Manages form state, validation, and submission */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema[activeStep]}
        onSubmit={(values) => {
          // This runs when the user clicks "Submit Registration"
          console.log("Form submitted:", values);
          alert("Registration completed successfully!");
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {/* This function receives form data and functions from Formik */}
        {({ values, errors, touched, validateForm, setFieldTouched }) => {
          
          // Function to handle clicking the "Next" button
          const handleNextStep = async () => {
            // Get all field names for the current step
            const currentStepFields = getStepFields(activeStep);
            
            // Run validation on all fields
            const validationErrors = await validateForm();

            // Mark all fields in this step as "touched" so errors show
            currentStepFields.forEach((fieldName) => {
              setFieldTouched(fieldName, true);
            });

            // Check if any field in this step has an error
            const hasAnyErrors = currentStepFields.some(
              (fieldName) => validationErrors[fieldName]
            );

            // If no errors, move to next step
            if (!hasAnyErrors) {
              // Check if this is NOT the last step
              if (activeStep < steps.length - 1) {
                // Move to next step
                setActiveStep(activeStep + 1);
              }
            }
          };

          return (
            <Form style={{ marginTop: "30px" }}>
              {/* CONTAINER FOR ALL FORM FIELDS */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                {/* ===== STEP 1: PERSONAL INFORMATION ===== */}
                {activeStep === 0 && (
                  <>
                    {/* First Name Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={values.firstName}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      autoComplete="given-name"
                    />

                    {/* Last Name Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={values.lastName}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      autoComplete="family-name"
                    />

                    {/* Username Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Username"
                      name="username"
                      value={values.username}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      autoComplete="username"
                    />

                    {/* Date of Birth Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ autoComplete: "bday", placeholder: "yyyy-mm-dd" }}
                      value={values.dateOfBirth}
                      error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                  </>
                )}

                {/* ===== STEP 2: CONTACT INFORMATION ===== */}
                {activeStep === 1 && (
                  <>
                    {/* Email Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                    />

                    {/* Phone Number Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      autoComplete="tel"
                    />

                    {/* Alternate Phone Number Field (Optional) */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Alternate Phone (Optional)"
                      name="alternatePhone"
                      value={values.alternatePhone}
                      error={touched.alternatePhone && Boolean(errors.alternatePhone)}
                      helperText={touched.alternatePhone && errors.alternatePhone}
                      autoComplete="tel"
                    />
                  </>
                )}

                {/* ===== STEP 3: ADDRESS INFORMATION ===== */}
                {activeStep === 2 && (
                  <>
                    {/* Country Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Country"
                      name="country"
                      value={values.country}
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                      autoComplete="country-name"
                    />

                    {/* State/Province Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="State/Province"
                      name="state"
                      value={values.state}
                      error={touched.state && Boolean(errors.state)}
                      helperText={touched.state && errors.state}
                      autoComplete="address-level1"
                    />

                    {/* City Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="City"
                      name="city"
                      value={values.city}
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                      autoComplete="address-level2"
                    />

                    {/* Postal Code Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Postal Code"
                      name="postalCode"
                      value={values.postalCode}
                      error={touched.postalCode && Boolean(errors.postalCode)}
                      helperText={touched.postalCode && errors.postalCode}
                      autoComplete="postal-code"
                    />

                    {/* Street Address Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Street Address"
                      name="streetAddress"
                      value={values.streetAddress}
                      error={touched.streetAddress && Boolean(errors.streetAddress)}
                      helperText={touched.streetAddress && errors.streetAddress}
                      autoComplete="street-address"
                    />

                    {/* Apartment/Suite Field (Optional) */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Apartment/Suite (Optional)"
                      name="apartment"
                      value={values.apartment}
                      error={touched.apartment && Boolean(errors.apartment)}
                      helperText={touched.apartment && errors.apartment}
                      autoComplete="address-line2"
                    />
                  </>
                )}

                {/* ===== STEP 4: ACCOUNT SECURITY ===== */}
                {activeStep === 3 && (
                  <>
                    {/* Password Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      autoComplete="new-password"
                    />

                    {/* Confirm Password Field */}
                    <Field
                      as={TextField}
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      autoComplete="new-password"
                    />

                    {/* Terms & Conditions Checkbox */}
                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          name="acceptTerms"
                          checked={values.acceptTerms}
                        />
                      }
                      label="I accept the Terms & Conditions"
                    />

                    {/* Show error if Terms checkbox is not checked */}
                    {touched.acceptTerms && errors.acceptTerms && (
                      <Box sx={{ color: "error.main", fontSize: "0.75rem", marginTop: "-10px" }}>
                        {errors.acceptTerms}
                      </Box>
                    )}
                  </>
                )}
              </Box>

              {/* ===== BUTTONS: BACK AND NEXT/SUBMIT ===== */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "40px",
                  gap: 2,
                }}
              >
                {/* BACK BUTTON - Disabled when on step 1 */}
                <Button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  variant="outlined"
                >
                  Back
                </Button>

                {/* NEXT OR SUBMIT BUTTON - Check if this is the last step */}
                {activeStep === steps.length - 1 ? (
                  // If last step, show SUBMIT button
                  <Button variant="contained" color="success" type="submit">
                    Submit Registration
                  </Button>
                ) : (
                  // If not last step, show NEXT button
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
