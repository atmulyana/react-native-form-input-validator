/**
 * https://github.com/atmulyana/react-native-form-input-validator
 *
 * @format
 */
import {str} from '../../lib/helpers';

test('str function', () => {
    expect(
        str('Mulai dari ${satu}, ${dua} dan ${tiga} dst.', {
            satu: 'satu',
            dua: 'dua',
            tiga: 'tiga'
        })
    ).toBe('Mulai dari satu, dua dan tiga dst.');
    expect(
        str('Mulai dari ${satu}, ${dua} dan ${tiga} dst.', {
            satu: 0,
            dua: 1,
            tiga: 2,
        })
    ).toBe('Mulai dari 0, 1 dan 2 dst.');
    expect(
        str('Mulai dari ${satu}, ${dua} dan ${tiga} dst.', {
            satu: null,
            dua: 1,
            tiga: 2
        })
    ).toBe('Mulai dari , 1 dan 2 dst.');
    expect(
        str('Mulai dari ${satu}, ${dua} dan ${tiga} dst.', {
            satu: 'satu',
            dua: 'dua',
        })
    ).toBe('Mulai dari satu, dua dan  dst.');
});