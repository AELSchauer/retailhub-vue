import { Database } from '@vuex-orm/core'

import Company   from '@/models/company'
import companies from './modules/companies'
import Mall from '@/models/mall'
import malls from './modules/malls'

const database = new Database()

database.register(Mall, malls)
database.register(Company, companies)

export default database
