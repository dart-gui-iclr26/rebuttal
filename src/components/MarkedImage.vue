<template>
  <div class="marked-image">
    <canvas ref="canvas" class="image-canvas"></canvas>
    <div v-if="coordinates" class="coordinates-info">
      Mouse coordinates: {{ JSON.stringify(coordinates) }} (Action: {{ actionType }})
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarkedImage',
  props: {
    imageData: {
      type: String,
      required: true
    },
    coordinates: {
      type: Array,
      default: null
    },
    actionType: {
      type: String,
      default: null
    }
  },
  mounted() {
    this.drawImage()
  },
  watch: {
    imageData() {
      this.drawImage()
    },
    coordinates() {
      this.drawImage()
    }
  },
  methods: {
    drawImage() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        if (this.coordinates && this.coordinates.length > 0) {
          this.drawTargets(ctx)
        }
      }
      
      img.src = this.imageData
    },
    
    drawTargets(ctx) {
      const targetSize = 20
      const lineWidth = 3
      const opacity = 0.7
      
      ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`
      ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`
      ctx.lineWidth = lineWidth
      
      // Draw target circles for each coordinate
      this.coordinates.forEach(coord => {
        const [x, y] = coord
        
        // Outer circle
        ctx.beginPath()
        ctx.arc(x, y, targetSize, 0, 2 * Math.PI)
        ctx.stroke()
        
        // Inner circle
        ctx.beginPath()
        ctx.arc(x, y, targetSize / 2, 0, 2 * Math.PI)
        ctx.stroke()
        
        // Crosshair
        ctx.beginPath()
        ctx.moveTo(x - targetSize, y)
        ctx.lineTo(x + targetSize, y)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(x, y - targetSize)
        ctx.lineTo(x, y + targetSize)
        ctx.stroke()
      })
      
      // Draw arrow for drag action
      if (this.actionType === 'drag' && this.coordinates.length >= 2) {
        const [startX, startY] = this.coordinates[0]
        const [endX, endY] = this.coordinates[1]
        
        ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`
        
        // Draw line
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        
        // Draw arrowhead
        const dx = endX - startX
        const dy = endY - startY
        const length = Math.sqrt(dx * dx + dy * dy)
        
        if (length > 0) {
          const arrowLength = 15
          const arrowAngle = 30 * Math.PI / 180
          
          const ux = dx / length
          const uy = dy / length
          
          // First arrow wing
          const angle1 = Math.PI + arrowAngle
          const wing1X = endX + arrowLength * (ux * Math.cos(angle1) - uy * Math.sin(angle1))
          const wing1Y = endY + arrowLength * (ux * Math.sin(angle1) + uy * Math.cos(angle1))
          
          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(wing1X, wing1Y)
          ctx.stroke()
          
          // Second arrow wing
          const angle2 = Math.PI - arrowAngle
          const wing2X = endX + arrowLength * (ux * Math.cos(angle2) - uy * Math.sin(angle2))
          const wing2Y = endY + arrowLength * (ux * Math.sin(angle2) + uy * Math.cos(angle2))
          
          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(wing2X, wing2Y)
          ctx.stroke()
        }
      }
    }
  }
}
</script>

<style scoped>
.marked-image {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.image-canvas {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.coordinates-info {
  margin-top: 10px;
  padding: 8px 12px;
  background: #ffe6e6;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #333;
}
</style>

