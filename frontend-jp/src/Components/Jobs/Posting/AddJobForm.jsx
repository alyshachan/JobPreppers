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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  parseJobSchema,
  describeJobSchema,
  benefitsSchema,
  qualificationSchema,
  applicationProcessSchema,
} from "./Validation";
import PacmanLoader from "../../Pacman/Pacman";
import { useAuth } from "../../../provider/authProvider";

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

export default function AddJobForm({ setJobs, companyName }) {
  const [jobDescriptionData, setjobDescriptionData] = useState({
    benefits: [],
    companyName: null,
    educationLevel: null,
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
  const { company, setCompany } = useState(null);
  const { user } = useAuth(); // custom hook for authprovider
  const [activeStep, setActiveStep] = useState(0);
  const jobForm = useForm({
    resolver: yupResolver(stepSchemas[activeStep]),
    defaultValues: { currencies: "USD" },
  });

  const handleClickOpen = () => {
    setOpen(true);
    jobForm.setValue("company", companyName);
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
    const res = await fetch(apiURL + "/api/textanalytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: jobForm.getValues("description") }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to Parse Job Description");
    }
    return res.json();
  };

  // Use Mutation for Post calls and anything involving user doing an action
  const {
    mutate,
    isPending: isParseLoading,
    isError,
  } = useMutation({
    mutationFn: parseDescription,
    onSuccess: (data) => {
      setjobDescriptionData(data);
      handleNext();
    },
    onError: (error) => {
      console.error("Error Parsing Job Description:", error);
    },
  });

  const onSubmit = async (data, e) => {
    const isValid = await jobForm.trigger(); // Validate current step before proceeding
    if (!isValid) return;
    const transformedData = {
      title: data.title,
      description: JSON.stringify(data.description),
      userID: user.userID,
      location: {
        name: data.location,
        longitude: data.longitude,
        latitude: data.latitude,
      },
      type: data.type.label,
      minimumSalary: data.minimumSalary,
      maximumSalary: data.maximumSalary ? data.maximumSalary : null,
      paymentType: data.payType,
      postDate: data.postDate,
      endDate: data.endDate,
      perks: JSON.stringify(data.perks),
      benefits: JSON.stringify(data.benefits),
      bonus: JSON.stringify(data.bonuses),
      link: data.applicationLink,
      qualification: {
        Skills: JSON.stringify(data.skills),
        MinimumExperience: data.minimumExperience,
        MaximumExperience: data.maximumExperience,
        EducationLevel: data.education,
      },
    };
    const response = await fetch(apiURL + "/api/jobpost/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transformedData),
      credentials: "include",
    });
  };

  const {
    mutate: submitMutate,
    isPending: submitLoading,
    isError: submitError,
  } = useMutation({
    mutationFn: (data) => onSubmit(data),
    onSuccess: () => {
      fetchJobs();
      setActiveStep(0);
      jobForm.reset();
      handleClose();
    },
    onError: (error) => {
      console.log("Error: ", { error });
    },
  });

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
      <Button
        variant="filled"
        onClick={handleClickOpen}
        startIcon={<PostAdd />}
      >
        Add Job
      </Button>

      <form>
        <StyledDialog onClose={handleClose} open={open}>
          {submitLoading && (
            <div className={styles.greyOverlay}>
              <div>
                <h1 className="text-[3rem] text-[#ffffff]">Submitting...</h1>
              </div>
              <PacmanLoader size={100} />
            </div>
          )}

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
                  disabled={submitLoading}
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
                  <button disabled={isParseLoading} onClick={() => mutate()}>
                    Parse
                  </button>
                </div>
                <div className="grow-1">
                  <button onClick={handleNext}>Skip</button>
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
