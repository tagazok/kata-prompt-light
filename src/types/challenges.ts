
export interface ChallengeData {
    name?: string,
    completionPoints?: number
    tests?: ChallengeTest[];
}

export interface ChallengesData {
    [key: string]: ChallengeData;
}

export interface GameChallenges {
    training: string;
    compete: string;
    [key: string]: string;
}

export interface ChatItem {
    role: string,
    content: string
}

export interface ChallengeTest {
    challengeId: string,
    code: string,
    name: string,
    id: string,
    points: number,
    createdAt: string,
    updatedAt: string
}