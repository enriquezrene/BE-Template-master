const {Job, Profile, sequelize, Contract,} = require('../model')
const {Op, Sequelize} = require("sequelize");

const findUnpaidJobs = async (profile) => {
  const whereActiveContracts = {
    status: 'in_progress'
  }
  if (profile.type === 'client') {
    whereActiveContracts['ClientId'] = profile.id
  } else {
    whereActiveContracts['ContractorId'] = profile.id
  }
  const activeContracts = await Contract.findAll({
    attributes: ['id'],
    where: whereActiveContracts
  })
  const unpaidJobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true
      },
      ContractId: {
        [Op.in]: activeContracts.map(contract => contract.id)
      }
    }
  })
  return unpaidJobs
}

const payJob = async (jobIdToPay, clientId) => {
  const job = await Job.findOne({
    where: {
      id: jobIdToPay
    }
  })
  const amountToPay = job.price

  const client = await Profile.findOne({
    where: {
      id: clientId
    }
  })
  const clientBalance = client.balance

  const contractor = await Profile.findOne({
    where: {
      id: {
        [Op.in]: [Sequelize.literal(`SELECT ContractorId FROM Contracts WHERE id = ${job.ContractId}`)]
      }
    }
  })
  const contractorBalance = contractor.balance

  if (clientBalance < amountToPay) {
    throw new Error(`Client does not have enough money to pay for this job`)
  }
  if (job.paid === true) {
    throw new Error(`Job has been already paid`)
  }

  const transaction = await sequelize.transaction()
  try {
    client.balance = clientBalance - amountToPay
    await client.save({transaction})
    contractor.balance = contractorBalance + amountToPay
    await contractor.save({transaction})
    job.paid = true
    await job.save({transaction})
    await transaction.commit()
  } catch (e) {
    await transaction.rollback()
  }
}

module.exports = {
  findUnpaidJobs,
  payJob
}