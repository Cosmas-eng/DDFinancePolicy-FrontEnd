export interface PolicyToTable {
    id: number;
    name: string;
    holder: string;
    status: string;
}

export interface PolicyResponse {
    policies: PolicyToTable[];
}