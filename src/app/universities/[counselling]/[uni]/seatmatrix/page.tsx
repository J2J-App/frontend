import { API_URL } from "@/config";
import styles from "./page.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ uni: string; counselling: string }>;
}) {
  const { uni, counselling } = await params;

  // console.log(counselling);
  if (counselling == "jac") {
    const jacMap: {
      [key: string]: string;
    } = {
      "nsut-delhi-west-campus": "nsutw",
      "nsut-delhi-east-campus": "nsute",
      "nsut-delhi": "nsut",
      "dtu-delhi": "dtu",
      "igdtuw-delhi": "igdtuw",
      "iiit-delhi": "iiitd",
    };
    const uniSeatMatrixData = await fetch(`${API_URL}/v1/getSeatMatrix`);

    const categoryFullForm = await fetch(
      `${API_URL}/v1/getSeatMatrix/categorydescription`
    );

    const uniTotalSeats = await fetch(`${API_URL}/v1/getSeatMatrix/totalseats`);

    if (!uniSeatMatrixData.ok) {
      throw new Error("Failed to fetch data");
    }

    if (!categoryFullForm.ok) {
      throw new Error("Failed to fetch data");
    }

    if (!uniTotalSeats.ok) {
      throw new Error("Failed to fetch data");
    }

    const { data: seatData } = await uniSeatMatrixData.json();
    const { data: categoryData } = await categoryFullForm.json();
    const { data: totalSeatsData } = await uniTotalSeats.json();

    const currentUniSeatData = seatData[jacMap[uni]];
    const currentTotalSeatsData = totalSeatsData[jacMap[uni].toUpperCase()];
    const categoryFullFormData = categoryData.category_descriptions;
    // console.log(currentUniSeatData,currentTotalSeatsData,categoryFullFormData)
    return (
      <div
        style={{
          margin: "10px 0",
          padding: "0",
          marginTop: "25px",
          marginBottom: "90px",
        }}
      >
        <div className={styles.headContainer}>
          <div className={styles.content}>
            <div className={styles.contentContainer}>
              <h2 className={styles.h2}>Seat Matrix</h2>
              {currentUniSeatData === null ? (
                <>null</>
              ) : (
                <>
                  {Object.entries(currentUniSeatData).map(
                    ([key, value]: [string, any]) => (
                      <div
                        className={styles.catg}
                        key={key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          marginBottom: 20,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{key}</span>
                          <span>{currentTotalSeatsData[key]}</span>
                        </span>
                        <div
                          style={{
                            marginBottom: 8,
                            padding: "8px 0",
                          }}
                        >
                          <div>
                            {Object.entries(value).map(
                              ([subKey, subValue]: [string, any]) => (
                                <div
                                  key={subKey}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                    padding: "8px 0",
                                    borderBottom: "1px solid #000000",
                                  }}
                                >
                                  <span style={{ fontWeight: 500 }}>
                                    {`${categoryFullFormData[subKey]}`}
                                  </span>
                                  <span>{subValue}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const uniSeatMatrixData = await fetch(`${API_URL}/v2/about/seat-matrix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        college: uni,
      }),
    });
    if (!uniSeatMatrixData.ok) {
      throw new Error("Failed to fetch data");
    }
    const { data: seatData } = await uniSeatMatrixData.json();
    function SeatMatrixData({
      department,
      seats,
      change,
      changeDirection,
      quota,
    }: {
      department: string;
      seats: number;
      change: number;
      changeDirection: string;
      quota: string;
    }) {
      return (
        <div className={styles.seatContainer}>
          <p className={styles.dep}>{department}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              padding: "10px",
            }}
          >
            <div className={styles.param}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Seats
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {seats}
                {change !== 0 && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          changeDirection === "increase"
                            ? "rgba(145,255,145,0.18)"
                            : "rgba(255,147,147,0.24)",
                        padding: "1px 7px",
                        borderRadius: "5px",
                      }}
                    >
                      {changeDirection === "increase" ? "+" : "-"} {change}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.param}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Quota
              </p>
              {quota == "" ? "AI" : quota}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          margin: "10px 0",
          padding: "0",
          marginTop: "25px",
          marginBottom: "90px",
        }}
      >
        <div className={styles.headContainer}>
          <div className={styles.content}>
            <div className={styles.contentContainer}>
              <h2 className={styles.h2}>Seat Matrix</h2>
              <div
                className={counselling == "jac" ? "" : styles.grid}
                style={{
                  display: "grid",
                  maxWidth: "800px",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                }}
              >
                {seatData.map((e: any, i: number) => (
                  <SeatMatrixData
                    key={i}
                    change={Number(e.change_from_last_year) || 0}
                    changeDirection={e.change_direction || ""}
                    department={e.department || ""}
                    seats={Number(e.no_of_seats)}
                    quota={e.state_quota ? e.state_quota : ""}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
