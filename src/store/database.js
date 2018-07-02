import { Database } from '@vuex-orm/core'

import Company    from '@/models/company'
import Deal       from '@/models/deal'
import DealStore  from '@/models/deal-store'
import Mall       from '@/models/mall'
import Retailer   from '@/models/retailer'
import Store      from '@/models/store'

const database = new Database()

database.register(Company,    {})
database.register(Deal,       {})
database.register(DealStore,  {})
database.register(Mall,       {})
database.register(Retailer,   {})
database.register(Store,      {})

export default database
