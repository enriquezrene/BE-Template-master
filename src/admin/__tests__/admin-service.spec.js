const AdminService = require('../admin-service')

test('Best profession on 2020-08-10 is Musician', async () => {
  const bestProfession = await AdminService.findBestProfession('2020-08-10', '2020-08-10')

  expect(bestProfession).toBe('Musician')
})

test('Best profession between 2020-08-10 and 2021-08-10 is Programmer', async () => {
  const bestProfession = await AdminService.findBestProfession('2020-08-10', '2021-08-10')

  expect(bestProfession).toBe('Programmer')
})


test('Best clients between 2020-08-10 and 2021-08-10 are Ash Kethcum, Mr Robot, Harry Potter, Jhon Snow', async () => {
  const bestClients = await AdminService.findBestClients('2020-08-10', '2021-08-10', 4)

  expect(bestClients).toEqual([{
    "firstName": "Ash",
    "lastName": "Kethcum",
    "totalPaid": 2020,
  },
    {
      "firstName": "Mr",
      "lastName": "Robot",
      "totalPaid": 442,
    },
    {
      "firstName": "Harry",
      "lastName": "Potter",
      "totalPaid": 442,
    },
    {
      "firstName": "John",
      "lastName": "Snow",
      "totalPaid": 200,
    },])
})

test('Best clients queried can be limited', async () => {
  const bestClients = await AdminService.findBestClients('2020-08-10', '2021-08-10', 1)

  expect(bestClients).toEqual([{
    "firstName": "Ash",
    "lastName": "Kethcum",
    "totalPaid": 2020,
  }])
})