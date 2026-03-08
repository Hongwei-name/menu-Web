import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

let db: sqlite3.Database | null = null;

export async function initializeDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        createTables().then(() => {
          resolve(db!);
        }).catch(reject);
      }
    });
  });
}

async function createTables() {
  if (!db) throw new Error('Database not initialized');

  await run(`
    CREATE TABLE IF NOT EXISTS urls (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      logo_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const categories = await query('SELECT COUNT(*) as count FROM categories');
  if (!categories || categories.length === 0 || categories[0].count === 0) {
    await seedCategories();
  }

  const urls = await query('SELECT COUNT(*) as count FROM urls');
  if (!urls || urls.length === 0 || urls[0].count === 0) {
    await seedUrls();
  }

  const settings = await query('SELECT COUNT(*) as count FROM settings');
  if (!settings || settings.length === 0 || settings[0].count === 0) {
    await seedSettings();
  }
}

async function seedCategories() {
  if (!db) throw new Error('Database not initialized');

  const categories = [
    { id: 'tools', name: '工具类', color: '#3B82F6' },
    { id: 'learning', name: '学习类', color: '#10B981' },
    { id: 'entertainment', name: '娱乐类', color: '#F59E0B' },
    { id: 'resources', name: '资源类', color: '#EF4444' },
  ];

  for (const category of categories) {
    await run('INSERT INTO categories (id, name, color) VALUES (?, ?, ?)', [category.id, category.name, category.color]);
  }
}

async function seedUrls() {
  if (!db) throw new Error('Database not initialized');

  const urls = [
    { id: 'url-1', title: 'Crxdl', url: 'https://www.crxdl.com', category: 'tools', description: 'Chrome扩展下载', logo_path: '/logos/crxdl.ico' },
    { id: 'url-2', title: 'ToolOnline', url: 'https://www.toolonline.net', category: 'tools', description: '在线工具集合', logo_path: '/logos/toolonline.ico' },
    { id: 'url-3', title: 'Lddgo', url: 'https://www.lddgo.net', category: 'tools', description: '在线开发工具', logo_path: '/logos/lddgo.ico' },
    { id: 'url-4', title: 'Juejin', url: 'https://juejin.cn', category: 'learning', description: '技术社区', logo_path: '/logos/juejin.ico' },
    { id: 'url-5', title: 'Liaoxuefeng', url: 'https://www.liaoxuefeng.com', category: 'learning', description: '廖雪峰的官方网站', logo_path: '/logos/liaoxuefeng.ico' },
    { id: 'url-6', title: 'PastPapers', url: 'https://www.pastpapers.co', category: 'learning', description: '历年试卷下载', logo_path: '/logos/pastpapers.ico' },
    { id: 'url-7', title: 'HelloImg', url: 'https://www.helloimg.com', category: 'entertainment', description: '图片分享平台', logo_path: '/logos/helloimg.ico' },
    { id: 'url-8', title: 'Haowallpaper', url: 'https://www.haowallpaper.com', category: 'entertainment', description: '高清壁纸下载', logo_path: '/logos/haowallpaper.ico' },
    { id: 'url-9', title: 'Geogebra', url: 'https://www.geogebra.org', category: 'resources', description: '数学教学工具', logo_path: '/logos/geogebra.ico' },
    { id: 'url-10', title: 'Jianlimoban', url: 'https://www.jianlimoban.com', category: 'resources', description: '简历模板下载', logo_path: '/logos/jianlimoban.ico' },
  ];

  for (const url of urls) {
    await run('INSERT INTO urls (id, title, url, category, description, logo_path) VALUES (?, ?, ?, ?, ?, ?)', [url.id, url.title, url.url, url.category, url.description, url.logo_path]);
  }
}

async function seedSettings() {
  if (!db) throw new Error('Database not initialized');

  const settings = [
    { key: 'site_name', value: '导航网站' },
    { key: 'site_description', value: '简洁实用的导航网站' },
    { key: 'site_keywords', value: '导航, 工具, 资源, 学习, 娱乐' },
    { key: 'theme', value: 'light' },
    { key: 'enable_dark_mode', value: 'true' },
    { key: 'enable_notifications', value: 'true' },
    { key: 'primary_color', value: '#165DFF' },
    { key: 'card_radius', value: 'medium' },
    { key: 'card_shadow', value: 'small' },
    { key: 'font_size', value: 'medium' },
    { key: 'enable_animations', value: 'true' },
    { key: 'show_category_icons', value: 'true' },
    { key: 'admin_email', value: 'admin@example.com' },
    { key: 'admin_password', value: '********' },
    { key: 'allow_guest_access', value: 'true' },
    { key: 'allow_guest_search', value: 'true' },
    { key: 'enable_api', value: 'false' },
    { key: 'enable_export', value: 'true' },
    { key: 'layout', value: 'grid' },
  ];

  for (const setting of settings) {
    await run('INSERT INTO settings (key, value) VALUES (?, ?)', [setting.key, setting.value]);
  }
}

export function query(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export function run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

export function getDatabase() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export default db;