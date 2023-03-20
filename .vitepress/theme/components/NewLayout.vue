<template>
  <Layout />
  <Copyright />
  <!-- <Catalog />  -->
</template>
<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
import Catalog from './Catalog.vue'

const { Layout } = DefaultTheme
</script>
