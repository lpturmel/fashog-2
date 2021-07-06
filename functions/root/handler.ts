import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyKey } from "discord-interactions";
import { DynamoDB } from "aws-sdk";
import { addKey, formatKeyChoices, listKeys } from "./db";

const DDB = new DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    region: process.env.AWS_REGION,
});
/**
 *
 * DOC
 *
 * COMMAND    ID
 * ping:      861755492325654548
 * xaviotron: 861798491814363176
 * fashog:    861798627503505428
 * addkey:    861804004195172372
 * keys:      861797525829058611
 */
export const root: APIGatewayProxyHandler = async (event) => {
    const requiredHeaders = {
        "Content-Type": "application/json",
    };
    console.log("Headers type: ", typeof event.headers);
    console.log(Object.keys(event.headers));
    console.log(event.headers["X-Signature-Ed25519"]);
    console.log(event.headers["X-Signature-Timestamp"]);

    console.log("body: ", Object.keys(event.body));
    console.log(JSON.stringify(event.body));
    try {
        const signature = event.headers["x-signature-ed25519"];
        const timestamp = event.headers["x-signature-timestamp"];
        if (signature && timestamp) {
            const isValidRequest = verifyKey(
                event.body.toString(),
                signature,
                timestamp,
                "e546e16136ffbfd3de8cd2bd61ab1b854e2b66f4ef880aab61de498a229305fe"
            );

            if (!isValidRequest) {
                console.log("The request signature was not valid");
                return {
                    statusCode: 400,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        error: "Bad request signature",
                    }),
                };
            }
            console.log("Successfully validated an interaction");
        }
        const body = JSON.parse(event.body);
        const type = body.type;

        if (!type) {
            return {
                statusCode: 400,
                headers: {
                    ...requiredHeaders,
                },
                body: JSON.stringify({ error: "No type body specified" }),
            };
        }

        if (type === 1) {
            console.log("successfully exited");
            return {
                statusCode: 200,
                headers: {
                    ...requiredHeaders,
                },
                body: JSON.stringify({
                    type: 1,
                }),
            };
        } else {
            const interactionId = body.data.id;
            const args = body.data.options;

            if (interactionId === "861755492325654548") {
                return {
                    statusCode: 200,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        type: 4,
                        data: {
                            tts: false,
                            content: "Pong 🏓",
                            embeds: [],
                            allowed_mentions: { parse: [] },
                        },
                    }),
                };
            }
            if (interactionId === "861798491814363176") {
                return {
                    statusCode: 200,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        type: 4,
                        data: {
                            tts: false,
                            content:
                                "🤡🤡🤡 Je db je db!!!! .... ah je lai pas. Oubliez pas de cliquer lala",
                            embeds: [],
                            allowed_mentions: { parse: [] },
                        },
                    }),
                };
            }
            if (interactionId === "861798627503505428") {
                return {
                    statusCode: 200,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        type: 4,
                        data: {
                            tts: false,
                            content: "👹 Macaque en chef",
                            embeds: [],
                            allowed_mentions: { parse: [] },
                        },
                    }),
                };
            }
            if (interactionId === "861804004195172372") {
                await addKey(
                    {
                        addedBy: body.member.user.username.toLowerCase(),
                        name: args[0].value,
                        level: args[1].value,
                    },
                    DDB
                );
                return {
                    statusCode: 200,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        type: 4,
                        data: {
                            tts: false,
                            content: "✅ La key a été ajoutée à la liste",
                            embeds: [],
                            allowed_mentions: { parse: [] },
                        },
                    }),
                };
            }
            if (interactionId === "861797525829058611") {
                const keys = await listKeys(
                    args ? args[0].value : undefined,
                    DDB
                );
                const formattedKeys = formatKeyChoices(keys);
                return {
                    statusCode: 200,
                    headers: {
                        ...requiredHeaders,
                    },
                    body: JSON.stringify({
                        type: 4,
                        data: {
                            tts: false,
                            content: formattedKeys,
                            embeds: [],
                            allowed_mentions: { parse: [] },
                        },
                    }),
                };
            }
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers: {
                ...requiredHeaders,
            },
            body: JSON.stringify(err),
        };
    }
};
