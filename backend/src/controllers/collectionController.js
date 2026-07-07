const collectionService = require('../services/collectionService');

class CollectionController {
  getCollections = async (req, res) => {
    try {
      const collections = await collectionService.getAllCollections();
      return res.status(200).json({ success: true, data: collections });
    } catch (error) {
      console.error('Get Collections Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve collections ledger list' });
    }
  }

  getCollectionById = async (req, res) => {
    try {
      const collection = await collectionService.getCollectionById(req.params.id);
      if (!collection) {
        return res.status(404).json({ success: false, message: 'Collection not found in database' });
      }
      return res.status(200).json({ success: true, data: collection });
    } catch (error) {
      console.error('Get Single Collection Controller Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to retrieve collection details' });
    }
  }

  createCollection = async (req, res) => {
    try {
      const collection = await collectionService.createCollection(req.body);
      return res.status(201).json({
        success: true,
        message: 'Collection successfully created',
        data: collection
      });
    } catch (error) {
      console.error('Create Collection Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create collection' });
    }
  }

  updateCollection = async (req, res) => {
    try {
      const collection = await collectionService.updateCollection(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Collection successfully updated',
        data: collection
      });
    } catch (error) {
      console.error('Update Collection Controller Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to update collection' });
    }
  }
}

module.exports = new CollectionController();
