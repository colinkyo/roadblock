<template>
  <div class="page" id="pageui">
    <van-form>
      <van-row justify="center">
        <van-col span="24">
          <van-cell-group>
            <van-field name="radio" label="地区选择">
              <template #input>
                <van-radio-group v-model="radiochecked" direction="horizontal">
                  <van-radio name="HK">香港</van-radio>
                  <van-radio name="MO">澳门</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              label="中文标题"
              placeholder="中文标题"
              v-model="heading_zh"
              :clearable="true"
            ></van-field>
            <van-field
              label="英文标题"
              placeholder="英文标题"
              :clearable="true"
              v-model="heading_en"
            ></van-field>
            <van-field
              label="中文内容"
              placeholder="中文内容"
              :clearable="true"
              v-model="content_zh"
            ></van-field>
            <van-field
              label="英文内容"
              placeholder="英文内容"
              :clearable="true"
              v-model="content_en"
            ></van-field>
          </van-cell-group>
        </van-col>
      </van-row>
      <van-row justify="center" gutter="10">
        <van-col span="6">
          <van-popover v-model:show="showPopover" placement="bottom-start">
            <van-calendar
              ref="dateref"
              type="range"
              first-day-of-week="1"
              :allow-same-day="true"
              title="日历"
              :poppable="false"
              @confirm="onConfirm"
              :style="{ height: '400px', width: '500' }"
            />
            <template #reference>
              <van-field
                :clearable="true"
                label="选择日期"
                placeholder="选择日期"
                title="选择日期"
                v-model="date"
                @clear="cleardate"
              ></van-field>
            </template>
          </van-popover>
        </van-col>
        <van-col span="3"
          ><van-popover v-model:show="showsTime" placement="bottom">
            <van-datetime-picker
              v-model="currentTime"
              type="time"
              :filter="filter"
              @confirm="timesConfirm"
              @cancel="timesCancel"
            />
            <template #reference>
              <van-field
                :clearable="true"
                label="开始时间"
                placeholder="开始时间"
                title="开始时间"
                v-model="dstime"
              ></van-field>
            </template> </van-popover
        ></van-col>
        <van-col span="3"
          ><van-popover v-model:show="showeTime" placement="bottom">
            <van-datetime-picker
              v-model="currentTime"
              type="time"
              :filter="filter"
              @confirm="timeeConfirm"
              @cancel="timeeCancel"
            />
            <template #reference>
              <van-field
                :clearable="true"
                label="结束时间"
                placeholder="结束时间"
                title="结束时间"
                v-model="detime"
              ></van-field>
            </template> </van-popover
        ></van-col>
        <van-col span="3">
          <van-field name="checkbox" label="非连续" label-align="center">
            <template #input>
              <van-checkbox v-model="checked" shape="square">选中</van-checkbox>
            </template>
          </van-field>
        </van-col>
        <van-col span="9">
          <van-popover v-model:show="showexPopover" placement="bottom-start">
            <van-calendar
              ref="exdateref"
              type="multiple"
              title="日历"
              first-day-of-week="1"
              :poppable="false"
              @confirm="onexConfirm"
              :style="{ height: '400px', width: '500' }"
            />
            <template #reference>
              <van-field
                :clearable="true"
                label="排除日期"
                placeholder="排除日期"
                title="排除日期"
                v-model="exdate"
                @clear="clearexdate"
              ></van-field>
            </template> </van-popover
        ></van-col>
      </van-row>
    </van-form>
    <div style="margin: 16px">
      <van-button
        type="primary"
        native-type="submit"
        size="large"
        @click="createsql"
      >
        生成SQL语句
      </van-button>
    </div>
    <van-row justify="center">
      <van-col span="24">
        <div style="padding-left: 16px">
          <van-button type="danger" class="btn" id="btn" @click="copysql"
            >复制生成的SQL</van-button
          >
          <div id="bar" v-html="textsql"></div>
        </div>
      </van-col>
    </van-row>
    <!-- <van-button
      class="btn"
      data-clipboard-action="cut"
      data-clipboard-target="#bar"
      @click="copysql"
    > -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Col, Row, Button, Checkbox, RadioGroup, Radio } from 'vant'
import { Form, Field, CellGroup } from 'vant'
import { Cell, Calendar, Popover } from 'vant'
import { DatetimePicker, Toast } from 'vant'
import type { CalendarInstance } from 'vant'

import Clipboard from 'clipboard'

import { ref } from 'vue'

import { MAPVERSION, DEFAULTVALUE } from './config/config'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(utc)

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const S_DATE_TIME_FORMAT = 'YYYY-MM-DD'

const today = dayjs().utcOffset(0).format(DATE_TIME_FORMAT)

export default defineComponent({
  components: {
    [Col.name]: Col,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Button.name]: Button,
    [Row.name]: Row,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Calendar.name]: Calendar,
    [Cell.name]: Cell,
    [Popover.name]: Popover,
    [DatetimePicker.name]: DatetimePicker,
    [Toast.name]: Toast
  },
  setup() {
    //日历组件实例
    const exdateref = ref<CalendarInstance>()
    const dateref = ref<CalendarInstance>()

    const textsql = ref('以后这里就是生成SQL啊。。。。。')
    const heading_zh = ref('')
    const heading_en = ref('')
    const content_zh = ref('')
    const content_en = ref('')
    const date = ref('')
    const exdate = ref('')
    const show = ref(false)
    const checked = ref(false)
    const radiochecked = ref('HK')
    const showPopover = ref(false)
    const showexPopover = ref(false)
    const dstime = ref('')
    const detime = ref('')
    const showsTime = ref(false)
    const showeTime = ref(false)
    const currentTime = ref('12:30')

    const textsqltmp =
      'insert into tec_geo_prepare(heading_zh,heading_en,content_zh,content_en,type_code,cause_code,source_id,shown_now,announcement_time,road_version,created_at,updated_at,start_time,end_time)'

    //时间选择步长设置
    const filter = (type: string, options: []) => {
      if (type === 'minute') {
        return options.filter((option) => Number(option) % 5 === 0)
      }
      return options
    }

    const formatDate = (date: any) => {
      //return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      return dayjs(date).format(S_DATE_TIME_FORMAT)
    }
    const onConfirm = (dates: any) => {
      const [start, end] = dates
      dates.map(function (item: Date) {
        console.log(formatDate(item)) // 1
      })
      // show.value = false
      showPopover.value = false
      date.value = `${formatDate(start)}至${formatDate(end)}`
    }
    const onexConfirm = (dates: any) => {
      showexPopover.value = false
      const tmpdate: Array<string> = []
      dates.map(function (item: Date) {
        tmpdate.push(formatDate(item)) // 1
      })
      exdate.value = tmpdate.join(',')
    }

    const timesCancel = () => {
      showsTime.value = false
    }
    const timesConfirm = (value: any) => {
      console.log(value)
      showsTime.value = false
      dstime.value = value
    }

    const timeeCancel = () => {
      showeTime.value = false
    }
    const timeeConfirm = (value: any) => {
      console.log(value)
      showeTime.value = false
      detime.value = value
    }

    const clearexdate = () => {
      showexPopover.value = false
      exdateref.value?.reset()
    }

    const cleardate = () => {
      showPopover.value = false
      dateref.value?.reset()
    }
    const createsql = () => {
      //insert into tec_geo_prepare(heading_zh,heading_en,content_zh,content_en,type_code,cause_code,source_id,shown_now,announcement_time,road_version,created_at,updated_at,start_time,end_time)
      //values ('啊','吧','1臨時封閉','2 temporarily closed',1,103,4,false,timestamp '2022-05-19 01:00:00','20200721',timestamp '2022-05-19 01:00:00',timestamp '2022-05-19 01:00:00',timestamp '2020-08-12 12:00',timestamp '2020-08-15 02:00');

      const sqltpl = ref(
        `insert into tec_geo_prepare(heading_zh,heading_en,content_zh,content_en,type_code,cause_code,source_id,shown_now,announcement_time,road_version,created_at,updated_at,start_time,end_time) values("#heading_zh#","#heading_en#","#content_zh#","#content_en#",#type_code#,#cause_code#,#source_id#,#shown_now#,#announcement_time#,"#road_version#",#created_at#,#updated_at#,#start_time#,#end_time#);<br/>`
      )
      const extversion = ref()

      sqltpl.value = sqltpl.value.replace('#heading_zh#', heading_zh.value)
      sqltpl.value = sqltpl.value.replace(
        '#heading_en#',
        heading_en.value.replace("'", "''")
      )
      sqltpl.value = sqltpl.value.replace('#content_zh#', content_zh.value)
      sqltpl.value = sqltpl.value.replace(
        '#content_en#',
        content_en.value.replace("'", "''")
      )

      sqltpl.value = sqltpl.value.replace(
        '#type_code#',
        DEFAULTVALUE['type_code']
      )
      sqltpl.value = sqltpl.value.replace(
        '#cause_code#',
        DEFAULTVALUE['cause_code']
      )
      sqltpl.value = sqltpl.value.replace(
        '#source_id#',
        DEFAULTVALUE['source_id']
      )
      sqltpl.value = sqltpl.value.replace(
        '#shown_now#',
        DEFAULTVALUE['shown_now']
      )
      sqltpl.value = sqltpl.value.replace('#announcement_time#', today)
      sqltpl.value = sqltpl.value.replace('#created_at#', today)
      sqltpl.value = sqltpl.value.replace('#updated_at#', today)

      textsql.value = ''
      //开始复制
      if (checked.value) {
        //非连续, 找出时间段的所有日期
        const datezone = date.value.split('至')
        const dtlen = dayjs(datezone[1]).diff(datezone[0], 'day')
        const exdateArr: Array<string> = exdate.value.split(',')
        for (let i = 0; i <= dtlen; i++) {
          const currdate = dayjs(datezone[0])
            .add(i, 'day')
            .format(S_DATE_TIME_FORMAT)
          //非连续不在排除日期内
          if (exdateArr.indexOf(currdate) === -1) {
            const nextdate = dayjs(datezone[0])
              .add(i, 'day')
              .format(S_DATE_TIME_FORMAT)

            const start_time = dayjs(currdate + ' ' + dstime.value)
              .utcOffset(0)
              .format(DATE_TIME_FORMAT)
            const end_time = dayjs(nextdate + ' ' + detime.value)
              .utcOffset(0)
              .format(DATE_TIME_FORMAT)

            //复制模版这里有点不同，需要每次都不同时间
            extversion.value = sqltpl.value
            extversion.value = extversion.value.replace(
              '#start_time#',
              start_time
            )
            extversion.value = extversion.value.replace('#end_time#', end_time)
            extversion.value = extversion.value.replace(
              '#road_version#',
              MAPVERSION[radiochecked.value].version1
            )
            textsql.value += extversion.value

            extversion.value = sqltpl.value
            extversion.value = extversion.value.replace(
              '#start_time#',
              start_time
            )
            extversion.value = extversion.value.replace('#end_time#', end_time)
            extversion.value = extversion.value.replace(
              '#road_version#',
              MAPVERSION[radiochecked.value].version2
            )
            textsql.value += extversion.value
          } else {
            //非连续，在排除日期内
            console.log('指定元素： ' + currdate + ' 在数组中')
          }
        }
      } else {
        const exdateArr: Array<string> = exdate.value.split(',')
        const datezone = date.value.split('至')

        //找出要排除的有效日期数组
        dayjs.extend(isBetween)
        const newexdateArr = exdateArr
          .sort()
          .filter((item) =>
            dayjs(item).isBetween(datezone[0], datezone[1], 'day')
          )
        if (newexdateArr.length) {
          //连续,有排除日期
          for (let i = 0; i < newexdateArr.length; i++) {
            const predate = dayjs(newexdateArr[i])
              .subtract(1, 'day')
              .format(S_DATE_TIME_FORMAT)
            const nextdate = dayjs(newexdateArr[i])
              .add(1, 'day')
              .format(S_DATE_TIME_FORMAT)

            //总记录只有1条时
            if (newexdateArr.length == 1) {
              createoncesqltpl(datezone[0], predate)
              createoncesqltpl(nextdate, datezone[1])
            } else {
              //总记录不止1条时，但现在为第一条数据时
              if (i == 0) {
                createoncesqltpl(datezone[0], predate)
              }
              //其他记录
              if (i > 0 && i < newexdateArr.length) {
                const predate = dayjs(newexdateArr[i - 1])
                  .add(1, 'day')
                  .format(S_DATE_TIME_FORMAT)
                const nextdate = dayjs(newexdateArr[i])
                  .subtract(1, 'day')
                  .format(S_DATE_TIME_FORMAT)
                //相邻两个日期都被排除除外
                if (
                  exdateArr.indexOf(predate) === -1 &&
                  predate != newexdateArr[i]
                ) {
                  createoncesqltpl(predate, nextdate)
                }
              }
              //总记录不止1条时，但现在为最后一条数据时
              if (i == newexdateArr.length - 1) {
                createoncesqltpl(nextdate, datezone[1])
              }
            }
          }
        } else {
          //连续,没有排除日期
          createoncesqltpl(datezone[0], datezone[1])
        }
      }

      const obj = document.getElementById('btn')
      obj?.setAttribute(
        'data-clipboard-text',
        textsql.value.replace(/<br\/>/g, '\n')
      )
      //textsql.value = textsql.value.replace('<br/>', '\\n\\r')
    }
    const createoncesqltpl = (sdate: string, edate: string) => {
      const sqltpl = ref(
        `insert into tec_geo_prepare(heading_zh,heading_en,content_zh,content_en,type_code,cause_code,source_id,shown_now,announcement_time,road_version,created_at,updated_at,start_time,end_time) values("#heading_zh#","#heading_en#","#content_zh#","#content_en#",#type_code#,#cause_code#,#source_id#,#shown_now#,#announcement_time#,"#road_version#",#created_at#,#updated_at#,#start_time#,#end_time#);<br/>`
      )
      const extversion = ref()

      const start_time = dayjs(sdate + ' ' + dstime.value)
        .utcOffset(0)
        .format(DATE_TIME_FORMAT)
      const end_time = dayjs(edate + ' ' + detime.value)
        .utcOffset(0)
        .format(DATE_TIME_FORMAT)

      sqltpl.value = sqltpl.value.replace('#heading_zh#', heading_zh.value)
      sqltpl.value = sqltpl.value.replace(
        '#heading_en#',
        heading_en.value.replace("'", "''")
      )
      sqltpl.value = sqltpl.value.replace('#content_zh#', content_zh.value)
      sqltpl.value = sqltpl.value.replace(
        '#content_en#',
        content_en.value.replace("'", "''")
      )

      sqltpl.value = sqltpl.value.replace(
        '#type_code#',
        DEFAULTVALUE['type_code']
      )
      sqltpl.value = sqltpl.value.replace(
        '#cause_code#',
        DEFAULTVALUE['cause_code']
      )
      sqltpl.value = sqltpl.value.replace(
        '#source_id#',
        DEFAULTVALUE['source_id']
      )
      sqltpl.value = sqltpl.value.replace(
        '#shown_now#',
        DEFAULTVALUE['shown_now']
      )
      sqltpl.value = sqltpl.value.replace('#announcement_time#', today)
      sqltpl.value = sqltpl.value.replace('#created_at#', today)
      sqltpl.value = sqltpl.value.replace('#updated_at#', today)
      sqltpl.value = sqltpl.value.replace('#start_time#', start_time)
      sqltpl.value = sqltpl.value.replace('#end_time#', end_time)
      //复制模版
      extversion.value = sqltpl.value
      extversion.value = extversion.value.replace(
        '#road_version#',
        MAPVERSION[radiochecked.value].version1
      )
      textsql.value += extversion.value

      extversion.value = sqltpl.value
      extversion.value = extversion.value.replace(
        '#road_version#',
        MAPVERSION[radiochecked.value].version2
      )
      textsql.value += extversion.value
    }
    const copysql = () => {
      const clipboard = new Clipboard('.btn')
      clipboard.on('success', () => {
        console.log(MAPVERSION[radiochecked.value].version1)
        Toast.success('复制成功.')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        Toast.fail('复制失败,请手动全选复制.')
        clipboard.destroy()
      })
    }

    return {
      date,
      exdate,
      show,
      showPopover,
      showexPopover,
      showsTime,
      showeTime,
      currentTime,
      dstime,
      detime,
      checked,
      radiochecked,
      heading_zh,
      heading_en,
      content_zh,
      content_en,
      exdateref,
      dateref,
      textsql,
      textsqltmp,
      onConfirm,
      onexConfirm,
      filter,
      timesCancel,
      timesConfirm,
      timeeCancel,
      timeeConfirm,
      clearexdate,
      cleardate,
      createsql,
      copysql
    }
  }
})
</script>

<style scoped lang="less">
.page {
  height: 800px;
  padding: 0px 20px;
}
#showui {
  position: absolute;
  width: 500px;
  height: 600px;
  background-color: aquamarine;
}
.ymaxwidth {
  width: 100%;
}
</style>
