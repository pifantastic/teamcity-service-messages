import Message, { MessageBaseArgs } from './lib/message'

export { Message }

export var stdout: boolean;

export var autoFlowId: boolean;

interface IBlockMessageArgs extends MessageBaseArgs {
  name: string;
  description?: string;
}

export function blockOpened(args: IBlockMessageArgs): void;
export function blockClosed(args: IBlockMessageArgs): void;

export function buildNumber(value: string): void;
export function buildProblem(args: MessageBaseArgs): void;

interface IBuildStatisticValueArgs extends MessageBaseArgs {
  key: string;
  value: number;
}

export function buildStatisticValue(args: IBuildStatisticValueArgs): void;
export function buildStatus(args: MessageBaseArgs): void;

interface ICompilationMessageArgs extends MessageBaseArgs {
  compiler: string;
}

export function compilationStarted(args: ICompilationMessageArgs): void;
export function compilationFinished(args: ICompilationMessageArgs): void;

export function enableServiceMessages(): void;
export function disableServiceMessages(): void;

export function importData(args: MessageBaseArgs): void;

interface IInspectionTypeArgs extends MessageBaseArgs {
  id: string;
  name: string;
  category: string;
  description: string;
}

export function inspectionType(args: IInspectionTypeArgs): void;

interface IInspectionArgs extends MessageBaseArgs {
  typeId: string;
  message?: string;
  file: string;
  line?: number;
  SEVERITY?: 'INFO' | 'ERROR' | 'WARNING' | 'WEAK WARNING';
}

export function inspection(args: IInspectionArgs): void;

interface IMessageArgs extends MessageBaseArgs {
  text: string;
  status?: 'NORMAL' | 'WARNING' | 'FAILURE' | 'ERROR';
  errorDetails?: string;
}

export function message(args: IMessageArgs): void;

export function progressMessage(message: string): void;
export function progressStart(message: string): void;
export function progressFinish(message: string): void;
export function publishArtifacts(path: string): void;

interface ISetParameterArgs extends MessageBaseArgs {
  name: string;
  value: any;
}

export function setParameter(args: ISetParameterArgs): void;

interface ITestMessageArgs extends MessageBaseArgs {
  name: string;
}

export function testFinished(args: ITestMessageArgs): void;
export function testIgnored(args: ITestMessageArgs): void;
export function testMetadata(args: ITestMessageArgs): void;
export function testStarted(args: ITestMessageArgs): void;
export function testFailed(args: ITestMessageArgs): void;
export function testStdErr(args: ITestMessageArgs): void;
export function testStdOut(args: ITestMessageArgs): void;
export function testSuiteStarted(args: ITestMessageArgs): void;
export function testSuiteFinished(args: ITestMessageArgs): void;
