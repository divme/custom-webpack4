<template>
  <div class="list-table-box">
    <div v-if="title" class="list-title"><span>{{ title }}</span></div>
    <el-table :data="data" :row-style="tableRowStyle" @cell-click="cellClick">
      <el-table-column :show-overflow-tooltip="true" :width="110" prop="name" align="left" header-align="left" label="名称">
        <template slot-scope="scope">
          <div class="name">{{ scope.row.name }}</div>
          <div class="code">{{ scope.row.code }}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="lastPrice" align="right" header-align="right" label="最新价"/>
      <el-table-column :show-overflow-tooltip="true" prop="chgAmount" align="right" header-align="right" label="涨跌">
        <template slot-scope="scope">
          <span :class="addChgClass(scope.row.chgAmount)">{{ (scope.row.pctChg > 0 ? '+' : '') + keepDecimals(scope.row.chgAmount, 2) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :width="110" prop="pctChg" align="right" header-align="right" label="涨跌幅">
        <template slot-scope="scope">
          <span :class="addChgClass(scope.row.pctChg)">{{ (scope.row.pctChg > 0 ? '+' : '') + keepDecimals(scope.row.pctChg, 2) }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { addChgClass, keepDecimals } from '@/utils/tool'
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    activeTab: {
      type: String,
      default: 'all'
    }
  },
  methods: {
    addChgClass,
    keepDecimals,
    cellClick(row, column, cell, e) {
      this.$store.dispatch('ConfirmUnderlying', {
        underlying: row
      })
      this.$store.dispatch('ConfirmUnderlyingActiveTab', {
        activeName: this.activeTab
      })
      this.$router.push({ path: '/' })
    },
    // 设置表格行的样式
    tableRowStyle({ row, rowIndex }) {
      return 'font-size:16px;'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .list-table-box{
    width: 100%;
    /*padding: 0 .15rem;*/
    background: var(--bg-light);
    .list-title{
      height: .4rem;
      line-height: .4rem;
      padding: 0 .1rem;
      border-bottom: 1px solid var(--border);
      &:before{
        content: '';
        display: inline-block;
        width: 4px;
        height: .15rem;
        border-radius: 2px;
        background: var(--red);
        vertical-align: middle;
      }
      span{
        display: inline-block;
        height: .15rem;
        line-height: .15rem;
        text-indent: .1rem;
        font-size: 15px;
        vertical-align: middle;
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .list-table-box{
    .el-table{
      background: var(--bg-light);
      th{
        padding: 8px 0;
      }
      td{
        padding: 8px 0;
      }
      td:last-child{
        .rise{
          display: inline-block;
          width: .7rem;
          height: .25rem;
          line-height: .25rem;
          padding: 0 .02rem;
          font-size: 15px;
          border-radius: 2px;
          background: var(--red);
          color: var(--white);
        }
        .fall{
          display: inline-block;
          width: .7rem;
          height: .25rem;
          line-height: .25rem;
          padding: 0 .02rem;
          font-size: 15px;
          border-radius: 2px;
          background: var(--green);
          color: var(--white);
        }
      }
      .cell {
        .name{
          margin-bottom: .05rem;
          line-height: 1.2;
          font-size: 16px;
        }
        .code{
          line-height: 1;
          font-size: 11px;
          color:#666666;
        }
      }
    }
    .el-table th, .el-table tr{
      background: var(--bg-light);
      color: var(--text);
    }
    .el-table td, .el-table th.is-leaf{
      border-color: var(--border);
    }
    .el-table--border::after, .el-table--group::after, .el-table::before{
      background: var(--bg);
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td{
      background: var(--bg);
    }
  }
</style>
