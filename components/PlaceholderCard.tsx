import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface PlaceholderCardProps {
    title: string;
    className?: string;
}

export function PlaceholderCard({ title, className }: PlaceholderCardProps) {
    return (
        <div
            className={cn(
                "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 text-center",
                className
            )}
        >
            <div className="mb-4 h-12 w-12 rounded-full bg-white/5 p-3 backdrop-blur-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-full w-full text-white/20"
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <polyline points="11 3 11 11 14 8 17 11 17 3" />
                </svg>
            </div>
            <h3 className="line-clamp-3 text-lg font-bold uppercase tracking-tight text-white/40">
                {title}
            </h3>
        </div>
    );
}
