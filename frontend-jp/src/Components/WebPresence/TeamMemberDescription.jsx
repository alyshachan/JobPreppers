import * as React from "react";
import { useState, useEffect } from "react";
import {
  Alert,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";

export default function TeamMemberDescription() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch("/TeamMember.json")
      .then((res) => res.json())
      .then((data) => setTeam(data));
  }, []);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleEmailClick = (email) => {
    setOpenSnackBar(true);
    navigator.clipboard.writeText(email);
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "blank", "noopener, noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const onClickUrl = (url) => {
    return () => openInNewTab(url);
  };

  return (
    <>
      <h1> Meet The Team</h1>

      {team.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="flex flex-col content-center justify-center p-6 w-full"
        >
          <Card
            className={`flex md:flex-row ${
              index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
            } w-full`}
          >
            <CardMedia
              component="img"
              alt={member.alt}
              sx={{ height: 300, width: "100%", objectFit: "cover" }}
              image={member.image}
            />
            <div className="flex flex-col">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {member.bio}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleEmailClick(member.email)}
                  size="small"
                >
                  Email
                </Button>
                <Snackbar
                  open={openSnackBar}
                  onClose={() => setOpenSnackBar(false)}
                  slots={{ transition: Fade }}
                  message="Successfully copied email to clipboard."
                  autoHideDuration={1200}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                />
                <Button onClick={onClickUrl(member.linkedln)} size="small">
                  Linkedin
                </Button>
              </CardActions>
            </div>
          </Card>
        </motion.div>
      ))}
    </>
  );
}
