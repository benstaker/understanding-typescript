import 'reflect-metadata';
// import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { Product } from './product.model';

// const products = [
//     { title: 'A Carpet', price: 29.99 },
//     { title: 'A Book', price: 10.99 }
// ];
// const loadedProducts = plainToInstance(Product, products);
// for (const item of loadedProducts) {
//     console.log(item.getInformation());
// }

const newProd = new Product('', -5.99);
validate(newProd).then((errors) => {
    if (errors.length) {
        console.error('validation errors: ', errors);
    } else {
        console.log(newProd.getInformation());
    }
});
