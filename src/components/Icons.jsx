import React from 'react';

// Correct way to export multiple icons in a single file
export const Spinner = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        {/* Your spinner SVG path here */}
        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
    </svg>
);

export const IconAlert = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
        {/* Your alert icon SVG path here */}
        <path d="M12 2L1 21h22L12 2zm0 3l8.53 15H3.47L12 5zm-1 4v6h2V9h-2zm0 8v2h2v-2h-2z" />
    </svg>
);



export const HeartIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);
// Add other icons as needed
