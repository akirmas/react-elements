export default {
  luhn: (number) =>
    number > 0
    && [
        ...number.toString().replace(/[^0-9]+/g, '')
    ].reverse()
    .map((digit, i) => digit * (1 + i % 2))
    .map(value => value - (value < 10 ? 0 : 9))
    .reduce((sum, v) => sum + v, 0)
    % 10
    === 0,
  isracardDirect: (number) => 
  [
    ...('0'.repeat(9) + number.toString().replace(/[^0-9]+/g, ''))
    .substr(-9)
  ].map((digit, i) => digit * [-2, -3, -4, -5, 5, 4, 3, 2, 1][i])
  .reduce((sum, v) => sum + v, 0)
  % 11
  === 0,
  required: (value) => value !== ''
}