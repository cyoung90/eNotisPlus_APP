$(document).ready(function(){
	$(".closed-menu").on("click", function(){
		alert("서비스 준비중입니다.");
		return false;
	})
	
/* 		var dialog = document.querySelector('dialog');
	    var showModalButton = document.querySelector('.show-modal');
	    if (!dialog.showModal) {
			dialogPolyfill.registerDialog(dialog);
	    }
	    showModalButton.addEventListener('click', function() {
			dialog.showModal();
	    });
	    dialog.querySelector('.close').addEventListener('click', function() {
			dialog.close();
	    });
	    dialog.querySelector('#btn_logout').addEventListener('click', function() {
	    	logoutProcess();
	    });
		 */
	$("#btn_logout").click(function(){
		 logoutProcess();
	});
	 
	var user = JSON.parse( localStorage.user );
	var userMail = user.MAIL;
		
	$("#userName").text( user.NAME );
	$("#tooltip-userId").text( userMail );
	
	if ( userMail.length >= 20 ){
		userMail = userMail.substr(0, 20) + "...";
	}
	
	$("#userId").text( userMail );
});

// 로그아웃, 로컬저장소 초기화
function logoutProcess(){
	localStorage.clear();
	var comSubmit = new ComSubmit();
	comSubmit.setUrl("/");
	comSubmit.submit();
}