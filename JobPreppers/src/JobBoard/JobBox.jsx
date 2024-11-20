import * as React from 'react';
import TextField from "@mui/material/TextField";
import "./JobSection.css";
// import SearchIcon from "@mui/icons-material/Search";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import {FiSearch} from 'react-icons/fi'


function JobBox(){
    return(
        <>
       
        <div className="search-section">
            <div className='search-section-items'>
        <form>
            {/* <TextField id="standard-basic" label="Search" variant="standard" /> */}
            <input type='text' id='search' title='search' multiple
            className='border rounded'></input>
            <FiSearch className='fiSearch text-gray-800'/>

           
            <IconButton color="primary" aria-label="close" 
                className='icon-button'>
                <CloseIcon />
            </IconButton>
            {/* <Button variant="contained">Contained</Button> */}
            </form>
            </div>
            </div>
        </>
    );
}

export default JobBox;