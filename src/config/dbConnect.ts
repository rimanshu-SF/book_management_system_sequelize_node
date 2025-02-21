import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  `${process.env.DB_NAME}`,
  `${process.env.DB_USERNAME}`,
  `${process.env.DB_PASSWORD}`,
  {
    host: `${process.env.DB_HOST}`,
    dialect: 'mysql',
    logging: true
  }
)

import { defineAssociations } from './assosiation'
defineAssociations()

export { sequelize }

export async function dbConnect() {
  return sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
      return sequelize
    })
    .catch((error: any) => {
      console.error('Unable to connect to the database: ', error)
      throw error
    })
}
