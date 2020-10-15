export default {
  name: 'Jsx',
  data() {
    return {
      title: 123
    }
  },
  methods: {
    dd() {
      this.title = 123456
    }
  },
  render(h) {
    return (
      <div vOn:click={this.dd}>
        <h2> { this.title }</h2>

        jsx
      </div>
    )
  }
}
