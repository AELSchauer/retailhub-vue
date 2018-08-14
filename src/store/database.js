import { Database } from '@vuex-orm/core'

import Company    from '@/models/company'
import Deal       from '@/models/deal'
import DealStore  from '@/models/deal-store'
import Image      from '@/models/image'
import Mall       from '@/models/mall'
import Page       from '@/models/page'
import Retailer   from '@/models/retailer'
import Site       from '@/models/site'
import Store      from '@/models/store'

const database = new Database()

database.register(Company,    {})
database.register(Deal,       {})
database.register(DealStore,  {})
database.register(Image,      {})
database.register(Mall,       {})
database.register(Page,       {})
database.register(Retailer,   {})
database.register(Site,       {})
database.register(Store,      {})

export default database
