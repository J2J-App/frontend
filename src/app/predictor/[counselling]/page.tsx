"use client";
import React, { useEffect, useReducer } from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput.tsx";
import Styles from "./styles.module.css";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Button from "@/components/buttons/button.tsx";
import DataTable from "@/components/data-table/data-table.tsx";
import Image from "next/image";

import headingbg from "@/public/backgrounds/predictor/bgheading.jpg";
import Tabs from "@/components/tabs/tabs.tsx";

import { SelectOption } from "@/components/select-menus/select-menu.tsx";
import Loader from "@/components/loader/loader.tsx";
import { useParams, useRouter } from "next/navigation";
import { counsellings } from "@/app/predictor/counsellings.ts";
import Switch from "@/components/switch/switch.tsx";
import Checkbox from "@/components/check-boxes/check-boxes.tsx";
import API_URL from "@/config";

// Create a reusable fetch function that can be called from multiple places
const fetchPredictorData = async ({
  counselling,
  mainsCRLRank,
  mainsCATRank,
  advCATRank,
  advEnabled,
  region,
  category,
  subCategory,
  gender,
  year,
  typesList,
  currentType,
  setIsLoading,
  setApiError,
  setResult,
  setErrors,
}: {
  counselling: string;
  mainsCRLRank: string;
  mainsCATRank: string;
  advCATRank: string;
  advEnabled: boolean;
  region: string | null;
  category: string | null;
  subCategory: string | null;
  gender: string | null;
  year: string;
  typesList: string[];
  currentType: string | null;
  setIsLoading: any;
  setApiError: any;
  setResult: any;
  setErrors: any;
}) => {
  // Reset API error and validation errors
  setApiError(null);
  setErrors([]);

  // Comprehensive field validation with specific error messages
  const validationErrors = validateAllFields({
    counselling,
    mainsCRLRank,
    mainsCATRank,
    advCATRank,
    advEnabled,
    region,
    category,
    subCategory,
    gender,
    currentType,
  });

  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return false;
  }

  // Start loading
  setIsLoading(true);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    // JAC counselling request
    if (counselling === "jac") {
      if (mainsCRLRank && region && category && subCategory) {
        response = await fetch(`${API_URL}/v2/cutoff/predictor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            counselling: counselling.toUpperCase(),
            rank: mainsCRLRank,
            domicile: region,
            category: `${category}`,
            subcategory: `${subCategory}`,
            year: Number(year),
            gender: `${gender}`,
          }),
          signal: controller.signal,
        });
      }
    } else if (counselling === "josaa") {
      if (
        mainsCATRank &&
        region &&
        category &&
        subCategory &&
        currentType !== "IIT"
      ) {
        response = await fetch(`${API_URL}/v2/cutoff/predictor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            counselling: counselling.toUpperCase(),
            rank: mainsCATRank,
            domicile: region,
            category: `${category}`,
            subcategory: `${subCategory}`,
            year: Number(year),
            gender: `${gender}`,
            college_type: `${currentType}`,
          }),
          signal: controller.signal,
        });
      } else {
        response = await fetch(`${API_URL}/v2/cutoff/predictor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            counselling: counselling.toUpperCase(),
            adv_rank: advCATRank,
            domicile: region,
            category: `${category}`,
            subcategory: `${subCategory}`,
            year: Number(year),
            gender: `${gender}`,
            college_type: `${currentType}`,
          }),
          signal: controller.signal,
        });
      }
    }

    if (response) {
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          // Optionally, set data to state here if needed
          return data;
        } else {
          setApiError("No data found for the given input.");
          return false;
        }
      } else {
        // Try to parse error message from response
        let errorMsg = "Failed to fetch data from server.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
        setApiError(errorMsg);
        return false;
      }
    }
    setApiError("No response from server.");
    return false; // No response or empty data
  } catch (err: any) {
    console.error("Error fetching data:", err);

    // Handle specific error types with improved messages
    if (err.name === "AbortError") {
      setApiError(
        "Request timed out. Please check your internet connection and try again."
      );
    } else if (err.message === "Failed to fetch") {
      setApiError(
        "Network error. Please check your internet connection and try again."
      );
    } else {
      setApiError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
    return false;
  } finally {
    setIsLoading(false);
  }
};

// Helper function to validate input ranks
const validateInput = (rankVal: string) => {
  if (rankVal === "" || rankVal === null) {
    return false;
  } else if (Number(rankVal) <= 0) {
    return false;
  } else if (Number(rankVal) > 3000000) {
    return false;
  }
  return true;
};

// Enhanced validation function that provides field-specific error messages
const validateAllFields = ({
  counselling,
  mainsCRLRank,
  mainsCATRank,
  advCATRank,
  advEnabled,
  region,
  category,
  subCategory,
  gender,
  currentType,
}: {
  counselling: string;
  mainsCRLRank: string;
  mainsCATRank: string;
  advCATRank: string;
  advEnabled: boolean;
  region: string | null;
  category: string | null;
  subCategory: string | null;
  gender: string | null;
  currentType: string | null;
}) => {
  const errors: string[] = [];

  // Validate rank fields based on counselling type
  if (counselling === "jac") {
    if (!mainsCRLRank || mainsCRLRank.trim() === "") {
      errors.push("Mains CRL Rank is required");
    } else if (Number(mainsCRLRank) <= 0) {
      errors.push("Mains CRL Rank must be greater than 0");
    } else if (Number(mainsCRLRank) > 3000000) {
      errors.push("Mains CRL Rank seems too high. Please verify your input");
    }
  } else if (counselling === "josaa") {
    // For IIT, advanced rank is required
    if (currentType === "IIT") {
      if (!advEnabled) {
        errors.push("Please enable Advanced Category Rank to access IIT data");
      } else if (!advCATRank || advCATRank.trim() === "") {
        errors.push("Advanced Category Rank is required for IIT colleges");
      } else if (Number(advCATRank) <= 0) {
        errors.push("Advanced Category Rank must be greater than 0");
      } else if (Number(advCATRank) > 300000) {
        errors.push(
          "Advanced Category Rank seems too high. Please verify your input"
        );
      }
    } else {
      // For non-IIT colleges, mains category rank is required
      if (!mainsCATRank || mainsCATRank.trim() === "") {
        errors.push("Mains Category Rank is required");
      } else if (Number(mainsCATRank) <= 0) {
        errors.push("Mains Category Rank must be greater than 0");
      } else if (Number(mainsCATRank) > 3000000) {
        errors.push(
          "Mains Category Rank seems too high. Please verify your input"
        );
      }
    }
  }

  // Validate common required fields
  if (!region) {
    errors.push("Please select your domicile state");
  }

  if (!category) {
    errors.push("Please select your category");
  }

  if (!subCategory) {
    errors.push("Please select your sub-category");
  }

  if (!gender) {
    errors.push("Please select your gender");
  }

  return errors;
};

function transformData(
  input: {
    round: number;
    college: string;
    branch: string;
    icon: string;
    rank?: number;
    opening?: number;
    closing?: number;
    is_bonus?: boolean;
  }[],
  year: string | number
) {
  const result: any = {};

  if (!Array.isArray(input)) {
    console.error("❌ Expected array input in transformData but got:", input);
    return [];
  }

  if (!input.length) {
    console.warn("⚠️ Empty input array passed to transformData");
    return [];
  }

  const first = input[0];
  if (!first) {
    console.warn("⚠️ First entry in input is undefined or null:", first);
    return [];
  }

  if ("rank" in first) {
    input.forEach((entry, i) => {
      if (!entry) {
        console.warn(`⚠️ Skipping null/undefined entry at index ${i}`);
        return;
      }
      const { round, college, branch, rank, icon, is_bonus } = entry;

      if (!round || !college || !branch || rank === undefined) {
        console.warn(
          `⚠️ Missing required fields in rank entry at index ${i}:`,
          entry
        );
        return;
      }

      if (!result[year]) result[year] = {};
      const roundLabel = `Round ${round}`;
      if (!result[year][roundLabel]) result[year][roundLabel] = [];

      result[year][roundLabel].push({
        uni: college,
        branch,
        rank,
        icon,
        is_bonus: is_bonus || false,
      });
    });
  } else if ("opening" in first && "closing" in first) {
    input.forEach((entry, i) => {
      if (!entry) {
        console.warn(`⚠️ Skipping null/undefined entry at index ${i}`);
        return;
      }
      const { round, college, branch, opening, closing, icon } = entry;

      if (
        !round ||
        !college ||
        !branch ||
        opening === undefined ||
        closing === undefined
      ) {
        console.warn(
          `⚠️ Missing required fields in opening/closing entry at index ${i}:`,
          entry
        );
        return;
      }

      if (!result[year]) result[year] = {};
      const roundLabel = `Round ${round}`;
      if (!result[year][roundLabel]) result[year][roundLabel] = [];

      result[year][roundLabel].push({
        uni: college,
        branch,
        opening,
        closing,
        icon,
      });
    });
  } else {
    console.warn(
      "⚠️ Input does not contain expected 'rank' or 'opening/closing' keys:",
      first
    );
    return [];
  }

  // Final transformation
  return Object.entries(result)
    .map(([yearKey, roundsObj]: any) => {
      const ranks = Object.entries(roundsObj).map(([round, data]) => ({
        round,
        data,
      }));

      return {
        year: parseInt(yearKey),
        ranks,
      };
    })
    .sort((a, b) => b.year - a.year); // Descending by year
}

function SortedTable({
  data,
  year,
  setYear,
  fetchForYear,
  isLoading,
}: {
  data: any;
  year: string;
  setYear: (year: string) => void;
  fetchForYear: any;
  isLoading: boolean;
}) {
  const [tab, setTab] = React.useState(0);
  // console.log("pre transform:", data)
  // Handle year change with data fetching
  const handleYearChange = async (selectedYear: string) => {
    setYear(selectedYear);
    setTab(0);

    // If we don't already have data for this year, fetch it
    if (!data[selectedYear] || data[selectedYear].length === 0) {
      await fetchForYear(selectedYear);
    }
  };

  const transformedData = React.useMemo(() => {
    if (!data[year] || !Array.isArray(data[year])) {
      return [{ year: parseInt(year), ranks: [] }];
    }

    return transformData(data[year], year);
  }, [data, year]);
  // console.log("transformer:", transformedData)
  const yearRanks =
    transformedData.length > 0
      ? transformedData.find((r) => r.year.toString() === year)?.ranks || []
      : [];

  const sortedRanks = yearRanks.sort((a: any, b: any) => {
    const getRoundPriority = (round: any) => {
      // Handle Round 1-5 with priorities 1-5
      if (round.startsWith("Round")) {
        const number = parseInt(round.split(" ")[1], 10);
        if (number >= 1 && number <= 5) {
          return { type: "R", number: number, priority: number };
        }
      }

      // Handle specific cases with explicit priorities
      if (round === "Upgradation 1")
        return { type: "U", number: 1, priority: 6 };
      if (round === "Spot Round 1")
        return { type: "S", number: 1, priority: 7 };
      if (round === "Upgradation 2")
        return { type: "U", number: 2, priority: 8 };

      // Default case for any unknown rounds
      return { type: "", number: 0, priority: 100 };
    };

    const roundA = getRoundPriority(a.round);
    const roundB = getRoundPriority(b.round);

    // Compare by explicit priority first
    if (roundA.priority !== roundB.priority) {
      return roundA.priority - roundB.priority;
    }

    // If same priority, compare by number
    return roundA.number - roundB.number;
  });

  // Map the sorted ranks to tab content
  const tabContent = sortedRanks.map((d: any) => ({
    label: d.round,
    content: (
      <DataTable
        data={d.data.map(
          ({ uni, ...rest }: { [x: string]: any; uni: string }) => ({
            college: uni,
            ...rest,
          })
        )}
      />
    ),
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "820px",
      }}
    >
      <div
        style={{
          zIndex: 20,
          position: "relative",
        }}
      >
        <SelectMenu
          options={[
            { value: "2024", label: "2024" },
            { value: "2023", label: "2023" },
            { value: "2022", label: "2022" },
          ]}
          onChange={handleYearChange}
          defaultValue={year}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ zIndex: -1 }}>
          {tabContent.length > 0 ? (
            <Tabs setActiveIndex={setTab} activeIndex={tab} tabs={tabContent} />
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#999",
              }}
            >
              No data available for {year}. Select a different year or submit a
              new request.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const {
    counselling,
  }: {
    counselling: string;
  } = useParams();
  const currentCounselling = counsellings
    .filter((e) => e.link == counselling)
    .pop();
  const ranks = currentCounselling?.ranks;

  // Form state
  const [resetKey, setResetKey] = React.useState<number>(0);
  const [mainsCRLRank, setMainsCRLRank] = React.useState<string>("");
  const [mainsCATRank, setMainsCATRank] = React.useState<string>("");
  const [advCATRank, setAdvCATRank] = React.useState<string>("");
  const [advEnabled, setAdvEnabled] = React.useState<boolean>(false);
  const [region, setRegion] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string | null>(null);
  const [subCategory, setSubCategory] = React.useState<string | null>(null);
  const [sepCategory, setSepCategory] = React.useState<boolean>(false);
  const [gender, setGender] = React.useState<string | null>(null);

  // Result state - initialize with proper structure
  const [result, setResult] = React.useState({
    "2024": [],
    "2023": [],
    "2022": [],
  });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string>("2024");
  const [collegeType, setCollegeType] = React.useState<string | null>(null);
  const [typesList, setTypesList] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  // Load saved state from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Load basic form values
      const savedMARank = localStorage.getItem("mains_crl_rank");
      const savedMCRank = localStorage.getItem("mains_cat_rank");
      const savedACRank = localStorage.getItem("adv_cat_rank");
      const enabledAdv = localStorage.getItem("adv_enabled");
      const savedRegion = localStorage.getItem("region");
      const savedCategory = localStorage.getItem("category");
      const savedSubCategory = localStorage.getItem("subCategory");
      const savedGender = localStorage.getItem("gender");
      const savedSepCategory = localStorage.getItem(counselling + "_sepcat");

      const savedTypes = localStorage.getItem(counselling + "_types");
      const savedType = localStorage.getItem(counselling + "_collegeType");

      // Load counselling-specific values if using separate categories
      if (savedMARank) setMainsCRLRank(savedMARank);
      if (savedMCRank) setMainsCATRank(savedMCRank);
      if (savedACRank) setAdvCATRank(savedACRank);
      if (enabledAdv) setAdvEnabled(enabledAdv === "true");
      if (savedRegion) setRegion(savedRegion);
      if (savedCategory)
        setCategory(
          savedCategory == "OBC-NCL" && counselling == "jac"
            ? "OBC"
            : savedCategory
        );
      if (savedSubCategory) setSubCategory(savedSubCategory);
      if (savedGender) setGender(savedGender);
      if (savedSepCategory) setSepCategory(savedSepCategory == "true");
      if (savedTypes) {
        const parsedTypes = JSON.parse(savedTypes);
        setTypesList(parsedTypes);
        setActiveIndex(parsedTypes.indexOf(savedType));
      }
      if (savedType) setCollegeType(savedType);
      if (!savedType && !savedTypes) {
        if (currentCounselling?.types) {
          setCollegeType(currentCounselling?.types[0]);
          setTypesList(currentCounselling?.types);
          localStorage.setItem(
            counselling + "_types",
            JSON.stringify(currentCounselling?.types)
          );
          localStorage.setItem(
            counselling + "_collegeType",
            currentCounselling?.types[0]
          );
        }
      }

      if (savedSepCategory == "true") {
        const currentCategory = localStorage.getItem(counselling + "_category");
        const currentSubCategory = localStorage.getItem(
          counselling + "_subCategory"
        );
        if (currentCategory)
          setCategory(
            currentCategory == "OBC-NCL" && counselling == "jac"
              ? "OBC"
              : currentCategory
          );
        if (currentSubCategory) setSubCategory(currentSubCategory);
      }

      // Try to load saved results
      try {
        const savedResult = localStorage.getItem(counselling + "_result");
        if (savedResult) {
          setResult((prev) => ({
            ...prev,
            ...JSON.parse(savedResult),
          }));
        }
      } catch (e) {
        console.error("Error loading saved results:", e);
      }

      // Load college types
    }
  }, [counselling]);

  function clearResults() {
    setResult({
      "2024": [],
      "2023": [],
      "2022": [],
    });
    localStorage.removeItem(counselling + "_result");
  }

  // Input handlers
  const handleMAChange = (e: any) => {
    const value = e.target.value;
    setErrors([]);
    setApiError(null);

    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setMainsCRLRank(value ? value : "");
      localStorage.setItem("mains_crl_rank", value);
    }
    clearResults();
  };

  const handleMCChange = (e: any) => {
    const value = e.target.value;
    setErrors([]);
    setApiError(null);

    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setMainsCATRank(value ? value : "");
      localStorage.setItem("mains_cat_rank", value);
    }
    clearResults();
  };

  const handleACChange = (e: any) => {
    const value = e.target.value;
    setErrors([]);
    setApiError(null);

    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setAdvCATRank(value ? value : "");
      localStorage.setItem("adv_cat_rank", value);
    }
    clearResults();
  };

  // Other form handlers
  const handleOnChangeOfRegion = (value: string) => {
    setRegion(value);
    localStorage.setItem("region", value);
    setErrors([]);
    setApiError(null);
    clearResults();
  };

  const handleOnChangeOfCategory = (value: string) => {
    setCategory(value);
    if (sepCategory) {
      localStorage.setItem(counselling + "_category", value);
    } else {
      localStorage.setItem("category", value);
    }
    setErrors([]);
    setApiError(null);
    clearResults();
  };

  const handleChangeSubCategory = (value: string) => {
    setSubCategory(value);
    if (sepCategory) {
      localStorage.setItem(counselling + "_subCategory", value);
    } else {
      localStorage.setItem("subCategory", value);
    }
    setErrors([]);
    setApiError(null);
    clearResults();
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    localStorage.setItem("gender", value);
    setErrors([]);
    setApiError(null);
    clearResults();
  };

  const handleClear = () => {
    // Reset all form values
    setResult({
      "2024": [],
      "2023": [],
      "2022": [],
    });
    setAdvCATRank("");
    setMainsCATRank("");
    setMainsCRLRank("");
    setAdvEnabled(false);
    setRegion(null);
    setSepCategory(false);
    setCategory(null);
    setSubCategory(null);
    setGender(null);
    setErrors([]);
    setApiError(null);
    setResetKey((prev) => prev + 1);
    setYear("2024");

    // Clear localStorage
    localStorage.removeItem("mains_crl_rank");
    localStorage.removeItem("mains_cat_rank");
    localStorage.removeItem("adv_cat_rank");
    localStorage.removeItem("adv_enabled");
    localStorage.removeItem("region");
    localStorage.removeItem("category");
    localStorage.removeItem("subCategory");
    localStorage.removeItem("gender");
    localStorage.removeItem(counselling + "_sepcat");
    localStorage.removeItem(counselling + "_category");
    localStorage.removeItem(counselling + "_subCategory");
    localStorage.removeItem(counselling + "_result");
  };

  // Main fetch function using our reusable function
  const handleSubmit = async () => {
    // Call the reusable fetch function with enhanced validation
    const resultData = await fetchPredictorData({
      counselling,
      mainsCRLRank,
      mainsCATRank,
      advCATRank,
      advEnabled,
      region,
      category,
      subCategory,
      gender,
      year,
      typesList,
      currentType: collegeType,
      setIsLoading,
      setApiError,
      setResult,
      setErrors,
    });

    if (resultData) {
      // Update the result state and local storage upon successful fetch
      setResult((prevResult) => {
        const updatedResult = {
          ...prevResult,
          [year]: resultData,
        };
        localStorage.setItem(counselling + "_result", JSON.stringify(updatedResult));
        return updatedResult;
      });
    }
  };

  // Function to fetch data for a specific year - to be passed to SortedTable
  const fetchForYear = async (selectedYear: string) => {
    const resultData = await fetchPredictorData({
      counselling,
      mainsCRLRank,
      mainsCATRank,
      advCATRank,
      advEnabled,
      region,
      category,
      subCategory,
      gender,
      year: selectedYear,
      typesList,
      currentType: collegeType,
      setIsLoading,
      setApiError,
      setResult,
      setErrors,
    });
    
    if (resultData) {
      // Update the result state and local storage upon successful fetch
      setResult((prevResult) => {
        const updatedResult = {
          ...prevResult,
          [selectedYear]: resultData,
        };
        localStorage.setItem(counselling + "_result", JSON.stringify(updatedResult));
        return updatedResult;
      });
    }
    
    return resultData;
  };

  const handleTypeChange = async (index: number) => {
    const selectedType = typesList[index];
    // console.log("selt:",selectedType)
    if (selectedType === collegeType) return;
    if (selectedType === "IIT" && !advEnabled) {
      setErrors(["Please enable Advanced Category Rank to access IIT data"]);
      return;
    }

    setResult({
      "2024": [],
      "2023": [],
      "2022": [],
    });

    // Update state using functional update to avoid stale closure
    setCollegeType((prevType) => {
      localStorage.setItem(`${counselling}_collegeType`, selectedType);
      return selectedType;
    });

    // Fetch data using the selectedType directly, not relying on state
    try {
      await fetchPredictorData({
        counselling,
        mainsCRLRank,
        mainsCATRank,
        advCATRank,
        advEnabled,
        region,
        category,
        subCategory,
        gender,
        year,
        typesList,
        currentType: selectedType, // Use selectedType directly
        setIsLoading,
        setApiError,
        setResult,
        setErrors,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setActiveIndex(index);
  };

  // Error message display component
  const ErrorMessages = () => {
    if (errors.length === 0 && !apiError) return null;

    return (
      <div
        style={{
          backgroundColor: "#382e2e",
          border: "1px solid #FFCCC7",
          borderRadius: "4px",
          padding: "12px 16px",
          marginTop: "16px",
          width: "100%",
          maxWidth: "820px",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {errors.map((error, index) => (
          <p
            key={index}
            style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}
          >
            • {error}
          </p>
        ))}
        {apiError && (
          <p style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}>
            • {apiError}
          </p>
        )}

        {/* 🔑 MODIFIED CODE: MANUAL RETRY BUTTON FOR API ERRORS */}
        {apiError && (
          <button
            onClick={handleSubmit} // Call the main fetch handler to retry
            style={{
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: isLoading ? '#5a6268' : '#d9534f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'default' : 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Retrying...' : 'Click to Retry Request'}
          </button>
        )}
      </div>
    );
  };

  // Map for rank inputs
  const rankInputsMap: {
    [key: string]: {
      value: string;
      onChange: (e: any) => void;
      placeholder: string;
    };
  } = {
    MA: {
      value: mainsCRLRank,
      onChange: handleMAChange,
      placeholder: "Mains CRL Rank",
    },
    MC: {
      value: mainsCATRank,
      onChange: handleMCChange,
      placeholder: "Mains Category Rank",
    },
    AC: {
      value: advCATRank,
      onChange: handleACChange,
      placeholder: "Advanced Category Rank",
    },
  };

  // Check if we have data to display
  const hasData = Object.values(result).some(
    (yearData) => Array.isArray(yearData) && yearData.length > 0
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        padding: "0 20px",
        gap: "18px",
        minHeight: "calc(100vh - 80px)",
        overflow: "visible",
      }}
    >
      <div className={Styles.headContainer}>
        <div className={Styles.heading}>
          <Image
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            fill
            src={headingbg}
            alt="Predictor page heading background"
          />
          <div className={Styles.textContainer}>
            <span
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: "28px",
              }}
            >
              Predictor
            </span>
            <br />
            <span
              style={{
                color: "white",
                fontWeight: "200",
                fontSize: "16px",
              }}
            >
              Enter your rank and category to predict what branch you might get
              based on last year's data.
            </span>
          </div>
        </div>

        <div className={Styles.container}>
          <div style={{ width: "100%" }}>
            <p className={Styles.headers}>Ranks</p>
            <div className={Styles.rankInputs}>
              {ranks &&
                ranks.map((rank, index) => {
                  const r = rankInputsMap[rank];
                  if (rank === "AC") {
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          paddingRight: "10px",
                        }}
                      >
                        <SingleInput
                          enabled={advEnabled}
                          holder={r.placeholder}
                          value={r.value || ""}
                          onChange={r.onChange}
                          type={"number"}
                        />
                        <Checkbox
                          checked={advEnabled}
                          onChange={(c) => {
                            setAdvEnabled(c);
                            localStorage.setItem("adv_enabled", c.toString());
                          }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <SingleInput
                        key={index}
                        holder={r.placeholder}
                        value={r.value || ""}
                        onChange={r.onChange}
                        type={"number"}
                      />
                    );
                  }
                })}
            </div>

            <div className={Styles.inputContainer}>
              <p className={Styles.headers}>Domicile</p>
              <SelectMenu
                key={`region-${resetKey}`}
                options={currentCounselling?.regions || []}
                defaultValue={
                  currentCounselling?.regions.some((e) => e.value == region) ||
                  region == null
                    ? region
                    : "ox"
                }
                onChange={handleOnChangeOfRegion}
                placeholder="Domicile"
              />

              <p className={Styles.headers}>Categories</p>
              <SelectMenu
                key={`category-${resetKey}`}
                options={currentCounselling?.categories || []}
                onChange={handleOnChangeOfCategory}
                defaultValue={category}
                placeholder="Category"
              />

              <SelectMenu
                key={`subcat-${resetKey}`}
                options={currentCounselling?.subCategories || []}
                onChange={handleChangeSubCategory}
                defaultValue={
                  currentCounselling?.subCategories.some(
                    (e) => e.value == subCategory
                  )
                    ? subCategory
                    : " "
                }
                placeholder="Sub Category"
              />

              <Checkbox
                label={"Use unique categories for this counselling"}
                checked={sepCategory}
                onChange={(c) => {
                  if (c) {
                    const currentCategory = localStorage.getItem(
                      counselling + "_category"
                    );
                    const currentSubCategory = localStorage.getItem(
                      counselling + "_subCategory"
                    );
                    if (currentCategory)
                      setCategory(
                        currentCategory == "OBC-NCL" && counselling == "jac"
                          ? "OBC"
                          : currentCategory
                      );
                    if (currentSubCategory) setSubCategory(currentSubCategory);
                  } else {
                    const savedCategory = localStorage.getItem("category");
                    const savedSubCategory =
                      localStorage.getItem("subCategory");
                    if (savedCategory)
                      setCategory(
                        savedCategory == "OBC-NCL" && counselling == "jac"
                          ? "OBC"
                          : savedCategory
                      );
                    if (savedSubCategory) setSubCategory(savedSubCategory);
                  }
                  setSepCategory(c);
                  localStorage.setItem(counselling + "_sepcat", c.toString());
                }}
              />

              <div style={{ marginTop: 5 }}></div>

              <p className={Styles.headers}>Gender</p>
              <SelectMenu
                key={`gender-${resetKey}`}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                ]}
                onChange={handleGenderChange}
                defaultValue={gender}
                placeholder="Gender"
              />
            </div>

            <div
              style={{
                zIndex: 2,
                position: "relative",
                marginTop: "10px",
                display: "flex",
                gap: "15px",
              }}
            >
              <Button
                text={"Submit"}
                onClick={handleSubmit}
                variant="Primary"
                height={38}
                disabled={isLoading}
              />
              <Button
                text={"Clear"}
                onClick={handleClear}
                variant="Outline"
                height={38}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Only show loader here if no results are being displayed yet */}

      {typesList && typesList.length > 0 && (
        <div className={Styles.uniHead}>
          {typesList.map((type, index) => {
            return (
              <button
                key={type}
                onClick={() => {
                  handleTypeChange(index);
                }}
                className={
                  index === activeIndex
                    ? Styles.activeType + " " + Styles.typeButton
                    : Styles.typeButton
                }
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      <ErrorMessages />

      {isLoading && !hasData && <Loader />}

      {hasData && (
        <SortedTable
          data={result}
          year={year}
          setYear={setYear}
          fetchForYear={fetchForYear}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}