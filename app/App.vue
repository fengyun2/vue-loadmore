<template>
  <div id="app">
    <!-- 信息列表 -->
    <list></list>
    <!-- 加载更多按钮 -->
    <a class="button" @click="next">GO NEXT</a>
  </div>
</template>
<script>
import List from './components/List'
export default {
  components: {
    List
  },
  data () {
    return {

    }
  },
  methods: {
    next () {

    }
  }
}
</script>
<style scoped>
.button {
  display: block;
  width: 100%;
  background-color: #212121;
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding: 1em;
  cursor: pointer;
  text-decoration: none;
}
.button span {
  margin-left: 2em;
  font-size: .5rem;
  color: #d6d6d6;
}
</style>
