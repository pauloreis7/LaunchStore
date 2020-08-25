const Base = require('../models/Base')
const db = require('../../config/db')

Base.init({ table: "products" })

module.exports = {
    ...Base,

    file(id) {
        
        const results = db.query(`SELECT * FROM files WHERE product_id = ${ id }`)

        return results.rows
    },

    async search (params) {

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
        
        const results= await db.query(query)

        return results.rows
    }
}










// async delete(id) {

//     let results = await db.query(`SELECT * FROM files WHERE product_id = ${ id }`)
//     const files = results.rows

//     const filesPromise = files.map( file => File.delete(file.id) )
//     await Promise.all(filesPromise)

//     return db.query(`DELETE FROM products WHERE id = ${ id }`)
// }