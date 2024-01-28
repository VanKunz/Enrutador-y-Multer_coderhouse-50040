const express = require('express');
const fs = require('fs');

const cartsFilePath = 'carritos.json';

const router = express.Router();

router.post('/', (req, res) => {
  const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));

  const newCart = {
    id: carts.length + 1,
    products: [],
  };

  carts.push(newCart);

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

  res.json({ message: 'Carrito creado exitosamente', cart: newCart });
});

router.get('/:cid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
  const cart = carts.find(c => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  let carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
  let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

  const cart = carts.find(c => c.id === cartId);
  const product = products.find(p => p.id === productId);

  if (cart && product) {
    const existingProduct = cart.products.find(p => p.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        id: productId,
        quantity: 1,
      });
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    res.json({ message: 'Producto agregado al carrito correctamente', cart: cart.products });
  } else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

module.exports = router;
