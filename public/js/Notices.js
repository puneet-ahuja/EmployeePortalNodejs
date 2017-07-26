//Client Side file

$(document).ready(function(){

	//variables
	var $noticesArea;
	var noticeTemplate;
	var noticeArea;
	var $addButton;
	var $modal;
	var $inputTitle;
	var $textAreaDesc;
	var $modalTitle;
	var $btnSave;


	//variables declaration
	$noticesArea 	= $('#NoticesArea');
	noticeTemplate 	= document.getElementById('noticeTemplate');
	noticeArea 		= document.getElementById('NoticesArea');
	$addButton 		= $('#addButton');
	$modal 			= $('#EditModal');
	$inputTitle 	= $('#inputTitle');
	$textAreaDesc 	= $('#textAreaDesc');
	$modalTitle 	= $('#modalTitle');
	$btnSave		= $('#btnSave');


	function getNoticeData(){

		//AJAX call at localhost/notices of type get
		$.ajax({
			url:'/notices-sql',
			method : 'GET',
			success : getNoticeDataSH
		})

	}

	//AJAX call successHandler
	//After getting data from notices request
	function getNoticeDataSH(notices){

		//To remove all the elements from table except first row i.e for heading
		$noticesArea.find('tr:gt(0)').remove();


		//replacing data of notice template and replacing with data and appending data to table
		for(var index = 0 ; index < notices.length ; index++ ){
			var noticeRow = noticeTemplate.innerHTML.replace("{id}" , notices[index].id);
			noticeRow = noticeRow.replace("{title}" , notices[index].title);
			noticeRow = noticeRow.replace("{desc}" , notices[index].desc);
			noticeRow = noticeRow.replace("{notice-id}" , notices[index].id);
			noticeRow = noticeRow.replace("{notice-id}" , notices[index].id);

			$noticesArea.append(noticeRow);
		}
	}


	//Function to show modal when edit is clicked
	function editClickHandler(){
		//variables
		var noticeTitle;
		var noticeDesc;
		
		noticeTitle = $(this).closest('tr').find('[info=title]').html();
		noticeDesc 	= $(this).closest('tr').find('[info=desc]').html();


		$inputTitle.val(noticeTitle);
		$textAreaDesc.val(noticeDesc);

		$modal.attr('notice-id' , $(this).attr('notice-id'));



		$modalTitle.html('Edit Notice');
		$modal.modal('show');
	}


	function clearModal(){
		$inputTitle.val('');
		$textAreaDesc.val('');
	}

	function deleteClickHandler(){
		var noticeId = $(this).attr('notice-id');
		$.ajax({
			url : "/notices",
			method : "DELETE",
			data : {
				id : noticeId
			},
			success : deleteClickSH
		});
	}

	function deleteClickSH(){
		getNoticeData();
	}

	function saveClickHandler(){
		var notice = {};
		var method;
		var noticeId = parseInt($modal.attr('notice-id'));

		if(noticeId == -1){
			method = 'POST';
		}
		else{
			method = 'PUT';
		}
		notice.id 		= noticeId;
		notice.title 	= $inputTitle.val();
		notice.desc 	= $textAreaDesc.val();

		$.ajax({
			url		: '/notices',
			method 	: method,
			data 	: notice,
			success : saveClickSH
		});
		$modal.modal('hide');
	}

	function saveClickSH(){
		console.log("saved");
		getNoticeData();
	}



	function addButtonClickHandler(){
		clearModal();
		$modal.attr('notice-id' , -1 );



		$modalTitle.html('Add Notice');
		$modal.modal('show');
	}

	//Init function defination
	function init(){

		getNoticeData();
		$noticesArea.on('click' , 'span[purpose = edit]' , editClickHandler);
		$noticesArea.on('click' , 'span[purpose = delete]' , deleteClickHandler);
		$addButton.click(addButtonClickHandler);
		$btnSave.bind( 'click' , saveClickHandler);
		
	}

	//call to init function
	init();

});