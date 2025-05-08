const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'mindful';

app.use(cors());
app.use(express.json());

app.get('/api/suggestions', async (req, res) => {
  const { date } = req.query;
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ _id: new ObjectId('67b635b24c5e2c6c1b82ae3a') });
    if (!user) {
      console.log('未找到用户');
      return res.json({ suggestions: [] });
    }
    if (!user.historysuggestion) {
      console.log('用户没有 historysuggestion 字段');
      return res.json({ suggestions: [] });
    }
    const suggestions = user.historysuggestion[date] || [];
    console.log(`查询日期 ${date} 的建议:`, suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('查询失败:', error);
    res.status(500).json({ error: '查询失败' });
  } finally {
    await client.close();
  }
});

// 新增POST接口来添加suggestion
app.post('/api/suggestions/add', async (req, res) => {
  const { userId, date, suggestion } = req.body;
  
  if (!userId || !date || !suggestion) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    // 更新用户的historysuggestion字段
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: {
          [`historysuggestion.${date}`]: suggestion
        }
      },
      { upsert: true } // 如果没有该字段则创建
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: '未找到用户' });
    }

    console.log(`成功为用户 ${userId} 添加 ${date} 的suggestion`);
    res.json({ success: true, message: 'Suggestion 已记录' });

  } catch (error) {
    console.error('添加suggestion失败:', error);
    res.status(500).json({ error: '服务器错误，添加suggestion失败' });
  } finally {
    await client.close();
  }
});

app.get('/api/scores', async (req, res) => {
    const { date } = req.query;
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        
        const user = await db.collection('users').findOne({ 
            _id: new ObjectId('67b635b24c5e2c6c1b82ae3a') 
        });

        if (!user) {
            return res.json({ scores: [] });
        }

        let scores = [];
        if (user.historyscore && user.historyscore[date]) {
            scores = typeof user.historyscore[date] === 'string' 
                   ? [user.historyscore[date]] 
                   : user.historyscore[date];
        }

        res.json({ scores });
        
    } catch (error) {
        console.error('查询失败:', error);
        res.status(500).json({ error: '查询失败' });
    } finally {
        await client.close();
    }
});

app.get('/api/login', async (req, res) => {
    const { username, password } = req.query;
    const client = new MongoClient(url);
  
    try {
      await client.connect();
      console.log('Connected to MongoDB for login');
  
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
  
      const user = await usersCollection.findOne({ username, password });
  
      if (!user) {
        console.log(`未找到用户: username=${username}, password=${password}`);
        return res.status(401).json({
          success: false,
          message: '用户名或密码错误'
        });
      }
  
      console.log('用户登录成功:', user.username);
      res.status(200).json({
        success: true,
        message: '登录成功',
        data: { username: user.username }
      });
    } catch (error) {
      console.error('登录查询失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误，请稍后重试',
        error: error.message
      });
    } finally {
      await client.close();
      console.log('MongoDB connection closed for login');
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.query; // 与前端保持一致使用查询参数
    const client = new MongoClient(url);
  
    try {
      await client.connect();
      console.log('Connected to MongoDB for register');
  
      const db = client.db(dbName);
      const usersCollection = db.collection('users');
  
      // 检查用户名是否已存在
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        console.log(`用户名已存在: ${username}`);
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
  
      // 创建新用户
      const newUser = {
        username,
        password,
        historysuggestion: {}, // 初始化为空对象，与现有数据结构保持一致
        historyscore: {}      // 初始化为空对象，与现有数据结构保持一致
      };
  
      const result = await usersCollection.insertOne(newUser);
      
      if (result.insertedId) {
        console.log('用户注册成功:', username);
        res.status(201).json({
          success: true,
          message: '注册成功',
          data: { username }
        });
      } else {
        throw new Error('用户插入失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误，请稍后重试',
        error: error.message
      });
    } finally {
      await client.close();
      console.log('MongoDB connection closed for register');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));