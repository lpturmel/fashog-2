import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Key from "./types/Key";
import { v4 as uuid } from "uuid";

export function formatKeyChoices(keys: Array<Key>) {
    let string = "";

    keys.map((key, index) => {
        string += `**${index + 1}. ${key.name}**\t***${key.level}***\t by: ${
            key.addedBy
        }\n`;
    });

    return string;
}
export async function listKeys(
    username: string | undefined,
    DDB: DocumentClient
): Promise<Key[]> {
    if (!username) {
        const keysResult = await DDB.scan({
            TableName: process.env.DYNAMO_TABLE,
        }).promise();
        return keysResult.Items as Key[];
    }

    const keysForUserResult = await DDB.scan({
        TableName: process.env.DYNAMO_TABLE,
        FilterExpression: "addedBy = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    }).promise();
    return keysForUserResult.Items as Key[];
}
export async function addKey(key: Key, DDB: DocumentClient) {
    await DDB.put({
        TableName: process.env.DYNAMO_TABLE,
        Item: {
            id: uuid(),
            ...key,
        },
    }).promise();
}
// export async function changeKeyName(id: string, newName: string) {
//     const db = await connectDB();

//     await db
//         .collection("keys")
//         .findOneAndUpdate(
//             { _id: new ObjectId(id) },
//             { $set: { name: newName } }
//         );
// }
// export async function changeKeyLevel(id: string, newLevel: number) {
//     const db = await connectDB();

//     await db
//         .collection("keys")
//         .findOneAndUpdate(
//             { _id: new ObjectId(id) },
//             { $set: { level: newLevel } }
//         );
// }
