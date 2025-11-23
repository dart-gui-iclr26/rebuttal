<template>
  <div id="app">
    
    <div class="overview-section">
      <div class="overview-container">
        
        <div class="overview-hero">
          <h1>DART</h1>
          <p class="subtitle">Efficient Multi-turn RL for GUI Agents via Decoupled Training and Adaptive Data Curation</p>
          <p class="notice-anon">🔒 Anonymous Submission for Review</p>
        </div>
        
        <div class="results-section" style="margin-top: 40px;">
          <h2 style="text-align: center; margin-bottom: 30px; font-size: 1.5rem; color: #2c3e50;">Failure Case Analysis</h2>
          
          <div class="results-grid" style="display: grid; grid-template-columns: 1fr; gap: 50px; max-width: 1000px; margin: 0 auto;">
            <div 
              v-for="img in gridImages" 
              v-bind:key="img.id" 
              class="result-card"
              style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #eee;"
            >
              <div class="image-container" v-bind:style="{ backgroundColor: img.bgColor || '#f8fafc' }" style="width: 100%; height: 500px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                
                <img 
                  v-if="img.src"
                  v-bind:src="img.src" 
                  v-bind:alt="img.title" 
                  style="width: 100%; height: 100%; object-fit: contain; position: absolute; top: 0; left: 0; z-index: 10;"
                  onerror="this.style.display='none'"
                />
                
                <div style="text-align: center; color: #94a3b8; z-index: 1;">
                  <span style="display: block; font-size: 2rem; margin-bottom: 10px;">🖼️</span>
                  <span style="font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Figure {{ img.id }}</span>
                  <div style="font-size: 0.7rem; margin-top: 4px; opacity: 0.7;">Image not found</div>
                </div>
              </div>

              <div class="card-content" style="padding: 20px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #1e293b;">{{ img.title }}</h3>
                <p style="margin: 0; font-size: 0.9rem; color: #64748b; line-height: 1.5;">
                  {{ img.description }}
                </p>
              </div>
            </div>
          </div>
          
          <p style="text-align: center; color: #94a3b8; margin-top: 30px; font-size: 0.9rem;">
            
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentView: 'overview',
      gridImages: [
        {
          id: 1,
          title: "Figure A: Comparison of Failure Mode Distributions. The charts contrast the error distribution of tasks failed by the baseline but corrected by DART (Left) against the remaining failures of DART-GUI-7B (Right).",
          description: "This comparison highlights the error distribution shift. DART significantly reduces Reasoning Failures (dropping from 61.8% in corrected tasks to 40.0% in remaining errors) and Grounding Errors (16.4% to 7.7%). As the model becomes more capable of handling reasoning and grounding challenges, Knowledge Limitations (rising to 38.5%) emerge as the primary bottleneck for the remaining unsolved tasks.",
          src: "Figure_A_error_type_pie_chart_comparison.png", 
          bgColor: "#ffffff" 
        },
        {
          id: 2,
          title: "Figure B: Distribution of Trajectory Lengths. A comparison between the trajectory lengths of DART's successful tasks (Orange) and the baseline's failed tasks (Blue).",
          description: "Our analysis reveals that successful trajectories from DART-GUI-7B exhibit a remarkably even distribution across all length intervals (consistently ranging between 15% and 19%), demonstrating robustness across both short and long-horizon tasks. In contrast, baseline failures are heavily skewed toward the maximum length (peaking at 31.2%), indicating that the baseline model often struggles to terminate effectively or enters stuck states in complex scenarios.",
          src: "Figure_B_trajectory_length_percentage.png", 
          bgColor: "#ffffff" 
        },
        {
          id: 3,
          title: "Figure C: Correlation Matrix of Failure Modes and Task Metrics. Heatmap displaying the Pearson correlation coefficients between specific failure modes and task metrics (Trajectory Length and Task Complexity).",
          description: "The statistical analysis identifies key failure patterns. There is a notable positive correlation (0.29) between Looping/Stuck states and trajectory length, confirming that agents stuck in repetitive loops tend to exhaust the step limit. Additionally, Knowledge Limitations show a positive correlation (0.18) with task complexity, suggesting that as tasks become more intricate, the primary challenge shifts from execution to a lack of specific domain knowledge.",
          src: "FIgure_C_correlation_matrix.png", 
          bgColor: "#ffffff" 
        },
        {
          id: 4,
          title: "Figure D: Failure Mode Distribution by Application Type. Heatmap showing the percentage of failure modes across different GUI applications.",
          description: "Failure modes vary significantly depending on the application interface. LibreOffice Calc, characterized by a dense grid of small cells, is dominated by Grounding Errors (100%), reflecting the difficulty in precise coordinate prediction. In contrast, applications like Chrome and LibreOffice Writer, which involve multi-step menu navigation, primarily exhibit Reasoning Failures (>75%), indicating that the main challenge in these environments lies in logical planning rather than visual element identification.",
          src: "Figure_D_failure_modes_by_application.png", 
          bgColor: "#ffffff" 
        }
      ]
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f7fa;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
}

.header-nav {
  display: flex;
  gap: 10px;
}

.nav-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.nav-link.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.app-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 350px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.sidebar-header h2 {
  font-size: 18px;
  color: #333;
}

.sidebar-loading {
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.trajectory-list {
  flex: 1;
  overflow-y: auto;
}

.trajectory-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
}

.trajectory-item:hover {
  background: #f8f9fa;
}

.trajectory-item.active {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid #667eea;
}

.traj-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  word-break: break-all;
}

.traj-info {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.badge.reward.high {
  background: #d4edda;
  color: #155724;
}

.badge.reward.medium {
  background: #fff3cd;
  color: #856404;
}

.badge.reward.low {
  background: #f8d7da;
  color: #721c24;
}

.badge.reward.unknown {
  background: #e2e3e5;
  color: #383d41;
}

.badge.steps {
  background: #e3f2fd;
  color: #1565c0;
}

.traj-instruction {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #666;
}

.loading-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: #666;
}

.trajectory-detail {
  padding: 30px;
}

.detail-header {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

.detail-title h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  word-break: break-all;
}

.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #666;
  flex-wrap: wrap;
}

.instruction-box {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%);
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.instruction-label {
  font-size: 12px;
  font-weight: 600;
  color: #856404;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.instruction-text {
  font-size: 14px;
  color: #856404;
  line-height: 1.6;
}

.step-navigation {
  background: white;
  padding: 20px 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.step-info {
  flex: 1;
}

.step-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.step-progress {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.step-content {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.message {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid;
}

.message.system {
  background: #f8f9fa;
  border-left-color: #6c757d;
}

.message.user {
  background: #e3f2fd;
  border-left-color: #2196f3;
}

.message.assistant {
  background: #f3e5f5;
  border-left-color: #9c27b0;
}

.message-header {
  margin-bottom: 12px;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(0,0,0,0.1);
}

.message-body {
  color: #333;
}

.text-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.7;
  font-size: 14px;
}

.image-content {
  margin: 15px 0;
}

/* Overview Section */
.overview-section {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(120deg, #f8fbff 0%, #f3f6fa 100%);
}

.overview-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 50px 30px;
}

.overview-hero {
  text-align: center;
  margin-bottom: 40px;
}

.overview-hero h1 {
  font-size: 64px;
  color: #667eea;
  margin-bottom: 15px;
  font-weight: 800;
  letter-spacing: -1px;
}

.overview-hero .subtitle {
  font-size: 28px;
  color: #374151;
  margin-bottom: 15px;
  font-weight: 500;
  line-height: 1.3;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.notice-anon {
  font-size: 16px;
  color: #856404;
  background: linear-gradient(90deg, #fff3cd 0%, #ffe8a1 100%);
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  margin-top: 10px;
  border: 2px solid #ffc107;
  font-weight: 600;
}

.tldr-box {
  background: linear-gradient(90deg, #f3e5f5 0%, #f5fafd 100%);
  border-left: 4px solid #667eea;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 50px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}

.tldr-title {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 10px;
}

.tldr-box p {
  font-size: 17px;
  line-height: 1.6;
  color: #333;
  text-align: left;
}

/* Main Resources on Overview */
.main-resources {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  margin-bottom: 50px;
  border: 2px solid #e1bee7;
}

.main-resources h2 {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

.resource-cards-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.resource-card-compact {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 30px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.resource-card-compact:hover {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-3px);
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.resource-icon-small {
  font-size: 36px;
}

.resource-header h3 {
  font-size: 22px;
  color: #333;
  font-weight: 700;
  margin: 0;
}

.resource-desc-small {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.resource-meta {
  margin-bottom: 20px;
}

.resource-meta span {
  font-size: 13px;
  color: #667eea;
  background: #f3e5f5;
  padding: 5px 12px;
  border-radius: 12px;
  font-weight: 600;
}

.btn-download-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-download-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}

.modal-intro {
  margin-bottom: 25px;
  font-size: 16px;
  color: #333;
}

.code-box {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
}

.note-box-modal {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 15px;
  border-radius: 8px;
  margin-top: 25px;
  font-size: 14px;
  color: #856404;
}

.note-box-modal strong {
  color: #856404;
}

/* Introduction Section */
.intro-section {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  margin-bottom: 50px;
  border: 2px solid #e1bee7;
}

.intro-section h2 {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 25px;
  font-weight: 700;
}

.intro-text {
  font-size: 16px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 20px;
  text-align: justify;
}

.highlight-text {
  text-decoration: underline;
  text-decoration-color: #667eea;
  font-weight: 600;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-item {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e1bee7;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.stat-value {
  font-size: 42px;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* Quick Nav Buttons */
.quick-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-nav-primary, .btn-nav-secondary {
  padding: 15px 35px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

.btn-nav-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-nav-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-nav-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-nav-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Resources Section */
.resources-section {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
}

.resources-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 30px;
}

.resources-header {
  text-align: center;
  margin-bottom: 50px;
}

.resources-header h1 {
  font-size: 42px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}

.resources-header p {
  font-size: 18px;
  color: #666;
}

.resource-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.resource-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.resource-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
}

.resource-card.full-width {
  grid-column: 1 / -1;
}

.resource-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.resource-card h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 700;
}

.resource-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
}

.resource-details {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.detail-value {
  color: #666;
  font-size: 14px;
}

.resource-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.btn-download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 20px;
}

.resource-note {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin: 0;
  font-style: italic;
}

.checkpoint-info {
  margin-top: 20px;
}

.info-box {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.info-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h3 {
  font-size: 18px;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.info-content {
  padding: 25px;
}

.info-content > p {
  margin-bottom: 20px;
  color: #333;
}

.access-option {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid #667eea;
}

.access-option h4 {
  font-size: 16px;
  color: #667eea;
  margin-bottom: 10px;
  font-weight: 600;
}

.access-option p {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.code-block {
  display: block;
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

.note-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

.note-box strong {
  color: #856404;
}

.guide-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.guide-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.anonymity-notice {
  background: linear-gradient(135deg, #fff3cd 0%, #ffe8a1 100%);
  border: 2px solid #ffc107;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.notice-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.notice-content h3 {
  font-size: 20px;
  color: #856404;
  margin-bottom: 10px;
  font-weight: 700;
}

.notice-content p {
  font-size: 15px;
  color: #856404;
  line-height: 1.7;
}

/* Download Trajectories Section */
.download-trajectories-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
}

.download-trajectories-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 25px;
  text-align: center;
}

.trajectory-download-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 35px;
  color: white;
  text-align: center;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 600px;
  margin: 0 auto;
}

.trajectory-download-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
}

.trajectory-download-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.trajectory-icon {
  font-size: 40px;
}

.trajectory-download-header h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.trajectory-desc {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  opacity: 0.95;
}

.trajectory-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.trajectory-meta span {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.btn-download-trajectories {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #667eea;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.btn-download-trajectories:hover {
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  color: #5a67d8;
}

.trajectory-note {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
  font-style: italic;
}
</style>

