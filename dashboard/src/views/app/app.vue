<template>
  <div class="app-container">
    <el-button style="float: right;" type="primary" round>新建集群</el-button>
    <el-dropdown split-button type="success" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ currentCluster ? currentCluster.clusterName : "(选择集群)" }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(cluster, index) in clusters" :key="cluster.id" :command="index">{{ cluster.clusterName }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-tag v-if="currentCluster" type="info">{{ currentCluster.description }}</el-tag>
    <el-tag v-if="currentCluster" type="info">{{ currentCluster.createdAt | parseTime }}</el-tag>

    <el-card class="box-card">
      <div slot="header">
        <span>namespace</span>
        <el-button style="float: right;" type="primary" size="mini" round>新建namespace(配置)</el-button>
      </div>
      <div v-if="currentCluster">
        <el-collapse accordion>
          <el-collapse-item v-for="namespace in namespaces" :key="namespace.id">
            <template slot="title">
              <el-row :gutter="20">
                <el-tag type="info" effect="plain">{{ namespace.namespaceName }}</el-tag>
                <el-tag type="success" size="small">{{ namespace.format }}</el-tag>
                <el-tag v-if="!namespace.released" type="danger" size="mini">当前未发布</el-tag>
              </el-row>
            </template>
            <div>
              {{ namespace.description }}
              <el-button size="mini" style="float: right;" type="warning" round>历史版本</el-button>
            </div>

            <el-input
              v-model="namespace.value"
              autosize
              type="textarea"
              placeholder="请输入内容"
            />

            <div align="right">
              <el-button type="primary" round>发布</el-button>
              <el-button type="info" round>保存</el-button>
            </div>
          </el-collapse-item>

        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getClusters } from '@/api/cluster'
import { getNamespaces } from '../../api/namespace'

export default {
  name: 'App',
  data() {
    return {
      clusters: null,
      appName: null,
      currentCluster: null,
      namespaces: null
    }
  },
  created() {
    this.appName = this.$route.params.name
    this.fetchData(this.appName)
  },
  methods: {
    fetchData(name) {
      getClusters({ appName: name }).then(response => {
        this.clusters = response.clusters
        // if (this.clusters.length > 0) {
        //   this.currentCluster = this.clusters[0]
        // }
      })
    },
    handleCommand(index) {
      console.log(index)
      this.currentCluster = this.clusters[index]

      getNamespaces({ appName: this.currentCluster.appName, clusterName: this.currentCluster.clusterName }).then(response => {
        this.namespaces = response.namespaces
      })
    }
  }
}
</script>

<style scoped>
</style>
