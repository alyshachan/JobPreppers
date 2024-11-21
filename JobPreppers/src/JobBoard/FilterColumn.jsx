import "../JobBoard/JobSection.css"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
export default function FilterColumn(){
    return(
    <>
    <div className="filter-column-container">
        <Stack direction="row" spacing={2}>
        <Button className="filter-button" variant= "outlined"  endIcon={<ArrowDropDownIcon/>}>
            Salary
            </Button>
        <Button className="filter-button" variant= "outlined" endIcon={<ArrowDropDownIcon/>} >Company</Button>
        <Button className="filter-button" variant= "outlined" endIcon={<ArrowDropDownIcon/>}>
         Location</Button>
         <Button className="filter-button" variant= "outlined" endIcon={<ArrowDropDownIcon/>}>
         Job Type</Button>
         <Button className="filter-button" variant= "outlined" endIcon={<ArrowDropDownIcon/>}>
         Apply By Date</Button>


        </Stack>
    </div>
    
    </>

)
}

