require('dotenv').config()
import cors from 'cors'
import express from 'express'
import { dbConnect, sequelize } from './src/config/dbConnect'
import {router as authorRoute} from './src/routes/author.route'
import { router as bookRoutes } from './src/routes/book.route'
import { router as categoryRoutes } from './src/routes/category.route'
import {router as authRoute} from './src/routes/auth.route'
import status from 'express-status-monitor'
// import { defineAssociations } from './src/config/assosiation'
import './src/config/passport';
import session from 'express-session'


const app = express()
const PORT = process.env.PORT || 4004
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(status())
dbConnect()
  .then(() => {
    ;(async () => {
      // defineAssociations();
      await sequelize
        .sync({alter:true})
        .then(() => {
          console.log('Sync successful')
        })
        .catch((err) => {
          console.error('Sync error:', err)
        })
    })()
    app.listen(PORT, () => {
      console.log(`🛞 Server Running on Port: ${PORT} 🛞`)
    })
  })
  .catch((err) => {
    console.log('💥💥 Database Connection Failed', err)
  })

app.use('/auth',authRoute );
app.use('/api/v1/book', bookRoutes) 
app.use('/api/v1/author', authorRoute)
app.use('/api/v1/category', categoryRoutes)    