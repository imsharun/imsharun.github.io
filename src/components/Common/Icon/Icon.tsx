// src/components/Icon/Icon.tsx
 
type IconProps = {
    light: string;
    dark?: string;
    alt?: string;
    className?: string;
    decorative?: boolean;    // true → aria-hidden and empty alt
};

import "./Icon.css";

export default function Icon({
    light,
    dark,
    alt = 'icon',
    className,
    decorative = false,
}: IconProps) {
    const imgProps = decorative ? { alt: '', 'aria-hidden': true } : { alt };
    return (
        <div className="icon-container">
            {dark && <source media="(prefers-color-scheme: dark)" srcSet={dark} />}
            <img
                src={light}
                {...imgProps}
                className={className ?? 'icon'}
            /></div>
    );
}