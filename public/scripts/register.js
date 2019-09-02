$(document).ready(function() {
    $("#register").click(function (e) {
        e.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();
        $.post(
            '/register', {
                username: username,
                password : password
            },
            function (data) {
                console.log(data);
                if (data !== "false") {
                    alert("User Registered Successfully")
                    $(location).attr('href','/home');
                } else if(data === "false"){
                    $("#exists").css('visibility', 'visible')
                }
            }
        )
    });
});