const { Client } = require("@notionhq/client");

if (process.env.NODE_ENV !== "PROD") {
  process.env.NODE_ENV = "DEV";
  require("dotenv").config();
}

//Init client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const database_id = process.env.NOTION_DATABASE_ID_3;

//Connnect and query DB table
exports.queryDatabase = async function () {
  const { results } = await notion.databases.query({
    database_id: database_id,
    filter: {
      property: "Status",
      select: {
        equals: "Active",
      },
    },
    sorts: [
      {
        property: "Name",
        direction: "descending",
      },
    ],
  });
  const entries = results.map((page) => {
    console.log("page", page);
    return {
      id: page.id,
      title: page.properties.Name.title[0].plain_text,
      /* tags: page.properties.Tags.multi_select.map((t) => {
        return t.name;
      }), */
      url: page.properties.IDX.url,
      edited: page.properties.Edited.last_edited_time,
    };
  });
  return entries;
};
