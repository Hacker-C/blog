<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

const { page } = useData()
const isPost = computed(() => {
  return page.value.headers.length !== 0
})
const headers = computed(() => {
  return page.value.headers
})
const currentHeader = ref('')
function handleJump() {
  currentHeader.value = decodeURI(location.hash)
}

let isShow = ref(false)
function toggleShow() {
  isShow.value = !isShow.value
}
</script>

<template>
  <button v-if="isPost" class="btn" @click="toggleShow">
    {{isShow ? '关闭目录' : '打开目录'}}
  </button>
  <div v-if="isPost" v-show="isShow" class="box outline-link">
    <ul>
      <li class="item" :class="{'active': '#' + slug === currentHeader}" v-for="{title, link, slug} in headers">
        <a :href="link" @click="handleJump" :class="{'active-link': '#' + slug === currentHeader}">
          {{title}}  
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.active {
  border-left: 1.5px solid var(--vp-c-brand) !important;
}

.active-link {
  color: var(--vp-c-green-light);
}

.item {
  padding-left: 10px;
  padding-right: 10px;
  border-left: 1.5px solid var(--vp-c-divider-light);
  color: #fff;
}

.box {
  font-size: 14px;
  color: #fff;
  position: fixed;
  right: calc(50vw - 410px);
  top: 110px;
  z-index: 9;
  background-color: rgba(170, 170, 170, 0.8);
}

@media (max-width: 833px) {
  .box,
  .btn {
    display: none;
  }
}

.btn {
  position: fixed;
  right: calc(50vw - 410px);
  top: 75px;
  z-index: 9;
  padding: 2px 4px;
  border-radius: 5px;
  background-color: rgba(170, 170, 170, 0.7);
  color: #fff;
}

</style>