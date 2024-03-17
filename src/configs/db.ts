import mongoose from 'mongoose'

class Database {
  private static instance: Database
  private uri: string
  public db: mongoose.Connection

  private constructor() {
    this.uri = `mongodb+srv://nexa-verse:nexaverse-anhdev2k1@nexa-verse.9sr4erv.mongodb.net/?retryWrites=true&w=majority&appName=nexa-verse`

    this.db = mongoose.createConnection(this.uri, {
      maxPoolSize: 10
    })

    this.db.on('open', () => console.log('Connected to mongoDB server successfully'))
    this.db.on('error', (error) => console.error('Connection failed', error))
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

const instanceDB = Database.getInstance()
export default instanceDB.db
