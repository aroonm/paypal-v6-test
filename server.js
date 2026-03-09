require("dotenv").config();
const express = require("express");

const app = express();

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

app.use(express.static(__dirname));

async function getAccessToken() {

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      response_type: "client_token"
    })
  });

  const data = await response.json();

//   console.log("PayPal response:", data);

  return data.access_token;
}

app.get("/client-token", async (req, res) => {

    try {

        const token = await getAccessToken();

        res.json({ clientToken: token });

    } catch (err) {

        console.error(err);
        res.status(500).send("Failed to generate token");

    }

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});