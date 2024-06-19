"use server";

const mongoose = require("mongoose");

export default async function connectDB() {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.DB_HOST + process.env.DB_NAME)
            .then((connectionInstance) => {
                console.log(`\n MongoDB Connected, DB HOST = ${connectionInstance.connections[0].host}`);
            })
            .catch(() => {
                process.exit(1);
            });
    }
}