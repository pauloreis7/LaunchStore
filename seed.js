const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')

let usersIds = []
let productsIds = []

let totalUsers = 3
let totalProducts = 10

async function createUsers() {
    const users = []

    const password = await hash('123', 8)

    while (users.length < totalUsers) {
    
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(99999),
            cep: faker.random.number(99999),
            address: faker.address.streetName()
        })
    }

    const usersPromise = await users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
}

async function createProducts() {
    const products = []

    while (products.length < totalProducts) {
        
        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            name: faker.name.title(),
            description: faker.lorem.paragraphs(Math.ceil(Math.random() * 5)),
            old_price: faker.random.number(999),
            price: faker.random.number(999),
            quantity: faker.random.number(999),
            status:  Math.round(Math.random())
        })
    }
    
    const productsPromise = await products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromise)
    
    let files = []
    while (files.length < 50) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
    }

    const filesPromise = await files.map(file => File.create(file))
    await Promise.all(filesPromise)
}

async function init() {
    await createUsers()
    await createProducts()
}

init()