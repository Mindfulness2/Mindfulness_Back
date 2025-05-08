const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

async function appendSuggestions() {
  // 1. 连接 MongoDB (替换为你的连接字符串)
  const client = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  try {
    await client.connect();
    console.log('成功连接到MongoDB');

    // 2. 指定数据库和集合 (替换为你的数据库和集合名)
    const db = client.db('mindful');
    const collection = db.collection('users');

    // 3. 读取JSONL文件 (确保文件路径正确)
    const jsonlData = fs.readFileSync('suggestions.jsonl', 'utf8');
    const lines = jsonlData.split('\n').filter(line => line.trim());

    // 4. 准备批量更新操作
    const bulkOps = lines.map(line => {
      try {
        const entry = JSON.parse(line);
        const date = Object.keys(entry)[0];
        const message = entry[date];

        return {
          updateOne: {
            filter: { _id: new ObjectId('67b635b24c5e2c6c1b82ae3a') }, // 注意这里使用 new
            update: {
              $push: {
                [`historysuggestion.${date}`]: message
              }
            }
          }
        };
      } catch (e) {
        console.error('解析行失败:', line, '错误:', e.message);
        return null;
      }
    }).filter(op => op !== null);

    // 5. 执行批量操作
    if (bulkOps.length > 0) {
      const result = await collection.bulkWrite(bulkOps);
      console.log(`成功更新文档，修改了 ${result.modifiedCount} 处`);
    } else {
      console.log('没有有效的更新操作');
    }

  } catch (err) {
    console.error('脚本执行出错:', err);
  } finally {
    // 6. 关闭连接
    await client.close();
    console.log('已关闭数据库连接');
  }
}

// 运行脚本
appendSuggestions();