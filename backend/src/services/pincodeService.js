const axios = require('axios');

exports.getPincodeDetails = async (pincode) => {
  if (!pincode || !/^\d{6}$/.test(String(pincode).trim())) {
    return {
      success: false,
      message: 'Invalid 6-digit PIN code',
      data: null
    };
  }

  const cleanPincode = String(pincode).trim();
  let areaName = '';
  let district = '';
  let state = '';
  let country = 'India';
  let postOffices = [];
  let lat = null;
  let lon = null;

  try {
    // 1. Query India Post API for official area & post office data
    const indiaPostRes = await axios.get(`https://api.postalpincode.in/pincode/${cleanPincode}`, { timeout: 5000 });

    if (indiaPostRes.data && Array.isArray(indiaPostRes.data) && indiaPostRes.data[0]?.Status === 'Success') {
      const poList = indiaPostRes.data[0].PostOffice || [];
      postOffices = poList.map(po => ({
        name: po.Name,
        branchType: po.BranchType,
        deliveryStatus: po.DeliveryStatus,
        district: po.District,
        state: po.State
      }));

      if (poList.length > 0) {
        areaName = poList[0].Name || poList[0].District;
        district = poList[0].District || '';
        state = poList[0].State || '';
        country = poList[0].Country || 'India';
      }
    }
  } catch (err) {
    console.error('India Post API error:', err.message);
  }

  try {
    // 2. Query Zippopotam API for latitude & longitude coordinates
    const zippoRes = await axios.get(`http://api.zippopotam.us/in/${cleanPincode}`, { timeout: 4000 });
    if (zippoRes.data && Array.isArray(zippoRes.data.places) && zippoRes.data.places.length > 0) {
      const place = zippoRes.data.places[0];
      if (!areaName) areaName = place['place name'] || '';
      if (!state) state = place['state'] || '';
      if (place.latitude) lat = parseFloat(place.latitude);
      if (place.longitude) lon = parseFloat(place.longitude);
    }
  } catch (err) {
    // Fallback to Nominatim OpenStreetMap API if Zippopotam fails
    try {
      const nominatimRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?postalcode=${cleanPincode}&country=India&format=json`,
        {
          headers: { 'User-Agent': 'ZonirazJewelryBackend/1.0' },
          timeout: 4000
        }
      );
      if (nominatimRes.data && Array.isArray(nominatimRes.data) && nominatimRes.data.length > 0) {
        lat = parseFloat(nominatimRes.data[0].lat);
        lon = parseFloat(nominatimRes.data[0].lon);
      }
    } catch (nomErr) {
      console.error('Nominatim Geocoding API error:', nomErr.message);
    }
  }

  if (!areaName && !district && lat === null) {
    return {
      success: false,
      message: 'PIN code details not found',
      data: null
    };
  }

  const formattedAddress = [areaName, district, state, cleanPincode].filter(Boolean).join(', ');

  return {
    success: true,
    message: 'PIN code details retrieved successfully',
    data: {
      pincode: cleanPincode,
      areaName: areaName || district || 'Unknown Area',
      district: district || areaName || '',
      state: state || '',
      country: country || 'India',
      lat: lat,
      lon: lon,
      formattedAddress: formattedAddress,
      postOffices: postOffices
    }
  };
};
