import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
    service: "fashog-2",
    frameworkVersion: "2",
    custom: {
        webpack: {
            webpackConfig: "./webpack.config.js",
            includeModules: true,
        },
    },
    plugins: ["serverless-webpack"],
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            DYNAMO_TABLE: "fashog2",
        },
        lambdaHashingVersion: "20201221",
    },
    package: {
        individually: true,
    },
    // import the function via paths
    functions: {
        root: {
            handler: "functions/root/handler.root",
            package: {
                individually: true,
            },
            events: [
                {
                    http: {
                        method: "post",
                        path: "api",
                    },
                },
            ],
        },
        cleanup: {
            handler: "functions/cleanup/handler.cleanup",
            package: {
                individually: true,
            },
            events: [
                {
                    schedule: "cron(0 15 ? * 3 *)",
                },
            ],
        },
    },
};

module.exports = serverlessConfiguration;
