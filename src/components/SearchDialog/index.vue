<template>
  <div class="search-dialog">
    <div class="search-input-wrap">
      <ul class="search-list">
        <li>
          <p class="overHidde">
            <span class="title">标题</span>
            <span></span>
          </p>
          <a-icon type="close"></a-icon>
        </li>
      </ul>
      <a-input-search class="search-input" style="width: 472px" />
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.search-dialog {
  .search-input-wrap {
    position: relative;

    .search-list {
      display: flex;
      position: absolute;
      top: 14px;
      left: 6px;
      z-index: 1;

      li {
        display: flex;
        align-items: center;
        padding: 0 4px;
        margin-right: 4px;
        height: 22px;
        line-height: 22px;
        border-radius: 12px;
        font-size: 12px;
        background: #EDF2FA;
        cursor: pointer;

        p {
          min-width: 40px;
          max-width: 180px;
          text-align: center;
        }

        .close-icon {
          color: #FB4246;
          font-size: 14px
        }
      }
    }

    .search-input {
      & /deep/ .ant-input {
        border-radius: 20px;
      }
    }
  }
}
</style>
