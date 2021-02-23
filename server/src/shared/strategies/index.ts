import { Strategy } from '@entities/Strategies';
import { AvgPriceStrategy } from './average-price.strategy';
import { MomentumDayStrategy } from './momentum-day.strategy';

export const strategies: Strategy[] = [AvgPriceStrategy, MomentumDayStrategy];
