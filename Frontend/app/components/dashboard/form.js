"use client";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import LinkedInAuthButton from "./linkedinShare/linkedInAuthButton";

export default function Form() {
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const userId = currentUser ? currentUser.id : "";
  const [shared, setShared] = useState(false); // Extract userId from currentUser

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    position: "",
    experience: "",
    education: "",
    description: "",
    address: "",
    country: "",
    city: "",
    keywords: "",
  });

  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:8080/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // Send formData directly
      });

      if (response.ok) {
        dispatch({ type: "SET_KEYWORDS", payload: keywords });
        alert("Job offer submitted successfully!");

        setFormData({
          // Reset the form data
          companyName: "",
          email: "",
          position: "",
          experience: "",
          education: "",
          description: "",
          address: "",
          country: "",
          city: "",
          keywords: "",
        });

        window.location.reload(); // Reload the current page
      } else {
        throw new Error("Failed to submit job offer");
      }
    } catch (error) {
      console.error("Error submitting job offer:", error);
      alert("An error occurred while submitting the job offer.");
    }
  }

  // Define cities for Morocco and France
  const citiesByCountry = {
    Morocco: ["Casablanca", "Rabat", "Marrakech"],
    France: ["Paris", "Marseille", "Lyon"],
  };

  // Function to handle country change
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setCities(citiesByCountry[selectedCountry] || []);
  };
  const handleLinkedInAuth = async (code) => {
    try {
      const response = await fetch("/exchange-code-for-access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(code),
      });
      const data = await response.json();
      if (response.ok) {
        await handleLinkedInShare(data.access_token);
      } else {
        throw new Error("Failed to authenticate with LinkedIn");
      }
    } catch (error) {
      console.error("Error authenticating with LinkedIn:", error);
      alert("An error occurred while authenticating with LinkedIn.");
    }
  };

  const handleLinkedInShare = async (accessToken) => {
    try {
      const content = {
        content: {
          title: formData.position + " at " + formData.companyName,
          description: formData.description,
          experience: formData.experience,
          education: formData.education,
          address: formData.address,
          country: formData.country,
          city: formData.city,
          // Add more fields as needed
        },
        visibility: {
          code: "connections-only",
        },
      };

      const response = await fetch("/share-on-linkedin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        alert("Shared on LinkedIn successfully!");
        setShared(true); // Update state to indicate shared
      } else {
        throw new Error("Failed to share on LinkedIn");
      }
    } catch (error) {
      console.error("Error sharing on LinkedIn:", error);
      alert("An error occurred while sharing on LinkedIn.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12 px-16">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-lg font-bold py-8 leading-9 text-gray-900">
            Make an Offer
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="company-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  autoComplete="given-name"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Job Title/Position:
              </label>
              <div className="mt-2">
                <select
                  id="Software enginner"
                  name="position"
                  autoComplete="position"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">Select position</option>
                  <option>Software enginner</option>
                  <option>Data enginner</option>
                  <option>Cloud engineer</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Experience Level:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="experience"
                  id="experience"
                  autoComplete="family-name"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="position"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Education Requirements:
              </label>
              <div className="mt-2">
                <select
                  id="education"
                  name="education"
                  autoComplete="education-name"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">Select education requirements</option>
                  <option>Bac +2</option>
                  <option>Bac +3</option>
                  <option>Bac +5</option>
                  <option>Bac +7</option>
                </select>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                More description:
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about the offer.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={handleCountryChange}
                >
                  <option value="">Select Country</option>
                  <option value="Morocco">Morocco</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <select
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  autoComplete="address"
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Keywords
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="keywords"
                  id="keywords"
                  value={formData.keywords} // Set the value to the keywords from the form data state
                  onChange={handleInputChange} // Handle input changes and update the form data state
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 mr-16 ">
        <LinkedInAuthButton onLinkedInAuth={handleLinkedInAuth} />
        <button
          onAbort={handleLinkedInAuth}
          className="text-sm font-semibold leading-6 text-gray-900 border border-gray-900 rounded-md px-3 py-2 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          disabled={shared} // Disable button if already shared
        >
          Share on LinkedIn
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
