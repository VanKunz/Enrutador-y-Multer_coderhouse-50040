const express = require('express');
const multer = require('multer');
const fs = require('fs');

const productsFilePath = 'productos.json';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', upload.array('thumbnails', 3), (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

  const newProduct = {
    id: products.length + 1,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: parseFloat(req.body.price),
    status: req.body.status === 'true',
    stock: parseInt(req.body.stock),
    category: req.body.category,
    thumbnails: req.files.map(file => file.filename),
  };

  products.push(newProduct);

  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

  res.json({ message: 'Producto agregado exitosamente', product: newProduct });
});

router.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      title: req.body.title || products[productIndex].title,
      description: req.body.description || products[productIndex].description,
      code: req.body.code || products[productIndex].code,
      price: req.body.price ? parseFloat(req.body.price) : products[productIndex].price,
      status: req.body.status !== undefined ? req.body.status === 'true' : products[productIndex].status,
      stock: req.body.stock ? parseInt(req.body.stock) : products[productIndex].stock,
      category: req.body.category || products[productIndex].category,
      thumbnails: req.files ? req.files.map(file => file.filename) : products[productIndex].thumbnails,
    };

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

    res.json({ message: 'Producto actualizado correctamente', product: products[productIndex] });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
  products = products.filter(p => p.id !== productId);

  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

  res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;
