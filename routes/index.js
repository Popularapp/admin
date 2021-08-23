var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var fs = require('fs-extra');
// const sharp = require("sharp");
var FCM = require('fcm-node');
var serverKey = 'AAAA4R-99eg:APA91bFD9avEWsVdQP_25gPsl_g6Inw6bJ6uVjkYZDhpVOLJ1BfZIuxyWoYzP4IeH1hiTNwmCC6awQ6jF-EE5qLF9ZVTFu6ZhAW5gLt5QCjQ41hXUeJfJ5vCSWAwFcxsk7IpJCUcBGVQ'; //put your server key here
var fcm = new FCM(serverKey);
const OAuth2Data = require("../credentials/credentials.json");
const { google } = require("googleapis");
// const imagemin = require("imagemin");
// const imageminMozjpeg = require("imagemin-mozjpeg");


const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

// const oAuth2Client = {
//   "_events": {
//
//   },
//   "_eventsCount": 0,
//   "transporter": {
//
//   },
//   "credentials": {
//     "access_token": "ya29.a0ARrdaM8iWWVLOLmuzstSXtw4ypFU77CUtbWmA-9uJCzGnPtFPujODE-ptJTsidzvoti5M8TInYsMfXwb-2toTAeqM3rHwsWnyemjJFpi4J6h2KE4jQJ0z3fkUVqh2h0CsiB02xzlTfPviThBRtx0A5ziYgcP",
//     "refresh_token": "1//0gZzaOtowwRCOCgYIARAAGBASNwF-L9IrSjsW3hYLHq2OWYSxM8Qu-cHHaSLkcAjT05uoZfP8RqvUPCTz0yXDkwOymt0TNf9-D2A",
//     "scope": "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/drive.file",
//     "token_type": "Bearer",
//     "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ2Mjk0OTE3NGYxZWVkZjRmOWY5NDM0ODc3YmU0ODNiMzI0MTQwZjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0NjI4MzI2MDI0MzQtZWMyaTczNHZxZXJlOXB0Zzl0amhwOGtnOTQ2cG5hZ2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NjI4MzI2MDI0MzQtZWMyaTczNHZxZXJlOXB0Zzl0amhwOGtnOTQ2cG5hZ2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM4MTI2OTg5ODQ1NDk1MDI5MDAiLCJhdF9oYXNoIjoiZWVLT2NBVmxRZ1FqdVNmdVEwNUw3QSIsIm5hbWUiOiJQb3B1bGFyIEFwcCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHZ3ZjMzlMR3QwcEN4NkNUMlU0ZmVMekp6SnF2emZySkJwdHZLbGM9czk2LWMiLCJnaXZlbl9uYW1lIjoiUG9wdWxhciIsImZhbWlseV9uYW1lIjoiQXBwIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2Mjg4NDMxNzgsImV4cCI6MTYyODg0Njc3OH0.WNqvdfFXuldCi13l7hwsYkNLjfu6DAiikwiXvOAsIB7AVabhmScr4eLPMWpsSXhslS4ZsSWJ8on3eZ2YrSxXF91Wjp6q1exP45DP2tPzGbPWoO0x0WelQWplRxhI_9Dmq34c7Ao0wLDn4OFVh66NZuErvdpANO5yjEu_Buga4mtwk56JZqfU_5zp2JMOCK16H1uHAwI9JPLq9CKEtgCfyIUSVhXL3sQ63Tt4A4pRREviYfKobiuj0dYJJp_zP6lGptTZtXF_VRsFVQcUbaxCCOhjIDYfWIb_ZdRjEqnnZd0tLCYRj_lZH_P0DknNtjZc1LkD3hlO5qnz5-jcjqAaVg",
//     "expiry_date": 1628929577983
//   },
//   "eagerRefreshThresholdMillis": 300000,
//   "forceRefreshOnFailure": false,
//   "certificateCache": {
//
//   },
//   "certificateExpiry": null,
//   "certificateCacheFormat": "PEM",
//   "refreshTokenPromises": {
//
//   },
//   "_clientId": "462832602434-ec2i734vqere9ptg9tjhp8kg946pnagh.apps.googleusercontent.com",
//   "_clientSecret": "L9MUt0d0jaCzB28JzpmDg8Eo",
//   "redirectUri": "http://localhost:4000/google/callback"
// }

// console.log(oAuth2Client)
var authed = false;

// If modifying these scopes, delete token.json.
const SCOPES =
    "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

// var session=require('express-session');
//
//
// router.use(session({
//   secret:"Key",
//   res
//   ave:true,
//   saveUninitialized:true,
//   cookie:{maxAge:10000}}));
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

/*Import databases*/
var mysqlconnection = require('../database/connection');

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};


router.use((req, res, next) => {
  // Get auth token from the cookies
  // console.log(req.session);
  // if(req.session){
    const authToken = req.cookies['AuthToken'];
    // Inject the user to the request
    req.user = authTokens[authToken];
  // } else {
  //   req.user = undefined;
  // }
  // req.user =  {
  //   user_id: 2,
  //   name: 'admin',
  //   full_name: 'ADMIN',
  //   password: 'C3kNJX/F3WmITvJXQqVk0etkZcg9q+1ZdaD2L6kYOWU=',
  //   phone: '9024123007',
  //   nickname: 'Admin',
  //   father_name: '',
  //   address: '',
  //   is_approved: 1,
  //   city: 'Ajmer',
  //   role_id: 1,
  //   status: 1,
  //   created_by: 0,
  //   auto_approved: 1
  // }
  // console.log(req.user);
  next();
});


router.get('/login', (req, res) => {
  res.render('screens/login',{
    message:null,
    messageClass:null
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    res.render('screens/dashboard',{
      role_id:req.user.role_id
    });
  } else {
    res.render('screens/login',{
      message:'You are logged out, Please login again',
      messageClass:'alert-danger'
    });
  }
});


router.get('/logout', function(req, res, next) {
  res.clearCookie('AuthToken');
  res.redirect('/');
});


router.post('/upload', function(req, res, next) {
  var html = '';
  // console.log(req.files);
  // console.log(req.query.CKEditorFuncNum);
  var Images = req.files.upload;
  var new_date = new Date();
  var new_name = new_date.getTime() + 'upload.jpg';
  req.files.upload.name = new_name;
  var imageFiles = typeof req.files.upload.name !=="undefined" ? req.files.upload.name : "" ;
  fs.mkdirp('public/uploads/' , function(err){
    if(err){
      return console.log(err);
    }
  });
  fs.mkdirp('public/uploads/gallery', function(err){
    if(err){
      return console.log(err);
    }
  });
  fs.mkdirp('public/uploads/gallery/thumbs', function(err){
    if(err){
      return console.log(err);
    }
  });
  var path1 = 'public/uploads/'+  imageFiles;
  Images.mv(path1, function(err){
    if(err){
      return console.log(err);
    } else {
      html = "";
      html += "<script type='text/javascript'>";
      html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
      html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
      html += "    var message = \"Uploaded file successfully\";";
      html += "";
      html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
      html += "</script>";

      res.send(html);
    }
  });
});



/* GET home page. */
router.get('/news', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name,`categories`.`headingColor` AS hcolor FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `news`.`user_id` = '" + req.user.user_id + "' AND `news`.`status` = '1' ORDER By `news`.`news_id` DESC";
    mysqlconnection.query(sql,function(err,news){
      // console.log(news);
      res.render('screens/news',{
        role_id:req.user.role_id,
        news:news
      });
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.get('/add-news', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 3){
      var sql = "SELECT `categories`.* FROM `categories` INNER JOIN `sub-categories` ON `sub-categories`.`category_id` = `categories`.`id` WHERE `categories`.`status` = 1 AND `sub-categories`.`name` = '"+ req.user.city +"'";
      var sql3 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` = '"+ req.user.city +"'";
    } else {
      var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL'";
      var sql3 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL' ORDER BY `name`";
    }
    // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
    // var sql2 = "SELECT * FROM `cities` WHERE `state_id` = 33";
    mysqlconnection.query(sql,function(err,categories){
      // mysqlconnection.query(sql1,function(err,states){
        // mysqlconnection.query(sql2,function(err,cities){
          mysqlconnection.query(sql3,function(err,subcategories){
            // console.log(categories);
            // console.log(subcategories);
            if(!err){
              if (!authed) {
                // Generate an OAuth URL and redirect there
                // console.log('not logged one');
                // console.log(oAuth2Client);
                var url = oAuth2Client.generateAuthUrl({
                  access_type: "offline",
                  scope: SCOPES,
                });
                // var url = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=462832602434-ec2i734vqere9ptg9tjhp8kg946pnagh.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fgoogle%2Fcallback';
                // console.log(url);
                // res.send(oAuth2Client);
                res.render("screens/index", { url: url });
              } else {
                // console.log('logged one');
                console.log(oAuth2Client);
                var oauth2 = google.oauth2({
                  auth: oAuth2Client,
                  version: "v2",
                });

                // console.log(oauth2);

                oauth2.userinfo.get(function (err, response) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('response');
                    // console.log(response.data.id);
                    // name = response.data.name;
                    // pic = response.data.picture;
                    // res.render("success", {
                    //   name: response.data.name,
                    //   pic: response.data.picture,
                    //   success: false,
                    // });
                    res.render('screens/new-create-news',{
                      categories:categories,
                      admin_id:req.user.user_id,
                      role_id:req.user.role_id,
                      // states:states,
                      // cities:cities,
                      subcategories:subcategories
                    });
                    // res.render('form');
                  }
                });
              }
              // res.render('screens/new-create-news',{
              //   categories:categories,
              //   admin_id:req.user.user_id,
              //   role_id:req.user.role_id,
              //   // states:states,
              //   // cities:cities,
              //   subcategories:subcategories
              // });
            }
          });
        // });
      // });
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post("/upload-video", function (req, res,next) {
  // console.log(req.files);
  // console.log(req.body);
  // res.jsonp('success');
  var title = req.body.title;
  var description = req.body.description;
  var tags = '';
  const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
  // console.log(youtube);
  youtube.videos.insert({
        resource: {
          snippet: {
            title:title,
            description:description,
            tags:tags
          },
          status: {
            privacyStatus: "private",
          },
        },
        part: "snippet,status",
        media: {
          body: fs.createReadStream(req.files.videos.tempFilePath)
        },
      },
      (err, data) => {
        if(!err){
          console.log("Done.");
          fs.unlinkSync(req.files.videos.tempFilePath);
          res.jsonp({
            message:'success',
            response_id:data.data.id
          });
        } else {
          res.jsonp({
            message:'fail',
            response_id:null
          });
        }
      });
});

router.post("/upload-image", function (req, res,next) {
  // console.log(req.files);
  // console.log(req.body);
  // res.jsonp('success');
  var folderId = '1lImo_leE4RTuOSIQ5sY-5Hu0AP1VTfHG';
  // google.drive()
  const drive = google.drive({ version: "v3", auth: oAuth2Client});
  const fileMetadata = {
    name: req.files.images.tempFilePath,
    parents: [folderId]
  };
  const media = {
    mimeType: req.files.images.mimetype,
    body: fs.createReadStream(req.files.images.tempFilePath),
  };
  drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: "id",
      },
      (err, file) => {
        console.log(err);
        if(!err){
          console.log("Done.");
          // console.log(file.data.id);
          fs.unlinkSync(req.files.images.tempFilePath);
          res.jsonp({
            message:'success',
            response_id:file.data.id,
            error:err
          });
        } else {
          res.jsonp({
            message:'fail',
            response_id:null,
            error:err
          });
        }
      }
  );
});

router.get("/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        // console.log(tokens);
        var tomorrow = new Date();
        tomorrow.setFullYear(tomorrow.getFullYear() + 1);
        tokens.expiry_date = tomorrow.getTime();
        // console.log(tokens);
        oAuth2Client.setCredentials(tokens);

        authed = true;
        // res.send(oAuth2Client);
        res.redirect("/add-news");
      }
    });
  }
});



router.post('/add-news', async function (req, res, next) {
  if (req.user && res.statusCode == 200) {
    console.log(req.body);
    var role_id = req.user.role_id;
    var category = req.body.category_id;
    var sub_category = req.body.sub_category_id;
    // var state = req.body.state;
    // var city = req.body.city;
    var title = req.body.title;
    var status = 1;
    var short_description = req.body.short_description;
    var description = req.body.description;
    var admin_id = req.body.admin_id;
    // var u = req.body.url;
    var url = JSON.parse(req.body.videos);
    var images = JSON.parse(req.body.images);
    // console.log(url);
    // console.log(images);
    // if (typeof u == "string") {
    //   url.push(u);
    // } else {
    //   url = u;
    // }
    if (req.user.auto_approved == 1) {
      var approved = 1;
    } else {
      var approved = 0;
    }

    if(role_id == 3){
    } else if(role_id == 2 || role_id == 1){
      var approved = 1;
    }

    if(images.length != 0){
      // console.log(images);
      var sql6 = "INSERT INTO `news` (`user_id`,`category_id`,`sub_category_id`,`title`,`short_description`,`status`,`is_approved`,`description`,`front_image_path`,`created_at`) VALUES ('" + admin_id + "','" + category + "','" + sub_category + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "','" + images[0] + "',CURRENT_TIMESTAMP)";
      // console.log(sql6);
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          if(url.length != 0){
            for(var i = 0 ;i<url.length;i++){
              var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
              mysqlconnection.query(sql,function(err,video){});
            }
          }
          for(var i = 0 ;i<images.length;i++){
            var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + data.insertId + "','" + images[i] + "')";
            mysqlconnection.query(sql,function(err,img){});
          }
          res.jsonp({
            message:'success'
          });
        }
      });
    } else {
      var sql6 = "INSERT INTO `news` (`user_id`,`category_id`,`sub_category_id`,`title`,`short_description`,`status`,`is_approved`,`description`,`created_at`) VALUES ('" + admin_id + "','" + category + "','" + sub_category + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "',CURRENT_TIMESTAMP)";
        mysqlconnection.query(sql6,function(err,data){
          if(!err){
            if(url.length != 0){
              for(var i = 0 ;i<url.length;i++){
                var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
                mysqlconnection.query(sql,function(err,video){});
              }
            }
            res.jsonp({
              message:'success'
            });
          }
        });
    }

    // if(req.files == null){
    //   var sql6 = "INSERT INTO `news` (`user_id`,`category_id`,`sub_category_id`,`title`,`short_description`,`status`,`is_approved`,`description`,`created_at`) VALUES ('" + admin_id + "','" + category + "','" + sub_category + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "',CURRENT_TIMESTAMP)";
    //   // console.log(sql6);
    //   mysqlconnection.query(sql6,function(err,data){
    //     if(!err){
    //       if(url[0] != ''){
    //         for(var i = 0 ;i<url.length;i++){
    //           var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
    //           mysqlconnection.query(sql,function(err,video){});
    //         }
    //       }
    //       res.redirect('add-news');
    //     }
    //   });
    // } else {
    //   var a = [];
    //   if(req.files.images[0] == undefined){
    //     a.push(req.files.images);
    //   }else {
    //     a = req.files.images;
    //   }
    //   var sql6 = "INSERT INTO `news` (`user_id`,`category_id`,`sub_category_id`,`title`,`short_description`,`status`,`is_approved`,`description`,`front_image_path`,`created_at`) VALUES ('" + admin_id + "','" + category + "','" + sub_category + "','" + title + "','" + short_description + "','" + status + "','" + approved + "','" + description + "','" + a[0].name + "',CURRENT_TIMESTAMP)";
    //   mysqlconnection.query(sql6,function(err,data){
    //     if(!err){
    //       fs.mkdirp('public/news_files/' + data.insertId, function(err){
    //         if(err){
    //           return console.log(err);
    //         }
    //       });
    //
    //       fs.mkdirp('public/news_files/' + data.insertId  + '/gallery', function(err){
    //         if(err){
    //           return console.log(err);
    //         }
    //       });
    //
    //       fs.mkdirp('public/news_files/' + data.insertId + '/gallery/thumbs', function(err){
    //         if(err){
    //           return console.log(err);
    //         }
    //       });
    //
    //       if(url[0] != ''){
    //         for(var i = 0 ;i<url.length;i++){
    //           var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + data.insertId + "','" + url[i] + "')";
    //           mysqlconnection.query(sql,function(err,video){});
    //         }
    //       }
    //
    //       for(var i = 0 ;i<a.length;i++){
    //         var Images = a[i];
    //         var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
    //         fs.mkdirp('public/image_files/' + data.insertId , function(err){
    //           if(err){
    //             return console.log(err);
    //           }
    //         });
    //         fs.mkdirp('public/image_files/' + data.insertId + '/gallery', function(err){
    //           if(err){
    //             return console.log(err);
    //           }
    //         });
    //         fs.mkdirp('public/image_files/' + data.insertId + '/gallery/thumbs', function(err){
    //           if(err){
    //             return console.log(err);
    //           }
    //         });
    //         var path1 = 'public/image_files/'+ data.insertId + '/' + imageFiles;
    //         Images.mv(path1, function(err){
    //           if(err){
    //             return console.log(err);
    //           }
    //         });
    //         var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + data.insertId + "','" + imageFiles + "')";
    //         mysqlconnection.query(sql,function(err,img){});
    //       }
    //       var Image = a[0];
    //       var path = 'public/news_files/'+ data.insertId + '/' + a[0].name;
    //       Image.mv(path, function(err){
    //         if(err){
    //           return console.log(err);
    //         }
    //       });
    //       res.redirect('/add-news');
    //     }
    //   });
    // }
  } else {
    res.render('screens/login', {
      message: 'You are logged out, Please login again',
      messageClass: 'alert-danger'
    });
  }
});

router.get('/edit-news/:news_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2 || req.user.role_id == 3 ){
      var news_id = req.params.news_id;
      var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL'";
      var sql5 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
      var sql2 = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`id` AS c_id,`sub-categories`.`name` AS sc_name,`sub-categories`.`id` AS sc_id FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` WHERE `news`.`news_id` = '" + news_id + "'";
      var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
      var sql3 = "SELECT * FROM `images` WHERE `news_id` = '" + news_id + "'";
      var sql4 = "SELECT * FROM `videos` WHERE `news_id` = '" + news_id + "'";
      mysqlconnection.query(sql,function(err,categories){
        mysqlconnection.query(sql1,function(err,states){
          mysqlconnection.query(sql2,function(err,news){
            mysqlconnection.query(sql3,function(err,images){
              mysqlconnection.query(sql4,function(err,videos){
                mysqlconnection.query(sql5,function(err,subcategories){
                  var sql6 = "SELECT `cities`.* FROM `cities` INNER JOIN `states` ON `states`.`id` = `cities`.`state_id` WHERE `states`.`name` = '"+ news[0].state +"'";
                  mysqlconnection.query(sql6,function(err,cities){
                    // console.log(subcategories);
                    if(!err) {
                      res.render('screens/edit-news', {
                        categories: categories,
                        admin_id: req.user.user_id,
                        role_id:req.user.role_id,
                        states: states,
                        news: news,
                        images: images,
                        videos: videos,
                        subcategories: subcategories,
                        cities:cities
                      });
                    }
                  });
                });
              });
            });
          });
        });
      });
    } else if(req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.post('/edit-news/:news_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    var news_id = req.params.news_id;
    var category = req.body.c;
    var sub_category = req.body.sc;
    var state = req.body.state;
    var city = req.body.city;
    var title = req.body.title;
    var status = 1;
    var short_description = req.body.sd;
    var description = req.body.ta;
    var u = req.body.url;
    var url = [];
    if(typeof u == "string"){
      url.push(u);
    } else {
      url = u;
    }
    if(req.files == null){
      var sql6 = "UPDATE `news` SET `category_id` = '"+category+"', `sub_category_id` = '"+sub_category+"',`state` = '"+state+"',`city` = '"+city+"',`title` = '"+title+"',`status` = '"+status+"',`short_description` = '"+short_description+"',`description` = '"+description+"' WHERE `news_id` = '"+news_id+"'";
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          if(url[0] != ''){
            for(var i = 0 ;i<url.length;i++){
              var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + news_id + "','" + url[i] + "')";
              mysqlconnection.query(sql,function(err,video){});
            }
          }
          res.redirect('/edit-news/'+ news_id);
        }
      });
    } else {
      var a = [];
      if(req.files.images[0] == undefined){
        a.push(req.files.images);
      }else {
        a = req.files.images;
      }
      var sql6 = "UPDATE `news` SET `category_id` = '"+category+"', `sub_category_id` = '"+sub_category+"',`state` = '"+state+"',`city` = '"+city+"',`title` = '"+title+"',`status` = '"+status+"',`short_description` = '"+short_description+"',`description` = '"+description+"',`front_image_path` = '"+a[0].name+"' WHERE `news_id` = '"+news_id+"'";
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          fs.mkdirp('public/news_files/' + news_id, function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/news_files/' + news_id  + '/gallery', function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/news_files/' + news_id + '/gallery/thumbs', function(err){
            if(err){
              return console.log(err);
            }
          });

          if(url[0] != ''){
            for(var i = 0 ;i<url.length;i++){
              var sql = "INSERT INTO `videos` (`news_id`,`url`) VALUES ('" + news_id + "','" + url[i] + "')";
              mysqlconnection.query(sql,function(err,video){});
            }
          }

          for(var i = 0 ;i<a.length;i++){
            var Images = a[i];
            var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
            fs.mkdirp('public/image_files/' + news_id , function(err){
              if(err){
                return console.log(err);
              }
            });
            fs.mkdirp('public/image_files/' + news_id + '/gallery', function(err){
              if(err){
                return console.log(err);
              }
            });
            fs.mkdirp('public/image_files/' + news_id + '/gallery/thumbs', function(err){
              if(err){
                return console.log(err);
              }
            });
            var path1 = 'public/image_files/'+ news_id + '/' + imageFiles;
            Images.mv(path1, function(err){
              if(err){
                return console.log(err);
              }
            });
            var sql = "INSERT INTO `images` (`news_id`,`path`) VALUES ('" + news_id + "','" + imageFiles + "')";
            mysqlconnection.query(sql,function(err,img){});
          }
          var Image = a[0];
          var path = 'public/news_files/'+ news_id + '/' + a[0].name;
          Image.mv(path, function(err){
            if(err){
              return console.log(err);
            }
          });
          res.redirect('/edit-news/' + news_id);
        }
      });
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-image/:news_id/:path/:image_id', function(req, res, next){
  if (req.user && res.statusCode == 200) {
    var news_id = req.params.news_id;
    var image_id = req.params.image_id;
    var path = req.params.path;
    var sql3 = "SELECT `front_image_path` FROM `news` WHERE `news_id` = '"+news_id+"' AND `front_image_path` = '"+path+"'";
    mysqlconnection.query(sql3,function(err,data){
      if(data.length !=0){
        var p1 = 'public/news_files/' + news_id +'/'+path;
        fs.unlink(p1, function (err) {
          if (err) throw err;
        });
        var sql2 = "UPDATE `news` SET `front_image_path` = NULL WHERE `news_id`='"+news_id+"'";
        mysqlconnection.query(sql2,function(err,news){
        });
      }
    });
    var p = 'public/image_files/' + news_id +'/'+path;

    fs.unlink(p, function (err) {
      if (err) throw err;
    });

    var sql = "DELETE FROM `images` WHERE  image_id ='"+image_id+"'";
    mysqlconnection.query(sql,function(err,news){
      res.redirect('/edit-news/' + news_id);
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-video/:news_id/:video_id', function(req, res, next){
  if (req.user && res.statusCode == 200) {
    var news_id = req.params.news_id;
    var video_id = req.params.video_id;
    var sql = "DELETE FROM `videos` WHERE  id ='"+video_id+"'";
    mysqlconnection.query(sql,function(err,news){
      res.redirect('/edit-news/' + news_id);
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});



router.get('/delete-news/:news_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var news_id = req.params.news_id;

      var sql = "UPDATE `news` SET `status` = 0 WHERE `news_id` = '"+news_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/news');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/add-dcategory', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
      mysqlconnection.query(sql,function(err,categories){
        if(!err){
          res.render('screens/add-dcategory',{
            categories:categories,
            role_id:req.user.role_id
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/forms', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT `dcategory`.* FROM `dcategory` LEFT OUTER JOIN `form_fields` ON `form_fields`.`category_name` = `dcategory`.`name` WHERE `form_fields`.`category_name` IS NULL AND `status` = 1";
      var sql1 = "SELECT * FROM `form_fields`";
      mysqlconnection.query(sql,function(err,categories){
        mysqlconnection.query(sql1,function(err,forms){
          if(!err){
            res.render('screens/forms',{
              categories:categories,
              forms:forms,
              role_id:req.user.role_id
            });
          }
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/posts', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `dcategory` WHERE `status` = 1";
      var sql1 = "SELECT * FROM `user_post` WHERE `status` = 1 ORDER BY `id` DESC";
      var sql2 = "SELECT * FROM `dimages`";
      mysqlconnection.query(sql,function(err,categories){
        mysqlconnection.query(sql1,function(err,user_post){
          mysqlconnection.query(sql2,function(err,post_images){
            if(categories != undefined){
              res.render('screens/user_post',{
                user_post:user_post,
                role_id:req.user.role_id,
                categories:categories,
                post_images:post_images
              });
            } else {
              res.send('Database Not Connected');
            }
          });
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
      message: 'Logged out! Please login again',
      messageClass: 'alert-danger'
    });
  }
});

router.get('/form-preview/:id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var id = req.params.id;
      var sql1 = "SELECT * FROM `form_fields` WHERE `id` = '"+id+"'";
        mysqlconnection.query(sql1,function(err,forms){
          if(!err){
            res.render('screens/form_preview',{
              forms:forms,
              role_id:req.user.role_id
            });
          }
        });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/edit-form/:id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var id = req.params.id;
      var sql1 = "SELECT * FROM `form_fields` WHERE `id` = '"+id+"'";
      mysqlconnection.query(sql1,function(err,forms){
        if(!err){
          res.render('screens/form_edit',{
            forms:forms,
            role_id:req.user.role_id,
            id:id
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-form/:id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var id = req.params.id;
      var sql1 = "DELETE FROM `form_fields` WHERE `id` = '"+id+"'";
      mysqlconnection.query(sql1,function(err,forms){
        if(!err){
          res.redirect('/forms');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-post/:id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var id = req.params.id;
      var sql1 = "UPDATE `user_post` SET `status` = 0 WHERE `id` = '"+id+"'";
      mysqlconnection.query(sql1,function(err,forms){
        if(!err){
          res.redirect('/posts');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/edit-form/:id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var id = req.params.id;
      const {ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion} = req.body;

      // console.log(category_name);
      var sql6 = "UPDATE `form_fields` SET `ad_title` = '"+ad_title+"',`description` = '"+description+"',`price` = '"+price+"',`phone_number` = '"+phone_number+"',`address` = '"+address+"',`brand` = '"+brand+"',`year` = '"+year+"',`fuel` = '"+fuel+"',`transmission` = '"+transmission+"',`km_driven` = '"+km_driven+"',`no_of_owners` = '"+no_of_owners+"',`type` = '"+type+"',`property` = '"+property+"',`bedroom` = '"+bedroom+"',`bathroom` = '"+bathroom+"',`furnishing` = '"+furnishing+"',`construction_status` = '"+construction_status+"',`listed_by` = '"+listed_by+"',`area` = '"+area+"',`total_floors` = '"+total_floors+"',`floor_no` = '"+floor_no+"',`car_parking` = '"+car_parking+"',`company_role` = '"+company_role+"',`facing` = '"+facing+"',`name` = '"+name+"',`bachelors_allowed` = '"+bachelors_allowed+"',`salary_period` = '"+salary_period+"',`position_type` = '"+position_type+"',`salary_from` = '"+salary_from+"',`salary_to` = '"+salary_to+"',`appliances` = '"+appliances+"',`furniture` = '"+furniture+"',`fashion` = '"+fashion+"' WHERE `id` = '"+id+"'";
      // console.log(sql6);
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          res.redirect('/edit-form/' + id);
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/forms', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      const {category_name,ad_title,description,price,phone_number,address,brand,year,fuel,transmission,km_driven,no_of_owners,type,property,bedroom,bathroom,furnishing,construction_status,listed_by,area,total_floors,floor_no,car_parking,company_role,facing,name,bachelors_allowed,salary_period,position_type,salary_from,salary_to,appliances,furniture,fashion} = req.body;

      // console.log(category_name);
      var sql6 = "INSERT INTO `form_fields` (`category_name`,`ad_title`,`description`,`price`,`phone_number`,`address`,`brand`,`year`,`fuel`,`transmission`,`km_driven`,`no_of_owners`,`type`,`property`,`bedroom`,`bathroom`,`furnishing`,`construction_status`,`listed_by`,`area`,`total_floors`,`floor_no`,`car_parking`,`company_role`,`facing`,`name`,`bachelors_allowed`,`salary_period`,`position_type`,`salary_from`,`salary_to`,`appliances`,`furniture`,`fashion`) VALUES ('"+category_name+"','"+ad_title+"','"+description+"','"+price+"','"+phone_number+"','"+address+"','"+brand+"','"+year+"','"+fuel+"','"+transmission+"','"+km_driven+"','"+no_of_owners+"','"+type+"','"+property+"','"+bedroom+"','"+bathroom+"','"+furnishing+"','"+construction_status+"','"+listed_by+"','"+area+"','"+total_floors+"','"+floor_no+"','"+car_parking+"','"+company_role+"','"+facing+"','"+name+"','"+bachelors_allowed+"','"+salary_period+"','"+position_type+"','"+salary_from+"','"+salary_to+"','"+appliances+"','"+furniture+"','"+fashion+"')";
      // console.log(sql6);
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          res.redirect('/forms');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.post('/add-dcategory', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category=req.body.category;

      var sql6 = "INSERT INTO `dcategory` (`name`) VALUES ('" + category + "')";
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          res.redirect('/add-dcategory');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.get('/delete-dcategory/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;

      var sql = "UPDATE `dcategory` SET `status` = 0 WHERE `id` = '"+category_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/add-dcategory');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/admin-news', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name ,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 2 AND `news`.`status` = '1' ORDER By `news`.`news_id` DESC";
      mysqlconnection.query(sql,function(err,news){
        res.render('screens/news',{
          role_id:req.user.role_id,
          news:news
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/categories', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `categories` WHERE `status` = 1 AND `name` <> 'NULL' ORDER BY `order`";
      var sql1 = "SELECT * FROM `sub-categories` WHERE `status` = 1 AND `name` <> 'NULL'";
      mysqlconnection.query(sql,function(err,categories){
        mysqlconnection.query(sql1,function(err,sub_categories){
          if(!err){
            res.render('screens/categories',{
              categories:categories,
              sub_categories:sub_categories,
              role_id:req.user.role_id
            });
          }
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/add-category', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `categories` WHERE `status` = 1";
      mysqlconnection.query(sql,function(err,categories){
        if(!err){
          res.render('screens/add-category',{
            categories:categories,
            role_id:req.user.role_id
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-category/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;
      var sql = "UPDATE `categories` SET `status` = 0 WHERE `id` = '"+category_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/categories');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/edit-category/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;
      var name = req.body.c_name;
      var headingColor = req.body.headingColor;
      var is_state = req.body.is_state;
      // console.log(is_state);

      if(is_state == undefined){
        var sql = "UPDATE `categories` SET `name` = '"+name+"',`headingColor` = '"+headingColor+"',`is_state` = 0  WHERE `id` = '"+category_id+"'";
      } else if(is_state == 1){
        var sql = "UPDATE `categories` SET `name` = '"+name+"',`headingColor` = '"+headingColor+"',`is_state` = 1  WHERE `id` = '"+category_id+"'";
      }

      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/categories');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/edit-sub-category/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;
      var name = req.body.sc_name;
      var sql = "UPDATE `sub-categories` SET `name` = '"+name+"' WHERE `id` = '"+category_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/categories');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-sub-category/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;
      // console.log(category_id);
      var sql = "UPDATE `sub-categories` SET `status` = 0 WHERE `id` = '"+category_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/categories');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/add-new-category', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category=req.body.category;
      var headingColor = req.body.headingColor;
      var order;
      var is_state = req.body.is_state;
      // console.log(is_state);

      var sql1 = "SELECT * FROM `categories` ORDER BY `id` DESC LIMIT 1 OFFSET 0";
      mysqlconnection.query(sql1,function(err,data){
        if(!err){
          order = data[0].id + 1;
          if(is_state == undefined){
            var sql = "INSERT INTO `categories` (`name`,`headingColor`,`order`) VALUES ('" + category + "','" + headingColor + "','" + order + "')";
          } else if(is_state == 1){
            var sql = "INSERT INTO `categories` (`name`,`headingColor`,`order`,`is_state`) VALUES ('" + category + "','" + headingColor + "','" + order + "','" + is_state + "')";
          }
          mysqlconnection.query(sql,function(err,data){
            if(!err){
              res.redirect('/add-category');
            }
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/add-sub-category', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var subcategory=req.body.subcategory;
      var c=req.body.c;
      var sql6 = "INSERT INTO `sub-categories` (`name`,`category_id`) VALUES ('" + subcategory + "','" + c + "')";
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          res.redirect('/add-category');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});



router.get('/reporter-news', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      if(req.user.role_id == 1){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name, `users`.`role_id` AS role,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' ORDER By `news`.`news_id` DESC";
      } else {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`sub-categories`.`name` AS sc_name,`users`.`full_name` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` = `news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` = `news`.`user_id` WHERE `users`.`role_id` = 3 AND `news`.`status` = '1' AND `users`.`created_by` = '"+req.user.user_id+"' ORDER By `news`.`news_id` DESC";
      }
      mysqlconnection.query(sql,function(err,news){
        res.render('screens/news',{
          role_id:req.user.role_id,
          news:news
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/users', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      if(req.user.role_id == 1){
        var sql = "SELECT * FROM `users` WHERE `status` = 1 ORDER By `user_id` DESC";
      } else {
        var sql = "SELECT * FROM `users` WHERE `status` = 1 AND `created_by` = '"+req.user.user_id+"' ORDER By `user_id` DESC";
      }
      var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
      mysqlconnection.query(sql,function(err,users){
        mysqlconnection.query(sql1,function(err,states){
          res.render('screens/user',{
            role_id:req.user.role_id,
            users:users,
            states:states
          });
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/ads', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql3 = "SELECT `ads`.*,`users`.`name` AS u_name FROM `ads` INNER JOIN `users` WHERE `users`.`user_id` = `ads`.`user_id` AND `ads`.`status` = 1 ORDER BY `order`";
      mysqlconnection.query(sql3,function(err,ads){
        if(!err){
          res.render('screens/ads',{
            role_id:req.user.role_id,
            ads:ads,
            admin_id: req.user.user_id
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/slider', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql3 = "SELECT `slider`.*,`users`.`name` AS u_name FROM `slider` INNER JOIN `users` WHERE `users`.`user_id` = `slider`.`user_id` AND `slider`.`status` = 1 ORDER BY `order`";
      mysqlconnection.query(sql3,function(err,slider){
        if(!err){
          res.render('screens/slider',{
            role_id:req.user.role_id,
            slider:slider,
            admin_id: req.user.user_id
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/add-ads-images', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var admin_id = req.body.admin_id;
      var order = req.body.order;

      var a = [];

      if(req.files.images[0] == undefined){
        a.push(req.files.images);
      }else {
        a = req.files.images;
      }

      for(var i = 0 ;i<a.length;i++){
        var Images = a[i];
        var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
        fs.mkdirp('public/ads_images/' , function(err){
          if(err){
            return console.log(err);
          }
        });
        fs.mkdirp('public/ads_images/gallery', function(err){
          if(err){
            return console.log(err);
          }
        });

        fs.mkdirp('public/ads_images/gallery/thumbs', function(err){
          if(err){
            return console.log(err);
          }
        });
        var path1 = 'public/ads_images/' + imageFiles;
        Images.mv(path1, function(err){
          if(err){
            return console.log(err);
          }
        });
        var b = parseInt(order)+1 + i;
        var sql = "INSERT INTO `ads` (`image_path`,`order`,`user_id`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "')";
        mysqlconnection.query(sql,function(err,img){
        });
      }
      res.redirect('/ads');
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/add-slider-images', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var admin_id = req.body.admin_id;
      var order = req.body.order;
      var category = req.body.category;

      var a = [];

      if(req.files.images[0] == undefined){
        a.push(req.files.images);
      }else {
        a = req.files.images;
      }


      for(var i = 0 ;i<a.length;i++){
        var Images = a[i];
        var imageFiles = typeof (a)[i].name !=="undefined" ? (a)[i].name : "" ;
        fs.mkdirp('public/slider_images/' , function(err){
          if(err){
            return console.log(err);
          }
        });
        fs.mkdirp('public/slider_images/gallery', function(err){
          if(err){
            return console.log(err);
          }
        });

        fs.mkdirp('public/slider_images/gallery/thumbs', function(err){
          if(err){
            return console.log(err);
          }
        });
        var path1 = 'public/slider_images/' + imageFiles;
        Images.mv(path1, function(err){
          if(err){
            return console.log(err);
          }
        });
        var b = parseInt(order)+1 + i;
        var sql = "INSERT INTO `slider` (`image_path`,`order`,`user_id`,`category`) VALUES ('" + imageFiles + "','" + b + "','" + admin_id + "','" + category + "')";
        mysqlconnection.query(sql,function(err,img){
        });
      }
      res.redirect('/slider');
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.post('/change-ads-order', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var n_order=req.body.n_order;
      var ads_id=req.body.ads_id;
      var a = [];
      var b = [];
      if(n_order[0] == undefined && slider_id[0] == undefined){
        a.push(n_order);
        b.push(ads_id);
      } else {
        a = n_order;
        b = ads_id;
      }
      for(var i = 0;i<b.length;i++){
        var sql = "UPDATE `ads` SET `order` = '"+a[i]+"' WHERE `ads_id` = '"+b[i]+"'";
        mysqlconnection.query(sql,function(err,data) {
        });
      }
      res.redirect('/ads');
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/change-order', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var n_order=req.body.n_order;
      var slider_id=req.body.slider_id;
      var a = [];
      var b = [];
      if(n_order[0] == undefined && slider_id[0] == undefined){
        a.push(n_order);
        b.push(slider_id);
      } else {
        a = n_order;
        b = slider_id;
      }
      for(var i = 0;i<b.length;i++){
        var sql = "UPDATE `slider` SET `order` = '"+a[i]+"' WHERE `slider_id` = '"+b[i]+"'";
        mysqlconnection.query(sql,function(err,data) {
        });
      }
      res.redirect('/slider');
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-slider/:slider_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var slider_id = req.params.slider_id;

      var sql = "UPDATE `slider` SET `status` = 0 WHERE `slider_id` = '"+slider_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/slider');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-ads/:ads_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var ads_id = req.params.ads_id;

      var sql = "UPDATE `ads` SET `status` = 0 WHERE `ads_id` = '"+ads_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/ads');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/add-user', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `role`";
      // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
      var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
      mysqlconnection.query(sql,function(err,role){
        mysqlconnection.query(sql1,function(err,states){
          res.render('screens/add-user',{
            role_id:req.user.role_id,
            role:role,
            states:states,
            admin_id: req.user.user_id
          });
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/add-user', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var username=req.body.username;
      var full_name=req.body.full_name;
      var password=getHashedPassword(req.body.password);
      var city=req.body.city;
      var role=req.body.role;
      var admin_id = req.body.admin_id;
      var is_approved = 1;
      if(role == 2){
        // var auto_approved = 1;
        var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`is_approved`, `city`, `role_id`,`created_by`,`auto_approved`) VALUES ('" + username + "', '" + full_name + "' ,'" + password + "' ,'" + username + "' ,'" + is_approved + "' , '" + city + "', '" + role + "', '" + admin_id + "',1)";
      } else {
        // var auto_approved = 0;
        var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`is_approved`, `city`, `role_id`,`created_by`) VALUES ('" + username + "', '" + full_name + "' ,'" + password + "' ,'" + username + "' ,'" + is_approved + "' , '" + city + "', '" + role + "', '" + admin_id + "')";
      }

      // console.log(auto_approved);

      // console.log(sql6);
      mysqlconnection.query(sql6,function(err,data){
        // console.log(data);
        if(!err){
          if(req.files != null) {
            if(req.files.images != undefined &&  req.files.document == undefined){
              var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
              fs.mkdirp('public/user_profile/photo/' + data.insertId, function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + data.insertId  + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var Image = req.files.images;
              var path = 'public/user_profile/photo/'+ data.insertId + '/' + imageFile;
              Image.mv(path, function(err){
                if(err){
                  return console.log(err);
                }
              });
              var sql = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + data.insertId + "','" + imageFile + "')";
              mysqlconnection.query(sql,function(err,img){});
            }
            if(req.files.images == undefined &&  req.files.document != undefined){
              var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
              fs.mkdirp('public/user_profile/document/' + data.insertId, function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/document/' + data.insertId  + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var Document = req.files.document;
              var path = 'public/user_profile/document/'+ data.insertId + '/' + documentFile;
              Document.mv(path, function(err){
                if(err){
                  return console.log(err);
                }
              });
              var sql1 = "INSERT INTO `user_profile` (`user_id`,`document`) VALUES ('" + data.insertId + "','" + documentFile + "')";
              mysqlconnection.query(sql1,function(err,document){});
            }
            if(req.files.images != undefined &&  req.files.document != undefined){
              var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
              fs.mkdirp('public/user_profile/photo/' + data.insertId, function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + data.insertId  + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var Image = req.files.images;
              var path = 'public/user_profile/photo/'+ data.insertId + '/' + imageFile;
              Image.mv(path, function(err){
                if(err){
                  return console.log(err);
                }
              });
              var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
              fs.mkdirp('public/user_profile/document/' + data.insertId, function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/document/' + data.insertId  + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var Document = req.files.document;
              var path = 'public/user_profile/document/'+ data.insertId + '/' + documentFile;
              Document.mv(path, function(err){
                if(err){
                  return console.log(err);
                }
              });
              var sql = "INSERT INTO `user_profile` (`user_id`,`image`,`document`) VALUES ('" + data.insertId + "','" + imageFile + "','" + documentFile + "')";
              mysqlconnection.query(sql,function(err,user){});
            }
          }
          res.redirect('/add-user');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-user/:user_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var user_id = req.params.user_id;
      var sql = "UPDATE `users` SET `status` = 0 WHERE `user_id` = '"+user_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/users');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/edit-user/:user_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    var admin_id = req.params.user_id;
    var sql = "SELECT * FROM `users` WHERE `user_id` = '"+admin_id+"'";
    var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
    var sql1 = "SELECT * FROM `logo` WHERE `user_id` = '"+admin_id+"'";
    // var sql3 = "SELECT * FROM `states` WHERE `country_id` = 101";
    var sql3 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
    mysqlconnection.query(sql,function(err,users){
      mysqlconnection.query(sql1,function(err,logo){
        mysqlconnection.query(sql2,function(err,user_profile){
          mysqlconnection.query(sql3,function(err,states){
            if(!err){
              res.render('screens/edit-user',{
                users:users,
                admin_id:admin_id,
                role_id:req.user.role_id,
                logo:logo,
                user_profile:user_profile,
                states:states
              });
            }
          });
        });
      });
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/edit-user/:user_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    var admin_id = req.body.admin_id;
    var nickname = req.body.nickname;
    var username = req.body.username;
    var role_id = req.body.role;
    var city = req.body.city;
    var full_name = req.body.full_name;
    var father_name = req.body.father_name;
    var address = req.body.address;
    var phone = req.body.phone;
    var np = req.body.np;
    if(np != ''){
      np = getHashedPassword(np);
      var sql6 = "UPDATE `users` SET name = '"+username+"',password = '"+np+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"',role_id = '"+role_id+"',city = '"+city+"' WHERE user_id = '"+admin_id+"'";
      mysqlconnection.query(sql6,function(err,user){
      });
    } else {
      var sql6 = "UPDATE `users` SET name = '"+username+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"',role_id = '"+role_id+"',city = '"+city+"' WHERE user_id = '"+admin_id+"'";
      mysqlconnection.query(sql6,function(err,user){
      });
    }
    if(req.files != null){
      if(req.files.profileImage != undefined){
        var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
        mysqlconnection.query(sql2,function(err,data){
          var profileImage = req.files.profileImage;
          var profileimageFiles = typeof req.files.profileImage.name !=="undefined" ? req.files.profileImage.name : "" ;
          if(data.length == 0){
            var sql3 = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + admin_id + "','"+profileimageFiles+"')";
            mysqlconnection.query(sql3,function(err,profile){
              fs.mkdirp('public/user_profile/photo/' + admin_id , function(err){
                if(err){
                  return console.log(err);
                }
              });
              fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var path2 = 'public/user_profile/photo/' + admin_id + '/' + profileimageFiles;
              profileImage.mv(path2, function(err){
                if(err){
                  return console.log(err);
                }
              });
            });
          } else {
            fs.mkdirp('public/user_profile/photo/' + admin_id , function(err){
              if(err){
                return console.log(err);
              }
            });
            fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery', function(err){
              if(err){
                return console.log(err);
              }
            });

            fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
              if(err){
                return console.log(err);
              }
            });
            var path2 = 'public/user_profile/photo/' + admin_id + '/' + profileimageFiles;
            profileImage.mv(path2, function(err){
              if(err){
                return console.log(err);
              }
            });
            var sql7 = "UPDATE `user_profile` SET image = '"+profileimageFiles+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql7,function(err,user){
            });
          }
        });
      }
    }
    res.redirect('/edit-user/' + admin_id);
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
})


router.get('/settings', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
      var sql = "SELECT * FROM `users` WHERE `user_id` = '"+req.user.user_id+"'";
      var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+req.user.user_id+"'";
      var sql1 = "SELECT * FROM `logo` WHERE `user_id` = '"+req.user.user_id+"'";
      mysqlconnection.query(sql,function(err,users){
        mysqlconnection.query(sql1,function(err,logo){
          mysqlconnection.query(sql2,function(err,user_profile){
            if(!err){
              res.render('screens/settings',{
                users:users,
                admin_id:req.user.user_id,
                role_id:req.user.role_id,
                logo:logo,
                user_profile:user_profile
              });
            }
          });
        });
      });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.post('/settings', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    var admin_id = req.body.admin_id;
    var nickname = req.body.nickname;
    var full_name = req.body.full_name;
    var father_name = req.body.father_name;
    var address = req.body.address;
    var phone = req.body.phone;
    var np = req.body.np;
    if(np != ''){
      np = getHashedPassword(np);
      var sql6 = "UPDATE `users` SET password = '"+np+"',nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"' WHERE user_id = '"+admin_id+"'";
      mysqlconnection.query(sql6,function(err,user){
      });
    } else {
      var sql6 = "UPDATE `users` SET nickname = '"+nickname+"',full_name = '"+full_name+"',father_name = '"+father_name+"',address = '"+address+"',phone = '"+phone+"' WHERE user_id = '"+admin_id+"'";
      mysqlconnection.query(sql6,function(err,user){
      });
    }
    if(req.files != null){
      if(req.files.profileImage != undefined){
        var sql2 = "SELECT * FROM `user_profile` WHERE `user_id` = '"+admin_id+"'";
        mysqlconnection.query(sql2,function(err,data){
          var profileImage = req.files.profileImage;
          var profileimageFiles = typeof req.files.profileImage.name !=="undefined" ? req.files.profileImage.name : "" ;
          if(data.length == 0){
            var sql3 = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + admin_id + "','"+profileimageFiles+"')";
            mysqlconnection.query(sql3,function(err,profile){
              fs.mkdirp('public/user_profile/photo/' + admin_id , function(err){
                if(err){
                  return console.log(err);
                }
              });
              fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery', function(err){
                if(err){
                  return console.log(err);
                }
              });

              fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
                if(err){
                  return console.log(err);
                }
              });
              var path2 = 'public/user_profile/photo/' + admin_id + '/' + profileimageFiles;
              profileImage.mv(path2, function(err){
                if(err){
                  return console.log(err);
                }
              });
            });
          } else {
            fs.mkdirp('public/user_profile/photo/' + admin_id , function(err){
              if(err){
                return console.log(err);
              }
            });
            fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery', function(err){
              if(err){
                return console.log(err);
              }
            });

            fs.mkdirp('public/user_profile/photo/' + admin_id + '/gallery/thumbs', function(err){
              if(err){
                return console.log(err);
              }
            });
            var path2 = 'public/user_profile/photo/' + admin_id + '/' + profileimageFiles;
            profileImage.mv(path2, function(err){
              if(err){
                return console.log(err);
              }
            });
            var sql7 = "UPDATE `user_profile` SET image = '"+profileimageFiles+"' WHERE user_id = '"+admin_id+"'";
            mysqlconnection.query(sql7,function(err,user){
            });
          }
        });
      }
      if(req.files.image != undefined){
        var Images = req.files.image;
        var imageFiles = typeof req.files.image.name !=="undefined" ? req.files.image.name : "" ;
        fs.mkdirp('public/logo/' , function(err){
          if(err){
            return console.log(err);
          }
        });
        fs.mkdirp('public/logo/gallery', function(err){
          if(err){
            return console.log(err);
          }
        });

        fs.mkdirp('public/logo/gallery/thumbs', function(err){
          if(err){
            return console.log(err);
          }
        });
        var path1 = 'public/logo/' + imageFiles;
        Images.mv(path1, function(err){
          if(err){
            return console.log(err);
          }
        });
        var sql = "INSERT INTO `logo` (`path`,`user_id`) VALUES ('" + imageFiles + "','" + admin_id + "')";
        mysqlconnection.query(sql,function(err,img){
        });
      }
    }
    res.redirect('/settings');
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
})

router.get('/delete-logo-image/:logo_id/:path', function(req, res, next){
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var logo_id = req.params.logo_id;
      var path = req.params.path;
      var p = 'public/logo/' + path;

      fs.unlink(p, function (err) {
        if (err) throw err;
      });

      var sql = "DELETE FROM `logo` WHERE  logo_id ='"+logo_id+"'";
      mysqlconnection.query(sql,function(err,news){
        res.redirect('/settings');
      });

    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-profile-photo/:user_profile_id/:path/:id', function(req, res, next){
  if (req.user && res.statusCode == 200) {
    var admin_id = req.params.id;
    var user_profile_id = req.params.user_profile_id;
    var path = req.params.path;
    var p = 'public/user_profile/photo/' + admin_id +'/' + path;

    fs.unlink(p, function (err) {
      if (err) throw err;
    });

    var sql = "UPDATE `user_profile` SET image = NULL WHERE id = '"+user_profile_id+"'";
    mysqlconnection.query(sql,function(err,news){
      res.redirect('/settings');
    });
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.get('/e-paper', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `e-paper` WHERE `status` = 1 ORDER BY `created_at` DESC";
      var sql2 = "SELECT * FROM `epaper-category` WHERE `status` = 1";
      mysqlconnection.query(sql,function(err,epaper){
        mysqlconnection.query(sql2,function(err,category){
          res.render('screens/epaper',{
            role_id:req.user.role_id,
            admin_id:req.user.user_id,
            epaper:epaper,
            category:category
          });
        });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/epaper-images/:epaper_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var epaper_id = req.params.epaper_id;
      var sql = "SELECT * FROM `epaper_images` WHERE `epaper_id` = '"+epaper_id+"'";
      mysqlconnection.query(sql,function(err,epaper){
          res.render('screens/epaper-images',{
            role_id:req.user.role_id,
            epaper_images:epaper,
          });
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/add-epaper-category', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var sql = "SELECT * FROM `epaper-category` WHERE `status` = 1";
      mysqlconnection.query(sql,function(err,categories){
        if(!err){
          res.render('screens/epaper-category',{
            role_id:req.user.role_id,
            categories:categories
          });
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-epaper-category/:category_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category_id = req.params.category_id;

      var sql = "UPDATE `epaper-category` SET `status` = 0 WHERE `id` = '"+category_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/add-epaper-category');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});

router.get('/delete-epaper/:epaper_id', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var epaper_id = req.params.epaper_id;

      var sql = "UPDATE `e-paper` SET `status` = 0 WHERE `id` = '"+epaper_id+"'";
      mysqlconnection.query(sql,function(err,data) {
        res.redirect('/e-paper');
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});


router.post('/add-epaper-category', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category=req.body.category;
      var sql6 = "INSERT INTO `epaper-category` (`name`) VALUES ('" + category + "')";
      mysqlconnection.query(sql6,function(err,data){
        if(!err){
          res.redirect('/add-epaper-category');
        }
      });
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});



router.post('/add-epaper-pdf', function(req, res, next) {
  if (req.user && res.statusCode == 200) {
    if(req.user.role_id == 1 || req.user.role_id == 2){
      var category = req.body.category;
      var created_at = req.body.created_at;
      var admin_id = req.body.admin_id;
      // var thumbnail = req.files.thumbnail;
      // console.log(thumbnail);
      var date_main_image = new Date();
      var new_main_image_name = date_main_image.getTime() + 'cover.jpeg';

      req.files.thumbnail.name = new_main_image_name;

      var thumbnail = typeof req.files.thumbnail.name !=="undefined" ? req.files.thumbnail.name : "" ;
      fs.mkdirp('public/thumbnail/', function(err){
        if(err){
          return console.log(err);
        }
      });

      fs.mkdirp('public/thumbnail/gallery', function(err){
        if(err){
          return console.log(err);
        }
      });

      fs.mkdirp('public/thumbnail/gallery/thumbs', function(err){
        if(err){
          return console.log(err);
        }
      });
      var Image = req.files.thumbnail;
      var path = 'public/thumbnail/' + thumbnail;
      Image.mv(path, function(err){
        if(err){
          return console.log(err);
        }
      });
      if(req.files != null){
        var a = [];
        if(req.files.pdf[0] == undefined){
          a.push(req.files.pdf);
        }else {
          a = req.files.pdf;
        }

        var sql = "INSERT INTO `e-paper` (`category`,`user_id`,`created_at`,`thumbnail`) VALUES ('"+ category + "','" + admin_id + "','"+created_at+"','"+ thumbnail +"')";
        mysqlconnection.query(sql,function(err,img){
          // console.log(img);
          for (var i = 0;i<a.length;i++){
            var Images = a[i];
            var imageFiles = typeof a[i].name !=="undefined" ? a[i].name : "" ;
            fs.mkdirp('public/Epaper/' + img.insertId , function(err){
              if(err){
                return console.log(err);
              }
            });
            fs.mkdirp('public/Epaper/' + img.insertId +'/gallery', function(err){
              if(err){
                return console.log(err);
              }
            });

            fs.mkdirp('public/Epaper/' + img.insertId +'/gallery/thumbs/', function(err){
              if(err){
                return console.log(err);
              }
            });
            var path1 = 'public/Epaper/' + img.insertId + '/' + imageFiles;
            Images.mv(path1, function(err){
              if(err){
                return console.log(err);
              }
            });
            var sql1 = "INSERT INTO `epaper_images` (`path`,`epaper_id`) VALUES ('" + imageFiles + "','" + img.insertId + "')";
            mysqlconnection.query(sql1,function(err,data){});
          }
          res.redirect('/e-paper');
        });
      }
    } else if(req.user.role_id == 3 || req.user.role_id == 4) {
      res.render('screens/404');
    }
  } else {
    res.render('screens/login',{
    message:'You are logged out, Please login again',
    messageClass:'alert-danger'
  });
  }
});



router.get('/career', function(req, res, next) {
  var sql8 = "SELECT * FROM `logo`";
  // var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
  var sql1 = "SELECT * FROM `categories` WHERE `status` = 1 AND `is_state` = 1";
  mysqlconnection.query(sql8,function(err,logo){
    mysqlconnection.query(sql1,function(err,states){
      res.render('screens/career',{
        logo:logo,
        states:states,
        message:null,
        messageClass:null
      });
    });
  });
});

router.post('/career', function(req, res, next) {
  var father_name = req.body.father_name;
  var full_name = req.body.full_name;
  var address = req.body.address;
  var phone = req.body.phone;
  var city=req.body.city;
  var password = getHashedPassword(req.body.password);
  var is_approved = 0;
  var role_id = 3;
  var admin_id = 2;

  var sql6 = "INSERT INTO `users` (`name`,`full_name`, `password`,`phone`,`father_name`,`address`,`is_approved`, `city`, `role_id`,`created_by`) VALUES ('" + phone + "' ,'" + full_name + "' ,'" + password + "' ,'" + phone + "','" + father_name + "','" + address + "','" + is_approved + "' , '" + city + "', '" + role_id + "', '" + admin_id + "')";
  mysqlconnection.query(sql6,function(err,data){
    if(!err){
      if(req.files != null) {
        if(req.files.images != undefined &&  req.files.document == undefined){
          var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
          fs.mkdirp('public/user_profile/photo/' + data.insertId, function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/photo/' + data.insertId  + '/gallery', function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
            if(err){
              return console.log(err);
            }
          });
          var Image = req.files.images;
          var path = 'public/user_profile/photo/'+ data.insertId + '/' + imageFile;
          Image.mv(path, function(err){
            if(err){
              return console.log(err);
            }
          });
          var sql = "INSERT INTO `user_profile` (`user_id`,`image`) VALUES ('" + data.insertId + "','" + imageFile + "')";
          mysqlconnection.query(sql,function(err,img){});
        }
        if(req.files.images == undefined &&  req.files.document != undefined){
          var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
          fs.mkdirp('public/user_profile/document/' + data.insertId, function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/document/' + data.insertId  + '/gallery', function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
            if(err){
              return console.log(err);
            }
          });
          var Document = req.files.document;
          var path = 'public/user_profile/document/'+ data.insertId + '/' + documentFile;
          Document.mv(path, function(err){
            if(err){
              return console.log(err);
            }
          });
          var sql1 = "INSERT INTO `user_profile` (`user_id`,`document`) VALUES ('" + data.insertId + "','" + documentFile + "')";
          mysqlconnection.query(sql1,function(err,document){});
        }
        if(req.files.images != undefined &&  req.files.document != undefined){
          var imageFile = typeof req.files.images.name !=="undefined" ? req.files.images.name : "" ;
          fs.mkdirp('public/user_profile/photo/' + data.insertId, function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/photo/' + data.insertId  + '/gallery', function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/photo/' + data.insertId + '/gallery/thumbs', function(err){
            if(err){
              return console.log(err);
            }
          });
          var Image = req.files.images;
          var path = 'public/user_profile/photo/'+ data.insertId + '/' + imageFile;
          Image.mv(path, function(err){
            if(err){
              return console.log(err);
            }
          });
          var documentFile = typeof req.files.document.name !=="undefined" ? req.files.document.name : "" ;
          fs.mkdirp('public/user_profile/document/' + data.insertId, function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/document/' + data.insertId  + '/gallery', function(err){
            if(err){
              return console.log(err);
            }
          });

          fs.mkdirp('public/user_profile/document/' + data.insertId + '/gallery/thumbs', function(err){
            if(err){
              return console.log(err);
            }
          });
          var Document = req.files.document;
          var path = 'public/user_profile/document/'+ data.insertId + '/' + documentFile;
          Document.mv(path, function(err){
            if(err){
              return console.log(err);
            }
          });
          var sql = "INSERT INTO `user_profile` (`user_id`,`image`,`document`) VALUES ('" + data.insertId + "','" + imageFile + "','" + documentFile + "')";
          mysqlconnection.query(sql,function(err,user){});
        }
      }
      var sql8 = "SELECT * FROM `logo`";
      var sql1 = "SELECT * FROM `states` WHERE `country_id` = 101";
      mysqlconnection.query(sql8,function(err,logo){
        mysqlconnection.query(sql1,function(err,states){
          res.render('screens/career',{
            logo:logo,
            states:states,
            message:'Your Data is Successfully Submitted. Please wait until it is approved',
            messageClass: 'alert-success'
          });
        });
      });
    }
  });
});


router.get('/forgot-password', (req, res) => {
  res.render('screens/forgot-password',{
    message:null,
    messageClass:null
  });
});

router.post('/forgot-password', function(req, res, next) {
  var phone = req.body.phone;
  var password = getHashedPassword(req.body.password);

  var sql = "UPDATE `users` SET `password` = '" + password + "' WHERE phone = '" + phone + "'";
  mysqlconnection.query(sql,function(err,user){
    if(!err){
      res.render('screens/login', {
        message: 'Password Updated',
        messageClass: 'alert-success'
      });
    }
  });
});


router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = getHashedPassword(req.body.password);

  var sql = "SELECT * FROM `users` WHERE `name` = '" + username + "' AND `password` = '" + password + "' AND status = 1 AND is_approved = 1";
  mysqlconnection.query(sql,function(err,user){
    if(user.length != 0){
      const authToken = generateAuthToken();
      // Store authentication token
      authTokens[authToken] = user[0];
      // console.log(user[0]);
      // Setting the auth token in cookies
      var hours = 1*24*60*60*1000;
      res.cookie('AuthToken', authToken,{maxAge: hours});

      res.redirect('/');
    } else {
      res.render('screens/login', {
        message: 'Invalid Phone Number or password',
        messageClass: 'alert-danger'
      });
    }
  });
});


router.get('/searchEpaperCategory/:name', function(req, res, next) {
  var name = req.params.name;
  var sql = "SELECT * FROM `epaper-category` WHERE name = '" + name + "' AND `status` = 1";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/Usernotapproved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `users` SET `is_approved` = 0 WHERE user_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/Userapproved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `users` SET `is_approved` = 1 WHERE user_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/Userautonotapproved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `users` SET `auto_approved` = 0 WHERE user_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/Userautoapproved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `users` SET `auto_approved` = 1 WHERE user_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/searchUser/:name', function(req, res, next) {
  var name = req.params.name;
  var sql = "SELECT * FROM `users` WHERE name = '" + name + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/searchPhoneNumber/:phone', function(req, res, next) {
  var phone = '%' + req.params.phone;
  var sql = "SELECT * FROM `users` WHERE name LIKE '" + phone + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/getCity/:name', function(req, res, next) {
  var name = req.params.name;
  var sql1 = "SELECT * FROM `states` WHERE name = '" + name + "'";
  mysqlconnection.query(sql1,function(err,states){
    var sql = "SELECT * FROM `cities` WHERE state_id = '" + states[0].id + "'";
    mysqlconnection.query(sql,function(err,data){
      res.jsonp(data);
    });
  });
});

router.get('/changeSliderCategory/:category/:slider_id', function(req, res, next) {
  var category = req.params.category;
  var slider_id = req.params.slider_id;
  var sql = "UPDATE `slider` SET `category` = '"+category+"' WHERE slider_id = '" + slider_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/notimportant/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `news` SET `imp` = 0 WHERE news_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/important/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `news` SET `imp` = 1 WHERE news_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/notapproved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `news` SET `is_approved` = 0 WHERE news_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/approved/:news_id', function(req, res, next) {
  var news_id = req.params.news_id;
  var sql = "UPDATE `news` SET `is_approved` = 1 WHERE news_id = '" + news_id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/postnotapproved/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "UPDATE `user_post` SET `is_approved` = 0 WHERE id = '" + id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/postapproved/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "UPDATE `user_post` SET `is_approved` = 1 WHERE id = '" + id + "'";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/searchCategory/:name', function(req, res, next) {
  var name = req.params.name;
  var sql = "SELECT * FROM `categories` WHERE name = '" + name + "' AND `status` = 1";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/searchSubCategory/:name', function(req, res, next) {
  var name = req.params.name;
  var sql = "SELECT * FROM `sub-categories` WHERE name = '" + name + "' AND `status` = 1";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/getSubCategory/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "SELECT * FROM `sub-categories` WHERE category_id = '" + id + "' AND `status` = 1";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/searchdCategory/:name', function(req, res, next) {
  var name = req.params.name;
  var sql = "SELECT * FROM `dcategory` WHERE name = '" + name + "' AND `status` = 1";
  mysqlconnection.query(sql,function(err,data){
    res.jsonp(data);
  });
});

router.get('/sendNotification/:title/:description', function(req, res, next) {
  var title = req.params.title;
  var description = req.params.description;
  var sql = "SELECT * FROM `fcm_token`";
  var registration_ids = [];
  mysqlconnection.query(sql,function(err,data){
    // console.log(data);
    if(data.length !=0) {
      // var loops = parseInt(data.length / 100);
      // console.log(data);
      // console.log(loops);
      // for (var l = 0; l <= loops ; l++) {
        for (var i = 0; i < data.length; i++) {
          registration_ids.push(data[i].token);
        }
      // }
      // console.log(registration_ids.length);
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: registration_ids,
        notification: {
          title: title,
          body: description
        },
      };

      fcm.send(message, function(err, response){
        if (err) {
          console.log(err);
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });
      // if(loops > 0){
      //   for(var l = 0;l<loops;l++){
      //     for(var i = l*100;i<(l+1)*100;i++){
      //       registration_ids.push(data[i].token);
      //     }
      //     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      //       registration_ids: registration_ids,
      //       notification: {
      //         title: title,
      //         body: description
      //       },
      //     };
      //
      //     fcm.send(message, function(err, response){
      //       if (err) {
      //         console.log("Something has gone wrong!");
      //       } else {
      //         console.log("Successfully sent with response: ", response);
      //       }
      //     });
      //   }
      // } else if(loops == 0){
      //   for(var i = 0;i<data.length;i++){
      //     registration_ids.push(data[i].token);
      //   }
      //   var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      //     registration_ids: registration_ids,
      //     notification: {
      //       title: title,
      //       body: description
      //     },
      //   };
      //
      //   fcm.send(message, function(err, response){
      //     if (err) {
      //       console.log("Something has gone wrong!");
      //     } else {
      //       console.log("Successfully sent with response: ", response);
      //     }
      //   });
      // }
    }
  });
});

router.post('/api/fcm-token', function(req, res, next) {
      var token=req.body.token;
      // console.log(token);
      var sql1 = "SELECT * FROM `fcm_token` WHERE `token` = '"+token+"'";
      mysqlconnection.query(sql1,function(err,data){
        if(data.length == 0){
          var sql = "INSERT INTO `fcm_token` (`token`) VALUES ('" + token + "')";
          mysqlconnection.query(sql,function(err,token){
            if(!err){
              res.jsonp({
                status :'success',
                msg:'Your token is saved',
              });
            } else {
              res.jsonp({
                status :'failed',
                msg:'Your token is not saved',
              });
            }
          });
        }
      });
});

module.exports = router;
