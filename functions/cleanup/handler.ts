import { DynamoDB } from "aws-sdk";
import Key from "../root/types/Key";

const DDB = new DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    region: process.env.AWS_REGION,
});

export const cleanup = async () => {
    console.log("Calling delete database...");
    try {
        const results = await DDB.scan({
            TableName: process.env.DYNAMO_TABLE,
        }).promise();

        const requestItems = (results.Items as any).map((item: Key) => {
            return {
                DeleteRequest: {
                    Key: {
                        id: item.id,
                    },
                },
            };
        });
        console.log(requestItems);
        await DDB.batchWrite({
            RequestItems: {
                [process.env.DYNAMO_TABLE]: requestItems,
            },
        }).promise();
        console.log("Successfully deleted all keys");
    } catch (error) {
        console.log("Error while deleting keys...");
        console.log(error);
    }
};
