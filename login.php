<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>上传资源</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* 使用同样的样式 */
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        form {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        input[type=text], input[type=password] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type=submit] {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        input[type=submit]:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <h1>上传资源</h1>
    <form method="POST" enctype="multipart/form-data" action="upload.php">
        <label for="resource_name">资源名称:</label>
        <input type="text" id="resource_name" name="resource_name" required>
        
        <label for="resource_description">资源描述:</label>
        <textarea id="resource_description" name="resource_description" required></textarea>
        
        <label for="resource_file">上传文件:</label>
        <input type="file" id="resource_file" name="resource_file" required>
        
        <input type="submit" value="上传">
    </form>
</body>
</html>
