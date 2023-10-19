const app = require('../src/server/app')

describe("Testing server functionality", () => {
    test("Testing app is defined", () => {
        expect(app).toBeDefined();
    });
});