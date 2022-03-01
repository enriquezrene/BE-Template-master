const {sequelize,} = require('../model')
const {Sequelize} = require("sequelize");

const findBestClients = async (start, end, limit) => {
  const result = await sequelize.query(`select P.firstName, P.lastName, sum(j.price) as totalPaid
                                          from Jobs j join Contracts C on C.id = j.ContractId join Profiles P on C.ClientId = P.id
                                          where j.paid=true
                                          and j.paymentDate between '2020-08-10 00:00:00.000' AND '2021-08-10 23:59:00.000'
                                          group by C.ClientId
                                          order by totalPaid desc
                                          limit ${limit}`, {type: Sequelize.QueryTypes.SELECT})
  if (result.length > 0) {
    return result
  }
  return `No clients found with the specified criteria`
}

const findBestProfession = async (start, end) => {
  const result = await sequelize.query(`select P.profession
                                  from Jobs j join Contracts C on C.id = j.ContractId join Profiles P on C.ContractorId = P.id
                                  where j.paid=true
                                  and j.paymentDate between '${start} 00:00:00.000' AND '${end} 23:59:00.000'
                                  group by C.ContractorId
                                  order by sum(j.price) desc
                                  limit 1`, {type: Sequelize.QueryTypes.SELECT})
  if (result.length > 0) {
    return result[0].profession
  }
  return `No profession found with the specified criteria`
}

module.exports = {
  findBestProfession,
  findBestClients
}

