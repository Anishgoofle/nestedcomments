let commentsArr = [];
let addBtn = document.getElementById("add");
let commentContainer = document.querySelector(".comment-container");

const addComment = (comment, parentId) => {
  let newComment = new Comment(commentsArr.length, comment, parentId);

  commentsArr.push(newComment);
  if (parentId != null) {
    commentsArr[parentId].childrenIds.push(commentsArr.length - 1);
  }
  renderComments();
};

addBtn.addEventListener("click", () => {
  let inputVal = document.getElementById("comment");
  addComment(inputVal.value, null);
});

commentContainer.addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    let parts = e.target.id.split("-");
    let type = parts[0];
    let id = parts[parts.length - 1];
    let commentDiv = document.getElementById(`comment-${id}`);
    if (type === "reply") {
      let childDiv = document.createElement("div");
      childDiv.setAttribute("id", "child-wrapper");
      let inputEl = document.createElement("input");
      inputEl.setAttribute("type", "text");
      inputEl.setAttribute("id", `input-${id}`);

      let button = document.createElement("button");
      button.setAttribute("id", `childReply-${id}`);
      button.innerText = "Add";

      childDiv.appendChild(inputEl);
      childDiv.appendChild(button);

      let childListElemId = `childlist-${id}`;

      let childList = document.getElementById(childListElemId);
      if (!childList) {
        childList = document.createElement("div");
        childList.setAttribute("id", `childList-${id}`);
        childList.append(childDiv);
      } else {
        childList.appendChild(childDiv);
      }
      commentDiv.append(childList);
    } else {
      let comment = document.getElementById(`input-${id}`).value;
      let childDiv = document.getElementById("child-wrapper");
      if (childDiv) {
        childDiv.remove();
      }
      addComment(comment, id);
    }
  }
});

class Comment {
  constructor(id, comment, parentId) {
    this.id = id;
    this.comment = comment;
    this.childrenIds = [];
    this.parentId = parentId;
  }
}

function renderComment(comment) {
  let id = comment.id;
  let commentWrapper = document.getElementById(`comment-${id}`);
  if (!commentWrapper) {
    commentWrapper = document.createElement("div");
    commentWrapper.classList.add("comment-wrapper");
    commentWrapper.setAttribute("id", `comment-${id}`);
    let hLine = document.createElement("hr");
    let commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-content");
    commentDiv.innerHTML = comment.comment;

    let replyBtn = document.createElement("button");
    replyBtn.innerText = "Reply";
    replyBtn.classList.add("replybtn");
    replyBtn.setAttribute("id", `reply-${id}`);
    commentWrapper.appendChild(hLine);
    commentWrapper.appendChild(commentDiv);
    commentWrapper.appendChild(replyBtn);
  }

  if (comment?.childrenIds?.length) {
    comment.childrenIds.forEach((commentId) => {
      let childList = document.getElementById(`childList-${id}`);
      let childComments = renderComment(commentsArr[commentId]);
      childList.appendChild(childComments?.commentWrapper);
    });
  }
  return { commentWrapper };
}

function renderComments() {
  let rootComments = [];
  commentsArr.forEach((comment) => {
    if (comment.parentId == null) {
      rootComments.push(comment);
    }
  });

  let commentList = "";
  rootComments.forEach((comment) => {
    commentList = renderComment(comment);
  });

  commentContainer.appendChild(commentList.commentWrapper);
}
