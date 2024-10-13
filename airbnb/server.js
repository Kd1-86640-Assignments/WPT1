const express = require('express');
const utils = require('./utils')
const db = require('./db')
const cors = require('cors')
const userRouter =require('./routes/user')
const categoryRouter=require('./routes/category')
const propertyRouter=require('./routes/property')
const bookingRouter=require('./routes/booking')
const user = require('./config')



const app = express();
// app.use(cors())

app.use(express.json()) //this line will create request.body from

app.use((request,response ,next) =>{
    //to check what we have written inside and where is our request going

    // console.log(request.url)
    if(
        
        request.url==='/user/login'||
        request.url==='/user/register'||
        request.url==='/user/booking' ||
        request.url.startsWith('/user/profile')||
        request.url==='/category/get-category'||
        request.url==='/category/add-category'||
        request.url==='/booking/get-bookings'||
        request.url==='/property'||
        request.url.startsWith('/booking')




    ){
        //agar yeh nhi krenge to huamara server yhi se upar chala jaega
        next()
    }
    else(
        console.log("success")

    )
    app.use('/user',userRouter)
    app.use('/category',categoryRouter)
    app.use('/property',propertyRouter)
    app.use('/booking',bookingRouter)
})



// app.use(cors())


app.listen(8000, ()=>{
    console.log("Server started on 8000")
})