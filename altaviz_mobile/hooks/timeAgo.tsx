

export function timeAgo(timestamp:string) {
    const now:any = new Date();
    const past:any = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "min", seconds: 60 },
        { label: "sec", seconds: 1 }
    ];

    for (const { label, seconds } of intervals) {
        const value = Math.floor(diffInSeconds / seconds);
        if (value >= 1) {
            if (label === "day" && value >= 7) {
                // If more than a week, return the date
                return past.toLocaleDateString("en-GB").replace(/\//g, "."); // Format: DD.MM.YYYY
            } else if (label === "day") {
                // If within a week, return "on Monday", etc.
                // return `on ${past.toLocaleDateString("en-US", { weekday: "long" })}`;
				return `on ${past.toLocaleDateString("en-US", { weekday: "long" })} at ${past.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}`;
            }
            if (value === 1) {
                return label === "hour" ? `an ${label} ago` : `a ${label} ago`;
            }
            return `${value} ${label}s ago`;
        }
    }

    return "just now"; // If it's less than a second difference
}