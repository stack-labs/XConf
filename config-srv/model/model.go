package model

import "time"

type Model struct {
	ID        uint       `gorm:"column:id;          primary_key" json:"id"`
	CreatedAt time.Time  `gorm:"column:created_at"               json:"createdAt"`
	UpdatedAt time.Time  `gorm:"column:updated_at"               json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" gorm:"column:deleted_at"   json:"deletedAt"`
}

type App struct {
	Model
	AppName     string `gorm:"column:app_name; not null; unique_index:app_uindex; size:500" json:"appName"`
	Description string `gorm:"column:description;                                 size:500" json:"description"`
}

type Cluster struct {
	Model
	AppName     string `gorm:"column:app_name;      not null; unique_index:cluster_uindex; size:500" json:"appName"`
	ClusterName string `gorm:"column:cluster_name;  not null; unique_index:cluster_uindex; size:100" json:"clusterName"`
	Description string `gorm:"column:description;                                          size:500" json:"description"`
}

type Namespace struct {
	Model
	AppName       string `gorm:"column:app_name;        not null; unique_index:namespace_uindex; size:500" json:"appName"`
	ClusterName   string `gorm:"column:cluster_name;    not null; unique_index:namespace_uindex; size:100" json:"clusterName"`
	NamespaceName string `gorm:"column:namespace_name;  not null; unique_index:namespace_uindex; size:100" json:"namespaceName"`
	Format        string `gorm:"column:format"                                                             json:"format"`
	Value         string `gorm:"column:value;           type:longtext"                                     json:"value"`
	Released      bool   `gorm:"column:released"                                                           json:"released"`
	EditValue     string `gorm:"column:edit_value;      type:longtext"                                     json:"editValue"`
	Description   string `gorm:"column:description;                                              size:500" json:"description"`
}

type Release struct {
	Model
	AppName       string `gorm:"column:app_name;        not null; unique_index:release_uindex; size:500" json:"appName"`
	ClusterName   string `gorm:"column:cluster_name;    not null; unique_index:release_uindex; size:100" json:"clusterName"`
	NamespaceName string `gorm:"column:namespace_name;  not null; unique_index:release_uindex; size:100" json:"namespaceName"`
	Tag           string `gorm:"column:tag;             not null; unique_index:release_uindex; size:100" json:"tag"`
	Value         string `gorm:"column:value;           type:longtext"      json:"value"`
	Comment       string `gorm:"column:comment;         size:500"           json:"comment"`
	Type          string `gorm:"column:type;            size:50"            json:"type"`
}
