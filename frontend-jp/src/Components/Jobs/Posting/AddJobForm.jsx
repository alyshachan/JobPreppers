import { useState } from "react";
import {
  DialogActions,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormProvider, useForm } from "react-hook-form";
import ParseJobDescription from "./StepsInForms/ParseJobDescription";
import ApplicationProcess from "./StepsInForms/ApplicationProcess";
import DescribeJob from "./StepsInForms/DescribeJob";
import Benefits from "./StepsInForms/Benefits";
import Qualification from "./StepsInForms/Qualification";
import { yupResolver } from "@hookform/resolvers/yup";
import { PostAdd } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SectionHeader from "../../Profile/SectionHeader";
import styles from "./Posting.module.css";
import {
  parseJobSchema,
  describeJobSchema,
  benefitsSchema,
  qualificationSchema,
  applicationProcessSchema,
} from "./Validation";

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
}));

export default function AddJobForm({ setJobs }) {
  const [jobDescriptionData, setjobDescriptionData] = useState({
    benefits: [],
    companyName: null,
    educationLevel: "",
    location: null,
    maximumSalary: null,
    minimumExperience: null,
    minimumSalary: null,
    skills: [],
    title: null,
    type: null,
  });

  const stepSchemas = [
    parseJobSchema,
    describeJobSchema,
    benefitsSchema,
    qualificationSchema,
    applicationProcessSchema,
  ];
  // State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const [activeStep, setActiveStep] = useState(0);
  const jobForm = useForm({ resolver: yupResolver(stepSchemas[activeStep]) });

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

  const steps = [
    "Parse Job Description",
    "Describe Your Job",
    "Benefits and Compensation",
    "Qualification for Position",
    "Application Process",
  ];

  const lastStep = activeStep === steps.length - 1;
  const handleNext = async () => {
    const isValid = await jobForm.trigger(); // Validate current step before proceeding
    if (!isValid) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const fetchJobs = async () => {
    try {
      const res = await fetch(apiURL + "/api/jobpost");
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setJobs(data.jobs);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const parseDescription = async () => {
    try {
      const res = await fetch(apiURL + "/api/textanalytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: jobForm.getValues("description") }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setjobDescriptionData(data);
        console.log("Parse Job Description: ", data);
        handleNext();
      } else {
        console.error("Failed to parse job description");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const onSubmit = async (data, e) => {
    const isValid = await jobForm.trigger(); // Validate current step before proceeding
    if (!isValid) return;
    try {
      const transformedData = {
        title: data.title,
        description: JSON.stringify(data.description),
        employer: {
          companyName: data.company,
        },
        location: {
          name: data.location,
          longitude: data.longitude,
          latitude: data.latitude,
        },
        type: data.type.label,
        minimumSalary: data.minimumSalary,
        maximumSalary: data.maximumSalary ? data.maximumSalary : null,
        paymentType: data.payType,
        // location: data.location,
        postDate: data.postDate,
        endDate: data.endDate,
        perks: JSON.stringify(data.perks),
        benefits: JSON.stringify(data.benefits),
        bonus: JSON.stringify(data.bonuses),
        link: data.applicationLink,
        qualification: {
          // ✅ Nest skills inside jobQualification
          Skills: JSON.stringify(data.skills),
          MinimumExperience: data.MinimumExperience,
          EducationLevel: data.EducationLevel,
        },
      };
      const response = await fetch(apiURL + "/api/jobpost/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
        credentials: "include",
      });

      if (response.ok) {
        fetchJobs();
      } else {
        const errorData = await response.json();
        console.log("Hello: ", transformedData);
        console.log("Error: ", { errorData });

        // setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      console.log("Catch Error: ", err);
      // Maybe put an alert
    }
    // console.log("Form Data Submitted: ", data);

    setActiveStep(0);
    jobForm.reset();
    handleClose();
  };

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
            <form id="jobForm" onSubmit={handleSubmit(onSubmit)}>
              {/* Wrap in form and use handleSubmit */}
              <ApplicationProcess
                formData={formData}
                setFormData={setFormData}
              />
            </form>
          </FormProvider>
        );
    }
  };

  return (
    <>
      {/* <Fragment> */}
      <Button
        variant="filled"
        onClick={handleClickOpen}
        startIcon={<PostAdd />}
      >
        Add Job
      </Button>
      {/* </Fragment> */}

      <form>
        <StyledDialog onClose={handleClose} open={open}>
          <DialogTitle className={styles.addJobTitle}>
            <SectionHeader header="Add Job Posting" />
          </DialogTitle>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>

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

          <body className="bg-white overflow-y-auto">{pageDisplay()}</body>

          {activeStep === steps.length - 1 ? (
            <DialogActions>
              <footer className="flex flex-row gap-2">
                <button onClick={handleBack}>Back</button>
                <button form="jobForm">Submit</button>
              </footer>
            </DialogActions>
          ) : activeStep === 0 ? (
            <DialogActions>
              <footer className="flex flex-row gap-2">
                <button onClick={parseDescription}>Parse</button>
                <button onClick={handleNext}>Skip</button>
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
