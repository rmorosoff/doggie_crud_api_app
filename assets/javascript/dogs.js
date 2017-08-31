(function() {

  //jQuery equivelent to window.onload = function{}
  //code in here wont run until page loads
  $(function() {

    // global URL variable for use during updateForm functionality
    let passURL;

    // function to build the hero table from object received from dog API
    function buildTable(dogsObject) {
      //  hide form anytime we build the table
      $("#updateForm").hide();
      //Build an array containing dog records.
      var dogsArray = dogsObject;
      console.log(dogsArray[0]);

      //  Initialize dogRows and add header row
      let dogRows = `
        <thead>
          <th>Update</th>
          <th>Dog Name</th>
          <th>Owner First Name</th>
          <th>Owner Last Name</th>
          <th>Owner Email</th>
          <th>Dog Breed</th>
          <th>Dog Birth Year</th>
          <th>Dog Gender</th>
          <th>Delete</th>
        </thead>`;


      //Add the data rows in for loop
      for (var i = 0; i < dogsArray.length; i++) {
        let dogRow = `
            <tr>
              <td>
                <button class="dogUpdate btn-info" data-dogid="${dogsArray[i].id}">Update Dog</button>
              </td>
              <td>
                <p>${dogsArray[i].dogName}</p>
              </td>
              <td>
                <p>${dogsArray[i].ownerFirstName}</p>
              </td>
              <td>
                <p>${dogsArray[i].ownerLastName}</p>
              </td>
              <td>
                <p>${dogsArray[i].ownerEmail}</p>
              </td>
              <td>
                <p>${dogsArray[i].dogBreed}</p>
              </td>
              <td>
                <p>${dogsArray[i].dogBirthYear}</p>
              </td>
              <td>
                <p>${dogsArray[i].dogGender}</p>
              </td>
              <td>
                <button class="dogByeBye btn-danger" data-dogid="${dogsArray[i].id}">Delete Dog</button>
              </td>
            </tr>`
        //  append new row to dogRows object
        dogRows += dogRow

      }

      //  select dogTable and populate with finished dogRows
      var dogTable = $("#dogTable");
      dogTable.html("");
      dogTable.html(dogRows);
      //  show table in case it was hidden during update dog
      $("#dogTable").show();
    };


    //  On Click event will respond to click on "dogByeBye" class in dogTable
    $("#dogTable").on("click", ".dogByeBye", function() {
      var confirmAnswer = confirm("Are you sure you want to delete this doggie?");
      if (confirmAnswer) {
        $.ajax({
          url: `http://localhost:1337/dog/${$(this).data("dogid")}`,
          type: 'DELETE',
          success: function(result) {
            alert("Record successfully deleted")
            //call the api to reload the table
            let newResult = initDogs();

            //use the done promise on result to build the table
            newResult.done(function(data) {
              buildTable(data);
            });
          },
          error: function(result) {
            alert("There was a problem deleting the record")
          }
        });
      }
    })

    //  On Click event will respond to click on "dogUpdate" class in dogTable
    $("#dogTable").on("click", ".dogUpdate", function() {
      var confirmAnswer = confirm("Are you sure you want to update this doggie?");
      if (confirmAnswer) {
        // set global URL variable for use during PUT API call
        passURL = `http://localhost:1337/dog/${$(this).data("dogid")}`;
        $.get(`http://localhost:1337/dog/${$(this).data("dogid")}`, function(data) {
            $.each(data, function(name, val) {
              // magic code I stole and don't completely understand, but it works
              // updates form with oject from get API call
              var $el = $('[name="' + name + '"]'),
                type = $el.attr('type');

              switch (type) {
                case 'checkbox':
                  $el.attr('checked', 'checked');
                  break;
                case 'radio':
                  $el.filter('[value="' + val + '"]').attr('checked', 'checked');
                  break;
                default:
                  $el.val(val);
              }
            });
          })
          .fail(function(req) {
            alert("no dogs for you")
          })
          //  toggle table to hide and form to show
          $("#dogTable").hide();
          $("#updateForm").show();
      }
    })

    //  On Click event will respond to click on "dogUpdate" class in dogTable
    $("#updateForm").on("click", "#updateButton", function() {
      var confirmAnswer = confirm("Are you sure you want to update this doggie?");
      if (confirmAnswer) {
        $.ajax({
          url: passURL,  // this is global URL variable we set when Update button was clicked
          type: 'PUT',
          data: $("#updateForm").serialize(),
          success: function(result) {
            alert("Record successfully updated")
            //call the api to reload the table
            let newResult = initDogs();

            //use the done promise on result to build the table
            newResult.done(function(data) {
              buildTable(data);
            });
          },
          error: function(result) {
            alert("There was a problem updating the record")
          }
        });
      }
    })

    //make initial ajax request and handle failure
    function initDogs() {
      //hit the api endpoint to get dogs
      return $.get("http://localhost:1337/dog");

    }

    $("#updateForm").hide();
    //call the api for the first time and store into variable called result
    let result = initDogs();

    //use the done promise on result to build the table
    result.done(function(data) {
      buildTable(data);
    });

  })

})();
