export class RandomHelper {
  /** use for large set, unique by 10 000 000 */
  public static get StrId(): string {
    return Math.random().toString(36).substring(2);
  }

  /** use only for small set, unique by 10 000 */
  public static get NumId(): number {
    return 1 + Math.random() * 0x10000000 | 0;
  }
}
