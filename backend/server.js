require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ----- Connect to MongoDB -----
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));
// ----- Create Product Schema -----
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const Product = mongoose.model('Product', productSchema);

// ----- Routes -----

// GET all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD new product
app.post('/api/products', async (req, res) => {
  const { name, price, image } = req.body;
  const product = new Product({ name, price, image });
  await product.save();
  res.json({ message: "Product added", product });
});

// UPDATE product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  const product = await Product.findByIdAndUpdate(id, { name, price, image }, { new: true });
  if(product){
    res.json({ message: "Product updated", product });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: "Product deleted" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
