"use client";
import React, { useEffect, useState } from "react";
import styles from "./scroll-button.module.css";
import { MdKeyboardArrowUp } from "react-icons/md";

export default function ScrollButton() {
  //state to control the visibilty
  const [isVisible, setVisible] = useState(false);
  const handleVisiblity = () => {
    //document.documentElement is a fallback for pages where window is not scrollable
    const scrollTop = document.documentElement.scrollTop || window.scrollY;

    setVisible(scrollTop > 300);
  };
  const scrollToTop = () => {
    //scroll both window and body, html as a fallback for page support
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // Add scroll listener on mount and remove on unmount
  useEffect(() => {
    const element = window || document.documentElement;
    element.addEventListener("scroll", handleVisiblity);
    return () => element.removeEventListener("scroll", handleVisiblity);
  }, []);

  return (
    <button
      className={`${styles.scrollBtn} ${isVisible ? styles.show : ""}`}
      onClick={scrollToTop}
    >
      {/* Arrow button */}
      <MdKeyboardArrowUp size={32} /> 
    </button>
  );
}


