const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/dbConfig.js');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const paymentRouter = require('./routes/paymentRoute.js');

const { FRONTEND_URL, PORT } = require('./config/serverConfig.js');
const contactRouter = require('./routes/contactRoute.js');

const app = express();
app.use(
  cors({
    origin: FRONTEND_URL, // allow to server to accept request from different origin
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// Routing middleware
// If your req route starts with /users then handle it using userRouter
app.use('/users', userRouter); // connects the router to the server
app.use('/carts', cartRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/payments', paymentRouter);
app.use('/', contactRouter);

app.get('/ping', (req, res) => {
  //controller
  console.log(req.body);
  console.log(req.cookies);
  return res.json({ message: 'pong' });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started at port ${PORT}`);
});
