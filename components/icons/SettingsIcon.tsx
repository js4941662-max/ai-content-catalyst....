
import React from 'react';

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-1.007 1.11-.994a18.22 18.22 0 013.587.21c.54.06.994.542.994 1.104v.933a18.14 18.14 0 01-1.35 6.088c-.542 1.562-2.14 2.45-3.834 2.155a18.12 18.12 0 01-5.83-2.548c-1.423-.848-2.022-2.58-1.42-4.143a18.06 18.06 0 012.3-5.263v-.933zM13.5 18.006c-.41.341-1.022.341-1.432 0l-.088-.073a18.12 18.12 0 01-4.23-5.068 18.06 18.06 0 012.3-5.263m10.152 5.068a18.06 18.06 0 01-2.3 5.263 18.12 18.12 0 01-4.23 5.068l-.088.073c-.41.341-1.022.341-1.432 0"
    />
  </svg>
);

export default SettingsIcon;
