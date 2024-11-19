<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>下载资源</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
        }
        h1 {
            text-align: center;
        }
        .resources {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        a {
            display: block;
            margin: 10px 0;
            color: #007BFF;
            text-decoration: none;
            transition: color 0.3s;
        }
        a:hover {
            color: #0056b3;
        }
    </style>
</head>
<body>
    <h1>下载资源</h1>
    <div class="resources">
        <?php
        include 'db.php';  // 包含数据库连接文件
        
        $sql = "SELECT * FROM resources";
        $result = $conn->query($sql);  // 执行查询

        while ($row = $result->fetch_assoc()) {
            echo "<a href='uploads/" . htmlspecialchars($row['resource_file']) . "'>" . htmlspecialchars($row['resource_name']) . "</a> - " . htmlspecialchars($row['resource_description']) . "<br>";
        }
        ?>
    </div>
</body>
</html>
