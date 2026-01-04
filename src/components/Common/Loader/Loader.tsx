
type LoaderProps = {
    light: string;
    dark?: string;
    mainText?: string;
    subText?: string;
    alt?: string;
    decorative?: boolean;    // true → aria-hidden and empty alt
};

import './Loader.css';

export default function Loader({
    light,
    dark,
    mainText = 'Loading...',
    subText = "Bringing the essense of Idukki to life",
    alt = 'icon',
    decorative = false,
}: LoaderProps) {
    const imgProps = decorative ? { alt: '', 'aria-hidden': true } : { alt };
    return (
        <div className="loader-overlay">
            <div>
                {dark && <source media="(prefers-color-scheme: dark)" srcSet={dark} />}
                <img
                    src={light}
                    {...imgProps}
                    className='loader'
                />
                <div>
                    <h2>{mainText}</h2>
                    <p>{subText}</p>
                </div>
            </div>
        </div>
    );
}