const { Sequelize } = require('sequelize')
const { URI } = process.env
const sequelize = new Sequelize( URI ,{
    host: 'localhost',
    dialect: 'postgres',
    logging : false,
    pool: {
      max: 5, 
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  })

sequelize
.authenticate()
.then(()=> console.log('database is connected'))
.catch(err=> console.log(err.message))

module.exports = sequelize