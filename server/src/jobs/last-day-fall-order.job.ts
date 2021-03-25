import { Simulator } from '@shared/Simulator';

const logPrefix = 'JOB LastDayFallOrder: ';
export const LastDayFallOrderJob = async () => {
  console.log(logPrefix + 'LAUNCH');
  const simulator = new Simulator();

  const simulation = await simulator.simulateStrategy$('last-day-fall', {
    symbol: 'ETHUSDT',
  });

  if (
    simulation &&
    simulation.analysis.profitPct > 10 &&
    simulation.opportunities.buy
  ) {
    // TODO: place order
    console.log(logPrefix + 'placing order');
  }

  console.log(logPrefix + 'FINISHED');

  return;
};
