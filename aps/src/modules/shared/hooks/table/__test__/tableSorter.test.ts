import { sorter } from '../table.sorter';

test('table sorter - should return a number if given numbers as parameters', () => {
  const result = sorter(5, 3);
  expect(result).not.toBeNaN();
});

test('table sorter - should return 1 or -1 if given strings as parameters', () => {
  const result = sorter('b', 'a');
  expect(result).toEqual(1);

  const result1 = sorter('a', 'b');
  expect(result1).toEqual(-1);
});
