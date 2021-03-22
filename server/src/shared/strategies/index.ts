import { Strategy } from '@entities/Strategies';
import AvgPriceStrategy from './average-price.strategy';
import BullishFlagDoubleStrategy from './bullish-flag-double.strategy';
import ExampleStrategy from './example.strategy';
import LastDayFallStrategy from './last-day-fall.strategy';

export const strategies: Strategy[] = [
  AvgPriceStrategy,
  BullishFlagDoubleStrategy,
  // ExampleStrategy,
  LastDayFallStrategy,
];
