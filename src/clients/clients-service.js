const {Job, Contract, Profile, sequelize,} = require('../model')
const {Op} = require("sequelize");

const deposit = async (amount, clientId, userToDeposit) => {
  const activeClientContracts = await Contract.findAll({
    where: {
      ClientId: clientId,
      status: {
        [Op.in]: ['in_progress', 'new']
      }
    }
  })
  const unpaidJobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true
      },
      ContractId: {
        [Op.in]: activeClientContracts.map((contract) => contract.id)
      }
    }
  })
  const totalAmountToPay = unpaidJobs.map(job => job.price).reduce((val1, val2) => val1 + val2, 0)
  if (amount > (totalAmountToPay / 4)) {
    throw new Error(`Client can not deposit more than 25% total of jobs to pay`)
  }
  const transaction = await sequelize.transaction()
  try {
    const clientToDebit = await Profile.findByPk(clientId)
    clientToDebit.balance -= amount
    const clientToRetrieveMoney = await Profile.findByPk(userToDeposit)
    clientToRetrieveMoney.balance += amount
    await clientToRetrieveMoney.save({transaction})
    await clientToDebit.save({transaction})
    await transaction.commit()
  } catch (e) {
    await transaction.rollback()
  }
}

module.exports = {
  deposit
}

