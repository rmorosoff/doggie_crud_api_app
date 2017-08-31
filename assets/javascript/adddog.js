(function() {

  //jQuery equivelent to window.onload = function{}
  //code in here wont run until page loads
  $(function() {

    // on the click of add button, serialize the form and issue a post
    $("#addButton").on("click", function(event) {
      event.preventDefault();
      $.post("http://localhost:1337/dog", $("#dogForm").serialize(), function(){
        alert("Dog added successfully!!");
        // clear out form fields for new add
        $("#dogForm")[0].reset();
      });
    });

  })

})();
