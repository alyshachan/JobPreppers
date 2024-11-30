
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

function JobDescription(){
    return(
        <>
            <Card sx={{ minWidth: 500 }}>
            <CardHeader
                avatar={
                <Avatar src={amazonIcon} aria-label="recipe"> A
                </Avatar>}

                title="Software Engineer"
                subheader="Amazon"

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
                        $80,000
                    </Typography>
                </Box>
                <Box  className="description-box">
                    <AccessTimeFilledIcon/>
                    <Typography variant='body'  sx={{ color: 'text.secondary' }}> 
                        Full-Time
                    </Typography>

                </Box>

                <Box  className="description-box">
                    <PlaceIcon/>
                    <Typography variant='body'  sx={{ color: 'text.secondary' }}> 
                        Seattle, Washington
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
                <Typography variant='body'  sx={{ color: 'text.secondary' }}> Apply by March 15, 2025</Typography>
                <Button variant="contained" className='learn-more-button'> Learn More</Button>
            </Box>
            </CardActions>
            
            </Card>
        
        
        
        </>
    )
}

export default JobDescription;