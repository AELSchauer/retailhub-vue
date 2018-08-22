import { Database } from '@vuex-orm/core'

import OrmModule    from '@/store/modules/orm'

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

database.register(Company,   OrmModule)
database.register(Deal,      OrmModule)
database.register(DealStore, {})
database.register(Image,     OrmModule)
database.register(Mall,      OrmModule)
database.register(Page,      OrmModule)
database.register(Retailer,  OrmModule)
database.register(Site,      OrmModule)
database.register(Store,     OrmModule)

export default database

