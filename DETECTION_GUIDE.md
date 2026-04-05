# AR Image Detection Guide

## What's Changed
Your app now uses **optimized ORB feature-based image matching** with:
- ✅ **Pre-computed features** (computed once, reused every frame)
- ✅ **400ms scan intervals** (not every frame - better mobile performance)
- ✅ **Lowe's ratio test** (filters out poor quality matches)
- ✅ **8+ good matches threshold** (requires significant visual confirmation)
- ✅ **KNN matcher** (more accurate than simple brute force)
- ✅ **Debug panel** (press "D" in top right to monitor detection)

## Key Parameters

| Parameter | Current | Effect |
|-----------|---------|--------|
| Scan Interval | 400ms | Slower scans = better battery, fewer false positives |
| Feature Count | 1000 | More features = better matching accuracy |
| Match Threshold | 8 matches | Need 8+ good matches to trigger video |
| Ratio Test | 0.7 | Filters weak matches (Lowe's test) |

## How to Improve Detection

### 1. **Target Image Quality** (Most Important!)

✅ **Best Target Images:**
- High contrast images (logos, QR codes, product labels)
- Lots of distinctive features (patterns, textures, details)
- Not blurry or low resolution
- Printed physical copies work best

❌ **Avoid:**
- Solid colors (no features to detect)
- Blurry or low DPI images
- Very small images (<200x200px)
- Highly reflective/shiny surfaces

**Recommendation:** Use **PNG or JPG images with at least 300x300px resolution**

---

### 2. **Mobile Performance Optimization**

If detection is slow on mobile:

**Option A: Reduce scan frequency (slower but uses less CPU)**
```javascript
// In detectFrame() scan interval, change:
scanInterval = setInterval(detectFrame, 600);  // 600ms instead of 400ms
```

**Option B: Reduce feature extraction count**
```javascript
// In detectFrame(), change:
const orb = new cv.ORB(500, 1.2, 8);  // 500 instead of 1000
```

**Option C: Pre-resize images (preloadTargetImages)**
```javascript
// Scale target images down for faster processing
canvas.width = 640;  // Instead of full resolution
canvas.height = 480;
```

---

### 3. **Adjust Match Sensitivity**

**Increase sensitivity (easier to detect - may have false positives):**
```javascript
// In detectFrame(), change match threshold from 8 to:
if (bestMatchCount >= 6 && bestMatch) {  // 6+ matches
```

**Decrease sensitivity (harder to detect - fewer false positives):**
```javascript
if (bestMatchCount >= 10 && bestMatch) {  // 10+ matches
```

**Adjust Lowe's ratio test (currently 0.7):**
```javascript
if (m.distance < 0.75 * n.distance) {  // More lenient (0.75)
// vs
if (m.distance < 0.65 * n.distance) {  // More strict (0.65)
```

---

### 4. **Debug Panel Usage**

Press the **D button** (bottom right) to open the debug panel.

**What each stat means:**

| Stat | Meaning |
|------|---------|
| **State** | SCANNING (waiting), LOCKED (video playing), ENDED |
| **Targets** | How many target images loaded | 
| **Last Match** | Name of that last detected target |
| **Match Count** | How many features matched in last scan |
| **CV.js** | OpenCV library status |

**Tips:**
- Point camera at target image
- Watch **Match Count** increase when image is in view
- Should reach 8+ for detection
- If stuck at 0-3, target image may be too plain or out of focus

---

### 5. **Lighting Conditions**

ORB features work best with:
- ✅ **Good ambient lighting** (not too dark, not blown out)
- ✅ **Consistent lighting** (avoid shadows on target)
- ✅ **Direct angle** (camera roughly perpendicular to image)

❌ **Avoid:**
- Very dark environments
- Heavy shadows or glare
- Extreme angles (>60°)
- Backlighting

---

## Diagnosis Checklist

**If images are NOT being detected:**

1. ☐ Open **Debug Panel** (D button) - are targets loading?
2. ☐ Point camera at target image
3. ☐ Watch **Match Count** stat - should increase to 5+ when visible
4. ☐ Check console (F12) for errors
5. ☐ Verify target image has enough detail/contrast
6. ☐ Try a different target image with more distinctive features
7. ☐ Move camera closer to target (needs clearer view)
8. ☐ Improve lighting conditions

**If Match Count reaches 5+ but video doesn't play:**
- Threshold is set to 8 matches
- Either lower threshold or use better target image with more features
- Check Match Count max value after 5-10 frames

---

## Advanced Tuning

### Recommended Target Images

**Logo/Icon:** Needs high contrast and distinctive shape
**Product Label:** Good if has varied colors and text
**QR Code:** Excellent (high contrast pattern)
**Screenshot/Text:** Good if has varied fonts and layout
**Photo:** Only if has distinctive features (faces, texture)

### Batch Testing

To test multiple targets:
1. Upload different images in admin
2. Use debug panel to see which reaches highest match count
3. Refine based on performance

### Fallback Strategy

If specific image won't detect:
```javascript
// Add backup images with different variations
// Admin can upload multiple cropped versions of same target
```

---

## Performance Expectations

| Device | Scan Interval | CPU Usage |
|--------|---------------|-----------|
| Desktop | 200-400ms | Low |
| Modern Phone | 400ms | Low |
| Older Phone | 600-800ms | Moderate |

If app feels sluggish:
- Increase `scanInterval` to 600ms
- Reduce `orb` feature count to 500
- Check browser console for errors

---

## When to Contact Support

If none of the above works:
1. Post target image file
2. Share debug panel screenshot
3. Describe device/browser being used
4. Note Match Count values observed
