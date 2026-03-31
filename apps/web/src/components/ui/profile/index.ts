import type { FC } from 'react';
import type { AvatarId } from '@impostor/shared';
import BearAvatar from './noto--bear';
import CatAvatar from './noto--cat-face';
import CowAvatar from './noto--cow-face';
import DogAvatar from './noto--dog-face';
import DragonAvatar from './noto--dragon-face';
import FoxAvatar from './noto--fox';
import FrogAvatar from './noto--frog';
import HamsterAvatar from './noto--hamster';
import KoalaAvatar from './noto--koala';
import LionAvatar from './noto--lion';
import MonkeyAvatar from './noto--monkey-face';
import MooseAvatar from './noto--moose';
import MouseAvatar from './noto--mouse-face';
import PandaAvatar from './noto--panda';
import PigAvatar from './noto--pig-face';
import PolarBearAvatar from './noto--polar-bear';
import RabbitAvatar from './noto--rabbit-face';
import TigerAvatar from './noto--tiger-face';
import WolfAvatar from './noto--wolf';

export const AVATAR_COMPONENTS: Record<AvatarId, FC<{ className?: string }>> = {
  'noto--bear': BearAvatar,
  'noto--cat-face': CatAvatar,
  'noto--cow-face': CowAvatar,
  'noto--dog-face': DogAvatar,
  'noto--dragon-face': DragonAvatar,
  'noto--fox': FoxAvatar,
  'noto--frog': FrogAvatar,
  'noto--hamster': HamsterAvatar,
  'noto--koala': KoalaAvatar,
  'noto--lion': LionAvatar,
  'noto--monkey-face': MonkeyAvatar,
  'noto--moose': MooseAvatar,
  'noto--mouse-face': MouseAvatar,
  'noto--panda': PandaAvatar,
  'noto--pig-face': PigAvatar,
  'noto--polar-bear': PolarBearAvatar,
  'noto--rabbit-face': RabbitAvatar,
  'noto--tiger-face': TigerAvatar,
  'noto--wolf': WolfAvatar,
};
