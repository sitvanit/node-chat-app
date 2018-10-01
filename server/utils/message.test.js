const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Jen';
        const text = 'Some message';

        const message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, text });
    })
});

describe('generateLocationMessage', () => {
     it('should generate correct location object', () => {
         const from = 'admin';
         const latitude = 123;
         const longitude = 456;
         const url = `https://www.google.com/maps?q=${latitude},${longitude}`;

         const locationMessage = generateLocationMessage(from, latitude, longitude);

         expect(typeof locationMessage.createdAt).toBe('number');
         expect(locationMessage).toMatchObject({ from, url });
     })
});