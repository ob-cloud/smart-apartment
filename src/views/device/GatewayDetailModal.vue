<template>
  <a-drawer
    :title="title"
    :width="700"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
  >
    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="oboxSerialId"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="status" slot-scope="text, record">
        <span :style="{color: scope.row.status == 1 ? 'green':'red'}">{{ record.status == 1 ? '上线':'下线' }}</span>
      </span>
    </a-table>
  </a-drawer>
</template>

<script>
import { ProListMixin } from '@/utils/mixins/ProListMixin'
import { getAction } from '@/utils/ajax'
import moment from 'moment'
export default {
  mixins: [ ProListMixin ],
  data() {
    return {
      visible: false,
      title: '操作',
      confirmLoading: false,
      loading: false,
      dataSource: [],
      columns: [
        {
          title: '上线/下线',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'lastOpTime',
          customRender (v) {
            return v && this.formatDate(v)
          }
        }
      ]
    }
  },
  methods: {
    edit (record) {
      this.visible = true
      this.oboxSerialId = record.oboxSerialId
      this.oboxName = record.deviceName
      this.title = `${this.oboxName} 记录详情`
      this.loadData()
    },
    loadData (arg) {
      if (!this.oboxSerialId) return
      if (arg === 1) {
        this.ipagination.current = 1
      }
      getAction(`/threshold/obox/${this.oboxSerialId}/10/${this.ipagination.current}`)
        .then(response => {
          this.loading = false
          if (response.data.status === 200) {
            this.dataSource = response.data.data.list || []
            // this.pageCount = response.data.pageCount
            this.ipagination.total = response.data.pageCount
          } else {
            this.$message.error('obox上下线列表查询失败')
          }
        })
        .catch(() => {
          this.loading = false
          this.$message.error('obox上下线列表查询失败')
        })
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    formatDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
