process.env.RIDES_URL = "https://s3.eu-north-1.amazonaws.com/lemon-1/scooter_1337.csv";
process.env.PRICE_RATE_URL = "https://s3.eu-north-1.amazonaws.com/lemon-1/rate.json";

module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/test/**/*.test.(ts|js)"
    ],
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    clearMocks: true
};




// export default {
//   clearMocks: true,
//   coverageDirectory: "coverage",
//   testEnvironment: 'jest-environment-node',
//   transform: {},
//   setupFiles: ["dotenv/config"]
// };
