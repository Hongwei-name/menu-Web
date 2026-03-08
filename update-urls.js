const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库路径
const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// 实用网址数据
const urlsData = [
  { title: '图片格式转换', url: 'https://toolonline.net/convert-image', category: 'tools', description: '在线图片格式转换工具' },
  { title: 'hello图床', url: 'https://www.helloimg.com', category: 'entertainment', description: '免费图片分享平台' },
  { title: 'libvio看美剧', url: 'https://www.libvio.link/', category: 'entertainment', description: '美剧观看网站' },
  { title: '数学几何画图', url: 'https://www.geogebra.org/classic?lang=zh_CN', category: 'learning', description: '强大的数学几何绘图工具' },
  { title: '免费高清壁纸', url: 'https://haowallpaper.com/', category: 'entertainment', description: '海量高清壁纸下载' },
  { title: '英语4级', url: 'https://pastpapers.cn/cet-4/', category: 'learning', description: '英语四级真题和备考资料' },
  { title: '图片拼接', url: 'https://www.lddgo.net/image/stitching-image', category: 'tools', description: '在线图片拼接工具' },
  { title: '简历模板', url: 'https://www.jianlimoban-ziyuan.com/zhongwen/', category: 'resources', description: '精美简历模板下载' },
  { title: 'python学习', url: 'https://liaoxuefeng.com/books/python/basic/index.html', category: 'learning', description: '廖雪峰Python教程' },
  { title: '徽章生成', url: 'https://api.kexig.cn/Shields/', category: 'tools', description: '在线徽章生成工具' },
  { title: 'ventoy安装', url: 'https://juejin.cn/post/7501589510268059648', category: 'resources', description: 'Ventoy多系统启动盘制作教程' },
  { title: 'Chrome插件下载站', url: 'https://crxdl.com/', category: 'tools', description: 'Chrome浏览器插件下载' },
  { title: '背单词', url: 'https://www.qwertylearner.cn/', category: 'learning', description: '在线背单词工具' },
  { title: '破解工具', url: 'https://so0000.com/windows.html', category: 'resources', description: 'Windows软件破解工具' }
];

// 连接数据库
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    updateUrls();
  }
});

async function updateUrls() {
  try {
    // 开始事务
    await run('BEGIN TRANSACTION');
    
    // 清空现有的urls表
    await run('DELETE FROM urls');
    console.log('Cleared existing URLs');
    
    // 插入新的网址数据
    for (let i = 0; i < urlsData.length; i++) {
      const url = urlsData[i];
      const id = `url-${i + 1}`;
      await run(
        'INSERT INTO urls (id, title, url, category, description) VALUES (?, ?, ?, ?, ?)',
        [id, url.title, url.url, url.category, url.description]
      );
      console.log(`Inserted: ${url.title}`);
    }
    
    // 提交事务
    await run('COMMIT');
    console.log('All URLs updated successfully');
  } catch (error) {
    // 回滚事务
    await run('ROLLBACK');
    console.error('Error updating URLs:', error.message);
  } finally {
    // 关闭数据库连接
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

// 封装run方法为Promise
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}