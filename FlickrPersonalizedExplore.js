// ==UserScript==
// @name        PersonalizedExplore
// @namespace   flickr.com
// @description Your daily dose of inspiration
// @include     *://*.flickr.com/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==


var api_key = 'YOUR API KEY';

//To restrict the search results within specified limit.
var limit = 250;
var filteredPhotos = {
};
var totalPhotos = 0;
var next = 0;
var prev = 0;
var match = {
};
var addInterest = false;
//Default set of interestingness. Configurable at Frontend.
var interesting = '"sunrise","travel","landscape","portrait"';
var exploreAPI = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Cfarm%2Cserver%2Cid%2Csecret%2Ctags.tag.content%2Cowner.username%2Cowner.nsid%2Cowner.iconfarm%2Cowner.iconserver%20from%20flickr.photos.info%20where%20photo_id%20in%20(select%20id%20from%20flickr.photos.interestingness(' + limit + ')%20where%20api_key%3D%221ac508feeab43ba107696611d6a3c042%22)%20and%20api_key%3D%221ac508feeab43ba107696611d6a3c042%22%20and%20tags.tag.content%20in%20(' + interesting +')&format=json&callback=jsonFlickrApi';

var images = [
];
var title = [
];
var buddyName = [
];
var buddyIcon = [
];
function addCSS(css) {
    var head,
    style;
    head = document.getElementsByTagName('head') [0];
    if (!head) {
        return ;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
var exploredPhotos = function (data) {
    filteredPhotos = data;
    totalPhotos = data.query.results.photo.length;
    var photo = data.query.results.photo[0];
    var imageUrl = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
    var photoUrl = 'https://www.flickr.com/photos/' + photo.owner.nsid + '/' + photo.id;
    var userUrl = 'https://www.flickr.com/photos/' + photo.owner.nsid + '/';
    var title = photo.title;
    var buddyIcon = 'http://farm' + photo.owner.iconfarm + '.staticflickr.com/' + photo.owner.iconserver + '/buddyicons/' + photo.owner.nsid + '.jpg';
    var ownerName = photo.owner.username;
    var tags = photo.tags.tag;
    
    if(addInterest == false){
       $('#explored') .append('<a href= "' + photoUrl + '"><img src="' + imageUrl + '" width="970" id="photos"/></a><div id="title">' + title + '</div><a id ="buddy" href="' + userUrl + '">' + ownerName + '</a><img id="icon" src="' + buddyIcon + '"/><span id="tags">' + tags + '</span><span id="settings"><img src="http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/512/Very-Basic-Settings-icon.png"></span></div><div id="settings_pop"><input type="textbox"></input><label name="Add">Add Interest</label></div>');    
    }
    else{
        $('#explored a') .attr('href', photoUrl);
        $('#explored a > img') .attr('src', imageUrl);
        $('#title') .html(title);
        $('#buddy') .attr('href',userUrl);
        $('#icon') .attr('src',buddyIcon);
        $('#buddy') .html(ownerName);
        $('#tags') .html(tags);
    }
    if (totalPhotos >= 1) {
        next = 1;
    }
    $("#loading").hide();
}

$(document) .ready(function () {
    $('#firstCard') .before('<div id="explored"><div id="loading"><img style="-webkit-user-select: none" src="data:image/gif;base64,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"></div><h2>E<br>x<br>p<br>l<br>o<br>r<br>e<br></h2><div id="left" class="nav"></div><div id="right" class="nav"></div></div>');
    
    $.ajax({
        type: 'GET',
        url: exploreAPI,
        contentType: 'application/json',
        dataType: 'jsonp',
        jsonpCallback: 'jsonFlickrApi',
        success: exploredPhotos,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
        }
    });
    
    $('.nav') .click(function () {
        if ($(this).attr('id') == 'right') {
            var photo = filteredPhotos.query.results.photo[next];
        } 
        else {
            var photo = filteredPhotos.query.results.photo[prev];
            console.log(photo);
        }
        var imageUrl = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
        var photoUrl = 'https://www.flickr.com/photos/' + photo.owner.nsid + '/' + photo.id;
        var userUrl = 'https://www.flickr.com/photos/' + photo.owner.nsid + '/';
        var title = photo.title;
        var buddyIcon = 'http://farm' + photo.owner.iconfarm + '.staticflickr.com/' + photo.owner.iconserver + '/buddyicons/' + photo.owner.nsid + '.jpg';
        var ownerName = photo.owner.username;
        var tags = photo.tags.tag;
        $('#explored a') .attr('href', photoUrl);
        $('#explored a > img') .attr('src', imageUrl);
        $('#title') .html(title);
        $('#buddy') .attr('href',userUrl);
        $('#icon') .attr('src',buddyIcon);
        $('#buddy') .html(ownerName);
        $('#tags') .html(tags);
        if ($(this).attr('id') == 'right') {
            if (totalPhotos-1 != next) {
                $("#left").show();
                prev = next;
                next = next + 1;
            }
            else{
                $(this).hide();
            }
        } 
        else {
            if (0 != prev) {
                $("#right").show();
                next = prev;
                prev = prev - 1;
            }
            else{
                $(this).hide();
            }
        }
        console.log("Prev - " + prev + "Next - " + next);
    });
    
    $(document).on('click','#settings',function () {
         $("#settings_pop").slideToggle('slow');
    });
    
    $(document).on('click','#settings_pop label',function () {
         var interesting = $("#settings_pop input").val();
         exploreAPI = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Cfarm%2Cserver%2Cid%2Csecret%2Ctags.tag.content%2Cowner.username%2Cowner.nsid%2Cowner.iconfarm%2Cowner.iconserver%20from%20flickr.photos.info%20where%20photo_id%20in%20(select%20id%20from%20flickr.photos.interestingness(' + limit + ')%20where%20api_key%3D%221ac508feeab43ba107696611d6a3c042%22)%20and%20api_key%3D%221ac508feeab43ba107696611d6a3c042%22%20and%20tags.tag.content%20in%20(' + interesting +')&format=json&callback=jsonFlickrApi';
        addInterest = true;
        $('#loading').show();
        $.ajax({
           type: 'GET',
           url: exploreAPI,
           contentType: 'application/json',
           dataType: 'jsonp',
           jsonpCallback: 'jsonFlickrApi',
           success: exploredPhotos,
           error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
           }
       });
       $("#settings_pop").slideToggle('slow');
    });
    
    $('#explored') .mouseenter(function () {
        $('#title') .fadeIn();
        $('#tags') .fadeIn();
        $('#settings') .fadeIn();
        if(prev != 0)$('#left') .fadeIn();
        if (next != totalPhotos -1) $('#right') .fadeIn();
    }) .mouseleave(function () {
        $('#title') .fadeOut();
        $('#left') .fadeOut();
        $('#right') .fadeOut();
        $('#tags') .fadeOut();
        $('#settings') .fadeOut();
    });
    
});
addCSS('#explored h2{ color:#FFFFFF; position:absolute;padding:15px;text-transform: uppercase;background-color:rgba(0,0,0,0.6);font-size:10px;}');
addCSS('#explored li{ margin-bottom:5px; }');
addCSS('#explored { background-color:rgba(0,0,0,0.6);height:662px;margin-bottom:10px; position:relative;}');
addCSS('#photos{ max-height:662px;min-width:970px;min-height:662px;}');
addCSS('#left { display:none;opacity:0.5;display:none;cursor:pointer;left:15px;height: 50px;padding: 10px;position: absolute;top: 50%;width: 50px;z-index: 1;background-image: url("http://www.clker.com/cliparts/l/C/A/E/c/P/left-black-arrow-md.png"); background-size: 70px auto;}');
addCSS('#right { display:none;opacity:0.5;cursor:pointer;left:885px; height: 49px;padding: 10px;position: absolute;top: 50%;width: 50px;z-index: 1;background-image: url("http://www.clker.com/cliparts/3/W/W/N/T/e/right-black-arrow-md.png"); background-size: 70px auto;}');
addCSS('#title {background-color:black;color: #FFFFFF;display: block;width:960px;height: 25px;position: absolute;text-align: left;top: 624px;padding:7px 0 7px 10px;display:none}');
addCSS('#icon {left: 50px;    opacity: 0.853333;    position: absolute;    top: 0;}');
addCSS('#buddy{color: #FFFFFF;    font-size: 19px;    font-weight: 200;    left: 95px;    padding: 10px;    position: absolute;}');
addCSS('#buddy:hover{background-color:rgba(0,0,0,0);}');
addCSS('#tags{display:none;background-color: rgba(0, 0, 0, 0.5);border-radius: 25px;color: #FFFFFF;font-size: 15px;font-weight: 200;padding: 7px;position: absolute;right: 35px;text-align: center;top: 10px;}');
addCSS('#settings img{left: 940px;position: absolute;top: 15px;width: 20px;cursor:pointer}')
addCSS('#settings_pop {left: 810px;position: absolute;top: 50px;background: white;border-radius:10px;display:none;}')
addCSS('#settings_pop label {background-color:rgba(0,0,0,0.6);display: block;margin: 10px;padding: 5px;text-align: center;font-weight:200;cursor:pointer;color:white;}')
addCSS('#settings_pop input {display: block;margin: 10px;padding: 5px;text-align: center;border-top:none;border-left:none;border-right:none;border-bottom:1px solid black;}')
addCSS('#loading {position:absolute;top:50%;left:50%;}')
