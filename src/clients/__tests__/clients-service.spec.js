const ClientService = require('../clients-service')
const {Profile} = require("../../model");

test('Client can not deposit more than 25% of pending payments', async () => {
  await expect(async () => ClientService.deposit(1000000, 1, 2)).rejects.toThrowError()
})

test('Client can deposit less than 25% of pending payments', async () => {
  const clientId = 1
  const clientDepositingMoney = await Profile.findByPk(clientId)
  const clientDepositingMoneyInitialBalance = clientDepositingMoney.balance
  const clientIdToRetrieveMoney = 2
  const clientToRetrieveMoney = await Profile.findByPk(clientIdToRetrieveMoney)
  const originalBalance = clientToRetrieveMoney.balance
  const amountToDeposit = 1

  await ClientService.deposit(amountToDeposit, clientId, clientIdToRetrieveMoney)

  await clientToRetrieveMoney.reload()
  expect(clientToRetrieveMoney.balance).toBe(originalBalance + amountToDeposit)
  await clientDepositingMoney.reload()
  expect(clientDepositingMoney.balance).toBe(clientDepositingMoneyInitialBalance - amountToDeposit)
})
