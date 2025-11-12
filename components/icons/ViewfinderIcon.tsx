import React from 'react';

const ViewfinderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 5H8a3 3 0 00-3 3v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h2a3 3 0 013 3v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19H8a3 3 0 01-3-3v-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 19h2a3 3 0 003-3v-2" />
  </svg>
);

export default ViewfinderIcon;
