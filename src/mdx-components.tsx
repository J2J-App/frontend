import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import styles from './mdx.module.css';


export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        wrapper: ({ children }) => <div style={{
            maxWidth: "1000px",
            width: "calc(100% - 40px)",
            margin: "140px auto",
        }}>
            {children}
        </div>,

        h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
        h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
        h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,

        p: ({ children }) => <p className={styles.p}>{children}</p>,

        ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,
        ol: ({ children }) => <ol className={styles.ol}>{children}</ol>,
        li: ({ children }) => <li className={styles.li}>{children}</li>,

        a: ({ children, href }) => (
            <a className={styles.a} target="_blank" href={href}>
                {children}
            </a>
        ),

        img: (props: ImageProps) => (
            <Image
                className={styles.img}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
                {...(props as ImageProps)}
            />
        ),

        pre: ({ children }) => <pre className={styles.pre}>{children}</pre>,
        code: ({ children }) => <code className={styles.code}>{children}</code>,
        blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
        hr: () => <hr className={styles.hr} />,
        toc: ({ children }) => <div className={styles.toc}>{children}</div>,

        ...components,
    }
}
