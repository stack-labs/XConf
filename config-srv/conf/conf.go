package conf

// Config 配置信息
type Config struct {
	DB DataBase
}

// DataBase 数据库连接信息
type DataBase struct {
	DriverName string
	URL        string
}
