//localStorage工具类  还未完善..
var Storage=function(){
	if(!window.localStorage){
		alert("您的浏览器不支持本地存储");
	}
	//定义私有属性
	this.storage=window.localStorage;
	//60 * 60 * 24 * 30 * 1000 ms ==30天
	this.ltime="2592000000";
	//存放localStorage 键名，过期时间
	this.keyCache="KEY_TIMEOUT"
}

Storage.prototype.set = function(key,value,timeout) {
	//获取当前时间
	 var _time=new Date(),
	 	inTime=_time.getTime(),
		//需要保存的数据
		saveData=null;
	 	//如果不传递时间，则默认时间加上当前时间
	 	if(!timeout){
	 		_time.setTime(inTime+this.ltime);
			timeout=_time.getTime();
	 	}

	 	this.setKeyCache(key,timeout);
	 	//设置value的缓存数据
	 	saveData=this.buildCache(value,inTime,timeout);
	// 	//保存value
		this.storage.setItem(key,JSON.stringify(saveData));
}

Storage.prototype.setKeyCache=function (key,timeout) {
	//
	if(!key||!timeout||timeout<new Date().getTime()) return;
	var i,length,tempObj;
	//获取当前缓存数据
	var oldStr=this.storage.getItem(this.keyCache);
	var oldMap=[];
	var obj={};
	var flag=false;
	obj.key=key;
	obj.timeout=timeout;

	if(oldStr){
		oldMap=JSON.parse(oldStr);
		if(toString.apply(oldMap)!="[object Array]") oldMap=[];
	}

	for(i=0,length=oldMap.length;i<length;i++){
			tempObj=oldMap[i];
			if(tempObj.key==key){
				oldMap[i]=obj;
				flag=true;
				break;
			}
			console.log(oldMap[i]);
	}
	if(!flag){oldMap.push(obj)}

	this.storage.setItem(this.keyCache,JSON.stringify(oldMap));
}
//获取localStorage值
Storage.prototype.get=function(key){
	var result,nowTime=new Date().getTime();
	result=this.storage.getItem(key);

	if(!result){
		return null;
	}else{
		return JSON.parse(result);
	}
}
//删除localStorage 键值
Storage.prototype.remove=function(key){
	this.storage.removeItem(key);
}

//清空localStorage
Storage.prototype.clear=function(){
	this.storage.clear();
}

Storage.prototype.buildCache=function(value,inTime,timeout){
	var storageObj={
		value:value,
		saveTime:inTime,
		timeout:timeout
	};

	return storageObj;
};


Storage.getInstance=function(){
	if(this.storage){
		return this.storage;
	}else{
		return this.storage=new Storage();
	}
}
