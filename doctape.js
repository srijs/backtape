(function(){var t=this.DoctapeCore=function(){this.options={authPt:{protocol:"https",host:"my.doctape.com",port:null,base:"/oauth2"},resourcePt:{protocol:"https",host:"api.doctape.com",port:null,base:"/v1"},scope:[],client_id:null,client_secret:null},this._token={type:null,timeout:null,timestamp:null,access:null,refresh:null},this.env={emit:null,subscribe:null,unsubscribe:null,req:null}},o=t.prototype.setToken=function(t){this._token.type=t.token_type,this._token.timeout=t.expires_in,this._token.timestamp=t.timestamp||(new Date).getTime(),this._token.access=t.access_token,this._token.refresh=t.refresh_token},e=t.prototype.token=function(){return{token_type:this._token.type,expires_in:this._token.timeout,timestamp:this._token.timestamp,access_token:this._token.access,refresh_token:this._token.refresh}};t.prototype.setAuthPt=function(t){var o=t.match(/([a-z]+):\/\/([^:]+):?([0-9]+)?(\/.*)/);this.options.authPt.protocol=o[1]||null,this.options.authPt.host=o[2]||null,this.options.authPt.port=parseInt(o[3],10)||null,this.options.authPt.base=o[4]||null},t.prototype.authBase=function(){return this.options.authPt.protocol+"://"+this.options.authPt.host+(this.options.authPt.port?":"+this.options.authPt.port:"")},t.prototype.authPath=function(t,o){var e=t||"urn:ietf:wg:oauth:2.0:oob";return this.options.authPt.base+"?"+"response_type="+(o||"code")+"&"+"client_id="+encodeURIComponent(this.options.client_id)+"&"+"scope="+encodeURIComponent(this.options.scope.join(" "))+"&"+"redirect_uri="+e},t.prototype.setResourcePt=function(t){var o=t.match(/([a-z]+):\/\/([^:]+):?([0-9]+)?(\/.*)/);this.options.resourcePt.protocol=o[1]||null,this.options.resourcePt.host=o[2]||null,this.options.resourcePt.port=parseInt(o[3],10)||null,this.options.resourcePt.base=o[4]||null},t.prototype.resourcePt=function(){return this.options.resourcePt.protocol+"://"+this.options.resourcePt.host+(this.options.resourcePt.port?":"+this.options.resourcePt.port:"")+this.options.resourcePt.base};var n=function(t,o,e){var n,s=[];for(n in o)s.push(n+"="+encodeURIComponent(o[n]));this.env.req({method:"POST",protocol:this.options.authPt.protocol,host:this.options.authPt.host,port:this.options.authPt.port,path:this.options.authPt.base+t,headers:{"Content-Type":"application/x-www-form-urlencoded"},postData:s.join("&")},e)};t.prototype.getResource=function(t,o){var e=this;s.call(this,function(n){e.env.req({method:"GET",protocol:e.options.resourcePt.protocol,host:e.options.resourcePt.host,port:e.options.resourcePt.port,path:e.options.resourcePt.base+t,headers:{Authorization:"Bearer "+n}},o)})},t.prototype.postResource=function(t,o,e){var n=this;s.call(this,function(s){n.env.req({method:"POST",protocol:n.options.resourcePt.protocol,host:n.options.resourcePt.host,port:n.options.resourcePt.port,path:n.options.resourcePt.base+t,headers:{Authorization:"Bearer "+s,"Content-Type":"application/json; charset=UTF-8"},postData:JSON.stringify(o)},e)})},t.prototype.deleteResource=function(t,o){var e=this;s.call(this,function(n){e.env.req({method:"DELETE",protocol:e.options.resourcePt.protocol,host:e.options.resourcePt.host,port:e.options.resourcePt.port,path:e.options.resourcePt.base+t,headers:{Authorization:"Bearer "+n}},o)})},t.prototype.getValidAccessToken=function(){if(this._token.access&&this._token.timestamp+1e3*this._token.timeout>(new Date).getTime())return this._token.access;throw Error("Access Token Expired")};var s=t.prototype.withValidAccessToken=function(t){if(this._token.access&&this._token.timestamp+1e3*this._token.timeout>(new Date).getTime())return t(this._token.access);var o=this,e=function(){s.call(o,t),p.call(o,"auth.refresh",e)};u.call(this,"auth.refresh",e),r.call(this)},i=function(t){var n=this;return function(s,i){if(n._lock_refresh=void 0,!s){var r=JSON.parse(i);return r.error?c.call(n,"auth.fail",t+": "+JSON.stringify(r.error)):(o.call(n,r),c.call(n,"auth.refresh",e.call(n)))}return c.call(n,"auth.fail",t+": "+JSON.stringify(s))}};t.prototype.exchange=function(t){void 0===this._lock_refresh&&(this._lock_refresh=!0,n.call(this,"/token",{code:t,client_id:this.options.client_id,client_secret:this.options.client_secret,redirect_uri:"urn:ietf:wg:oauth:2.0:oob",grant_type:"authorization_code"},i.call(this,"error exchanging token")))};var r=t.prototype.refresh=function(){void 0===this._lock_refresh&&(this._lock_refresh=!0,n.call(this,"/token",{refresh_token:this._token.refresh,client_id:this.options.client_id,client_secret:this.options.client_secret,grant_type:"refresh_token"},i.call(this,"error refreshing token")))},c=t.prototype.emit=function(t,o){this.env.emit(t,o)},u=t.prototype.subscribe=function(t,o){this.env.subscribe(t,o)},p=t.prototype.unsubscribe=function(t,o){this.env.unsubscribe(t,o)}}).call(this),function(){var t=this.DoctapeCore,o=this.DoctapeSimple=function(o){if("object"!=typeof o||void 0===o.scope||void 0===o.appType||void 0===o.appId||void 0===o.callbackURL)throw"Incomplete Doctape Configuration!";if("server"!==o.appType&&"client"!==o.appType)throw"Invalid App Type!";var e=this.core=new t;e.options.scope=o.scope,e.options.client_id=o.appId,e.options.client_secret=o.appSecret||null,this.authBase=e.authBase(),this.authPath=e.authPath(o.callbackURL,"server"===o.appType?"code":"token"),this.authURL=this.authBase+this.authPath,this.resourceURL=e.resourcePt(),this.onauthfail=null};o.prototype.init=function(){var t=this;this.core.subscribe("auth.fail",function(){"function"==typeof t.onauthfail&&t.onauthfail()})},o.prototype.getValidAccessToken=function(){this.core.getValidAccessToken()},o.prototype.withValidAccessToken=function(t){this.core.withValidAccessToken(t)},o.prototype.useCode=function(t,o){var e=this,n=function(){e.core.unsubscribe("auth.refresh",n),"function"==typeof o&&o.call(e)};this.core.subscribe("auth.fail",function(){e.core.unsubscribe("auth.refresh",n)}),this.core.subscribe("auth.refresh",n),this.core.exchange(t)},o.prototype.useToken=function(t,o){this.core.setToken(t),o.call(this)};var e=function(t,o,e){var n=!0;return function(s,i){try{if(s)throw""+s;i=e(i)}catch(r){if(n=!1,"function"!=typeof o)throw r;o(r)}n&&("function"==typeof t?t(i):"function"==typeof o&&o(null,i))}},n=function(t,o){return e(t,o,function(t){if(json=JSON.parse(t),json.error)throw""+json.error;return json.result})},s=function(t,o){return e(t,o,function(t){return t})};o.prototype.getAccount=function(t,o){this.core.getResource("/account",n(t,o))},o.prototype.getAvatar=function(t,o,e){this.core.getResource("/account/avatar/"+t,s(o,e))},o.prototype.getDocumentList=function(t,o){this.core.getResource("/doc?include_meta=false",n(t,o))},o.prototype.getDocumentListWithMetadata=function(t,o){this.core.getResource("/doc?include_meta=true",n(t,o))},o.prototype.getDocumentInfo=function(t,o,e){this.core.getResource("/doc/"+t,n(o,e))},o.prototype.setDocumentInfo=function(t,o,e,s){this.core.postResource("/doc/"+t,o,n(e,s))},o.prototype.setDocumentTags=function(t,o,e,n){this.setDocumentInfo(t,{tags:o},e,n)},o.prototype.setDocumentName=function(t,o,e,n){this.setDocumentInfo(t,{name:o},e,n)},o.prototype.getDocumentOriginal=function(t,o,e){this.core.getResource("/doc/"+t+"/original",s(o,e))},o.prototype.getDocumentThumbnail=function(t,o,e){this.core.getResource("/doc/"+t+"/thumb_120.jpg",s(o,e))},o.prototype.getDocumentThumbnailLarge=function(t,o,e){this.core.getResource("/doc/"+t+"/thumb_320.jpg",s(o,e))},o.prototype.cloneDocument=function(t,o,e){this.core.postResource("/doc/"+t+"/clone",n(o,e))},o.prototype.setDocumentPublicState=function(t,o,e,s){this.core.postResource("/doc/"+t+"/public",{"public":o},n(e,s))},o.prototype.publishDocument=function(t,o,e){this.setDocumentPublicState(t,!0,o,e)},o.prototype.unpublishDocument=function(t,o,e){this.setDocumentPublicState(t,!1,o,e)},o.prototype.deleteDocument=function(t,o,e){this.core.deleteResource("/doc/"+t,n(o,e))},o.prototype.extractArchiveContents=function(t,o,e){this.core.postResource("/doc/"+t+"/extract",n(o,e))}}.call(this),window.Doctape=function(t){var o=new DoctapeSimple(t);o.prototype=DoctapeSimple,function(){var t={};this.emit=function(o,e){setTimeout(function(){var n,s;if(void 0!==t[o]&&(s=t[o].length)>0)for(n=0;s>n;n++)"function"==typeof t[o][n]&&t[o][n](e)},0)},this.subscribe=function(o,e){void 0===t[o]?t[o]=[e]:-1===t[o].indexOf(e)&&t[o].push(e)},this.unsubscribe=function(o,e){var n;void 0!==t[o]&&-1!==(n=t[o].indexOf(e))&&t[o].splice(n,1)}}.call(o.core.env),o.core.env.req=function(t,o){var e,n=t.headers||{},s=t.method||"GET",i=t.protocol+"://"+t.host+(t.port?":"+t.port:"")+t.path,r=new XMLHttpRequest;r.open(s,i);for(e in n)r.setRequestHeader(e,n[e]);r.onreadystatechange=function(){4===r.readyState&&(null!==r.responseText?o(null,r.responseText):o(r.statusText))},r.send()};var e=function(){var t,o,e={},n=window.location.hash.substr(1).split("&");for(t=0;n.length>t;t++)o=n[t].split("="),e[decodeURIComponent(o[0])]=decodeURIComponent(o[1]);return e};return o.run=function(t){var n=e();n.access_token===void 0&&n.error===void 0?window.location=o.authURL+"#state="+encodeURIComponent(n.state):o.useToken({token_type:"Bearer",expires_in:3600,access_token:n.access_token},t)},o.init(),o};