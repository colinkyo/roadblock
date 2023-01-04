<template>
  <div class="page" id="pageui">
    <van-form @submit="createsql">
      <van-row justify="center">
        <van-col span="24">
          <van-cell-group>
            <van-field name="radio" label="地区选择">
              <template #input>
                <van-radio-group v-model="zoneradio" direction="horizontal">
                  <van-radio name="HK">香港</van-radio>
                  <van-radio name="MO">澳门</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              autocomplete="off"
              label="中文标题"
              placeholder="中文标题"
              v-model="heading_zh"
              :clearable="true"
              :rules="[{ required: true, message: '请填写中文标题' }]"
            ></van-field>
            <van-field
              autocomplete="off"
              label="英文标题"
              placeholder="英文标题"
              :clearable="true"
              v-model="heading_en"
            ></van-field>
            <van-field
              autocomplete="off"
              label="中文内容"
              placeholder="中文内容"
              :clearable="true"
              v-model="content_zh"
              :rules="[{ required: true, message: '请填写中文内容' }]"
            ></van-field>
            <van-field
              autocomplete="off"
              label="英文内容"
              placeholder="英文内容"
              :clearable="true"
              v-model="content_en"
            ></van-field>
          </van-cell-group>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <van-popover v-model:show="showsDatePopup" placement="bottom-start">
            <van-calendar
              :lazy-render="false"
              row-height="25"
              :max-date="maxDate"
              :show-confirm="false"
              ref="datesref"
              first-day-of-week="1"
              :allow-same-day="true"
              title="日历"
              :show-title="false"
              :poppable="false"
              @confirm="onsDateConfirm"
              :style="{ height: '300px', width: '400px' }"
            />
            <template #reference>
              <van-field
                autocomplete="off"
                :clearable="true"
                label="开始日期"
                placeholder="年-月-日"
                title="开始日期"
                v-model="sdate"
                @clear="clearedate"
                @update:model-value="sdateupdate"
                :rules="[{ required: true, message: '选择开始日期' }]"
              ></van-field>
            </template>
          </van-popover>
        </van-col>
        <van-col span="6">
          <van-popover v-model:show="showsTimePopup" placement="bottom">
            <van-datetime-picker
              v-model="currentTime"
              type="time"
              :filter="filter"
              @confirm="onsTimeConfirm"
              @cancel="onsTimeCancel"
            />
            <template #reference>
              <van-field
                autocomplete="off"
                :clearable="true"
                label="开始时间"
                placeholder="选择开始时间"
                title="开始时间"
                v-model="stime"
                :rules="[{ required: true, message: '选择开始时间' }]"
              ></van-field>
            </template>
          </van-popover>
        </van-col>
        <van-col span="6">
          <van-popover v-model:show="showeDatePopup" placement="bottom-start">
            <van-calendar
              :lazy-render="false"
              row-height="25"
              :max-date="maxDate"
              :show-confirm="false"
              ref="dateeref"
              first-day-of-week="1"
              :allow-same-day="true"
              title="日历"
              :show-title="false"
              :poppable="false"
              @confirm="oneDateConfirm"
              :style="{ height: '300px', width: '400px' }"
            />
            <template #reference>
              <van-field
                autocomplete="off"
                :clearable="true"
                label="结束日期"
                placeholder="年-月-日"
                title="结束日期"
                v-model="edate"
                @clear="clearedate"
                @update:model-value="edateupdate"
                :rules="[{ required: true, message: '选择结束日期' }]"
              ></van-field>
            </template>
          </van-popover>
        </van-col>
        <van-col span="6">
          <van-cell-group>
            <van-popover placement="bottom" v-model:show="showeTimePopup">
              <van-datetime-picker
                v-model="currentTime"
                type="time"
                :filter="filter"
                @confirm="oneTimeConfirm"
                @cancel="oneTimeCancel"
              />
              <template #reference>
                <van-field
                  autocomplete="off"
                  :clearable="true"
                  label="结束时间"
                  placeholder="选择结束时间"
                  title="结束时间"
                  v-model="etime"
                  :rules="[{ required: true, message: '选择结束时间' }]"
                ></van-field>
              </template>
            </van-popover>
          </van-cell-group>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="8">
          <van-field name="radio" label="封路日期">
            <template #input>
              <van-radio-group
                v-model="dailyradio"
                direction="horizontal"
                @change="cdailyradio"
              >
                <van-radio name="T">连续</van-radio>
                <van-radio name="F">非连续</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-col>
        <van-col span="16">
          <van-field name="radio" label="封路日期">
            <template #input>
              <van-radio-group
                v-model="inexradio"
                direction="horizontal"
                :disabled="isdisabled"
              >
                <van-radio name="T">选中</van-radio>
                <van-radio name="F">排除</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-popover v-model:show="showextDatePopup" placement="bottom-start">
            <van-calendar
              :lazy-render="false"
              row-height="25"
              :max-date="maxDate"
              ref="dateextref"
              type="multiple"
              title="日历"
              :default-date="null"
              :show-title="false"
              first-day-of-week="1"
              :poppable="false"
              @confirm="onexConfirm"
              :style="{ height: '350px', width: '400px' }"
            />
            <template #reference>
              <van-field
                :disabled="isdisabled"
                autocomplete="off"
                :clearable="true"
                placeholder="日期"
                title="日期"
                @click="hideextdate"
                v-model="extdate"
                @clear="clearextdate"
              ></van-field>
            </template>
          </van-popover>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="24">
          <div class="padding">
            <van-button type="primary" native-type="submit" size="large"
              >生成SQL语句</van-button
            >
          </div>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="10">
          <van-field
            autocomplete="off"
            v-model="sqlname"
            center
            clearable
            label="文件名"
            placeholder="保存的文件名"
          >
            <template #button>
              <div class="button-div">
                <van-button type="danger" @click="saveAsText"
                  >保存SQL</van-button
                >
                <van-button type="danger" class="btn" id="btn" @click="copysql"
                  >复制SQL</van-button
                >
              </div>
            </template>
          </van-field>
        </van-col>
        <van-col span="14">
          <div class="padding-tlrb-div">
            <van-button type="success" @click="resetTitle"
              >清除中英文内容</van-button
            >
            <van-button type="success" @click="resetTime"
              >清除日期和时间</van-button
            >
            <van-button type="success" @click="resetSQL"
              >清除SQL和文件名</van-button
            >
            <van-button type="success" @click="resetALL">全部清除</van-button>
          </div>
        </van-col>
      </van-row>
    </van-form>
    <van-row justify="center">
      <van-col span="24">
        <div style="padding-left: 16px">
          <van-divider>生成SQL</van-divider>
          <div id="bar" v-html="textsql"></div>
        </div>
      </van-col>
    </van-row>
    <!-- <van-button
      class="btn"
      data-clipboard-action="cut"
      data-clipboard-target="#bar"
      @click="copysql"
    >-->
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { Col, Row, Button, Checkbox, RadioGroup, Radio, Divider } from 'vant'
import { Form, Field, CellGroup } from 'vant'
import { Cell, Calendar, Popover } from 'vant'
import { DatetimePicker, Toast } from 'vant'
import type { CalendarInstance } from 'vant'

import Clipboard from 'clipboard'

import { MAPVERSION, DEFAULTVALUE } from './config/config'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'

import { saveAs } from 'file-saver'

dayjs.extend(utc)

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const S_DATE_TIME_FORMAT = 'YYYY-MM-DD'

const today = dayjs().utcOffset(0).format(DATE_TIME_FORMAT)
//最大选择日期
const maxDate = dayjs().add(1, 'year').toDate()
//const maxDate = new Date(2024, 1, 4)

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
    [Toast.name]: Toast,
    [Divider.name]: Divider
  },
  setup() {
    //日历组件实例
    const datesref = ref<CalendarInstance>()
    const dateeref = ref<CalendarInstance>()
    const dateextref = ref<CalendarInstance>()

    const textsql = ref('')
    const heading_zh = ref('')
    const heading_en = ref('')
    const content_zh = ref('')
    const content_en = ref('')

    const extdate = ref('')
    const show = ref(false)
    const checked = ref(false)
    const zoneradio = ref('HK')
    const dailyradio = ref('F')
    const inexradio = ref('F')
    const showextDatePopup = ref(false)
    const isdisabled = ref(false)

    const currentTime = ref('12:30')

    const showsDatePopup = ref(false)
    const sdate = ref('')

    const showeDatePopup = ref(false)
    const edate = ref('')

    const showsTimePopup = ref(false)
    const stime = ref('')

    const showeTimePopup = ref(false)
    const etime = ref('')
    const sqlname = ref('')

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
    const onsDateConfirm = (value: any) => {
      showsDatePopup.value = false
      sdate.value = formatDate(value)
    }
    const sdateupdate = (v: any) => {
      datesref.value?.reset(dayjs(v).toDate())
      console.log(v)
    }
    const edateupdate = (v: any) => {
      dateeref.value?.reset(dayjs(v).toDate())
      console.log(v)
    }
    const oneDateConfirm = (value: any) => {
      showeDatePopup.value = false
      edate.value = formatDate(value)
    }
    const onexConfirm = (dates: any) => {
      showextDatePopup.value = false
      const tmpdate: Array<string> = []
      dates.map(function (item: Date) {
        tmpdate.push(formatDate(item)) // 1
      })
      extdate.value = tmpdate.sort().join(',')
    }

    const onsTimeCancel = () => {
      showsTimePopup.value = false
    }
    const onsTimeConfirm = (value: any) => {
      console.log(value)
      showsTimePopup.value = false
      stime.value = value
    }

    const oneTimeCancel = () => {
      showeTimePopup.value = false
    }
    const oneTimeConfirm = (value: any) => {
      console.log(value)
      showeTimePopup.value = false
      etime.value = value
    }

    const clearextdate = () => {
      showextDatePopup.value = false
      dateextref.value?.reset()
    }

    const clearsdate = () => {
      showsDatePopup.value = false
      datesref.value?.reset()
    }
    const clearedate = () => {
      showeDatePopup.value = false
      dateeref.value?.reset()
    }

    const createsql = () => {
      textsql.value = ''
      const exdateArr: Array<string> = extdate.value.split(',')
      //date.value.split('至')
      const datezone = [sdate.value, edate.value]
      //开始复制
      if (dailyradio.value == 'F') {
        //非连续日期区间
        const dtlen = dayjs(datezone[1]).diff(datezone[0], 'day')

        for (let i = 0; i <= dtlen; i++) {
          const currdate = dayjs(datezone[0])
            .add(i, 'day')
            .format(S_DATE_TIME_FORMAT)
          //非连续不在排除日期内
          if (exdateArr.indexOf(currdate) === -1 && inexradio.value == 'F') {
            const nextdate = dayjs(datezone[0])
              .add(i, 'day')
              .format(S_DATE_TIME_FORMAT)

            createoncesqltpl(currdate, nextdate)
          } else if (
            exdateArr.indexOf(currdate) !== -1 &&
            inexradio.value == 'T'
          ) {
            const nextdate = dayjs(datezone[0])
              .add(i, 'day')
              .format(S_DATE_TIME_FORMAT)

            createoncesqltpl(currdate, nextdate)
          } else {
            //非连续，在排除日期内
            console.log(currdate + ' 在排除的数组中.')
          }
        }
      } else {
        //连续日期区间
        //找出要排除的有效日期数组
        dayjs.extend(isBetween)
        const newexdateArr = exdateArr
          .sort()
          .filter((item) =>
            dayjs(item).isBetween(datezone[0], datezone[1], 'day')
          )
        //连续有排除日期
        const isFalse = false
        if (newexdateArr.length && inexradio.value == 'F') {
          //有排除日期
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
        } else if (newexdateArr.length && inexradio.value == 'T' && isFalse) {
          //连续有选中日期
          //createoncesqltpl(datezone[0], datezone[1])
        } else {
          //没排除日期
          createoncesqltpl(datezone[0], datezone[1])
        }
      }

      const obj = document.getElementById('btn')
      obj?.setAttribute(
        'data-clipboard-text',
        textsql.value.replace(/<br\/>/g, '\n')
      )

      Toast.success('生成SQL成功.')
      //textsql.value = textsql.value.replace('<br/>', '\\n\\r')
    }
    const saveAsText = () => {
      if (!sqlname.value) {
        Toast.fail('文件名为空')
        return
      }

      const str = textsql.value.replace(/<br\/>/g, '\r\n')
      const strData = new Blob([str], { type: 'text/plain;charset=utf-8' })
      saveAs(strData, sqlname.value + '.sql')
    }

    const createoncesqltpl = (sdate: string, edate: string) => {
      const sqltpl = ref(
        `insert into tec_geo_prepare(heading_zh,heading_en,content_zh,content_en,type_code,cause_code,source_id,shown_now,announcement_time,road_version,created_at,updated_at,start_time,end_time) values('#heading_zh#','#heading_en#','#content_zh#','#content_en#',#type_code#,#cause_code#,#source_id#,#shown_now#,timestamp '#announcement_time#','#road_version#',timestamp '#created_at#',timestamp '#updated_at#',timestamp '#start_time#',timestamp '#end_time#');<br/>`
      )
      const extversion = ref()

      const start_time = dayjs(sdate + ' ' + stime.value)
        .utcOffset(0)
        .format(DATE_TIME_FORMAT)
      let end_time = dayjs(edate + ' ' + etime.value)
        .utcOffset(0)
        .format(DATE_TIME_FORMAT)

      //如果 end_time 比 start_time小 说明跨日了，end_time需要加上一天
      const dttime = dayjs(end_time).diff(dayjs(start_time), 'minutes')
      if (dttime < 0) {
        end_time = dayjs(end_time).add(1, 'day').format(DATE_TIME_FORMAT)
      }

      sqltpl.value = sqltpl.value.replace(
        '#heading_zh#',
        sqlfilter(heading_zh.value)
      )
      sqltpl.value = sqltpl.value.replace(
        '#heading_en#',
        sqlfilter(heading_en.value)
      )
      sqltpl.value = sqltpl.value.replace(
        '#content_zh#',
        sqlfilter(content_zh.value) + MAPVERSION[zoneradio.value].memo_zh
      )

      let content_en_text = ''
      if (MAPVERSION[zoneradio.value].memo_en != '') {
        content_en_text =
          sqlfilter(content_en.value) +
          ' ' +
          MAPVERSION[zoneradio.value].memo_en
      } else {
        content_en_text = sqlfilter(content_en.value)
      }
      sqltpl.value = sqltpl.value.replace('#content_en#', content_en_text)

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
        MAPVERSION[zoneradio.value].version1
      )
      textsql.value += extversion.value

      extversion.value = sqltpl.value
      extversion.value = extversion.value.replace(
        '#road_version#',
        MAPVERSION[zoneradio.value].version2
      )
      textsql.value += extversion.value
    }
    const sqlfilter = (text: string) => {
      text = text.replace(/'/g, "''")
      text = text.replace(/"/g, '\\"')
      return text
    }
    const copysql = () => {
      const clipboard = new Clipboard('.btn')
      clipboard.on('success', () => {
        Toast.success('复制成功.')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        Toast.fail('复制失败,请手动全选复制.')
        clipboard.destroy()
      })
    }

    const resetTitle = () => {
      //heading_zh.value = ''
      //heading_en.value = ''
      content_zh.value = ''
      content_en.value = ''
    }
    const resetTime = () => {
      sdate.value = ''
      edate.value = ''
      stime.value = ''
      etime.value = ''
      extdate.value = ''

      datesref.value?.reset()
      dateeref.value?.reset()
      dateextref.value?.reset()
    }

    watch(heading_zh, (newX) => {
      if (zoneradio.value == 'HK') sqlname.value = sdate.value + ' ' + newX
      else sqlname.value = newX
    })
    watch(sdate, (newX) => {
      if (zoneradio.value == 'HK') sqlname.value = newX + ' ' + heading_zh.value
    })

    const resetSQL = () => {
      textsql.value = ''
      sqlname.value = ''
      const obj = document.getElementById('btn')
      obj?.removeAttribute('data-clipboard-text')
    }
    const resetALL = () => {
      heading_zh.value = ''
      heading_en.value = ''
      resetTitle()
      resetTime()
      resetSQL()
    }

    const cdailyradio = (text: string) => {
      if (text == 'T') {
        isdisabled.value = true
        showextDatePopup.value = false
      } else {
        isdisabled.value = false
      }
    }
    const hideextdate = () => {
      if (dailyradio.value == 'T') {
        showextDatePopup.value = true
      } else {
        showextDatePopup.value = false
      }
    }
    return {
      sdate,
      edate,
      extdate,
      show,
      showsDatePopup,
      showeDatePopup,
      showsTimePopup,
      showeTimePopup,
      showextDatePopup,
      currentTime,
      stime,
      etime,
      checked,
      zoneradio,
      dailyradio,
      inexradio,
      isdisabled,
      heading_zh,
      heading_en,
      content_zh,
      content_en,
      datesref,
      dateeref,
      dateextref,
      textsql,
      sqlname,
      onsDateConfirm,
      oneDateConfirm,
      onexConfirm,
      filter,
      onsTimeCancel,
      onsTimeConfirm,
      oneTimeCancel,
      oneTimeConfirm,
      clearextdate,
      clearsdate,
      clearedate,
      createsql,
      copysql,
      saveAsText,
      sdateupdate,
      edateupdate,
      resetTitle,
      resetTime,
      resetSQL,
      resetALL,
      cdailyradio,
      hideextdate,
      maxDate
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
.padding-lr-div {
  padding: 0px 16px;
}
.padding-tlrb-div {
  padding: 10px 16px;
}
.padding-tlrb-div button {
  margin-right: 10px;
}
.button-div button {
  margin-right: 10px;
}
</style>
