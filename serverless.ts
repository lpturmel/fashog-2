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
        },
        lambdaHashingVersion: "20201221",
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
                        // cors: {
                        //     headers: [
                        //         "Cookies",
                        //         "Content-Type",
                        //         "X-Amz-Date",
                        //         "Authorization",
                        //         "X-Api-Key",
                        //         "X-Amz-Security-Token",
                        //         "X-Amz-User-Agent",
                        //         "X-Signature-Ed25519",
                        //         "X-Signature-Timestamp",
                        //     ],
                        //     allowCredentials: true,
                        // },
                    },
                },
            ],
        },
    },
};

module.exports = serverlessConfiguration;
