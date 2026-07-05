import { columnsForWidth } from '../src/utils/columns';

describe('columnsForWidth', () => {
  it('never drops below 2 columns on narrow screens', () => {
    expect(columnsForWidth(340)).toBe(2);
    expect(columnsForWidth(430)).toBe(2);
  });

  it('scales up to a maximum of 4 columns', () => {
    expect(columnsForWidth(620)).toBe(3);
    expect(columnsForWidth(900)).toBe(4);
    expect(columnsForWidth(1400)).toBe(4);
  });
});
