import jac from "@/public/icons/counsellings/jac.jpg";
import josaa from "@/public/icons/counsellings/josaa.png";

export const counsellings: {
    name: string;
    icon: any;
    link: string;
    description: string;
    ranks: string[];
    categories: {
        value: string;
        label: string;
    }[];
    subCategories: {
        value: string;
        label: string;
    }[];
    regions: {
        value: string;
        label: string;
    }[];
    types: string[] | null;
}[] = [{
    "name": "JAC",
    "icon": jac,
    "link": "jac",
    "description": "Joint Admission Counselling",
    "ranks": ["MA"],
    "categories": [
        {value: "GEN", label: "General"},
        {value: "OBC", label: "OBC"},
        {value: "SC", label: "SC"},
        {value: "ST", label: "ST"},
        {value: "EWS", label: "EWS"},
    ],
    "subCategories": [
        {value: "NONE", label: "None"},
        {value: "PWD", label: "PWD"},
        {value: "GC", label: "Girl Candidate"},
        {value: "SNG", label: "Single Girl Child"},
        {value: "Defence", label: "Defence"}
    ],
    "regions": [
        {value: "dl", label: "Delhi"},
        {value: "ox", label: "Outside Delhi"},
    ],
    "types": null
}, {
    "name": "JoSAA",
    "icon": josaa,
    "link": "josaa",
    "description": "Joint Seat Allocation Authority",
    "ranks": ["MC", "AC"],
    "categories": [
        {value: "GEN", label: "General"},
        {value: "OBC", label: "OBC"},
        {value: "OBC-NCL", label: "OBC-NCL"},
        {value: "SC", label: "SC"},
        {value: "ST", label: "ST"},
        {value: "EWS", label: "EWS"},
    ],
    "subCategories": [
        {value: "NONE", label: "None"},
        {value: "PWD", label: "PWD"}
    ],
    "regions": [
        { "value": "tr", "label": "Tripura" },
        { "value": "ar", "label": "Arunachal Pradesh" },
        { "value": "mp", "label": "Madhya Pradesh" },
        { "value": "kl", "label": "Kerala" },
        { "value": "dl", "label": "Delhi" },
        { "value": "wb", "label": "West Bengal" },
        { "value": "ga", "label": "Goa" },
        { "value": "hp", "label": "Himachal Pradesh" },
        { "value": "pb", "label": "Punjab" },
        { "value": "rj", "label": "Rajasthan" },
        { "value": "jh", "label": "Jharkhand" },
        { "value": "hr", "label": "Haryana" },
        { "value": "mn", "label": "Manipur" },
        { "value": "ml", "label": "Meghalaya" },
        { "value": "mz", "label": "Mizoram" },
        { "value": "nl", "label": "Nagaland" },
        { "value": "br", "label": "Bihar" },
        { "value": "py", "label": "Puducherry" },
        { "value": "cg", "label": "Chhattisgarh" },
        { "value": "od", "label": "Odisha" },
        { "value": "sk", "label": "Sikkim" },
        { "value": "as", "label": "Assam" },
        { "value": "jk", "label": "Jammu And Kashmir" },
        { "value": "gj", "label": "Gujarat" },
        { "value": "ka", "label": "Karnataka" },
        { "value": "tn", "label": "Tamil Nadu" },
        { "value": "uk", "label": "Uttarakhand" },
        { "value": "tg", "label": "Telangana" },
        { "value": "up", "label": "Uttar Pradesh" },
        { "value": "mh", "label": "Maharashtra" },
        { "value": "ap", "label": "Andhra Pradesh" }
    ],
    "types": [
        "NIT","IIIT","GFTI","IIT"
    ]
}]