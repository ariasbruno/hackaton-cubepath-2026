import type { FC, SVGProps } from 'react';

const ChatBubbleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
    <path fill="currentColor" d="m6 18l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18z"></path>
  </svg>
);

export default ChatBubbleIcon;