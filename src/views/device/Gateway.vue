<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @submit.prevent="searchQuery">
          <a-row :gutter="24">

            <a-col :sm="12" :md="6" :lg="5">
              <a-form-item label="绑定状态">
                <a-select placeholder="请选择状态" v-model="queryParam.isValid" allowClear>
                  <a-select-option value="-1">全部</a-select-option>
                  <a-select-option value="0">绑定</a-select-option>
                  <a-select-option value="1">异常</a-select-option>
                  <a-select-option value="2">未绑定</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :sm="12" :md="6" :lg="5">
              <a-form-item label="在线状态">
                <a-select placeholder="请选择状态" v-model="queryParam.online" allowClear>
                  <a-select-option value="-1">全部</a-select-option>
                  <a-select-option value="0">离线</a-select-option>
                  <a-select-option value="1">在线</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :sm="12" :md="6" :lg="5">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <!-- <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
    </div> -->

      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="bind" slot-scope="text, record">
            <span :style="{ color: record.isValid == 0 ? 'green' : record.isValid == 1 ? 'red' : '#ccc'}">
              {{ record.isValid == '0' ? "绑定" : record.isValid == '1' ? "异常" : "未绑定" }}
            </span>
          </span>
          <span slot="status" slot-scope="text, record">
            <span :style="{ color: record.online == 1 ? 'green':'#ccc'}">
              {{ record.online == '1' ? "在线": "离线" }}
            </span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleDetail(record)">查看</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </div>
    <!-- table区域-end -->

    <!-- <agent-modal ref="modalForm" @ok="modalFormOk"></agent-modal> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
  // import AgentModal from './modules/AgentModal'
  // import { getAgentList, delAgent } from '@/api/agent'
  import { postAction } from '@/utils/ajax'
  import { ProListMixin } from '@/utils/mixins/ProListMixin'
  // import * as dayjs from 'dayjs'
  import moment from 'moment'

  export default {
    name: '',
    mixins: [ ProListMixin ],
    // components: { AgentModal },
    data () {
      return {
        description: '这是用户管理页面',
        queryParam: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            title: '网关名',
            align: 'center',
            dataIndex: 'deviceName'
          },
          {
            title: '绑定',
            align: 'center',
            dataIndex: 'isValid',
            scopedSlots: { customRender: 'bind' }
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'online',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '分店',
            align: 'center',
            dataIndex: 'branchName'
          },
          {
            title: '栋',
            align: 'center',
            dataIndex: 'building'
          },
          {
            title: '房间号',
            align: 'center',
            dataIndex: 'roomNo'
          }
          // {
          //   title: '添加时间',
          //   align: 'center',
          //   dataIndex: 'createAt',
          //   customRender (t) {
          //     return t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : ''
          //   }
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   scopedSlots: { customRender: 'action' },
          //   align: 'center',
          //   width: 170
          // }
        ]
      }
    },
    mounted () {
    },
    methods: {
      loadData (arg) {
        this.getDataList(arg)
      },
      getDataList (arg) {
        this.loading = true
        postAction(`/doorLockSys/queryDoorLockObox`, {
        'isValid': this.queryParam.isValid,
        'online': this.queryParam.online,
        'roomNo': this.queryParam.roomNo,
        'adminId': this.adminId
      })
      .then((response) => {
        console.log(response)
        if (response.data.status === 200) {
          this.dataSource = response.data.data
        } else {
          this.$message.error('网关列表查询失败')
        }
      })
      .catch(() => {
        this.$message.error('网关列表查询失败')
      }).finally(() => { this.loading = false })
      },
      handleDelete (id) {
      },
      formatDate(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
</script>
