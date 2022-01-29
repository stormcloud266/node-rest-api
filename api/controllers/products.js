const Product = require('../models/product')
const mongoose = require('mongoose')

exports.products_get_all = (req, res, next) => {
  Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: error})
    })
}

exports.products_add_one = (req, res, next) => {

  const product = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  
  product
    .save()
    .then(result =>{ 
      console.log(result)
      res.status(201).json({
        message: 'Created project successfully',
        createdProduct: {
          name: result.name,
          _id: result._id,
          name: result.name,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result._id}`
          }
        }
      })
    })
    .catch(error =>{ 
      console.log(error)
      res.status(500).json({error: error})
    })
}

exports.products_get_one = (req, res, next) => {
  const id = req.params.productID
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log(doc)
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: `http://localhost:3000/products`
          }
        })
      } else {
        res.status(404).json({message: "No entry found"})
      }
      
    })
    .catch(error => {
      res.status(500).json({error: error})
    })
}

exports.products_update_one = (req, res, next) => {
  const id = req.params.productID
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Product.updateOne({ _id: id }, { $set: updateOps})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`
        }
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: error})
    })
}

exports.products_delete_one = (req, res, next) => {
  const id = req.params.productID

  Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: `http://localhost:3000/products`
        }
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: error})
    })
  
}