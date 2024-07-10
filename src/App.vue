<template>
  <n-space vertical size="large" style="width: 100%; height: 100%;" class="full-height flex-fill" >
    <n-layout has-sider >
      <n-layout-sider
        collapse-mode="transform"
        :collapsed-width="0"
        :width="240"
        :show-collapsed-content="false"
        show-trigger="bar"
        content-style="padding: 24px;"
        :inverted="true"
        bordered
      >
      <n-button>
        Hi
      </n-button>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px; height: 100%;" style="height: 100vh;">
        Pingshan Road
      </n-layout-content>
    </n-layout>
  </n-space>
</template>



<script setup lang="ts">
import { ref } from 'vue'
import SideBar from './components/SideBar.vue';
//import { NConfigProvider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NSpace, NButton, NIcon, NText, NGrid, NGridItem,  } from 'naive-ui'
//import { Search as SearchIcon } from '@vicons/ionicons5'

const drawer = ref(true)
</script>