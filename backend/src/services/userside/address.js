const addressModel = require("../../models/address");

exports.user_address_manager = async (req, res) => {
    try {
      const user_id = req.user._id;
      let address_data = await addressModel.findOne({ user_id });
      
      if (!address_data) {
        address_data = new addressModel({ user_id, entries: [] });
        await address_data.save();
      }
     
      return {
        message: "data fetched successfully",
        data: address_data,
        success: true,
      };
    
    } catch (error) {
      console.error(error);
      return {
        message: "Error fetching data",
        data: { entries: [] },
        success: false,
        error: error.message
      };
    }
};

exports.user_address_add = async (req, res) => {
    try {
      const user_id = req.user._id;
      const {
        name,
        mobile,
        house_number,
        street_name,
        landmark,
        type,
        zipcode,
        city,
        state,
        latitude,
        longitude,
        primary
      } = req.body;

      let address_data = await addressModel.findOne({ user_id });
      if (!address_data) {
        address_data = new addressModel({ user_id, entries: [] });
      }

      const newAddress = {
        name,
        mobile,
        house_number,
        street_name,
        landmark,
        type,
        zipcode,
        city,
        state,
        latitude,
        longitude,
        primary
      };

      address_data.entries.push(newAddress);
      await address_data.save();

      return {
        message: "Address added successfully",
        data: address_data,
        success: true,
      };

    } catch (error) {
      console.error(error);
      return {
        message: "Error adding address",
        data: { entries: [] },
        success: false,
        error: error.message
      };
    }
};

exports.user_address_manager_update = async (req, res) => {
    try {
      const user_id = req.user._id;
      const _id = req.query._id;
      const {
        name,
        mobile,
        house_number,
        street_name,
        landmark,
        type,
        zipcode,
        city,
        state,
        latitude,
        longitude,
        primary
      } = req.body;
      
      let address_data = await addressModel.findOne({ user_id });
      if (!address_data) {
        return {
          message: "Address record not found",
          data: { entries: [] },
          success: false,
        };
      }

      let address_entry = address_data.entries.find(entry => entry._id.toString() === _id.toString());
      if (!address_entry) {
        return {
          message: "Address entry not found",
          data: address_data,
          success: false,
        };
      }

      if (name !== undefined) address_entry.name = name;
      if (mobile !== undefined) address_entry.mobile = mobile;
      if (house_number !== undefined) address_entry.house_number = house_number;
      if (street_name !== undefined) address_entry.street_name = street_name;
      if (landmark !== undefined) address_entry.landmark = landmark;
      if (type !== undefined) address_entry.type = type;
      if (zipcode !== undefined) address_entry.zipcode = zipcode;
      if (city !== undefined) address_entry.city = city;
      if (state !== undefined) address_entry.state = state;
      if (latitude !== undefined) address_entry.latitude = latitude;
      if (longitude !== undefined) address_entry.longitude = longitude;
      if (primary !== undefined) address_entry.primary = primary;
      
      await address_data.save();
            
      return {
        message: "Address updated successfully",
        data: address_data,
        success: true,
      };
    
    } catch (error) {
      console.error(error);
      return {
        message: "Error updating address",
        data: { entries: [] },
        success: false,
        error: error.message
      };
    }
};

exports.user_address_manager_delete = async (req, res) => {
    try {
      const user_id = req.user._id;
      const _id = req.query._id;
      
      let address_data = await addressModel.findOne({ user_id });
      if (!address_data) {
        return {
          message: "Address record not found",
          data: { entries: [] },
          success: false,
        };
      }

      address_data.entries = address_data.entries.filter(entry => entry._id.toString() !== _id.toString());
      await address_data.save();

      return {
        message: "Address deleted successfully",
        data: address_data,
        success: true,
      };
    
    } catch (error) {
      console.error(error);
      return {
        message: "Error deleting address",
        data: { entries: [] },
        success: false,
        error: error.message
      };
    }
};
