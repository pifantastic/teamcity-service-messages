export interface MessageBaseArgs {
  flowId?: string;
  timestamp?: string | Date;
  [key: string]: any;
}

/**
 * Constructs a message formatted for consumption by TeamCity.
 */
export default class Message<T = MessageBaseArgs | string> {
  public static flowId: string;

  public readonly type: string;
  public readonly single: boolean;
  public readonly args: T;

  constructor(type: string, args: T);

  /** Add a keyword argument to the message. */
  public arg(key: string, value: any): Message<T>;

  /** Escape string for TeamCity output. */
  public escape(str: string): string;

  /** Format keyword arguments for use in a message. */
  public formatArgs(): string;

  /** Format the message as a string. */
  public toString(): string;
}
