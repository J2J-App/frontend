import styles from "./page.module.css";

export default async function Page({
    params,
}: {
    params: Promise<{ uni: string }>
}) {
    const { uni } = await params;

    const uniSeatMatrixData = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix")

    const categoryFullForm = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix/categorydescription")

    const uniTotalSeats = await fetch("https://integrated-bambi-anmolworks-132395f3.koyeb.app/api/v1/getSeatMatrix/totalseats")

    if (!uniSeatMatrixData.ok) {
        throw new Error("Failed to fetch data");
    }

    if (!categoryFullForm.ok) {
        throw new Error("Failed to fetch data");
    }

    if (!uniTotalSeats.ok) {
        throw new Error("Failed to fetch data");
    }

    const { data:seatData } = await uniSeatMatrixData.json();
    const { data:categoryData } = await categoryFullForm.json();
    const { data:totalSeatsData } = await uniTotalSeats.json();

    const currentUniSeatData = seatData[uni];
    const currentTotalSeatsData = totalSeatsData[uni.toUpperCase()];
    const categoryFullFormData = categoryData.category_descriptions;

    return <div style={{
        margin: "10px 0",
        padding: "0",
        marginTop: "25px",
        marginBottom: "90px"
    }}>
        <div className={styles.headContainer}>
            <div className={styles.content}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>
                        Seat Matrix
                    </h2>
                    {currentUniSeatData === null ? <>null</> : <>
                        {Object.entries(currentUniSeatData).map(([key, value]: [string,any]) => (
                            <div 
                            className={styles.catg} 
                            key={key}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginBottom: 20,
                            }}>
                            <span
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",}}
                                    >
                                <span>
                                    {key}
                                </span>
                                <span>
                                    {currentTotalSeatsData[key]}
                                </span>
                            </span>
                            <div
                                style={{
                                    marginBottom: 8,
                                    padding: "8px 0",
                                }}
                            >
                                <div>
                                    {Object.entries(value).map(([subKey, subValue]: [string,any]) => (
                                        <div 
                                        key={subKey}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: 8,
                                            padding: "8px 0",
                                            borderBottom: "1px solid #000000"
                                        }}
                                        >
                                            <span style={{ fontWeight: 500 }}>
                                                {`${categoryFullFormData[subKey]}`}
                                            </span>
                                            <span>{subValue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                        ))}
                    </> }
                </div>
            </div>
        </div>
    </div>
}