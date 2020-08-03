const db = require('../../config/db')

const File = require('../models/File')

module.exports = {

    all() {
        
        return db.query(`SELECT * FROM products ORDER BY updated_at DESC`)
    },

    create(data) {

        const query = `
        INSERT INTO products(
            category_id,
            user_id,
            name,
            description,
            old_price,
            price,
            quantity,
            status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `

        data.price =  data.price.replace(/\D/g, "")

        const values = [
            data.category_id,
            data.user_id,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity,
            data.status || 1
        ]
        
        return db.query(query, values)
    },

    find (id) {

        return db.query(`SELECT * FROM products WHERE id = ${ id }`)
    },

    file(id) {
        
        return db.query(`SELECT * FROM files WHERE product_id = ${ id }`)

    },

    search (params) {

        const { search, category } = params

        let query = ``,
            filterQuery = `WHERE`

        if (category) {
            filterQuery = `${ filterQuery }
                products.category_id = ${ category }
                AND`
            }

        filterQuery = `
        ${ filterQuery }
            (products.name ilike '%${ search }%'
            OR products.description ilike '%${ search }%')
        `

        query = `
        SELECT products.*,
            categories.name as category_name
        FROM products
        LEFT JOIN categories ON ( categories.id = products.category_id )
        ${ filterQuery }
        `
        
        return db.query(query)
    },

    update(data) {

        const query = `
            UPDATE products SET
                category_id = ($1),
                name = ($2),
                description = ($3),
                old_price = ($4),
                price = ($5),
                quantity = ($6),
                status = ($7)
            WHERE id = ${ data.id }
        `

        const values = [
            data.category_id,
            data.name,
            data.description,
            data.old_price,
            data.price,
            data.quantity,
            data.status
        ]

        return db.query(query, values)
    },

    async delete(id) {

        let results = await db.query(`SELECT * FROM files WHERE product_id = ${ id }`)
        const files = results.rows

        const filesPromise = files.map( file => File.delete(file.id) )
        await Promise.all(filesPromise)

        return db.query(`DELETE FROM products WHERE id = ${ id }`)
    }
}