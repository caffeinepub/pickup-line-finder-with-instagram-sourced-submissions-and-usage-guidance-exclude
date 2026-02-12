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
    reportCount: bigint;
    isSystem: boolean;
    text: string;
    instagramUrl?: string;
    howToUse: string;
}
export interface backendInterface {
    getAllPickupLines(): Promise<Array<PickupLine>>;
    reportPickupLine(id: bigint): Promise<void>;
    submitPickupLine(text: string, instagramUrl: string | null): Promise<void>;
}
