/**
 * Compile-only fixture that locks the public type surface. It is type-checked
 * (not executed) via `tsc -p tests/tsconfig.json`; the `@ts-expect-error` lines
 * fail the build if a bad call ever starts compiling.
 */
import tsm = require('../dist');

// Chainable, correctly-typed calls.
tsm.testStarted({ name: 't' }).testFinished({ name: 't', duration: 5 });
tsm.buildStatus({ status: 'FAILURE', text: 'boom' });
tsm.buildNumber(42);
tsm.message({ text: 'hi', status: 'WARNING' });
tsm.importData({ type: 'junit', path: '/p' });

// Argument interfaces are reachable by qualified name.
const blockArgs: tsm.BlockOpenedArgs = { name: 'b', description: 'd' };
tsm.blockOpened(blockArgs);

// The low-level Message class is exported and flexible.
const out: string = new tsm.Message('testStarted', { name: 'my test' }).toString();
void out;

// Settings toggles are booleans.
tsm.stdout = false;
tsm.autoFlowId = false;

// --- Negative cases: each must NOT type-check ---

// @ts-expect-error - missing required `text`
tsm.buildStatus({ status: 'SUCCESS' });

// @ts-expect-error - `name` must be a string
tsm.testStarted({ name: 123 });

// @ts-expect-error - invalid importData `type`
tsm.importData({ type: 'bogus', path: '/p' });

// @ts-expect-error - unknown status literal
tsm.buildStatus({ status: 'MAYBE', text: 't' });
