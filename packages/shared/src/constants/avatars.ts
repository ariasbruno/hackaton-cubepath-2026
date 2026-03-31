export const AVATAR_IDS = [
  'noto--bear',
  'noto--cat-face',
  'noto--cow-face',
  'noto--dog-face',
  'noto--dragon-face',
  'noto--fox',
  'noto--frog',
  'noto--hamster',
  'noto--koala',
  'noto--lion',
  'noto--monkey-face',
  'noto--moose',
  'noto--mouse-face',
  'noto--panda',
  'noto--pig-face',
  'noto--polar-bear',
  'noto--rabbit-face',
  'noto--tiger-face',
  'noto--wolf',
] as const;

export type AvatarId = typeof AVATAR_IDS[number];
