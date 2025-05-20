const collegeSequence: {
    [key: string]: (string[] | {
        [key: string]: string[]
    });
} = {
    "jac": ["dtu-delhi", "nsut-delhi-west-campus", "nsut-delhi-east-campus", "nsut-delhi", "igdtuw-delhi", "iiit-delhi",],
    "josaa": {
        "iit": ["iit-bhubaneswar", "iit-bombay", "iit-mandi", "iit-delhi", "iit-indore", "iit-kharagpur", "iit-hyderabad",
            "iit-jodhpur", "iit-kanpur", "iit-madras", "iit-gandhinagar", "iit-patna", "iit-roorkee", "iit-ism-dhanbad",
            "iit-ropar", "iit-bhu-varanasi", "iit-guwahati", "iit-bhilai", "iit-goa", "iit-palakkad", "iit-tirupati",
            "iit-jammu", "iit-dharwad"],
        "nit": [
            "nit-jalandhar", "nit-jaipur", "nit-bhopal", "nit-allahabad", "nit-agartala", "nit-calicut", "nit-delhi",
            "nit-durgapur", "nit-goa", "nit-hamirpur", "nit-surathkal", "nit-meghalaya", "nit-patna", "nit-puducherry",
            "nit-raipur", "nit-sikkim", "nit-arunachal-pradesh", "nit-jamshedpur", "nit-kurukshetra", "nit-mizoram",
            "nit-rourkela", "nit-silchar", "nit-srinagar", "nit-trichy", "nit-uttarakhand", "nit-warangal", "nit-surat",
            "nit-nagpur", "nit-nagaland", "nit-manipur"],
        "iiit": [
            "iiit-guwahati", "iiitm-gwalior", "iiit-kota", "iiit-surat", "iiit-sonepat", "iiit-una", "iiit-sri-city",
            "iiit-vadodara", "iiit-allahabad", "iiitdm-kancheepuram", "iiitdm-jabalpur", "iiit-manipur", "iiit-trichy",
            "iiit-dharwad", "iiitdm-kurnool", "iiit-ranchi", "iiit-nagpur", "iiit-pune", "iiit-kalyani", "iiit-lucknow",
            "iiit-kottayam","iiit-naya-raipur"
        ],
        "gfti": [
            "bit-mesra", "bit-patna", "pec-chandigarh", "iiest-shibpur", "uoh-hyderabad", "tssot-silchar", "spa-bhopal",
            "spa-delhi", "soe-tezpur", "ptu-puducherry", "niftem-thanjavur", "niamt-ranchi", "jnu-delhi", "jkiapt-allahabad",
            "ict-ioc-bhubaneswar", "gkv-haridwar", "iitram-ahmedabad", "gsv-vadodara",
        ]
    }
};


export default function getCollegeType(college: string): string | null {
    for (const type in collegeSequence) {
        if (Array.isArray(collegeSequence[type])) {
            if (collegeSequence[type].includes(college)) {
                return type;
            }
        } else {
            for (const subtype in collegeSequence[type]) {
                if (collegeSequence[type][subtype].includes(college)) {
                    return subtype;
                }
            }
        }
    }
    return null;
}