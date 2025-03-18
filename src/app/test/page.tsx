import Button from "@/components/button/button";
import Image from "next/image";
import img from "@/public/cse2.png"

export default function Test() {
    return <div style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
    }}>
        Test
        <Image src={img} alt={"a"} fill={true} style={{
            position: "absolute",
            objectFit: "cover",
        }} priority={true} quality={100}/>
    </div>
}