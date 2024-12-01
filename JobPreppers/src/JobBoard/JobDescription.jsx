
import {Card, Button, CardActions,  CardContent , 
    Stack ,Typography, Avatar, CardHeader, IconButton, Box} from '@mui/material';
import { red } from '@mui/material/colors';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import amazonIcon from './Img/amazon-icon.png';
import './JobSection.css';
import { useState, useEffect } from 'react';


function JobDescription(){

    const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/job")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setJobs(data);
      })
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

    return(
        <>
        {jobs.map((job) => (
            <Card key={job.jobID} sx={{ minWidth: 500 , margin:2 }}>

                    <CardHeader
                    avatar={
                        <Avatar src={amazonIcon} aria-label="recipe"> {job.company[0]}
                </Avatar>}
                    
                    title={job.title}
                    subheader={job.company}

                action={
                     <>
                    <IconButton aria-label="bookmark">
                        <BookmarkBorderIcon/>
                    </IconButton>

                    <IconButton aria-label='highlight-off'>
                        <HighlightOffIcon/>
                    </IconButton>
                    </>
                }
                ></CardHeader>

            <CardContent >
                <Stack direction="column" spacing={2} sx={{ width: "100%", 
                   display: 'flex' , translate:'15%', justifyContent: 'center'}}>

               
                <Box className="description-box" >
                    <PaidIcon></PaidIcon>
                    <Typography variant='body'  sx={{ color: 'text.secondary' }}> 
                       {job.pay_range}
                    </Typography>
                </Box>
                <Box  className="description-box">
                    <AccessTimeFilledIcon/>
                    <Typography variant='body'  sx={{ color: 'text.secondary' }}> 
                        {job.type}
                    </Typography>

                </Box>

                <Box  className="description-box">
                    <PlaceIcon/>
                    <Typography variant='body'  sx={{ color: 'text.secondary' }}> 
                        {job.location}
                    </Typography>


                </Box>

                </Stack>


            </CardContent>

            <CardActions >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
                >
                <Typography variant='body'  sx={{ color: 'text.secondary' }}> Apply by {job.fill_by_date}</Typography>
                <Button variant="contained" className='learn-more-button'> Learn More</Button>
            </Box>
            </CardActions>
            
            </Card>
        ))}
        
        
        
        </>
    )
}

export default JobDescription;