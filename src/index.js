const express = require('express');
const cookieParser = require('cookie-parser')
const ServerConfig = require('./config/serverConfig');
const connectDB = require('./config/dbConfig');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const { isLoggedIn } = require('./validation/authValidator');
const uploader = require('./middleware/multerMiddleware');
const cloudinary = require('./config/cloudinaryConfig')
const fs = require('fs/promises');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true}));

// Routing middleware
// If your req route starts with /users then handle it using userRouter
app.use('/users', userRouter);  // connects the router to the server
app.use('/carts', cartRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

app.get('/ping', isLoggedIn, (req,res) => {
    //controller
    console.log(req.body);
    console.log(req.cookies); 
    return res.json({message: "pong"});
})

app.post('/photo', uploader.single('incomingFile'), async (req,res) => {
    try{
        const result = await cloudinary.uploader.upload(req.file.path);        
        console.log("result from cloudinary", result);
        await fs.unlink(req.file.path);
        return res.json({message: 'ok'});  
    } catch(e){
        console.log("error: ",e);   
    }

})


app.listen(ServerConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${ServerConfig.PORT}`); 
});

