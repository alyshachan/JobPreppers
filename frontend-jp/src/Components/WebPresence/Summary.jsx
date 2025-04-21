import * as React from "react";
import styles from "./WebPresence.module.css";
import "../JobPreppers.css";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function Summary() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className="flex flex-col items-center px-4 md:px-12">
      <h1 className="text-4xl md:text-6xl pb-6 text-center bg-gradient-to-r from-[var(--jp-secondary)] to-[var(--jp-primary)] bg-clip-text text-transparent">
        Job Preppers
      </h1>

      <div className="flex flex-col md:flex-row items-center w-full gap-6">
        <CardContent className="md:w-1/2 w-full">
          <Typography
            variant="body1"
            component="p"
            className="text-justify text-sm md:text-base"
          >
            Job Preppers is a professional networking and job search site
            built to consolidate the features that users expect from a job
            hunt platform. The modern job platform feels more akin to a social
            media app, overloaded with distractions and content irrelevant to
            a job hunter. On top of this, seemingly important features, such
            as advanced job filtering and salary insights, are paywalled. Job
            Preppers not only aims to slim down the sanitized clutter of the
            modern job hunt platform but also provide users with useful tools
            to tailor their resumes, prepare them for future interviews, and
            help them take meaningful steps towards their careers.
          </Typography>
        </CardContent>

        <CardMedia
          component="img"
          alt="Overview of the Job Preppers Website"
          image="/Images/temp-features/Features_Image.png"
          className="w-full md:w-1/2 max-w-[600px] rounded-xl"
          sx={{
            width: {
              xs: "120%",
              md: "50%",
            },
            objectFit: {
              xs: "contain",
              md: "cover",
            } }}
        />
      </div>
    </div>
  );
}
