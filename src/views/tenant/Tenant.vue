<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @submit.prevent="searchQuery">
          <a-row :gutter="24">

            <a-col :sm="12" :md="6" :lg="5">
              <a-form-item label="租客名称">
                <a-input placeholder="请输入租客名称" v-model="queryParam.renterName"></a-input>
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
            title: '租客',
            align: 'center',
            dataIndex: 'renterName'
          },
          {
            title: '手机',
            align: 'center',
            dataIndex: 'mobile'
          },
          {
            title: '租期',
            align: 'center',
            customRender (status, record) {
              return this.formatDate(record.startTime) - this.formatDate(record.endTime)
            }
          },
          {
            title: '是否退房',
            align: 'center',
            dataIndex: 'orderStatus',
            customRender (status) {
              return status ? '是' : '否'
            }
          }
          // {
          //   title: '电子邮件',
          //   align: 'center',
          //   dataIndex: 'email'
          // },
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
        postAction(`/doorLockSys/queryRenterList`, {
          renterName: this.queryParam.renterName,
          'adminId': this.adminId
        })
        .then((response) => {
          if (response.data.status === 200) {
            this.dataSource = response.data.data
          } else {
            this.$message.error('租客列表查询失败')
          }
        })
        .catch(() => {
          this.$message.error('租客列表查询失败')
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
