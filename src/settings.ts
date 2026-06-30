/**
 * Mutable global settings shared between the public API and the Message class.
 * Keeping them here breaks the circular require that previously existed between
 * index and lib/message.
 */
export const settings = {
	stdout: true,
	autoFlowId: true,
};
