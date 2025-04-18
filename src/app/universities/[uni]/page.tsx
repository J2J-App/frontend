import styles from "./page.module.css";

export default async function Page({
    params,
}: {
    params: Promise<{ uni: string }>
}) {
    const { uni } = await params;

    //fetch uni data
    const uniDataRes = await fetch("https://api.anmolcreates.tech/api/v1/getCollegeData")

    if (!uniDataRes.ok) {
        throw new Error("Failed to fetch data");
    }

    const { data } = await uniDataRes.json();
    console.log(data)
    const currentUniData = data[uni];

    const formatLabel = (key: string): string => {
        let label = key.replace(/_/g, ' ');

        if (label.includes('seater')) {
            const seatCount = label.charAt(0);
            if (label.includes('ac')) {
                return `${seatCount} Seater (${label.includes('non') ? 'Non-AC' : 'AC'})`;
            }
            return `${seatCount} Seater`;
        }
        return label.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return <div className={styles.headContainer}>
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Mode of Admission
                    </h2>
                    <p>
                        {currentUniData.mode_of_admission}
                    </p>
                </div>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Eligibility Criteria
                    </h2>
                    <div className={styles.grid}>
                        <div className={styles.catg}>
                            <span>
                                General
                            </span>
                            <p>
                                {currentUniData.eligibility.general}
                            </p>
                        </div>
                        {uni !== "iiitd" ? <div className={styles.catg}>
                            <span>
                                SC/ST/PWD
                            </span>
                            <p>
                                {currentUniData.eligibility.sc_st_pwd}
                            </p>
                        </div> : <div className={styles.catg}>
                            <span>
                                SC/ST
                            </span>
                            <p>
                                {currentUniData.eligibility.sc_st}
                            </p>
                        </div>}
                        <div className={styles.catg}>
                            <span>
                                OBC NCL
                            </span>
                            <p>
                                {currentUniData.eligibility.obc_ncl}
                            </p>
                        </div>
                        {uni !== "iiitd" ? <div className={styles.catg}>
                            <span>
                                Defence
                            </span>
                            <p>
                                {currentUniData.eligibility.defence}
                            </p>
                        </div> : <div className={styles.catg}>
                            <span>
                                Defence/PWD
                            </span>
                            <p>
                                {currentUniData.eligibility.defence_pwd}
                            </p>
                        </div>}
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Fee Structure
                    </h2>
                    <div style={{
                        marginBottom: "12px",
                    }} className={styles.catg}>
                            <span>
                                Fees (Per Year)
                            </span>
                            <div>
                            {currentUniData.fees["B.Tech"] === null ? <>null</> : <>
                                {Object.entries(currentUniData.fees["B.Tech"]).filter(([k,v]: [string, any]) => {
                                    return !k.startsWith("Additional Fees")
                                }).map(([key, value]: [string,any]) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                            padding: "8px 0",
                                            borderBottom: "1px solid #000000"
                                        }}
                                    >
                                        <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                                        <span>₹{value.toLocaleString()}</span>
                                    </div>
                                ))}
                                {Object.entries(currentUniData.fees["B.Tech"]).filter(([k,v]: [string, any]) => {
                                    return k.startsWith("Additional Fees")
                                }).map(([key, value]: [string,any]) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexDirection: "column",
                                            padding: "8px 0",
                                        }}
                                    >
                                        <span style={{ fontWeight: 900, marginBottom: "10px" }}>{formatLabel(key)}</span>
                                        <span>{Object.entries(value).map(([key, value]: [string,any]) => (
                                            <div
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginBottom: 8,
                                                    padding: "8px 0",
                                                    borderBottom: "1px solid #000000"
                                                }}
                                            >
                                                <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                                                <span>₹{value.toLocaleString()}</span>
                                            </div>
                                        ))}</span>
                                    </div>
                                ))}
                            </> }
                        </div>
                    </div>
                    <div className={styles.catg}>
                        <span>
                            Hostel Fees (Per Semester)
                        </span>
                        <div>
                            {currentUniData.hostel_fees === null ? "No Hostel Available" : typeof currentUniData.hostel_fees === "number" ? currentUniData.hostel_fees + " INR" : <>
                                {Object.entries(currentUniData.hostel_fees).map(([key, value]: [string,any]) => (
                                    <div
                                        key={key}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                            padding: "8px 0",
                                            borderBottom: "1px solid #000000"
                                        }}
                                    >
                                        <span style={{ fontWeight: 500 }}>{key}</span>
                                        <span>₹{value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
}