import "./JobSection.css"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Salary from "./FilterMenu/Salary";
import JobType from "./FilterMenu/JobType";
import Distance from "./FilterMenu/Distance";
import DueDate from "./FilterMenu/DueDate";
import Company from "./FilterMenu/Company";
export default function FilterColumn(){
    return(
    <>
    <div className="filter-column-container">
        <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: 'center'}}>
        <Salary></Salary>
        <Distance></Distance>
        <Company></Company>
        <JobType></JobType>
        <DueDate></DueDate>
        </Stack>
    </div>
    
    </>

)
}

