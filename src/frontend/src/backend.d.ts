import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PickupLine {
    id: bigint;
    status: Status;
    reportCount: bigint;
    isSystem: boolean;
    text: string;
    instagramUrl?: string;
}
export enum Status {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    approvePickupLine(id: bigint): Promise<void>;
    getAllPickupLines(): Promise<Array<PickupLine>>;
    getLineWithGuide(id: bigint): Promise<{
        howToUse: string;
        pickupLine: PickupLine;
    }>;
    getPendingPickupLines(): Promise<Array<PickupLine>>;
    rejectPickupLine(id: bigint): Promise<void>;
    reportPickupLine(id: bigint): Promise<void>;
    submitPickupLine(text: string, instagramUrl: string | null): Promise<void>;
}
