const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const ContentBasedRecommender = require('content-based-recommender');
const Book = require("../models/").book;

exports.trainRecommendedData = ()=>{
    const scheduleTime = "0 0 */3 * * *"; // train every 3 hours 
    // const scheduleTime = "*/5 * * * * *";

    cron.schedule(scheduleTime, async function() {
        try {
            console.log("Data training start: " +  Date(Date.now()));
            const recommender = new ContentBasedRecommender({
                minScore: 0.2,
                maxSimilarDocuments: 100,
                debug: false
            });
            const books = await Book.find();
            let data = [];
            books.forEach(book=>{
                content = book.title.toLowerCase() 
                        + " " + book.category.map(e=>e.name).join(" ").toLowerCase()
                        + " " + book.tags.join(" ").toLowerCase();
                data.push({
                    id: book._id,
                    content
                })
            })
            recommender.train(data);
            fs.writeFileSync(path.join(__dirname,"..","data","trainingdata.json"),JSON.stringify(recommender.data),'utf8');
            console.log("Data training complete: " + Date(Date.now()));
        } catch (error) {
            console.error(error);
        }
    });
}