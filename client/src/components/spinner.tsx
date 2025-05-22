export default function LoadingSpinner({ size = 40, color = '#3b82f6', }: {
    size?: number;
    color?: string;
}) {
    const borderWidth = Math.max(Math.floor(size / 10), 2);

    return (
        <div
            className="rounded-full animate-spin border-solid border-transparent"
            style={{
                width: size,
                height: size,
                borderWidth,
                borderTopColor: color,
                borderRightColor: color,
            }}
        />
    );
};
