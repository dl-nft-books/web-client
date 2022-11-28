import { JsonApiRecordBase } from '@/types/api'

export type Platform = JsonApiRecordBase<'platforms'> & {
  chain_identifier: number
  name: string
  shortname: string
}
