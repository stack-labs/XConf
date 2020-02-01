# 构建

## 源码启动

- micro api 网关

    ```shell script
    cd micro
    make run
    ```

- config-srv 
    >  --database_url value  database url (default: "root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local") [$DATABASE_URL]

    ```shell script
    cd config-srv
    make run
    # go run main.go --database_url="root:12345@(127.0.0.1:3306)/xconf?charset=utf8&parseTime=true&loc=Local"
    ```

- agent-api

    ```shell script
    cd agent-api
    make run
    ```

- admin-api

    ```shell script
    cd admin-api
    make run
    ```

- dashboard

    ```shell script
    cd dashboard
    npm install
    npm run dev
    ```

- client 适配 micro config 的 source 插件
    > micro config 只有在发布内容更改的情况下 watcher.Next 才会返回

    ```shell script
    cd client/example
    go run main.go
    ```
