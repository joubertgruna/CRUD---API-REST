const Sequelize = require('sequelize')
const conn = new Sequelize('db_api', 'root', '20IDEbrasil@20M',{
    host: '208.68.38.173', 
    dialect: 'mysql',
})

//Testando conexão com o banco 
conn
.authenticate()
.then( ()=> {
    console.log('database conected ...')
})

module.exports = conn
