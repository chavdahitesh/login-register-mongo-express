/* 
    created :- HITESH CHAVDA
*/

const express = require('express');
const cors = require('cors');
const bodyPraser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const indexRoute = require('./app/routes/index');
const userRoutes = require('./app/routes/user');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyPraser.urlencoded({ extended: true }))
app.use(bodyPraser.json())
app.use(cors());

//db connections
const db = require('./app/models')
// db.mongoose.connect(`${process.env.MONGODB_CLUSTER_URL}`,
db.mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('Welcome to world of mongoDB');
}).catch(() => {
    console.log('Error in DB Connections');
})


//routes
app.use('/api', indexRoute)
app.use('/api/user', userRoutes)


app.listen(process.env.SERVER_PORT, () => {
    console.log("Server running on port", process.env.SERVER_PORT);
})


