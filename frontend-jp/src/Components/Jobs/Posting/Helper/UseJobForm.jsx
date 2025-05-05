// hooks/useJobForm.js
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  parseJobSchema,
  describeJobSchema,
  benefitsSchema,
  qualificationSchema,
  applicationProcessSchema,
} from "../Validation.js";
import { useAuth } from "../../../../provider/authProvider.js";

const apiURL = process.env.REACT_APP_JP_API_URL;

export default function useJobForm({
  setJobs,
  companyName,
  jobToEdit = null,
  setOpen,
  setFilters,
}) {
  const [activeStep, setActiveStep] = useState(0);
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
    perks: [],
    bonuses: [],
    perks: [],
  });
  const [formData, setFormData] = useState({});
  const { user } = useAuth();

  const isUpdate = !!jobToEdit;

  const stepSchemas = [
    parseJobSchema,
    describeJobSchema,
    benefitsSchema,
    qualificationSchema,
    applicationProcessSchema,
  ];

  const jobForm = useForm({
    resolver: yupResolver(stepSchemas[activeStep]),
    defaultValues: {
      currencies: "USD",
      payType: "Exact Amount",
      ...(jobToEdit || {}),
    },
  });

  useEffect(() => {
    if (companyName) {
      jobForm.setValue("company", companyName);
    }
  }, [companyName, jobForm]);

  const handleNext = async () => {
    const isValid = await jobForm.trigger();
    if (!isValid) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const parseDescription = async () => {
    const res = await fetch(apiURL + "/api/textanalytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: jobForm.getValues("description") }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to Parse Job Description");
    return res.json();
  };

  const { mutate: mutateParse, isPending: isParseLoading } = useMutation({
    mutationFn: parseDescription,
    onSuccess: (data) => {
      console.log("Parse Data: ", data);
      setjobDescriptionData(data);
      handleNext();
    },
    onError: (error) => {
      console.error("Error parsing description:", error);
    },
  });

  const fetchJobs = async () => {
    setFilters((prev) => ({
      ...prev,
    }));
  };

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
      ...(isUpdate && { jobID: data.jobID }),
    };
    const url = isUpdate
      ? `${apiURL}/api/jobpost/update`
      : `${apiURL}/api/jobpost/add`;

    const method = isUpdate ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transformedData),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to submit job");
  };

  const {
    mutate: submitMutate,
    isPending: isSubmitting,
    isError: submitError,
  } = useMutation({
    mutationFn: (data) => onSubmit(data),
    onSuccess: () => {
      fetchJobs();
      setActiveStep(0);
      jobForm.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.log("Error: ", { error });
    },
  });

  return {
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
  };
}
