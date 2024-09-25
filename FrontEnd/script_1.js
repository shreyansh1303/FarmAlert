//making smooth navigation towards all the pages i.e single page website
function homescroll() {
    document.getElementById('home_section').scrollIntoView({ behavior: 'smooth' })
}
function potatoscroll() {
    // window.open("#potato_section")
    document.getElementById('potato_section').scrollIntoView({ behavior: 'smooth' });
}

function pepperscroll() {
    // window.open("#pepper_section")
    document.getElementById('pepper_section').scrollIntoView({ behavior: 'smooth' });
}


//drag and drop functionality to show image on website

const droparea = document.getElementById("drop_area");
const imgview = document.getElementById("img_view");
const inputfield = document.getElementById("input_field");

const droparea_2 = document.getElementById("drop_area_2");
const imgview_2 = document.getElementById("img_view_2");
const inputfield_2 = document.getElementById("input_field_2");


inputfield.addEventListener("change", ChangeArea);
inputfield_2.addEventListener("change", ChangeArea_2);



function ChangeArea() {
    const image = inputfield.files[0];
    let imglink = URL.createObjectURL(image);
    const uploadedImage = document.getElementById('uploaded_image');
    // const input_field_img = document.getElementById('input_field');

    uploadedImage.src = imglink;

    // Optional: Hide the text after image upload
    uploadedImage.nextElementSibling.style.display = 'none';
    uploadedImage.nextElementSibling.nextElementSibling.style.display = 'none';


    UploadImage(inputfield, "potato");
}

function ChangeArea_2() {
    const image = inputfield_2.files[0];
    let imglink = URL.createObjectURL(image);
    const uploadedImage = document.getElementById('uploaded_image_2');
    // const input_field_img_2 = document.getElementById('input_field_2');

    uploadedImage.src = imglink;

    // Optional: Hide the text after image upload
    uploadedImage.nextElementSibling.style.display = 'none';
    uploadedImage.nextElementSibling.nextElementSibling.style.display = 'none';

    UploadImage(inputfield_2, "pepper")
}

droparea.addEventListener("dragover", function (e) {
    e.preventDefault();
});

droparea.addEventListener("drop", function (e) {
    e.preventDefault();
    inputfield.files = e.dataTransfer.files;
    ChangeArea();
});


droparea_2.addEventListener("dragover", function (e) {
    e.preventDefault();
});

droparea_2.addEventListener("drop", function (e) {
    e.preventDefault();
    inputfield_2.files = e.dataTransfer.files;
    ChangeArea_2();
});


//sending data to the server

function UploadImage(input_field, type) {
    const formdata = new FormData();
    formdata.append("file", input_field.files[0]);
    formdata.append("plant_type", type);

    //send the form data to the API 
    fetch(
        "http://127.0.0.1:8000/prediction",
        {
            method: "POST",
            body: formdata
        }
    )
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            if (type === "potato") {
                document.querySelector('.potato_container').style.transform = 'translateX(100%)';
                displayResult('potato', data);
            } else if (type === "pepper") {
                document.querySelector('.pepper_container').style.transform = 'translateX(100%)';
                displayResult('pepper', data);
            }
        })
        .catch((error) => {
            console.error("Error:", error)
            displayerror(error);
        })
}


function displayResult(type, data) {
    let resultContainer;
    if (type === "potato") {
        resultContainer = document.getElementById('potato_result');
        document.getElementById('potato_type').innerText = `Type: ${data.Type}`;
        document.getElementById('potato_result_text').innerText = `Result: ${data.Result}`;
        document.getElementById('potato_accuracy').innerText = `Accuracy: ${data.Accuracy}%`;
    } else if (type === "pepper") {
        resultContainer = document.getElementById('pepper_result');
        document.getElementById('pepper_type').innerText = `Type: ${data.Type}`;
        document.getElementById('pepper_result_text').innerText = `Result: ${data.Result}`;
        document.getElementById('pepper_accuracy').innerText = `Accuracy: ${data.Accuracy}%`;
    }

    // Adjusted delay to display the result after the container slides out
    setTimeout(() => {
        resultContainer.style.display = 'block';
        resultContainer.style.transform = 'translateX(0)';
    }, 500);

    // Reset the container position after the result is displayed
    setTimeout(() => {
        if (type === "potato") {
            document.querySelector('.potato_container').style.transform = 'translateX(0)';
        } else if (type === "pepper") {
            document.querySelector('.pepper_container').style.transform = 'translateX(0)';
        }
    }, 1000);
}



function displayerror(error) {
    let resultContainer = document.getElementById("potato_result");
    document.getElementById('potato_type').innerText = "Error Occurred at Server";
    document.getElementById('potato_result_text').innerText = error;
    document.getElementById('potato_accuracy').innerText = "Try after some time";

    setTimeout(() => {
        resultContainer.style.display = 'block';
        resultContainer.style.transform = 'translateX(0)';
    }, 500);

    // Reset the container position after the result is displayed
    setTimeout(() => {
        if (type === "potato") {
            document.querySelector('.potato_container').style.transform = 'translateX(0)';
        } else if (type === "pepper") {
            document.querySelector('.pepper_container').style.transform = 'translateX(0)';
        }
    }, 1000);
}