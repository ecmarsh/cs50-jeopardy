import formatScore from '../lib/formatScore';

describe('formatScore Function', () => {
  it('renders multipliers correctly', () => {
    const round = 2,
      difficulty = 3,
      multiplier = 200;
    expect(formatScore(round * difficulty * multiplier)).toEqual('$1,200');
  });
  it('renders weird numbers correctly', () => {
    const initialScore = 2000,
      wager = 1001;
    expect(formatScore(initialScore - wager)).toEqual('$999');
  });
  it('indicates negative scores', () => {
    const score = -2000;
    expect(formatScore(score)).toEqual('-$2,000');
  });
  it('works with super large numbers', () => {
    const largeNumber = 1987654321;
    expect(formatScore(largeNumber)).toEqual('$1,987,654,321');
  });
  it('trims leading and trailing zeros', () => {
    const possibleNumberStored = Number(123456.0);
    expect(formatScore(possibleNumberStored)).toEqual('$123,456');
  });
});
