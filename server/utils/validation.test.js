const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        const nonString = 123;
        expect(isRealString(nonString)).toBe(false);
    });

    it('should reject string with only spaces', () => {
        const spaceString = '    ';
        expect(isRealString(spaceString)).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        const validString = '  Sitvanit';
        expect(isRealString(validString)).toBe(true);
    });
});
