interface mapversiontype {
  [key: string]: mapitem
}
interface mapitem {
  version1: string
  version2: string
  memo_zh?: string
  memo_en?: string
}

// 👇️ this will only ever be one of object's keys
interface dtype {
  [key: string]: any
}
const MAPVERSION: mapversiontype = {
  HK: {
    version1: '20210617',
    version2: '20221212',
    memo_zh: '臨時封閉',
    memo_en: 'temporarily closed'
  },
  MO: {
    version1: '20210714',
    version2: '20230113',
    memo_zh: '封閉交通',
    memo_en: ''
  }
}
const DEFAULTKEYS: Array<string> = [
  'heading_zh',
  'heading_en',
  'content_zh',
  'content_en',
  'type_code',
  'cause_code',
  'source_id',
  'shown_now',
  'announcement_time',
  'road_version',
  'created_at',
  'updated_at',
  'start_time',
  'end_time'
]
const DEFAULTVALUE: dtype = {
  shown_now: false,
  cause_code: 103,
  type_code: 1,
  source_id: 4
}
export { MAPVERSION, DEFAULTVALUE, DEFAULTKEYS }
