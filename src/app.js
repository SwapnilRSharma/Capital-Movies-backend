const express = require('express')
const userRouter = require('./routers/userRouter.js')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)


// app.get('/', (req, res) => {
//     return res.send("Hello!");
// })

app.listen('3000', () => {
    console.log(`App is running on port: ${port}`);
})