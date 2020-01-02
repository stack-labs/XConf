<template>
  <div class="app-container">
    <el-button style="float: right;" type="success" round @click="dialogFormVisible = true">创建应用</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称">
        <template slot-scope="scope">
          {{ scope.row.appName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createdAt | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleOpen(scope.$index, scope.row)">打开</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建新应用" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getApps, createApp, deleteApp } from '@/api/app'
import router from '@/router'

export default {
  name: 'Dashboard',
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        appName: '',
        description: ''
      },
      rules: {
        appName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getApps().then(response => {
        this.list = response.apps
        this.listLoading = false
      })
    },
    handleOpen(index, row) {
      router.push({ name: 'app', params: { name: row.appName }})
    },
    handleDelete(index, row) {
      deleteApp({ appName: row.appName })
        .then(response => {
          console.log(response)
          this.fetchData()
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          createApp(this.form)
            .then(response => {
              console.log(response)
              this.cancelForm()
              this.fetchData()
              this.$message.success('创建成功')
            })
            .catch(() => {
              this.$message.error('创建失败')
            })
        }
      })
    },
    cancelForm() {
      this.dialogFormVisible = false
      this.form.appName = ''
      this.form.description = ''
    }
  }
}

</script>
