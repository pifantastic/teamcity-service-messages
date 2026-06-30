import { settings } from './settings';

export interface Args {
	timestamp?: string;
	flowId?: string;
}

/**
 * Constructs a message formatted for consumption by TeamCity.
 */
export class Message {
	static flowId: number = Math.floor(Math.random() * (1e10 - 1e6 + 1)) + 1e6;

	type: string;
	single: boolean;
	args: Args | string | number;

	constructor(type: string, args?: Args | string | number) {
		this.type = type;
		this.single = false;

		// Message is a 'multiple attribute message'.
		if (typeof args === 'object' || typeof args === 'undefined') {
			this.args = args || {};
		}
		// Message is a 'single attribute message'.
		else {
			this.single = true;
			this.args = args;
		}

		if (!this.single) {
			const currentArgs = this.args as Args;
			if (currentArgs.flowId) {
				this.arg('flowId', currentArgs.flowId);
			} else if (settings.autoFlowId) {
				this.arg('flowId', Message.flowId);
			}
		}
	}

	/**
	 * Add a keyword argument to the message.
	 */
	arg(key: string, value: unknown): this {
		if (this.single) {
			throw new Error('Cannot add arguments to a single attribute message.');
		}

		(this.args as Record<string, unknown>)[key] = value;
		return this;
	}

	/**
	 * Escape a string for TeamCity output.
	 * @see https://www.jetbrains.com/help/teamcity/service-messages.html
	 */
	escape(str?: unknown): string {
		if (str == null) {
			return '';
		}

		return String(str)
			.replace(/\|/g, '||')
			.replace(/\n/g, '|n')
			.replace(/\r/g, '|r')
			.replace(/\[/g, '|[')
			.replace(/\]/g, '|]')
			.replace(/\u0085/g, '|x') // next line
			.replace(/\u2028/g, '|l') // line separator
			.replace(/\u2029/g, '|p') // paragraph separator
			.replace(/'/g, "|'");
	}

	/**
	 * Format keyword arguments for use in a message.
	 */
	formatArgs(): string {
		const args = this.args as Record<string, unknown>;
		return Object.keys(args)
			.map((key) => `${key}='${this.escape(args[key])}'`)
			.join(' ');
	}

	/**
	 * Format the message as a string.
	 */
	toString(): string {
		if (this.single) {
			return `##teamcity[${this.type} '${this.escape(this.args)}']`;
		}

		const args = this.args as Args;
		if (!args.timestamp) {
			// TeamCity does not fully support ISO 8601 (see TW-36173) so we cut the trailing 'Z'.
			this.arg('timestamp', new Date().toISOString().slice(0, -1));
		}

		return `##teamcity[${this.type} ${this.formatArgs()}]`;
	}
}
