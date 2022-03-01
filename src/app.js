const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const ContractService = require('./contracts/contracts-service')
const JobsService = require('./jobs/jobs-service')
const ClientService = require('./clients/clients-service')
const AdminService = require('./admin/admin-service')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, async (req, res) => {
  const profile = req.profile
  const {id} = req.params
  try {
    const contract = await ContractService.findContract(id, profile.type, profile.id)
    if (!contract) return res.status(404).end()
    res.json(contract)
  } catch (e) {
    res.status(400).json({error: e.message}).end()
  }
})

app.get('/contracts', getProfile, async (req, res) => {
  const profile = req.profile
  const contracts = await ContractService.findAllContracts(profile)
  res.status(200).json(contracts).end()
})

app.get('/jobs/unpaid', getProfile, async (req, res) => {
  const profile = req.profile
  const unpaidJobs = await JobsService.findUnpaidJobs(profile)
  res.status(200).json(unpaidJobs).end()
})

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
  const profile = req.profile
  const {job_id} = req.params
  try {
    await JobsService.payJob(job_id, profile.id)
    res.status(200).end()
  } catch (e) {
    res.status(400).json({error: e.message}).end()
  }
})

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  const profile = req.profile
  const {userId} = req.params
  const {amount} = req.body
  try {
    await ClientService.deposit(amount, profile.id, userId)
    res.status(200).end()
  } catch (e) {
    res.status(400).json({error: e.message}).end()
  }
})

// http://localhost:3001/admin/best-profession?start=2020-08-10&end=2021-08-10
app.get('/admin/best-profession', getProfile, async (req, res) => {
  const {start, end} = req.query
  try {
    const bestProfession = await AdminService.findBestProfession(start, end)
    res.status(200).json(bestProfession).end()
  } catch (e) {
    res.status(400).json({error: e.message}).end()
  }
})

app.get('/admin/best-clients', getProfile, async (req, res) => {
  const {start, end} = req.query
  const limit = req.query.limit ? req.query.limit : 2
  try {
    const bestClients = await AdminService.findBestClients(start, end, limit)
    res.status(200).json(bestClients).end()
  } catch (e) {
    res.status(400).json({error: e.message}).end()
  }
})

module.exports = app;
