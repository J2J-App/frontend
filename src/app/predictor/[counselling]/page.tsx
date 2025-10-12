"use client";
import React, { useEffect, useReducer, useMemo, useCallback } from "react";
import SingleInput from "@/components/Inputs/SingleInput/singleInput.tsx";
import Styles from "./styles.module.css";
import SelectMenu from "@/components/select-menus/select-menu.tsx";
import Button from "@/components/buttons/button.tsx";
import CollegeLadder from "@/components/college-ladder/college-ladder.tsx";
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
          // ✅ Success case - save results
          setResult((prevResult: { [key: string]: any }) => ({
            ...prevResult,
            [year]: data.data
          }));

          // Save to localStorage
          const existingResult = JSON.parse(localStorage.getItem(counselling + "_result") || "{}");
          const updatedResult = {
            ...existingResult,
            [year]: data.data
          };
          localStorage.setItem(counselling + "_result", JSON.stringify(updatedResult));

          return true; // Indicate successful fetch
        } else {
          setApiError("No data found for the given input.");
          return false;
        }
      } else {
        // ❌ Error case - parse and set error message
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
    if (err.name === 'AbortError') {
      setApiError("Request timed out. Please check your internet connection and try again.");
    } else if (err.message === 'Failed to fetch') {
      setApiError("Network error. Please check your internet connection and try again.");
    } else {
      setApiError(err.message || "An unexpected error occurred. Please try again.");
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

// Function to calculate admission probability based on user's rank vs cutoff
function calculateAdmissionProbability(userRank: number, cutoffRank: number): number {
  if (userRank <= cutoffRank) {
    // High probability if user rank is better than or equal to cutoff
    const margin = Math.max(1, cutoffRank * 0.1); // 10% margin
    if (userRank <= cutoffRank - margin) {
      return 0.9; // Very high probability
    } else {
      return 0.7; // Good probability
    }
  } else {
    // Lower probability if user rank is worse than cutoff
    const diff = userRank - cutoffRank;
    const margin = cutoffRank * 0.2; // 20% margin for consideration
    
    if (diff <= margin) {
      return Math.max(0.1, 0.5 - (diff / margin) * 0.4); // 0.1 to 0.5 probability
    } else {
      return 0.05; // Very low probability
    }
  }
}

// Function to get user's effective rank based on counselling and college type
function getUserEffectiveRank(counselling: string, collegeType: string, mainsCRLRank: string, mainsCATRank: string, advCATRank: string): number {
  if (counselling === "jac") {
    return parseInt(mainsCRLRank) || 0;
  } else if (counselling === "josaa") {
    if (collegeType === "IIT") {
      return parseInt(advCATRank) || 0;
    } else {
      return parseInt(mainsCATRank) || 0;
    }
  }
  return 0;
}

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
  year: string | number, 
  userRank?: number
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

  if ('rank' in first) {
    input.forEach((entry, i) => {
      if (!entry) {
        console.warn(`⚠️ Skipping null/undefined entry at index ${i}`);
        return;
      }
      const { round, college, branch, rank, icon, is_bonus } = entry;

      if (!round || !college || !branch || rank === undefined) {
        console.warn(`⚠️ Missing required fields in rank entry at index ${i}:`, entry);
        return;
      }

      if (!result[year]) result[year] = {};
      const roundLabel = `Round ${round}`;
      if (!result[year][roundLabel]) result[year][roundLabel] = [];

      // Calculate probability if userRank is provided
      const probability = userRank ? calculateAdmissionProbability(userRank, rank) : 0;

      result[year][roundLabel].push({
        uni: college,
        branch,
        rank,
        icon,
        is_bonus: is_bonus || false,
        probability,
      });
    });
  } else if ('opening' in first && 'closing' in first) {
    input.forEach((entry, i) => {
      if (!entry) {
        console.warn(`⚠️ Skipping null/undefined entry at index ${i}`);
        return;
      }
      const { round, college, branch, opening, closing, icon } = entry;

      if (!round || !college || !branch || opening === undefined || closing === undefined) {
        console.warn(`⚠️ Missing required fields in opening/closing entry at index ${i}:`, entry);
        return;
      }

      if (!result[year]) result[year] = {};
      const roundLabel = `Round ${round}`;
      if (!result[year][roundLabel]) result[year][roundLabel] = [];

      // Use closing rank for probability calculation
      const probability = userRank ? calculateAdmissionProbability(userRank, closing) : 0;

      result[year][roundLabel].push({
        uni: college,
        branch,
        opening,
        closing,
        icon,
        probability,
      });
    });
  } else {
    console.warn("⚠️ Input does not contain expected 'rank' or 'opening/closing' keys:", first);
    return [];
  }

  // Final transformation with probability-based sorting and limiting
  return Object.entries(result)
    .map(([yearKey, roundsObj]: any) => {
      const ranks = Object.entries(roundsObj).map(([round, data]) => {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];
        
        // Sort by probability (highest first), then by rank (lowest first)
        const sortedData = dataArray
          .sort((a, b) => {
            // First sort by probability (descending)
            if (b.probability !== a.probability) {
              return b.probability - a.probability;
            }
            // Then by rank (ascending - lower rank is better)
            const aRank = a.rank || a.closing || 0;
            const bRank = b.rank || b.closing || 0;
            return aRank - bRank;
          })
          // Limit to top 100 colleges with highest probability
          .slice(0, 100);

        return {
          round,
          data: sortedData,
        };
      });

      return {
        year: parseInt(yearKey),
        ranks,
      };
    })
    .sort((a, b) => b.year - a.year); // Descending by year
}

// Memoized SortedTable component to prevent unnecessary re-renders with proper comparison
const SortedTable = React.memo(({ 
  data, 
  year, 
  setYear, 
  fetchForYear, 
  isLoading, 
  counselling, 
  collegeType, 
  mainsCRLRank, 
  mainsCATRank, 
  advCATRank, 
  handleCollegeHover, 
  handleCollegeClick 
}: {
  data: any;
  year: string;
  setYear: (year: string) => void;
  fetchForYear: any;
  isLoading: boolean;
  counselling: string;
  collegeType: string;
  mainsCRLRank: string;
  mainsCATRank: string;
  advCATRank: string;
  handleCollegeHover: (college: any) => void;
  handleCollegeClick: (college: any) => void;
}) => {
  const [tab, setTab] = React.useState(0);
  
  // Handle year change with data fetching - properly memoized
  const handleYearChange = useCallback(async (selectedYear: string) => {
    if (selectedYear === year) return; // Prevent unnecessary re-renders
    
    setYear(selectedYear);
    setTab(0);

    // If we don't already have data for this year, fetch it
    if (!data[selectedYear] || data[selectedYear].length === 0) {
      await fetchForYear(selectedYear);
    }
  }, [year, data, fetchForYear, setYear]);

  // Memoize transformed data with stable dependencies
  const transformedData = useMemo(() => {
    if (!data[year] || !Array.isArray(data[year])) {
      return [{ year: parseInt(year), ranks: [] }];
    }

    // Get user's effective rank for probability calculation
    const userRank = getUserEffectiveRank(counselling, collegeType, mainsCRLRank, mainsCATRank, advCATRank);
    
    return transformData(data[year], year, userRank);
  }, [data, year, counselling, collegeType, mainsCRLRank, mainsCATRank, advCATRank]);
  
  // Memoize yearRanks with stable dependencies
  const yearRanks = useMemo(() => {
    return transformedData.length > 0
      ? transformedData.find(r => r.year.toString() === year)?.ranks || []
      : [];
  }, [transformedData, year]);

  // Memoize sortedRanks with stable dependencies
  const sortedRanks = useMemo(() => {
    return yearRanks.sort((a: any, b: any) => {
      const getRoundPriority = (round: any) => {
        // Handle Round 1-5 with priorities 1-5
        if (round.startsWith("Round")) {
          const number = parseInt(round.split(" ")[1], 10);
          if (number >= 1 && number <= 5) {
            return { type: "R", number: number, priority: number };
          }
        }

        // Handle specific cases with explicit priorities
        if (round === "Upgradation 1") return { type: "U", number: 1, priority: 6 };
        if (round === "Spot Round 1") return { type: "S", number: 1, priority: 7 };
        if (round === "Upgradation 2") return { type: "U", number: 2, priority: 8 };

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
  }, [yearRanks]);

  // Memoize tabs data with stable dependencies - no component creation
  const tabsData = useMemo(() => {
    return sortedRanks.map((d: any, index: number) => {
      const transformedData = d.data?.map((item: any) => ({
        name: item.uni || item.college || 'Unknown College',
        rank: item.rank || item.closing || 0,
        trend: item.probability > 0.7 ? 'high' : item.probability > 0.4 ? 'medium' : 'low',
        cluster: `${Math.round((item.probability || 0) * 100)}% chance`,
        probability: item.probability || 0,
        branch: item.branch || 'General',
        type: item.type || collegeType || 'College'
      })) || [];
      
      return {
        label: d.round,
        data: transformedData,
        roundKey: `${d.round}-${year}` // Stable identifier
      };
    });
  }, [sortedRanks, collegeType, year]);

  // Prepare tabs array without content to avoid component recreation
  const tabLabels = useMemo(() => {
    return tabsData.map(tabData => ({
      label: tabData.label,
      content: (
        <CollegeLadder
          key={tabData.roundKey}
          data={tabData.data}
          onCollegeHover={handleCollegeHover}
          onCollegeClick={handleCollegeClick}
        />
      )
    }));
  }, [tabsData, handleCollegeHover, handleCollegeClick]);

  return (
    <div style={{
      width: "100%",
      maxWidth: "820px",
    }}>
      <div style={{
        zIndex: 20,
        position: "relative",
      }}>
        <SelectMenu options={[
          { value: "2024", label: "2024" },
          { value: "2023", label: "2023" },
          { value: "2022", label: "2022" }
        ]} onChange={handleYearChange} defaultValue={year} />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ zIndex: -1 }}>
          {tabsData.length > 0 ? (
            <Tabs
              setActiveIndex={setTab}
              activeIndex={tab}
              tabs={tabLabels}
            />
          ) : (
            <div style={{
              padding: "20px",
              textAlign: "center",
              color: "#999"
            }}>
              No data available for {year}. Select a different year or submit a new request.
            </div>
          )}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.year === nextProps.year &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.counselling === nextProps.counselling &&
    prevProps.collegeType === nextProps.collegeType &&
    prevProps.mainsCRLRank === nextProps.mainsCRLRank &&
    prevProps.mainsCATRank === nextProps.mainsCATRank &&
    prevProps.advCATRank === nextProps.advCATRank &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
    prevProps.handleCollegeHover === nextProps.handleCollegeHover &&
    prevProps.handleCollegeClick === nextProps.handleCollegeClick
  );
});

export default function Page() {
  const { counselling }: { counselling: string } = useParams();
  const currentCounselling = useMemo(() => 
    counsellings.find(e => e.link === counselling), [counselling]);
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
    "2022": []
  });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string>("2024");
  const [collegeType, setCollegeType] = React.useState<string | null>(null);
  const [typesList, setTypesList] = React.useState<string[]>([]);
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  // Load saved state from localStorage - only run once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

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

    // Set state only if values exist
    if (savedMARank) setMainsCRLRank(savedMARank);
    if (savedMCRank) setMainsCATRank(savedMCRank);
    if (savedACRank) setAdvCATRank(savedACRank);
    if (enabledAdv) setAdvEnabled(enabledAdv === "true");
    if (savedRegion) setRegion(savedRegion);
    if (savedCategory) setCategory(savedCategory === "OBC-NCL" && counselling === "jac" ? "OBC" : savedCategory);
    if (savedSubCategory) setSubCategory(savedSubCategory);
    if (savedGender) setGender(savedGender);
    if (savedSepCategory) setSepCategory(savedSepCategory === "true");
    
    if (savedTypes) {
      const parsedTypes = JSON.parse(savedTypes);
      setTypesList(parsedTypes);
      if (savedType) {
        setActiveIndex(parsedTypes.indexOf(savedType));
      }
    }
    
    if (savedType) {
      setCollegeType(savedType);
    } else if (currentCounselling?.types && currentCounselling.types.length > 0) {
      setCollegeType(currentCounselling.types[0]);
      setTypesList(currentCounselling.types);
      localStorage.setItem(counselling + "_types", JSON.stringify(currentCounselling.types));
      localStorage.setItem(counselling + "_collegeType", currentCounselling.types[0]);
    }

    if (savedSepCategory === "true") {
      const currentCategory = localStorage.getItem(counselling + "_category");
      const currentSubCategory = localStorage.getItem(counselling + "_subCategory");
      if (currentCategory) setCategory(currentCategory === "OBC-NCL" && counselling === "jac" ? "OBC" : currentCategory);
      if (currentSubCategory) setSubCategory(currentSubCategory);
    }

    // Try to load saved results
    try {
      const savedResult = localStorage.getItem(counselling + "_result");
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        setResult(prev => ({
          ...prev,
          ...parsedResult
        }));
      }
    } catch (e) {
      console.error("Error loading saved results:", e);
    }
  }, [counselling, currentCounselling]);

  // Memoized clear results function
  const clearResults = useCallback(() => {
    setResult({
      "2024": [],
      "2023": [],
      "2022": []
    });
    localStorage.removeItem(counselling + "_result");
  }, [counselling]);

  // Memoized input handlers
  const handleMAChange = useCallback((e: any) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setMainsCRLRank(value);
      localStorage.setItem("mains_crl_rank", value);
      setErrors([]);
      setApiError(null);
      clearResults();
    }
  }, [clearResults]);

  const handleMCChange = useCallback((e: any) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setMainsCATRank(value);
      localStorage.setItem("mains_cat_rank", value);
      setErrors([]);
      setApiError(null);
      clearResults();
    }
  }, [clearResults]);

  const handleACChange = useCallback((e: any) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && !value.includes(" ")) {
      setAdvCATRank(value);
      localStorage.setItem("adv_cat_rank", value);
      setErrors([]);
      setApiError(null);
      clearResults();
    }
  }, [clearResults]);

  // Other form handlers - memoized to prevent re-renders
  const handleOnChangeOfRegion = useCallback((value: string) => {
    setRegion(value);
    localStorage.setItem("region", value);
    setErrors([]);
    setApiError(null);
    clearResults();
  }, [clearResults]);

  const handleOnChangeOfCategory = useCallback((value: string) => {
    setCategory(value);
    if (sepCategory) {
      localStorage.setItem(counselling + "_category", value);
    } else {
      localStorage.setItem("category", value);
    }
    setErrors([]);
    setApiError(null);
    clearResults();
  }, [sepCategory, counselling, clearResults]);

  const handleChangeSubCategory = useCallback((value: string) => {
    setSubCategory(value);
    if (sepCategory) {
      localStorage.setItem(counselling + "_subCategory", value);
    } else {
      localStorage.setItem("subCategory", value);
    }
    setErrors([]);
    setApiError(null);
    clearResults();
  }, [sepCategory, counselling, clearResults]);

  const handleGenderChange = useCallback((value: string) => {
    setGender(value);
    localStorage.setItem("gender", value);
    setErrors([]);
    setApiError(null);
    clearResults();
  }, [clearResults]);

  const handleClear = useCallback(() => {
    // Reset all form values
    setResult({
      "2024": [],
      "2023": [],
      "2022": []
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
    setResetKey(prev => prev + 1);
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
  }, [counselling]);

  // Main fetch function using our reusable function - memoized to prevent re-renders
  const handleSubmit = useCallback(async () => {
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
      currentType: collegeType,
      setIsLoading,
      setApiError,
      setResult,
      setErrors
    });
  }, [counselling, mainsCRLRank, mainsCATRank, advCATRank, advEnabled, region, category, subCategory, gender, year, typesList, collegeType]);

  // Function to fetch data for a specific year - memoized to prevent re-renders
  const fetchForYear = useCallback(async (selectedYear: string) => {
    return await fetchPredictorData({
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
      setErrors
    });
  }, [counselling, mainsCRLRank, mainsCATRank, advCATRank, advEnabled, region, category, subCategory, gender, typesList, collegeType]);

  const handleTypeChange = useCallback(async (index: number) => {
    const selectedType = typesList[index];
    if (selectedType === collegeType) return;
    if (selectedType === "IIT" && !advEnabled) {
      setErrors(["Please enable Advanced Category Rank to access IIT data"]);
      return;
    }

    // Clear existing results
    setResult({
      "2024": [],
      "2023": [],
      "2022": []
    });

    // Update state and localStorage
    setCollegeType(selectedType);
    setActiveIndex(index);
    localStorage.setItem(counselling + "_collegeType", selectedType);

    // Fetch data with new type
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
        currentType: selectedType,
        setIsLoading,
        setApiError,
        setResult,
        setErrors
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [typesList, collegeType, advEnabled, counselling, mainsCRLRank, mainsCATRank, advCATRank, region, category, subCategory, gender, year]);

  // Error message display component
  const ErrorMessages = useCallback(() => {
    if (errors.length === 0 && !apiError) return null;

    return (
      <div style={{
        backgroundColor: "#382e2e",
        border: "1px solid #FFCCC7",
        borderRadius: "4px",
        padding: "12px 16px",
        marginTop: "16px",
        width: "100%",
        maxWidth: "820px"
      }}>
        {errors.map((error, index) => (
          <p key={index} style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}>
            • {error}
          </p>
        ))}
        {apiError && (
          <p style={{ color: "#ffd5d9", margin: "4px 0", fontSize: "14px" }}>
            • {apiError}
          </p>
        )}
      </div>
    );
  }, [errors, apiError]);

  // Map for rank inputs - memoized to prevent re-renders
  const rankInputsMap = useMemo(() => ({
    "MA": {
      value: mainsCRLRank,
      onChange: handleMAChange,
      placeholder: "Mains CRL Rank",
    },
    "MC": {
      value: mainsCATRank,
      onChange: handleMCChange,
      placeholder: "Mains Category Rank",
    },
    "AC": {
      value: advCATRank,
      onChange: handleACChange,
      placeholder: "Advanced Category Rank",
    }
  } as const), [mainsCRLRank, mainsCATRank, advCATRank, handleMAChange, handleMCChange, handleACChange]);

  // Handle college hover events from CollegeLadder - memoized to prevent re-renders
  const handleCollegeHover = useCallback((college: any) => {
    if (college) {
      console.log('Hovering over college:', college.name);
    }
  }, []);

  // Handle college click events from CollegeLadder - memoized to prevent re-renders
  const handleCollegeClick = useCallback((college: any) => {
    console.log('Clicked on college:', college.name);
  }, []);

  // Check if we have data to display
  const hasData = useMemo(() => 
    Object.values(result).some(yearData =>
      Array.isArray(yearData) && yearData.length > 0
    ),