import { useEffect, useState } from "react";
import {
  DialogActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider } from "react-hook-form";
import ParseJobDescription from "./StepsInForms/ParseJobDescription";
import ApplicationProcess from "./StepsInForms/ApplicationProcess";
import DescribeJob from "./StepsInForms/DescribeJob";
import Benefits from "./StepsInForms/Benefits";
import Qualification from "./StepsInForms/Qualification";
import { PostAdd } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SectionHeader from "../../Profile/SectionHeader";
import styles from "./Posting.module.css";
import PacmanLoader from "../../Pacman/Pacman";
import useJobForm from "./Helper/UseJobForm";
import EditIcon from "@mui/icons-material/Edit";

const apiURL = process.env.REACT_APP_JP_API_URL;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .css-10d30g3-MuiPaper-root-MuiDialog-paper": {
    borderRadius: "30px",
    margin: "-20px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "1000px",
    minWidth: "1000px",
    overflowX: "hidden",
  },
  "& .css-si425x": {
    borderRadius: "30px",
    padding: "0px 20px 20px",
    overflow: "hidden",
    maxWidth: "1000px",
    minWidth: "1000px",
  },
}));

export default function AddJobForm({
  setJobs,
  companyName,
  jobToEdit,
  setFilters,
}) {
  const formSteps = [
    { label: "Parse Job Description", component: ParseJobDescription },
    { label: "Describe Job", component: DescribeJob },
    { label: "Benefits & Perks", component: Benefits },
    { label: "Qualifications", component: Qualification },
    { label: "Application Process", component: ApplicationProcess },
  ];

  const [open, setOpen] = useState(false);

  const ifUndefined = (dbData) => {
    if (dbData != undefined) {
      const parseValue = JSON.parse(dbData);
      return parseValue;
    }
    return dbData;
  };

  const {
    jobForm,
    activeStep,
    handleNext,
    handleBack,
    formData,
    setFormData,
    jobDescriptionData,
    isSubmitting,
    isParseLoading,
    mutateParse,
    submitMutate,
    isUpdate,
    onSubmit,
    setActiveStep,
  } = useJobForm({ setJobs, companyName, jobToEdit, setOpen, setFilters });

  const handleClickOpen = () => {
    setOpen(true);
    if (jobToEdit) {
      setActiveStep(1);
      jobForm.setValue("company", jobToEdit.company);
      jobForm.setValue("title", jobToEdit.title);
      jobForm.setValue("location", jobToEdit.location.name);
      jobForm.setValue("minimumSalary", jobToEdit.minimumSalary);
      jobForm.setValue("maximumSalary", jobToEdit.maximumSalary);
      jobForm.setValue("description", jobToEdit.description);
      jobForm.setValue("location", jobToEdit.location);
      jobDescriptionData.type = jobToEdit.type;
      jobDescriptionData.perks = ifUndefined(jobToEdit.perks) || [];
      jobDescriptionData.bonuses = ifUndefined(jobToEdit.bonues) || [];
      jobDescriptionData.benefits = ifUndefined(jobToEdit.benefits) || [];
      jobDescriptionData.skills = ifUndefined(jobToEdit.skills) || [];
      jobDescriptionData.educationLevel = jobToEdit.educationLevel;
      jobForm.setValue("postDate", jobToEdit.postDate);
      jobForm.setValue("endDate", jobToEdit.endDate);
      jobForm.setValue("applicationLink", jobToEdit.link);
    }
    jobForm.setValue("company", companyName);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const steps = [
    "Parse Job Description",
    "Describe Your Job",
    "Benefits and Compensation",
    "Qualification for Position",
    "Application Process",
  ];

  const pageDisplay = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormProvider {...jobForm}>
            <ParseJobDescription
              formData={formData}
              setFormData={setFormData}
            />
          </FormProvider>
        );
      case 1:
        return (
          <FormProvider {...jobForm}>
            <DescribeJob
              formData={formData}
              setFormData={setFormData}
              jobDescriptionData={jobDescriptionData}
            />
          </FormProvider>
        );

      case 2:
        return (
          <FormProvider {...jobForm}>
            <Benefits
              formData={formData}
              setFormData={setFormData}
              jobDescriptionData={jobDescriptionData}
            />
          </FormProvider>
        );
      case 3:
        return (
          <FormProvider {...jobForm}>
            <Qualification
              formData={formData}
              setFormData={setFormData}
              jobDescriptionData={jobDescriptionData}
            />
          </FormProvider>
        );
      case 4:
        return (
          <FormProvider {...jobForm}>
            {/* <form id="jobForm" onSubmit={handleSubmit}> */}
            {/* Wrap in form and use handleSubmit */}
            <ApplicationProcess formData={formData} setFormData={setFormData} />
            {/* </form> */}
          </FormProvider>
        );
    }
  };

  const { handleSubmit } = jobForm;

  return (
    <>
      {jobToEdit ? (
        <IconButton aria-label="edit button" onClick={handleClickOpen}>
          <EditIcon />
        </IconButton>
      ) : (
        <Button
          variant="filled"
          className={styles.addButton}
          onClick={handleClickOpen}
          startIcon={<PostAdd />}
        >
          Add Job
        </Button>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledDialog onClose={handleClose} open={open}>
          {isSubmitting && (
            <div className={styles.greyOverlay}>
              <div>
                <h1 className="text-[3rem] text-[#ffffff]">Submitting...</h1>
              </div>
              <PacmanLoader size={100} />
            </div>
          )}

          <DialogTitle className={styles.addJobTitle} />
          <SectionHeader header="Add Job Posting" />
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>

          <header className="mt-2">
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
          <body className="bg-white overflow-y-auto">{pageDisplay()}</body>

          {activeStep === steps.length - 1 ? (
            <DialogActions>
              <footer className="flex flex-row gap-2">
                <button onClick={handleBack}>Back</button>
                <button
                  disabled={isSubmitting}
                  onClick={handleSubmit((data) => submitMutate(data))}
                  form="jobForm"
                >
                  Submit
                </button>
              </footer>
            </DialogActions>
          ) : activeStep === 0 ? (
            <DialogActions>
              <footer className="flex flex-row gap-2 items-center justify-center h-full">
                {isParseLoading ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <Typography> Loading:</Typography>
                    </div>
                    <PacmanLoader size={30} />
                  </div>
                ) : null}
                <div className="grow-1">
                  <button
                    disabled={isParseLoading}
                    onClick={() => mutateParse()}
                  >
                    Parse
                  </button>
                </div>
                <div className="grow-1">
                  <button onClick={handleNext} disabled={isParseLoading}>
                    Skip
                  </button>
                </div>
              </footer>
            </DialogActions>
          ) : (
            <DialogActions>
              <footer className="flex flex-row gap-2">
                <button
                  // disabled={activeStep == 1}
                  // style={{ display: activeStep === 1 ? "none" : "block" }}
                  onClick={handleBack}
                >
                  Back
                </button>
                <button onClick={handleNext}>
                  {/* {activeStep == 0 ? "Skip" : "Next"} */}
                  Next
                </button>
              </footer>
            </DialogActions>
          )}
        </StyledDialog>
        {/* <pre>{JSON.stringify(jobForm.watch(), null, 2)}</pre> */}
      </form>
    </>
  );
}
