import * as React from "react";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
export default function Summary() {
  return (
    <>
      <h1> Job Preppers</h1>
      <div className={`flex md:flex-row w-full`}>
        <CardContent>
          <Typography
            // align="center"
            gutterBottom
            variant="body"
            component="div"
          >
            Job Preppers is a professional networking and job search site built
            to consolidate the features that users expect from a job hunt
            platform. The modern job platform feels more akin to a social media
            app, overloaded with distractions and content irrelevant to a job
            hunter. On top of this, seemingly important features, such as
            advanced job filtering and salary insights, are paywalled. Job
            Preppers not only aims to slim down the sanitized clutter of the
            modern job hunt platform but also provide users with useful tools to
            tailor their resumes, prepare them for future interviews, and help
            them take meaningful steps towards their careers.
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          alt="Overview of the Job Preppers Website"
          sx={{ height: 300, width: "100%", objectFit: "cover" }}
          image="/"
        />
      </div>
    </>
  );
}
