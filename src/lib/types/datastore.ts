export interface RequestData {
	status: 'submitted' | 'swapped' | 'failed';
	icpAmount: bigint;
}
