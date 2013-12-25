/**
 * EX.UA plugin for Showtime
 *
 *  Copyright (C) 2013 Wain
 *
 *	This plugin is based on lprot code (https://github.com/lprot)
 *
 *	It's simplified and speed-up version to run specifically on low-end hardware (e.g. Raspberry Pi)
 *
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function(plugin) {
  
  var PREFIX = 'ex_ua_simple';
  var BASE_URL = 'http://ex.ua';
  var logo = plugin.path + "logo.png";
  
  function setPageHeader(page, title) {
    if (page.metadata) {
      page.metadata.title = title;
      page.metadata.logo = logo;
    }
    page.type = "directory";
    page.contents = "items";
  }
  
  var service = plugin.createService("ex.ua", PREFIX + ":start", "video", true, logo);
  
  var settings = plugin.createSettings("EX.UA", plugin.path + "logo.png", "EX.UA: Server of information exchange");
  settings.createDivider('Settings');
  settings.createMultiOpt("lang", "Language", [
  ['en', 'english'],
  ['ru', 'русский', true],
  ['uk', 'українська'],
  ['es', 'espanol'],
  ['de', 'deutsch'],
  ['fr', 'français'],
  ['pl', 'polski'],
  ['ja', '日本語'],
  ['kk', 'қазақ']
  ], function(l) {
    service.lang = l;
  });
  
  settings.createBool("Show_video", "Показывать раздел \"Видео\"", true, function(v) {
    service.showVideo = v;
  });
  
  settings.createBool("Show_audio", "Показывать раздел \"Аудио\"", true, function(v) {
    service.showAudio = v;
  });
  
  settings.createBool("Show_images", "Показывать раздел \"Изображения\"", false, function(v) {
    service.showImages = v;
  });
  
  settings.createBool("Show_texts", "Показывать раздел \"Тексты\"", false, function(v) {
    service.showTexts = v;
  });
  
  settings.createBool("Show_popular", "Показывать раздел \"Самое популярное\"", false, function(v) {
    service.showPopular = v;
  });
  
  settings.createBool("Easy_mode", "Упрощенный режим", false, function(v) {
    service.easyMode = v;
  });
  
  settings.createBool("Fs_previews", "Большие превью", false, function(v) {
    service.fullsizedPreviews = v;
  });
  
      settings.createBool("Show_finished", "Показывать сообщение о достижении конца директории", true, function(v) {
        service.showEndOfDirMessage = v;
    });
      
      
      var requestMinDelay = [
      [2000,'2 сек'],
      [1500,'1.5 сек'],
      [1000,'1 сек'],
      [500,'0.5 сек', true]
    ];
    
    settings.createMultiOpt("Min.Delay", "Интервал запросов к серверу", requestMinDelay, function(v) {
        service.requestMinDelay = v;
    });
    settings.createInfo("info2",'', "Чем меньше значение - тем быстрее подгрузка списков в директориях с большим количеством файлов, но тем больше вероятность ошибки сервера. \n");
    
    var requestQuantity = [
      [20,'20', true],
      [40,'40'],
      [60,'60'],
      [80,'80'],
      [100,'100']
    ];
       
    settings.createMultiOpt("requestQuantity", "Количество запрашиваемых данных в одном запросе", requestQuantity, function(v) {
        service.requestQuantity = v;
    });
  
  
  function startPage(page) {
    setPageHeader(page, "EX.UA");
    var lang = service.lang;
    
    if(service.showVideo) {
    page.appendItem(PREFIX + ':cat:'+lang+'/video', 'directory', {
      title: "Видео",
      icon: logo
    });
  }
  if(service.showAudio) {
    page.appendItem(PREFIX + ':cat:'+lang+'/audio', 'directory', {
      title: "Аудио",
      icon: logo
  });
}

if(service.showImages) {
  page.appendItem(PREFIX + ':cat:'+lang+'/images', 'directory', {
    title: "Изображения",
    icon: logo
});
  }
  
  if(service.showTexts) {
  page.appendItem(PREFIX + ':cat:'+lang+'/texts', 'directory', {
    title: "Тексты",
    icon: logo
  });
  }
  
    
    if(service.showPopular) {
      page.appendItem(PREFIX + ':index:/top', 'directory', {
	title: 'Самое популярное (Most popular)',
		      icon: logo
      });
      page.appendItem(PREFIX + ':index:/top/1', 'directory', {
	title: 'Самое обсуждаемое (Most discussed)',
		      icon: logo
      });
      page.appendItem(PREFIX + ':index:/top/2', 'directory', {
	title: 'Самое рекомендуемое (Most recommended)',
		      icon: logo
      });
    }
    page.loading = false;
    };
    
   
    
      function getType(type) {
	type = type.toLowerCase();
	switch (type) {
	  case "mkv":
	  case "avi":
	  case "flv":
	  case "mp4":
	  case "mov":
	  case "ts":
	  case "mpg":
	  case "mpeg":
	  case "vob":
	  case "iso":
	  case "m4v":
	  case "wmv":
	  case "m2ts":
	    return "video";
	  case "jpg":
	  case "jpeg":
	  case "png":
	  case "bmp":
	  case "gif":
	    return "image";
	  case "mp3":
	  case "flac":
	  case "wav":
	  case "ogg":
	  case "aac":
	  case "m4a":
	  case "ape":
	  case "dts":
	  case "ac3":
	    return "audio";
	  default:
	    return "file";
	}
      }
        
      
      
        
   
       //not working currently
	    function getArtistItems(response) {
	      
	      showtime.print("Artist page!");
	      var returnedObject = new Array();
	      var item = {};
	      
	      
	    var re = /<div class="poster">[\S\s]*?<img src="([^"]+)" \/>[\S\s]*?<div id="content_page">([\S\s]*?)<\/div>/g;
	    var match = re.exec(response);
	    
	    var reTitle = /<title>([\S\s]*?)<\/title>/;
	    var pageTitle = reTitle.exec(response);
	    pageTitle = pageTitle[1];

	    
	    item = {
	    title: pageTitle,
	    description : match[2],
	    poster : match[1]	    
	    };
	    
	    
	    returnedObject.push(item);
	    
	    
				    if (match) {
				      re = /playlist: \[ "([^"]+)/;
				      var match2 = re.exec(response);
				      
				      if (match2) {
					
				item = {
				  url : match2[1],
				  type : "video",
				  title : page.metadata.title	  
				};

				returnedObject.push(item);
				      } 
				      
				      re = /<a class="active" href="[^"]+"><b>[\S\s]*?<\/b><\/a>([\S\s]*?)<!-/;
				      match2 = re.exec(response);
				      if (match2[1]) {
					re = /<a href="([^"]+)"><b>([^<]+)<\/b>/g;
					var match3 = re.exec(match2[1]);
					while (match3) {
					  
					  item = {
					    url : match3[1],
					    type : "directory",
					    title : match3[2]	  
					  };
					  
					  returnedObject.push(item);
					  match3 = re.exec(match2[1]);
					}
				      }
				    }
				   return returnedObject;
	      
	    }
	      
	    function getItems(url) {
	      
	      showtime.print('Getting item props by url: '+BASE_URL + url);
	  var response = showtime.httpGet(BASE_URL + url, "", {
	    'Cookie': 'ulang=' + service.lang
	    });
	  
	  
	  var returnedObject = new Array();
	  var item = {};
	  
	  var reTitle = /<title>([\S\s]*?)<\/title>/;
	  var pageTitle = reTitle.exec(response);
	  pageTitle = pageTitle[1];
	  
	  var rePosterDesc = /valign=top>[\S\s]*?<img src='([^\']+)[\S\s]*?<\/small>([\S\s]*?)<\/td>/;
	  var poster = rePosterDesc.exec(response);
	  var description = poster[2].replace(/(\r\n|\n|\r)/gm, "");
	  poster = poster[1];
	  
	  item = {
	   title: pageTitle,
	   description : description,
	   poster : poster	    
	  };
	  
	  returnedObject.push(item);
	  
	  
	  //making useful links
	  // 1 - link, 2 - title		
	  var re = /i_disk.jpg[\S\s]*?<a href='([^\']+)' title='([\S\s]*?)'/g;
	  var match = re.exec(response);
	  
	  if (match) {
	    showtime.print("GOT something in folder");
	    while (match) {
	      var itemType = getType(match[2].split('.').pop());
	      showtime.print("GOT: "+match[2]);
	      
	      
	      if (itemType == "video" || itemType == 'audio') {
		
		var v = BASE_URL + match[1];
		
		item = {
		type : itemType,
		url : v,
		title : showtime.entityDecode(match[2])
		};
		returnedObject.push(item);
	      }
	      match = re.exec(response);
	    }
	  }
	  return returnedObject;
	  
	  }
	  
	  function itemPage(page,url) {
	    
	    var items = getItems(url);
	    showtime.print("ITEM:"+items.length);
	    //setting page title
	    setPageHeader(page, items[0].title);
	    //end setting page title
	    
	    var item;
	    
	    //first item ALWAYS contains general page info: pageTitle, description, poster
	    //so, if there's one, maybe it's not an item, but a nested list
	    if(items.length==1) {
	      //give control to listPage
	      showtime.print("Giving control to list controller");
	      listPage(page,url);
	      return false;
	    }
	    
	    showtime.print("making list!");
	    for(var i=1;i<items.length;i++) {
	      item = items[i];
	      
	      showtime.print("Started processing item "+i);
	      
	      if(item.type=='video') {
	      page.appendItem(PREFIX + ":play:" + escape(item.type) + ":" + escape(item.url) + ":" + escape(page.metadata.title), 'video', {
		title: item.title,
		icon: items[0].poster,
		description: new showtime.RichText(items[0].description)
	      });
	      }
	      else {
		page.appendItem(item.url, item.type, {
		title: item.title,
		icon: items[0].poster,
		description: new showtime.RichText(items[0].description)
	      });
	      }
	    showtime.print("Processed item "+i);
	      
	    }
	    
	    url = 0;
	    page.loading = false;
	    return false;
	    
	  }
	  	  
	  function categoriesPage(page,url) {
	    
	    var response = showtime.httpGet(BASE_URL + '/' + url, "", {
	      'Cookie': 'ulang=' + service.lang
	    });
	    //setting page title
	    var re = /<title>([\S\s]*?)<\/title>/;
	    setPageHeader(page, showtime.entityDecode(re.exec(response)[1]));
	  //end setting page title
	  
	  re = /valign=center><a href='([\S\s]*?)'>([\S\s]*?)<b>([\S\s]*?)<\/b><\/a><.*?>([\S\s]*?>)\&nbsp\;/g;
	  // 1 = link, 2 = raw image link or empty field, 3 = title, 4 = additional info
	  var match = re.exec(response);
	  
	  //at this stage, we've got a MATCH
	  //match is a single item on a page
	  //now let's make a list of categoriesPage
	  
	  if(match) {
	    while(match) {
	      page.appendItem(PREFIX + ":list:" + match[1], "directory", {
		title: new showtime.RichText(match[3])
	      });
	      
	      match = re.exec(response);
	    }
	    page.loading = false;
	    return 0;
	  }
	  page.loading = false;
	  page.error("No items at page");
	  return 0;
	  }
	  
	  function listPage(page, url) {
	    
	    var counter = 0;
	    var lastRequest = 0,
	    requestFinished = true,
	    endOfDirectory = false,
	    pageNumber = 0;
	    
	    var listLoader = function() {
	
	  if(!requestFinished) {
	    showtime.print("Request not finished yet, exiting");
	    return false;
	  }
	 
	      
	      var delay = countDelay(service.requestMinDelay,lastRequest);
	      
	      var makeRequest = function() {
// 		try {
		  //force return if the previous request found end of directory
		if(endOfDirectory) {
		  showtime.print("Force aborted request. No more items to show");
		  return false;
		}
		  
		var counter_before = counter;  
		lastRequest = showtime.time();
		requestFinished = false;
		
		
		showtime.print("Time to make some requests now!");

		//make request here ----------------------------------------------------------------------------------------------
		
		    var response = showtime.httpGet(BASE_URL + url +'&p='+pageNumber, "", {
		      'Cookie': ['ulang=' + service.lang,'uper=' + service.requestQuantity]
		    });
		    showtime.print(BASE_URL + url +'&p='+pageNumber);

							    
		    var re = /valign=center><a href='([\S\s]*?)'>([\S\s]*?)<b>([\S\s]*?)<\/b><\/a><.*?>([\S\s]*?>)\&nbsp\;/g;
		    // 1 = link, 2 = raw image link with tags, 3 = title
		    var match = re.exec(response);
		    
		    //maybe we try without params
		    if(!match) {
		      showtime.print("No match, trying to refresh page without params");
		     response = showtime.httpGet(BASE_URL + url, "", {
		      'Cookie': 'ulang=' + service.lang
		    });
		     match = re.exec(response);
		    }
		    
		    //it can me megogo link
		    //give control to megogo handler
		    //at best, there's only ONE item per page
		    if(!match) {
		      showtime.print("Still no match, trying to give control to megogo handler");
		      if(megogoPage(page,response)) {
			requestFinished = true;
			endOfDirectory = true;
			return false;
		      }
		    }
		    
		    //at this stage, we've got a MATCH
		    //match is a single item on a page
		    //now let's make a list of items
		    
		    
		    if(match) {
		    	//setting page title
		      var reTitle = /<title>([\S\s]*?)<\/title>/;
		      setPageHeader(page, showtime.entityDecode(reTitle.exec(response)[1]));
			 //end setting page title 

		      while(match) {
			
			//making proper image links
			var reImgUrl = /<img src='([\S]*)\?/;
			match[2] = reImgUrl.exec(match[2]);
			if(match[2]) {
			  match[2] = match[2][1];
			}
			else {
			  match[2] = ""; 
			}
			//url 
			page.appendItem(PREFIX + ":item:" + match[1], "video", {
			  title: new showtime.RichText(match[3]),
			  icon: match[2]
			});
			
			//increase items counter
			counter++;
			
			match = re.exec(response);
		      }
		      showtime.print("NOW "+counter+" ITEMS AT PAGE. "+(counter-counter_before)+" RECEIVED - "+service.requestQuantity);
		      
		      //if the number of items received is less than requested, it's the end of the directory
		      if((counter-counter_before)<service.requestQuantity) {
			showtime.print("End of List");
			endOfDirectory = true;
			//notify the user that there is no more items in the directory
			if(service.showEndOfDirMessage&&pageNumber && pageNumber>1) {
			  showtime.notify("Достигнут конец директории",2);
			}
			requestFinished = true;
			return false;
		      }
		    }
		    else {
		      showtime.print("NO MATCH: "+match);
		      //notify the user that there is no more items in the directory
		      if(service.showEndOfDirMessage && pageNumber>1) {
			showtime.notify("Достигнут конец директории",2);
		      }
		      endOfDirectory = true;
		      requestFinished = true;
		      return false;
		    }
		
		
		//end making request-------------------------------------------------------------------------------------------------
		
		requestFinished = true;
		pageNumber++;
		showtime.print("Request finished!. Got "+pageNumber);
		return true;
//		}
// 		catch(err) {
// 		 showtime.notify("Подгрузка контента не удалась. Возможно, сервер не ответил вовремя.",5);
// 		 return false;
// 		}
	      };
	      
		  showtime.print("Let's wait "+delay+" msec before making a request!");
		  showtime.sleep(delay);
		return makeRequest();
	      
	    }
	    
	    page.paginator = listLoader;
	    
	    listLoader();
	    page.loading = false;
	    
	  }
	  
	  function megogoPage(page, response) {
	    
	        var re = /class="button">[\S\s]*?<a href="([^\?]+)/;
                var match = re.exec(response);
                if (match) {
                    var re = /[\S\s]*?([\d+^\?]+)/i;
                    var videoID = re.exec(match[1])[1];
                    var sign = showtime.md5digest('video=' + videoID + 'megogosign123');
                    sign = showtime.JSONDecode(showtime.httpGet('http://megogo.net/p/video?video=' + videoID + '&sign=' + sign));
		    
		    if(sign.error) {
		      page.error("Ошибка при загрузке видео :(");
		      return false;
		    }
		    
                    page.appendItem(PREFIX + ":playmegogo:" + match[1], "video", {
                        title: new showtime.RichText(page.metadata.title),
                        icon: 'http://megogo.net' + unescape(sign.video[0].image.big),
                        year: +parseInt(sign.video[0].year),
                        genre: unescape(sign.video[0].genre_list[0].title),
                        rating: sign.video[0].rating_imdb * 10,
                        duration: +parseInt(sign.video[0].duration),
                        description: showtime.entityDecode(unescape(sign.video[0].description))
                    });
                }
                    return true;
	  }
	  
	  function playPage(page, type, url, title) {
	   showtime.print("Playing "+unescape(type) + " " + unescape(title) + "with URL: "+ unescape(url));
	//no loading circle was present, forcing
	page.loading = true;
        var video = unescape(url);
	type = unescape(type);
	title = unescape(title);
	
        if (showtime.probe(video).result === 0) {
            page.type = type;
            page.source = type+"params:" + showtime.JSONEncode({
                title: title,
                canonicalUrl: PREFIX + ":play:" + type + ":" + url + ":" + title,
                sources: [{
                    url: video
                }]
            });
        } else {
            showtime.notify(video, 3);
             showtime.print(video+"\n"+ "Go Back",1,0)
        }
        page.metadata.logo = logo;
        page.loading = false;    
	  }
	  
	  function playMegogoPage(page, url) {
	    var re = /[\S\s]*?([\d+^\?]+)/i;
	    var match = re.exec(url);
	    var sign = showtime.md5digest('video=' + match[1] + '1e5774f77adb843c');
	    sign = showtime.JSONDecode(showtime.httpGet('http://megogo.net/p/info?video=' + match[1] + '&sign=' + sign + '_samsungtv'));
	    if (!sign.src) {
	      page.loading = false;
	      showtime.message("Error: This video is not available in your region :(", true, false);
	    return;
	    }
	    page.type = "video";
	    page.source = "videoparams:" + showtime.JSONEncode({
	      title: unescape(sign.title),
	      canonicalUrl: PREFIX + ":playmegogo:" + url,
	      sources: [{
		url: sign.src
	      }]
	    });
	    page.loading = false;
	  }
	        
      
      //trying to implement a delay function to prevent server overload when fast scrolling
	//returns value of time before next request can be made, or zero if the request can be made immediately
	function countDelay(delay,lastRequest) {
	  //showtime.print('Getting difference between:'+lastRequest+" and "+showtime.time());
	  var timeDiff = getTimeDifference(lastRequest,showtime.time())*1000;
	  //showtime.print("time sinse last call:"+timeDiff);
	  if(timeDiff<delay) {
	    //wait for the delay time to end
	    return delay-timeDiff;
	  }
	  else {
	   return 0; 
	  }
	  
	}
	
	   function getTimeDifference(startUnix,endUnix) {
  return endUnix-startUnix; //in milliseconds
}
    
	  
	  plugin.addURI(PREFIX + ":start", startPage);
	  
	  plugin.addURI(PREFIX + ":cat:(.*)", categoriesPage);
	  
	  plugin.addURI(PREFIX + ":list:(.*)", listPage);
	  
	  plugin.addURI(PREFIX + ":item:(.*)", itemPage);
	  
	  plugin.addURI(PREFIX + ":play:(.*):(.*):(.*)", playPage);
	  
	  // Play megogo links
	  plugin.addURI(PREFIX + ":playmegogo:(.*)", playMegogoPage);
	
	  
	  plugin.addSearcher("ex.ua", logo,
			     
			     function(page, query) {
			       try {
				 page.entries = 0;
				 var tryToSearch = true;
				 var url = BASE_URL + "/search?s=" + query.replace(/\s/g, '\+');
				 //1-link 2-title 3-additional info
				 var re = /<tr><td><a href='([^']+)'><img src='[\S\s]*?<b>([\S\s]*?)<\/b><\/a>([\S\s]*?)<\/td>/g;
				 var re2 = /class=info>([^<]+)/;
				 var re3 = /<small>([\S\s]*?)<\/small>[\S\s]*?<small>([\S\s]*?)<\/small>/;
				 var re4 = /alt='перейти на следующую страницу[\S\s]*?<a href='([^']+)/;
				 function loader() {
				   if (!tryToSearch) return false;
				   var response = showtime.httpGet(url, "", {
				     'Cookie': 'ulang=' + service.lang
				   });
				   var match = re.exec(response);
				   while (match) {
				     var title = "";
				     if (re2.exec(match[3])) title += re2.exec(match[3])[1];
				     if (re3.exec(match[3])) {
				       if (title) title += ", ";
				       title += re3.exec(match[3])[2];
				     }
				     
				     page.appendItem(PREFIX + ":item:" + match[1], "directory", {
				       title: new showtime.RichText(match[2] + (title ? ('<font color="6699CC"> (' + (title) + ')</font>') : "")),
						     icon: logo
				   });
				     page.entries++;
				     match = re.exec(response);
				 };
				 url = re4.exec(response);
				 if (!url) return tryToSearch = false;
				 url = BASE_URL + url[1];
				 return true;
			       };
			       loader();
			       page.paginator = loader;
			     } catch (err) {
			       showtime.trace('EX.UA - Search error: ' + err)
			     }
			     });
			     })(this);
			     