<template>
  <div v-loading="ifResponse" element-loading-text="正在计算中">
    <div id="cbox" ref="cbox" className="canvas-box">
      <canvas id="canvas" ref="canvas"/>
    </div>
  </div>
</template>

<script>
import style from '@/styles/basic-variables-black.scss'

export default {
  name: 'Bar',
  props: {
    data: {
      type: [Array, Object],
      required: true,
      default() {
        return []
      }
    },
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timer: 0,
      ifResponse: true,
      style: ''
    }
  },
  computed: {
    // 绘图所需配置对象，与默认配置合并
    chartOption() {
      const that = this
      const defaultOption = {
        // 坐标轴颜色
        axisColor: that.style.border,
        // 折线颜色
        lineColor: that.style.red,
        // 虚线颜色
        dashed: that.style.border,
        // 字体颜色
        text: that.style.text,
        textLight: that.style.textLight,
        textDark: that.style.textDark,

        // x轴 y轴名字
        xName: '结算价/期初价(%)',
        yName: '收益(%)',
        // 箭头 size
        arrowsSize: 3,
        // 数据原点
        dataPoint: [100, 0],
        // 绘图区域范围
        xRangeMin: 0.06,
        xRangeMax: 0.75,
        yRangeMin: 0.1,
        yRangeMax: 0.9,
        // 坐标点 label 与坐标轴距离
        offsetX: 5,
        offsetY: 15,
        // 绘制特殊label
        renderLabels: []
        // renderLabels: [
        //   {
        //     label: '执行价', 标签内容
        //     coord: [11000, 0], 坐标
        //     position: 'top',  在坐标点上方还是下方
        //     offset: 15, 距离坐标点的纵向距离
        //     x: true,  是否绘制到x轴的虚线
        //     y: true   是否绘制到y轴的虚线
        //   }
        // ]
      }
      return Object.assign({}, defaultOption, that.option)
    }
  },
  watch: {
    // 当坐标数据变化时，置loading 状态，防抖处理
    // 若无数据，则 return
    data() {
      if (this.data.length < 1) return
      const that = this
      this.ifResponse = true
      // console.log('chart data change')
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(function() {
        that.drawBar()
        that.ifResponse = false
      }, 800)
      // console.table(this.data)
    }
  },
  created() {
    // console.log('created')
    this.style = style
  },
  mounted() {
    // 初始化绘制
    // console.log('mounted')
    if (this.data.length < 1) return
    const that = this
    this.ifResponse = true
    this.timer = setTimeout(function() {
      that.drawBar()
      that.ifResponse = false
    }, 800)
    // console.table(this.data)
  },
  methods: {
    // 0. 初始化 chart 相关信息
    // 1. 数据数组按横坐标升序排序
    // 2. 确定数据横、纵坐标范围 max min
    // 3. 确定绘制区域范围
    // 4. 依据2/3, 转换原点坐标，绘制x/y轴，并标注其名称
    // 5. 依据2/3，将数据数组依次转换为坐标数组，并依次绘制：
    //      绘制走势图
    //      绘制坐标tick，label
    //      绘制纵坐标到x轴的虚线
    // 6. 标注执行价，敲出价等label，并根据传入条件决定是否渲染到x轴、y轴的虚线
    drawBar() {
      // 0. 初始化 chart 相关信息
      const that = this
      const cbox = this.$refs.cbox || document.querySelector('#cbox')
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      const width = parseInt(this.getStyle(cbox, 'width')) || parseInt(this.getStyle(document.querySelector('.canvas-box'), 'width'))
      const height = parseInt(this.getStyle(cbox, 'height'))
      const pRatio = window.devicePixelRatio || 1
      canvas.width = width * pRatio
      canvas.height = height * pRatio
      ctx.scale(pRatio, pRatio)
      canvas.style.transform = 'scale(' + 1 / pRatio + ',' + 1 / pRatio + ')'

      // 读取 option 部分信息数据
      const arrowsSize = that.chartOption.arrowsSize
      const xRangeMin = that.chartOption.xRangeMin
      const xRangeMax = that.chartOption.xRangeMax
      const yRangeMin = that.chartOption.yRangeMin
      const yRangeMax = that.chartOption.yRangeMax
      const offsetX = that.chartOption.offsetX
      const offsetY = that.chartOption.offsetY
      const dataPoint = that.chartOption.dataPoint
      const renderLabels = that.chartOption.renderLabels

      // 1. 数据数组按横坐标升序排序
      this.data = this.data.sort(function(a, b) {
        return a[0] - b[0]
      })
      const length = this.data.length

      // 2. 确定数据横纵坐标范围, 边界即原点
      const xArr = []
      const yArr = []
      this.data.forEach(function(cur) {
        xArr.push(cur[0])
        yArr.push(cur[1])
      })
      const xArrMin = Math.min(...xArr)
      const xArrMax = Math.max(...xArr)
      const yArrMin = Math.min(...yArr)
      const yArrMax = Math.max(...yArr)
      const differ = xArrMax - xArrMin
      const minX = Math.floor(xArrMin) >= dataPoint[0] ? Math.floor(dataPoint[0] - differ / 5) : Math.floor(xArrMin)
      const maxX = Math.ceil(xArrMax) < dataPoint[0] ? dataPoint[0] : Math.ceil(xArrMax)
      let minY = Math.floor(yArrMin) > dataPoint[1] ? dataPoint[1] : Math.floor(yArrMin)
      let maxY = Math.ceil(yArrMax) < dataPoint[1] ? dataPoint[1] : Math.ceil(yArrMax)
      // 纵坐标范围至少 -0.8 ~ 0.8
      if (yArrMin > -0.8) {
        minY = yArrMin
      }
      if (yArrMax < 0.8) {
        maxY = yArrMax
      }
      const difX = maxX - minX
      const difY = maxY - minY

      // 3. 确定绘制区域范围
      const startH = width * xRangeMin
      const endH = width * xRangeMax
      const startV = height * yRangeMin
      const endV = height * yRangeMax
      const difH = endH - startH
      const difV = endV - startV

      // 4. 依据2、3, 转换原点坐标，绘制x/y轴，并标注其名称
      const coordPoint = conversion(dataPoint)
      renderCoord(coordPoint)

      // 5. 依据2/3，将数据数组依次转换为坐标数组，并依次绘制：
      //    绘制走势图
      //    绘制坐标tick，label
      //    绘制纵坐标到x轴的虚线
      const coordData = this.data.map(function(cur, index) {
        return conversion(cur)
      })
      // 绘制走势图
      // 二元期权等，会出现同一横坐标出现俩纵坐标，需分段展示
      coordData.forEach(function(cur, index) {
        if (index === 0) {
          ctx.beginPath()
          return ctx.moveTo(cur[0], cur[1])
        } else {
          coordData[index - 1][0] === cur[0] ? ctx.moveTo(cur[0], cur[1]) : ctx.lineTo(cur[0], cur[1])
        }
        if (index === length - 1) {
          ctx.lineWidth = 2
          ctx.strokeStyle = that.chartOption.lineColor
          ctx.stroke()
          ctx.closePath()
        }
      })
      // 绘制延伸线部分: 目前看开头结尾为平行线，或者斜线两种情况
      // 以x轴为基准，x坐标在变，观察y坐标的变动趋势
      // 开头 和 结尾部分
      ctx.beginPath()
      if (this.data[0][1] === this.data[1][1]) {
        ctx.moveTo(0, coordData[0][1])
      } else {
        // 非x轴平行线，考虑 下行/上行， 以及 边界值
        const yRange1 = this.data[0][1] > this.data[1][1] ? 0 : height
        // 纵向到边界时的x坐标
        const x1 = (coordData[0][0] - coordData[1][0]) / (coordData[0][1] - coordData[1][1]) * (yRange1 - coordData[0][1]) + coordData[0][0]
        // 横向到边界时的y坐标
        const y1 = (coordData[0][1] - coordData[1][1]) / (coordData[0][0] - coordData[1][0]) * (0 - coordData[0][0]) + coordData[0][1]
        x1 < 0 ? ctx.moveTo(0, y1) : ctx.moveTo(x1, yRange1)
      }
      ctx.lineTo(coordData[0][0], coordData[0][1])
      if (this.data[length - 1][1] === this.data[length - 2][1]) {
        ctx.moveTo(width, coordData[length - 1][1])
      } else {
        const yRange2 = this.data[length - 1][1] > this.data[length - 2][1] ? 0 : height
        // 纵向到边界时的x坐标
        const x2 = (coordData[length - 1][0] - coordData[length - 2][0]) / (coordData[length - 1][1] - coordData[length - 2][1]) * (yRange2 - coordData[length - 1][1]) + coordData[length - 1][0]
        // 横向到边界时的y坐标
        const y2 = (coordData[length - 1][1] - coordData[length - 2][1]) / (coordData[length - 1][0] - coordData[length - 2][0]) * (width - coordData[length - 1][0]) + coordData[length - 1][1]
        x2 > width ? ctx.moveTo(width, y2) : ctx.moveTo(x2, yRange2)
      }
      ctx.lineTo(coordData[length - 1][0], coordData[length - 1][1])
      ctx.lineWidth = 2
      ctx.strokeStyle = that.chartOption.lineColor
      ctx.stroke()
      ctx.closePath()

      // 绘制横坐标 tick label
      // 绘制纵坐标到x轴的虚线
      const singleX = []
      const singleY = []
      coordData.forEach(function(cur, index) {
        // 横坐标不为原点，则绘制横纵坐标；否则 横坐标上不画刻度，纵坐标也不画刻度
        // if (that.data[index][0] !== dataPoint[0]) {
        if (index !== 0 && index !== length - 1) {
          // 绘制刻度
          ctx.beginPath()
          ctx.moveTo(cur[0], coordPoint[1])
          ctx.lineTo(cur[0], coordPoint[1] - 2)

          ctx.moveTo(coordPoint[0], cur[1])
          ctx.lineTo(coordPoint[0] - 2, cur[1])

          ctx.lineWidth = 1.0
          ctx.strokeStyle = that.chartOption.textDark
          ctx.stroke()

          // 绘制刻度label, 去重
          ctx.fillStyle = that.chartOption.textLight
          ctx.textAlign = 'center'
          if (singleX.indexOf(cur[0]) < 0) {
            ctx.fillText(that.data[index][0], cur[0], coordPoint[1] - offsetX)
            singleX.push(cur[0])
          }
          if (singleY.indexOf(cur[1]) < 0 && cur[1] !== 0) {
            ctx.fillText(that.data[index][1], coordPoint[0] - offsetY, cur[1])
            singleY.push(cur[1])
          }

          // 绘制对应点到x轴的虚线
          // 如果当前点横坐标与前一个不同，或者数据纵坐标在x轴异侧，则直接绘制虚线
          // 如果横坐标和前一个数据的相同，则比较纵坐标绝对值：如果后面的一个纵坐标绝对值比前一个大，则绘制连接两个坐标的虚线；反之无操作
          // if (index === 0) return
          if (index === 0 || (coordData[index - 1][0] !== cur[0] || that.data[index - 1][1] * that.data[index][1] < 0)) {
            ctx.beginPath()
            ctx.moveTo(cur[0], cur[1])
            ctx.lineTo(cur[0], coordPoint[1])
            ctx.setLineDash([5, 2])
            ctx.lineWidth = 1
            ctx.strokeStyle = that.chartOption.dashed
            ctx.stroke()
          } else if (that.data[index - 1][1] < that.data[index][1]) {
            ctx.beginPath()
            ctx.moveTo(cur[0], cur[1])
            ctx.lineTo(cur[0], coordData[index - 1][1])
            ctx.setLineDash([5, 2])
            ctx.lineWidth = 1
            ctx.strokeStyle = that.chartOption.dashed
            ctx.stroke()
          }
        }
      })

      // 绘制原点
      ctx.beginPath()
      ctx.fillStyle = that.chartOption.text
      // ctx.textAlign = 'left'
      // ctx.fillText(dataPoint[0], coordPoint[0], coordPoint[1] - 5)

      // 6. 绘制执行价，敲出价等label，并根据传入条件决定是否渲染到x轴、y轴的虚线
      renderLabels.forEach(function(cur) {
        const pos = conversion(cur.coord)
        const position = cur.position || 'top'
        const offset = cur.offset || 15
        const textAlign = cur.textAlign || 'center'
        ctx.fillStyle = cur.color || that.chartOption.textLight
        ctx.textAlign = textAlign
        switch (position) {
          case 'top':
            ctx.fillText(cur.label, pos[0], pos[1] - offset)
            break
          case 'bottom':
            ctx.fillText(cur.label, pos[0], pos[1] + offset)
            break
          case 'left':
            ctx.fillText(cur.label, pos[0] - offset, pos[1])
            break
          case 'right':
            ctx.fillText(cur.label, pos[0] + offset, pos[1])
            break
          default:
            ctx.fillText(cur.label, pos[0], pos[1] - offset)
        }
        if (cur.x) {
          ctx.beginPath()
          ctx.moveTo(pos[0], pos[1])
          ctx.lineTo(pos[0], coordPoint[1])
          ctx.setLineDash([5, 2])
          ctx.lineWidth = 1
          ctx.stroke()
        }
        if (cur.y) {
          ctx.beginPath()
          ctx.moveTo(pos[0], pos[1])
          ctx.lineTo(coordPoint[0], pos[1])
          ctx.setLineDash([5, 2])
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      // 根据原点坐标位置，绘制坐标系函数
      function renderCoord(point) {
        point = point || [0, 0]
        // y轴
        ctx.beginPath()
        ctx.moveTo(point[0], 0)
        ctx.lineTo(point[0], height)

        // 空心坐标箭头
        // ctx.moveTo(point[0] - 5, 5)
        // ctx.lineTo(point[0], 0)

        // ctx.moveTo(point[0] + 5, 5)
        // ctx.lineTo(point[0], 0)

        // x轴
        ctx.moveTo(0, point[1])
        ctx.lineTo(width, point[1])

        // 空心坐标箭头
        // ctx.moveTo(width - 5, point[1] - 5)
        // ctx.lineTo(width, point[1])

        // ctx.moveTo(width - 5, point[1] + 5)
        // ctx.lineTo(width, point[1])

        ctx.strokeWidth = 0.5
        ctx.strokeStyle = that.chartOption.axisColor
        ctx.stroke()
        // x轴 y轴 名字
        ctx.fillStyle = that.chartOption.textDark
        ctx.fillText(that.chartOption.xName, width - 80, point[1] + 15)
        ctx.fillText(that.chartOption.yName, point[0] - 50, 10)

        // 实心箭头名称
        ctx.moveTo(width - arrowsSize, point[1] - arrowsSize)
        ctx.lineTo(width, point[1])
        ctx.lineTo(width - arrowsSize, point[1] + arrowsSize)
        ctx.fill()

        ctx.moveTo(point[0] + arrowsSize, arrowsSize)
        ctx.lineTo(point[0], 0)
        ctx.lineTo(point[0] - arrowsSize, arrowsSize)
        ctx.fill()
        ctx.closePath()
      }
      // console.log('render end')

      // 数据转化为坐标
      function conversion(cur) {
        const arr = []
        arr[0] = startH + (cur[0] - minX) * (difH / difX)
        arr[1] = startV + (maxY - cur[1]) * (difV / difY)
        return arr
      }
    },
    getStyle(ele, property) {
      return ele.currentStyle ? ele.currentStyle[property] : document.defaultView.getComputedStyle(ele)[property]
    }
  }
}
</script>
<style scoped>
  #cbox {
    position: relative;
    height: 2.5rem;
    text-align: center;
    overflow: hidden;
  }

  #canvas {
    transform-origin: top left;
  }
</style>
