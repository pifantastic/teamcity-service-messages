import { MessageBaseArgs } from './lib/message'

interface IBlockMessageArgs extends MessageBaseArgs {
  name: string;
  description?: string;
}

interface IBuildStatisticValueArgs extends MessageBaseArgs {
  key: string;
  value: number;
}

interface ICompilationMessageArgs extends MessageBaseArgs {
  compiler: string;
}

interface IInspectionTypeArgs extends MessageBaseArgs {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface IInspectionArgs extends MessageBaseArgs {
  typeId: string;
  message?: string;
  file: string;
  line?: number;
  SEVERITY?: 'INFO' | 'ERROR' | 'WARNING' | 'WEAK WARNING';
}

interface IMessageArgs extends MessageBaseArgs {
  text: string;
  status?: 'NORMAL' | 'WARNING' | 'FAILURE' | 'ERROR';
  errorDetails?: string;
}

interface ISetParameterArgs extends MessageBaseArgs {
  name: string;
  value: any;
}

interface ITestMessageArgs extends MessageBaseArgs {
  name: string;
}

interface TSM {
  stdout: boolean;
  autoFlowId: boolean;

  blockOpened(args: IBlockMessageArgs): this;
  blockClosed(args: IBlockMessageArgs): this;

  buildNumber(value: string): this;
  buildProblem(args: MessageBaseArgs): this;
  buildStatisticValue(args: IBuildStatisticValueArgs): this;
  buildStatus(args: MessageBaseArgs): this;

  compilationStarted(args: ICompilationMessageArgs): this;
  compilationFinished(args: ICompilationMessageArgs): this;

  enableServiceMessages(): this;
  disableServiceMessages(): this;

  inspectionType(args: IInspectionTypeArgs): this;
  inspection(args: IInspectionArgs): this;

  message(args: IMessageArgs): this;

  progressMessage(message: string): this;
  progressStart(message: string): this;
  progressFinish(message: string): this;

  importData(args: MessageBaseArgs): this;
  publishArtifacts(path: string): this;
  setParameter(args: ISetParameterArgs): this;

  testFinished(args: ITestMessageArgs): this;
  testIgnored(args: ITestMessageArgs): this;
  testMetadata(args: ITestMessageArgs): this;
  testStarted(args: ITestMessageArgs): this;
  testFailed(args: ITestMessageArgs): this;
  testStdErr(args: ITestMessageArgs): this;
  testStdOut(args: ITestMessageArgs): this;
  testSuiteStarted(args: ITestMessageArgs): this;
  testSuiteFinished(args: ITestMessageArgs): this;
}

declare const tsm: TSM;
export = tsm;
