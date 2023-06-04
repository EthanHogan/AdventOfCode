import {describe, expect, test} from '@jest/globals';
import {parsePacketString} from './part1_solution';

describe('parsePacketString', () => {
  // tests from example data
  let packet: any[]= [1,1,3,1,1]
  test('EXAMPLE: should parse pair 1, left packet', () => {
    expect(parsePacketString(JSON.stringify(packet))).toEqual(packet);
  });
  packet = [1,1,5,1,1];
  test('EXAMPLE: should parse pair 1, right packet', () => {
    expect(parsePacketString(JSON.stringify(packet))).toEqual(packet);
  });
  packet = [[1],[2,3,4]];
  test('EXAMPLE: should parse pair 2, left packet', () => {
    expect(parsePacketString("[[1],[2,3,4]]")).toEqual([[1],[2,3,4]]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 2, right packet', () => {
    expect(parsePacketString("[[1],4]")).toEqual([[1],4]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 3, left packet', () => {
    expect(parsePacketString("[9]")).toEqual([9]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 3, right packet', () => {
    expect(parsePacketString("[[8,7,6]]")).toEqual([[8,7,6]]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 4, left packet', () => {
    expect(parsePacketString("[[4,4],4,4]")).toEqual([[4,4],4,4]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 4, right packet', () => {
    expect(parsePacketString("[[4,4],4,4,4]")).toEqual([[4,4],4,4,4]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 5, left packet', () => {
    expect(parsePacketString("[7,7,7,7]")).toEqual([7,7,7,7]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 5, right packet', () => {
    expect(parsePacketString("[7,7,7]")).toEqual([7,7,7]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 6, left packet', () => {
    expect(parsePacketString("[]")).toEqual([]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 6, right packet', () => {
    expect(parsePacketString("[3]")).toEqual([3]);
  });
  packet = [];
  test('EXAMPLE: should parse pair 7, left packet', () => {
    expect(parsePacketString("[[[]]]")).toEqual([[[]]]);
  });
  test('EXAMPLE: should parse pair 7, right packet', () => {
    expect(parsePacketString("[[]]")).toEqual([[]]);
  });
  test('EXAMPLE: should parse pair 8, left packet', () => {
    expect(parsePacketString("[1,[2,[3,[4,[5,6,7]]]],8,9]")).toEqual([1,[2,[3,[4,[5,6,7]]]],8,9]);
  });
  test('EXAMPLE: should parse pair 8, right packet', () => {
    expect(parsePacketString("[1,[2,[3,[4,[5,6,0]]]],8,9]")).toEqual([1,[2,[3,[4,[5,6,0]]]],8,9]);
  });

  // Made up
  test('should parse packet with multi digit numbers', () => {
    expect(parsePacketString("[1,10,11,2]")).toEqual([1,10,11,2]);
  });

  // tests from sample data
  test('should parse pair 1, left packet', () => {
    expect(parsePacketString("[[[[8,7,8,5,4],6,[4,6]]],[6,[[]]],[]]")).toEqual([[[[8,7,8,5,4],6,[4,6]]],[6,[[]]],[]]);
  });
  test('should parse pair 1, right packet', () => {
    expect(parsePacketString("[[[[8,0,0,7,1],[1],8]]]")).toEqual([[[[8,0,0,7,1],[1],8]]]);
  });
  test('should parse pair 2, left packet', () => {
    expect(parsePacketString("[[[5,8,[4,9,2],7,[8,0]],[9,5,[5,5]],[9,[3,3,8,4,8],[0,6]],5,3],[8,10,[[8,7,6,1,8],5,0,6,[5,1]],[7,[1],6],[6,2,1,[],[1,0,6,5]]],[1,1,[[2]]],[]]")).toEqual([[[5,8,[4,9,2],7,[8,0]],[9,5,[5,5]],[9,[3,3,8,4,8],[0,6]],5,3],[8,10,[[8,7,6,1,8],5,0,6,[5,1]],[7,[1],6],[6,2,1,[],[1,0,6,5]]],[1,1,[[2]]],[]]);
  });
  test('should parse pair 2, right packet', () => {
    expect(parsePacketString("[[10,4,[],7,[[10,1]]],[[4,2]],[[[5],[],[],[]],[4,5,[2,4,9]]],[[8,[],[1,3,9,7]],4,7]]")).toEqual([[10,4,[],7,[[10,1]]],[[4,2]],[[[5],[],[],[]],[4,5,[2,4,9]]],[[8,[],[1,3,9,7]],4,7]]);
  })
  test('should parse pair 3, left packet', () => {
    expect(parsePacketString("[[[],6,[[10,9],8,2],2]]")).toEqual([[[],6,[[10,9],8,2],2]]);
  });
  test('should parse pair 3, right packet', () => {
    expect(parsePacketString("[[[[10,10,8,7],[3,7,7]],8],[[[3,2],[7]],4,[0,[3,2]],[[],[1,0],[0,6,3,7,1],1,[4,9]]],[[],[[]]],[0]]")).toEqual([[[[10,10,8,7],[3,7,7]],8],[[[3,2],[7]],4,[0,[3,2]],[[],[1,0],[0,6,3,7,1],1,[4,9]]],[[],[[]]],[0]]);
  });
  test('should parse pair 4, left packet', () => {
    expect(parsePacketString("[[[3],8,6,[9,8]],[[8],[[6,5,2,9,0],[2,5,2,10]],9,3],[[2,8,6],7,4],[]]")).toEqual([[[3],8,6,[9,8]],[[8],[[6,5,2,9,0],[2,5,2,10]],9,3],[[2,8,6],7,4],[]]);
  });
  test('should parse pair 4, right packet', () => {
    expect(parsePacketString("[[[4,6,6,4],[[3,4,6],[5],[]],5,[[2],[6,0]]],[7,[1,0,4],7,[],9],[0,[5,6,[],[7,1,9],[3]],1],[9,9]]")).toEqual([[[4,6,6,4],[[3,4,6],[5],[]],5,[[2],[6,0]]],[7,[1,0,4],7,[],9],[0,[5,6,[],[7,1,9],[3]],1],[9,9]]);
  });
  test('should parse pair 5, left packet', () => {
    expect(parsePacketString("[[[[],8]],[9,4,8],[[4,9,10,[8,4,8,2,1],[9,1,4,2,6]],[9,[],[2],[0,10]],10,[3,[8,10,1],[1,10,0],[10,6,4]],[[10,5,9],[2,1,10,7,9]]],[7]]")).toEqual([[[[],8]],[9,4,8],[[4,9,10,[8,4,8,2,1],[9,1,4,2,6]],[9,[],[2],[0,10]],10,[3,[8,10,1],[1,10,0],[10,6,4]],[[10,5,9],[2,1,10,7,9]]],[7]]);
  });
  test('should parse pair 5, right packet', () => {
    expect(parsePacketString("[[],[[[7,3,5],[9,6,4,4],[]]]]")).toEqual([[],[[[7,3,5],[9,6,4,4],[]]]]);
  });

  test('should parse pair 10, left packet', () => {
    expect(parsePacketString("[[[[],[3],7,[10,1,8],[5,5,5,5,4]],[8,[9,0,9],8,[7,2],5],4],[[9,[5,4,8],[8,7,8,9],[7],[6,7,4,2,9]],[4],[],[[7,3],0,[4,3,3,0],[4,2,3,0,2],[0,9]]],[7,[[],9]],[[],7,0]]")).toEqual([[[[],[3],7,[10,1,8],[5,5,5,5,4]],[8,[9,0,9],8,[7,2],5],4],[[9,[5,4,8],[8,7,8,9],[7],[6,7,4,2,9]],[4],[],[[7,3],0,[4,3,3,0],[4,2,3,0,2],[0,9]]],[7,[[],9]],[[],7,0]]);
  });

  test('should parse pair 10, right packet', () => {
    expect(parsePacketString("[[10,8,[10],6,10],[4,[6,[9,3,10,10,10],6,3,[6,9,2,3,9]],[1,1,5,8,0],[[9,3]]],[[[7,4,9,7,9],8,[7,9]],5],[5,[9,1,3,[5,0,8],7],4,[[],[],[2,7,8,0,0],[3,3,4,6,9]]],[[]]]")).toEqual([[10,8,[10],6,10],[4,[6,[9,3,10,10,10],6,3,[6,9,2,3,9]],[1,1,5,8,0],[[9,3]]],[[[7,4,9,7,9],8,[7,9]],5],[5,[9,1,3,[5,0,8],7],4,[[],[],[2,7,8,0,0],[3,3,4,6,9]]],[[]]]);
  });

})