export interface RequestData {
	status: 'submitted' | 'swapped' | 'failed';
	icp_amount: bigint;
}
