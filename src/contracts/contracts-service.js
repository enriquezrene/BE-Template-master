const {Contract} = require('../model')
const {Op} = require("sequelize");

const findContract = async (contractId, profileType, profileId) => {
  const contractFound = await Contract.findOne({
    where: {
      id: contractId
    }
  })
  let doesContractBelongToUser = false
  if (contractFound) {
    if (profileType === 'client') {
      doesContractBelongToUser = contractFound.ClientId === profileId
    } else {
      doesContractBelongToUser = contractFound.ContractorId === profileId
    }
    if (!doesContractBelongToUser) {
      throw new Error(`Contract ${contractId} does not belong to logged in user`)
    }
  }
  return contractFound
}

const findAllContracts = async (profile) => {
  const where = {
    status: {
      [Op.notIn]: ['terminated']
    }
  }
  if (profile.type === 'client') {
    where['ClientId'] = profile.id
  } else {
    where['ContractorId'] = profile.id
  }
  return await Contract.findAll({
    where
  })
}
module.exports = {
  findContract,
  findAllContracts
}