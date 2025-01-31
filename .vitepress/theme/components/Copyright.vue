<template>
  <div class="site-footer">
    Copyright © 2019-present <a :href="website" target="_blank">{{ webTitle }}</a>
  </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'

const { site, theme } = useData()
const website = theme.value.website
const webTitle = site.value.title
</script>

<style>
.site-footer {
  color: #888;
  text-align: center;
  font-size: 0.75rem;
  width: 100%;
  padding: 15px 0;
  overflow: auto;
}

.vitepress {
  color: var(--vp-c-text-1);
  font-weight: 700;
}
</style>
