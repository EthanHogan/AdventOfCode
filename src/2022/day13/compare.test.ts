import {describe, expect, test} from '@jest/globals';
import {compare} from './part1_solution';

describe('compareTwoPackets', () => {
    test('should be undefined when both are lists of same length and values', () => {
        expect(compare([1], [1])).toBe(undefined);
        expect(compare([1, 2, 3], [1, 2, 3])).toBe(undefined);
      });
    test('should be true when right list is longer, but has same initial values', () => {
        expect(compare([1, 2], [1, 2, 3])).toBe(true);
    });
    test('should be false when right runs out of items first', () => {
        expect(compare([1, 2, 3, 4], [1, 2, 3])).toBe(false);
    });
    test('should be true when first different item is lower for the left than the right', () => {
        expect(compare([1, 2, 3, 4], [1, 2, 4, 5])).toBe(true);
    });
    test('should be false when first different item is higher for the left than the right', () => {
        expect(compare([1, 2, 3, 4], [1, 2, 2, 3])).toBe(false);
    });
    test('should be undefined for nested lists that are the same', () => {
        expect(compare([[1, 2, 3]], [[1, 2 , 3]])).toBe(undefined);
    });
    test('should be undefined for multiple nested lists on both sides that are the same', () => {
        expect(compare([[1, 2, 3], [4], [5, 6]], [[1, 2, 3], [4], [5, 6]])).toBe(undefined);
    });
    test('should be true for multiple nested lists on both sides where the first different int is lower on the left than the right', () => {
        expect(compare([[1, 2, 3], [4], [4, 6]], [[1, 2, 3], [4], [5, 6]])).toBe(true);
    });
    test('should be false for multiple nested lists on both sides where the first different int is higher on the left than the right', () => {
        expect(compare([[1, 2, 3], [4], [6, 6]], [[1, 2, 3], [4], [5, 6]])).toBe(false);
    });
    
    // Pulled directly from example problem
    test('example pair 1 should be true. Left: [1,1,3,1,1] Right: [1,1,5,1,1]', () => {
        expect(compare([1,1,3,1,1], [1,1,5,1,1])).toBe(true);
    });
    test('example pair 1 swapped left and right should be false. Left: [1,1,5,1,1] Right: [1,1,3,1,1]', () => {
        expect(compare([1,1,5,1,1], [1,1,3,1,1])).toBe(false);
    });
    test('example pair 2 should be true. Left: [[1],[2,3,4]] Right: [[1],4]', () => {
        expect(compare([[1],[2,3,4]], [[1],4])).toBe(true);
    });
    test('example pair 2 swapped left and right should be false. Left: [[1],4] Right: [[1],[2,3,4]]', () => {
        expect(compare([[1],4], [[1],[2,3,4]])).toBe(false);
    });
    test('example pair 3 should be false. Left: [9] Right: [[8,7,6]]', () => {
        expect(compare([9], [[8,7,6]])).toBe(false);
    });
    test('example pair 3 swapped left and right should be true. Left: [[8,7,6]] Right: [9]', () => {
        expect(compare([[8,7,6]], [9])).toBe(true);
    });
    test('example pair 4 should be undefined. Left: [[4,4],4,4] Right: [[4,4],4,4]', () => {
        expect(compare([[4,4],4,4], [[4,4],4,4])).toBe(undefined);
    });
    test('example pair 5 should be false. Left: [7,7,7,7] Right: [7,7,7]', () => {
        expect(compare([7,7,7,7], [7,7,7])).toBe(false);
    });
    test('example pair 5 swapped left and right should be true. Left: [7,7,7] Right: [7,7,7,7]', () => {
        expect(compare([7,7,7], [7,7,7,7])).toBe(true);
    });
    test('example pair 6 should be true. Left: []. Right: [3]', () => {
        expect(compare([], [3])).toBe(true);
    });
    test('example pair 6 swapped left and right should be false. Left: [3]. Right: []', () => {
        expect(compare([3], [])).toBe(false);
    });
    test('example pair 7 should be false. Left: [[[]]]. Right: [[]]', () => {
        expect(compare([[[]]], [[]])).toBe(false);
    });
    test('example pair 7 swapped left and right should be true. Left: [[]]. Right: [[[]]]', () => {
        expect(compare([[]], [[[]]])).toBe(true);
    });
    test('example pair 8 should be false. Left: [1,[2,[3,[4,[5,6,7]]]],8,9] Right: [1,[2,[3,[4,[5,6,0]]]],8,9]', () => {
        expect(compare([1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9])).toBe(false);
    });
    test('example pair 8 swapped left and right should be true. Left: [1,[2,[3,[4,[5,6,0]]]],8,9] Right: [1,[2,[3,[4,[5,6,7]]]],8,9]', () => {
        expect(compare([1,[2,[3,[4,[5,6,0]]]],8,9], [1,[2,[3,[4,[5,6,7]]]],8,9])).toBe(true);
    });

    // pulled from sample
    test('sample pair 9 should be true. Left: [[],[],[[2,[2,0,8,6],4,[6,1,7]],7,[[4,7,10,7,8],[3,7,1,4,0]]]] Right: [1,[2,[3,[4,[5,6,7]]]],8,9]', () => {
        expect(compare([[],[],[[2,[2,0,8,6],4,[6,1,7]],7,[[4,7,10,7,8],[3,7,1,4,0]]]], [[[[],6,6,[]]],[[[],[4,7,8,4],10,[8,2,3],10],[[2],[10,0],6,8,[2,5,3,0]],5,[[10,5],[3,4,0],[0],[10,0,2,4],7]]])).toBe(true);
    });
})