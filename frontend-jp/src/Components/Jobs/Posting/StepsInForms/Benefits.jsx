import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  ButtonGroup,
  FormControl,
  Chip,
  Stack,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import { set } from "react-hook-form";

export default function Benefits() {
  const rate = ["Hourly Rate", "Monthy Rate", "Annually"];

  const [bonus, setBonus] = useState([]);
  const [benfits, setBenefits] = useState([]);
  const [perks, setPerks] = useState([]);
  const [payType, setPayType] = useState("web");

  const handleChange = (event, newPayType) => {
    setPayType(newPayType);
  };

  const handleBonus = (event, newBonus) => {
    setBonus(newBonus);
  };

  const handleBenefit = (event, newBenefits) => {
    setBenefits(newBenefits);
  };
  const handlePerks = (event, newPerks) => {
    setPerks(newPerks);
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

  return (
    <>
      <FormControl>
        <h2>Expected Pay</h2>
        <div className="ExpectedPayType">
          <ToggleButtonGroup value={payType} exclusive onChange={handleChange}>
            <ToggleButton value="Pay Range">Pay Range</ToggleButton>
            <ToggleButton value="Exact Amount">Exact Amount</ToggleButton>
            <ToggleButton value="Unpaid">Unpaid</ToggleButton>
          </ToggleButtonGroup>
        </div>
        {payType === "Pay Range" ? (
          <Fragment>
            <Box>
              <Autocomplete
                options={rate}
                renderInput={(params) => <TextField {...params} label="Rate" />}
              ></Autocomplete>
              <TextField type="number" label="Starting Range"></TextField>
              <TextField type="number" label="Ending Range"></TextField>

              <Autocomplete
                options={currencies}
                renderInput={(params) => (
                  <TextField {...params} label="Currency" />
                )}
              ></Autocomplete>
            </Box>
          </Fragment>
        ) : payType === "Exact Amount" ? (
          <Box>
            <Autocomplete
              options={rate}
              renderInput={(params) => <TextField {...params} label="Rate" />}
            ></Autocomplete>
            <TextField type="number" label="Pay Amount"></TextField>

            <Autocomplete
              options={currencies}
              renderInput={(params) => (
                <TextField {...params} label="Currency" />
              )}
            ></Autocomplete>
          </Box>
        ) : payType === "Unpaid" ? (
          <Fragment>
            <Box></Box>
          </Fragment>
        ) : null}
        <h2>Bonus</h2>
        <ToggleButtonGroup value={bonus} onChange={handleBonus}>
          <ToggleButton value="Signing Bonus">Signing Bonus</ToggleButton>
          <ToggleButton value="Tip">Tip</ToggleButton>
          <ToggleButton value="Equity Package">Equity Package</ToggleButton>
          <ToggleButton value="Commission">Commission</ToggleButton>
        </ToggleButtonGroup>
        <h2>Benfits</h2>
        <ToggleButtonGroup value={benfits} onChange={handleBenefit}>
          <ToggleButton value="Medical"> Medical</ToggleButton>
          <ToggleButton value="Vision"> Vision</ToggleButton>
          <ToggleButton value="Dental"> Dental</ToggleButton>
          <ToggleButton value="Paid Time Off"> Paid Time Off</ToggleButton>
          <ToggleButton value="Paid Sick Leave"> Paid Sick Leave</ToggleButton>
          <ToggleButton value="Paternal Leave"> Paternal Leave</ToggleButton>
          <ToggleButton value="Student Loan Repayment">
            {" "}
            Student Loan Repayment
          </ToggleButton>
          <ToggleButton value="Tuition Reimbursement">
            {" "}
            Tuition Reimbursement
          </ToggleButton>
          <ToggleButton value="Pet Insurance"> Pet Insurance</ToggleButton>
          <ToggleButton value="Relocation Assistance">
            {" "}
            Relocation Assistance
          </ToggleButton>
        </ToggleButtonGroup>

        <h2>Perks</h2>

        <ToggleButtonGroup value={perks} onChange={handlePerks}>
          <ToggleButton value="Career Development">
            Career Development
          </ToggleButton>
          <ToggleButton value="Learning Stipend">Learning Stipend</ToggleButton>
          <ToggleButton value="Home Office Stipend">
            Home Office Stipend
          </ToggleButton>
          <ToggleButton value="Gym Membership">Gym Membership</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </>
  );
}
