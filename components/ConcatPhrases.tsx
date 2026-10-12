export default function ConcatPhrases({ phrases }: { phrases: React.ReactNode[] }) {
    const comma = "\uff0c";
    const period = "\u3002";
    return (
        <>
            {phrases.map((phrase, index) => (
                <span key={index}>
                    {phrase}
                    {index < phrases.length - 1 ? comma : period}
                </span>
            ))}
        </>
    )
}
