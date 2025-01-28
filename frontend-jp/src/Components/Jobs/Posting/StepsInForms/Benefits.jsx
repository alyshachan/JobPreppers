import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Box,
  Autocomplete,
  TextField,
  useFormControl,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import ToggleButtonForm from "../Helper/ToggleButtonForm";

export default function Benefits() {
  const rate = ["Hourly Rate", "Monthy Rate", "Annually"];
  //   const [payType, setPayType] = useState("web");
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
    "Pet Insurance",
    "Relocation Location",
  ];

  const perks = [
    "Career Development",
    "Learning Stipend",
    "Home Office Stipend",
    "Gym Membership",
  ];

  const jobForm = useFormContext();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    resetField,
    formState: { errors },
  } = jobForm;
  const payType = getValues("payType");

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
      resetField("endingAmount");
    }

    if (payType !== "Unpaid") {
      resetField("amount");
    }

    if (payType === "Unpaid") {
      setValue("amount", 0);
      resetField("rate");
      resetField("currencies");
    }
  }, [payType]);
  const handleResetForm = (fieldName) => {
    resetField(fieldName);
  };
  // Step 2
  return (
    <>
      <FormControl>
        <h2>Expected Pay</h2>
        <div className="ExpectedPayType">
          <Controller
            name="payType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                exclusive
                value={field.value}
                {...field}
                onChange={(_, value) => field.onChange(value)}
              >
                <ToggleButton value="Pay Range">Pay Range</ToggleButton>
                <ToggleButton value="Exact Amount">Exact Amount</ToggleButton>
                <ToggleButton value="Unpaid">Unpaid</ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </div>
        {payType === "Pay Range" ? (
          <Fragment>
            <Box>
              <AutoCompleteForm
                control={control}
                name="rate"
                options={rate}
                label="Rate"
              />

              <TextField
                {...register("amount")}
                type="number"
                label="Starting Range"
              />
              <TextField
                {...register("endingAmount")}
                type="number"
                label="Ending Range"
              />

              <AutoCompleteForm
                name="currencies"
                options={currencies}
                label="Currency"
                control={control}
              />
            </Box>
          </Fragment>
        ) : payType === "Exact Amount" ? (
          <Fragment>
            <Box>
              <AutoCompleteForm
                control={control}
                name="rate"
                options={rate}
                label="Rate"
              />
              <TextField
                {...register("amount")}
                type="number"
                label="Pay Amount"
              />

              <AutoCompleteForm
                name="currencies"
                options={currencies}
                label="Currency"
                control={control}
              />
            </Box>
          </Fragment>
        ) : payType === "Unpaid" ? (
          <Fragment>
            <Box></Box>
          </Fragment>
        ) : null}
        <h2>Bonus</h2>
        <ToggleButtonForm name="Bonuses" control={control} options={bonuses} />

        <h2>Benfits</h2>
        <ToggleButtonForm
          name="Benefits"
          control={control}
          options={benefits}
        />

        <h2>Perks</h2>
        <ToggleButtonForm name="Perks" control={control} options={perks} />
      </FormControl>
    </>
  );
}
