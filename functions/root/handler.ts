import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyKey } from "discord-interactions";

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
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                ...requiredHeaders,
            },
            body: JSON.stringify(err),
        };
    }
};
