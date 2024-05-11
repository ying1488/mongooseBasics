const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shopApp')
  .then(() => {
    console.log("connection open!!")
  })
  .catch(err => {
    console.log("OH no error!")
    console.log(err)
  })


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive ya dodo!']
  },
  onSale: {
    type: Boolean,
    default: false
  },
  categories: [String],
  qty: {
    online: {
      type: Number,
      default: 0
    },
    inStore: {
      type: Number,
      default: 0
    }
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L']
  }

});

// productSchema.methods.greet = function () {
//     console.log("HELLLO!!! HI!! HOWDY!!! ")
//     console.log(`- from ${this.name}`)
// }

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save();
}
productSchema.methods.addCategory = function (newCat) {
  this.categories.push(newCat);
  return this.save();
}
productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 })
}

const Product = mongoose.model('Product', productSchema);


const findProduct = async () => {
  const foundProduct = await Product.findOne({ name: 'Mountain Bike' });
  console.log(foundProduct)
  await foundProduct.toggleOnSale();
  console.log(foundProduct)
  await foundProduct.addCategory('Outdoors')
  console.log(foundProduct)
}

// Product.fireSale().then(res => console.log(res))

findProduct();
