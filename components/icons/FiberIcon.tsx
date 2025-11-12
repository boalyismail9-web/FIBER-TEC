import React from 'react';

const FiberIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="19.07" y1="4.93" x2="15.54" y2="8.46" />
    <line x1="8.46" y1="15.54" x2="4.93" y2="19.07" />
    <line x1="19.07" y1="19.07" x2="15.54" y2="15.54" />
    <line x1="8.46" y1="8.46" x2="4.93" y2="4.93" />
  </svg>
);

export default FiberIcon;
