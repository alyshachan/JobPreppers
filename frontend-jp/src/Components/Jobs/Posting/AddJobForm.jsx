import { useState, Fragment, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import ApplicationProcess from "./StepsInForms/ApplicationProcess";
import DescribeJob from "./StepsInForms/DescribeJob";
import Benefits from "./StepsInForms/Benefits";
import Qualification from "./StepsInForms/Qualification";

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
  const [eventDetails, setEventDetails] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Describe Your Job",
    "Benefits and Compensation",
    "Qualification for Position",
    "Application Process",
  ];

  const pageDisplay = () => {
    switch (activeStep) {
      case 0:
        return <DescribeJob />;
      case 1:
        return <Benefits />;
      case 2:
        return <Qualification />;
      case 3:
        return <ApplicationProcess />;
    }
  };
  const lastStep = activeStep === steps.length - 1;
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setActiveStep(0);
    handleClose();
  };

  return (
    <>
      <Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open form dialog
        </Button>
      </Fragment>
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
              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
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
    </>
  );
}
