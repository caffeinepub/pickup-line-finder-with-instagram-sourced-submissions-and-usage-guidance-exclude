import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    username: string;
    totalUpvotes: bigint;
}
export interface Comment {
    id: bigint;
    username: string;
    text: string;
    submittedAt: bigint;
    lineId: bigint;
}
export interface EmojiReactions {
    heart: bigint;
    fire: bigint;
    laugh: bigint;
    skull: bigint;
}
export interface PickupLine {
    id: bigint;
    status: Status;
    likeCount: bigint;
    reportCount: bigint;
    username?: string;
    isSystem: boolean;
    text: string;
    submittedAt: bigint;
    downvoteCount: bigint;
    instagramUrl?: string;
    category: Category;
    emojiReactions: EmojiReactions;
    copyCount: bigint;
}
export enum Category {
    Romantic = "Romantic",
    Nerdy = "Nerdy",
    Smooth = "Smooth",
    Uncategorized = "Uncategorized",
    Opener = "Opener",
    Savage = "Savage",
    Funny = "Funny",
    Cringe = "Cringe",
    Cheesy = "Cheesy",
    Comeback = "Comeback"
}
export enum EmojiType {
    Laugh = "Laugh",
    Skull = "Skull",
    Fire = "Fire",
    Heart = "Heart"
}
export enum Status {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addEmojiReaction(id: bigint, emoji: EmojiType): Promise<void>;
    approvePickupLine(id: bigint): Promise<void>;
    downvotePickupLine(id: bigint): Promise<void>;
    getAllPickupLines(): Promise<Array<PickupLine>>;
    getApprovedPickupLines(): Promise<Array<PickupLine>>;
    getComments(lineId: bigint): Promise<Array<Comment>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLineWithGuide(id: bigint): Promise<{
        howToUse: string;
        pickupLine: PickupLine;
    }>;
    getPendingPickupLines(): Promise<Array<PickupLine>>;
    getRizzOfTheDay(): Promise<PickupLine | null>;
    likePickupLine(id: bigint): Promise<void>;
    recordCopy(id: bigint): Promise<void>;
    rejectPickupLine(id: bigint): Promise<void>;
    reportPickupLine(id: bigint): Promise<void>;
    submitComment(lineId: bigint, text: string, username: string): Promise<void>;
    submitPickupLine(text: string, instagramUrl: string | null, username: string | null, category: Category): Promise<void>;
}
