const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor} = require('../middleware.js');
const campground = require('../controllers/campground.js')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground))
    
router.get('/new',isLoggedIn, campground.newPage)

router.route('/:id')
    .get(catchAsync(campground.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

router.get('/:id/edit', isLoggedIn , isAuthor,catchAsync(campground.editPage))


module.exports = router;