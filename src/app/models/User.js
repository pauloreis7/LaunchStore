const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

const Product = require('../models/Product')

module.exports = {

    async findOne(filters) {

        let query = `SELECT * FROM users`

        Object.keys(filters).map((key) => {
            query = `${ query }
                ${ key }
            `
            Object.keys(filters[key]).map((field) => {
                query = `${ query }
                    ${field} = '${ filters[key][field] }'
                `
            })
        })

        const results = await db.query(query)

        return results.rows[0]
    },

    async create(data) {

        try {
            
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.address
            ]

            const results = await db.query(query, values)

            return results.rows[0].id

        } catch (err) {
            console.error(err)
        }
    },

    async update(id, fields) {

        let query = "UPDATE users SET"

        Object.keys(fields).map( (field, index, array) => {
            if ( (index + 1) < array.length ) {

                query= ` ${ query }
                    ${ field } = '${ fields[field] }',
                `
            } else {
                //  last iteration

                query = ` ${ query }
                    ${ field } = '${ fields[field] }'
                    WHERE id = ${ id }
                `
            }
        })

        await db.query(query)

        return
    },

    async delete(id) {

        let results = await db.query(`SELECT * FROM products WHERE user_id = ${ id }`)
        const products = results.rows

        const filesPromise = products.map(product => Product.file(product.id))
        const files = await Promise.all(filesPromise)
       
        results = await db.query(`DELETE FROM users WHERE id = ${ id }`)
        const user = results.rows

        files.map(result => {
            result.rows.map( file => {

                try {

                    fs.unlinkSync(file.path)

                } catch (err) {
                    console.error(err)
                }
            })
                        
        })
    }
}