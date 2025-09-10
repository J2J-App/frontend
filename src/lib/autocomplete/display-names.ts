/**
 * University display name mappings
 * Extracted from the existing getDisplayName function for reusability
 */

export const UNIVERSITY_DISPLAY_NAMES: { [key: string]: string } = {
  // NIT colleges
  "nit-jalandhar": "NIT Jalandhar",
  "nit-jaipur": "MNIT Jaipur",
  "nit-bhopal": "MANIT Bhopal",
  "nit-allahabad": "MNNIT Allahabad",
  "nit-agartala": "NIT Agartala",
  "nit-calicut": "NIT Calicut",
  "nit-delhi": "NIT Delhi",
  "nit-durgapur": "NIT Durgapur",
  "nit-goa": "NIT Goa",
  "nit-hamirpur": "NIT Hamirpur",
  "nit-surathkal": "NIT Surathkal",
  "nit-meghalaya": "NIT Meghalaya",
  "nit-patna": "NIT Patna",
  "nit-puducherry": "NIT Puducherry",
  "nit-raipur": "NIT Raipur",
  "nit-sikkim": "NIT Sikkim",
  "nit-arunachal-pradesh": "NIT Arunachal Pradesh",
  "nit-jamshedpur": "NIT Jamshedpur",
  "nit-kurukshetra": "NIT Kurukshetra",
  "nit-mizoram": "NIT Mizoram",
  "nit-rourkela": "NIT Rourkela",
  "nit-silchar": "NIT Silchar",
  "nit-srinagar": "NIT Srinagar",
  "nit-trichy": "NIT Trichy",
  "nit-uttarakhand": "NIT Uttarakhand",
  "nit-warangal": "NIT Warangal",
  "nit-surat": "SVNIT Surat",
  "nit-nagpur": "VNIT Nagpur",
  "nit-nagaland": "NIT Nagaland",
  "nit-manipur": "NIT Manipur",

  // IIT colleges
  "iit-bhubaneswar": "IIT Bhubaneswar",
  "iit-bombay": "IIT Bombay",
  "iit-mandi": "IIT Mandi",
  "iit-delhi": "IIT Delhi",
  "iit-indore": "IIT Indore",
  "iit-kharagpur": "IIT Kharagpur",
  "iit-hyderabad": "IIT Hyderabad",
  "iit-jodhpur": "IIT Jodhpur",
  "iit-kanpur": "IIT Kanpur",
  "iit-madras": "IIT Madras",
  "iit-gandhinagar": "IIT Gandhinagar",
  "iit-patna": "IIT Patna",
  "iit-roorkee": "IIT Roorkee",
  "iit-ism-dhanbad": "IIT (ISM) Dhanbad",
  "iit-ropar": "IIT Ropar",
  "iit-bhu-varanasi": "IIT BHU Varanasi",
  "iit-guwahati": "IIT Guwahati",
  "iit-bhilai": "IIT Bhilai",
  "iit-goa": "IIT Goa",
  "iit-palakkad": "IIT Palakkad",
  "iit-tirupati": "IIT Tirupati",
  "iit-jammu": "IIT Jammu",
  "iit-dharwad": "IIT Dharwad",

  // IIIT colleges
  "iiit-guwahati": "IIIT Guwahati",
  "iiitm-gwalior": "IIITM Gwalior",
  "iiit-kota": "IIIT Kota",
  "iiit-surat": "IIIT Surat",
  "iiit-sonepat": "IIIT Sonepat",
  "iiit-una": "IIIT Una",
  "iiit-sri-city": "IIIT Sri City",
  "iiit-vadodara": "IIIT Vadodara",
  "iiit-allahabad": "IIIT Allahabad",
  "iiitdm-kancheepuram": "IIITDM Kancheepuram",
  "iiitdm-jabalpur": "IIITDM Jabalpur",
  "iiit-manipur": "IIIT Manipur",
  "iiit-trichy": "IIIT Trichy",
  "iiit-dharwad": "IIIT Dharwad",
  "iiitdm-kurnool": "IIITDM Kurnool",
  "iiit-ranchi": "IIIT Ranchi",
  "iiit-nagpur": "IIIT Nagpur",
  "iiit-pune": "IIIT Pune",
  "iiit-kalyani": "IIIT Kalyani",
  "iiit-lucknow": "IIIT Lucknow",
  "iiit-kottayam": "IIIT Kottayam",
  "iiit-naya-raipur": "IIIT Naya Raipur",

  // GFTI colleges
  "bit-mesra": "BIT Mesra",
  "bit-patna": "BIT Patna",
  "pec-chandigarh": "PEC Chandigarh",
  "iiest-shibpur": "IIEST Shibpur",
  "uoh-hyderabad": "University of Hyderabad",
  "tssot-silchar": "TSSOT Silchar",
  "spa-bhopal": "SPA Bhopal",
  "spa-delhi": "SPA Delhi",
  "soe-tezpur": "SoE Tezpur University",
  "ptu-puducherry": "PTU Puducherry",
  "niftem-thanjavur": "NIFTEM Thanjavur",
  "niamt-ranchi": "NIAMT Ranchi",
  "jnu-delhi": "JNU Delhi",
  "jkiapt-allahabad": "JKIAPT Allahabad",
  "ict-ioc-bhubaneswar": "ICT-IOC Bhubaneswar",
  "gkv-haridwar": "GKV Haridwar",
  "iitram-ahmedabad": "IITRAM Ahmedabad",
  "gsv-vadodara": "GSV Vadodara",

  // JAC colleges
  "dtu-delhi": "DTU Delhi",
  "nsut-delhi-west-campus": "NSUT Delhi (West Campus)",
  "nsut-delhi-east-campus": "NSUT Delhi (East Campus)",
  "nsut-delhi": "NSUT Delhi",
  "igdtuw-delhi": "IGDTUW Delhi",
  "iiit-delhi": "IIIT Delhi"
};

/**
 * Get display name for a university slug
 * Falls back to formatted slug if no mapping exists
 */
export function getDisplayName(slug: string): string {
  return UNIVERSITY_DISPLAY_NAMES[slug] || slug.replace(/-/g, " ").toUpperCase();
}