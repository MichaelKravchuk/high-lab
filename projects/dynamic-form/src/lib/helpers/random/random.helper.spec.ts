import { RandomHelper } from './random.helper';

describe('RandomHelper', () => {

  /* -------------------- StrId --------------------*/

  it('StrId should return string id', () => {
    expect(RandomHelper.StrId).toBeInstanceOf(String);
  });

  it('StrId should return different string ids', () => {
    const length = 10; // max - 10 000 000
    const map = new Map<string, string>();

    for (let i = 0; i < length; i++) {
      const id = RandomHelper.StrId;
      map.set(id, id);
    }

    expect(map.size).toEqual(length);
  });

  /* -------------------- ---------------------- --------------------*/



  /* -------------------- NumId --------------------*/

  it('NumId should return number id', () => {
    expect(RandomHelper.NumId).toBeInstanceOf(Number);
  });

  it('NumId should return different number ids', () => {
    const length = 10; // max - 10 000
    const map = new Map<number, number>();

    for (let i = 0; i < length; i++) {
      const id = RandomHelper.NumId;
      map.set(id, id);
    }

    expect(map.size).toEqual(length);
  });

  /* -------------------- ---------------------- --------------------*/
});
