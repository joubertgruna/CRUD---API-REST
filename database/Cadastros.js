const Sequelize = require('sequelize')
const conn = require('./conn')

const Cadastros = conn.define('cadastros',{
    nome:{
        type: Sequelize.STRING,
        allownull: false
    },
    email:{
        type: Sequelize.STRING,
        allownull: false
    },
    celular:{
        type: Sequelize.STRING,
        allownull: false
    },
    funcaoEmpresa:{
        type: Sequelize.STRING,
        allownull: false
    },
    horario:{
        type: Sequelize.STRING,
        allownull: false
    },
    
})

//o sync sincroniza o conteúdo do arquivo para que eu possa exporta-lo
Cadastros.sync({force: false}).then(()=>{
    console.log('Tabela Cadastros criada...')
}) //Para quando a app for iniciada não sobreescrever os dados já gravados /  não recriar a tabela usa o {force: false}

module.exports = Cadastros