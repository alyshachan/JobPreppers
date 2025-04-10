import {
  FormControl,
  Box,
  TextField,
  DialogContent,
  Typography,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import ToggleButtonForm from "../Helper/ToggleButtonForm";
import styles from "../Posting.module.css";
import { errorMessage } from "../Helper/ErrorMessage";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

const ToggleButtonFormWrap = styled(ToggleButtonForm)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap"
}));


export default function Benefits({ jobDescriptionData }) {
  // const rate = ["Hourly Rate", "Monthy Rate", "Annually"];
  const bonuses = ["Signing Bonus", "Tip", "Equity Package", "Commission"];
  const benefits = [
    "Medical",
    "Vision",
    "Dental",
    "Paid Time Off",
    "Paid Sick Leave",
    "Paternal Leave",
    "Student Loan Repayment",
    "Tuition Reimbursement",
    "401K",
    "Pet Insurance",
    "Relocation Location",
  ];
  const payOption = ["Pay Range", "Exact Amount", "Unpaid"];
  const perks = [
    "Career Development",
    "Learning Stipend",
    "Home Office Stipend",
    "Gym Membership",
  ];

  const jobForm = useFormContext();
  const {
    register,
    setValue,
    watch,
    control,
    resetField,
    formState: { errors },
  } = jobForm;
  const payType = watch("payType");

  const UpdateIncentive = (inputDescriptionData, options) => {
    if (
      Array.isArray(inputDescriptionData) &&
      inputDescriptionData.length > 0
    ) {
      const List = [];
      for (const option of options) {
        for (const input of inputDescriptionData) {
          const regex = new RegExp(`\\b${option}\\b`, "i"); // i make it not case sensitive
          if (regex.test(input)) {
            List.push(option);
          }
        }
      }
      return List;
    }
    return null;
  };

  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        const currencyList = Object.keys(data.rates);
        setCurrencies(currencyList);
      })
      .catch((error) => {
        console.error(" Error fetching currency data: ", error);
        setCurrencies([]);
      });
  }, []);
  useEffect(() => {
    // Reset fields when payType changes
    if (payType !== "Pay Range") {
      resetField("maximumSalary");
    }

    if (payType === "Unpaid") {
      setValue("minimumSalary", 0);
      setValue("currencies", null);
    }
  }, [payType]);

  useEffect(() => {
    if (jobDescriptionData.minimumSalary) {
      const min = jobDescriptionData.minimumSalary;
      // If its two digits then convert hourly to annual wage
      const regex = /\b\d{1,2}\b/;
      if (regex.test(min)) {
        setValue("minimumSalary", min * 40 * 52);
      } else {
        setValue("minimumSalary", min);
      }
    }

    if (jobDescriptionData.maximumSalary) {
      const min = jobDescriptionData.minimumSalary;
      // If its two digits then convert hourly to annual wage
      const regex = /\b\d{1,2}\b/;
      if (regex.test(min)) {
        setValue("maximumSalary", min * 40 * 52);
      } else {
        setValue("maximumSalary", min);
      }
    }

    const benefitResult = UpdateIncentive(
      jobDescriptionData.benefits,
      benefits
    );
    if (benefitResult != null) {
      setValue("benefits", benefitResult);
      jobDescriptionData.benefits = [];
    }
    const bonusResult = UpdateIncentive(jobDescriptionData.bonus, bonuses);
    if (bonusResult != null) {
      setValue("bonuses", bonusResult);
      jobDescriptionData.bonuses = [];
    }

    const perkResult = UpdateIncentive(jobDescriptionData.perks, perks);
    if (perkResult != null) {
      setValue("perks", perkResult);
      jobDescriptionData.perks = [];
    }
  }, [jobDescriptionData]);

  // Step 2
  return (
    <>
      <DialogContent>
        <div className={styles.dialogContent}>
          <FormControl>
            <div className={styles.expectedPay}>
              <div className={styles.input}>
                <div className={`${styles.inputField} justify-center`}>
                  <h2>Expected Pay</h2>
                  <ToggleButtonForm
                    name="payType"
                    control={control}
                    options={payOption}
                    exclusive={true}
                    className="w-full"
                  />
                </div>

                <div className={styles.inputField}>
                  {payType === "Pay Range" ? (
                    <>
                      <div className={styles.payRangeDetails}>
                        <Typography className={styles.rateLabel}>
                          Annually
                        </Typography>

                        <TextField
                          {...register("minimumSalary", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          label="Starting Pay *"
                        />
                        <TextField
                          {...register("maximumSalary", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          label="Maximum Pay"
                        />
                        <Controller
                          name="currencies"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={currencies}
                              value={field.value || "USD"}
                              onChange={(_, value) => field.onChange(value)}
                              renderInput={(params) => (
                                <TextField {...params} label={"Currency *"} />
                              )}
                            />
                          )}
                        />
                      </div>
                      <div className={styles.payRangeDetails}>
                        <div />
                        {errorMessage(errors.minimumSalary) ? (
                          errorMessage(errors.minimumSalary)
                        ) : (
                          <div />
                        )}
                        {errorMessage(errors.maximumSalary) ? (
                          errorMessage(errors.maximumSalary)
                        ) : (
                          <div />
                        )}
                        {errorMessage(errors.currencies) ? (
                          errorMessage(errors.currencies)
                        ) : (
                          <div />
                        )}
                      </div>
                    </>
                  ) : payType === "Exact Amount" ? (
                    <>
                      <div className={styles.payExactDetails}>
                        <Typography className={styles.rateLabel}>
                          Annually
                        </Typography>

                        <TextField
                          {...register("minimumSalary", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          label="Starting Salary *"
                        />

                        <Controller
                          name="currencies"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={currencies}
                              value={field.value || "USD"}
                              onChange={(_, value) => field.onChange(value)}
                              renderInput={(params) => (
                                <TextField {...params} label={"Currency *"} />
                              )}
                            />
                          )}
                        />
                      </div>
                      <div className={styles.payExactDetails}>
                        <div />
                        {errorMessage(errors.minimumSalary) ? (
                          errorMessage(errors.minimumSalary)
                        ) : (
                          <div />
                        )}
                        {errorMessage(errors.currencies) ? (
                          errorMessage(errors.currencies)
                        ) : (
                          <div />
                        )}
                      </div>
                    </>
                  ) : payType === "Unpaid" ? (
                    <></>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={styles.input}>
              <div className={styles.inputField}>
                <h2>Bonus</h2>
                <ToggleButtonForm
                  name="bonuses"
                  control={control}
                  options={bonuses}
                  exclusive={false}
                />
              </div>

              <div className={styles.inputField}>
                <h2>Benefits</h2>
                <ToggleButtonFormWrap
                  name="benefits"
                  control={control}
                  options={benefits}
                  exclusive={false}
                />
              </div>

              <div className={styles.inputField}>
                <h2>Perks</h2>
                <ToggleButtonForm
                  name="perks"
                  control={control}
                  options={perks}
                  exclusive={false}
                />
              </div>
            </div>
          </FormControl>
        </div>
      </DialogContent>
    </>
  );
}
