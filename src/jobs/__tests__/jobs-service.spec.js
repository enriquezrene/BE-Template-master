const JobService = require('../jobs-service')
const {Job, Profile} = require("../../model")

test('Find unpaid jobs for a client', async () => {
  const profile = {type: 'client', id: 1}
  const unpaidJobs = await JobService.findUnpaidJobs(profile)
  expect(unpaidJobs).toHaveLength(1)
})

test('Find unpaid jobs for a contractor', async () => {
  const profile = {type: 'contractor', id: 6}
  const unpaidJobs = await JobService.findUnpaidJobs(profile)
  expect(unpaidJobs).toHaveLength(2)
})

test('When a job is paid, the balance from the client is transferred to the contractor', async () => {
  const clientId = 1
  const jobToPay = 3
  const job = await Job.findOne({where: {id: jobToPay}})
  const jobPrice = job.price
  const client = await Profile.findOne({where: {id: clientId}})
  const originalClientBalance = client.balance
  const contractor = await Profile.findOne({where: {id: 6}})
  const originalContractorBalance = contractor.balance

  await JobService.payJob(jobToPay, clientId)

  await client.reload()
  expect(client.balance).toBe(originalClientBalance - jobPrice)
  await contractor.reload()
  expect(contractor.balance).toBe(originalContractorBalance + jobPrice)
  await job.reload()
  expect(job.paid).toBe(true)
})