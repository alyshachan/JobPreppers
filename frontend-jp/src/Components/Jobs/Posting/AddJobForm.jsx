import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SectionHeader from "../../Profile/SectionHeader";
import { Input } from "@mui/material";
import { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import ApplicationProcess from "./StepsInForms/ApplicationProcess";
import DescribeJob from "./StepsInForms/DescribeJob";
import Benefits from "./StepsInForms/Benefits";
import Qualification from "./StepsInForms/Qualification";

export default function AddJobForm() {
  // State
  const [eventDetails, setEventDetails] = useState("");
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const lastStep = activeStep === steps.length - 1;

  return (
    <>
      {/* <DialogTitle>
        <SectionHeader header="Add Job Position" />
      </DialogTitle>

      
      <DialogContent> */}
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
        <h1 sx={{ mt: 2, mb: 1 }}>
          Step {activeStep + 1}: {steps[activeStep]}
        </h1>
      </header>

      <body>{pageDisplay()}</body>

      {activeStep === steps.length ? (
        <React.Fragment>
          <footer>
            <button onClick={setActiveStep(0)}>Reset</button>
          </footer>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <footer>
            <button
              disabled={activeStep == 0}
              style={{ display: activeStep === 0 ? "none" : "block" }}
              onClick={handleBack}
            >
              prev
            </button>
            <button disabled={lastStep} onClick={handleNext}>
              {lastStep ? "Finish" : "Next"}
            </button>
          </footer>
        </React.Fragment>
      )}

      {/* </DialogContent> */}
    </>
  );
}
