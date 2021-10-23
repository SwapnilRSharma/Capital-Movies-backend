const express = require('express')
const userRouter = require('./routers/userRouter.js')
var cors = require('cors')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(cors())

app.use(express.json())
app.use(userRouter)


// app.get('/', (req, res) => {
//     return res.send("Hello!");
// })

app.listen('3000', () => {
    console.log(`App is running on port: ${port}`);
})