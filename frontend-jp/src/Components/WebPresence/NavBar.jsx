import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import moment from "moment";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import React, { useState, useEffect, useRef } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import JobPreppersLogo from "../JobPreppers.png";

const apiURL = process.env.REACT_APP_JP_API_URL;

function NavBar() {
  const navigate = useNavigate();

  return (
    <Disclosure
      as="nav"
      style={{ backgroundImage: "var(--jp-navbar)" }}
      className="bg-[var(--jp-navbar)] w-full p-2 "
    >
      <div className="mx-auto w-full px-2">
        {/* Other content */}
        <div className="flex flex-row justify-between w-full">
          <img
            alt="Job Preppers"
            src={JobPreppersLogo}
            className="h-12 w-auto"
          />
          <button
            // style={{
            //   backgroundImage: "var(--jp-gradient)",
            //   borderColor: "var(--jp-border)",
            // }}
            className="relative rounded-full bg-jp-gradient hover:bg-[var(--jp-navbar-hover)] border-none p-1 hover:text-gray-200 text-[var(--jp-navbar)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 w-32"
            onClick={() => navigate("/Login")}
          >
            Log In
          </button>
        </div>
      </div>
    </Disclosure>
  );
}

export default NavBar;
