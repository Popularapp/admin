var express = require('express');
var router = express.Router();


/*Import databases*/
var mysqlconnection = require('../database/connection');

router.get('/getEpaper/:id', function(req, res, next) {
    var epaper_id = req.params.id;
    var sql = "SELECT `e-paper`.* , `epaper_images`.`path` ,`epaper-category`.`id` AS category FROM `e-paper` INNER JOIN `epaper_images` ON `epaper_images`.`epaper_id` = `e-paper`.`id` INNER JOIN `epaper-category` ON `epaper-category`.`name` = `e-paper`.`category` WHERE `e-paper`.`id` = '"+epaper_id+"' ORDER BY `e-paper`.`created_at` DESC LIMIT 1";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getPosts/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql = "SELECT `posts`.*,`dcategory`.`name` AS c_name,`categories`.`headingColor` AS hcolor, `users`.`nickname` AS u_name FROM `posts` INNER JOIN `dcategory` ON `dcategory`.`id` = `posts`.`category_id` INNER JOIN `users` ON `users`.`user_id` =`posts`.`user_id` WHERE `posts`.`is_approved` = 1 AND `posts`.`status` = 1 ORDER By `posts`.`posts_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getCategoryNews/:offset/:category_id', function(req, res, next) {
    var o = req.params.offset;
    var category_id = req.params.category_id;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`category_id` = '"+ category_id +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSimiliarNews/:sub_category_id/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sub_category_id = req.params.sub_category_id;
    // console.log(sub_category_id);
    var split1 = sub_category_id.split('(');
    // console.log(split1);
    if(split1[1] == undefined){
        var search_name = split1[0];
    } else {
        var search_name = (sub_category_id.split('(')[1]).split(')')[0];
    }
    // console.log(search_name);
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + search_name + '%') +"' ORDER By `news`.`news_id` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getStateNews/:offset/:state', function(req, res, next) {
    var o = req.params.offset;
    var state = req.params.state;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`state` = '"+ state +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getCityNews/:offset/:city', function(req, res, next) {
    var o = req.params.offset;
    var city = req.params.city;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` = '"+ city +"' ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getVideos/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql3 = "SELECT `videos`.*,`news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name  FROM `videos` INNER JOIN `news` ON `news`.`news_id` = `videos`.`news_id` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER BY `videos`.`id` DESC LIMIT 1 OFFSET "+o+"";
    mysqlconnection.query(sql3,function(err,videos){
        res.jsonp(videos);
    });
});

router.get('/getCategoryPost/:category_name/:offset', function(req, res, next) {
    var category_name = req.params.category_name;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,`dimages`.`path` FROM `user_post` INNER JOIN `dimages` ON `dimages`.`image_id` = (SELECT `image_id` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 ) WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`category_name` = '"+category_name+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getRecommendedPost/:city/:offset', function(req, res, next) {
    var city = req.params.city;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`city` = '"+city+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getMorePost/:city/:offset', function(req, res, next) {
    var city = req.params.city;
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' AND `user_post`.`city` <> '"+city+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});

router.get('/getMorePost/:offset', function(req, res, next) {
    var o = req.params.offset;
    var sql = "SELECT `user_post`.*,(SELECT `dimages`.`path` FROM `dimages` WHERE `dimages`.`posts_id` = `user_post`.`id` LIMIT 1 OFFSET 0) path FROM `user_post` WHERE `user_post`.`status` = 1 AND `user_post`.`is_approved` = 1 AND `user_post`.`website`= '"+common.logo_path+"' ORDER BY `user_post`.`created_at` DESC LIMIT 20 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,data){
        res.jsonp(data);
    });
});


router.get('/increaseCount/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `news` SET `views` = `views` + 1 WHERE `news_id` = '"+news_id+"'";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/increaseEpaperCount/:news_id', function(req, res, next) {
    var news_id = req.params.news_id;
    var sql = "UPDATE `e-paper` SET `views` = `views` + 1 WHERE `id` = '"+news_id+"'";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});


router.get('/getAllNews/:category_id', function(req, res, next) {
    var category_id = req.params.category_id;
    if(category_id == "all"){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }else if(category_id == "local"){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`is_state` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }else {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ category_id +"' AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    }
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});


router.get('/getAllNews/:category_id/:offset', function(req, res, next) {
    var category_id = req.params.category_id;
    // console.log(category_id);
    var o = req.params.offset;
    if(category_id == 'all') {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET " + o + "";
    }else if(category_id == 'local'){
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`status` = 1 AND `categories`.`is_state` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET " + o + "";
    } else {
        var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `news`.`category_id` = '"+ category_id +"' AND `categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    }
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsState/:sub_category_name', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ sub_category_name +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsState/:sub_category_name/:offset', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var o = req.params.offset;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `categories`.`name` = '"+ sub_category_name +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsCity/:sub_category_name', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    // console.log(sub_category_name);
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + sub_category_name + '%') +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET 0";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getFilterCity/:category_name', function(req, res, next) {
    var category_name = req.params.category_name;
    // console.log(sub_category_name);
    var sql = "SELECT `sub-categories`.`name` FROM `sub-categories` INNER JOIN `categories` ON `categories`.`id` = `sub-categories`.`category_id` WHERE `sub-categories`.`status` = 1 AND `categories`.`name` = '"+ category_name +"' AND `sub-categories`.`name` NOT LIKE '%(%'";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getFilterDistrict/:category_name', function(req, res, next) {
    var category_name = req.params.category_name;
    // console.log(category_name);
    var sql = "SELECT `name` FROM `sub-categories` WHERE `name` LIKE '"+ ('%' +  category_name + '%') +"' AND status = 1 AND `name` <> '"+  category_name +"'";
    // console.log(sql);
    mysqlconnection.query(sql,function(err,news){
        // console.log(news);
        res.jsonp(news);
    });
});

router.get('/getSubCategoryNewsCity/:sub_category_name/:offset', function(req, res, next) {
    var sub_category_name = req.params.sub_category_name;
    var o = req.params.offset;
    var sql = "SELECT `news`.*,`categories`.`name` AS c_name,`categories`.`headingColor` AS hcolor,`sub-categories`.`name` AS sc_name, `users`.`nickname` AS u_name FROM `news` INNER JOIN `categories` ON `categories`.`id` = `news`.`category_id` INNER JOIN `sub-categories` ON `sub-categories`.`id` =`news`.`sub_category_id` INNER JOIN `users` ON `users`.`user_id` =`news`.`user_id` WHERE `news`.`is_approved` = 1 AND `news`.`status` = 1 AND `sub-categories`.`name` LIKE '"+ ('%' + sub_category_name + '%') +"' AND `sub-categories`.`status` = 1 ORDER By `news`.`news_id` DESC LIMIT 10 OFFSET "+o+"";
    mysqlconnection.query(sql,function(err,news){
        res.jsonp(news);
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


module.exports = router;