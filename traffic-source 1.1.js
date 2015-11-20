(function(cookieName, domain){

    var traffic_source_COOKIE_TOKEN_SEPARATOR = ">>"; //separating between concatenated lead source
    var traffic_source_date_SEPARATOR = "|>";
    var NONE = "(none)";

    domain = domain || window.location.hostname;

    function getCookie(cookieName){
        var name = cookieName + "=";
        var cookieArray = document.cookie.split(';'); //break cookie into array
        for(var i = 0; i < cookieArray.length; i++){
          var cookie = cookieArray[i].replace(/^\s+|\s+$/g, ''); //replace all space with '' = delete it
          if (cookie.indexOf(name)==0){
             return cookie.substring(name.length,cookie.length); //
          }
        }
        return null;
    }


    /*
       Checks whether a certain parameter exist in the current browser URL. If it does, it returns its name. 
       It will receive "src" later in the main function
    */
    
    function getURLParameter(param){
        var pageURL = window.location.search.substring(1); //get the query string parameters without the "?"
        var URLVariables = pageURL.split('&'); //break the parameters and values attached together to an array
        for (var i = 0; i < URLVariables.length; i++) {
            var parameterName = URLVariables[i].split('='); //break the parameters from the values
            if (parameterName[0] == param) {
                return parameterName[1];
            }
        }
        return null;
    }

    /*
       Gets the first (latest) token from a cookie: THIS__ONE>>NOT__THIS__ONE>>AND__NOT__THIS__ONE
    */
    
    function getFirstTokenFromCookie(cookie){
        var result = "";
        var firstSeparatorIndex = cookie.indexOf(traffic_source_COOKIE_TOKEN_SEPARATOR);
        result = firstSeparatorIndex !== -1 ? cookie.substring(0, firstSeparatorIndex) : cookie; //if there is a separator, provide the newest value no the cookie  
        return result;
    }

    /*
       Set the cookie if it doesn't exist.
    */
    
    function setCookie(cookie, value){
        var expires = new Date();
        expires.setTime(expires.getTime() + 62208000000); //1000*60*60*24*30*24 (2 years)
        document.cookie = cookie + "=" + value + "; expires=" + expires.toGMTString() + "; domain=" + domain + "; path=/";
    }
    
    /*
       Boolean, whether or not it's not NULL or Empty
    */
    
    function isNotNullOrEmpty(string){
        return string !== null && string !== "";
    }
    
    /*
       Remove the protocol for the referral token
    */
    function removeProtocol(href) {
        return href.replace(/.*?:\/\//g, "");
    }

    // I also made some changes in the script to keep recurrence in writing cookie, I share here:

    //traffic_source = NONE;    
    var traffic_source = "";
    var traffic_organic = ""; 
    if(document.cookie.indexOf(cookieName) === -1) {
        var traffic_source ="";
        setCookie(cookieName, traffic_source);
    }

    var urlParamSRC = getURLParameter("src"); //take the SRC value
    var referrerHostName = removeProtocol(document.referrer);
    if(urlParamSRC) {  
        traffic_source = urlParamSRC;        
    }else if (!urlParamSRC && referrerHostName === "") {
        //console.log("directo");
        traffic_source = "direct/none";
    }else if (!urlParamSRC && referrerHostName !== "") {
        //console.log ("referral"); 
        if (referrerHostName.indexOf('mentalidadweb.')  >= 0) {
            traffic_source = "";
        } else if (referrerHostName.indexOf('google.')  >= 0) {            
            traffic_source = "google/organic";
        } else if (referrerHostName.indexOf('bing.')  >= 0) {            
            traffic_source = "bing/organic";
        } else if (referrerHostName.indexOf('yahoo.')  >= 0) {            
            traffic_source = "yahoo/organic";
        } else {
            console.log ("Referral");
            traffic_source = referrerHostName;
        } 

    }
    if (traffic_source) {
        newTrafficSourceCookie = traffic_source + ">>" + getCookie(cookieName);
        setCookie(cookieName, newTrafficSourceCookie);
    }   

    
 })("traffic_source", ".mentalidadweb.cl");
