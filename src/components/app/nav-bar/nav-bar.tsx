"use client";
import styles from "./nav-bar.module.css";
import Image from "next/image";
import icon from "@/public/icons/navbar/j2jicon.png";
import discord from "@/public/icons/navbar/discord.svg";
import instagram from "@/public/icons/navbar/instagram.svg";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/config";

import menu from "@/public/icons/navbar/menu.svg";
import cross from "@/public/icons/navbar/cross.svg";

import { usePathname } from "next/navigation";
import { useState } from "react";
export default function NavBar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function checkUrl(url: string): boolean {
    return path.startsWith(url);
  }
  function handleClick() {
    setIsOpen(false);
  }
  return (
    <>
      <div className={styles.navBar}>
        <Link
          href={"/"}
          className={
            path === "/" ? styles.leftBox + " " + styles.active : styles.leftBox
          }
        >
          <Image
            src={icon}
            alt={"JEEPedia Logo"}
            width={40}
            height={40}
            style={{
              borderRadius: "8px",
            }}
          />
        </Link>
        <div className={styles.centerBox}>
          <Link
            className={
              checkUrl("/predictor")
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            href="/predictor"
          >
            Predictor
          </Link>
          <Link
            className={
              checkUrl("/universities")
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            href="/universities"
          >
            Universities
          </Link>
          <Link
            className={
              checkUrl("/compare")
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
            href="/compare"
          >
            Compare
          </Link>
        </div>
        <a
          href={SOCIAL_LINKS.discord}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.rightBox}
        >
          <Image
            style={{
              opacity: 0.7,
            }}
            src={discord}
            alt={"Join JEEPedia Discord Community"}
            width={20}
            height={20}
          />
        </a>
        {/* ✅ Instagram */}
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.rightBox}
        >
          <Image
            style={{ opacity: 0.7 }}
            src={instagram}
            alt={"Follow JEEPedia on Instagram"}
            width={20}
            height={20}
          />
        </a>
        <div
          onClick={() => {
            setIsOpen((v) => !v);
          }}
          className={`${styles.mob} ${styles.rightBox} ${
            isOpen ? styles.menuActive : ""
          }`}
        >
          <Image
            className={styles.menuIcon}
            src={menu}
            alt={"Open Menu"}
            width={18}
            height={18}
          />
          <Image
            className={styles.crossIcon}
            src={cross}
            alt={"Close Menu"}
            width={18}
            height={18}
          />
        </div>
        <div
          className={
            isOpen
              ? `${styles.mobileLinkBox} ${styles.activeMd}`
              : `${styles.mobileLinkBox}`
          }
        >
          <div className={styles.linkList}>
            <Link
              className={
                checkUrl("/predictor")
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
              href="/predictor"
              onClick={handleClick}
            >
              Predictor
            </Link>
            <Link
              className={
                checkUrl("/universities")
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
              href="/universities"
              onClick={handleClick}
            >
              Universities
            </Link>
            <Link
              className={
                checkUrl("/compare")
                  ? `${styles.link} ${styles.active}`
                  : styles.link
              }
              href="/compare"
              onClick={handleClick}
            >
              Compare
            </Link>
          </div>
          <div className={styles.iconRow}>
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.discordIcon}
            >
              <Image
                src={discord}
                alt="Join JEEPedia Discord Community"
                width={20}
                height={20}
              />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramIcon}
            >
              <Image
                src={instagram}
                alt="Follow JEEPedia on Instagram"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </div>
      <div
        onClick={() => setIsOpen((v) => !v)}
        className={
          isOpen ? `${styles.mobileBg} ${styles.open}` : styles.mobileBg
        }
      ></div>
    </>
  );
}
