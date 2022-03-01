const ContractsService = require('../contracts-service')

const contractorId = 5
const clientId = 1
const contractId = 1

test('Find a contract for the client', async () => {
  const contractFound = await ContractsService.findContract(contractId, 'client', clientId)
  expect(contractFound.terms).toEqual('bla bla bla')
});

test('If a contract does not belong to the client, throws an error', async () => {
  const clientOutOfContract = 2
  await expect(async () => ContractsService.findContract(contractId, 'client', clientOutOfContract)).rejects.toThrowError()
});

test('Find a contract for a contractor', async () => {
  const contractFound = await ContractsService.findContract(contractId, 'contractor', contractorId)
  expect(contractFound.terms).toEqual('bla bla bla')
});

test('If a contract does not belong to the contractor, throws an error', async () => {
  const contractorOutOfContract = 2
  await expect(async () => ContractsService.findContract(contractId, 'contractor', contractorOutOfContract)).rejects.toThrowError()
});

test('Return Contractor contracts', async () => {
  const contractorWithNoTerminatedContracts = 6
  const profile = { type: 'contractor', id: contractorWithNoTerminatedContracts}
  const contracts = await ContractsService.findAllContracts(profile)
  expect(contracts).toHaveLength(3)
});

test('Contracts terminated are not considered', async () => {
  const profile = { type: 'contractor', id: contractorId}
  const contracts = await ContractsService.findAllContracts(profile)
  expect(contracts).toHaveLength(0)
});