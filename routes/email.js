const { Client } = require("@notionhq/client");

if (process.env.NODE_ENV !== "PROD") {
  process.env.NODE_ENV = "DEV";
  require("dotenv").config();
}

//Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN_2,
});
const database_id = process.env.NOTION_DATABASE_ID_2;

exports.addToDatabase = async function (new_email) {
  console.log("email", new_email);
  const result = await notion.pages.create({
    parent: {
      database_id: database_id,
    },
    properties: {
      Email: {
        title: [
          {
            text: {
              content: new_email,
            },
          },
        ],
      },
      Status: {
        select: {
          name: "🎉 New",
        },
      },
    },
  });
  console.log("result", result);
  return result;
};
