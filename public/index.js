$(function(){

    let categoryInput = $('#CategoryInput');
    let titleInput = $('#ArticleTitle')
    let articleInput = $('#ArticleInput');
    let authorInput =$('#AuthorInput');
    let submitButton = $('#submitButton');
    let pwdInput = $('#pwd');
    submitButton.click(function (e) {
        e.preventDefault();
        console.log("clicked");

        let requestObject = {};
        requestObject.articleObject = {};

        requestObject.articleObject.category = categoryInput.val();
        requestObject.articleObject.article = articleInput.val();
        requestObject.articleObject.title = titleInput.val();
        requestObject.articleObject.author = authorInput.val();
        requestObject.pwd = pwdInput.val();

        let request= JSON.stringify(requestObject);
        console.log(request);

        $.ajax('/api/articles',{
            type: 'POST',
            data: request,
            dataType: 'json',
            contentType: 'application/json',
            success: function(result) {
                $('#PostSuccess').toggleClass('hidden');
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000)
            },
            error: function (result) {
                $('#BadRequest').toggleClass('hidden');
                setTimeout(function () {
                    window.location.reload(true);
                }, 1000)

            }
        });

    })

});
