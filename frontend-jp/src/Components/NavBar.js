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
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DefaultPic from "../Components/JobPreppers_DefaultPic.png";
import JobPreppersLogo from "../Components/JobPreppers.png";

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
            ? "bg-[var(--jp-navbar-hover)] text-[var(--jp-border)]"
            : "text-[var(--jp-border)] hover:bg-[var(--jp-navbar-hover)] hover:text-[var(--jp-border)]",
          "block rounded-md px-3 py-2 text-base font-medium"
        )}
      >
        {children}
      </Link>
    </div>
  );
}

async function fetchRecruiterStatus(userID) {
  const response = await fetch(
    apiURL + `/api/Recruiter/isRecruiter/?userID=${userID}`,
    {
      credentials: "include",
    }
  );

  if (response.ok) {
    let result = await response.json();
    return result.isRecruiter;
  } else {
    throw new Error("Failed to fetch recruiter status");
  }
}

function NavBar() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [error, setError] = useState("");
  const [notificationDict, setNotificationDict] = useState([]);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isOff, setIsOff] = useState(false);
  const [buttonOff, setButtonOff] = useState(false);

  const buttonRef = useRef(null);

  const handleMouseLeave = (e) => {
    // if (isOff && buttonOff)
    buttonRef.current?.click();
    // setButtonOff(false);
    // setIsOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${apiURL}/api/Users/Search?name=${encodeURIComponent(searchQuery)}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setShowResults(true);
        } else {
          // Handle case where no users are found
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const timeoutId = setTimeout(fetchUsers, 300); // Debounce API calls
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const requestPendingFriends = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/Friend/PendingRequests/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            const newPendingFriendDict = data.map((pendingFriend) => ({
              userID: pendingFriend.id,
              username: pendingFriend.username,
              name: pendingFriend.name,
              profilePic:
                pendingFriend.profilePicture == null
                  ? DefaultPic
                  : "data:image/png;base64," +
                    pendingFriend.profilePicture.toString().toString("base64"),
              title: pendingFriend.title,
              sentAt: new Date(pendingFriend.sentAt),
            }));

            setNotificationDict((prevState) => {
              if (
                JSON.stringify(prevState) !==
                JSON.stringify(newPendingFriendDict)
              ) {
                return newPendingFriendDict;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    requestPendingFriends();
  }, [user]);

  const handleAcceptFriend = async (friendID) => {
    try {
      const response = await fetch(apiURL + `/api/Friend/AcceptFriendRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userID, friendId: friendID }),
      });

      if (response.ok) {
        setNotificationDict(
          notificationDict.filter((n) => n.userID !== friendID)
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }

    try {
      const response = await fetch(
        apiURL + `/api/Friend/SyncFriends/${user.userID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("Friends unable to be synced");
      }
    } catch (err) {
      setError("An error occurred when syncing friends");
    }
  };

  const handleDeclineFriend = async (friendID) => {
    try {
      const response = await fetch(apiURL + `/api/Friend/DenyFriendRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.userID, friendId: friendID }),
      });

      if (response.ok) {
        setNotificationDict(
          notificationDict.filter((n) => n.userID !== friendID)
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };
  const matchJobs = useMatch("/Jobs/*");

  const handleLogoutSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch(apiURL + "/api/Users/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/Login");
        if (data) {
          setAuthData(null); // on log out, clear the context
          window.alert(data.message); // Displays "Login successful."
          setError(""); // Clear any previous error message
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message); // Show error message from the backend
      }
    } catch (err) {
      setError("An error occurred. Please try again."); // Catch and display any request error
    }
  };

  const { data: isRecruiter } = useQuery({
    queryKey: ["isRecruiter", user?.userID],
    queryFn: () => fetchRecruiterStatus(user.userID),
    enabled: !!user?.userID,
  });

  if (user == null) {
    return;
  }

  const userPic =
    user.profile_pic == null
      ? DefaultPic
      : "data:image/png;base64," +
        user.profile_pic.toString().toString("base64");

  return (
    <Disclosure as="nav" className="bg-[var(--jp-navbar)] w-full padding ">
      <div className="mx-auto w-full px-2">
        <div className="relative flex h-24 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#0D7944] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>

          {/* Other content */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/">
              <img
                alt="Job Preppers"
                src={JobPreppersLogo}
                className="h-12 w-auto"
              />
              </Link>
            </div>
            <div className="hidden sm:ml-3 sm:block">
              <div className="flex space-x-4 justify-end">
                {navigation.map((item) => {
                  if (item.name === "Jobs") {
                    return (
                      <div className="relative group">
                        <Menu as="div" className="relative group">
                          <MenuButton
                            ref={buttonRef}
                            className={classNames(
                              "block data-[focus]:bg-blue-100 rounded-md px-3 py-2 text-base font-medium cursor-pointer",
                              matchJobs
                                ? "bg-[var(--jp-navbar-hover)] text-[var(--jp-border)] border-none hover:bg-red"
                                : "text-[var(--jp-border)] group-hover:bg-[var(--jp-navbar-hover)] group-hover:text-[var(--jp-border)] bg-[var(--jp-navbar)] hover:bg-red border-none"
                            )}
                            onMouseEnter={(e) => e.target.click()}
                          >
                            Job
                          </MenuButton>

                          <MenuItems
                            anchor="bottom"
                            transition
                            onMouseLeave={handleMouseLeave}
                            // onMouseOut={(e) => e.target.click()}

                            className={`origin-top transition duration-200 ease-out z-50 rounded-md bg-white w-48`}
                          >
                            <MenuItem>
                              <Link
                                to="/Jobs"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Job Board
                              </Link>
                            </MenuItem>

                            {isRecruiter && (
                            <MenuItem>
                              <Link
                                to="/Jobs/ManageJobs"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Manage Jobs
                              </Link>
                            </MenuItem>
                            )}

                            <MenuItem>
                              <Link
                                to="/Jobs/BookmarkedJobs"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Bookmarked Jobs
                              </Link>
                            </MenuItem>
                          </MenuItems>
                        </Menu>
                      </div>
                    );
                  } else {
                    return (
                      <CustomLink key={item.name} to={item.href}>
                        {item.name}
                      </CustomLink>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-64 ml-10">
            {" "}
            {/* Adjust margin here as needed */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--jp-border)]"
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <Link
                    key={user.userId}
                    to={`/Profile/${user.username}`} // Link to the user's profile
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // Hide the results and clear the search query
                      setShowResults(false);
                      setSearchQuery(""); // Optional: clear the input field after selection
                    }}
                  >
                    <img
                      src={
                        user.profile_pic
                          ? `data:image/png;base64,${user.profile_pic}`
                          : DefaultPic
                      }
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{`${user.first_name} ${
                        user.last_name ? user.last_name : ""
                      }`}</span>
                      <span className="text-sm text-gray-500">
                        {user.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Profile dropdown and notification button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <MenuButton className="bg-[var(--jp-navbar)] hover:bg-[var(--jp-navbar)] border-none">
                <button
                  type="button"
                  className="relative rounded-full bg-jp-gradient hover:bg-[var(--jp-navbar-hover)] border-none p-1 hover:text-gray-400 text-[var(--jp-navbar-border)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-[30rem] overflow-y-auto origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {notificationDict.length == 0
                  ? <p className="subtitle">No notifications</p>
                  : notificationDict.map((notification, index) => (
                      <MenuItem>
                        <div className="flex flex-col">
                          <div
                            className="flex p-2 gap-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              className="rounded-full aspect-square w-20 h-20"
                              alt={`${notification.name}'s Profile Picture`}
                              src={notification.profilePic}
                            />

                            <div className="flex flex-col flex-grow">
                              <p>
                                <b>{notification.name}</b> sent a friend request
                              </p>
                              <p className="subtitle">
                                Request sent on{" "}
                                {notification.sentAt.toLocaleDateString()}
                              </p>

                              <div className="flex gap-2 pt-2 items-center justify-end flex-grow">
                                <button
                                  onClick={() =>
                                    handleAcceptFriend(notification.userID)
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="lightButton"
                                  onClick={() =>
                                    handleDeclineFriend(notification.userID)
                                  }
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                          {index < notificationDict.length - 1 && (
                            <hr className="border-t border-gray-300 -ml-[3px] my-2" />
                          )}
                        </div>
                      </MenuItem>
                    ))}
              </MenuItems>
            </Menu>

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-[var(--jp-navbar)] border-none hover:bg-[var(--jp-navbar-hover)] text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt="Profile Picture"
                    src={userPic}
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Link
                    to={`/Profile/${user.username}`}
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    to="/Login"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    onClick={handleLogoutSubmit}
                  >
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => {
            <DisclosureButton
              key={item.name}
              as={CustomLink}
              to={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium"
            >
              {item.name}
            </DisclosureButton>;
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export default NavBar;
