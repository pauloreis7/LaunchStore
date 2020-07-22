const db = require('../../config/db')

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
            data.user_id || 1,
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

        let query = ""
            filterQuery = 'WHERE'

        if (category) {
            filterQuery = `
                ${ filterQuery }
                product.category_id = ${ category_id }
                AND
            `
        }

        filterQuery = `
            ${ filterQuery }
            product.name ilike '% ${ search } %'
            OR product.description ilike '% ${ search } %'
        `

        let totalQuery = `(
        
            SELECT count(*) FROM products
            ${ filterQuery }
        
        ) AS total`

        query = `
            SELECT products.*, ${ totalQuery },
                categories.name AS category_name
            FROM products
            LEFT JOIN ON ( categories.id = products.category_id )
            ${ filterQuery }
            GROUP BY products.id, categories.name
        `

        return db.query(query)
    },

    update(data) {

        const query = `
            UPDATE products SET
                category_id = ($1),
                user_id = ($2),
                name = ($3),
                description = ($4),
                old_price = ($5),
                price = ($6),
                quantity = ($7),
                status = ($8)
            WHERE id = ${ data.id }
        `

        const values = [
            data.category_id,
            data.user_id,
            data.name,
            data.description,
            data.old_price,
            data.price,
            data.quantity,
            data.status
        ]

        return db.query(query, values)
    },

    delete(id) {

        return db.query(`DELETE FROM products WHERE id = ${ id }`)
    }
}