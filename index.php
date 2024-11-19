<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>资源分享网站</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
        }
        header {
            background-color: #007BFF;
            color: white;
            padding: 20px;
            text-align: center;
        }
        nav {
            margin: 20px;
            text-align: center;
        }
        nav a {
            margin: 0 15px;
            padding: 10px 20px;
            background-color: #ffffff;
            color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        nav a:hover {
            background-color: #007BFF;
            color: white;
        }
        main {
            padding: 20px;
            text-align: center;
        }
        footer {
            margin: 20px 0;
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <header>
        <h1>欢迎来到资源分享网站</h1>
    </header>
    
    <nav>
        <a href="register.php">注册 <i class="fas fa-user-plus"></i></a>
        <a href="login.php">登录 <i class="fas fa-sign-in-alt"></i></a>
        <a href="upload.php">上传资源 <i class="fas fa-upload"></i></a>
        <a href="download.php">下载资源 <i class="fas fa-download"></i></a>
    </nav>

    <main>
        <p>在这里，您可以分享和下载各种资源。请先注册账户，然后即可上传自己的资源供他人下载。</p>
    </main>

    <footer>
        <p>&copy; 2023 资源分享网站. 版权所有.</p>
    </footer>
</body>
</html>
