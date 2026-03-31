import React from 'react';
import { AVATAR_COMPONENTS } from './profile';

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  borderColor?: string;
  bgColor?: string;
  badge?: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 p-1',
  md: 'w-12 h-12 p-1.5',
  lg: 'w-14 h-14 p-2',
  xl: 'w-20 h-20 p-3',
  '2xl': 'w-32 h-32 p-4',
  full: 'w-full h-full p-0',
};

const borderMap = {
  sm: 'border-2',
  md: 'border-2',
  lg: 'border-2',
  xl: 'border-4',
  '2xl': 'border-4',
  full: 'border-0',
};

export const Avatar: React.FC<AvatarProps> = ({
  avatarId,
  size = 'md',
  borderColor = 'border-ink/5',
  bgColor = '#FFD166',
  badge,
  className = '',
}) => {
  const isHex = bgColor.startsWith('#');
  const AvatarIcon = AVATAR_COMPONENTS[avatarId as keyof typeof AVATAR_COMPONENTS];
  const isFull = size === 'full';

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full ${isFull ? 'w-full h-full' : ''} ${className}`}>
      <div
        className={`${sizeMap[size]} ${isFull ? '' : borderMap[size]} ${borderColor} ${!isHex ? bgColor : ''} rounded-full flex items-center justify-center overflow-hidden`}
        style={isHex ? { backgroundColor: bgColor } : {}}
      >
        {AvatarIcon ? (
          <div className={`flex items-center justify-center ${isFull ? 'w-[115%] h-[115%] translate-y-3' : 'w-full h-full'}`}>
            <AvatarIcon className="w-full h-full object-contain" />
          </div>
        ) : (
          <span className="select-none text-[1.25em]">{avatarId}</span>
        )}
      </div>
      {badge && (
        <div className="absolute -top-1 -right-1 z-10">
          {badge}
        </div>
      )}
    </div>
  );
};
