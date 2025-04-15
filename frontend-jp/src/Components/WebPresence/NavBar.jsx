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

const apiURL = process.env.REACT_APP_JP_API_URL;

const navigation = [
  { name: "Feed", href: "/Feed", current: true },
  { name: "Jobs", href: "/Jobs", current: false },
  { name: "Interview", href: "/Interview", current: false },
  { name: "Resume", href: "/Resume", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CustomLink({ to, children, className, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: false });
  return (
    <div className={isActive ? "active" : ""}>
      <Link
        to={to}
        {...props}
        className={classNames(
          className,
          isActive
            ? "bg-[#085630] text-white"
            : "text-gray-300 hover:bg-[#0D7944] hover:text-white",
          "block rounded-md px-3 py-2 text-base font-medium"
        )}
      >
        {children}
      </Link>
    </div>
  );
}

function NavBar() {
  const navigate = useNavigate();

  return (
    <Disclosure as="nav" className="bg-[#4BA173] w-full padding ">
      <div className="mx-auto w-full px-2">
        {/* Other content */}
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img
              alt="Job Preppers"
              src={JobPreppersLogo_White}
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

export default NavBar;
