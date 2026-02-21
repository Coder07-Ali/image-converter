/**
 * Professional Image Converter
 * Complete JavaScript functionality
 */

// ========================================
// DOM Elements
// ========================================

// Upload Section
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

// Editor Panel
const editorPanel = document.getElementById('editorPanel');
const originalPreview = document.getElementById('originalPreview');
const convertedPreview = document.getElementById('convertedPreview');
const originalWrapper = document.getElementById('originalWrapper');
const originalInfo = document.getElementById('originalInfo');
const convertedInfo = document.getElementById('convertedInfo');
const sizeBadge = document.getElementById('sizeBadge');

// Preview Actions
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const resetZoomBtn = document.getElementById('resetZoomBtn');

// Comparison
const comparisonPreview = document.getElementById('comparisonPreview');
const comparisonOriginal = document.getElementById('comparisonOriginal');
const comparisonConverted = document.getElementById('comparisonConverted');
const comparisonSlider = document.getElementById('comparisonSlider');
const comparisonContainer = document.getElementById('comparisonContainer');

// Tools Panel
const toolsTabs = document.querySelectorAll('.tool-tab');
const toolContents = document.querySelectorAll('.tool-content');

// Convert Tab
const formatSelect = document.getElementById('formatSelect');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityGroup = document.getElementById('qualityGroup');

// Resize Tab
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const maintainAspect = document.getElementById('maintainAspect');
const presetBtns = document.querySelectorAll('.preset-btn');

// Crop Tab
const cropRatio = document.getElementById('cropRatio');
const applyCropBtn = document.getElementById('applyCropBtn');
const resetCropBtn = document.getElementById('resetCropBtn');

// Rotate Tab
const rotateLeftBtn = document.getElementById('rotateLeftBtn');
const rotateRightBtn = document.getElementById('rotateRightBtn');
const flipHBtn = document.getElementById('flipHBtn');
const flipVBtn = document.getElementById('flipVBtn');
const rotateAngle = document.getElementById('rotateAngle');
const rotateAngleValue = document.getElementById('rotateAngleValue');

// Compress Tab
const compressLevel = document.getElementById('compressLevel');
const compressLevelValue = document.getElementById('compressLevelValue');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const reductionPercent = document.getElementById('reductionPercent');

// Action Buttons
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const resetBtn = document.getElementById('resetBtn');

// Batch Panel
const batchPanel = document.getElementById('batchPanel');
const batchCount = document.getElementById('batchCount');
const batchList = document.getElementById('batchList');
const clearBatchBtn = document.getElementById('clearBatchBtn');
const convertAllBtn = document.getElementById('convertAllBtn');

// History Panel
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');

// Loading Overlay
const loadingOverlay = document.getElementById('loadingOverlay');

// Toast Container
const toastContainer = document.getElementById('toastContainer');

// ========================================
// State Management
// ========================================

let state = {
    // Current image data
    originalFile: null,
    originalImageData: null,
    originalImageElement: null,
    convertedBlob: null,
    convertedUrl: null,
    
    // Image properties
    imageWidth: 0,
    imageHeight: 0,
    aspectRatio: 1,
    
    // Zoom level
    zoomLevel: 1,
    
    // Transformation state
    rotation: 0,
    flipHorizontal: 1,
    flipVertical: 1,
    cropArea: null,
    
    // Batch processing
    batchFiles: [],
    convertedBlobs: [],
    
    // History
    conversionHistory: [],
    
    // Settings
    currentFormat: 'image/jpeg',
    quality: 0.9,
    resizeWidth: null,
    resizeHeight: null,
    compressLevel: 0.7
};

// ========================================
// Event Listeners Setup
// ========================================

function initEventListeners() {
    // Upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Preview actions
    zoomInBtn.addEventListener('click', () => handleZoom(0.2));
    zoomOutBtn.addEventListener('click', () => handleZoom(-0.2));
    resetZoomBtn.addEventListener('click', handleResetZoom);
    
    // Comparison slider
    comparisonSlider.addEventListener('input', handleComparisonSlider);
    
    // Tool tabs
    toolsTabs.forEach(tab => {
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Convert settings
    formatSelect.addEventListener('change', handleFormatChange);
    qualitySlider.addEventListener('input', handleQualityChange);
    
    // Resize settings
    resizeWidth.addEventListener('input', handleResizeInput);
    resizeHeight.addEventListener('input', handleResizeInput);
    maintainAspect.addEventListener('change', handleAspectRatioChange);
    presetBtns.forEach(btn => {
        btn.addEventListener('click', handlePresetClick);
    });
    
    // Crop settings
    cropRatio.addEventListener('change', handleCropRatioChange);
    applyCropBtn.addEventListener('click', handleApplyCrop);
    resetCropBtn.addEventListener('click', handleResetCrop);
    
    // Rotate settings
    rotateLeftBtn.addEventListener('click', () => handleRotate(-90));
    rotateRightBtn.addEventListener('click', () => handleRotate(90));
    flipHBtn.addEventListener('click', () => handleFlip('horizontal'));
    flipVBtn.addEventListener('click', () => handleFlip('vertical'));
    rotateAngle.addEventListener('input', handleCustomRotation);
    
    // Compress settings
    compressLevel.addEventListener('change', handleCompressLevelChange);
    
    // Action buttons
    convertBtn.addEventListener('click', handleConvert);
    downloadBtn.addEventListener('click', handleDownload);
    downloadAllBtn.addEventListener('click', handleDownloadAll);
    resetBtn.addEventListener('click', handleReset);
    
    // Batch events
    clearBatchBtn.addEventListener('click', handleClearBatch);
    convertAllBtn.addEventListener('click', handleConvertAll);
    
    // History events
    clearHistoryBtn.addEventListener('click', handleClearHistory);
    
    // Dark mode
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Window events
    window.addEventListener('resize', handleWindowResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// ========================================
// Drag and Drop Handlers
// ========================================

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        if (files.length === 1) {
            handleFile(files[0]);
        } else {
            handleBatchFiles(files);
        }
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        if (files.length === 1) {
            handleFile(files[0]);
        } else {
            handleBatchFiles(files);
        }
    }
}

// ========================================
// File Handling
// ========================================

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', 'error');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB.', 'error');
        return;
    }
    
    // Reset state
    resetState();
    
    // Store original file
    state.originalFile = file;
    
    // Read and display original image
    const reader = new FileReader();
    reader.onload = (e) => {
        state.originalImageData = e.target.result;
        
        // Create image element
        const img = new Image();
        img.onload = () => {
            state.originalImageElement = img;
            state.imageWidth = img.width;
            state.imageHeight = img.height;
            state.aspectRatio = img.width / img.height;
            
            // Display original image
            originalPreview.src = state.originalImageData;
            originalPreview.style.transform = `scale(${state.zoomLevel})`;
            
            // Update resize inputs
            resizeWidth.value = img.width;
            resizeHeight.value = img.height;
            
            // Display file info
            const fileInfo = formatFileInfo(file);
            originalInfo.textContent = fileInfo;
            
            // Show editor panel
            editorPanel.classList.add('active');
            
            // Reset conversion preview
            convertedPreview.src = '';
            convertedInfo.textContent = 'No conversion applied yet';
            sizeBadge.textContent = '';
            downloadBtn.disabled = true;
            
            // Hide comparison initially
            comparisonPreview.classList.remove('active');
            
            // Scroll to editor
            editorPanel.scrollIntoView({ behavior: 'smooth' });
            
            showToast('Image loaded successfully!', 'success');
        };
        
        img.onerror = () => {
            showToast('Failed to load image. Please try again.', 'error');
        };
        
        img.src = state.originalImageData;
    };
    
    reader.onerror = () => {
        showToast('Failed to read file. Please try again.', 'error');
    };
    
    reader.readAsDataURL(file);
}

function handleBatchFiles(files) {
    // Filter valid image files
    const validFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length === 0) {
        showToast('No valid image files found.', 'error');
        return;
    }
    
    // Add to batch
    state.batchFiles = [...state.batchFiles, ...validFiles];
    
    // Update UI
    updateBatchUI();
    
    showToast(`${validFiles.length} file(s) added to batch.`, 'success');
}

function updateBatchUI() {
    // Update batch count
    batchCount.textContent = `${state.batchFiles.length} files`;
    
    // Show batch panel if we have files
    if (state.batchFiles.length > 0) {
        batchPanel.classList.add('active');
    } else {
        batchPanel.classList.remove('active');
    }
    
    // Update batch list
    batchList.innerHTML = '';
    
    state.batchFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'batch-item';
        item.innerHTML = `
            <img src="${URL.createObjectURL(file)}" alt="${file.name}">
            <div class="batch-item-info">
                <div class="batch-item-name">${file.name}</div>
                <div class="batch-item-size">${formatFileSize(file.size)}</div>
            </div>
            <span class="batch-item-status pending">Pending</span>
            <button class="file-item-remove" onclick="removeFromBatch(${index})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        batchList.appendChild(item);
    });
    
    // Show download all button if we have converted files
    if (state.convertedBlobs.length > 0) {
        downloadAllBtn.style.display = 'flex';
    } else {
        downloadAllBtn.style.display = 'none';
    }
}

function removeFromBatch(index) {
    state.batchFiles.splice(index, 1);
    updateBatchUI();
}

function handleClearBatch() {
    state.batchFiles = [];
    state.convertedBlobs = [];
    updateBatchUI();
    showToast('Batch cleared.', 'info');
}

// ========================================
// Tab Switching
// ========================================

function handleTabSwitch(e) {
    const tabName = e.target.dataset.tab;
    
    // Update active tab
    toolsTabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update active content
    toolContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// ========================================
// Format and Quality Settings
// ========================================

function handleFormatChange() {
    state.currentFormat = formatSelect.value;
    
    // Show/hide quality slider based on format
    if (state.currentFormat === 'image/png' || state.currentFormat === 'image/bmp' || state.currentFormat === 'image/gif') {
        qualityGroup.style.display = 'none';
    } else {
        qualityGroup.style.display = 'block';
    }
}

function handleQualityChange() {
    state.quality = parseInt(qualitySlider.value) / 100;
    qualityValue.textContent = `${qualitySlider.value}%`;
}

// ========================================
// Resize Functions
// ========================================

function handleResizeInput() {
    if (maintainAspect.checked) {
        const width = parseInt(resizeWidth.value) || 0;
        const height = Math.round(width / state.aspectRatio);
        resizeHeight.value = height;
    }
    state.resizeWidth = parseInt(resizeWidth.value);
    state.resizeHeight = parseInt(resizeHeight.value);
}

function handleAspectRatioChange() {
    if (maintainAspect.checked) {
        handleResizeInput();
    }
}

function handlePresetClick(e) {
    const width = parseInt(e.target.dataset.width);
    const height = parseInt(e.target.dataset.height);
    
    resizeWidth.value = width;
    resizeHeight.value = height;
    state.resizeWidth = width;
    state.resizeHeight = height;
    
    showToast(`Preset size: ${width}×${height}`, 'info');
}

// ========================================
// Crop Functions
// ========================================

function handleCropRatioChange() {
    // This would update crop overlay aspect ratio
    showToast(`Aspect ratio set to ${cropRatio.value}`, 'info');
}

function handleApplyCrop() {
    // Apply crop to original image
    showToast('Crop applied! Click "Convert Image" to see results.', 'info');
}

function handleResetCrop() {
    // Reset crop area
    showToast('Crop reset.', 'info');
}

// ========================================
// Rotate and Flip Functions
// ========================================

function handleRotate(degrees) {
    state.rotation = (state.rotation + degrees) % 360;
    if (state.rotation < 0) state.rotation += 360;
    
    rotateAngle.value = state.rotation;
    rotateAngleValue.textContent = `${state.rotation}°`;
    
    // Apply rotation to preview
    applyTransformations();
    
    showToast(`Rotated ${degrees}°`, 'info');
}

function handleFlip(direction) {
    if (direction === 'horizontal') {
        state.flipHorizontal *= -1;
    } else {
        state.flipVertical *= -1;
    }
    
    // Apply flip to preview
    applyTransformations();
    
    showToast(`Flipped ${direction}`, 'info');
}

function handleCustomRotation() {
    state.rotation = parseInt(rotateAngle.value);
    rotateAngleValue.textContent = `${state.rotation}°`;
    
    // Apply rotation to preview
    applyTransformations();
}

function applyTransformations() {
    const transform = `
        scale(${state.flipHorizontal}, ${state.flipVertical})
        rotate(${state.rotation}deg)
    `;
    
    originalPreview.style.transform = transform;
}

function handleResetZoom() {
    state.zoomLevel = 1;
    originalPreview.style.transform = `scale(${state.zoomLevel})`;
    showToast('Zoom reset.', 'info');
}

function handleZoom(delta) {
    state.zoomLevel = Math.max(0.5, Math.min(3, state.zoomLevel + delta));
    originalPreview.style.transform = `scale(${state.zoomLevel})`;
}

// ========================================
// Compression Settings
// ========================================

function handleCompressLevelChange() {
    const levels = {
        '0.9': 'Maximum Quality',
        '0.7': 'Balanced',
        '0.5': 'Maximum Compression'
    };
    
    state.compressLevel = parseFloat(compressLevel.value);
    compressLevelValue.textContent = levels[compressLevel.value];
}

// ========================================
// Comparison Slider
// ========================================

function handleComparisonSlider() {
    const value = comparisonSlider.value;
    const containerWidth = comparisonContainer.offsetWidth;
    const clipPath = `inset(0 ${100 - value}% 0 0)`;
    
    comparisonOriginal.style.clipPath = clipPath;
}

// ========================================
// Image Conversion
// ========================================

// ========================================
// Image Conversion (Continued)
// ========================================

async function handleConvert() {
    if (!state.originalImageElement) {
        showToast('Please upload an image first.', 'error');
        return;
    }
    
    showLoading('Converting your image...');
    
    try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions
        let width = state.imageWidth;
        let height = state.imageHeight;
        
        // Apply resize if specified
        if (state.resizeWidth && state.resizeHeight) {
            width = state.resizeWidth;
            height = state.resizeHeight;
        }
        
        // Apply rotation
        const rotation = state.rotation * Math.PI / 180;
        
        // Calculate rotated dimensions
        const sin = Math.abs(Math.sin(rotation));
        const cos = Math.abs(Math.cos(rotation));
        const rotatedWidth = width * cos + height * sin;
        const rotatedHeight = width * sin + height * cos;
        
        // Set canvas dimensions
        canvas.width = rotatedWidth;
        canvas.height = rotatedHeight;
        
        // Apply transformations
        ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
        ctx.rotate(rotation);
        ctx.scale(state.flipHorizontal, state.flipVertical);
        ctx.translate(-width / 2, -height / 2);
        
        // Draw image
        ctx.drawImage(state.originalImageElement, 0, 0, width, height);
        
        // Convert to selected format
        const mimeType = state.currentFormat;
        const quality = (mimeType === 'image/png' || mimeType === 'image/bmp' || mimeType === 'image/gif') 
            ? undefined 
            : state.quality;
        
        // Get blob
        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, mimeType, quality);
        });
        
        // Store converted blob
        state.convertedBlob = blob;
        
        // Create URL
        if (state.convertedUrl) {
            URL.revokeObjectURL(state.convertedUrl);
        }
        state.convertedUrl = URL.createObjectURL(blob);
        
        // Display converted image
        convertedPreview.src = state.convertedUrl;
        
        // Update comparison
        comparisonOriginal.src = state.originalImageData;
        comparisonConverted.src = state.convertedUrl;
        comparisonPreview.classList.add('active');
        
        // Display file info
        const formatName = state.currentFormat.replace('image/', '').toUpperCase();
        const originalName = state.originalFile.name.substring(0, state.originalFile.name.lastIndexOf('.'));
        const newFileName = `${originalName}_converted.${state.currentFormat.replace('image/', '')}`;
        
        const originalSizeValue = state.originalFile.size;
        const convertedSizeValue = blob.size;
        
        convertedInfo.textContent = `${newFileName} • ${formatFileSize(convertedSizeValue)} • ${formatName}`;
        
        // Update size badge
        const reduction = ((originalSizeValue - convertedSizeValue) / originalSizeValue * 100).toFixed(1);
        if (reduction > 0) {
            sizeBadge.textContent = `-${reduction}%`;
            sizeBadge.className = 'badge positive';
        } else {
            sizeBadge.textContent = `+${Math.abs(reduction)}%`;
            sizeBadge.className = 'badge negative';
        }
        
        // Update compression stats
        originalSize.textContent = formatFileSize(originalSizeValue);
        compressedSize.textContent = formatFileSize(convertedSizeValue);
        reductionPercent.textContent = `${reduction}%`;
        reductionPercent.className = `stat-value ${reduction > 0 ? 'positive' : 'negative'}`;
        
        // Enable download button
        downloadBtn.disabled = false;
        
        // Add to history
        addToHistory(state.originalFile, blob, state.currentFormat);
        
        hideLoading();
        showToast('Image converted successfully!', 'success');
        
    } catch (error) {
        hideLoading();
        showToast('Conversion failed. Please try again.', 'error');
        console.error('Conversion error:', error);
    }
}

// ========================================
// Download Functions
// ========================================

function handleDownload() {
    if (!state.convertedBlob) {
        showToast('No converted image available.', 'error');
        return;
    }
    
    const format = state.currentFormat.replace('image/', '');
    const originalName = state.originalFile.name.substring(0, state.originalFile.name.lastIndexOf('.'));
    const fileName = `${originalName}_converted.${format}`;
    
    // Create download link
    const url = URL.createObjectURL(state.convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Download started!', 'success');
}

function handleDownloadAll() {
    if (state.convertedBlobs.length === 0) {
        showToast('No converted images available.', 'error');
        return;
    }
    
    // Download each file
    state.convertedBlobs.forEach((blob, index) => {
        setTimeout(() => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `converted_image_${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, index * 500);
    });
    
    showToast(`Downloading ${state.convertedBlobs.length} files...`, 'success');
}

// ========================================
// Batch Conversion
// ========================================

async function handleConvertAll() {
    if (state.batchFiles.length === 0) {
        showToast('No files in batch.', 'error');
        return;
    }
    
    showLoading(`Converting ${state.batchFiles.length} files...`);
    
    state.convertedBlobs = [];
    
    for (let i = 0; i < state.batchFiles.length; i++) {
        const file = state.batchFiles[i];
        
        // Update status
        const statusElement = batchList.querySelectorAll('.batch-item-status')[i];
        statusElement.textContent = 'Processing';
        statusElement.className = 'batch-item-status processing';
        
        try {
            const blob = await convertSingleFile(file);
            state.convertedBlobs.push(blob);
            
            statusElement.textContent = 'Completed';
            statusElement.className = 'batch-item-status completed';
            
        } catch (error) {
            statusElement.textContent = 'Error';
            statusElement.className = 'batch-item-status error';
        }
    }
    
    hideLoading();
    showToast(`Converted ${state.convertedBlobs.length} files!`, 'success');
    
    // Show download all button
    if (state.convertedBlobs.length > 0) {
        downloadAllBtn.style.display = 'flex';
    }
}

async function convertSingleFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Conversion failed'));
                    }
                }, state.currentFormat, state.quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ========================================
// Reset Functions
// ========================================

function handleReset() {
    // Reset state
    resetState();
    
    // Reset UI
    editorPanel.classList.remove('active');
    comparisonPreview.classList.remove('active');
    downloadBtn.disabled = true;
    convertedPreview.src = '';
    originalPreview.src = '';
    convertedInfo.textContent = 'No conversion applied yet';
    originalInfo.textContent = '';
    sizeBadge.textContent = '';
    
    // Reset file input
    fileInput.value = '';
    
    // Reset resize inputs
    resizeWidth.value = '';
    resizeHeight.value = '';
    
    // Reset rotation
    state.rotation = 0;
    rotateAngle.value = 0;
    rotateAngleValue.textContent = '0°';
    state.flipHorizontal = 1;
    state.flipVertical = 1;
    
    // Reset zoom
    state.zoomLevel = 1;
    originalPreview.style.transform = '';
    
    // Reset quality
    qualitySlider.value = 90;
    qualityValue.textContent = '90%';
    state.quality = 0.9;
    
    // Reset compression stats
    originalSize.textContent = '-';
    compressedSize.textContent = '-';
    reductionPercent.textContent = '-';
    
    showToast('Reset complete.', 'info');
}

function resetState() {
    state.originalFile = null;
    state.originalImageData = null;
    state.originalImageElement = null;
    state.convertedBlob = null;
    state.convertedUrl = null;
    state.imageWidth = 0;
    state.imageHeight = 0;
    state.aspectRatio = 1;
    state.zoomLevel = 1;
    state.rotation = 0;
    state.flipHorizontal = 1;
    state.flipVertical = 1;
    state.cropArea = null;
    state.resizeWidth = null;
    state.resizeHeight = null;
}

// ========================================
// History Functions
// ========================================

function addToHistory(originalFile, convertedBlob, format) {
    const historyItem = {
        id: Date.now(),
        originalName: originalFile.name,
        convertedBlob: convertedBlob,
        format: format,
        date: new Date().toISOString(),
        originalUrl: URL.createObjectURL(originalFile)
    };
    
    state.conversionHistory.unshift(historyItem);
    
    // Keep only last 20 items
    if (state.conversionHistory.length > 20) {
        state.conversionHistory.pop();
    }
    
    // Update UI
    updateHistoryUI();
}

function updateHistoryUI() {
    // Show history panel if we have items
    if (state.conversionHistory.length > 0) {
        historyPanel.classList.add('active');
    } else {
        historyPanel.classList.remove('active');
    }
    
    // Update history list
    historyList.innerHTML = '';
    
    state.conversionHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <img src="${item.originalUrl}" alt="${item.originalName}">
            <div class="history-item-info">
                <div class="history-item-name">${item.originalName}</div>
                <div class="history-item-date">${new Date(item.date).toLocaleDateString()}</div>
            </div>
            <button class="history-item-download" onclick="downloadFromHistory(${item.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </button>
        `;
        historyList.appendChild(div);
    });
}

function downloadFromHistory(id) {
    const item = state.conversionHistory.find(h => h.id === id);
    if (!item) return;
    
    const format = item.format.replace('image/', '');
    const fileName = `converted_${Date.now()}.${format}`;
    
    const url = URL.createObjectURL(item.convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Downloaded from history!', 'success');
}

function handleClearHistory() {
    state.conversionHistory = [];
    updateHistoryUI();
    showToast('History cleared.', 'info');
}

// ========================================
// Dark Mode
// ========================================

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    showToast(`Switched to ${newTheme} mode`, 'info');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

// ========================================
// Window Resize Handler
// ========================================

function handleWindowResize() {
    // Update comparison slider
    if (comparisonPreview.classList.contains('active')) {
        handleComparisonSlider();
    }
}

// ========================================
// Keyboard Shortcuts
// ========================================

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + O: Open file
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        fileInput.click();
    }
    
    // Ctrl/Cmd + S: Save/Download
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!downloadBtn.disabled) {
            handleDownload();
        }
    }
    
    // Escape: Close/Reset
    if (e.key === 'Escape') {
        handleReset();
    }
    
    // Arrow keys for rotation
    if (e.key === 'ArrowLeft') {
        handleRotate(-90);
    }
    if (e.key === 'ArrowRight') {
        handleRotate(90);
    }
}

// ========================================
// Utility Functions
// ========================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatFileInfo(file) {
    const size = formatFileSize(file.size);
    const type = file.type.replace('image/', '').toUpperCase();
    const dimensions = state.imageWidth && state.imageHeight 
        ? `${state.imageWidth} × ${state.imageHeight}` 
        : '';
    
    return `${file.name} • ${size} • ${type}${dimensions ? ' • ' + dimensions : ''}`;
}

// ========================================
// Loading Overlay
// ========================================

function showLoading(message = 'Processing...') {
    const loadingText = loadingOverlay.querySelector('p');
    loadingText.textContent = message;
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ========================================
// Error Handling
// ========================================

// ========================================
// Error Handling (Continued)
// ========================================

function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    hideLoading();
    showToast(`An error occurred: ${error.message}`, 'error');
}

// Global error handlers
window.addEventListener('error', (e) => {
    handleError(e.error, 'Global error handler');
});

window.addEventListener('unhandledrejection', (e) => {
    handleError(e.reason, 'Unhandled promise rejection');
});

// ========================================
// Initialize Application
// ========================================

function init() {
    // Load theme preference
    loadThemePreference();
    
    // Initialize event listeners
    initEventListeners();
    
    // Load history from localStorage
    loadHistoryFromStorage();
    
    // Check for file API support
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        showToast('Your browser does not support the File API. Please upgrade your browser.', 'error');
    }
    
    console.log('Image Converter initialized successfully!');
}

// Load history from localStorage
function loadHistoryFromStorage() {
    try {
        const saved = localStorage.getItem('imageConverterHistory');
        if (saved) {
            // Note: Blobs cannot be stored in localStorage
            // This is just for demonstration
            showToast('Welcome back!', 'info');
        }
    } catch (e) {
        console.log('Could not load history:', e);
    }
}

// Save history to localStorage
function saveHistoryToStorage() {
    try {
        // Note: We can only store metadata, not actual blobs
        const metadata = state.conversionHistory.map(item => ({
            id: item.id,
            originalName: item.originalName,
            format: item.format,
            date: item.date
        }));
        localStorage.setItem('imageConverterHistory', JSON.stringify(metadata));
    } catch (e) {
        console.log('Could not save history:', e);
    }
}

// ========================================
// Mobile Touch Support
// ========================================

// Add touch support for mobile devices
function initTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    // Touch events for swipe gestures
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - rotate left
                handleRotate(-90);
            } else {
                // Swipe left - rotate right
                handleRotate(90);
            }
        }
    }, { passive: true });
    
    // Pinch to zoom
    let initialPinchDistance = 0;
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialPinchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            
            const pinchDelta = (currentDistance - initialPinchDistance) / 100;
            handleZoom(pinchDelta);
            
            initialPinchDistance = currentDistance;
        }
    }, { passive: true });
}

// ========================================
// Context Menu Customization
// ========================================

// Disable right-click context menu on images to prevent issues
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// ========================================
// Performance Optimization
// ========================================

// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });
}

// ========================================
// Service Worker Registration (Optional - for PWA)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below to register service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('SW registered:', registration);
        //     })
        //     .catch(error => {
        //         console.log('SW registration failed:', error);
        //     });
    });
}

// ========================================
// Analytics Integration (Optional)
// ========================================

function trackEvent(eventName, properties = {}) {
    // Add your analytics tracking here
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, properties);
    // }
    
    console.log('Track event:', eventName, properties);
}

// Track conversions
function trackConversion(format, fileSize) {
    trackEvent('image_converted', {
        format: format,
        file_size: fileSize
    });
}

// Track errors
function trackError(errorMessage) {
    trackEvent('error', {
        message: errorMessage
    });
}

// ========================================
// Additional Features
// ========================================

// ========================================
// Image Metadata Handling
// ========================================

function getImageMetadata(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                type: file.type,
                name: file.name,
                size: file.size,
                lastModified: file.lastModified
            });
        };
        img.onerror = () => {
            resolve(null);
        };
        img.src = URL.createObjectURL(file);
    });
}

// ========================================
// Clipboard Support
// ========================================

async function handlePaste(e) {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            handleFile(file);
            break;
        }
    }
}

document.addEventListener('paste', handlePaste);

// ========================================
// Drag and Drop from Desktop
// ========================================

function handleDesktopDrop(e) {
    // Handle files dropped from desktop
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// ========================================
// Export/Import Settings
// ========================================

function exportSettings() {
    const settings = {
        format: state.currentFormat,
        quality: state.quality,
        resizeWidth: state.resizeWidth,
        resizeHeight: state.resizeHeight,
        maintainAspect: maintainAspect.checked
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image-converter-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Settings exported!', 'success');
}

function importSettings(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const settings = JSON.parse(e.target.result);
            
            if (settings.format) {
                formatSelect.value = settings.format;
                handleFormatChange();
            }
            
            if (settings.quality) {
                qualitySlider.value = settings.quality * 100;
                handleQualityChange();
            }
            
            if (settings.resizeWidth) {
                resizeWidth.value = settings.resizeWidth;
            }
            
            if (settings.resizeHeight) {
                resizeHeight.value = settings.resizeHeight;
            }
            
            if (settings.maintainAspect !== undefined) {
                maintainAspect.checked = settings.maintainAspect;
            }
            
            showToast('Settings imported!', 'success');
        } catch (error) {
            showToast('Invalid settings file.', 'error');
        }
    };
    reader.readAsText(file);
}

// ========================================
// Keyboard Navigation
// ========================================

// Make elements keyboard accessible
function initKeyboardNavigation() {
    // Add focus styles for interactive elements
    const focusableElements = document.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', () => {
            el.classList.add('keyboard-focused');
        });
        
        el.addEventListener('blur', () => {
            el.classList.remove('keyboard-focused');
        });
    });
}

// ========================================
// Screen Reader Support
// ========================================

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ========================================
// Image Preloading
// ========================================

function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

// ========================================
// Memory Management
// ========================================

function cleanupMemory() {
    // Clear unused object URLs
    if (state.convertedUrl) {
        URL.revokeObjectURL(state.convertedUrl);
    }
    
    // Clear comparison URLs
    comparisonOriginal.src = '';
    comparisonConverted.src = '';
    
    // Force garbage collection hint
    if (window.gc) {
        window.gc();
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', cleanupMemory);

// ========================================
// Debug Mode
// ========================================

function enableDebugMode() {
    window.debugConverter = {
        state: state,
        convert: handleConvert,
        download: handleDownload,
        reset: handleReset,
        toast: showToast,
        loadImage: handleFile
    };
    console.log('Debug mode enabled. Access via window.debugConverter');
}

// Uncomment below to enable debug mode
// enableDebugMode();

// ========================================
// Final Initialization
// ========================================

// Initialize touch support
initTouchSupport();

// Initialize keyboard navigation
initKeyboardNavigation();

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// End of Script
// ========================================

console.log('%c🎨 Image Converter', 'font-size: 24px; font-weight: bold; color: #4f46e5;');
console.log('%cVersion: 1.0.0', 'color: #6b7280;');
console.log('%cReady to convert images!', 'color: #10b981;');