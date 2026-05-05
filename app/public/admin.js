document.getElementsByTagName("button")[0].addEventListener("click",()=>{
    document.cookie = "jwt1=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; "
    document.location.href = "/"

})