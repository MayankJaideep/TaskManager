const { MongoClient } = require('mongodb');

async function test() {
    const uri = "mongodb://localhost:27017/taskmanager"; // Default DB name? Let's check application.properties
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('taskmanager'); // Guessing DB is taskmanager
        const users = await db.collection('users').find({}).toArray();
        console.log("Users:", users.map(u => ({ username: u.username, roles: u.roles })));
        const tasks = await db.collection('tasks').find({}).toArray();
        console.log("Tasks count:", tasks.length);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
test();
