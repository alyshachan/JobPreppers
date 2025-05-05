import Slider from "react-infinite-logo-slider";
import styles from "./WebPresence.module.css";
import { Typography } from "@mui/material";
const Technologies = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl pb-6 text-center bg-gradient-to-r from-[var(--jp-secondary)] to-[var(--jp-primary)] bg-clip-text text-transparent">
          Used Technologies
        </h1>
      <div className="flex flex-col md:flex-row justify-evenly w-full gap-6 mb-8 text-sm md:text-base text-center md:text-left">
        <Typography>
          <strong>Project/Task Manager:</strong>{" "}
          <a
            href="https://about.gitlab.com/ "
            target="_blank"
            rel="noopener noreferrer"
          >
            Gitlab
          </a>
          <br />
          <strong>Versioning System:</strong>{" "}
          <a
            href=" https://git-scm.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Git{" "}
          </a>{" "}
          via{" "}
          <a
            href="https://about.gitlab.com/ "
            target="_blank"
            rel="noopener noreferrer"
          >
            Gitlab
          </a>
          <br />
          <strong>Project Languages:</strong> Frontend:{" "}
          <a
            href="https://www.javascript.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Javscript
          </a>{" "}
          (
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            React.js
          </a>
          ), Backend:{" "}
          <a
            href="https://learn.microsoft.com/en-us/dotnet/csharp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            C#{" "}
          </a>
          <a
            href="https://dotnet.microsoft.com/en-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            (.NET)
          </a>
          <br />
        </Typography>
        <Typography>
          <strong>Hosting Service/Cloud Provider:</strong>{" "}
          <a
            href="https://www.javascript.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AWS
          </a>
          <br />
          <strong>Databases Used:</strong>{" "}
          <a
            href="https://www.mysql.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MySQL
          </a>
          <br />
          <strong>APIs used:</strong>{" "}
          <a
            href="https://openai.com/index/chatgpt/"
            target="_blank"
            rel="noopener noreferrer"
          >
            GPT 4o API
          </a>{" "}
          <br />
          <strong>Parser:</strong>{" "}
          <a
            href="https://azure.microsoft.com/en-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Azure
          </a>{" "}
        </Typography>
      </div>

      <Slider
        width="250px"
        height="384px"
        duration={40}
        pauseOnHover={true}
        blurBorders={false}
        blurBorderColor={"#fff"}
      >
        <Slider.Slide className={styles.sliderContainer}>
          <img
            src="/Logo/NET.png"
            alt=".NET"
            className={styles.sliderContent}
          />
        </Slider.Slide>
        <Slider.Slide className={styles.sliderContainer}>
          <img
            src="/Logo/Azure.png"
            alt="Azure"
            className={styles.sliderContent}
          />
        </Slider.Slide>
        <Slider.Slide className={styles.sliderContainer}>
          <img
            src="/Logo/Gitlab.png"
            alt="Gitlab"
            className={styles.sliderContent}
          />
        </Slider.Slide>
        <Slider.Slide className={styles.sliderContainer}>
          <img src="/Logo/AWS.png" alt="AWS" className={styles.sliderContent} />
        </Slider.Slide>

        <Slider.Slide className={styles.sliderContainer}>
          <img
            src="/Logo/reactjs.png"
            alt="React JS"
            className={styles.sliderContent}
          />
        </Slider.Slide>

        <Slider.Slide className={styles.sliderContainer}>
          <img
            src="/Logo/mysql.png"
            alt="MySQL"
            className={styles.sliderContent}
          />
        </Slider.Slide>
      </Slider>
      </div>
    </>
  );
};

export default Technologies;
