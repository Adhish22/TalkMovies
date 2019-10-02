var s ="";

while (s!= "rocknroll")
{
s=prompt("Please Enter Your Password");
if (s=="rocknroll")
{
    res.redirect("/compose")
// window.location.href="compose.ejs"; //page to redirect if password entered is correct
}
else
{
alert("Incorrect password-Try again");
}
}