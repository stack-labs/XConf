<template>
  <div class="app-container">
    <el-button style="float: right;" type="success" round>创建应用</el-button>
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
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="handleDone(scope.$index, scope.row)">打开</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getApps } from '@/api/app'
import router from '@/router'

export default {
  name: 'Dashboard',
  data() {
    return {
      list: null,
      listLoading: true
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
    handleDone(index, row) {
      router.push({ name: 'app', params: { name: row.appName }})
    }
  }
}

</script>
