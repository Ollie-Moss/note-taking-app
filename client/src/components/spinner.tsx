// Loading spinner 
// Custom size and colour can be provided
export default function LoadingSpinner({ size = 40, color = '#D3D3D3', }: {
    size?: number;
    color?: string;
}) {
    // Calculate border width relative to size (minimum of 2px)
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
