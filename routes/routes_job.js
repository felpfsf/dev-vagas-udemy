// Criando uma rota para adicionar dados ao BD via sequelize
const express = require('express')
const router = express.Router()
const Job = require('../models/Job')

// rota para teste
router.get('/test', (req, res) => {
  res.send('funcionou')
})

// rota de detalhe para a vaga
// se guiará pelo id correspondente à vaga
router.get('/view/:id', (req, res) =>
  // findOne busca apenas um registro do banco baseado no id
  Job.findOne({
    where: { id: req.params.id }
  })
    .then(job => {
      // renderiza a view com o job como parâmetro
      // o job é a vaga selecionada
      res.render('view', { job })
    })
    .catch(err => console.log(err))
)

// rota do formulário para enviar dados
router.get('/add', (req, res) => {
  res.render('add')
})

// adicionar vaga via método post
router.post('/add', (req, res) => {
  let { title, description, salary, company, email, new_job } = req.body
  // insert
  Job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router
