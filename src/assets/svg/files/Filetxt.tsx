// const FileTxt = ({
//     height = 100,
//     width = 100,
// }: {
//     height?: number
//     width?: number
// }) => {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 287.82 384"
//             width={width}
//             height={height}
//         >
//             {/* Background */}
//             <path
//                 fill="#4CAF50" // Green color for TXT files
//                 d="M648.34 792.45h192s50.07.1 49-59.26 0-210.58 0-210.58H781l-1-114.16H648.34s-45.93 1.52-46.51 53 0 284.71 0 284.71 4.17 44.97 46.51 46.29z"
//                 transform="translate(-601.57 -408.45)"
//             ></path>
//             {/* Folded Corner */}
//             <path
//                 fill="#81C784" // Lighter green for the folded corner
//                 d="M178.39 0L287.82 114.16 179.42 114.16 178.39 0z"
//             ></path>
//             {/* Text Content */}
//             <path
//                 fill="#fff" // White color for the text
//                 d="M663.58 618.5h13.85V692h-13.85zm6.32 31.64h23.5a8.3 8.3 0 004.37-1.14 7.79 7.79 0 003-3.21 10.23 10.23 0 001.06-4.75 10.79 10.79 0 00-1-4.83 7.66 7.66 0 00-2.93-3.23 8.44 8.44 0 00-4.43-1.14H669.9V618.5h23.15a25.26 25.26 0 0112.11 2.8 20 20 0 018.11 7.91 25.68 25.68 0 010 23.63 19.9 19.9 0 01-8.11 7.87 25.49 25.49 0 01-12.11 2.78H669.9zM727 618.5h13.85V692H727zm6.32 31.64h23.5a8.3 8.3 0 004.37-1.14 7.79 7.79 0 003-3.21 10.23 10.23 0 001.06-4.75 10.79 10.79 0 00-1-4.83 7.66 7.66 0 00-2.93-3.23 8.44 8.44 0 00-4.43-1.14h-23.5V618.5h23.15a25.26 25.26 0 0112.11 2.8 20 20 0 018.11 7.91 25.68 25.68 0 010 23.63 19.9 19.9 0 01-8.11 7.87 25.49 25.49 0 01-12.11 2.78h-23.2zM787.42 618.5h53.89v13.34h-53.89zm20 6h13.85V692h-13.83z"
//                 transform="translate(-601.57 -408.45)"
//             ></path>
//         </svg>
//     )
// }

// export default FileTxt
const FileTxt = ({
    height = 100,
    width = 100,
}: {
    height?: number;
    width?: number;
}) => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={width}
        height={height}
    >
        {/* Notepad Background */}
        <rect
            x="8"
            y="8"
            width="48"
            height="48"
            rx="4"
            ry="4"
            fill="#FFFFFF" // White background
            stroke="skyBlue" // Green border
            strokeWidth="2"
        />
        {/* Spiral Binding */}
        <path
            fill="none"
            stroke="skyBlue" // Green color for the spiral binding
            strokeWidth="2"
            strokeLinecap="round"
            d="M12,12v40M14,12v40M16,12v40M18,12v40M20,12v40"
        />
        {/* Text Lines */}
        <rect x="24" y="20" width="24" height="2" fill="black" /> {/* Line 1 */}
        <rect x="24" y="26" width="24" height="2" fill="black" /> {/* Line 2 */}
        <rect x="24" y="32" width="24" height="2" fill="black" /> {/* Line 3 */}
        <rect x="24" y="38" width="24" height="2" fill="black" /> {/* Line 4 */}
        <rect x="24" y="44" width="24" height="2" fill="black" /> {/* Line 5 */}
    </svg>
);
};

export default FileTxt;