"use client"

export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    return <div>
        <h1>
            Test div
        </h1>
        {children}
    </div>
}