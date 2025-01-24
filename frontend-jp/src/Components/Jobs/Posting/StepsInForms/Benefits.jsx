import { Button, ButtonGroup, FormControl } from "@mui/material";

export default function Benefits() {
  return (
    <>
      <FormControl>
        <h2>Expected Pay</h2>
        <ButtonGroup>
          <Button>Pay Range</Button>
          <Button>Exact Amount</Button>
          <Button>Unpaid</Button>
        </ButtonGroup>

        <h2>Bonus</h2>
        <ButtonGroup>
          <Button>Signing Bonus</Button>
          <Button>Tip</Button>
          <Button>Equity Package</Button>
          <Button>Paid Sick Leave</Button>
        </ButtonGroup>

        <h2>Benefits</h2>
        <ButtonGroup>
          <Button>Medical</Button>
          <Button>Add More +</Button>
        </ButtonGroup>

        <h2>Perks</h2>
        <ButtonGroup>
          <Button>Career Development</Button>
          <Button>Add More +</Button>
        </ButtonGroup>
      </FormControl>
    </>
  );
}
