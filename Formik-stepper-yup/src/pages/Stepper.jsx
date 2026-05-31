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
} from "@mui/material";

const steps = ["Basic Info", "Personal Info", "Contact Info"];

export const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const initialValues = {
    name: "",
    email: "",
    education: "",
    age: "",
    contact: "",
  };

  const validationSchema = [
    Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
    }),
    Yup.object({
      education: Yup.string().required("Education is required"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be positive")
        .integer("Age must be an integer"),
    }),
    Yup.object({
      contact: Yup.string().required("Contact is required"),
    }),
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const getStepFields = (step) => {
    const fieldMap = {
      0: ["name", "email"],
      1: ["education", "age"],
      2: ["contact"],
    };
    return fieldMap[step];
  };

  return (
    <Box style={{ padding: "20px" }}>
      <h2>Multi-Step Form</h2>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema[activeStep]}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
          alert("Form submitted successfully!");
        }}
      >
        {({ values, errors, touched, isValid, validateForm, setFieldTouched }) => {
          const handleNextStep = async () => {
            const stepFields = getStepFields(activeStep);
            const newErrors = await validateForm();

            // Touch all fields in current step to show errors
            stepFields.forEach((field) => setFieldTouched(field, true));

            // Check if current step fields are valid
            const hasErrors = stepFields.some((field) => newErrors[field]);

            if (!hasErrors) {
              if (activeStep < steps.length - 1) {
                setActiveStep(activeStep + 1);
              }
            }
          };

          return (
          <Form style={{ marginTop: "20px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {activeStep === 0 && (
                <>
                  <Field
                    as={TextField}
                    label="Name"
                    name="name"
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Field
                    as={TextField}
                    label="Education"
                    name="education"
                    value={values.education}
                    error={touched.education && Boolean(errors.education)}
                    helperText={touched.education && errors.education}
                  />
                  <Field
                    as={TextField}
                    label="Age"
                    name="age"
                    type="number"
                    value={values.age}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age}
                  />
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Field
                    as={TextField}
                    label="Contact"
                    name="contact"
                    value={values.contact}
                    error={touched.contact && Boolean(errors.contact)}
                    helperText={touched.contact && errors.contact}
                  />
                </>
              )}
            </Box>


            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              ) : (
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
