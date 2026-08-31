import inventory from './pendantAssetInventory.json';

/**
 * Resolves exact Cloudinary jewelry assets based on physical name pendant construction rules:
 * 
 * 1-Letter Name ("A"):
 *   - Letter 1 (Only): Big Capital With Top Bail ('big')
 * 
 * 2-Letter Name ("AN"):
 *   - Letter 1: Big Capital With Top Bail ('big')
 *   - Letter 2 (Last): Small Letter WITH Hook ('smallWithHook')
 * 
 * 3+ Letter Name ("AMAN", "VIKAS", "RAHUL", "PRIYA", "WILLIAM"):
 *   - Letter 1 (First): Big Capital With Top Bail ('big')
 *   - Middle Letters: Small Letter WITHOUT Hook ('smallWithoutHook')
 *   - Last Letter: Small Letter WITH Hook ('smallWithHook')
 * 
 * @param {string} rawName - Raw input text from customer
 * @param {string} style - Selected style ('small_hook', 'big')
 * @param {string} material - Selected material ('gold_14k', 'gold_18k', 'diamond')
 * @returns {object} { success, name, letters, unavailableLetters, error }
 */
export function resolvePendantAssets(rawName, style = 'small_hook', material = 'gold_18k') {
  if (!rawName || typeof rawName !== 'string') {
    return { success: false, name: '', letters: [], unavailableLetters: [], error: 'Please enter a name' };
  }

  const cleanName = rawName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
  if (!cleanName) {
    return { success: false, name: '', letters: [], unavailableLetters: [], error: 'Only alphabetic A-Z characters are allowed' };
  }

  const letters = [];
  const unavailableLetters = [];

  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    let positionRole = 'single';
    let assetData = null;

    if (cleanName.length === 1) {
      // 1-Letter Name: Big Capital With Top Bail
      positionRole = 'single';
      assetData = inventory.big[char];
    } else if (i === 0) {
      // 1st Letter of Multi-Letter Name: Big Capital With Top Bail
      positionRole = 'first';
      assetData = inventory.big[char];
    } else if (i === cleanName.length - 1) {
      // Last Letter of Multi-Letter Name: Small Letter WITH Hook
      positionRole = 'last';
      assetData = inventory.smallWithHook[char];
    } else {
      // Middle Letters of Multi-Letter Name: Small Letter WITHOUT Hook
      positionRole = 'middle';
      assetData = inventory.smallWithoutHook[char];
    }

    if (!assetData || !assetData.url) {
      unavailableLetters.push({ letter: char, role: positionRole });
    } else {
      letters.push({
        index: i,
        letter: char,
        positionRole,
        publicId: assetData.publicId,
        url: assetData.url,
        naturalWidth: assetData.width,
        naturalHeight: assetData.height
      });
    }
  }

  if (unavailableLetters.length > 0) {
    const unique = [...new Set(unavailableLetters.map(u => u.letter))];
    return {
      success: false,
      name: cleanName,
      letters: [],
      unavailableLetters: unique,
      error: `Sorry, letter${unique.length > 1 ? 's' : ''} ${unique.join(', ')} ${unique.length > 1 ? 'are' : 'is'} currently unavailable in the selected style.`
    };
  }

  return {
    success: true,
    name: cleanName,
    style,
    material,
    letters,
    unavailableLetters: [],
    error: null
  };
}
