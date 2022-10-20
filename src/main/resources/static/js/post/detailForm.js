'use strict';
const $post = document.querySelector('.post-wrap');
const category = ($post?.dataset.code)? $post.dataset.code : '';

//답글
const $replyBtn = document.getElementById('replyBtn');
$replyBtn?.addEventListener('click',e=>{
  const url = `/post/${postId.value}/reply?category=${category}`;
  location.href = url;
});
//수정
const $editBtn = document.getElementById('editBtn');
$editBtn?.addEventListener('click',e=>{
  const url = `/post/${postId.value}/edit?category=${category}`;
  location.href = url;
});
//삭제
const $delBtn = document.getElementById('delBtn');
$delBtn?.addEventListener('click',e=>{
  if(confirm('삭제하시겠습니까?')){
    const url = `/post/${postId.value}/del?category=${category}`;
    location.href = url;
  }
});
//목록
const $listBtn = document.getElementById('listBtn');
$listBtn?.addEventListener('click',e=>{
  const url = `/post/list?category=${category}`;
  console.log('url='+url);
  location.href=url;
});

//전역변수
const reply = {
  postId:document.getElementById('postId'),
  pcategory:document.getElementById('pcategory'),
  email:document.getElementById('email'),
  nickname:document.getElementById('nickname'),
  rcontent:document.getElementById('rcontent'),
}

//입력데이터 가져오기
function getReplyData(){
  const postId = reply.postId.value;
  const pcategory = reply.pcategory.value;
  const email = reply.email.value;
  const nickname = reply.nickname.value;
  const rcontent = reply.rcontent.value;
  //변수이름을 property key, 변수값을 property value
  return {postId, pcategory, email, nickname, rcontent};
}

findAll();  //댓글 목록 표시

replyList.addEventListener('click', e=>{
  const $email = document.getElementById('email');

  // console.log(e.target);
  // console.log($email.value);
  // console.log(e.target.dataset.ownerEmail);
  // console.log(e.target.dataset.replyId);

  if(e.target.dataset.ownerEmail == $email.value) {
    console.log("내 댓글!");
    if(e.target.readOnly == true) {
      e.target.readOnly=false;
    } 
  }
  if(e.target.dataset.buttonName == 'editReplyBtn') {
    const rcontent = e.target.closest('div').previousSibling.previousSibling.value;
    const rid = e.target.closest('div').previousSibling.previousSibling.dataset.replyId;
    update(rid, rcontent);
  }
  if(e.target.dataset.buttonName == 'delReplyBtn') {
    const rid = e.target.closest('div').previousSibling.previousSibling.dataset.replyId;
    deleteById(rid);
  }
});
//등록 클릭시
addReplyBtn.addEventListener('click', e => {
  console.log("등록 클릭!");
  addReply(getReplyData());
  // console.log(reply.postId, reply.pcategory, reply.nickname, reply.email, reply.rcontent);
});

//등록
function addReply(reply){
const url = 'http://localhost:9080/api/reply';
fetch( url,{            //url
  method:'POST',        //http method
  headers:{             //http header
    'Content-Type':'application/json',
    'Accept':'application/json'
  },
  body: JSON.stringify(reply)   //http body      // js객체 => json포맷의 문자열
}).then(res=>res.json())
  .then(data=>{
    console.log(data);
     findAll();
     clearForm();
    })
  .catch(err=>console.log(err));
}
//목록
function findAll(){
  const $email = document.getElementById('email');
  // console.log($email.value);
  const pid = reply.postId.value;
  const url = `http://localhost:9080/api/reply/list/${pid}`;
  fetch( url,{            //url
    method:'GET',        //http method
    headers:{             //http header
      'Accept':'application/json'
    }
  }).then(res=>res.json())
    .then(res =>{
        const result =
          res.data.map(reply =>{
            if(reply.email == $email.value) {

                return `<div class="myreply_contents"><div class="reply_writer"><span>${reply.nickname}</span><span>${reply.email}</span></div>
                        <div class="myreply_text"><textarea readonly data-owner-email="${reply.email}" data-reply-id="${reply.replyId}">${reply.rcontent}</textarea>
                        <div class="reply_in_button" style="display: flex;"><button data-button-name="editReplyBtn" type="button" class="editReplyBtn">수정</button>
                        <button data-button-name="delReplyBtn" type="button" class="delReplyBtn">삭제</button></div></div></div>`;
              }else {
                return `<div class="reply_contents"><div class="reply_writer"><span>${reply.nickname}</span><span>${reply.email}</span></div>
                        <div class="reply_text"><textarea readonly data-owner-email="${reply.email}" data-reply-id="${reply.replyId}">${reply.rcontent}</textarea></div></div>`
              }
            });
        document.getElementById('replyList').innerHTML=result.join('');
  })
  .catch(err=>console.log(err));
}

//수정
function update(id, content){
  console.log(id);
  console.log(content);

  const url = `http://localhost:9080/api/reply/${id}`;
  fetch( url,{            //url
    method:'PATCH',        //http method
    headers:{             //http header
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    // body: JSON.stringify(product)  //http body
    body: content
  }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      findAll();
  })
  .catch(err=>console.log(err));
}

//삭제
function deleteById(id){
  
  console.log(id);
  if(!confirm('삭제하시겠습니까?')) return;

  const url = `http://localhost:9080/api/reply/${id}`;
  fetch( url,{            //url
  method:'DELETE',        //http method
  headers:{             //http header
    'Accept':'application/json'
  },
  }).then(res=>res.json())
  .then(data=>{
    console.log(data);
    findAll();
  })
  .catch(err=>console.log(err));
}
//필드 clear
function clearForm(){

  reply.rcontent.value = '';
}