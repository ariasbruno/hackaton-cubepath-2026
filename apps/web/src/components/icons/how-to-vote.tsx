import type { FC, SVGProps } from 'react';

const HowToVoteIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
    <path fill="currentColor" d="M18 13h-6.17l2-2H18v2zm-2 4h-4.17l2-2H16v2zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-3-6h2v2H9v-2zm0-4h2v2H9v-2zm0-4h2v2H9V6z"/>
  </svg>
);

export default HowToVoteIcon;
