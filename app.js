const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

mongoose.connect(
	`mongodb+srv://EXAMPLE:${encodeURI(
		process.env.MONGO_ATLAS_PW
	)}@node-rest-api.t5pb0.mongodb.net/node-rest-api?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
)

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	if (res.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}
	next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message,
		},
	})
})

module.exports = app
