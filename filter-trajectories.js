import fs from 'fs';
import path from 'path';

const trajectoryDir = './trajectories/results_42';
const outputDir = './public/data';

// 读取所有轨迹文件夹
const allDirs = fs.readdirSync(trajectoryDir);

console.log(`Found ${allDirs.length} trajectory directories`);

// 用于存储按task_id分组的轨迹
const groupedTrajectories = {};

// 遍历所有文件夹
for (const dir of allDirs) {
  const dirPath = path.join(trajectoryDir, dir);
  const rewardFile = path.join(dirPath, 'reward.txt');
  const finalMessagesFile = path.join(dirPath, 'final_messages.json');
  
  // 检查reward.txt是否存在
  if (!fs.existsSync(rewardFile)) {
    console.log(`Skipping ${dir} - no reward.txt`);
    continue;
  }
  
  // 读取reward值
  const reward = fs.readFileSync(rewardFile, 'utf8').trim();
  
  // 只保留reward=1.0的轨迹
  if (reward !== '1.0' && reward !== '1') {
    continue;
  }
  
  // 从文件夹名提取task_id (第一个UUID)
  const taskId = dir.split('_')[0];
  
  if (!groupedTrajectories[taskId]) {
    groupedTrajectories[taskId] = [];
  }
  
  // 读取final_messages.json获取更多信息
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
      // 计算步骤数（图片数量）
      const images = fs.readdirSync(dirPath).filter(f => f.startsWith('image_') && f.endsWith('.png'));
      steps = images.length;
    } catch (e) {
      console.error(`Error reading ${finalMessagesFile}:`, e.message);
    }
  }
  
  groupedTrajectories[taskId].push({
    id: dir,
    name: dir,
    task_id: taskId,
    instruction: instruction,
    reward: reward,
    steps: steps,
    dirPath: dirPath
  });
}

console.log(`\nFound ${Object.keys(groupedTrajectories).length} unique task_ids with reward=1.0`);

// 从每个task_id选择1-2条轨迹
const selectedTrajectories = [];
for (const [taskId, trajectories] of Object.entries(groupedTrajectories)) {
  // 按步骤数排序，选择步骤较少的（通常更高效）
  trajectories.sort((a, b) => a.steps - b.steps);
  
  // 如果只有一条，选择一条；否则选择前两条
  const numToSelect = Math.min(2, trajectories.length);
  for (let i = 0; i < numToSelect; i++) {
    const traj = trajectories[i];
    selectedTrajectories.push({
      id: traj.id,
      name: traj.name,
      task_id: traj.task_id,
      instruction: traj.instruction,
      reward: traj.reward,
      steps: traj.steps,
      os: 'N/A'
    });
    console.log(`Selected: ${traj.id} (${traj.steps} steps)`);
  }
}

console.log(`\nTotal selected: ${selectedTrajectories.length} trajectories`);

// 保存trajectories.json
const outputJsonPath = path.join(outputDir, 'trajectories.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(selectedTrajectories, null, 2));
console.log(`\nSaved trajectories.json to ${outputJsonPath}`);

// 输出需要复制的文件列表
console.log('\n=== Files to copy ===');
for (const traj of selectedTrajectories) {
  const srcDir = path.join(trajectoryDir, traj.id);
  const destFile = path.join(outputDir, `${traj.id}.json`);
  console.log(`${srcDir}/final_messages.json -> ${destFile}`);
  
  // 复制final_messages.json
  try {
    const content = fs.readFileSync(path.join(srcDir, 'final_messages.json'), 'utf8');
    fs.writeFileSync(destFile, content);
  } catch (e) {
    console.error(`Error copying ${traj.id}:`, e.message);
  }
}

console.log('\nDone!');

