
export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    return <div style={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        {children}
    </div>
}