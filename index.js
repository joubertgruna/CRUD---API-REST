//Módulos npm 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
//Instânciando express / body-parser 
const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

//import conexão / Models da DB 
const conn = require('./database/conn')
const Cadastros = require('./database/Cadastros')



//Criando um registro
app.post('/cadastro',(req, res)=>{ //definindo a rota 
    // definindo as variáveis 
    var nome = req.body.nome
    var email = req.body.email
    var celular = req.body.celular
    var funcaoEmpresa = req.body.funcaoEmpresa
    var horario = req.body.horario
    var createdAt = req.body.createdAt
    var updatedAt = req.body.updatedAt

    Cadastros.create({ //Salvando os dados no banco de dados usando a função create
        nome: nome,
        email: email,
        celular: celular,
        funcaoEmpresa: funcaoEmpresa,
        horario: horario,
        createdAt: createdAt,
        updatedAt: updatedAt,
    })
    .then((cadastro)=>{ //Recebendo os dados cadastrados atraves da função create e passando eles para cadastro

        //Verifica se os dados obrigatórios foram enviados 
        if(cadastro.nome == '' && cadastro.email == '' && cadastro.celular == '' && cadastro.funcaoEmpresa == '' && cadastro.horario == ''){
            res.statusCode = 405
            res.json({
                erro: "Erro 405 - Dados não enviados"
            })
        //Verifica se os dados não vieram vazios
        }else if(cadastro.nome != '' && cadastro.email != '' && cadastro.celular != '' && cadastro.funcaoEmpresa != '' && cadastro.horario != ''){
                res.statusCode = 201; //Retorna status sucesso dados inseridos no banco
                res.json(cadastro)//Retorna json com os dados cadastrados para o front
            }   
            //verifica se todos os campos obrigatórios foram preenchidos 
            else if(cadastro.nome == '' || cadastro.email == '' || cadastro.celular == '' || cadastro.funcaoEmpresa == '' || cadastro.horario == ''){
                res.statusCode = 400
                res.json({
                erro: 'Erro 400 - Dado incompleto'
            })
            }
        }

    )           
        
})

//listando todos os cadastros
app.get('/cadastros', (req, res)=>{ //criando a rota 
   Cadastros.findAll({ //Buscando todos os dados no banco 
      row: true, 
      order:[['id','DESC']]
    })
  .then((cadastros)=> {//Retorno do dados da function finsAll para a var cadastros
      res.statusCode = 200 //Retorno código de sucesso
      var list = cadastros 
      res.json(list)
  })
})

//listando um único cadastro
app.get('/cadastro/:id?',(req, res)=>{ //Definindo rota e passando parametro
    var id = req.params.id //pegando o parametro id passado via url e add na var id
if(id != undefined){ //verifica se foi passado algum dado no parametro id
    if(isNaN(id)){ // Verifica se o é um número se não for cai aqui 
        res.StatusCode = 700
        res.json({erro: 'Erro 700 - ID Inválida'})
    }else{
        Cadastros.findAll({//Busca todos os dados da tabela cadastros
            where:{ //Onde o id for igual o id passado no parametro
                id: id, 
            }
        }).then((cadastro)=>{//Passando os dados da função findAll para a var cadastro 
            if(cadastro == ''){//Verifica se o cadastro veio vazio caio aqui 
                res.StatusCode = '600 - Dados não encontrados'
                res.json({erro: '600 - Dados não encontrados'})
            }else if(cadastro.id == cadastro.id){ //Verifica se o id passado é igual o id já existente no banco 
            var listUser = cadastro //passando os dados da var cadastro para a var listuser
            res.json(listUser)//enviando lista no formato json para o end point solicitado
            }
        })
    }
    }
})

//Editar Registros
app.put('/cadastro/:id?',(req, res)=>{

    //Definindo as variaveis 
    var id = req.body.id
    var nome = req.body.nome
    var email = req.body.email
    var celular = req.body.celular
    var funcaoEmpresa = req.body.funcaoEmpresa
    var horario = req.body.horario

if(id != undefined){ //Verificando se de fato foi passado algúm dado para a ID
    
    if(isNaN(id)){ //Se foi passado, verificando se o dado é numérico, se não for cai nessa condição
        res.StatusCode = 700 //Enviando código de status 700
        res.send('Erro 700 - ID Inválida') //Enviando resposta para o front-end
    }else{ //Se o ID for de fato numérico
        // Cadastros.findAll({ //Buscando todos os dados no banco 
        //     row: true, //retornando linha por linha 
        //     order:[['id','DESC']] //ordenando pela do maior para o menor 
        // })
        Cadastros.update({ //Chamando a model cadastros e especificado quais os campos podem ser atualizados
            nome: nome,
            email: email,
            celular: celular,
            funcaoEmpresa: funcaoEmpresa,
            horario: horario,
        },{ //E aqui eu especifco onde eu quero atualizar os dados com base no identificador passado
            where:{
                id: id
            }
        })
        .then((cadastro)=>{ //Recebendo o retorno da atualização dos dados e passando para a var cadastro
            if(cadastro){// Se os dados foram editados
                res.statusCode = 200 //Envia código de status sucesso 
                res.json({sucesso: 'Sucesso 200 - Dado editado', cadastro})
            }else if(cadastro == ''){//Se não se o retorno do cadastro veio em vazio 
                res.statusCode = 600//Envia código de status erro
                res.json({erro: 'Erro 600 - Dado não encontrado'})//Envia resposta para o front-end
            }
        })
    }
}else{ // Se a id não contiver nem um dado sendo passado cai nessa condição
    res.StatusCode = 700 //Enviando código de status erro
    res.json({erro: 'Erro 700 - ID Inválida'})
}

})

//Deletar Registros 
app.delete('/cadastro/:id?',(req, res)=>{
    //Definindo a minha variável 
    var id = req.params.id

    if(id != undefined){ // verificando se foi passado de fato algum dado pra variável id 

        if(isNaN(id)){ //Se caso a var id tiver dados nela, eu verifico se os dados são numéricos, se não forem caem nessa condição
            res.statusCode = 700
            res.json({erro: 'Erro 700 - ID Inválido.'})
        }else{ // Se não o id é um número e cai dentro dessa condição 
            Cadastros.destroy({ // E então chamo a model cadastro, utilizando o metodo destroy para deletar o id do banco for igual ao id passado
                where:{
                    id: id
                }
            })
            .then((delCadastro)=>{//Recebendo os dados apagados com o metodo destroy, e passando para a vaiável delCadastros
                console.log('ID Deletado: ', id) //imprimindo no console os dados que foram apagados no indice especificado
                if(delCadastro){ //Cai nessa condição quando os dados são deletados
                    res.statusCode = 200 //Envia o código de status 
                    res.json({sucesso: `Sucesso - Dado deletado: ${delCadastro}`}) //Resposta json para o requisição do fron-end
                }else{
                    res.statusCode = 600
                    res.json({erro: "Erro 600 - Dado não encontrado"})
                }
            })
        }
    }
})

    
//Rota principal do app
app.get('/', (req, res)=>{ //Definindo a rota principal 
    res.StatusCode = 200 //Enviando código de satus 
    res.send('Sucesso - API Iniciada;')//Enviando resposta para o front-end 
})

//iniciando o servidor 
app.listen(3000, (erro)=>{ //Definindo a porta de escuta do servidor e passando variável erro
    if(erro){  // Se acontecer algum erro cai nessa condição
        console.log('Erro - Internal server error 500!')//Enviando codigo de status 500
    }else{ // Se não acontecer erro nem um cai nessa condição
        console.log('Sucesso - Status code 200') // Enviando código de satus 200
    }
})