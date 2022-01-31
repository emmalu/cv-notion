const express = require('express');
const dotenv = require('dotenv').config();
const { Client } = require('@notionhq/client');

const PORT = process.env.PORT || '8000';

const app = express();

app.listen(PORT, console.log(`SERVER STARTED ON PORT ${PORT}!`));

app.get('/entries', async(req, res) => {
    try {
        const house_bytes = await getBytesPages();
        console.log('entries', house_bytes);
        const url = `https://emmalu.notion.site/${(house_bytes[0].title).replace(/ /g, '-')}-${house_bytes[0].id}`;
        console.log('url', url);
        res.json(house_bytes);
    } catch (err) {
        res.status(err).send("There's been an error querying the data. Please try again later.");
    }
});

//Init client
const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

//Deprecated
/* const listDatabases = async() => {
    const res = await notion.databases.list();
    console.log(res);
}
listDatabases(); */

const database_id = process.env.NOTION_DATABASE_ID;

const getBytesPages = async() => {
    const { results }  = await notion.databases.query({
        database_id: database_id,
        filter: {
            property: 'Status',
            select: {
              equals: 'Published'
            }
        },
        sorts: [
            {
                property: 'Published',
                direction: 'descending'
            }
        ]
    });
    const entries = results.map((page) => {
        //console.log('page', page);
        return {
            id: page.id,
            title: page.properties.Name.title[0].plain_text,
            tags: page.properties.Tags.multi_select.map( t=>{return t.name}),
            slug: page.properties.Slug.rich_text[0].plain_text,
            published: page.properties.Published.date.start,
            last_edited: page.last_edited_time
        }; 
    });
    return entries;
}
/* 
(async () => {
    const house_bytes = await getBytesPages();
    console.log('posts', house_bytes);
})(); */