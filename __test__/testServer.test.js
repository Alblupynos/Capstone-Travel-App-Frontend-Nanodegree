import {projectData} from "../src/server/index"

describe("Testing server functionality", () => {
    test("Testing projectData is present", () => {
        expect(projectData).toBeDefined();
        expect(projectData).toEqual({});
    });
});