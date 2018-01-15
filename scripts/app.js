(function() {
	// ECMAScript5부터 적용되는 키워드. 쉽게말해 안전한 코딩을 위한 가이드라인
	// 안 좋은 자바스크립트 코딩패턴들을 코칭해주는 자바스크립트 문법 검사기
	// 최상위에 사용, IE10 이전 버전 미지원
	'use strict';

	var app = {
//		isLoading: true,
//		visibleCards: {},
//		selectedCities: [],
//		spinner: document.querySelector('.loader'),
//		cardTemplate: document.querySelector('.cardTemplate'),
//		container: document.querySelector('.main'),
//		addDialog: document.querySelector('.dialog-container'),
		autoLogin: false,
		user: {"id":"32089829","mail":"chayoung_choi@daekyo.co.kr"},
		daysOfWeek: ['월', '화', '수', '목', '금', '토', '일']
	};


/*******************************************************************************
 * 
 * Event listeners for UI elements
 * 
 ******************************************************************************/
	$(document).ready(function(){
		
console.log("# 1-1 localStorage.autoLogin >>>>>>>>>>>>>>>>>>>>>>>>", localStorage);
		
		// 자동로그인
		if ( localStorage.autoLogin == 'true' ){
			var user = JSON.parse( localStorage.user );
			$("[for='chkMemID']").addClass("is-checked");
console.log("# 1-2 >>>>>>>>>>>>>>>>>>>>>>>>", user);
			
			if ( !gfn_isNull(user.NFUID) ) {
console.log("# 1-3 >>>>>>>>>>>>>>>>>>>>>>>>", user.NFUID);
				$("#id").val( user.NFUID );
				
				localStorage.loginInit = "auto";
				var comSubmit = new ComSubmit();
				comSubmit.setUrl("/eNotisPlus_APP/components/home/home.html");
				comSubmit.setMethod("GET");
				comSubmit.submit();
			}
		}
	});
	
	document.getElementById('btn_login').addEventListener('click', function() {
		
		// test 사번
		if ( $("#id").val() == 'e' ) {
			$("#id").val("8300120");
			$("#pw").val("init1234");
		}
		
		if ( gfn_isNull( $("#id").val().trim() )){
			alert("아이디가 입력되지 않았습니다.");
			$("#id").focus();
			return false;
		}
		
		if ( gfn_isNull( $("#pw").val().trim() )){
			alert("비밀번호가 입력되지 않았습니다.");
			$("#pw").focus();
			return false;
		}
		
		var id = document.getElementById('id').value;
		var pw = document.getElementById('pw').value;
		
		app.loginProcess(id, pw);
		
	});
	
	$(".login_input").on("keydown", function(event){
		if (event.keyCode == 13){
			document.getElementById('btn_login').click();
		}				
	});
	
	/*******************************************************************************
	 * 
	 * Push Manager
	 * 
	 ******************************************************************************/
		
		const applicationServerPublicKey = 'BF9HN4YgIVscJpOsvRmCygQ1HoIEMS68EpYrBj9bIqzUUBhIa75GpIRkJbtlzMYJnzJcOec5MxfPDG-BZqhlvas';

		const pushButton = document.querySelector('.js-push-btn');

		let isSubscribed = false;
		let swRegistration = null;

		function urlB64ToUint8Array(base64String) {
		  const padding = '='.repeat((4 - base64String.length % 4) % 4);
		  const base64 = (base64String + padding)
		    .replace(/\-/g, '+')
		    .replace(/_/g, '/');

		  const rawData = window.atob(base64);
		  const outputArray = new Uint8Array(rawData.length);

		  for (let i = 0; i < rawData.length; ++i) {
		    outputArray[i] = rawData.charCodeAt(i);
		  }
		  return outputArray;
		}

		// 01. 상태 초기화
		function initialiseUI() {
		  pushButton.addEventListener('click', function() {
	console.log("initialiseUI : isSubscribed", isSubscribed);
		    pushButton.disabled = true;
		    if (isSubscribed) {
			  unsubscribeUser();
		    } else {
		      subscribeUser();
		    }
		  });

		  // Set the initial subscription value
		  swRegistration.pushManager.getSubscription()
		  .then(function(subscription) {
		    isSubscribed = !(subscription === null);

		    updateSubscriptionOnServer(subscription);

		    if (isSubscribed) {
		      console.log('User IS subscribed.');
		    } else {
		      console.log('User is NOT subscribed.');
		    }

		    updateBtn();
		  });
		}

		// 02. 업데이트 버튼
		function updateBtn() {
		  if (Notification.permission === 'denied') {
		    pushButton.textContent = 'Push Messaging Blocked.';
		    pushButton.disabled = true;
		    updateSubscriptionOnServer(null);
		    return;
		  }

		  if (isSubscribed) {
		    pushButton.textContent = 'Disable Push Messaging';
		  } else {
		    pushButton.textContent = 'Enable Push Messaging';
		  }

		  pushButton.disabled = false;
		}

//		// 03. 서비스 워커 등록 시 상태 초기화
//		navigator.serviceWorker.register('sw.js')
//		.then(function(swReg) {
//		  console.log('Service Worker is registered', swReg);
	//
//		  swRegistration = swReg;
//		  initialiseUI();
//		})

		// 04. 구독자
		function subscribeUser() {
		  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
		  swRegistration.pushManager.subscribe({
		    userVisibleOnly: true,
		    applicationServerKey: applicationServerKey
		  })
		  .then(function(subscription) {
		    updateSubscriptionOnServer(subscription);

		    isSubscribed = true;

		    updateBtn();
		  })
		  .catch(function(err) {
		    console.log('Failed to subscribe the user: ', err);
		    updateBtn();
		  });
		}

		// 05. 비구독자
		function unsubscribeUser() {
		  swRegistration.pushManager.getSubscription()
		  .then(function(subscription) {
		    if (subscription) {
		      return subscription.unsubscribe();
		    }
		  })
		  .catch(function(error) {
		    console.log('Error unsubscribing', error);
		  })
		  .then(function() {
		    updateSubscriptionOnServer(null);

		    console.log('User is unsubscribed.');
		    isSubscribed = false;

		    updateBtn();
		  });
		}

		// 06. UI에 구독을 출력
		function updateSubscriptionOnServer(subscription) {
		  // TODO: Send subscription to application server

		  const subscriptionJson = document.querySelector('.js-subscription-json');
		  const subscriptionDetails = document.querySelector('.js-subscription-details');

		  if (subscription) {
		    subscriptionJson.textContent = JSON.stringify(subscription);
		    console.log(JSON.stringify(subscription));
		    $(".js-subscription-details").show();
		  } else {
			$(".js-subscription-details").hide();
		  }
		}
		
	
	
	


/*******************************************************************************
 * 
 * Methods to update/refresh the UI
 * 
 ******************************************************************************/
	app.saveUserInfo = function(data) {
console.log("#2-1 app.saveUserInfo");
		var lastUpdateDt = new Date();
		data.LAST_LOGIN_DT = lastUpdateDt;
		
		var user = JSON.stringify(data);
		var autoLogin = document.getElementById("chkMemID").checked;
		
		// 로컬에 저장
	    localStorage.user = user;	
	    localStorage.autoLogin = autoLogin;
	}

/*******************************************************************************
 * 
 * Methods for dealing with the model
 * 
 ******************************************************************************/
	// 로그인
	app.loginProcess = function(id, pw) {

		//var url = 'https://beacon.daekyo.com:8443/eNotisPlus/main/loginProcess.do?id=' + id + '&pw=' + pw;
		//var url = 'http://localhost/main/loginProcess.do?id=' + id + '&pw=' + pw;
		var url = 'https://192.168.56.188:8443/main/loginProcess.do?id=' + id + '&pw=' + pw;
console.log("#3-1 app.loginProcess");
		if ( 'caches' in window ) {
console.log("#3-2 'caches' in window");
console.log("#3-3 'caches match'", caches, url);

			caches.match(url).then(function(response) {
				if (response) {
					response.json().then(function updateFromCache(json) {
						var results = json;
						var msg = results.msg;
						var resultCd = results.resultCd;
						
						console.log(results);
						if (resultCd == "200") {
							var userInfo = results.userInfo;
							app.saveUserInfo(userInfo);
							localStorage.loginInit = "init";
							app.moveComponent("/eNotisPlus_APP/components/home/home.html");
						}
						
						console.log("caches");
					});
				}
			});
		}
		// Fetch the latest data.
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
console.log("#4-1 request.onreadystatechange");
			//if (request.readyState === XMLHttpRequest.DONE) {
console.log("#4-2 request.readyState");
				if (request.status === 200) {
					var response = JSON.parse(request.response);
					
					var results = response;
					var msg = results.msg;
					var resultCd = results.resultCd;
					
					if (resultCd == "200") {
						var userInfo = results.userInfo;
						app.saveUserInfo(userInfo);
						localStorage.loginInit = "init";
						app.moveComponent("/eNotisPlus_APP/components/home/home.html");
					} else {
						alert(msg);
					}
					
					console.log("XMLHttpRequest");
				}
	/*		} else {
				// Return the initial weather forecast since no data is available.
				//app.updateForecastCard(initialWeatherForecast);
			}*/
		};
//		var comSubmit = new ComSubmit();
//		comSubmit.addParam("id", $("#id").val());
//		comSubmit.addParam("pw", $("#pw").val());
//		
//		var formData = $("#commonForm").serialize();
//		console.log(formData);
		
		request.open('GET', url, true);
		request.send();
//		request.open('POST', 'http://' + host + '/main/loginProcess.do');
//		request.send(formData);
	};
	
	app.updateForecasts = function() {
		var keys = Object.keys(app.visibleCards);
			keys.forEach(function(key) {
			app.getForecast(key);
		});
	};

	var initUser = {
			NFUID: '8300120',
			NAME: '최차영',
			MAIL: 'chayoung_choi@daekyo.co.kr',
			LAST_LOGIN_DT: '20171107180000'
	}

	// 화면 이동
	app.moveComponent = function(url){
		var comSubmit = new ComSubmit();
		comSubmit.setMethod("GET");
		comSubmit.setUrl(url);
		comSubmit.submit();
	}
/*******************************************************************************
 * 
 * Code required to start the app
 * 
 * NOTE: To simplify this codelab, we've used localStorage. localStorage is a
 * synchronous API and has serious performance implications. It should not be
 * used in production applications! Instead, check out IDB
 * (https://www.npmjs.com/package/idb) or SimpleDB
 * (https://gist.github.com/inexorabletash/c8069c042b734519680c)
 ******************************************************************************/

	app.user = localStorage.user;
	app.autoLogin = localStorage.autoLogin;
	if (app.user) {
	    app.user = JSON.parse(app.user);
	} else {
		
	}

	// TODO add service worker code here
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
				 .register('./service-worker.js')
				 .then(function(registration) { 
					 	console.log('ServiceWorker registration successful with scope:',  registration.scope);
					 	
					 	swRegistration = registration;
					 	initialiseUI();
					 	
				 }).catch(function(error) {
						console.log('ServiceWorker registration failed:', error);
				 });
	}
})();
