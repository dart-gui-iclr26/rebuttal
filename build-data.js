import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TRAJECTORIES_DIR = path.join(__dirname, 'trajectories')
const OUTPUT_DIR = path.join(__dirname, 'public', 'data')

// Helper function to read image as base64
function readImageBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) return null
    const imageBuffer = fs.readFileSync(imagePath)
    return `data:image/png;base64,${imageBuffer.toString('base64')}`
  } catch (err) {
    console.error(`Error reading image ${imagePath}:`, err)
    return null
  }
}

// Helper function to extract coordinates from action text
function extractCoordinates(actionText) {
  const patterns = [
    { regex: /click\(start_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>'\)/, type: 'click' },
    { regex: /left_double\(start_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>'\)/, type: 'left_double' },
    { regex: /right_single\(start_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>'\)/, type: 'right_single' },
    { regex: /drag\(start_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>', end_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>'\)/, type: 'drag' },
    { regex: /scroll\(start_box='<\|box_start\|>\((\d+),(\d+)\)<\|box_end\|>'/, type: 'scroll' }
  ]
  
  const srcW = 1932, srcH = 1092
  const dstW = 1920, dstH = 1080
  
  function normalizeAndMap(x, y) {
    const xNorm = x / srcW
    const yNorm = y / srcH
    return [Math.round(xNorm * dstW), Math.round(yNorm * dstH)]
  }
  
  for (const { regex, type } of patterns) {
    const match = actionText.match(regex)
    if (match) {
      if (type === 'drag') {
        const start = normalizeAndMap(parseInt(match[1]), parseInt(match[2]))
        const end = normalizeAndMap(parseInt(match[3]), parseInt(match[4]))
        return { coordinates: [start, end], actionType: type }
      } else {
        const coords = normalizeAndMap(parseInt(match[1]), parseInt(match[2]))
        return { coordinates: [coords], actionType: type }
      }
    }
  }
  
  return { coordinates: null, actionType: null }
}

function processMessages(messages, trajPath) {
  const stepData = []
  
  if (messages.length >= 3) {
    const systemMsg = messages[0]
    const userMsg = messages[1]
    const assistantMsg = messages[2]
    
    const step1Messages = [
      processMessage(systemMsg, trajPath, null),
      processMessage(userMsg, trajPath, assistantMsg),
      processMessage(assistantMsg, trajPath, null)
    ]
    
    stepData.push({ messages: step1Messages })
    
    for (let i = 3; i < messages.length; i += 2) {
      if (i + 1 < messages.length) {
        const userMsg = messages[i]
        const assistantMsg = messages[i + 1]
        
        const stepMessages = [
          processMessage(userMsg, trajPath, assistantMsg),
          processMessage(assistantMsg, trajPath, null)
        ]
        
        stepData.push({ messages: stepMessages })
      }
    }
  }
  
  return stepData
}

function processMessage(msg, trajPath, nextAssistantMsg) {
  const processed = {
    role: msg.role,
    content: []
  }
  
  const content = msg.content
  
  if (typeof content === 'string') {
    processed.content.push({ type: 'text', text: content })
  } else if (Array.isArray(content)) {
    content.forEach(item => {
      if (item.type === 'text') {
        processed.content.push({ type: 'text', text: item.text || '' })
      } else if (item.type === 'image' || item.type === 'image_url') {
        const imageUrl = item.image_url || item.image || ''
        let imageData = null
        let coordinates = null
        let actionType = null
        
        if (imageUrl.startsWith('data:image')) {
          imageData = imageUrl
        } else {
          let imagePath = path.join(trajPath, imageUrl)
          if (!imagePath.endsWith('.png')) {
            imagePath += '.png'
          }
          imageData = readImageBase64(imagePath)
        }
        
        if (msg.role === 'user' && nextAssistantMsg) {
          const assistantContent = nextAssistantMsg.content
          if (Array.isArray(assistantContent)) {
            for (const assItem of assistantContent) {
              if (assItem.type === 'text') {
                const result = extractCoordinates(assItem.text || '')
                coordinates = result.coordinates
                actionType = result.actionType
                break
              }
            }
          }
        }
        
        if (imageData) {
          processed.content.push({
            type: 'image',
            imageData: imageData,
            coordinates: coordinates,
            actionType: actionType
          })
        }
      }
    })
  }
  
  return processed
}

// Main build function
function buildData() {
  console.log('Building trajectory data for static deployment...')
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }
  
  if (!fs.existsSync(TRAJECTORIES_DIR)) {
    console.error('Trajectories directory not found!')
    return
  }
  
  const trajDirs = fs.readdirSync(TRAJECTORIES_DIR).filter(file => {
    const fullPath = path.join(TRAJECTORIES_DIR, file)
    return fs.statSync(fullPath).isDirectory()
  })
  
  console.log(`Found ${trajDirs.length} trajectories`)
  
  // Build trajectory list
  const trajectories = trajDirs.map(dir => {
    const trajPath = path.join(TRAJECTORIES_DIR, dir)
    const taskConfigPath = path.join(trajPath, 'task_config.json')
    const rewardPath = path.join(trajPath, 'reward.txt')
    const finalMessagesPath = path.join(trajPath, 'final_messages.json')
    
    let taskConfig = {}
    let reward = 'N/A'
    let steps = 0
    
    try {
      if (fs.existsSync(taskConfigPath)) {
        taskConfig = JSON.parse(fs.readFileSync(taskConfigPath, 'utf-8'))
      }
      if (fs.existsSync(rewardPath)) {
        reward = fs.readFileSync(rewardPath, 'utf-8').trim()
      }
      if (fs.existsSync(finalMessagesPath)) {
        const messages = JSON.parse(fs.readFileSync(finalMessagesPath, 'utf-8'))
        if (messages.length >= 3) {
          steps = 1 + Math.floor((messages.length - 3) / 2)
        }
      }
    } catch (err) {
      console.error(`Error reading trajectory ${dir}:`, err)
    }
    
    return {
      id: dir,
      name: dir,
      task_id: taskConfig.task_id || taskConfig.id || 'Unknown',
      instruction: taskConfig.instruction || '',
      reward: reward,
      steps: steps,
      os: taskConfig.os || 'N/A'
    }
  })
  
  // Write trajectory list
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'trajectories.json'),
    JSON.stringify(trajectories, null, 2)
  )
  console.log('✓ Generated trajectories.json')
  
  // Build detailed trajectory data
  trajDirs.forEach((dir, index) => {
    console.log(`Processing ${index + 1}/${trajDirs.length}: ${dir}`)
    
    const trajPath = path.join(TRAJECTORIES_DIR, dir)
    const taskConfigPath = path.join(trajPath, 'task_config.json')
    const rewardPath = path.join(trajPath, 'reward.txt')
    const finalMessagesPath = path.join(trajPath, 'final_messages.json')
    
    if (!fs.existsSync(finalMessagesPath)) {
      console.warn(`  ⚠ Skipping ${dir}: final_messages.json not found`)
      return
    }
    
    try {
      const taskConfig = fs.existsSync(taskConfigPath) 
        ? JSON.parse(fs.readFileSync(taskConfigPath, 'utf-8'))
        : {}
      
      const reward = fs.existsSync(rewardPath)
        ? fs.readFileSync(rewardPath, 'utf-8').trim()
        : 'N/A'
      
      const messages = JSON.parse(fs.readFileSync(finalMessagesPath, 'utf-8'))
      const stepData = processMessages(messages, trajPath)
      
      const trajectory = {
        id: dir,
        name: dir,
        task_id: taskConfig.task_id || taskConfig.id || 'Unknown',
        instruction: taskConfig.instruction || '',
        reward: reward,
        steps: stepData.length,
        os: taskConfig.os || 'N/A',
        stepData: stepData
      }
      
      // Write individual trajectory file
      const outputPath = path.join(OUTPUT_DIR, `${dir}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(trajectory, null, 2))
      console.log(`  ✓ Generated ${dir}.json`)
    } catch (err) {
      console.error(`  ✗ Error processing ${dir}:`, err.message)
    }
  })
  
  console.log('\n✅ Build complete!')
}

buildData()

