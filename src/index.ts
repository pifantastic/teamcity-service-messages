import { Message as MessageClass } from './message';
import { settings } from './settings';

class ServiceMessages {
	Message = MessageClass;

	get stdout(): boolean {
		return settings.stdout;
	}
	set stdout(value: boolean) {
		settings.stdout = value;
	}

	get autoFlowId(): boolean {
		return settings.autoFlowId;
	}
	set autoFlowId(value: boolean) {
		settings.autoFlowId = value;
	}

	/**
	 * Build a message and either print it (chainable API) or return the string,
	 * depending on `stdout`. The chainable return type is preserved for the
	 * common (stdout enabled) case; when stdout is disabled the generated string
	 * is returned at runtime instead.
	 */
	private emit(type: string, args?: tsm.Args | string | number): this {
		const output = new MessageClass(type, args).toString();
		if (settings.stdout) {
			console.log(output);
			return this;
		}
		return output as unknown as this;
	}

	blockClosed(args: tsm.BlockClosedArgs) {
		return this.emit('blockClosed', args);
	}
	blockOpened(args: tsm.BlockOpenedArgs) {
		return this.emit('blockOpened', args);
	}
	buildNumber(number: string | number) {
		return this.emit('buildNumber', number);
	}
	buildProblem(args: tsm.BuildProblemArgs) {
		return this.emit('buildProblem', args);
	}
	buildStatisticValue(args: tsm.BuildStatisticValueArgs) {
		return this.emit('buildStatisticValue', args);
	}
	buildStatus(args: tsm.BuildStatusArgs) {
		return this.emit('buildStatus', args);
	}
	compilationFinished(args: tsm.CompilationArgs) {
		return this.emit('compilationFinished', args);
	}
	compilationStarted(args: tsm.CompilationArgs) {
		return this.emit('compilationStarted', args);
	}
	disableServiceMessages() {
		return this.emit('disableServiceMessages');
	}
	enableServiceMessages() {
		return this.emit('enableServiceMessages');
	}
	importData(
		args:
			| tsm.ImportDataArgs
			| tsm.ImportFindBugsDataArgs
			| tsm.ImportDotNetCoverageDataArgs,
	) {
		return this.emit('importData', args);
	}
	inspectionType(args: tsm.InspectionTypeArgs) {
		return this.emit('inspectionType', args);
	}
	inspection(args: tsm.InspectionArgs) {
		return this.emit('inspection', args);
	}
	message(args: tsm.MessageArgs | tsm.ErrorMessageArgs) {
		return this.emit('message', args);
	}
	progressFinish(message: string) {
		return this.emit('progressFinish', message);
	}
	progressMessage(message: string) {
		return this.emit('progressMessage', message);
	}
	progressStart(message: string) {
		return this.emit('progressStart', message);
	}
	publishArtifacts(path: string) {
		return this.emit('publishArtifacts', path);
	}
	setParameter(args: tsm.SetParameterArgs) {
		return this.emit('setParameter', args);
	}
	testFailed(args: tsm.TestFailedArgs | tsm.TestComparisonFailureArgs) {
		return this.emit('testFailed', args);
	}
	testFinished(args: tsm.TestFinishedArgs) {
		return this.emit('testFinished', args);
	}
	testIgnored(args: tsm.TestIgnoredArgs) {
		return this.emit('testIgnored', args);
	}
	testMetadata(args: tsm.NumberTestMetadataArgs | tsm.StringTestMetadataArgs) {
		return this.emit('testMetadata', args);
	}
	testStarted(args: tsm.TestStartedArgs) {
		return this.emit('testStarted', args);
	}
	testStdErr(args: tsm.TestStdOutArgs) {
		return this.emit('testStdErr', args);
	}
	testStdOut(args: tsm.TestStdOutArgs) {
		return this.emit('testStdOut', args);
	}
	testSuiteFinished(args: tsm.TestSuiteArgs) {
		return this.emit('testSuiteFinished', args);
	}
	testSuiteStarted(args: tsm.TestSuiteArgs) {
		return this.emit('testSuiteStarted', args);
	}
}

const tsm = new ServiceMessages();

// Argument types, exposed under the same name as the exported value so that
// `import tsm = require('teamcity-service-messages')` can reference them as
// `tsm.BlockOpenedArgs`, etc.
namespace tsm {
	export interface Args {
		timestamp?: string;
		flowId?: string;
	}

	export interface BlockClosedArgs extends Args {
		name: string;
		description?: string;
	}

	export interface BlockOpenedArgs extends Args {
		name: string;
		description?: string;
	}

	export interface BuildProblemArgs extends Args {
		description: string;
		identity?: string;
	}

	export interface BuildStatisticValueArgs extends Args {
		key: string;
		value: number;
	}

	export interface BuildStatusArgs extends Args {
		status?: 'SUCCESS' | 'FAILURE';
		text: string;
	}

	export interface CompilationArgs extends Args {
		compiler: string;
	}

	export interface ImportDataArgs extends Args {
		type:
			| 'junit'
			| 'surefire'
			| 'nunit'
			| 'mstest'
			| 'vstest'
			| 'gtest'
			| 'intellij-inspections'
			| 'checkstyle'
			| 'jslint'
			| 'FxCop1'
			| 'pmd'
			| 'pmdCpd'
			| 'DotNetDupFinder';
		path: string;
	}

	export interface ImportFindBugsDataArgs extends Args {
		type: 'findBugs';
		path: string;
		findBugsHome: string;
	}

	export interface ImportDotNetCoverageDataArgs extends Args {
		type: 'dotNetCoverage';
		path: string;
		tool: 'dotcover' | 'partcover' | 'ncover' | 'ncover3';
	}

	export interface InspectionTypeArgs extends Args {
		id: string;
		name: string;
		category: string;
		description: string;
	}

	export interface InspectionArgs extends Args {
		typeId: string;
		message?: string;
		file: string;
		line?: string;
		SEVERITY?: 'INFO' | 'ERROR' | 'WARNING' | 'WEAK WARNING';

		[key: string]: unknown;
	}

	export interface MessageArgs extends Args {
		text: string;
		status?: 'NORMAL' | 'WARNING' | 'FAILURE';
	}

	export interface ErrorMessageArgs extends Args {
		text: string;
		status: 'ERROR';
		errorDetails?: string;
	}

	export interface SetParameterArgs extends Args {
		name: string;
		value: string | number | boolean;
	}

	export interface TestFailedArgs extends Args {
		name: string;
		message?: string;
		details?: string;
	}

	export interface TestComparisonFailureArgs extends TestFailedArgs {
		type: 'comparisonFailure';
		expected: unknown;
		actual: unknown;
	}

	export interface TestFinishedArgs extends Args {
		name: string;
		duration?: number;
	}

	export interface TestIgnoredArgs extends Args {
		name: string;
		message?: string;
	}

	export interface TestMetadataArgs extends Args {
		name?: string;
		testName?: string;
	}

	export interface NumberTestMetadataArgs extends TestMetadataArgs {
		type: 'number';
		value: number;
	}

	export interface StringTestMetadataArgs extends TestMetadataArgs {
		type?: 'text' | 'link' | 'artifact' | 'image' | 'video';
		value: string;
	}

	export interface TestStartedArgs extends Args {
		name: string;
		captureStandardOutput?: boolean;
	}

	export interface TestStdOutArgs extends Args {
		name: string;
		out: string;
	}

	export interface TestSuiteArgs extends Args {
		name: string;
	}
}

export = tsm;
