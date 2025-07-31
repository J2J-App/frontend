import styles from "./page.module.css";
import API_URL from "@/config";

export default async function Page({
    params,
}: {
    params: Promise<{ uni: string }>
}) {
    const { uni } = await params;

    const uniDataRes = await fetch(
        `${API_URL}/v2/about`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            college: uni,
        }),
    })

    if (!uniDataRes.ok) {
        throw new Error("Failed to fetch data");
    }

    const { data } = await uniDataRes.json();
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

return (
  <div className={styles.headContainer}>
    <div className={styles.content}>
      <div className={styles.contentContainer}>
        <h2 className={styles.h2}>Mode of Admission</h2>
        <p>{currentUniData.mode_of_admission.mode_of_admission}</p>
      </div>

      {currentUniData?.eligibility && (
  <div className={styles.contentContainer}>
    <h2 className={styles.h2}>Eligibility Criteria</h2>
    <div className={styles.grid}>
      {currentUniData.eligibility.general && (
        <div className={styles.catg}>
          <span>General</span>
          <p>{currentUniData.eligibility.general}</p>
        </div>
      )}

      {currentUniData.eligibility.obc_general_obc_ncl && (
        <div className={styles.catg}>
          <span>General/OBC NCL/OBC</span>
          <p>{currentUniData.eligibility.obc_ncl}</p>
        </div>
      )}

      {uni !== "iiitd" ? (
        currentUniData.eligibility.sc_st_pwd && (
          <div className={styles.catg}>
            <span>SC/ST/PWD</span>
            <p>{currentUniData.eligibility.sc_st_pwd}</p>
          </div>
        )
      ) : (
        currentUniData.eligibility.sc_st && (
          <div className={styles.catg}>
            <span>SC/ST</span>
            <p>{currentUniData.eligibility.sc_st}</p>
          </div>
        )
      )}

      {currentUniData.eligibility.obc_ncl && (
        <div className={styles.catg}>
          <span>OBC NCL</span>
          <p>{currentUniData.eligibility.obc_ncl}</p>
        </div>
      )}

      {uni !== "iiitd" ? (
        currentUniData.eligibility.defence && (
          <div className={styles.catg}>
            <span>Defence</span>
            <p>{currentUniData.eligibility.defence}</p>
          </div>
        )
      ) : (
        currentUniData.eligibility.defence_pwd && (
          <div className={styles.catg}>
            <span>Defence/PWD</span>
            <p>{currentUniData.eligibility.defence_pwd}</p>
          </div>
        )
      )}
    </div>
  </div>
)}


      {/* <div className={styles.contentContainer}>
        <h2 className={styles.h2}>Fee Structure</h2>
        <div style={{ marginBottom: "12px" }} className={styles.catg}>
          <span>Fees</span>
          <div>
            {currentUniData.fee_structure["institute_fee"] ? (
              Object.entries(currentUniData.fee_structure["institute_fee"]).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #000000",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                  <span>
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </span>
                </div>
              ))
            ) : (
              Object.entries(currentUniData.fee_structure).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #000000",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                  <span>
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      
      {currentUniData.fee_structure["hostel_fee"] ? (
          <div style={{ marginBottom: "12px" }} className={styles.catg}>
            <span>Hostel Fees</span>
            <div>
              {Object.entries(currentUniData.fee_structure["hostel_fee"]).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid #000000",
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{formatLabel(key)}</span>
                  <span>
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
      ) : null}
    </div> */}
    </div>
  </div>
);
}