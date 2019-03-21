export default {
    luhn: (number) => [
        ...number.toString().replace(/[^0-9]+/g, '')
    ]
        .reverse()
        .map((digit, i) => digit * (1 + i % 2))
        .map(value => value - (value < 10 ? 0 : 9))
        .reduce((sum, v) => sum + v, 0)
        % 10
        === 0
}