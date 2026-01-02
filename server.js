const express = require('express');
const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');
const { processRadec } = require('./match'); // Adjust the path if necessary
const app = express();
const port = 3300;

// 固定文件夹路径
const baseFolderPath = '/datapool/ATMA00/ATMA00'; // 替换为你的文件夹路径
const baseFolderPath1 = '/datapool/ATMA00'; // 替换为你的文件夹路径
const baseFolderPath2 = '/datapool/ATMA00/ATMA01';
app.use(express.static('public'));
app.get('/datapool/ATMA00/ATMA00_README.pdf', (req, res) => {
    const filePath = path.resolve('/datapool/ATMA00/ATMA00_README.pdf');
    res.download(filePath); // 触发文件下载
});
app.get('/datapool/ATMA00/down_json.py', (req, res) => {
    const filePath = path.resolve('/datapool/ATMA00/down_json.py');
    res.download(filePath); // 触发文件下载
});
app.get('/get-files', (req, res) => {
    // const date = req.params.date;
    // const folderPath = path.join(baseFolderPath, date);
    
    fs.readdir(baseFolderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取文件夹' });
        }
        // 返回文件列表
        const dateFolders = files.filter(file => {
            return /^\d{4}-\d{2}-\d{2}$/.test(file) && fs.statSync(path.join(baseFolderPath, file)).isDirectory();
        });
        res.json(dateFolders);
    });
});

// 处理文件请求
app.get('/get-files1/:date', (req, res) => {
    const date = req.params.date;
    const folderPath = path.join(baseFolderPath, date);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取文件夹' });
        }
        // 返回文件列表
        res.json(files);
    });
});

app.get('/get-files2/:date', (req, res) => {
    const date = req.params.date;
    const folderPath = path.join(baseFolderPath1, date);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取文件夹' });
        }
        // 返回文件列表
        res.json(files);
    });
});

app.use('/files', express.static(baseFolderPath));
app.use('/files1', express.static(baseFolderPath1));
app.use('/files2', express.static(baseFolderPath2));

app.get('/fetch-files/:ra/:dec', (req, res) => {
    // const ra1 = req.params.ra;
    // const ra = parseFloat(ra1);
    // const dec1 = req.params.dec;
    // const dec = parseFloat(dec1);
    // console.log(ra)
    // console.log(dec)
    const ra = req.params.ra;
    const dec = req.params.dec;
    // console.log(ra)
    // console.log(dec)
    // 确保参数被转换为浮点数
    const raFloat = parseFloat(ra);
    const decFloat = parseFloat(dec);

    let options = {
        args: [raFloat, decFloat]
    };

    // PythonShell.run('/data/public/xqf/works/show_ipv4/match.py', options, (err, results) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).json({ error: 'Error executing Python script' });
    //     }
    //     res.json(JSON.parse(results[0]));
    // });
    const pythonProcess = spawn('python3', ['/data/public/xqf/works/show_ipv4/file-list-app/match1.py', raFloat, decFloat]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: `Python script exited with code ${code}` });
        }
        res.json(JSON.parse(result));
    });
});

// app.get('/fetch-files/:ra/:dec', (req, res) => {
//     const ra = req.params.ra;
//     const dec = req.params.dec;
//     // console.log(ra)
//     // console.log(dec)
//     processRadec(ra, dec, (result) => {
//         res.json(result);
//     });
// });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
