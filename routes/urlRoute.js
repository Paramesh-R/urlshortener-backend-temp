const express = require('express');
const { createNewShortUrl, showShortUrlsOfUser, getUrlByUrlCode, updateShortUrl, deleteShortUrl, testEndpoint } = require('../src/controller/urlController');
const { isAuthenticated } = require('../src/middleware/auth');
const router = express.Router();


//  =>  /api/url/
router.post('/', createNewShortUrl)         // Create
router.get('/', showShortUrlsOfUser)        // Read all 
router.get('/:urlCode', getUrlByUrlCode)    // Read single (Redirect)
router.put('/', updateShortUrl)             // Update
router.delete('/:id', deleteShortUrl)       // Delete





module.exports = router;
