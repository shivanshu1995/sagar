var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var welcomeCtrl = require('.././controllers/welcomeControl')
var urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/',welcomeCtrl.showIndexPage)
router.get('/cashierPage',welcomeCtrl.showCashierPage)
router.get('/showGenerateBill',welcomeCtrl.showGenerateBill)
router.get('/showAddCustomer',welcomeCtrl.showAddCustomer)
router.get('/showGenerateToken',welcomeCtrl.showGenerateToken)
router.get('/showDashboard',welcomeCtrl.showDashboard)
router.post('/getTransactionsTokens',urlencodedParser,welcomeCtrl.getTransactionsTokens)
router.post('/getName',urlencodedParser,welcomeCtrl.getName)
router.post('/getData',urlencodedParser,welcomeCtrl.getData)
router.post('/saveCustomer',urlencodedParser,welcomeCtrl.saveCustomer)
router.post('/saveToken',urlencodedParser,welcomeCtrl.saveToken)
router.post('/saveBill',urlencodedParser,welcomeCtrl.saveBill)
router.post('/getPriviledge',urlencodedParser,welcomeCtrl.getPriviledge)




// router.get('/test',welcomeCtrl.test)
// router.get('/getConfigurationData',welcomeCtrl.getConfigurationData)
router.get('/test',welcomeCtrl.test)
router.get('/addAdminCashier',welcomeCtrl.showAddAdminCashier)
router.post('/saveAddAdminCashierData',urlencodedParser,welcomeCtrl.saveAddAdminCashierData)




module.exports = router;