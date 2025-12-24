// src/components/Icon/Icon.tsx
type IconProps = {
    light: string;
    dark?: string;
    alt?: string;
    size?: number;           // pixels
    className?: string;
    decorative?: boolean;    // true → aria-hidden and empty alt
};

export default function Icon({
    light,
    dark,
    alt = 'icon',
    size = 20,
    className,
    decorative = false,
}: IconProps) {
    const imgProps = decorative ? { alt: '', 'aria-hidden': true } : { alt };
    return (
        <picture>
            {dark && <source media="(prefers-color-scheme: dark)" srcSet={dark} />}
            <img
                src={light}
                {...imgProps}
                className={className ?? 'icon'}
                style={{ width: size, height: size }}
            />
        </picture>
    );
}