<!--no eslint-->
<template>
  <div class="container">
    <div class="header-container">
      <div>备选字段</div>
      <div>
        <span>合并d</span>
        <span>拆分</span>
        <span>插入列</span>
        <span>删除列</span>
        <span>插入行</span>
        <span>删除行</span>
        <span>必填</span>
        <span>非必填</span>
        <span>锁定</span>
        <span>解锁</span>
      </div>
    </div>
   <!--拖拽布局区-->
    <div class="drag-container">

      <div class="drag-left-container">
        <div
          v-for="(item, cindex) in listData"
          :key="cindex"
          :data-id="cindex"
          draggable="true"
          @click="click"
          @dragstart="onDragstart($event)"
          @dragend="onDragend($event)"
          @dragover="onDragover($event)"
          @drop="onDrop($event)"
        >{{ item.text }}</div>
      </div>

      <div class="drag-right-container">
        <table>
          <tr v-for="n in rightInfo.row">
            <td v-for="m in rightInfo.col">
              <div
                draggable="true"
                @dragstart="onDragstart($event)"
                @dragend="onDragend($event)"
                @dragover="onDragover($event)"
                @drop="onDrop($event)"
              >
                {{ endIndex }}
              </div>
            </td>
          </tr>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startIndex: -1,
      cur: '',
      endIndex: '',
      layoutType: '9',
      listData: [
        {
          text: '姓名'
        },
        {
          text: 'ID'
        },
        {
          text: '学员号'
        },
        {
          text: '学院属性'
        },
        {
          text: '性别'
        },
        {
          text: '学校'
        },
        {
          text: '城市'
        },
        {
          text: '省'
        },
        {
          text: '市'
        },
        {
          text: '手机'
        },
        {
          text: '区县'
        },
        {
          text: '原因'
        },
        {
          text: '原因说明'
        }
      ],
      rightInfo: {
        row: 4,
        col: 6
      },
      rightData: [
        {
          row: 1,
          col: 1,
          text: '默认值'
        },
        {},
        {},
        {}
      ]
    }
  },
  methods: {
    click() {
      alert(123)
    },
    // 左边
    // 拖拽元素
    onDragstart(e) {
      this.startIndex = e.target.getAttribute('data-id')
      this.cur = this.listData[this.startIndex].text
    },
    onDragend(e) {
      this.listData.splice(this.startIndex, 1, {})
    },
    // 目标元素
    onDrop(e) {
      e.target.innerText = this.cur
      e.target.parentNode.nextSibling.children[0].innerHtml = '<input placeholder="woshish"></input>'
      // e.target.parentNode.nextSibling.children[0].innerText = '<input placeholder="woshish"></input>'
    },
    onDragover(e) {
      e.preventDefault()
    },
    // 右边
    ronDrop(e) {
      console.log(e.target)
      e.target.innerText = this.cur
      e.target.nextSibling.innerHTML = '<input placeholder="woshish"/>'
    }
  }
}
</script>

<style lang="scss" scoped>
   .container {
     background-color: #eee;
     height: 800px;
   }
   /* 顶部区域 */
  .header-container {
    display: flex;
    align-items: center;
    height: 50px;
    &>div:first-of-type{
      width: 200px;
      text-align: center;
    }
    span{
      margin-right: 10px;
      padding-right: 10px;
      border-right: 1px solid grey;
    }
  }
  /*拖拽区域*/
  .drag-container {
     .drag-left-container{
       float: left;
       width: 150px;
       &>div{
         height: 36px;
         line-height: 36px;
         border: 1px solid #ccc;
         text-align: center;
       }
     }
    .drag-right-container{
      margin-left: 160px;
      table{
        width: 100%;
        border-collapse: collapse;
        word-break: break-all;
        tr{
          min-width: 50px;
          height: 36px;
          line-height: 36px;
        }
        td{
          width: 100px;
          height: 36px;
          line-height: 36px;
          border: 1px solid darkgoldenrod;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
          div{
            width: 100px;
            height: 36px;
            line-height: 36px;
          }
          input{
            width: 100px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
</style>
