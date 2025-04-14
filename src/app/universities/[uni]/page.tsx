export default async function Page({
    params,
}: {
    params: Promise<{ uni: string }>
}) {
    const slug = await params;
    return <div>
        <h1 style={{
            color: `white`,
        }}>
            {slug.uni}
        </h1>
    </div>
}