const Address = require('../../models/address');

const mapToClientAddress = (mongoAddress) => ({
    id: mongoAddress._id,
    fullName: mongoAddress.name || '',
    mobile: mongoAddress.mobile || '',
    flatNumber: mongoAddress.house_number || '',
    streetAddress: mongoAddress.street_name || '',
    landmark: mongoAddress.landmark || '',
    area: mongoAddress.landmark || '',
    city: mongoAddress.city || '',
    state: mongoAddress.state || '',
    pincode: mongoAddress.zipcode || '',
    isDefault: mongoAddress.primary === 'true' || mongoAddress.primary === true
});

exports.getAddresses = async (req, res) => {
    try {
        const user_id = req.user._id;
        const addressDoc = await Address.findOne({ user_id });
        if (!addressDoc) return res.status(200).json([]);
        
        const clientAddresses = addressDoc.entries.map(mapToClientAddress);
        return res.status(200).json(clientAddresses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { fullName, mobile, flatNumber, streetAddress, landmark, area, city, state, pincode, isDefault } = req.body;

        let addressDoc = await Address.findOne({ user_id });
        if (!addressDoc) {
            addressDoc = new Address({ user_id, entries: [] });
        }

        if (isDefault) {
            // Set all existing addresses to non-default
            addressDoc.entries.forEach(entry => {
                entry.primary = 'false';
            });
        }

        const newEntry = {
            name: fullName,
            mobile: Number(mobile) || null,
            house_number: flatNumber,
            street_name: streetAddress,
            landmark: landmark || area || '',
            type: 'home',
            zipcode: pincode,
            city,
            state,
            primary: isDefault ? 'true' : 'false'
        };

        addressDoc.entries.push(newEntry);
        await addressDoc.save();

        const clientAddresses = addressDoc.entries.map(mapToClientAddress);
        return res.status(200).json(clientAddresses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const user_id = req.user._id;
        const addressId = req.params.id;
        const { fullName, mobile, flatNumber, streetAddress, landmark, area, city, state, pincode, isDefault } = req.body;

        let addressDoc = await Address.findOne({ user_id });
        if (!addressDoc) return res.status(404).json({ error: 'Address document not found' });

        const entry = addressDoc.entries.id(addressId);
        if (!entry) return res.status(404).json({ error: 'Address entry not found' });

        if (isDefault) {
            // Set all existing addresses to non-default
            addressDoc.entries.forEach(e => {
                e.primary = 'false';
            });
        }

        if (fullName !== undefined) entry.name = fullName;
        if (mobile !== undefined) entry.mobile = Number(mobile) || null;
        if (flatNumber !== undefined) entry.house_number = flatNumber;
        if (streetAddress !== undefined) entry.street_name = streetAddress;
        if (landmark !== undefined) entry.landmark = landmark;
        if (area !== undefined) entry.landmark = area;
        if (city !== undefined) entry.city = city;
        if (state !== undefined) entry.state = state;
        if (pincode !== undefined) entry.zipcode = pincode;
        if (isDefault !== undefined) entry.primary = isDefault ? 'true' : 'false';

        await addressDoc.save();

        const clientAddresses = addressDoc.entries.map(mapToClientAddress);
        return res.status(200).json(clientAddresses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user_id = req.user._id;
        const addressId = req.params.id;

        let addressDoc = await Address.findOne({ user_id });
        if (!addressDoc) return res.status(404).json({ error: 'Address document not found' });

        addressDoc.entries = addressDoc.entries.filter(e => e._id.toString() !== addressId.toString());
        await addressDoc.save();

        const clientAddresses = addressDoc.entries.map(mapToClientAddress);
        return res.status(200).json(clientAddresses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
