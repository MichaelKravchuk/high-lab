export class RandomHelper {
  public static get StrId(): string {
    return Math.random().toString(36).substring(2);
  }

  public static get NumId(): number {
    return 1 + Math.random() * 0x10000000 | 0;
  }
}
