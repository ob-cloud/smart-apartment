<template>
  <page-header-wrapper>
    <div class="loadingCircle" id="loadingCircle" v-if="spinLoading"></div>
    <div class="add-btn-wrap" @click="addHouse">
      <a-icon type="home"></a-icon>
      添加房源
    </div>
    <content-top>
      <top-status class="f-fl" :statusData="statusData"></top-status>
      <div class="f-fr moreStyle cursor moreStyle1">
        <a-popover v-if="showMoreFlag" :title="null" trigger="hover" placement="bottomLeft">
          <template slot="content">
            <div class="action cursor">导出</div>
            <div class="action cursor" @click="changeViewMode">{{ modeTitle }}</div>
            <div class="action cursor">批量修改价格</div>
            <div class="action cursor">房源信息批量修改</div>
            <div class="action cursor">房源批量转移</div>
          </template>
          <a-icon type="more" class="moreColor"></a-icon>
        </a-popover>
        <a-icon v-else type="more" class="moreColor"></a-icon>
      </div>
      <search-dialog class="f-fr" style="margin-right: 10px;"></search-dialog>
    </content-top>

    <content-main v-show="!isListMode && !spinLoading" id="contentScroll">
      <block-list-mode></block-list-mode>
      <more-loading v-if="showMoreLoading"></more-loading>
    </content-main>

    <content-main v-show="isListMode">
      <table-list-mode></table-list-mode>
    </content-main>

    <add-house-modal ref="addHouse"></add-house-modal>
  </page-header-wrapper>
</template>

<script>
import TopStatus from '@/components/MainContainer/TopStatus'
import ContentTop from '@/components/MainContainer/ContentTop'
import SearchDialog from '@/components/SearchDialog'
import MoreLoading from './v1/MoreLoading'

import BlockListMode from './v1/BlockListMode'
import TableListMode from './v1/TableListMode'
import AddHouseModal from './v1/AddHouseModal1'

export default {
  data () {
    return {
      spinLoading: false,
      showMoreFlag: true,
      isListMode: false,
      modeTitle: '切换列表模式',
      showMoreLoading: false,
      statusData: [{ // 状态
        title: '全部',
        status: 0,
        string: 'total',
        query: null,
        index: 0
      }, {
        title: '空置',
        status: 0,
        string: 'vacantQuantity',
        query: 1,
        color: '#FB4246',
        index: 1
      }, {
        title: '已租',
        status: 0,
        string: 'rentAlreadyQuantity',
        query: 3,
        color: '#03C683',
        index: 2
      }, {
        title: '配置',
        status: 0,
        string: 'dispositionQuantity',
        query: 4,
        color: '#FFAF6D',
        index: 3
      }, {
        title: '锁房',
        status: 0,
        string: 'lockedQuantity',
        query: 5,
        color: '#666666',
        index: 4
      }, {
        title: '关闭',
        status: 0,
        string: 'closedQuantity',
        query: 8,
        line: true,
        color: '#666666',
        index: 5
      }]
    }
  },
  components: { TopStatus, ContentTop, SearchDialog, MoreLoading, TableListMode, BlockListMode, AddHouseModal },
  methods: {
    changeViewMode () {
      this.isListMode = !this.isListMode
      this.isListMode ? this.modeTitle = '切换房态模式' : this.modeTitle = '切换列表模式'
    },
    addHouse () {
      this.$refs.addHouse.show({})
    }
  }
}
</script>

<style lang="less" scoped>

.moreStyle {
  & /deep/ .ant-popover {
    .ant-popover-inner-content {
      padding: 4px 0;
      text-align: center;

      .action {
        padding: 8px 10px;
      }

      .action:hover {
        cursor: pointer;
        background: rgba(10, 135, 248, 0.1);
        color: #0a87f8;
      }
    }
  }
}
.moreStyle1 {
  & /deep/ .ant-popover {
    .ant-popover-inner-content {
      width: 134px;
    }
  }
}

.moreStyle2 {
  & /deep/ .ant-popover {
    .ant-popover-inner-content {
      width: 110px;
    }
  }
}

</style>
