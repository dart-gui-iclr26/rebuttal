import fs from 'fs';
import path from 'path';

const trajectoryDir = './trajectories';
const outputDir = './public/data';

// 读取所有轨迹文件夹
const allDirs = fs.readdirSync(trajectoryDir);

console.log(`Found ${allDirs.length} trajectory directories`);

// 用于存储按应用分组的轨迹
const appDomains = {
  'chrome': [],
  'firefox': [],
  'gimp': [],
  'libreoffice': [],
  'vscode': [],
  'terminal': [],
  'file_manager': [],
  'system': [],
  'other': []
};

// 关键词映射
const appKeywords = {
  'chrome': ['chrome', 'browser', 'webpage', 'website', 'google', 'bookmark'],
  'firefox': ['firefox', 'mozilla'],
  'gimp': ['gimp', 'image editing', 'photo', 'cymk', 'palette'],
  'libreoffice': ['libreoffice', 'writer', 'calc', 'impress', 'document', 'spreadsheet', 'h2o', 'subscript'],
  'vscode': ['vs code', 'vscode', 'code editor', 'vsix', 'extension'],
  'terminal': ['terminal', 'command', 'bash', 'shell', 'execute'],
  'file_manager': ['file manager', 'nautilus', 'folder', 'directory'],
  'system': ['settings', 'control panel', 'privacy', 'do not track', 'system preferences']
};

// 遍历所有文件夹
for (const dir of allDirs) {
  const dirPath = path.join(trajectoryDir, dir);
  const rewardFile = path.join(dirPath, 'reward.txt');
  const finalMessagesFile = path.join(dirPath, 'final_messages.json');
  
  // 检查reward.txt是否存在
  if (!fs.existsSync(rewardFile)) {
    continue;
  }
  
  // 读取reward值
  const reward = fs.readFileSync(rewardFile, 'utf8').trim();
  
  // 只保留reward=1.0的轨迹
  if (reward !== '1.0' && reward !== '1') {
    continue;
  }
  
  // 从文件夹名提取task_id
  const taskId = dir.split('_')[0];
  
  // 读取final_messages.json获取instruction
  let instruction = 'N/A';
  let steps = 0;
  
  if (fs.existsSync(finalMessagesFile)) {
    try {
      const messages = JSON.parse(fs.readFileSync(finalMessagesFile, 'utf8'));
      // 从第一个user消息中提取instruction
      for (const msg of messages) {
        if (msg.role === 'user' && msg.content) {
          if (Array.isArray(msg.content)) {
            for (const item of msg.content) {
              if (item.type === 'text' && item.text.includes('## User Instruction')) {
                instruction = item.text.split('## User Instruction\n')[1]?.split('\n')[0] || 'N/A';
                break;
              }
            }
          }
          if (instruction !== 'N/A') break;
        }
      }
      // 计算步骤数
      const images = fs.readdirSync(dirPath).filter(f => f.startsWith('image_') && f.endsWith('.png'));
      steps = images.length;
    } catch (e) {
      console.error(`Error reading ${finalMessagesFile}:`, e.message);
      continue;
    }
  }
  
  // 分类到对应的app domain
  const instructionLower = instruction.toLowerCase();
  let classified = false;
  
  for (const [app, keywords] of Object.entries(appKeywords)) {
    if (keywords.some(keyword => instructionLower.includes(keyword))) {
      appDomains[app].push({
        id: dir,
        name: dir,
        task_id: taskId,
        instruction: instruction,
        reward: reward,
        steps: steps,
        dirPath: dirPath
      });
      classified = true;
      break;
    }
  }
  
  if (!classified) {
    appDomains['other'].push({
      id: dir,
      name: dir,
      task_id: taskId,
      instruction: instruction,
      reward: reward,
      steps: steps,
      dirPath: dirPath
    });
  }
}

// 打印每个app domain的统计
console.log('\n=== App Domain Statistics ===');
for (const [app, trajectories] of Object.entries(appDomains)) {
  if (trajectories.length > 0) {
    console.log(`${app}: ${trajectories.length} trajectories`);
  }
}

// 从每个app domain选择1-2条代表性轨迹
const selectedTrajectories = [];

for (const [app, trajectories] of Object.entries(appDomains)) {
  if (trajectories.length === 0) continue;
  
  // 按步骤数排序，选择步骤适中的（不太长也不太短）
  trajectories.sort((a, b) => a.steps - b.steps);
  
  // 选择中等长度的轨迹（更有代表性）
  const numToSelect = Math.min(2, trajectories.length);
  const startIdx = Math.floor(trajectories.length / 3); // 从1/3位置开始选
  
  for (let i = 0; i < numToSelect; i++) {
    const idx = Math.min(startIdx + i, trajectories.length - 1 - i);
    const traj = trajectories[idx];
    selectedTrajectories.push({
      id: traj.id,
      name: traj.name,
      task_id: traj.task_id,
      instruction: traj.instruction,
      reward: traj.reward,
      steps: traj.steps,
      app_domain: app,
      os: 'Ubuntu 22.04'
    });
    console.log(`Selected [${app}]: ${traj.id} (${traj.steps} steps)`);
  }
}

console.log(`\n=== Total selected: ${selectedTrajectories.length} trajectories ===\n`);

// 保存trajectories.json
const outputJsonPath = path.join(outputDir, 'trajectories.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(selectedTrajectories, null, 2));
console.log(`Saved trajectories.json to ${outputJsonPath}`);

// 复制轨迹文件和图片
console.log('\n=== Copying trajectory files and images ===');
for (const traj of selectedTrajectories) {
  const srcDir = path.join(trajectoryDir, traj.id);
  const finalMessagesPath = path.join(srcDir, 'final_messages.json');
  const destJsonFile = path.join(outputDir, `${traj.id}.json`);
  
  // 复制final_messages.json
  try {
    const content = fs.readFileSync(finalMessagesPath, 'utf8');
    fs.writeFileSync(destJsonFile, content);
    console.log(`Copied: ${traj.id}.json`);
  } catch (e) {
    console.error(`Error copying ${traj.id}:`, e.message);
    continue;
  }
  
  // 创建图片目录
  const imageDestDir = path.join(outputDir, traj.id);
  if (!fs.existsSync(imageDestDir)) {
    fs.mkdirSync(imageDestDir, { recursive: true });
  }
  
  // 复制所有图片
  try {
    const files = fs.readdirSync(srcDir);
    const imageFiles = files.filter(f => f.startsWith('image_') && f.endsWith('.png'));
    
    for (const imageFile of imageFiles) {
      const srcImage = path.join(srcDir, imageFile);
      const destImage = path.join(imageDestDir, imageFile);
      fs.copyFileSync(srcImage, destImage);
    }
    console.log(`  Copied ${imageFiles.length} images`);
  } catch (e) {
    console.error(`Error copying images for ${traj.id}:`, e.message);
  }
}

console.log('\n✅ Done!');

