<template>
  <div class="label-item" v-if="skeletonLoading">
    <div class="title" v-if="title">
      <span class="left-line" v-if="leftLine"></span>
      <span :class="{ 'ft-bolder': border }">{{ title }}</span>
      <span class="must-fill" v-if="mustFill">*</span>
      <slot name="title"></slot>
    </div>
    <span class="addon-after" v-if="addonAfter">
      {{ addonAfter }}
    </span>
    <span class="max-size" v-if="maxSize">
      {{ checkValLength }}/{{ maxSize }}
    </span>
    <a-skeleton :loading="skeletonLoading" :paragraph="{ rows: 0 }" active>
      <slot></slot>
    </a-skeleton>
  </div>
  <div class="label-item" v-else>
    <div class="title" v-if="title">
      <span class="left-line" v-if="leftLine"></span>
      <span :class="{ 'ft-bolder': border }">{{ title }}</span>
      <span class="must-fill" v-if="mustFill">*</span>
      <slot name="title"></slot>
    </div>
    <span class="addon-after" v-if="addonAfter">
      {{ addonAfter }}
    </span>
    <span class="max-size" v-if="maxSize">
      {{ checkValLength }}/{{ maxSize }}
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LabelItem',
  props: {
    leftLine: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    mustFill: {
      type: Boolean,
      default: false
    },
    addonAfter: {
      type: String,
      default: ''
    },
    maxSize: {
      type: Number,
      default: 0
    },
    valLength: {
      type: Number,
      default: 0
    },
    skeletonLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkValLength() {
      let len = 0
      if (this.valLength > this.maxSize) {
        len = this.maxSize
      } else {
        len = this.valLength
      }
      return len
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.label-item {
  position: relative;

  .title {
    display: flex;
    align-items: center;
    margin-top: 6px;
    font-size: 12px;
    color: #777;

    span {
      height: 24px;
      line-height: 24px;
    }

    .left-line {
      display: inline-block;
      margin-right: 8px;
      width: 2px;
      height: 15px;
      background-color: #0a87f8;
    }

    .ft-bolder {
      height: 50px;
      line-height: 50px;
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .must-fill {
    color: #e48666;
    font-size: 14px;
    margin-left: 2px;
  }

  .u-bottom-border .addon-after {
    position: absolute;
    right: 0;
    z-index: 1;
    height: 32px;
    line-height: 32px;
  }

  .addon-after {
    position: absolute;
    right: 6px;
    z-index: 1;
    height: 32px;
    line-height: 32px;
  }

  .max-size {
    position: absolute;
    right: 4px;
    bottom: 8px;
    height: 12px;
    line-height: 12px;
    z-index: 1;
    font-size: 12px;
    color: #BBBBBB;
    //background-color: #ffffff;
  }

  textarea.ant-input {
    padding: 4px 0 0 0;
  }

  & /deep/ .ant-select-selection__rendered {
    margin-left: 4px;
  }

  /deep/ .ant-skeleton {
    height: 21px;
    width: 100px;
  }

  /deep/ .ant-skeleton-content {
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: ant-skeleton-loading 1.4s ease infinite;
  }

  /deep/ .ant-skeleton-title {
    background: #FFFFFF;
  }

  /deep/ .ant-skeleton-content .ant-skeleton-title {
    margin-top: 0px;
    width: auto;
  }

  /deep/ .ant-skeleton-content .ant-skeleton-title+.ant-skeleton-paragraph {
    margin-top: 0px;
  }
}
</style>
