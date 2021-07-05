import express from "express";
import { json } from "body-parser";
import fs from "fs";
import https from "https";
import nacl from "tweetnacl";

var privateKey = fs.readFileSync(__dirname + "/certs/selfsigned.key", "utf8");
var certificate = fs.readFileSync(__dirname + "/certs/selfsigned.crt", "utf8");

const app = express();
const port = 443;

// your express configuration here

app.use(json());

app.post("/", (req, res) => {
    console.log("received call");
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY =
        "e546e16136ffbfd3de8cd2bd61ab1b854e2b66f4ef880aab61de498a229305fe";

    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    if (!signature) {
        return res.status(400).end("Missing X-Signature-Ed25519");
    }
    if (!timestamp) {
        return res.status(400).end("X-Signature-Timestamp");
    }
    const body = req.body; // rawBody is expected to be a string, not raw bytes

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + body),
        Buffer.from(signature!, "hex"),
        Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
        return res.status(401).end("invalid request signature");
    }
    if (req.body.type === 1) {
        return res.json({
            type: 1,
        });
    }

    res.json({ type: 0 });
});
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Fashog 2 listening at http://localhost:${port}`);
});
