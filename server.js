const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 確保數據目錄存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化問卷數據文件
const questionnairesPath = path.join(dataDir, 'questionnaires.json');
if (!fs.existsSync(questionnairesPath)) {
    fs.writeFileSync(questionnairesPath, '{}', 'utf8');
}

// 中間件設置
app.use(bodyParser.json());
app.use(express.static('public'));

// API 路由 - 獲取問卷數據
app.get('/api/questionnaires', (req, res) => {
    try {
        const data = fs.readFileSync(questionnairesPath, 'utf8');
        res.json(JSON.parse(data || '{}'));
    } catch (error) {
        console.error('獲取問卷數據失敗:', error);
        res.status(500).json({ error: '獲取數據失敗' });
    }
});

// API 路由 - 更新問卷
app.post('/api/update-questionnaire', (req, res) => {
    try {
        const questionnaires = req.body;
        fs.writeFileSync(questionnairesPath, JSON.stringify(questionnaires), 'utf8');
        res.json({ success: true, message: '問卷數據已更新' });
    } catch (error) {
        console.error('更新問卷失敗:', error);
        res.status(500).json({ error: '更新失敗' });
    }
});

// 所有其他路由返回主頁
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`服務器運行在 http://localhost:${port}`);
});