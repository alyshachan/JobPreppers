import { useState, Fragment, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { FormProvider, useForm } from "react-hook-form";
import ApplicationProcess from "./StepsInForms/ApplicationProcess";
import DescribeJob from "./StepsInForms/DescribeJob";
import Benefits from "./StepsInForms/Benefits";
import Qualification from "./StepsInForms/Qualification";
import { yupResolver } from "@hookform/resolvers/yup";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
    borderRadius: "30px",
    margin: "-20px",
    padding: "0px 20px 20px",
    overflow: "auto",
    maxWidth: "1000px",
    minWidth: "1000px",
  },
}));

export default function AddJobForm() {
  // State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const jobForm = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {
    handleSubmit,
    formState: { error, isSubmitting },
  } = jobForm;

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Describe Your Job",
    "Benefits and Compensation",
    "Qualification for Position",
    "Application Process",
  ];

  const lastStep = activeStep === steps.length - 1;
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data, e) => {
    console.log("Form Data Submitted: ", data);

    setActiveStep(0);
    handleClose();
  };

  const pageDisplay = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormProvider {...jobForm}>
            <DescribeJob formData={formData} setFormData={setFormData} />
          </FormProvider>
        );

      case 1:
        return (
          <FormProvider {...jobForm}>
            <Benefits formData={formData} setFormData={setFormData} />
          </FormProvider>
        );
      case 2:
        return (
          <FormProvider {...jobForm}>
            <Qualification formData={formData} setFormData={setFormData} />;
          </FormProvider>
        );
      case 3:
        return (
          <FormProvider {...jobForm} onSubmit={handleSubmit(onSubmit)}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {" "}
              {/* Wrap in form and use handleSubmit */}
              <ApplicationProcess
                formData={formData}
                setFormData={setFormData}
              />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        );
    }
  };

  return (
    <>
      <Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>
      </Fragment>
      <form>
        <StyledDialog onClose={handleClose} open={open}>
          <header>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <DialogTitle>
              <h1 sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}: {steps[activeStep]}
              </h1>
            </DialogTitle>
          </header>

          <body>{pageDisplay()}</body>

          {activeStep === steps.length - 1 ? (
            <Fragment>
              <footer>
                <button
                  disabled={activeStep == 0}
                  style={{ display: activeStep === 0 ? "none" : "block" }}
                  onClick={handleBack}
                >
                  Back
                </button>
                {/* <Button disabled={isSubmitting} type="submit">
                  Submit
                </Button> */}
              </footer>
            </Fragment>
          ) : (
            <Fragment>
              <footer>
                <button
                  disabled={activeStep == 0}
                  style={{ display: activeStep === 0 ? "none" : "block" }}
                  onClick={handleBack}
                >
                  Back
                </button>
                <button onClick={handleNext}>
                  {/* {lastStep ? "Submit" : "Next"} */}
                  Next
                </button>
              </footer>
            </Fragment>
          )}
        </StyledDialog>
        <pre>{JSON.stringify(jobForm.watch(), null, 2)}</pre>
      </form>
    </>
  );
}
