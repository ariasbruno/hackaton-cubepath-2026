import type { FC, SVGProps } from 'react';

const RemoveIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
    <path fill="currentColor" d="M18 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h12q.425 0 .713.288T19 12t-.288.713T18 13z"></path>
  </svg>
);

export default RemoveIcon;
