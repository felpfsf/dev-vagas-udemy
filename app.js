const express = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const app = express()
const { create } = require('express-handlebars')
const { Router, query } = require('express')
const path = require('path')
const db = require('./db/connection')
const bodyParser = require('body-parser')
const Job = require('./models/Job')

const PORT = 3000

app.listen(PORT, function () {
  console.log(`O Express está rodando na porta ${PORT}`)
})

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

// handlebars
const exphbs = create({ defaultLayout: 'main' })
// diretório onde está localizado os templates do projeto
app.set('views', path.join(__dirname, 'views'))
// layout principal
app.engine('handlebars', exphbs.engine)
app.set('view engine', 'handlebars')

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// db connection
db.authenticate()
  .then(() => {
    console.log('Conectou ao banco com sucesso')
  })
  .catch(err => {
    console.log('Ocorreu um erro ao conectar')
  })

// rotas
app.get('/', (req, res) => {
  
  let searchJob = req.query.job
  // Mesmo que o usuário digite a palavra incompleta o query tratará de
  // buscar os dados que contenham a palara, exemplo:
  // ph => retorna PHP
  // press ou word => Wordpress
  let query = '%' + searchJob + '%'

  // Essa condicional verifica se há parâmetro de searchJob
  // caso não haja exibe toda a lista de vaga
  if (!searchJob) {
    // chamando todos os dados do banco
    // organiza em modo decrescente mostrando o último registro primeiro
    // renderiza a view com os dados
    Job.findAll({ order: [['createdAt', 'DESC']] })
      .then(jobs => {
        // res.send('Express rodando normalmente 3')
        res.render('index', { jobs })
      })
      .catch(err => console.log(err))
  } else {
    // Caso o usuário busque por uma vaga
    // retornaremos as vagas com palavras semelhantes
    Job.findAll({
      where: { title: { [Op.like]: query } },
      order: [['createdAt', 'DESC']]
    })
      .then(jobs => {
        res.render('index', { jobs, searchJob })
      })
      .catch(err => console.log(err))
  }
})

// rota jobs
app.use('/jobs', require('./routes/routes_job'))
