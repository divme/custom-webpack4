<template>
  <div ref="dd" :class="name" class="choose-box" @click="selectClick">
    <template v-if="ifBool">
      <span v-for="(item, index) in boolData" :key="String(item)" :data-index="index" class="bool">{{ item ? '是' : '否' }}</span>
    </template>
    <template v-else>
      <span v-for="(item, index) in data" :key="item" :data-index="index" class="str">{{ item }}月</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ChooseBox',
  props: {
    // type取值: bool, str
    type: {
      type: String,
      required: false,
      default: 'str'
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String, Boolean],
      required: true
    },
    data: {
      type: [Array, Object],
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dataLen: 0,
      cellWidth: 0
    }
  },
  computed: {
    ifBool() {
      return this.type === 'bool'
    },
    boolData() {
      return this.type === 'bool' ? [true, false] : []
    }
  },
  created() {
    this.$nextTick(function() {
      this.chooseActive()
    })
  },
  beforeUpdate() {
    this.$nextTick(function() {
      this.chooseActive()
    })
  },
  methods: {
    chooseActive() {
      const father = document.querySelector('.' + this.name)
      const siblings = father.children
      if (!siblings || siblings.length === 0) return
      let index = -1
      for (let i = 0, len = siblings.length; i < len; i++) {
        siblings[i].classList.remove('active')
      }
      if (this.type === 'bool') {
        this.value ? siblings[0].classList.add('active') : siblings[1].classList.add('active')
      } else {
        index = this.data.indexOf(this.value)
        index > -1 ? siblings[index].classList.add('active') : siblings[0].classList.add('active')
      }
    },
    selectClick(e) {
      const target = e.target
      const index = target.dataset.index
      if (!index) return
      const father = document.querySelector('.' + this.name)
      // debugger
      // const father = this.$refs.dd
      const siblings = father.children
      for (let i = 0, len = siblings.length; i < len; i++) {
        siblings[i].classList.remove('active')
      }
      siblings[index].classList.add('active')
      if (this.type === 'bool') {
        this.$emit('input', this.boolData[index])
      } else {
        this.$emit('input', this.data[index])
      }
    }
  }
}
</script>
