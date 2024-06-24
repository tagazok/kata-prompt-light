
export interface Game {
    event: string,
    id: string,
    score: number,
    user: string,
    createdAt: string,
    updatedAt: string
}

export interface TestsData {
    success: boolean,
    testsResults: TestsResult[]
}

export interface TestsResult {
    status: string,
    message: string,
    name: string,
    assertionResults: AssertionResult[]
}

export interface AssertionResult {
    status: string,
    title: string,
    fullName: string,
}

export interface Tests {
    challengeRef: string,
    testsData: TestsData
}