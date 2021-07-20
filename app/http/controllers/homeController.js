const Menu = require('../../models/menu')

function homeController () {
    return {
        
        async home(req,res) {

            const items = await Menu.find()
            return res.render('home', { items: items }) 
        }
    }
}

module.exports = homeController