<template>
  <div class="app-container">
    <el-button style="float: right;" type="primary" round @click="dialogClusterVisible = true">新建集群</el-button>
    <el-button v-if="currentCluster" type="danger" style="float: right;" round @click="deleteCurrentCluster">删除</el-button>

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

    <el-card v-if="currentCluster" class="box-card">
      <div slot="header">
        <span>namespace</span>
        <el-button style="float: right;" type="primary" size="mini" round @click="dialogNamespaceVisible = true">新建namespace(配置)</el-button>
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
              <el-button size="mini" style="float: right;" type="danger" round @click="deleteNamespace(namespace)">删除</el-button>
              <el-button size="mini" style="float: right;" type="warning" round @click="releaseHistory(namespace)">历史版本</el-button>
            </div>

            <el-input
              v-model="namespace.editValue"
              autosize
              type="textarea"
              placeholder="请输入内容"
            />

            <div align="right">
              <el-button v-if="!namespace.released" type="primary" round @click="handlerReleaseNamespaceConfig(namespace)">发布</el-button>
              <el-button type="info" round @click="updateNamespaceConfig(namespace)">保存</el-button>
            </div>
          </el-collapse-item>

        </el-collapse>
      </div>
    </el-card>

    <el-dialog title="创建新集群" :visible.sync="dialogClusterVisible">
      <el-tag>{{ appName }} </el-tag>
      <el-form ref="clusterForm" :model="clusterForm" :rules="rules">
        <el-form-item label="集群名称" prop="clusterName">
          <el-input v-model="clusterForm.clusterName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="clusterForm.description" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelClusterForm">取 消</el-button>
          <el-button type="primary" @click="submitClusterForm('clusterForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-if="currentCluster" title="创建新namespace" :visible.sync="dialogNamespaceVisible">
      <el-tag>{{ appName }} - {{ currentCluster.clusterName }} </el-tag>
      <el-form ref="namespaceForm" :model="namespaceForm" :rules="rules">
        <el-form-item label="namespace名称" prop="namespaceName">
          <el-input v-model="namespaceForm.namespaceName" />
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="namespaceForm.format" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="namespaceForm.description" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelNamespaceForm">取 消</el-button>
          <el-button type="primary" @click="submitNamespaceForm('namespaceForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog v-if="currentCluster" title="发布配置" :visible.sync="dialogReleaseVisible">
      <el-tag>{{ releaseForm.appName }} - {{ releaseForm.clusterName }} - {{ releaseForm.namespaceName }} </el-tag>
      <el-form ref="releaseForm" :model="releaseForm" :rules="rules">
        <el-form-item label="tag" prop="tag">
          <el-input v-model="releaseForm.tag" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="releaseForm.comment" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelRelease">取 消</el-button>
          <el-button type="primary" @click="releaseConfig('releaseForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getClusters, createCluster, deleteCluster } from '@/api/cluster'
import { getNamespaces } from '@/api/namespace'
import { createNamespace, deleteNamespace } from '@/api/namespace'
import { updateConfig } from '@/api/config'
import { release } from '@/api/release'
import router from '@/router'

export default {
  name: 'App',
  data() {
    return {
      clusters: null,
      appName: null,
      currentCluster: null,
      namespaces: null,
      dialogClusterVisible: false,
      dialogNamespaceVisible: false,
      dialogReleaseVisible: false,
      clusterForm: {
        appName: '',
        clusterName: '',
        description: ''
      },
      namespaceForm: {
        appName: '',
        clusterName: '',
        namespaceName: '',
        format: 'json',
        description: ''
      },
      releaseForm: {
        appName: '',
        clusterName: '',
        namespaceName: '',
        tag: '',
        comment: ''
      },
      rules: {
        clusterName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        namespaceName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.appName = this.$route.params.app
    const cluster = this.$route.params.cluster

    getClusters({ appName: this.appName }).then(response => {
      this.clusters = response.clusters
      if (this.clusters != null) {
        for (let i = 0; i < this.clusters.length; i++) {
          if (this.clusters[i].clusterName === cluster) {
            this.currentCluster = this.clusters[i]
            this.setNamespace()
            break
          }
        }
      }
    })
  },
  methods: {
    setClusters() {
      getClusters({ appName: this.appName }).then(response => {
        this.clusters = response.clusters
      })
    },
    releaseHistory(row) {
      router.push({ name: 'history', params: {
        app: row.appName,
        cluster: row.clusterName,
        namespace: row.namespaceName
      }})
    },
    setNamespace() {
      getNamespaces({
        appName: this.currentCluster.appName,
        clusterName: this.currentCluster.clusterName
      }).then(response => {
        this.namespaces = response.namespaces
      })
    },
    handleCommand(index) {
      router.push({ name: 'app', params: {
        app: this.clusters[index].appName,
        cluster: this.clusters[index].clusterName }
      })
    },
    submitClusterForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.clusterForm.appName = this.appName
          createCluster({
            appName: this.clusterForm.appName,
            clusterName: this.clusterForm.clusterName,
            description: this.clusterForm.description
          })
            .then(response => {
              console.log(response)
              this.setClusters()
              this.cancelClusterForm()
              this.$message.success('创建成功')
            })
            .catch(() => {
              this.$message.error('创建失败')
            })
        }
      })
    },
    deleteCurrentCluster() {
      deleteCluster({
        appName: this.currentCluster.appName,
        clusterName: this.currentCluster.clusterName
      })
        .then(response => {
          console.log(response)
          this.currentCluster = null
          this.setClusters()
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    cancelClusterForm() {
      this.dialogClusterVisible = false
      this.clusterForm.clusterName = ''
      this.clusterForm.description = ''
    },
    submitNamespaceForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.namespaceForm.appName = this.appName
          this.namespaceForm.clusterName = this.currentCluster.clusterName
          createNamespace({
            appName: this.namespaceForm.appName,
            clusterName: this.namespaceForm.clusterName,
            namespaceName: this.namespaceForm.namespaceName,
            format: this.namespaceForm.format,
            description: this.namespaceForm.description
          })
            .then(response => {
              console.log(response)
              this.setNamespace()
              this.cancelNamespaceForm()
              this.$message.success('创建成功')
            })
            .catch(() => {
              this.$message.error('创建失败')
            })
        }
      })
    },
    deleteNamespace(namespace) {
      deleteNamespace({
        appName: namespace.appName,
        clusterName: namespace.clusterName,
        namespaceName: namespace.namespaceName
      })
        .then(response => {
          console.log(response)
          this.setNamespace()
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    cancelNamespaceForm() {
      this.dialogNamespaceVisible = false
      this.namespaceForm.clusterName = ''
      this.namespaceForm.namespaceName = ''
      this.namespaceForm.description = ''
    },
    updateNamespaceConfig(namespace) {
      updateConfig({
        appName: namespace.appName,
        clusterName: namespace.clusterName,
        namespaceName: namespace.namespaceName,
        value: namespace.editValue
      })
        .then(response => {
          console.log(response)
          this.setNamespace()
          this.$message.success('保存成功')
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
    },
    handlerReleaseNamespaceConfig(namespace) {
      this.releaseForm.appName = namespace.appName
      this.releaseForm.clusterName = namespace.clusterName
      this.releaseForm.namespaceName = namespace.namespaceName

      this.dialogReleaseVisible = true
    },
    cancelRelease() {
      this.releaseForm.appName = ''
      this.releaseForm.clusterName = ''
      this.releaseForm.namespaceName = ''
      this.releaseForm.comment = ''
      this.releaseForm.tag = ''

      this.dialogReleaseVisible = false
    },
    releaseConfig(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          release(this.releaseForm)
            .then(response => {
              console.log(response)
              this.setNamespace()
              this.dialogReleaseVisible = false

              this.$message.success('发布成功')
            })
            .catch(() => {
              this.$message.error('发布失败')
            })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
